export const currencyFormatter = (amount: number) => {
  if (amount < 1) {
    const fraction = amount * 1000
    return `Rp ${fraction}`
  } else {
    let formatter = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    })
  
    return formatter.format(amount).toString().slice(0, -3)
  }
}