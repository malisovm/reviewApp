import { fileURLToPath } from 'url'
import { dirname } from 'path'
import express, { Request, Response } from 'express'
import * as path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const app = express()
const PORT = process.env.PORT || 3001

interface IReview {
  title: string
  product: string
  group: string
  tags: {value: string}[]
  text: string
  pic: string
  rating: number
}

var reviews:IReview[] = []

app.use(express.static(path.join(__dirname, '..', '..', 'client', 'build')))
const JSONParser = express.json({ type: 'application/json' })
app.listen(PORT, () => {
  console.log(`The server is up at ${PORT}`)
})

app.post('/reviews', JSONParser, (req, res) => {
  let review = req.body
  if (review.tags[0].value === '') review.tags = []
  reviews.push(review)
  res.send(JSON.stringify('new review posted'))
})

app.get('/reviews', (_, res) => {
  console.log(JSON.stringify(reviews))
  res.send(reviews)
})

app.get('*', (_, res: Response) => {
  res.sendFile(path.join(__dirname, '..', '..', 'client', 'build', 'index.html'))
})
