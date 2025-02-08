import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import Router from '@/routes';
import ServerStatus from './routes/server-status.route';
import config from '@/config';
import connectDB from '@/lib/connectDB';
import User from '@/models/user.model'; // Import User model
import bcrypt from 'bcryptjs';

dotenv.config();

const app: Express = express();

app.use(cors());
app.use(
  bodyParser.json({
    limit: '50mb',
  })
);
app.use((req, res, next) => {
  const excludedMethods = ['POST', 'PUT', 'PATCH'];

  if (!excludedMethods.includes(req.method)) {
    res.setTimeout(20000, () => {
      res.status(408).json({ error: 'Request timed out' });
    });
    next();
  } else {
    next();
  }
});

app.use(ServerStatus);
app.use('/api', Router);

const createAdminUser = async () => {
  try {
    const existingAdmin = await User.findOne({ email: config.app.email });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const adminUser = new User({
        name: 'Admin',
        email: config.app.email,
        password: hashedPassword,
      });
      await adminUser.save();
      console.log('Admin user created successfully');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

app.listen(config.app.PORT, async () => {
  await connectDB();
  console.log(`Server is running at http://localhost:${config.app.PORT}`);
  await createAdminUser();
});
