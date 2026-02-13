const express = require('express')
const Product = require('../models/Product')
const auth = require('../middleware/auth')

const router = express.Router()

router.post('/', auth, async (req, res) => {

  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Only Admin" })

  const product = new Product(req.body)
  await product.save()
  res.json(product)
})

router.get('/', auth, async (req, res) => {

  let { page, search, sort } = req.query

  page = parseInt(page) || 1
  const limit = 5
  const skip = (page - 1) * limit

  let query = {}

  if (search)
    query.name = { $regex: search, $options: "i" }

  let sortQuery = {}

  if (sort === "asc") sortQuery.price = 1
  if (sort === "desc") sortQuery.price = -1

  const products = await Product.find(query)
    .sort(sortQuery)
    .skip(skip)
    .limit(limit)

  const total = await Product.countDocuments(query)

  res.json({
    products,
    totalPages: Math.ceil(total / limit)
  })
})

router.put('/:id', auth, async (req, res) => {

  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Only Admin" })

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  )

  res.json(product)
})

router.delete('/:id', auth, async (req, res) => {

  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Only Admin" })

  await Product.findByIdAndDelete(req.params.id)

  res.json({ message: "Deleted" })
})

module.exports = router