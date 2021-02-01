import * as chai from 'chai';
import * as sinon from 'sinon';
import * as SinonChai from 'sinon-chai';
import * as SinonExpressMock from 'sinon-express-mock';
import * as config from 'config';

import { checkSessionAttempt } from '../../../src/routes/controllers/check-session-attempt';
import { UserDao } from '../../../src/daos/user';
import { ConfigSessionLocals } from '../../../src/interfaces';
import { userFix } from '../../fixtures';

chai.use(SinonChai);

const expect = chai.expect;
const mockReq = SinonExpressMock.mockReq;
const mockRes = SinonExpressMock.mockRes;

describe('POST /session controller', () => {
  let sandbox;
  let req: SinonExpressMock.mockReq;
  let res: SinonExpressMock.mockRes;
  let next: sinon.SinonSpy;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();
    next = sinon.spy();
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('Basic usage', async () => {
    const sessionLocalsConfig = config.get<ConfigSessionLocals>('session.locals');
    const sessionPayload = { email: 'mbgoodnight@gmail.com', password: 'foobar' };
    res.locals.session = sessionPayload;

    const userDao = sandbox.createStubInstance(UserDao);
    userDao.doesPasswordMatch.resolves(true);
    Object.defineProperty(userDao, 'id', { value: userFix.id, writable: false });

    sandbox.stub(UserDao, 'getUsers')
      .withArgs({ email: sessionPayload.email })
      .resolves([userDao]);

    await checkSessionAttempt(req, res, next);

    expect(next).to.be.called;
    expect(res.locals[sessionLocalsConfig.userId]).to.equal(userFix.id);
  });

  it('UserDao.getUser() throws an error', async () => {
    const sessionPayload = { email: 'mbgoodnight@gmail.com', password: 'foobar' };
    res.locals.session = sessionPayload;

    sandbox.stub(UserDao, 'getUsers').throws();

    await checkSessionAttempt(req, res, next);

    expect(res.status).to.be.calledWith(500);
  });

  it('Password does not match', async () => {
    const sessionPayload = { email: 'mbgoodnight@gmail.com', password: 'foobar' };
    res.locals.session = sessionPayload;

    const userDao = sandbox.createStubInstance(UserDao);
    userDao.doesPasswordMatch.resolves(false);

    sandbox.stub(UserDao, 'getUsers')
      .withArgs({ email: sessionPayload.email })
      .resolves([userDao]);

    await checkSessionAttempt(req, res, next);

    expect(res.status).to.be.calledWith(401);
  });
});
