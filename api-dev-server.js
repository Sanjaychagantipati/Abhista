import express from 'express';
import indexHandler from './api/categories/index.js';
import slugOrIdHandler from './api/categories/[slugOrId].js';
import loginHandler from './api/auth/login.js';
import customerProfileHandler from './api/customer/profile.js';
import contractorProfileHandler from './api/contractor/profile.js';
import professionalsIndexHandler from './api/professionals/index.js';
import professionalsProfileHandler from './api/professionals/profile.js';
import professionalsDetailHandler from './api/professionals/[id]/index.js';
import professionalsVerifyHandler from './api/professionals/[id]/verify.js';
import professionalsFeatureHandler from './api/professionals/[id]/feature.js';
import professionalsStatusHandler from './api/professionals/[id]/status.js';

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
app.get('/api/professionals', adapt(professionalsIndexHandler));
app.get('/api/professionals/profile', adapt(professionalsProfileHandler));
app.post('/api/professionals/profile', adapt(professionalsProfileHandler));
app.put('/api/professionals/profile', adapt(professionalsProfileHandler));
app.get('/api/professionals/:id', adapt(professionalsDetailHandler));
app.patch('/api/professionals/:id/verify', adapt(professionalsVerifyHandler));
app.patch('/api/professionals/:id/feature', adapt(professionalsFeatureHandler));
app.patch('/api/professionals/:id/status', adapt(professionalsStatusHandler));

const port = 3000;
app.listen(port, () => {
  console.log(`\n======================================================`);
  console.log(`  Local Serverless API Gateway: http://localhost:${port}`);
  console.log(`======================================================\n`);
});
