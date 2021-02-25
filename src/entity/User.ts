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
}
