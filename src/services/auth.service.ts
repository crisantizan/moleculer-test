import { ServiceSchema, Context } from 'moleculer';
import jwt from 'jsonwebtoken';
import { Userlogin } from '../types/auth-service.type';

const AuthService: ServiceSchema = {
  name: 'auth',
  settings: {
    /** json web token secret key */
    JWT_SECRET: 'thisisasimplejwtsecretkey',
    /** endpoint base */
    rest: '/auth',
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
    /** user login */
    login: {
      rest: 'POST /login',
      params: {
        email: { type: 'email' },
        password: { type: 'string', min: 6 },
      },
      async handler(ctx: Context) {
        const user = ctx.params as Userlogin;

        return {
          user,
          token: this.createToken(user),
        };
      },
    },
  },

  methods: {
    /** create token [15 days] */
    createToken(user: Userlogin) {
      return jwt.sign(user, this.settings.JWT_SECRET, { expiresIn: '15d' });
    },
  },
};

export = AuthService;
