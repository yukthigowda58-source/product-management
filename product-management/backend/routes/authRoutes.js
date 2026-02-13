const express = require('express')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const router = express.Router()

router.post('/register', async (req, res) => {

  const hash = await bcrypt.hash(req.body.password, 10)

  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hash,
    role: req.body.role
  })

  await user.save()

  res.json({ message: "Registered" })
})

router.post('/login', async (req, res) => {

  const user = await User.findOne({ email: req.body.email })

  if (!user)
    return res.status(400).json({ message: "User Not Found" })

  const valid = await bcrypt.compare(req.body.password, user.password)

  if (!valid)
    return res.status(400).json({ message: "Invalid Password" })

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET
  )

  res.json({ token, role: user.role })
})

module.exports = router