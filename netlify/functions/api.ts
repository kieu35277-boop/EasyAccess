import express from 'express';
import serverless from 'serverless-http';
import { createApiApp } from '../../server/app';

const wrapper = express();

wrapper.use((req, _res, next) => {
  if (req.url.startsWith('/.netlify/functions/api')) {
    req.url = req.url.replace(/^\/\.netlify\/functions\/api/, '') || '/';
  }
  if (!req.url.startsWith('/api')) {
    req.url = `/api${req.url.startsWith('/') ? '' : '/'}${req.url}`;
  }
  next();
});

wrapper.use(createApiApp());

export const handler = serverless(wrapper);
