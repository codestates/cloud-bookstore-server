import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  BaseEntity,
} from 'typeorm';

import Novel from './Novel';

@Entity()
export default class NovelComment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nickname!: string;

  @Column()
  comment!: string;

  @Column()
  novelId!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne((type) => Novel, (novel) => novel.novelComments, {
    nullable: false,
    cascade: ['insert', 'update', 'remove'],
  })
  novel!: Novel;

  static async findByNovelId(novelId: number): Promise<NovelComment[] | void> {
    return await this.createQueryBuilder('novel')
      .where('novelComment.novelId = :novelId', { novelId })
      .getMany();
  }
}
