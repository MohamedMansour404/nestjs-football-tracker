import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MatchEntity } from './entities/match.entity';
import { ConfigService } from '@nestjs/config';

export interface ApiMatch {
  id: number;
  utcDate: string;
  status: string;
  matchday: number;
  competition?: { id: number; name: string };
  area?: { id: number; name: string };
  homeTeam?: { id: number; name: string };
  awayTeam?: { id: number; name: string };
  score?: {
    fullTime?: { home: number; away: number };
    halfTime?: { home: number; away: number };
  };
}

@Injectable()
export class FootballService {
  private readonly logger = new Logger(FootballService.name);
  private readonly baseUrl = 'https://api.football-data.org/v4';

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
    @InjectRepository(MatchEntity)
    private readonly matchRepo: Repository<MatchEntity>,
  ) {}

  private getAuthHeaders(): Record<string, string> {
    const token = this.config.get<string>('FOOTBALL_API_TOKEN');
    if (!token) throw new Error('FOOTBALL_API_TOKEN is not set');
    return { 'X-Auth-Token': token };
  }

  private mapMatch(apiMatch: ApiMatch): Partial<MatchEntity> {
    return {
      id: apiMatch.id,
      utcDate: apiMatch.utcDate,
      status: apiMatch.status,
      matchday: apiMatch.matchday,
      competitionId: apiMatch.competition?.id ?? null,
      competitionName: apiMatch.competition?.name ?? null,
      areaId: apiMatch.area?.id ?? null,
      areaName: apiMatch.area?.name ?? null,
      homeTeamId: apiMatch.homeTeam?.id ?? null,
      homeTeamName: apiMatch.homeTeam?.name ?? null,
      awayTeamId: apiMatch.awayTeam?.id ?? null,
      awayTeamName: apiMatch.awayTeam?.name ?? null,
      scoreFullTimeHome: apiMatch.score?.fullTime?.home ?? null,
      scoreFullTimeAway: apiMatch.score?.fullTime?.away ?? null,
      scoreHalfTimeHome: apiMatch.score?.halfTime?.home ?? null,
      scoreHalfTimeAway: apiMatch.score?.halfTime?.away ?? null,
      raw: apiMatch,
    };
  }

  async fetchMatches(dateFrom?: string, dateTo?: string) {
    try {
      const params: Record<string, string> = {};
      if (dateFrom) params.dateFrom = dateFrom;
      if (dateTo) params.dateTo = dateTo;

      const url = `${this.baseUrl}/matches`;
      const response = await lastValueFrom(
        this.http.get(url, { headers: this.getAuthHeaders(), params }),
      );

      const data = response.data;
      if (!data?.matches) return [];

      const mapped = data.matches.map((m: ApiMatch) => this.mapMatch(m));

      await this.matchRepo.upsert(mapped, ['id']);

      this.logger.log(`Saved ${mapped.length} matches`);
      return mapped;
    } catch (err: any) {
      this.logger.error('fetchMatches error', err?.stack ?? err);
      throw new HttpException(
        'Failed to fetch matches',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async fetchMatchById(id: number) {
    try {
      const url = `${this.baseUrl}/matches/${id}`;
      const response = await lastValueFrom(
        this.http.get(url, { headers: this.getAuthHeaders() }),
      );

      const matchObj: ApiMatch = response.data?.match ?? response.data;
      const mapped = this.mapMatch(matchObj);

      await this.matchRepo.upsert([mapped], ['id']);

      return mapped;
    } catch (err: any) {
      this.logger.error('fetchMatchById error', err?.stack ?? err);
      if (err.response?.status === 404) {
        throw new HttpException('Match not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException('Failed to fetch match', HttpStatus.BAD_GATEWAY);
    }
  }
}
