const express = require('express')
const Order = require('../models/Order')
const Product = require('../models/Product')
const auth = require('../middleware/auth')

const router = express.Router()

// PLACE ORDER
router.post('/', auth, async (req, res) => {

  const { productId, quantity } = req.body

  const product = await Product.findById(productId)

  if (!product)
    return res.status(404).json({ message: "Product Not Found" })

  const order = new Order({
    userId: req.user.id,
    productId: productId,
    quantity: quantity,
    totalPrice: product.price * quantity
  })

  await order.save()

  res.json({ message: "Order Placed Successfully" })
})

// USER – GET MY ORDERS
router.get('/my', auth, async (req, res) => {

  const orders = await Order.find({ userId: req.user.id })
    .populate("productId")

  res.json(orders)
})

// ADMIN – GET ALL ORDERS
router.get('/', auth, async (req, res) => {

  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Only Admin Can View Orders" })

  const orders = await Order.find()
    .populate("productId")
    .populate("userId")

  res.json(orders)
})

// ADMIN – UPDATE ORDER STATUS
router.put('/:id', auth, async (req, res) => {

  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Only Admin" })

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  )

  res.json(order)
})

// USER – CANCEL ORDER
router.delete('/:id', auth, async (req, res) => {

  const order = await Order.findById(req.params.id)

  if (!order)
    return res.status(404).json({ message: "Order Not Found" })

  if (order.userId.toString() !== req.user.id)
    return res.status(403).json({ message: "Not Allowed" })

  if (order.status !== "Pending")
    return res.status(400).json({ message: "Cannot cancel after processing" })

  await Order.findByIdAndDelete(req.params.id)

  res.json({ message: "Order Cancelled" })
})

module.exports = router