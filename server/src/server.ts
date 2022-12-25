import { fileURLToPath } from 'url'
import { dirname } from 'path'
import express, { Request, Response } from 'express'
import * as path from 'path'
import mongoose, { ConnectOptions } from 'mongoose'
import { getDate } from './utility.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const app = express()
const Schema = mongoose.Schema
mongoose.set('strictQuery', false)
const PORT = process.env.PORT || 3001

interface IReview {
  _id: string
  title: string
  product: string
  group: string
  tags?: string[]
  text: string
  pic?: string
  verdict: number
  user: string
  date: string
  ratings: { user: string; rate: number }[]
  likes: string[]
  avgRate?: number
  comments: { user: string; text: string }[]
}

interface IUser {
  _id: string
  name: string
  password: string
  role: string
  likes: number
}

const usersScheme = new Schema<IUser>({
  name: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: 'user' },
  likes: { type: Number, required: true, default: 0 },
})
const User = mongoose.model<IUser>('User', usersScheme)

const reviewsScheme = new Schema<IReview>({
  title: { type: String, required: true },
  product: { type: String, required: true },
  group: { type: String, required: true },
  tags: [String],
  text: { type: String, required: true },
  pic: { type: String },
  verdict: { type: Number, required: true },
  user: { type: String, required: true },
  date: { type: String, required: true, default: getDate() },
  ratings: [{ type: { user: String, rate: Number }, required: true, default: [] }],
  avgRate: { type: Number, required: true, default: 0 },
  likes: { type: [String], required: true, default: [] },
  comments: [{ type: { user: String, text: String }, required: true, default: [] }],
})
const Review = mongoose.model<IReview>('Review', reviewsScheme)

function averageRate(userRates: { user: string; rate: number }[]) {
  if (userRates.length === 0) return 0
  let sum = 0
  for (const userRate of userRates) {
    sum += userRate.rate
  }
  return sum / userRates.length
}

async function updateLikesCount(user: string) {
  let sum = 0
  let reviews: IReview[] = await Review.find({ user: user })
  for (const review of reviews) {
    sum += review.likes.length
  }
  return sum
}

app.use(express.static(path.join(__dirname, '..', '..', 'client', 'build')))
const JSONParser = express.json({ type: 'application/json' })
mongoose.connect(
  'mongodb+srv://user12345:12345@cluster1.mgmwwie.mongodb.net/ratingApp',
  //'mongodb://localhost:27017/',
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
    res.send(
      JSON.stringify({ message: `Logged in as ${user.name}`, role: existingUser.role, likes: existingUser.likes }),
    )
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
    let message = 'New review posted'
    console.log(message)
    res.send(JSON.stringify(message))
  })
})

app.put('/reviews', JSONParser, async (req, res) => {
  let updReview: IReview = req.body
  console.log(updReview)
  Review.findOneAndUpdate(
    { _id: updReview._id },
    {
      title: updReview.title,
      product: updReview.product,
      group: updReview.group,
      tags: updReview.tags,
      text: updReview.text,
      pic: updReview.pic,
      verdict: updReview.verdict,
      ratings: updReview.ratings,
      avgRate: averageRate(updReview.ratings),
      likes: updReview.likes,
      comments: updReview.comments
    },
    (err: any) => {
      if (err) console.log(err)
      else {
        res.send('Review updated')
        console.log('Review updated')
      }
    },
  )
  User.findOneAndUpdate(
    { name: updReview.user },
    {
      likes: await updateLikesCount(updReview.user),
    },
    (err: any) => {
      if (err) console.log(err)
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
