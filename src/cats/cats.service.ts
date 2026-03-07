import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { Cat } from './entities/cat.entity';
import { Breed } from '../breeds/entities/breed.entity';
import { UserActiveInterface } from '../common/interfaces/user-activate.interface';
import { Role } from '../common/enums/rol.enums';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(Cat)
    private catRepository: Repository<Cat>,
    @InjectRepository(Breed)
    private breedRepository: Repository<Breed>,
  ) {}

  async create(createCatDto: CreateCatDto, user: UserActiveInterface) {
    const breed = await this.validateBreed(createCatDto.breed);
    return await this.catRepository.save({
      ...createCatDto,
      breed,
      userEmail: user.email,
    });
  }

  async findAll(user: UserActiveInterface) {
    console.log(user);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    if (user.role === Role.ADMIN) {
      return await this.catRepository.find();
    }
    return await this.catRepository.find({
      where: { userEmail: user.email },
    });
  }

  async findOne(id: number, user: UserActiveInterface) {
    const cat = await this.catRepository.findOneBy({ id });
    if (!cat) {
      throw new BadRequestException('Cat not found');
    }
    this.validateOwnerShip(cat, user);
    return cat;
  }

  async update(
    id: number,
    updateCatDto: UpdateCatDto,
    user: UserActiveInterface,
  ) {
    await this.findOne(id, user);
    return await this.catRepository.update(id, {
      ...updateCatDto,
      breed: updateCatDto.breed
        ? await this.validateBreed(updateCatDto.breed)
        : undefined,
      userEmail: user.email,
    });
  }

  async remove(id: number, user: UserActiveInterface) {
    await this.findOne(id, user);
    return await this.catRepository.softDelete(id);
  }

  private validateOwnerShip(cat: Cat, user: UserActiveInterface) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    if (user.role !== Role.ADMIN && cat.userEmail !== user.email) {
      throw new UnauthorizedException(
        'You are not authorized to view this cat, because you are not the owner',
      );
    }
  }

  private async validateBreed(breedName: string) {
    const breedEntity = await this.breedRepository.findOneBy({
      name: breedName,
    });
    if (!breedEntity) {
      throw new BadRequestException('Breed not found');
    }
    return breedEntity;
  }
}
