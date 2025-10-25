import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'matches' })
export class MatchEntity {
  @PrimaryColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', nullable: true })
  utcDate?: string | null;

  @Column({ type: 'varchar', nullable: true })
  status?: string | null;

  @Column({ type: 'int', nullable: true })
  matchday?: number | null;

  @Column({ type: 'int', nullable: true })
  competitionId?: number | null;

  @Column({ type: 'varchar', nullable: true })
  competitionName?: string | null;

  @Column({ type: 'int', nullable: true })
  areaId?: number | null;

  @Column({ type: 'varchar', nullable: true })
  areaName?: string | null;

  @Column({ type: 'int', nullable: true })
  homeTeamId?: number | null;

  @Column({ type: 'varchar', nullable: true })
  homeTeamName?: string | null;

  @Column({ type: 'int', nullable: true })
  awayTeamId?: number | null;

  @Column({ type: 'varchar', nullable: true })
  awayTeamName?: string | null;

  @Column({ type: 'int', nullable: true })
  scoreFullTimeHome?: number | null;

  @Column({ type: 'int', nullable: true })
  scoreFullTimeAway?: number | null;

  @Column({ type: 'int', nullable: true })
  scoreHalfTimeHome?: number | null;

  @Column({ type: 'int', nullable: true })
  scoreHalfTimeAway?: number | null;

  @Column({ type: 'jsonb', nullable: true })
  raw?: any;
}
