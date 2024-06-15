export const formatDate = (date: string) => {
  const monthArr = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]

  const selectedDate = date.substring(8, 10)
  const selectedMonth = Number(date.substring(5, 7))
  const selectedYear = date.substring(0, 4)

  return selectedDate + ' ' + monthArr[selectedMonth - 1] + ' ' + selectedYear
}