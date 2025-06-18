import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserStats {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  @Index()
  userId!: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ default: 0 })
  totalGames!: number;

  @Column({ type: 'float', default: 0 })
  averageDeviation!: number;

  @Column({ type: 'float', default: 100000 })
  bestDeviation!: number;

  @Column({ default: 0 })
  score!: number;

  @UpdateDateColumn()
  updatedAt!: Date;
}