import { getRepository } from 'typeorm';
import { User } from '../entities/User';
import { PasswordHelper } from '../helpers/password';
import { GetUsersFilters, UserFromApi, UserUpdateToApi, UserToApi } from '../interfaces/user';

/**
 * Class to abstract from the TypeORM layer of the User entity
 *
 * @class UserDao
 */
class UserDao {
  /**
   * Static utility method to get list of User entities via UserDao instances
   *
   * @static
   * @param {GetUsersFilters} [filters]
   * @returns {Promise<UserDao[]>}
   * @memberof UserDao
   */
  static async getUsers(filters?: GetUsersFilters): Promise<UserDao[]> {
    const users = await getRepository(User).find(filters);
    return users.map(ua => new UserDao(ua));
  }

  /**
   * Static utility method to create a new User entity and return a UserDao instance
   *
   * @static
   * @param {UserToApi} newUser
   * @param {number} [desiredId]
   * @returns {Promise<UserDao>}
   * @memberof UserDao
   */
  static async createUser(newUser: UserToApi, desiredId?: number): Promise<UserDao> {
    const { password, ...user } = newUser;

    const pwHandler = new PasswordHelper();
    const hashedPw = await pwHandler.hashPw(password);

    const insertResult = await getRepository(User).insert({
      ...desiredId && { id: desiredId },
      ...user,
      hashedPassword: hashedPw
    });

    return (await UserDao.getUsers({ id: insertResult.identifiers[0].id }))[0];
  }

  /**
   * Instance of User TypeORM entity
   *
   * @private
   * @type {User}
   * @memberof UserDao
   */
  private _user: User;

  /**
   * Instance of PasswordHelper class
   *
   * @private
   * @type {PasswordHelper}
   * @memberof UserDao
   */
  private _passwordHelper: PasswordHelper;

  /**
   * Creates an instance of UserDao.
   * @param {User} user
   * @memberof UserDao
   */
  constructor(user: User) {
    this._user = user;
    this._passwordHelper = new PasswordHelper();
  }

  /**
   * User ID getter
   *
   * @readonly
   * @memberof UserDao
   */
  get id() {
    return this._user.id;
  }

  /**
   * Build User API payload
   *
   * @param {boolean} [internalPayload=false]
   * @returns {UserFromApi}
   * @memberof UserDao
   */
  public buildApi(): UserFromApi {
    return {
      id: this._user.id,
      email: this._user.email,
      fullName: this._user.fullName,
      created: this._user.created,
      lastModified: this._user.lastModified
    };
  }

  /**
   * Check against password of User
   *
   * @param {string} supposedPw
   * @returns {Promise<boolean>}
   * @memberof UserDao
   */
  public async doesPasswordMatch(supposedPw: string): Promise<boolean> {
    return await this._passwordHelper.comparePwHash(supposedPw, this._user.hashedPassword);
  }

  /**
   * Update the User
   *
   * @param {(UserUpdateToApi)} updatedUser
   * @returns {Promise<boolean>}
   * @memberof UserDao
   */
  public async update(updatedUser: UserUpdateToApi): Promise<boolean> {
    const updateResult = await this._update(updatedUser);

    if (updateResult && updateResult.raw.affectedRows === 1) {
      this._updateSelf();
      return true;
    }

    return false;
  }

  /**
   * Update of User
   *
   * @private
   * @param {UserUpdateToApi} updatedUser
   * @returns
   * @memberof UserDao
   */
  private async _update(updatedUser: UserUpdateToApi) {
    const { password, ...user } = updatedUser;

    return await getRepository(User).update({ id: this.id }, {
      ...updatedUser.password && { hashedPassword: await this._hashPassword(password) },
      ...user
    });
  }

  /**
   * Refresh the private member _user with what is currently in the database
   *
   * @private
   * @returns {Promise<void>}
   * @memberof UserDao
   */
  private async _updateSelf(): Promise<void> {
    this._user = await getRepository(User).findOne({ id: this.id });
  }

  /**
   * Allow instances to hash password
   *
   * @private
   * @param {string} plainTextPw
   * @returns {Promise<Buffer>}
   * @memberof UserDao
   */
  private async _hashPassword(plainTextPw: string): Promise<Buffer> {
    return await this._passwordHelper.hashPw(plainTextPw);
  }
}

export { UserDao };
