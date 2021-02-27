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
export default class UserWork extends BaseEntity {
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

  @ManyToOne((type) => User, (user) => user.userWorks, {
    nullable: false,
    cascade: ['insert', 'update', 'remove'],
  })
  user!: User;

  static async saveMyNovel(userId: number, novelId: number) {
    return await this.createQueryBuilder('userWork')
      .insert()
      .into(UserWork)
      .values({ userId, novelId })
      .execute();
  }

  static async getMyNovelList(userId: number): Promise<UserWork[]> {
    return await this.createQueryBuilder('userWork')
      .where('userWork.id = :id', { id: userId })
      .getMany();
  }
}
