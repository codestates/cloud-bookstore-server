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

  @Column({ nullable: false })
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
    return await this.createQueryBuilder('novelComment')
      .where('novelComment.novelId = :novelId', { novelId })
      .getMany();
  }

  static async checkValidity(
    nickname: string,
    commentId: number,
  ): Promise<NovelComment | void> {
    return await this.createQueryBuilder('novelComment')
      .where('novelComment.nickname = :nickname', { nickname })
      .andWhere('novelComment.id = :id', { id: commentId })
      .getOne();
  }

  static async commentNovel(
    nickname: string,
    comment: string,
    novelId: number,
  ) {
    return await this.createQueryBuilder('novelComment')
      .insert()
      .into(NovelComment)
      .values({ novelId, nickname, comment })
      .execute();
  }

  static async editComment(commentId: number, comment: string) {
    return await this.createQueryBuilder('novelComment')
      .update(NovelComment)
      .set({
        comment,
      })
      .where('id = :id', { id: commentId })
      .execute();
  }

  static async deleteComment(commentId: number) {
    return await this.createQueryBuilder('novelComment')
      .delete()
      .from(NovelComment)
      .where('id = :id', { id: commentId })
      .execute();
  }
}
