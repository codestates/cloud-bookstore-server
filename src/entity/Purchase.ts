import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  BaseEntity,
} from 'typeorm';

import User from './User';
import Episode from './Episode';

@Entity()
export default class Purchase extends BaseEntity {
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
    cascade: ['insert', 'update', 'remove'],
  })
  user!: User;

  @ManyToOne((type) => Episode, (episode) => episode.purchases, {
    nullable: false,
    cascade: ['insert', 'update', 'remove'],
  })
  episode!: Episode;

  static async findByNovelId(userId: number, novelId: number) {
    return await this.createQueryBuilder('purchase')
      .innerJoinAndSelect(
        'purchase.episode',
        'episode',
        'episode.novelId = :novelId',
        { novelId },
      )
      .where('purchase.userId = :userId', { userId })
      .select('purchase.episodeId')
      .getRawMany();
  }

  static async addPurchase(
    userId: number,
    episodeId: number,
    thumbnail: string,
  ) {
    return await this.createQueryBuilder('purchase')
      .insert()
      .into(Purchase)
      .values({
        userId,
        episodeId,
        thumbnail,
      })
      .execute();
  }
}
