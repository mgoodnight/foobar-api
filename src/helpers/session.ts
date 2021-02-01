import * as jwt from 'jsonwebtoken';

/**
 * Class to create and verify JWT session tokens via Promise-based wrapper around `sign` and `verify`.
 * utils.promisify wasn't playing nice
 *
 * @class SessionHelper
 */
export class SessionHelper {

  /**
   * JWT signing secret
   *
   * @private
   * @type {string}
   * @memberof SessionHelper
   */
  private _secret: string;

  /**
   * Creates an instance of SessionHelper
   * @param {string} secret
   * @memberof SessionHelper
   */
  constructor(secret: string) {
    this._secret = secret;
  }

  /**
   * Create a JWT
   *
   * @template T
   * @param {T} payload
   * @param {jwt.SignOptions} createOptions
   * @returns {Promise<string>}
   * @memberof SessionHelper
   */
  public async create<T>(payload: T, createOptions: jwt.SignOptions): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(payload as Object, this._secret, createOptions, (err, token) => {
        if (err) {
          return reject(err);
        }

        return resolve(token);
      });
    });
  }

  /**
   * Verify a JWT
   *
   * @template T
   * @param {string} token
   * @returns {Promise<T>}
   * @memberof SessionHelper
   */
  public async verify<T>(token: string): Promise<T> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this._secret, (err, payload) => {
        if (err) {
          return reject(err);
        }

        return resolve(payload as unknown as T);
      });
    });
  }
}
