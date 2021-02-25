import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BaseEntity,
  TableForeignKey,
} from 'typeorm';

import NovelComment from './NovelComment';
import Episode from './Episode';
import { timingSafeEqual } from 'crypto';

@Entity()
export default class Novel extends BaseEntity {
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

  static async findByCategory(id: number): Promise<Novel[] | void> {
    return await this.createQueryBuilder('novel')
      .where('novel.category = :category', { category: id })
      .getMany();
  }

  static async findRanking8(): Promise<Novel[] | void> {
    return await this.createQueryBuilder('novel')
      .orderBy('novel.cloud', 'DESC')
      .take(8)
      .getMany();
  }

  static async findFantasy8(): Promise<Novel[] | void> {
    return await this.createQueryBuilder('novel')
      .where('novel.category = :category', { category: 1 })
      .orderBy('novel.cloud', 'DESC')
      .take(8)
      .getMany();
  }

  static async findMartialarts8(): Promise<Novel[] | void> {
    return await this.createQueryBuilder('novel')
      .where('novel.category = :category', { category: 2 })
      .orderBy('novel.cloud', 'DESC')
      .take(8)
      .getMany();
  }

  static async findRomanc8(): Promise<Novel[] | void> {
    return await this.createQueryBuilder('novel')
      .where('novel.category = :category', { category: 3 })
      .orderBy('novel.cloud', 'DESC')
      .take(8)
      .getMany();
  }
}
