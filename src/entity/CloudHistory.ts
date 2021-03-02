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
export default class CloudHistory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @Column()
  novelId!: number;

  @Column()
  novelEpisodeId!: number;

  @Column()
  cloud!: number;

  @Column()
  purchase!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne((type) => User, (user) => user.cloudHistories, {
    nullable: false,
    cascade: ['insert', 'update', 'remove'],
  })
  user!: User;

  static async updateEpisodeCloud(
    // 회차 하나 당 구름 1씩 차감
    userId: number,
    novelId: number,
    episodeId: number,
  ) {
    return await this.createQueryBuilder('cloudHistory')
      .insert()
      .into(CloudHistory)
      .values({
        userId,
        novelId,
        novelEpisodeId: episodeId,
        cloud: -1,
        purchase: false,
      })
      .execute();
  }

  static async getCloudHistories(userId: number): Promise<CloudHistory[]> {
    return await this.createQueryBuilder('cloudHistory')
      .where('cloudHistory.userId = :userId', { userId })
      .getMany();
  }


  static async addLoginHistory(userId: number) {
    return await this.createQueryBuilder('cloudHistory')
      .insert()
      .into(CloudHistory)
      .values({ userId, novelId: 0, novelEpisodeId: 0, cloud:3, purchase:false })
      .execute();
  }
}
