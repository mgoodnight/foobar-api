import * as chai from 'chai';
import * as sinon from 'sinon';
import * as SinonChai from 'sinon-chai';
import * as SinonExpressMock from 'sinon-express-mock';
import * as config from 'config';

import { getUserInfo } from '../../../src/routes/controllers/get-user-info';
import { UserDao } from '../../../src/daos/user';
import { ConfigSessionLocals, UserFromApi } from '../../../src/interfaces';
import { userFix } from '../../fixtures';

chai.use(SinonChai);

const expect = chai.expect;
const mockReq = SinonExpressMock.mockReq;
const mockRes = SinonExpressMock.mockRes;

describe('GET /user controller', () => {
  let sandbox;
  let req: SinonExpressMock.mockReq;
  let res: SinonExpressMock.mockRes;

  const sessionLocalsConfig = config.get<ConfigSessionLocals>('session.locals');
  const returnedApi: UserFromApi = {
    id: userFix.id,
    email: userFix.email,
    fullName: userFix.fullName,
    created: userFix.created,
    lastModified: userFix.lastModified
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    req = mockReq();
    res = mockRes();
    res.locals[sessionLocalsConfig.userId] = userFix.id;
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('Basic usage', async () => {
    const userAccountDao = sandbox.createStubInstance(UserDao);
    userAccountDao.buildApi.returns(returnedApi);

    sandbox.stub(UserDao, 'getUsers').resolves([userAccountDao]);

    await getUserInfo(req, res);

    expect(res.send).to.be.calledWith({ user: returnedApi });
  });

  it('Missing userId from middleware', async () => {
    res.locals[sessionLocalsConfig.userId] = null;

    await getUserInfo(req, res);

    expect(res.status).to.be.calledWith(401);
  });

  it('Cannot find by userId', async () => {
    sandbox.stub(UserDao, 'getUsers')
      .withArgs({ id: userFix.id })
      .resolves([]);

    await getUserInfo(req, res);

    expect(res.status).to.be.calledWith(404);
  });

  it('UserDao getUsers() throws an error', async () => {
    sandbox.stub(UserDao, 'getUsers').throws();

    await getUserInfo(req, res);

    expect(res.status).to.be.calledWith(500);
  });
});
