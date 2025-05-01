import { Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { DomainEvent } from './DomainEvent'
import { User } from './User'

export class DeliveryStatus {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: bigint

  @ManyToOne(() => DomainEvent, (domainEvent) => domainEvent.deliveryStatus)
  @JoinColumn({ name: 'domain_event_id' })
  domainEvent!: DomainEvent

  @ManyToOne(() => User, (user) => user.deliveryStatus)
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
