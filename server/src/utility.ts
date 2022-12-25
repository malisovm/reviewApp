export function getDate() {
  return new Date().toISOString().replace('T', ' ').replace('Z', ' ').split('.')[0].replace(/-/g, '.')
}