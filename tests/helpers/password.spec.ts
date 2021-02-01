import * as chai from 'chai';
import { PasswordHelper } from '../../src/helpers/password';

const expect = chai.expect;

describe('Password Hasher', () => {
  let pwHelper: PasswordHelper;

  beforeEach(() => {
    pwHelper = new PasswordHelper();
  });

  it('Can create', () => {
    expect(pwHelper).to.be.instanceof(PasswordHelper);

    pwHelper = new PasswordHelper(15);
    expect(pwHelper).to.be.instanceof(PasswordHelper);
  });

  it('Hash password and compare', async () => {
    const plain = 'foobar';
    const bufferedHash = await pwHelper.hashPw(plain);

    expect(bufferedHash).to.be.instanceof(Buffer);

    const compareTruthy = await pwHelper.comparePwHash(plain, bufferedHash);

    expect(compareTruthy).to.be.true;
  });
});
