import { Column, Entity } from 'typeorm';

@Entity()
export class Breed {
  @Column({ primary: true, generated: true })
  id: number;

  @Column()
  name: string;
}
