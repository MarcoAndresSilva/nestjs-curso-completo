import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  //   PrimaryGeneratedColumn,
} from 'typeorm';
import { Breed } from 'src/breeds/entities/breed.entity';
@Entity()
export class Cat {
  //   @PrimaryGeneratedColumn()
  @Column({ primary: true, generated: true })
  id: number;

  @Column()
  name: string;

  @Column()
  age: number;

  @DeleteDateColumn()
  deleteAt: Date;

  @ManyToOne(() => Breed, (breed) => breed.id, {
    eager: true, // el eager para que traiga la raza al hacer un findOne
  })
  breed: Breed;
}
