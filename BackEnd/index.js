const express = require('express');
const mongoose = require('mongoose');

const fileUpload = require('express-fileupload');
require('dotenv').config();
const cors = require('cors');
const userRouter = require('./routes/user.route');
const productRoute = require('./routes/product.route');
const orderRoute = require('./routes/order.route');



const app = express();
app.use(cors({
    origin:"*"
}))

app.use(express.json());
app.use(fileUpload({
    useTempFiles:true
}))

app.use('/user', userRouter);
app.use('/product',productRoute);
app.use('/order', orderRoute);

app.get('/', (req, res) => {
    res.json({ msg: "Welcome to home page" });
});

// Connect to MongoDB and Start the Server
mongoose.connect('mongodb+srv://nitishKumar:AgroFix@cluster0.f9dsu.mongodb.net/AgroFix?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("Connected to MongoDB successfully");

    app.listen(8080, () => {
        console.log("Server is started at port 8080");
    });
})
.catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
});