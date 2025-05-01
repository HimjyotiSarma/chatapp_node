import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { Thread_Roles } from './Enums'
import { Conversation } from './Conversations'
import { User } from './User'

@Entity({ name: 'thread_participants' })
export class ThreadParticipants {
  //   @PrimaryColumn({ name: 'thread_id' })
  //   threadId!: string

  //   @PrimaryColumn({ name: 'user_id' })
  //   userId!: string

  @ManyToOne(() => Conversation, (conversation) => conversation.participants, {
    nullable: false,
  })
  @JoinColumn({ name: 'thread_id' })
  thread!: Conversation

  @ManyToOne(() => User, (user) => user.threads, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user!: User

  @Column({
    type: 'enum',
    enum: Thread_Roles,
    default: Thread_Roles.MEMBER,
    nullable: true,
  })
  role!: Thread_Roles
}
