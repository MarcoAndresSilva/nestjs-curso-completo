import { Column, Entity, OneToMany } from 'typeorm';
import { Cat } from 'src/cats/entities/cat.entity';

@Entity()
export class Breed {
  @Column({ primary: true, generated: true })
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Cat, (cat) => cat.breed)
  cats: Cat[];
}
