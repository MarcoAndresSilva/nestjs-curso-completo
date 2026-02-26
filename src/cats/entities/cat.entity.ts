import { IsEmail } from 'class-validator';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  //   PrimaryGeneratedColumn,
} from 'typeorm';
import { Breed } from 'src/breeds/entities/breed.entity';
import { User } from 'src/users/entities/user.entity';
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

  @ManyToMany(() => User)
  @JoinColumn({ name: 'userEmail', referencedColumnName: 'email' })
  users: User;

  @Column()
  userEmail: string;
}
