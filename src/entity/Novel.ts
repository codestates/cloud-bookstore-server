import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BaseEntity,
} from 'typeorm';

import NovelComment from './NovelComment';
import Episode from './Episode';

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
  episodeCount!: number;

  @Column()
  complete!: boolean;

  @Column()
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

  static async findMartialArts8(): Promise<Novel[] | void> {
    return await this.createQueryBuilder('novel')
      .where('novel.category = :category', { category: 2 })
      .orderBy('novel.cloud', 'DESC')
      .take(8)
      .getMany();
  }

  static async findRomance8(): Promise<Novel[] | void> {
    return await this.createQueryBuilder('novel')
      .where('novel.category = :category', { category: 3 })
      .orderBy('novel.cloud', 'DESC')
      .take(8)
      .getMany();
  }

  static async findByNovelId(novelId: number): Promise<Novel | void> {
    return await this.createQueryBuilder('novel')
      .where('novel.id = :id', { id: novelId })
      .getOne();
  }

  static async findByNovelIdTitleOnly(novelId: number): Promise<Novel | void> {
    return await this.createQueryBuilder('novel')
      .where('novel.id = :id', { id: novelId })
      .select('novel.title')
      .getOne();
  }

  static async findByNovelHis(novelId: number): Promise<Novel | void> {
    return await this.createQueryBuilder('novel')
      .where('novel.id = :id', { id: novelId })
      .select('novel.title')
      .addSelect('novel.thumbnail')
      .addSelect('novel.complete')
      .addSelect('novel.updatedAt')
      .getOne();
  }

  static async likeNovel(novelId: number): Promise<Novel | void> {
    await this.createQueryBuilder('novel')
      .update(Novel)
      .set({
        userLike: () => 'userLike + 1',
      })
      .where('novel.id = :id', {
        id: novelId,
      })
      .execute();
    return await this.createQueryBuilder('novel')
      .where('novel.id = :id', {
        id: novelId,
      })
      .select('novel.userLike')
      .getOne();
  }

  static async writeNovel(
    title: string,
    author: string,
    category: number,
    description: string,
    thumbnail: string,
  ) {
    return await this.createQueryBuilder('novel')
      .insert()
      .into(Novel)
      .values({ title, author, category, description, thumbnail })
      .execute();
  }

  static async findAllNovelsByUser(author: string): Promise<Novel[] | void> {
    return await this.createQueryBuilder('novel')
      .where('novel.author = :author', { author })
      .getMany();
  }

  static async countEpisode(novelId: number) {
    return await this.createQueryBuilder('novel')
      .update(Novel)
      .set({
        episodeCount: () => 'episodeCount + 1',
      })
      .where('novel.id = :id', { id: novelId })
      .execute();
  }

  static async editNickname(
    originalAuthorName: string,
    updatedAuthorName: string,
  ) {
    return await this.createQueryBuilder('novel')
      .update(Novel)
      .set({
        author: updatedAuthorName,
      })
      .where('novel.author = :author', {
        author: originalAuthorName,
      })
      .execute();
  }

  static async getCurrentNovel(title: string) {
    return await this.createQueryBuilder('novel')
      .where('novel.title = :title', { title })
      .getOne();
  }
}
