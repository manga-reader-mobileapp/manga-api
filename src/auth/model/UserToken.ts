import { User } from 'src/users/entities/user.entity';

export class UserToken {
  acess_token: string;
  user: Omit<User, 'password'>;
}
