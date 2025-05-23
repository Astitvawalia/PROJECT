// index.js

const restify = require('restify');
const path = require('path');
const YAML = require('yamljs');
const OpenAPIBackend = require('openapi-backend').default;
const swaggerUi = require('swagger-ui-restify');
const db = require('./models');


const authController = require('./api/controllers/auth');
const employeeController = require('./api/controllers/employees');
const reportController = require('./api/controllers/reports');

const jwtAuth = require('./middleware/jwtAuth');

const apiSpecPath = path.join(__dirname, 'api', 'swagger.yaml');
const definition = YAML.load(apiSpecPath);

const api = new OpenAPIBackend({ definition });

// Register all handlers at once, mapping operationIds to controller functions
api.register({
  // Auth endpoints
  login: (c, req, res) => {
    req.path = req.getPath();
    return authController.loginUser(req, res, () => {});
  },
  listEmployees: (c, req, res) => {
    req.path = req.getPath();
    return employeeController.listEmployees(req, res, () => {});
  },
  addCollection: (c, req, res) => {
    req.path = req.getPath();
    return employeeController.addCollection(req, res, () => {});
  },
  addDeposit: (c, req, res) => {
    req.path = req.getPath();
    return employeeController.addDeposit(req, res, () => {});
  },
  getOutstandingReport: (c, req, res) => {
    req.path = req.getPath();
    return reportController.getOutstandingReport(req, res, () => {});
  },
  getPaymentReport: (c, req, res) => {
    req.path = req.getPath();
    return reportController.getPaymentReport(req, res, () => {});
  },
  // Error handlers
  notFound: (c, req, res) => res.send(404, { message: 'Not found' }),
  validationFail: (c, req, res) =>
    res.send(400, { message: 'Validation error', errors: c.validation.errors }),
});

api.init();

const app = restify.createServer();
app.use(restify.plugins.bodyParser());

// Serve Swagger UI at /api-docs
app.get('/api-docs/*', ...swaggerUi.serve);
app.get('/api-docs', (req, res, next) => {
  swaggerUi.setup(definition, { baseURL: 'api-docs' })(req, res, next);
});

// Public route (no JWT required)
app.post('/auth/login', (req, res, next) => {
  req.path = req.getPath();
  api.handleRequest(req, req, res);
});

// Protected routes helper
function protectedRoute(handler) {
  return (req, res, next) => {
    req.path = req.getPath();
    jwtAuth(req, res, (err) => {
      if (err === false) return; 
      handler(req, res, next);
    });
  };
}


app.get('/employees', protectedRoute((req, res, next) => {
  api.handleRequest(req, req, res);
}));
app.post('/employees/:id/collection', protectedRoute((req, res, next) => {
  api.handleRequest(req, req, res);
}));
app.post('/employees/:id/deposit', protectedRoute((req, res, next) => {
  api.handleRequest(req, req, res);
}));
app.get('/reports/outstanding', protectedRoute((req, res, next) => {
  api.handleRequest(req, req, res);
}));
app.get('/reports/payment-details', protectedRoute((req, res, next) => {
  api.handleRequest(req, req, res);
}));

// Catch-all for not found
app.on('NotFound', (req, res) => res.send(404, { message: 'Not found' }));

// (Optional) Sync Sequelize models before starting server
// db.sequelize.sync({ alter: true }).then(() => {
  app.listen(8081, () => {
    console.log('Restify server running at http://localhost:8081');
    console.log('Swagger UI available at http://localhost:8081/api-docs');
  });
// }).catch(err => {
//   console.error('Failed to sync database:', err);
// }
// );

