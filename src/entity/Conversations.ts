import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Thread_Types } from './Enums'
import { User } from './User'
import { ThreadParticipants } from './ThreadParticipants'
import { Message } from './Message'
import { ThreadOffset } from './ThreadOffset'

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'enum', enum: Thread_Types })
  type!: Thread_Types

  @Column({ type: 'varchar', length: 150, nullable: true })
  name?: string

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt?: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt?: Date

  @ManyToOne(() => User, (user) => user.conversations, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  createdBy?: User

  @OneToMany(
    () => ThreadParticipants,
    (threadParticipants) => threadParticipants.thread,
    { nullable: true }
  )
  participants?: ThreadParticipants[]

  @OneToMany(() => Message, (message) => message.conversation, {
    nullable: true,
  })
  messages?: Message[]

  @OneToMany(() => ThreadOffset, (threadOffset) => threadOffset.thread, {
    nullable: true,
  })
  threadOffsets?: ThreadOffset[]
}
