export function getDate() {
  return new Date().toISOString().replace('T', ' ').replace('Z', ' ').split('.')[0].replace(/-/g, '.')
}

//output: DD.MM.YYYY HH:MM:SS in UTC