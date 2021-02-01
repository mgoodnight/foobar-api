import * as chai from 'chai';
import * as sinon from 'sinon';
import * as SinonChai from 'sinon-chai';
import * as SinonExpressMock from 'sinon-express-mock';
import * as config from 'config';

import { verifySession } from '../../../src/routes/middleware/verify-session';
import { ConfigSession } from '../../../src/interfaces/config';
import { userFix } from '../../fixtures/user';

chai.use(SinonChai);

const expect = chai.expect;
const mockReq = SinonExpressMock.mockReq;
const mockRes = SinonExpressMock.mockRes;

describe('Create session middleware', () => {
  let sandbox: sinon.SinonSandbox;
  let req: SinonExpressMock.mockReq;
  let res: SinonExpressMock.mockRes;
  let next: sinon.SinonSpy;

  const sessionConfig = config.get<ConfigSession>('session');

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
    res.locals[sessionConfig.locals.userId] = userFix.id;

    await verifySession(req, res, next);

    expect(next).to.be.called;
  });

  it('No userId', async () => {
    await verifySession(req, res, next);

    expect(res.status).to.be.calledWith(401);
    expect(res.cookie).to.be.calledWith(sessionConfig.cookie.name, null);
  });
});
