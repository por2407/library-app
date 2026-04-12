const express = require('express');
const cookieParser = require('cookie-parser');
const corsMiddleware = require('./config/cors');
const authRoute = require('./routes/authRoute');
const booksRoute = require('./routes/booksRoute');
const categoryRoute = require('./routes/categoryRoute');
const authorsRoute = require('./routes/authorsRoute');
const adminRoute = require('./routes/adminRoutes');



function createApp() {
const app = express();

app.use(corsMiddleware);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/auth', authRoute);
app.use('/books', booksRoute);
app.use('/categories', categoryRoute);
app.use('/authors', authorsRoute);
app.use('/admin', adminRoute);
app.get("/test", (req, res) => {
    res.json({ message: "Hello World!" });
})

app.use((err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).json({ message: err.message || 'Internal Server Error' });
});

return app;
}

module.exports = createApp;