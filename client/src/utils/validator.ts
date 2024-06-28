export const validEmail = (text: string) => {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailPattern.test(text);
}

export const validPassword = (text: string) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).{8,}$/
  return passwordRegex.test(text)
}

export const validPhoneNumber = (text: string) => {
  const phoneNumberPattern = /^8[1-9]\d{8,11}$/
  return phoneNumberPattern.test(text)
}