import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Message } from './Message'
import { AttachmentTypes } from '../database/Enums'

@Entity()
@Index('IDX_attachment_message', ['message'])
export class Attachment {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @ManyToOne(() => Message, (message) => message.attachments, {
    onDelete: 'CASCADE',
  })
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
