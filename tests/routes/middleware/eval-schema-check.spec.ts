import * as chai from 'chai';
import * as sinon from 'sinon';
import * as SinonChai from 'sinon-chai';
import * as SinonExpressMock from 'sinon-express-mock';
import * as ExpressValidator from 'express-validator';

import { evalSchemaCheck } from '../../../src/routes/middleware/eval-schema-check';

chai.use(SinonChai);

const expect = chai.expect;
const mockReq = SinonExpressMock.mockReq;
const mockRes = SinonExpressMock.mockRes;

describe('Eval schema check middleware', () => {
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
    const validateArrayStub = { array: () => { return []; } };
    sinon.stub(ExpressValidator, 'validationResult').returns(validateArrayStub as any);

    evalSchemaCheck(req, res, next);

    expect(next).to.be.called;
  });
});
