import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { Cat } from './entities/cat.entity';

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(Cat)
    private catRepository: Repository<Cat>,
  ) {}

  async create(createCatDto: CreateCatDto) {
    return await this.catRepository.save(createCatDto); //'This action adds a new cat';
  }

  async findAll() {
    return await this.catRepository.find();
  }

  async findOne(id: number) {
    return `This action returns a #${id} cat`;
  }

  async update(id: number, updateCatDto: UpdateCatDto) {
    return `This action updates a #${id} cat`;
  }

  async remove(id: number) {
    return `This action removes a #${id} cat`;
  }
}
