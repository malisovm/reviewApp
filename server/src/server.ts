import { fileURLToPath } from 'url'
import { dirname } from 'path'
import express, { Request, Response } from 'express'
import * as path from 'path'
import mongoose, { ConnectOptions } from 'mongoose'
import { Error as MongooseError } from 'mongoose'
import { User, Review } from './schemas.js'
import { IUser, IReview, IUserResponse, IUserDocument } from './interfaces.js'
import passport from 'passport'
import session from 'express-session'
import jwt from 'jsonwebtoken'

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

const secret = 'bla bla bla'

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: secret,
  }),
)
app.use(passport.initialize())
app.use(passport.session())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
passport.use(User.createStrategy()) // 'local' strategy

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
  let reviews = await Review.find({ username: username })
  for (const review of reviews) {
    sum += review.likes.length
  }
  User.findOneAndUpdate(
    { username: username },
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

app.post('/users/login', JSONParser, (req, res) => {
  passport.authenticate('local', (err, user) => {
    if (err) {
      res.json('Authentication error:' + err)
    } else {
      if (!user) {
        res.status(400).json('Incorrect username or password')
      } else {
        const token = jwt.sign({ userId: user._id }, secret, { expiresIn: '24h' })
        res.json({
          message: `Logged in as ${user.username}`,
          username: user.username,
          role: user.role,
          likes: user.likes,
          token: token,
        })
      }
    }
  })(req, res)
})

app.post('/users/newuser', JSONParser, (req: Request, res: Response) => {
  User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
    if (err) {
      console.log('Error during account registration: ' + err)
      res.status(400).json('Error during account registration: ' + err)
    } else {
      req.login(user, (err) => {
        if (err) res.status(400).json('Error establishing session:' + err)
        else {
          const token = jwt.sign({ userId: user._id }, secret, { expiresIn: '24h' })
          res.json({
            message: 'New account created',
            username: user.username,
            role: user.role,
            likes: user.likes,
            token: token,
          })
        }
      })
    }
  })
})

app.post('/users/socialauth/google', JSONParser, async (req, res) => {
  let username = req.body.username
  User.findOne({ username: username }, (err: MongooseError, user: IUserDocument) => {
    if (user) {
      const token = jwt.sign({ userId: user._id }, secret, { expiresIn: '24h' })
      const userResponse: IUserResponse = { ...user._doc, token: token, message: `Logged in as ${user._doc.username}` }
      res.json(userResponse)
    } else {
      let newGoogleUser = new User({ username: username })
      newGoogleUser.save((err: MongooseError, user: IUserDocument) => {
        const token = jwt.sign({ userId: user._id }, secret, { expiresIn: '24h' })
        const userResponse: IUserResponse = {
          ...user._doc,
          token: token,
          message: 'New google account created',
        }
        res.json(userResponse)
      })
    }
  })
})

app.post('/users/checksession', (req: Request, res: Response) => {
  let token = req.headers.token as string
  jwt.verify(token, secret, (err, decoded: any) => {
    User.findOne({ _id: decoded.userId }, (err: MongooseError, user: IUser) => {
      user && res.send(user)
    })
  })
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
        updateUserLikesCount(updReview.username)
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
      let newLikesCount = await updateUserLikesCount(req.headers.username as string)
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
