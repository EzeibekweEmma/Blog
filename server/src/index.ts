import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv';
import authRouter from './routes/auth.route';
import usersRouter from './routes/users.route';
import blogRouter from './routes/blog.route';
import newsRouter from './routes/news.route';
import mediaRouter from './routes/media.route';
import config from './config';
import { getServerStatusService } from './utils/server-status.service';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
  const timeouts = {
    GET: 10000,
    DELETE: 15000,
  };

  if (!excludedMethods.includes(req.method)) {
    res.setTimeout(timeouts[req.method as keyof typeof timeouts] || 20000, () => {
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
app.use('/api/news', newsRouter);
app.use('/api/media-upload', mediaRouter);

app.listen(config.app.PORT, async () => {
  mongoose
    .connect(config.db.url as string)
    .then(() => console.log('MongoDB is Connected'))
    .catch((err) => console.error(err));

  console.log(`Server is running at http://localhost:${config.app.PORT}`)
})