import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BaseEntity,
} from 'typeorm';

import UserHistory from './UserHistory';
import UserWork from './UserWork';
import UserLike from './UserLike';
import CloudHistory from './CloudHistory';
import Purchase from './Purchase';

@Entity()
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  nickname!: string;

  @Column()
  email!: string;

  @Column({ default: 10 })
  cloud!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany((type) => UserHistory, (userHistory) => userHistory.user)
  userHistories!: UserHistory[];

  @OneToMany((type) => UserWork, (userWork) => userWork.user)
  userWorks!: UserWork[];

  @OneToMany((type) => UserLike, (userLike) => userLike.user)
  userLikes!: UserLike[];

  @OneToMany((type) => CloudHistory, (cloudHistory) => cloudHistory.user)
  cloudHistories!: CloudHistory[];

  @OneToMany((type) => Purchase, (purchase) => purchase.user)
  purchases!: Purchase[];

  static async checkCloudBalance(userId: number) {
    return await this.createQueryBuilder('user')
      .where('user.id = :id', {
        id: userId,
      })
      .select('user.cloud')
      .getRawOne();
  }

  static async cutCloud(userId: number) {
    // episode를 읽으면, cloud 하나 내리기
    return await this.createQueryBuilder('user')
      .update(User)
      .set({
        cloud: () => 'cloud - 1',
      })
      .where('user.id = :id', { id: userId })
      .execute();
  }

  static async findNickname(userId: number) {
    return await this.createQueryBuilder('user')
      .where('user.id = :id', {
        id: userId,
      })
      .select('user.nickname')
      .getRawOne();
  }

  static async checkNicknameAvailability(
    nickname: string,
  ): Promise<User | void> {
    return await this.createQueryBuilder('user')
      .where('user.nickname = :nickname', { nickname })
      .getOne();
  }

  static async editNickname(userId: number, nickname: string) {
    return await this.createQueryBuilder('user')
      .update(User)
      .set({ nickname })
      .where('user.id = :id', { id: userId })
      .execute();
  }

  static async checkEmailLogin(email: string) {
    return await this.createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();
  }

  static async addUser(nickname: string, email: string) {
    return await this.createQueryBuilder('user')
      .insert()
      .into(User)
      .values({ nickname, email })
      .execute();
  }

  static async lastLogin(email: string) {
    return await this.createQueryBuilder('user')
      .update(User)
      .set({ cloud: () => 'cloud' })
      .where('user.email = :email', { email })
      .execute();
  }

  static async plusCloud(email: string) {
    return await this.createQueryBuilder('user')
      .update(User)
      .set({ cloud: () => 'cloud + 3' })
      .where('user.email = :email', { email })
      .execute();
  }

  static async getUpdatedAt(email: string) {
    return await this.createQueryBuilder('user')
      .where('user.email = :email', { email })
      .select('user.updatedAt')
      .getRawOne();
  }

  static async getUserId(email: string) {
    return await this.createQueryBuilder('user')
      .where('user.email = :email', { email })
      .select('user.id')
      .getRawOne();
  }
}
