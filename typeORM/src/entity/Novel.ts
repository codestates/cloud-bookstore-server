import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { NovelComment } from './NovelComment';
import { Episode } from './Episode';

@Entity()
export class Novel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  author!: string;

  @Column()
  category!: number;

  @Column()
  description!: string;

  @Column()
  cloud!: number;

  @Column()
  userLike!: number;

  @Column()
  complete!: boolean;

  @Column({ type: 'longtext' })
  thumbnail!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany((type) => NovelComment, (novelComment) => novelComment.novel)
  novelComments!: NovelComment[];

  @OneToMany((type) => Episode, (episodes) => episodes.novel)
  episodes!: Episode[];
}
