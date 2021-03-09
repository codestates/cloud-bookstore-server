import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  BaseEntity,
} from 'typeorm';

import Purchase from './Purchase';
import Novel from './Novel';

@Entity()
export default class Episode extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  episodeNum!: number;

  @Column()
  novelId!: number;

  @Column()
  title!: string;

  @Column({ type: 'text' })
  text!: string;

  @Column()
  thumbnail!: string;

  @Column()
  cloud!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany((type) => Purchase, (purchase) => purchase.episode)
  purchases!: Purchase[];

  @ManyToOne((type) => Novel, (novel) => novel.episodes, {
    nullable: false,
    cascade: ['insert', 'update', 'remove'],
  })
  novel!: Novel;

  static async findByNovelId(novelId: number): Promise<Episode[]> {
    return await this.createQueryBuilder('episode')
      .where('episode.novelId = :novelId', { novelId })
      .getMany();
  }

  static async updateCloud(episodeId: number, novelId: number) {
    await this.createQueryBuilder('episode')
      .update(Episode)
      .set({
        cloud: () => 'cloud + 1',
      })
      .where('episode.id = :id', { id: episodeId })
      .andWhere('episode.novelId = :novelId', { novelId })
      .execute();
  }

  static async findByEpisodeId(episodeId: number, novelId: number) {
    return await this.createQueryBuilder('episode')
      .where('episode.id = :id', { id: episodeId })
      .andWhere('episode.novelId = :novelId', { novelId })
      .getOne();
  }

  static async getThumbnail(episodeId: number) {
    return await this.createQueryBuilder('episode')
      .where('episode.id = :id', { id: episodeId })
      .select('episode.thumbnail')
      .getRawOne();
  }

  static async writeEpisode(
    episodeNum: number,
    novelId: number,
    title: string,
    text: string,
    thumbnail: string,
  ) {
    return await this.createQueryBuilder('episode')
      .insert()
      .into(Episode)
      .values({ episodeNum, novelId, title, text, thumbnail })
      .execute();
  }

  static async findByEpisodeHis(episodeId: number) {
    return await this.createQueryBuilder('episode')
      .where('episode.id = :episodeId', { episodeId })
      .select('episode.id')
      .addSelect('episode.title')
      .addSelect('episode.episodeNum')
      .addSelect('episode.cloud')
      .addSelect('episode.thumbnail')
      .getOne();
  }

  static async deleteNovel(novelId: number) {
    return await this.createQueryBuilder('episode')
      .delete()
      .from(Episode)
      .where('novelId = :novelId', { novelId })
      .execute();
  }

  static async findByOnlyEpisodeId(episodeId: number) {
    return await this.createQueryBuilder('episode')
      .where('episode.id = :episodeId', { episodeId })
      .select('episode.novelId')
      .getRawOne();
  }

  static async editEpisode(
    episodeId: number,
    episodeNum: number,
    thumbnail: string,
    title: string,
    text: string,
  ) {
    return await this.createQueryBuilder('episode')
      .update(Episode)
      .set({
        episodeNum,
        thumbnail,
        title,
        text,
      })
      .where('episode.id = :id', { id: episodeId })
      .execute();
  }

  static async deleteEpisode(id: number) {
    return await this.createQueryBuilder('episode')
      .delete()
      .from(Episode)
      .where('episode.id = :id', { id })
      .execute();
  }
}
