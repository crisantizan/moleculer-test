import { ServiceSchema, Context } from 'moleculer';
import ApiGateway = require('moleculer-web');
const E = ApiGateway.Errors;

const ApiService: ServiceSchema = {
  name: 'api',

  mixins: [ApiGateway],

  // More info about settings: https://moleculer.services/docs/0.13/moleculer-web.html
  settings: {
    port: process.env.PORT || 3000,

    routes: [
      {
        path: '/api',
        // set authorization throught «Bearer» header
        authorization: true,
        // set cors headers
        cors: true,
        // parse body content
        bodyParser: {
          json: {
            strict: false,
          },
          urlencoded: {
            extended: false,
          },
        },
        whitelist: [
          // Access to any actions in all services under "/api" URL
          '**',
        ],
      },
    ],

    // Serve assets from "public" folder
    assets: {
      folder: 'public',
    },
  },

  methods: {
    /** authorize the request */
    async authorize(ctx: Context, route: any, req: any) {
      // if the current request doesn't require auth
      if (!req.$action.auth) {
        return true;
      }

      // authentication required
      const header = req.headers.authorization as string;

      if (!header) {
        throw new E.UnAuthorizedError(E.ERR_NO_TOKEN, null);
      }

      const [type, token] = header.split(' ');

      if (type.toLocaleLowerCase() !== 'bearer') {
        throw new E.UnAuthorizedError(
          E.ERR_INVALID_TOKEN,
          `Token should be of bearer type, not '${type.toLocaleLowerCase()}'`,
        );
      }

      if (!token) {
        throw new E.UnAuthorizedError(E.ERR_NO_TOKEN, null);
      }

      // validate token
    },
  },
};

export = ApiService;
