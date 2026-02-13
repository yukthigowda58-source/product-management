const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  },

  quantity: Number,

  totalPrice: Number,

  paymentMethod: {
    type: String,
    default: "Cash On Delivery"
  },

  status: {
    type: String,
    enum: ["Pending", "Shipped", "Delivered"],
    default: "Pending"
  },

  orderDate: {
    type: Date,
    default: Date.now
  }

})

module.exports = mongoose.model("Order", orderSchema)