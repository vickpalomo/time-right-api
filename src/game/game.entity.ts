import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class GameSession {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  @Index()
  userId!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ type: 'bigint' })
  startTime!: number;

  @Column({ type: 'bigint', nullable: true })
  stopTime!: number;

  @Column({ type: 'float', nullable: true })
  @Index()
  deviation!: number;

  @Column({ type: 'bigint', nullable: true })
  expiresAt!: number;

  @Column({ type: 'boolean', default: false })
  expired!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}