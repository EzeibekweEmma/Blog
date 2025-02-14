import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv';
import authRouter from './routes/auth.route';
import usersRouter from './routes/users.route';
import blogRouter from './routes/blog.route';
import config from './config';
import { getServerStatusService } from './utils/server-status.service';

dotenv.config();

const app = express();

app.use(cors(
  {
    origin: config.app.FE_BASE_URL,
    credentials: true,
  }
))
app.use(
  bodyParser.json({
    limit: '50mb',
  })
)
app.use((req, res, next) => {
  const excludedMethods = ['POST', 'PUT', 'PATCH']

  if (!excludedMethods.includes(req.method)) {
    res.setTimeout(20000, () => {
      res.status(408).json({ error: 'Request timed out' })
    })
    next()
  } else {
    next()
  }
})

// Routes setup
app.get('/', getServerStatusService);
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/blogs', blogRouter);

app.listen(config.app.PORT, async () => {
  mongoose
    .connect(config.db.url as string)
    .then(() => console.log('MongoDB is Connected'))
    .catch((err) => console.error(err));

  console.log(`Server is running at http://localhost:${config.app.PORT}`)
})