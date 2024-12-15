import express, { Application } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.routes';
import dogRouter from './routes/dog.routes';

const app: Application = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(express.static(path.join(__dirname, '../public')));

// Define a route for /login to serve the login.html file
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
  });

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/signup.html'));
  });  

app.get('/dogs-page', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/dog.html'));
  });

app.use('/users', userRouter);
app.use('/dogs', dogRouter);

export default app;
