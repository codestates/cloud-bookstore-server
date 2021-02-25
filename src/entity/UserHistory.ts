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

@Entity()
export default class UserHistory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @Column()
  novelId!: number;

  @Column()
  novelEpisodeId!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne((type) => User, (user) => user.userHistories, {
    nullable: false,
    cascade: ['insert', 'update', 'remove'],
  })
  user!: User;

  static async findByNovelId(
    userId: number,
    novelId: number,
  ): Promise<UserHistory[] | void> {
    return await this.createQueryBuilder('userHistory')
      .where('userHistory.userId = :userId', { userId })
      .andWhere('userHistory.novelId = :novelId', { novelId })
      .select('userHistory.novelEpisodeId')
      .addSelect('userHistory.updatedAt')
      .getMany();
  }
}
