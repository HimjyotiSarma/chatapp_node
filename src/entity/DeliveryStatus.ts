import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { DomainEvent } from './DomainEvent'
import { User } from './User'

@Entity({ name: 'delivery_status' })
export class DeliveryStatus {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: bigint

  @ManyToOne(() => DomainEvent, (domainEvent) => domainEvent.deliveryStatus, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'domain_event_id' })
  domainEvent!: DomainEvent

  @ManyToOne(() => User, (user) => user.deliveryStatus, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User

  @Column({ name: 'delivery_attempts', type: 'int', default: 0 })
  deliveryAttempts!: number

  @Column({ name: 'delivered_at', type: 'timestamptz', default: null })
  deliveredAt?: Date
  // acknowledged at timestamp from User
  @Column({ name: 'ack_at', type: 'timestamptz', default: null })
  ackAt?: Date
}
