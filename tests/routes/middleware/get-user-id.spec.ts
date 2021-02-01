import * as chai from 'chai';
import * as sinon from 'sinon';
import * as SinonChai from 'sinon-chai';
import * as SinonExpressMock from 'sinon-express-mock';
import * as config from 'config';

import { getUserId } from '../../../src/routes/middleware/get-user-id';
import { SessionHelper } from '../../../src/helpers/session';
import { ConfigSession } from '../../../src/interfaces/config';
import { UserSession } from '../../../src/interfaces';
import { userFix } from '../../fixtures';

chai.use(SinonChai);

const sessionConfig = config.get<ConfigSession>('session');

const expect = chai.expect;
const mockReq = SinonExpressMock.mockReq;
const mockRes = SinonExpressMock.mockRes;

describe('Get user ID middleware', () => {
  let sandbox: sinon.SinonSandbox;
  let req: SinonExpressMock.mockReq;
  let res: SinonExpressMock.mockRes;
  let next: sinon.SinonSpy;

  beforeEach(() => {
    req = mockReq();
    req.cookies = {};

    res = mockRes();
    next = sinon.spy();
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('Basic usage', async () => {
    const { secret, ...createArgs } = sessionConfig.token;
    const sessionHelper = new SessionHelper(sessionConfig.token.secret);
    req.cookies[sessionConfig.cookie.name] = await sessionHelper.create<UserSession>({ userId: userFix.id }, createArgs);

    await getUserId(req, res, next);

    expect(res.locals[sessionConfig.locals.userId]).to.be.equal(userFix.id);
    expect(next).to.be.called;
  });

  it('No session', async () => {
    await getUserId(req, res, next);

    expect(res.locals[sessionConfig.locals.userId]).to.be.undefined;
    expect(next).to.be.called;
  });

  it('Has session but decode error', async () => {
    req.cookies[sessionConfig.cookie.name] = 'foobar';
    await getUserId(req, res, next);

    expect(res.locals[sessionConfig.locals.userId]).to.be.undefined;
    expect(next).to.be.called;
  });
});
