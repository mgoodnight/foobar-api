import { Algorithm } from 'jsonwebtoken';

export interface ConfigLogger {
  format: string;
}

export interface ConfigServer {
  port: number;
}

export interface ConfigSession {
  token: ConfigSessionToken;
  cookie: ConfigSessionCookie;
  locals: ConfigSessionLocals;
}

export interface ConfigSessionCookie {
  name: string;
  settings: ConfigSessionCookieSettings;
}

export interface ConfigSessionCookieSettings {
  httpOnly: boolean;
  maxAge: number;
  sameSite: boolean;
  secure: boolean;
}

export interface ConfigSessionLocals {
  userId: string;
}

export interface ConfigSessionToken {
  secret: string;
  expiresIn: number;
  algorithm: Algorithm;
  audience: string;
  issuer: string;
  subject: string;
}
