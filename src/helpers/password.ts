import * as bcrypt from 'bcrypt';

/**
 * PasswordHelper class for creating and checking password hashes
 *
 * @class PasswordHelper
 */
export class PasswordHelper {
  /**
   * Salt rounds for hashing
   *
   * @private
   * @type {number}
   * @memberof Password
   */
  private _saltRounds: number;

  /**
   * Creates an instance of PasswordHelper.
   * @param {number} [saltRounds=10]
   * @memberof PasswordHelper
   */
  constructor(saltRounds = 10) {
    this._saltRounds = saltRounds;
  }

  /**
   * Hash a string
   *
   * @param {string} plainTxtStr
   * @returns {Promise<Buffer>}
   * @memberof Password
   */
  public async hashPw(plainTxtStr: string): Promise<Buffer> {
    return Buffer.from(await this._hash(plainTxtStr));
  }

  /**
   * Compare string the hash Buffer
   *
   * @param {string} plainTxtStr
   * @param {Buffer} hashedStr
   * @returns {Promise<boolean>}
   * @memberof Password
   */
  public async comparePwHash(plainTxtStr: string, hashedStr: Buffer): Promise<boolean> {
    return await this._compare(plainTxtStr, hashedStr.toString());
  }

  /**
   * Wrapper function for bcrypt.hash
   *
   * @private
   * @param {string} plainTxtStr
   * @returns {Promise<string>}
   * @memberof Password
   */
  private async _hash(plainTxtStr: string): Promise<string> {
    return await bcrypt.hash(plainTxtStr, this._saltRounds);
  }

  /**
   * Wrapper function for bcrypt.compare
   *
   * @private
   * @param {string} plainTxtStr
   * @param {string} hashedStr
   * @returns {Promise<boolean>}
   * @memberof Password
   */
  private async _compare(plainTxtStr: string, hashedStr: string): Promise<boolean> {
    return await bcrypt.compare(plainTxtStr, hashedStr);
  }
}
