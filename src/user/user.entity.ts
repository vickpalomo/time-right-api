import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  @Index()
  username!: string;

  @Column()
  password!: string;

  @Column({ default: 0 })
  totalGames!: number;

  @Column({ type: 'float', default: 0 })
  @Index()
  averageDeviation!: number;

  @Column({ type: 'float', default: 999999 })
  @Index()
  bestDeviation!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
} 