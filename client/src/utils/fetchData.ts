import axios from 'axios'

export const getDataAPI = async(url: string, token?: string) => {
  const res = await axios.get(url, {
    headers: {
      Authorization: `${token}`
    }
  })

  return res
}

export const postDataAPI = async(url: string, data: object, token?: string) => {
  const res = await axios.post(url, data, {
    headers: {
      Authorization: `${token}`
    }
  })

  return res
}

export const patchDataAPI = async(url: string, data: object, token?: string) => {
  const res = await axios.patch(url, data, {
    headers: {
      Authorization: `${token}`
    }
  })

  return res
}

export const putDataAPI = async(url: string, data: object, token?: string) => {
  const res = await axios.put(url, data, {
    headers: {
      Authorization: `${token}`
    }
  })

  return res
}

export const deleteDataAPI = async(url: string, token?: string) => {
  const res = await axios.delete(url, {
    headers: {
      Authorization: `${token}`
    }
  })

  return res
}