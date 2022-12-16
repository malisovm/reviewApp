import { fileURLToPath } from 'url'
import { dirname } from 'path'
import express, { Request, Response } from 'express'
import * as path from 'path'
import { v4 as uuid } from 'uuid'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const app = express()
const PORT = process.env.PORT || 3001

interface IReview {
  id: string
  title: string
  product: string
  group: string
  tags?: string[]
  text: string
  pic?: string
  rating: number
}

var reviews: IReview[] = []

app.use(express.static(path.join(__dirname, '..', '..', 'client', 'build')))
const JSONParser = express.json({ type: 'application/json' })
app.listen(PORT, () => {
  console.log(`The server is up at ${PORT}`)
})

app.post('/reviews', JSONParser, (req, res) => {
  let newReview:IReview = req.body
  newReview.id = uuid()
  reviews.push(req.body)
  res.send(JSON.stringify('new review posted'))
})

app.put('/reviews', JSONParser, (req, res) => {
  console.log('PUT RECEIVED', req.body)
  console.log('REVIEWS BEFORE', reviews)
  let updatedReview: IReview = req.body
  reviews.forEach((review, index) => {
    if (review.id === updatedReview.id) {
      reviews[index] = updatedReview
    }
  })
  console.log('REVIEWS AFTER', reviews)
  res.send(JSON.stringify('review edited'))
})

app.get('/reviews', (_, res) => {
  console.log(JSON.stringify(reviews))
  res.send(reviews)
})

app.delete('/reviews', (req, res) => {
  let id = req.headers.id
  let index = reviews.findIndex((review) => review.id === id)
  reviews.splice(index, 1)
  res.send('review deleted')
})

app.get('*', (_, res: Response) => {
  res.sendFile(path.join(__dirname, '..', '..', 'client', 'build', 'index.html'))
})
