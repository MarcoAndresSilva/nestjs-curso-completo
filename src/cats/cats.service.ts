import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { Cat } from './entities/cat.entity';
import { Breed } from '../breeds/entities/breed.entity';
import { UserActiveInterface } from '../common/interfaces/user-activate.interface';

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(Cat)
    private catRepository: Repository<Cat>,
    @InjectRepository(Breed)
    private breedRepository: Repository<Breed>,
  ) {}

  async create(createCatDto: CreateCatDto, user: UserActiveInterface) {
    const breed = await this.breedRepository.findOneBy({
      name: createCatDto.breed,
    });
    if (!breed) {
      throw new BadRequestException('Breed not found');
    }

    return await this.catRepository.save({
      ...createCatDto,
      breed,
      userEmail: user.email,
    });
  }

  async findAll() {
    return await this.catRepository.find();
  }

  async findOne(id: number) {
    return await this.catRepository.findOneBy({ id });
  }

  async update(id: number, updateCatDto: UpdateCatDto) {
    const cat = await this.catRepository.findOneBy({ id });

    if (!cat) {
      throw new BadRequestException('Cat not found');
    }

    let breed;
    if (updateCatDto.breed) {
      breed = await this.breedRepository.findOneBy({
        name: updateCatDto.breed,
      });

      if (!breed) {
        throw new BadRequestException('Breed not found');
      }
    }

    return await this.catRepository.save({
      ...cat,
      ...updateCatDto,
      breed,
    });
  }

  async remove(id: number) {
    return await this.catRepository.softDelete(id); // se le pasa el id
    // return await this.catRepository.softRemove(id); // sel e pasa la instancia
  }
}
