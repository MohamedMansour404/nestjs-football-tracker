import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FootballService } from './football.service';
import { FootballController } from './football.controller';
import { MatchEntity } from './entities/match.entity';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    TypeOrmModule.forFeature([MatchEntity]),
  ],
  providers: [FootballService],
  controllers: [FootballController],
  exports: [FootballService],
})
export class FootballModule {}
