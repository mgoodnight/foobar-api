import * as chai from 'chai';
import * as sinon from 'sinon';
import * as SinonChai from 'sinon-chai';
import * as SinonExpressMock from 'sinon-express-mock';
import * as config from 'config';

import { destroySession } from '../../../src/routes/middleware/destroy-session';
import { ConfigSession } from '../../../src/interfaces/config';

chai.use(SinonChai);

const expect = chai.expect;
const mockReq = SinonExpressMock.mockReq;
const mockRes = SinonExpressMock.mockRes;

describe('Destroy session middleware', () => {
  let sandbox: sinon.SinonSandbox;
  let req: SinonExpressMock.mockReq;
  let res: SinonExpressMock.mockRes;

  const sessionConfig = config.get<ConfigSession>('session');

  beforeEach(() => {
    req = mockReq();
    res = mockRes();
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('Basic usage', async () => {
    await destroySession(req, res);

    expect(res.cookie).to.be.calledWith(sessionConfig.cookie.name, null);
    expect(res.status).to.be.calledWith(204);
  });
});
