// import express from 'express';
// import bodyParser from 'body-parser';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import dbConnection from './config/db_connection.js';
// import userRouter from './routes/userRoutes.js';
// import messageRouter from './routes/messageRoutes.js';
// import { app, server } from './config/socket.js';


// // const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// // configs
// dotenv.config();
// dbConnection();

// // routes
// app.use('/users', userRouter)
// app.use('/messages', messageRouter);

// const PORT = process.env.PORT || 5000;

// server.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// })


import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import next from 'next';

import dbConnection from './config/db_connection.js';
import userRouter from './routes/userRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import { app as socketApp, server } from './config/socket.js';

// Make __dirname work with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
    try {
        dotenv.config();
        dbConnection();

        // Express Middleware
        socketApp.use(cors());
        socketApp.use(bodyParser.json());

        // Express Routes
        socketApp.use('/users', userRouter);
        socketApp.use('/messages', messageRouter);

        // Init Next.js
        const dev = process.env.NODE_ENV !== 'production';
        const nextApp = next({ dev, dir: '../frontend' });
        const handle = nextApp.getRequestHandler();

        await nextApp.prepare(); // wait for Next.js to be ready
        console.log("Next.js is ready");

        // Let Next.js handle all unmatched routes
        socketApp.all('*', (req, res) => {
            return handle(req, res);
        });

        const PORT = process.env.PORT || 5000;
        server.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error("Server failed to start:", err);
    }
})();
