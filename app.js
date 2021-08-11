const express = require("express");
const mongoConnect = require('./config/db');
const app = express();

mongoConnect();

//init middleware
app.use(express.json({
    extended: true
}))

//define route
app.use('/Api/Users', require('./router/Users'));
app.use('/Api/Posts', require('./router/Posts'));
app.use('/Api/Profile', require('./router/Profile'));
app.use('/Api/Auth', require('./router/Auth'));

app.get("/", (req, res) => {
    res.send('bonni');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));