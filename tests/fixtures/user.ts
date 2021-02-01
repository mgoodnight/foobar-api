import { User } from '../../src/entities/User';

export const userFix: User = {
  id: 1,
  fullName: 'Matt Goodnight',
  email: 'mbgoodnight@gmail.com',
  hashedPassword: Buffer.from('foobar'),
  created: new Date(),
  lastModified: new Date()
};
