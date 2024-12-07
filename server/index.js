import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
//import todoRouter from './routers/todoRouter.js';
import userRouter from './routers/userRouter.js';
import groupRouter from './routers/groupRouter.js';
import groupContentRouter from './routers/groupContentRouter.js';
import groupMemberRouter from './routers/groupMemberRouter.js';
import groupOwnerRouter from './routers/groupOwnerRouter.js';

dotenv.config();

const port = process.env.PORT

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use('/', todoRouter);
app.use('/', groupRouter);
app.use('/user', userRouter);
app.use('/content', groupContentRouter);
app.use('/manage', groupMemberRouter);
app.use('/manage', groupOwnerRouter);

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use((err,req,res,next) => {
    const statusCode = err.statusCode || 500
    res.status(statusCode).json({error: err.message})
})

app.use((err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({ error: err.message });
    }
    res.status(500).json({ error: 'An unexpected error occurred.' });
});

//app.listen(port)
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});