import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatsService } from './cats.service';
import { CatsController } from './cats.controller';
import { Cat } from './entities/cat.entity';
import { BreedsService } from 'src/breeds/breeds.service';
import { BreedsModule } from 'src/breeds/breeds.module';

@Module({
  imports: [TypeOrmModule.forFeature([Cat]), BreedsModule],
  controllers: [CatsController],
  providers: [CatsService, BreedsService],
  exports: [],
})
export class CatsModule {}
