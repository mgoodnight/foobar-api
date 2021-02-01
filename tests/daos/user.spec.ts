import * as chai from 'chai';
import * as sinon from 'sinon';
import * as typeorm from 'typeorm';

import { UserFromApi, UserToApi } from '../../src/interfaces/user';
import { UserDao } from '../../src/daos/user';
import { PasswordHelper } from '../../src/helpers/password';
import { userFix } from '../fixtures';

const expect = chai.expect;

describe('UserDao', () => {
  let sandbox;
  let userDao: UserDao;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    userDao = new UserDao(userFix);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('Can create', () => {
    expect(userDao).to.be.instanceof(UserDao);
  });

  it('`get` id', () => {
    expect(userDao.id).to.be.equal(userFix.id);
  });

  it('UserDao.getUsers() basic usage', async () => {
    const fakeRepository = sandbox.createStubInstance(typeorm.Repository);
    fakeRepository.find.withArgs({ id: userFix.id }).returns([userFix]);

    sandbox.stub(typeorm, 'getRepository').returns(fakeRepository as any);

    const users = await UserDao.getUsers({ id: userFix.id });

    expect(users).to.be.an('array').that.is.eql([new UserDao(userFix)]);
  });

  it('createUser() Basic usage', async () => {
    const newUserAccount: UserToApi = {
      email: userFix.email,
      password: userFix.hashedPassword.toString(),
      fullName: userFix.fullName
    };

    const expectedId = 2;
    userDao = new UserDao({ ...userFix, id: expectedId });

    const hashedPwFake = Buffer.from(newUserAccount.password);

    sandbox.stub(PasswordHelper.prototype, 'hashPw')
      .withArgs(newUserAccount.password)
      .resolves(hashedPwFake);

    sandbox.stub(UserDao, 'getUsers')
      .withArgs({ id: expectedId })
      .returns([userDao]);

    const fakeRepository = sandbox.createStubInstance(typeorm.Repository);

    const { password, ...userAccount } = newUserAccount;

    fakeRepository.insert
      .withArgs({ ...userAccount, hashedPassword: hashedPwFake })
      .returns({ identifiers: [{ id: expectedId }] });

    sandbox.stub(typeorm, 'getRepository').returns(fakeRepository as any);

    const newUserDao = await UserDao.createUser(newUserAccount);

    expect(newUserDao).to.be.eql(userDao);
  });

  it('buildApi() basic usage', async () => {
    const expectedApi: UserFromApi = {
      id: userFix.id,
      email: userFix.email,
      fullName: userFix.fullName,
      created: userFix.created,
      lastModified: userFix.lastModified
    };

    const userAccountApi = userDao.buildApi();

    expect(userAccountApi).to.deep.equal(expectedApi);
  });

  it('update() returns false', async () => {
    const fakeRepository = sandbox.createStubInstance(typeorm.Repository);
    fakeRepository.update.resolves(false);

    sandbox.stub(typeorm, 'getRepository').returns(fakeRepository as any);

    expect(await userDao.update({ email: 'foobar@foo.com', fullName: 'Matt Goodnight' })).to.be.false;
  });

  it('update() returns true', async () => {
    const fakeRepository = sandbox.createStubInstance(typeorm.Repository);
    fakeRepository.update.resolves({ raw: { affectedRows: 1 } });

    sandbox.stub(typeorm, 'getRepository').returns(fakeRepository as any);

    expect(await userDao.update({ email: 'foobar@foo.com', fullName: 'Matt Goodnight' })).to.be.true;
  });
});
