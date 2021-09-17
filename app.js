const express = require('express');
const connectDB = require('./config/config')
const app = express();

//connect DB
connectDB();

//initialize middleware
app.use(express.json({
    extended: false
}))

app.get('/', (req, res) => {
    res.send("Server is up");
})

//define route
app.use('/api/users', require('./router/api/users'));
app.use('/api/auth', require('./router/api/auth'));
app.use('/api/post', require('./router/api/post'));
app.use('/api/profile', require('./router/api/profile'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})