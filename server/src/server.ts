import { fileURLToPath } from 'url'
import { dirname } from 'path'
import express, { Request, Response } from 'express'
import * as path from 'path'
import mongoose, { ConnectOptions } from 'mongoose'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const app = express()
const Schema = mongoose.Schema
mongoose.set('strictQuery', false)
const PORT = process.env.PORT || 3001

interface IReview {
  _id?: string
  title: string
  product: string
  group: string
  tags?: string[]
  text: string
  pic?: string
  rating: number
  date: string
}

const usersScheme = new Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
})
const User = mongoose.model('User', usersScheme)

const reviewsScheme = new Schema({
  _id: { type: String, required: true },
  title: { type: String, required: true },
  product: { type: String, required: true },
  group: { type: String, required: true },
  tags: [String],
  text: { type: String, required: true },
  pic: { type: String },
  rating: { type: Number, required: true },
  user: { type: String, required: true },
  date: { type: String, required: true },
})
const Review = mongoose.model('Review', reviewsScheme)

app.use(express.static(path.join(__dirname, '..', '..', 'client', 'build')))
const JSONParser = express.json({ type: 'application/json' })
mongoose.connect(
  //'mongodb+srv://user12345:12345@cluster1.mgmwwie.mongodb.net/manageUsers',
  'mongodb://localhost:27017/',
  { useNewUrlParser: true, useUnifiedTopology: true } as ConnectOptions,
  (err) => {
    if (err) console.log(err)
    else if (mongoose.connection.readyState === 1) {
      console.log('Mongoose connection established')
      app.listen(PORT, () => console.error(`The server is up at PORT ${PORT}`))
    }
  },
)

app.get('/users', (_, res) => {
  User.find({}, (err: any, docs: any) => {
    if (err) {
      console.log(err)
      res.status(400).send(JSON.stringify(err))
    } else res.send(docs)
  })
})

app.post('/users/login', JSONParser, async (req, res) => {
  let user = new User(req.body)
  let existingUser = await User.findOne({
    name: { $eq: user.name },
  }).exec()
  if (existingUser && user.password === existingUser.password) {
    res.send(JSON.stringify({ message: `Logged in as ${user.name}`, role: existingUser.role }))
  } else if (!existingUser) {
    res.status(400).send(JSON.stringify(`The username doesn't exist`))
  } else if (user.password !== existingUser.password) {
    res.status(400).send(JSON.stringify(`Wrong password`))
  }
})

app.post('/users/newuser', JSONParser, async (req, res) => {
  let newUser = new User(req.body)
  let existingUser = await User.findOne({
    name: { $eq: newUser.name },
  }).exec()
  if (!existingUser) {
    newUser.save().then(() => {
      let message = 'New account created'
      console.log(message)
      res.status(200).send(JSON.stringify(message))
    })
  } else res.status(400).send('Username already exists')
})

app.get('/reviews', (_, res) => {
  Review.find({}, (err: any, docs: any) => {
    if (err) {
      console.log(err)
      res.status(400).send(JSON.stringify(err))
    } else res.send(docs)
  })
})

app.post('/reviews', JSONParser, (req, res) => {
  let newReview = new Review(req.body)
  newReview.save().then(() => {
    let message = 'new review posted'
    console.log(message)
    res.send(JSON.stringify(message))
  })
})

app.put('/reviews', JSONParser, (req, res) => {
  let updReview: IReview = req.body
  Review.findOneAndUpdate(
    { _id: updReview._id },
    {
      title: updReview.title,
      product: updReview.product,
      group: updReview.group,
      tags: updReview.tags,
      text: updReview.text,
      pic: updReview.pic,
      rating: updReview.rating,
    },
    (err: any) => {
      if (err) console.log(err)
      else {
        res.send('Review updated')
        console.log('Review updated')
      }
    },
  )
})

app.delete('/reviews', JSONParser, (req, res) => {
  Review.findOneAndDelete({ _id: req.headers._id }, (err: any) => {
    if (err) console.log(err)
    else {
      res.send('Review deleted')
      console.log('Review deleted')
    }
  })
})

app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'client', 'build', 'index.html'))
})
