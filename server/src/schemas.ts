import { IUser, IReview } from './interfaces.js'
import { getDate } from './utility.js'
import mongoose from 'mongoose'
import passportLocalMongoose from 'passport-local-mongoose'

const Schema = mongoose.Schema

const usersSchema = new Schema({
  username: { type: String, required: true },
  role: { type: String, required: true, default: 'user' },
  likes: { type: Number, required: true, default: 0 },
})
usersSchema.plugin(passportLocalMongoose)

const reviewsSchema = new Schema<IReview>({
  title: { type: String, required: true },
  product: { type: String, required: true },
  group: { type: String, required: true },
  tags: [String],
  text: { type: String, required: true },
  pic: { type: String },
  verdict: { type: Number, required: true },
  username: { type: String, required: true },
  date: { type: String, required: true, default: getDate() },
  ratings: [{ type: { user: String, rate: Number }, required: true, default: [] }],
  avgRate: { type: Number, required: true, default: 0 },
  likes: { type: [String], required: true, default: [] },
  comments: [{ type: { user: String, text: String }, required: true, default: [] }],
})
reviewsSchema.index({ '$**': 'text' }) // $** === all string fields in mongoose

export const User = mongoose.model('User', usersSchema)
export const Review = mongoose.model<IReview>('Review', reviewsSchema)
