import express from 'express';
import indexHandler from './api/categories/index.js';
import slugOrIdHandler from './api/categories/[slugOrId].js';
import loginHandler from './api/auth/login.js';
import customerProfileHandler from './api/customer/profile.js';
import contractorProfileHandler from './api/contractor/profile.js';
import providersIndexHandler from './api/providers/index.js';
import providersProfileHandler from './api/providers/profile.js';
import providersDetailHandler from './api/providers/[id]/index.js';
import providersVerifyHandler from './api/providers/[id]/verify.js';
import providersFeatureHandler from './api/providers/[id]/feature.js';
import providersStatusHandler from './api/providers/[id]/status.js';
import requirementsIndexHandler from './api/requirements/index.js';
import requirementsMyHandler from './api/requirements/my.js';
import requirementsDetailHandler from './api/requirements/[id].js';

const app = express();
app.use(express.json());

// Request adapter to map Express requests and responses to Vercel format
const adapt = (handler) => async (req, res) => {
  Object.assign(req.query, req.params);
  try {
    await handler(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

app.get('/api/categories', adapt(indexHandler));
app.post('/api/categories', adapt(indexHandler));
app.get('/api/categories/:slugOrId', adapt(slugOrIdHandler));
app.put('/api/categories/:slugOrId', adapt(slugOrIdHandler));
app.delete('/api/categories/:slugOrId', adapt(slugOrIdHandler));
app.post('/api/auth/login', adapt(loginHandler));
app.get('/api/customer/profile', adapt(customerProfileHandler));
app.post('/api/customer/profile', adapt(customerProfileHandler));
app.put('/api/customer/profile', adapt(customerProfileHandler));
app.get('/api/contractor/profile', adapt(contractorProfileHandler));
app.post('/api/contractor/profile', adapt(contractorProfileHandler));
app.put('/api/contractor/profile', adapt(contractorProfileHandler));
app.get('/api/providers', adapt(providersIndexHandler));
app.get('/api/providers/profile', adapt(providersProfileHandler));
app.post('/api/providers/profile', adapt(providersProfileHandler));
app.put('/api/providers/profile', adapt(providersProfileHandler));
app.get('/api/providers/:id', adapt(providersDetailHandler));
app.patch('/api/providers/:id/verify', adapt(providersVerifyHandler));
app.patch('/api/providers/:id/feature', adapt(providersFeatureHandler));
app.patch('/api/providers/:id/status', adapt(providersStatusHandler));
app.post('/api/requirements', adapt(requirementsIndexHandler));
app.get('/api/requirements/my', adapt(requirementsMyHandler));
app.get('/api/requirements/:id', adapt(requirementsDetailHandler));

const port = 3000;
app.listen(port, () => {
  console.log(`\n======================================================`);
  console.log(`  Local Serverless API Gateway: http://localhost:${port}`);
  console.log(`======================================================\n`);
});
