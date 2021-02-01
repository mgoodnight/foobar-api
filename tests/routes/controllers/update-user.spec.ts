import * as chai from 'chai';
import * as sinon from 'sinon';
import * as SinonChai from 'sinon-chai';
import * as SinonExpressMock from 'sinon-express-mock';
import * as config from 'config';

import { updateUser } from '../../../src/routes/controllers/update-user';
import { UserDao } from '../../../src/daos/user';
import { ConfigSessionLocals, UserUpdateToApi } from '../../../src/interfaces';
import { userFix } from '../../fixtures';

chai.use(SinonChai);

const expect = chai.expect;
const mockReq = SinonExpressMock.mockReq;
const mockRes = SinonExpressMock.mockRes;

describe('PUT /user controller', () => {
  let sandbox;
  let req: SinonExpressMock.mockReq;
  let res: SinonExpressMock.mockRes;
  let next: sinon.SinonSpy;

  const sessionLocalsConfig = config.get<ConfigSessionLocals>('session.locals');
  const userAccountToApi: UserUpdateToApi = {
    fullName: 'Matt Goodnight',
    email: userFix.email,
    password: 'foobar'
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    req = mockReq();
    res = mockRes();
    res.locals[sessionLocalsConfig.userId] = userFix.id;
    res.locals.user = userAccountToApi;
    next = sinon.spy();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('Basic usage', async () => {
    const userDao = sandbox.createStubInstance(UserDao);
    userDao.update.resolves(true);

    sandbox.stub(UserDao, 'getUsers').resolves([userDao]);

    await updateUser(req, res, next);

    expect(res.status).to.be.calledWith(204);
  });

  it('UserDao update() throws an error', async () => {
    const userDao = sandbox.createStubInstance(UserDao);
    userDao.update.throws();

    sandbox.stub(UserDao, 'getUsers').resolves([userDao]);

    await updateUser(req, res, next);

    expect(res.status).to.be.calledWith(500);
  });

  it('No userId provided', async () => {
    res.locals[sessionLocalsConfig.userId] = null;

    await updateUser(req, res, next);

    expect(res.status).to.be.calledWith(401);
  });

  it('Missing user update payload', async () => {
    res.locals.user = null;

    await updateUser(req, res, next);

    expect(res.status).to.be.calledWith(400);
    expect(res.send).to.be.calledWith({ error: 'Missing user' });
  });

  it('userId cannot be found, next() should be called', async () => {
    res.locals.user = userAccountToApi;

    sandbox.stub(UserDao, 'getUsers').resolves([]);

    await updateUser(req, res, next);

    expect(next).to.be.called;
  });
});
