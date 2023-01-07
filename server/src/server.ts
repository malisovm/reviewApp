import { fileURLToPath } from 'url'
import { dirname } from 'path'
import express, { Request, Response } from 'express'
import * as path from 'path'
import mongoose, { ConnectOptions } from 'mongoose'
import { Error as MongooseError } from 'mongoose'
import { User, Review } from './schemas.js'
import { IUser, IReview } from "./interfaces.js";

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const app = express()
mongoose.set('strictQuery', false)
const PORT = process.env.PORT || 3001

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

function averageRate(userRates: { user: string; rate: number }[]) {
  if (userRates.length === 0) return 0
  let sum = 0
  for (const userRate of userRates) {
    sum += userRate.rate
  }
  return sum / userRates.length
}

async function updateUserLikesCount(username: string) {
  let sum = 0
  let reviews = await Review.find({ user: username })
  for (const review of reviews) {
    sum += review.likes.length
  }
  User.findOneAndUpdate(
    { name: username },
    {
      likes: sum,
    },
    (err: MongooseError) => {
      err && console.log(err)
    },
  )
  return sum
}

app.get('/users', (_, res: Response) => {
  User.find({}, (err: MongooseError, docs: IUser[]) => {
    if (err) {
      console.log(err)
      res.status(400).send(JSON.stringify(err))
    } else res.send(docs)
  })
})

app.post('/users/login', JSONParser, async (req: Request, res: Response) => {
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

app.post('/users/newuser', JSONParser, async (req: Request, res: Response) => {
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

app.get('/reviews', (_, res: Response) => {
  Review.find({}, (err: MongooseError, docs: IReview[]) => {
    if (err) {
      console.log(err)
      res.status(400).send(JSON.stringify(err))
    } else res.send(docs)
  })
})

app.post('/reviews', JSONParser, (req: Request, res: Response) => {
  let newReview = new Review(req.body)
  newReview.save().then(() => {
    let message = 'New review posted'
    console.log(message)
    res.send(JSON.stringify(message))
  })
})

app.put('/reviews', JSONParser, (req: Request, res: Response) => {
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
      verdict: updReview.verdict,
      ratings: updReview.ratings,
      avgRate: averageRate(updReview.ratings),
      likes: updReview.likes,
      comments: updReview.comments,
    },
    (err: MongooseError) => {
      if (err) console.log(err)
      else {
        updateUserLikesCount(updReview.user)
        res.send('Review updated')
        console.log('Review updated')
      }
    },
  )
})

app.delete('/reviews', JSONParser, (req: Request, res: Response) => {
  Review.findOneAndDelete({ _id: req.headers._id }, async (err: MongooseError) => {
    if (err) console.log(err)
    else {
      let newLikesCount = await updateUserLikesCount(req.headers.user as string)
      res.send(JSON.stringify({ message: 'Review deleted', newLikesCount: newLikesCount }))
      console.log('Review deleted')
    }
  })
})

app.get('/reviews/search', async (req: Request, res: Response) => {
  if (req.headers.search) {
    let searchQuery = decodeURI(req.headers.search as string)
    let results = await Review.find({ $text: { $search: searchQuery } }).sort({ score: { $meta: 'textScore' } })
    let ids: string[] = []
    results.forEach((review) => ids.push(review._id))
    res.send(JSON.stringify(ids))
  }
})

// this should be after all other endpoints, do not move
app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'client', 'build', 'index.html'))
})
