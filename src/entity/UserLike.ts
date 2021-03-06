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
export default class UserLike extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @Column()
  novelId!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne((type) => User, (user) => user.userLikes, {
    nullable: false,
    cascade: ['insert', 'update', 'remove'],
  })
  user!: User;

  static async findByNovelId(
    userId: number,
    novelId: number,
  ): Promise<UserLike | void> {
    return await this.createQueryBuilder('userLike')
      .where('userLike.userId = :userId', { userId })
      .andWhere('userLike.novelId = :novelId', { novelId })
      .getOne();
  }

  static async findByUserId(userId: number): Promise<UserLike[]> {
    return await this.createQueryBuilder('userLike')
      .where('userLike.userId = :userId', { userId })
      .select('userLike.novelId')
      .getMany();
  }

  static async addLikes(userId: number, novelId: number) {
    return await this.createQueryBuilder('userLike')
      .insert()
      .into(UserLike)
      .values({
        userId,
        novelId,
      })
      .execute();
  }

  static async deleteUserLike(userId: number, novelId: number) {
    return await this.createQueryBuilder('userLike')
      .delete()
      .from(UserLike)
      .where('user_like.userId = :userId', { userId: userId })
      .andWhere('user_like.novelId = :novelId', { novelId: novelId })
      .execute();
  }
}
