import moment from 'moment-timezone'

const timeZone = 'Asia/Jakarta'

export const convertToIdnDate = (date: string) => {
  return moment.tz(moment.tz(date, 'YYYY-MM-DD HH:mm:ss', 'UTC').toDate(), timeZone).toDate()
}