import * as chai from 'chai';
import * as config from 'config';
import { SessionHelper } from './../../src/helpers/session';
import { ConfigSessionToken, UserSession } from '../../src/interfaces';
import { userFix } from '../fixtures';

const expect = chai.expect;

describe('Session Hanlder', () => {
  let sessionHelper: SessionHelper;
  const sessionTokenConfig = config.get<ConfigSessionToken>('session.token');
  const { secret, ...createOpts } = sessionTokenConfig;

  beforeEach(() => {
    sessionHelper = new SessionHelper(sessionTokenConfig.secret);
  });

  it('Can create', () => {
    expect(sessionHelper).to.be.instanceof(SessionHelper);
  });

  it('Create token and verify', async () => {
    const payload = { userId: userFix.id };
    const token = await sessionHelper.create<UserSession>(payload, createOpts);
    expect(token).to.be.string;

    const expectedPayload = await sessionHelper.verify<UserSession>(token);
    expect(expectedPayload.userId).to.be.eql(payload.userId);
  });
});
