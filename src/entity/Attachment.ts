import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Message } from './Message'
import { AttachmentTypes } from './Enums'

@Entity()
export class Attachment {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @ManyToOne(() => Message, (message) => message.attachments)
  @JoinColumn({ name: 'message_id' })
  message!: Message

  @Column({
    name: 'file_type',
    type: 'enum',
    enum: AttachmentTypes,
    default: AttachmentTypes.OTHER,
  })
  fileType!: AttachmentTypes

  @Column({ type: 'varchar', length: 2048 })
  url!: string

  @Column({ type: 'varchar', length: 2048 })
  thumbnail_url!: string

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt?: Date
}
