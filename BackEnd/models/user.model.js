const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, 
    role: { type: String, enum: ['buyer', 'admin'], default: 'buyer' },
    cart:[
          {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number },
          },
        ],
});

const userModel = mongoose.model('User', userSchema)

module.exports = userModel