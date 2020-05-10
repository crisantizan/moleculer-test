import { ServiceSchema, Context } from 'moleculer';
import ApiGateway = require('moleculer-web');
import jwt from 'jsonwebtoken';
const E = ApiGateway.Errors;

const AuthService: ServiceSchema = {
  name: 'auth',
  settings: {
    /** json web token secret key */
    JWT_SECRET: 'thisisasimplejwtsecretkey',
  },
  actions: {
    /** verify JWT */
    verifyToken: {
      cache: {
        keys: ['token'],
        ttl: 60 * 60, // one hour
      },
      params: {
        token: 'string',
      },
      async handler(ctx: Context) {
        return new Promise((resolve, reject) => {
          try {
            const decoded = jwt.verify(
              ctx.params.token,
              this.settings.JWT_SECRET,
            );

            resolve(decoded);
          } catch (error) {
            reject(error);
          }
        });
      },
    },
  },
};

export = AuthService;
