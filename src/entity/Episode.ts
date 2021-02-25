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

  @Column({ type: 'longtext' })
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

  static async findByNovelId(novelId: number): Promise<Episode[] | void> {
    return await this.createQueryBuilder('episode')
      .where('episode.novelId = :novelId', { novelId })
      .getMany();
  }
}
