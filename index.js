const express = require('express');

const app = express();
require('dotenv').config();
const process = require('process');
const fs = require('fs');
const swaggerUI = require('swagger-ui-express');
const pino = require('pino-http');

const userRouter = require('./src/routes/v1/userRoute');
const softwareRouter = require('./src/routes/v1/softwareRoute');
const loginRouter = require('./src/routes/v1/loginRoute');
const db = require('./src/database/models');
const userSoftwareRouter = require('./src/routes/v1/userSoftwareRoute');
const swagger = require('./src/swagger/v1');
const errorHandler = require('./src/middleware/errorHandler');

const swaggerCss = fs.readFileSync(
  `${process.cwd()}/src/utils/swagger.css`,
  'utf8'
);
const userSkillRouter = require('./src/routes/v1/userSkillRoute');
const CheckListRouter = require('./src/routes/v1/checkListRoute');
const healthCheck = require('./src/routes/v1/healthCheck');
const branchRouter = require('./src/routes/v1/branch');

const port = process.env.PORT || 4000;

app.use(express.json());
app.use(pino());
db.sequelize.sync({ logging: false });

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  next();
});

app.use('/v1', [
  loginRouter,
  userRouter,
  softwareRouter,
  CheckListRouter,
  userSoftwareRouter,
  userSkillRouter,
  branchRouter,
]);
app.use(healthCheck);

app.use(
  '/api-docs',
  swaggerUI.serve,
  swaggerUI.setup(swagger, { customCss: swaggerCss })
);

app.use(errorHandler);
app.listen(port);
