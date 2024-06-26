import moment from 'moment-timezone'

const timeZone = 'Asia/Jakarta'

export const convertToIdnDate = (date: string) => {
  return moment.tz(moment.tz(date, 'YYYY-MM-DD HH:mm:ss', 'UTC').toDate(), timeZone).toDate()
}

export const convertCurrentDateToString = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}