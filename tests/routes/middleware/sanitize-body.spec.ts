import * as chai from 'chai';
import * as sinon from 'sinon';
import * as SinonChai from 'sinon-chai';
import * as SinonExpressMock from 'sinon-express-mock';

import { sanitizeBody } from '../../../src/routes/middleware/sanitize-body';

chai.use(SinonChai);

const expect = chai.expect;
const mockReq = SinonExpressMock.mockReq;
const mockRes = SinonExpressMock.mockRes;

describe('Santize request body middleware', () => {
  let sandbox: sinon.SinonSandbox;
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
    sanitizeBody(req, res, next);

    expect(next).to.be.called;
  });
});
