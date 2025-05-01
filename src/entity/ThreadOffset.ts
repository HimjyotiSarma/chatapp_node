import { Entity, JoinColumn, ManyToOne, UpdateDateColumn } from 'typeorm'
import { Conversation } from './Conversations'
import { User } from './User'
import { Message } from './Message'

@Entity({ name: 'thread_offset' })
export class ThreadOffset {
  @ManyToOne(() => Conversation, (conversation) => conversation.threadOffsets)
  @JoinColumn({ name: 'thread_id' })
  thread!: Conversation

  @ManyToOne(() => User, (user) => user.threadOffsets)
  @JoinColumn({ name: 'user_id' })
  user!: User

  @ManyToOne(() => Message, (message) => message.threadOffsets)
  @JoinColumn({ name: 'last_read_msg' })
  lastReadMsg!: Message

  @UpdateDateColumn({
    name: 'last_offset_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  lastOffsetAt!: Date
}
