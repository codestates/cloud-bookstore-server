import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

import { User } from './User';
import { Episode } from './Episode';

@Entity()
export class Purchase {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @Column()
  episodeId!: number;

  @Column()
  thumbnail!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne((type) => User, (user) => user.purchases, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user!: User;

  @ManyToOne((type) => Episode, (episode) => episode.purchases, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  episode!: Episode;
}
