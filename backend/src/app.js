const express = require('express');
const cookieParser = require('cookie-parser');
const authRoute = require('./routes/authRoute');



function createApp() {
const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/auth', authRoute);
app.get("/test", (req, res) => {
    res.json({ message: "Hello World!" });
})

return app;
}

module.exports = createApp;