const mongoose = require('mongoose')


const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    deliveryAddress: { type: String, required: true },
    contactInfo: { type: String, required: true },
    orderItems: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
      },
    ],
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Delivered'],
      default: 'Pending',
    },
});

const orderModel = mongoose.model("Order", orderSchema)

module.exports = orderModel;