import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('user_account_unq', ['email'], { unique: true })
@Entity('user', { schema: 'foobar' })
export class User {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('varchar', { name: 'full_name', nullable: true, length: 100 })
  fullName: string | null;

  @Column('varchar', { name: 'email', unique: true, length: 254 })
  email: string;

  @Column('binary', { name: 'hashed_password', length: 60 })
  hashedPassword: Buffer;

  @Column('timestamp', { name: 'created', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @Column('timestamp', {
    name: 'last_modified',
    default: () => 'CURRENT_TIMESTAMP'
  })
  lastModified: Date;
}
