import { IReview } from './interfaces'

export function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

export function getDate() {
  return new Date().toISOString().replace('T', ' ').replace('Z', ' ').split('.')[0].replaceAll('-', '.')
}