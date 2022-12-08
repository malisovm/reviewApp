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
  groups: string
  tags: string[]
  text: string
  pic: string
  rating: string
}

var reviews:IReview[] = []

app.use(express.static(path.join(__dirname, '..', '..', 'client', 'build')))
const JSONParser = express.json({ type: 'application/json' })
app.listen(PORT, () => {
  console.log(`The server is up at ${PORT}`)
})

app.post('/reviews', JSONParser, (req, res) => {
  reviews.push(req.body)
  console.log(reviews)
})

app.get('/reviews', (req, res) => {
  res.send(reviews)
})

app.get('*', (res: Response) => {
  res.sendFile(path.join(__dirname, '..', '..', 'client', 'build', 'index.html'))
})
