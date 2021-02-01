import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import { createConnection } from 'typeorm';
import * as helmet from 'helmet';
import * as config from 'config';

import routes from './routes';
import { ConfigServer } from './interfaces/config';

/**
 * Setup API Express app
 *
 * @export
 * @class Server
 */
export class Server {
  /**
   * Express application
   *
   * @protected
   * @type {express.Application}
   * @memberof Server
   */
  protected app: express.Application;

  /**
   * Creates an instance of Server.
   * @memberof Server
   */
  constructor() {
    this.app = express();

    this.app.use(bodyParser.json());
    this.app.use(cookieParser());

    // Helmet bits
    this.app.use(helmet.dnsPrefetchControl());
    this.app.use(helmet.frameguard());
    this.app.use(helmet.hidePoweredBy());
    this.app.use(helmet.ieNoOpen());
    this.app.use(helmet.noSniff());
    this.app.use(helmet.xssFilter());

    // Fallback error handling
    this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      if (err) {
        console.error(err);
        return res.sendStatus(500);
      }

      next();
    });

    // Routes
    this.app.use(routes);
  }

  /**
   * Creates a database connection and starts the application
   *
   * @memberof Server
   */
  public start() {
    createConnection().then(async connection => {
      const port = config.get<ConfigServer>('server').port;
      this.app.listen(port, () => console.log(`Server listening on port ${port}`));
    }).catch(err => {
      console.error('TypeORM connection error', err);
    });
  }
}
