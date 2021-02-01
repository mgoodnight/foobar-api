export default {
  server: {
    port: 3003
  },
  session: {
    token: {
      secret: 'foobar',
      expiresIn: 300,
      algorithm: 'HS256',
      audience: 'foobar-users',
      issuer: 'foobar-backend-api',
      subject: 'users'
    },
    cookie: {
      name: 'foobar-session',
      settings: {
        httpOnly: true,
        maxAge: 2592000000, // 30 days
        sameSite: true,
        secure: false
      }
    },
    locals: {
      userId: 'userId'
    }
  },
  logger: {
    format: '[:date[web]] \':method :url\' :status :response-time ms'
  }
};
