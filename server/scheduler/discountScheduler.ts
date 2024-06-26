import cron from 'node-cron'
import ProductDiscount from './../models/ProductDiscount'
import { convertCurrentDateToString, convertToIdnDate } from './../utils/date'

async function activateProductDiscount() {
  const currentDate = convertToIdnDate(convertCurrentDateToString(new Date()))

  const productDiscountToActivate = await ProductDiscount.find({
    startDate: { $eq: currentDate },
    active: 0
  })

  for (const productDiscount of productDiscountToActivate) {
    productDiscount.active = 1
    await productDiscount.save()
  }
}

async function deactivateProductDiscount() {
  const currentDate = convertToIdnDate(convertCurrentDateToString(new Date()))

  const productDiscountToDeactivate = await ProductDiscount.find({
    endDate: { $eq: currentDate },
    active: 1
  })

  for (const productDiscount of productDiscountToDeactivate) {
    productDiscount.active = -1
    await productDiscount.save()
  }
}


cron.schedule('0 0 * * *', () => {
  activateProductDiscount()
  deactivateProductDiscount()
})
