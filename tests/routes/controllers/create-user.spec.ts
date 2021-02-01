import * as chai from 'chai';
import * as sinon from 'sinon';
import * as SinonChai from 'sinon-chai';
import * as SinonExpressMock from 'sinon-express-mock';
import * as config from 'config';

import { createUser } from '../../../src/routes/controllers/create-user';
import { UserDao } from '../../../src/daos/user';
import { UserToApi, ConfigSessionLocals } from '../../../src/interfaces';
import { userFix } from '../../fixtures';

chai.use(SinonChai);

const expect = chai.expect;
const mockReq = SinonExpressMock.mockReq;
const mockRes = SinonExpressMock.mockRes;

describe('POST /user controller', () => {
  let sandbox;
  let req: SinonExpressMock.mockReq;
  let res: SinonExpressMock.mockRes;
  let next: sinon.SinonSpy;

  const userToApi: UserToApi = {
    fullName: 'Matt Goodnight',
    email: userFix.email,
    password: 'foobar'
  };

  beforeEach(() => {
    req = mockReq();
    res = mockRes();
    res.locals.user = userToApi;
    next = sinon.spy();
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('Basic usage', async () => {
    const sessionLocalsConfig = config.get<ConfigSessionLocals>('session.locals');

    const userDao = sandbox.createStubInstance(UserDao);
    Object.defineProperty(userDao, 'id', { value: userFix.id, writable: false });

    sandbox.stub(UserDao, 'getUsers').resolves([]);
    sandbox.stub(UserDao, 'createUser').resolves(userDao);

    await createUser(req, res, next);

    expect(next).to.be.called;
    expect(res.locals[sessionLocalsConfig.userId]).to.equal(userFix.id);
  });

  it('UserDao getUsers() returns existing user', async () => {
    const userDao = sandbox.createStubInstance(UserDao);
    sandbox.stub(UserDao, 'getUsers').resolves([userDao]);

    await createUser(req, res, next);

    expect(res.status).to.be.calledWith(400);
    expect(res.send).to.be.calledWith({ error: 'A user already exists with this email' });
  });

  it('UserDao getUsers() throws an error', async () => {
    sandbox.stub(UserDao, 'getUsers').throws([]);

    await createUser(req, res, next);

    expect(res.status).to.be.calledWith(500);
  });

  it('UserDao createUser() throws an error', async () => {
    sandbox.stub(UserDao, 'getUsers').resolves([]);
    sandbox.stub(UserDao, 'createUser').throws();

    await createUser(req, res, next);

    expect(res.status).to.be.calledWith(500);
  });

  it('Missing new user payload', async () => {
    res.locals.user = null;

    await createUser(req, res, next);

    expect(res.status).to.be.calledWith(400);
    expect(res.send).to.be.calledWith({ error: 'Missing user' });
  });
});
