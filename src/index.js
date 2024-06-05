import http from 'http';
import { Server } from 'socket.io';
import db from './utils/db';
import express from 'express';
import cors from 'cors';
import userRouter from './routes/user.routes';
import chatRouter from './routes/chat.routes';
import messageRouter from './routes/message.routes';
import postRouter from './routes/post.routes';
import commentRouter from './routes/comment.routes';
import { apiErrorHandler } from './utils/handlers';
import authRouter from './routes/auth.routes';
import socketEvents from './utils/socket';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    }
})
socketEvents(io);

app.use(express.json());

app.use(cors());

app.get('/api/status', (req, res) => {
    res.json({ status: 'OK' });
});

// to be removed before production
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<

app.get('/api/all', async (req, res) => {
    res.json({
        users: await db.model('User').find(),
        posts: await db.model('Post').find(),
        comments: await db.model('Comment').find(),
        chats: await db.model('Chat').find(),
        messages: await db.model('Message').find(),
    })
})

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// The auth routes
app.use('/api/auth', authRouter);

// The user routes
app.use('/api/users', userRouter);

// The post routes
app.use('/api/posts', postRouter);

// The comment routes
app.use('/api/comments', commentRouter);

// The chat routes
app.use('/api/chats', chatRouter);

// The message routes
app.use('/api/messages', messageRouter);

// The error handler
app.use(apiErrorHandler);


const port = process.env.PORT || 4;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
