export const uploadImages = async(files: File[], type: string) => {
  const images = []

  for (const file of files) {
    const formData = new FormData()
    formData.append('file', file)
    type === 'product'
    ? formData.append('upload_preset', 'fasygrmo')
    : formData.append('upload_preset', 'kb5cnzhx')
    formData.append('cloud_name', 'dpef9sjqt')

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/dpef9sjqt/upload', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()

      images.push(data.secure_url)
    } catch (err: any) {
      console.log(err)
    }
  }

  return images
}