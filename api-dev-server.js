import express from 'express';
import indexHandler from './api/categories/index.js';
import slugOrIdHandler from './api/categories/[slugOrId].js';

const app = express();
app.use(express.json());

// Request adapter to map Express requests and responses to Vercel format
const adapt = (handler) => async (req, res) => {
  req.query = { ...req.query, ...req.params };
  
  const originalStatus = res.status.bind(res);
  const statusObject = {
    json: (data) => res.json(data),
    send: (data) => res.send(data),
    setHeader: (name, val) => res.setHeader(name, val),
  };
  res.status = (code) => {
    originalStatus(code);
    return statusObject;
  };
  res.setHeader = (name, val) => {
    res.set(name, val);
    return res;
  };

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

const port = 3000;
app.listen(port, () => {
  console.log(`\n======================================================`);
  console.log(`  Local Serverless API Gateway: http://localhost:${port}`);
  console.log(`======================================================\n`);
});
