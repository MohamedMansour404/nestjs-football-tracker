import { Controller, Get, Query, Param, ParseIntPipe } from '@nestjs/common';
import { FootballService } from './football.service';

@Controller('football')
export class FootballController {
  constructor(private readonly footballService: FootballService) {}

  @Get('matches')
  async getMatches(
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return this.footballService.fetchMatches(dateFrom, dateTo);
  }

  @Get('matches/:id')
  async getMatchById(@Param('id', ParseIntPipe) id: number) {
    return this.footballService.fetchMatchById(id);
  }
}
