import { useState, useEffect, useRef } from 'react'
import { FormChanged, FormSubmitted } from '../utils/interface'
import { useNavigate } from 'react-router-dom'
import Footer from './../components/general/Footer'
import Navbar from './../components/general/Navbar'
import HeadInfo from './../utils/HeadInfo'
import useStore from './../store/store'
import { BITESHIP_AUTHORIZATION_KEY, LOCATION_API_KEY } from '../config/key'
import { AiFillCamera } from 'react-icons/ai'
import { validPhoneNumber } from '../utils/validator'

interface ILocation {
  id: string
  name: string
}

const Profile = () => {
  const [provinces, setProvinces] = useState<ILocation[]>([])
  const [cities, setCities] = useState<ILocation[]>([])
  const [districts, setDistricts] = useState<ILocation[]>([])
  const [postalCodes, setPostalCodes] = useState([])

  const [tempAvatar, setTempAvatar] = useState<File[]>([])

  const [loading, setLoading] = useState(false)
  const [customerInformation, setCustomerInformation] = useState({
    avatar: '',
    name: '',
    handphoneNo: '',
    gender: '',
    province: '',
    city: '',
    district: '',
    postalCode: '',
    address: ''
  })
  
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  
  const { userState, initiate, updateProfile, refreshToken } = useStore()

  const navigate = useNavigate()

  const handleChangeImage = (e: FormChanged) => {
    const target = e.target as HTMLInputElement
    const files = [...Object.values(target.files!)]
    setTempAvatar([...files])
  }

  const handleClickAvatar = () => {
    if (fileInputRef.current)
      fileInputRef.current.click()
  }

  const handleChange = (e: FormChanged) => {
    const { name, value } = e.target
    setCustomerInformation({ ...customerInformation, [name]: value })
  }

  const handleSubmit = async(e: FormSubmitted) => {
    e.preventDefault()

    setLoading(true)

    if (!customerInformation.name) {
      initiate('Please provide your name.', 'error')
      setLoading(false)
      return
    }

    if (customerInformation.handphoneNo) {
      if (!validPhoneNumber(customerInformation.handphoneNo)) {
        initiate('Please provide valid phone number.', 'error')
        setLoading(false)
        return
      }
    }

    await updateProfile(customerInformation, tempAvatar, userState.data.accessToken!)

    setLoading(false)
  }

  useEffect(() => {
    const fetchProvincesData = async() => {
      const provincesData = await fetch(`https://api.goapi.io/regional/provinsi?api_key=${LOCATION_API_KEY}`)
      const jsonData = await provincesData.json()
      setProvinces(jsonData.data)
    }
    
    fetchProvincesData()
  }, [])

  useEffect(() => {
    const fetchCitiesData = async(provinceId: string) => {
      const citiesData = await fetch(`https://api.goapi.io/regional/kota?provinsi_id=${provinceId}&api_key=${LOCATION_API_KEY}`)
      const jsonData = await citiesData.json()
      setCities(jsonData.data)
    }

    if (!customerInformation.province) {
      setCities([])
      return
    }

    const selectedProvince = provinces.find(item => item.name === customerInformation.province)
    if (selectedProvince)
      fetchCitiesData(selectedProvince.id)
  }, [customerInformation.province, provinces])

  useEffect(() => {
    const fetchDistrictsData = async(cityId: string) => {
      const districtsData = await fetch(`https://api.goapi.io/regional/kecamatan?kota_id=${cityId}&api_key=${LOCATION_API_KEY}`)
      const jsonData = await districtsData.json()
      setDistricts(jsonData.data)
    }

    if (!customerInformation.city || !customerInformation.province) {
      setDistricts([])
      return
    }

    const selectedCity = cities.find(item => item.name === customerInformation.city)
    if (selectedCity)
      fetchDistrictsData(selectedCity.id)
  }, [customerInformation.city, customerInformation.province, cities])

  useEffect(() => {
    const fetchPostalCodes = async(district: string) => {
      const postalCodesData = await fetch(`https://api.biteship.com/v1/maps/areas?countries=ID&input=${district.replace(/ /g, '+')}&type=single`, {
        headers: {
          'Authorization': `${BITESHIP_AUTHORIZATION_KEY}`
        }
      })
      const jsonData = await postalCodesData.json()
      setPostalCodes(jsonData.areas)
    }

    if (!customerInformation.district || !customerInformation.city || !customerInformation.province) {
      setPostalCodes([])
      return
    }

    fetchPostalCodes(customerInformation.district)
  }, [customerInformation.district, customerInformation.city, customerInformation.province])

  useEffect(() => {
    setCustomerInformation({
      name: userState.data.user?.name as string,
      avatar: userState.data.user?.avatar as string,
      handphoneNo: userState.data.user?.handphoneNo as string,
      gender: userState.data.user?.gender as string,
      province: userState.data.user?.province as string,
      city: userState.data.user?.city as string,
      district: userState.data.user?.district as string,
      postalCode: userState.data.user?.postalCode as string,
      address: userState.data.user?.address as string
    })
  }, [userState.data.user])

  useEffect(() => {
    if (!userState.loading) {
      if (!userState.data.accessToken) {
        navigate('/login')
      } else {
        if (userState.data.user?.role === 'admin') {
          navigate('/admin')
        }
      }
    }
  }, [userState.data.user, userState.data.accessToken, userState.loading, navigate])

  useEffect(() => {
    refreshToken()
  }, [refreshToken])

  return (
    <>
      <HeadInfo title='Profile' />
      <Navbar />
      <div className='py-10 md:px-12 px-6'>
        <h1 className='text-center text-3xl font-medium'>Profile</h1>
        <form onSubmit={handleSubmit} className='border border-gray-300 md:w-10/12 w-full rounded-md p-5 m-auto mt-8'>
          <div className='mb-10'>
            <h1 className='mb-6 text-2xl font-semibold'>General Information</h1>
            <div onClick={handleClickAvatar} className='w-fit mb-10 m-auto'>
              <div className='bg-gray-100 border border-gray-300 w-28 h-28 relative rounded-full cursor-pointer group shadow-lg'>
                {
                  tempAvatar.length > 0
                  ? <img src={URL.createObjectURL(tempAvatar[0])} alt='' className='w-full h-full rounded-full object-cover border border-gray-200' />
                  : (
                    <>
                      {
                        customerInformation.avatar
                        ? <img src={customerInformation.avatar} alt={customerInformation.name} className='w-full h-full rounded-full object-cover' />
                        : (
                          <div className='flex justify-center items-center h-full bg-gray-700 text-white rounded-full text-5xl'>
                            <p>{`${userState.data.user?.name.split(' ')[0][0]} ${userState.data.user?.name.split(' ')[userState.data.user?.name.split(' ').length - 1][0]}`}</p>
                          </div>
                        )
                      }
                    </>
                  )
                }
                <div className='absolute rounded-full w-full h-full bg-[rgba(0,0,0,.3)] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center top-0 left-0'>
                  <AiFillCamera className='w-1/2 h-1/2 text-white' />
                </div>
              </div>
              <input type='file' ref={fileInputRef} accept='image/*' onChange={handleChangeImage} className='hidden' />
            </div>
            <div className='flex md:flex-row flex-col md:items-center gap-6 mt-6'>
              <div className='flex-1'>
                <label htmlFor='name' className='text-sm'>Name</label>
                <input type='text' id='name' name='name' value={customerInformation.name} onChange={handleChange} autoComplete='off' placeholder='Enter your name' className='outline-none border border-gray-300 rounded-md p-3 text-sm w-full mt-4' />
              </div>
              <div className='flex-1'>
                <label htmlFor='email' className='text-sm'>Email</label>
                <input readOnly type='text' id='email' name='email' value={userState.data.user?.email} autoComplete='off' placeholder='Enter your email' className='bg-gray-100 cursor-not-allowed outline-none border border-gray-300 rounded-md p-3 text-sm w-full mt-4' />
              </div>
            </div>
            <div className='flex md:flex-row flex-col md:items-center gap-6 mt-6'>
              <div className='flex-1'>
                <label htmlFor='handphoneNo' className='text-sm'>Mobile Phone Number</label>
                <div className='flex items-center gap-4 border border-gray-300 rounded-md p-3 text-sm mt-4'>
                  <div className='flex items-center gap-2'>
                    <div className='w-8 h-6 border border-gray-300'>
                      <div className='w-full h-3 bg-red-500' />
                      <div className='w-full h-2 bg-white' />
                    </div>
                    <p>+62</p>
                  </div>
                  <input type='text' id='handphoneNo' name='handphoneNo' value={customerInformation.handphoneNo} onChange={handleChange} autoComplete='off' placeholder='Enter your mobile phone number' className='outline-none w-full' />
                </div>
              </div>
              <div className='flex-1'>
                <p className='text-sm'>Gender</p>
                <div className='mt-4 flex items-center gap-16'>
                  <div className='flex items-center gap-3'>
                    <input type='radio' id='male' name='gender' checked={customerInformation.gender === 'male'} value='male' onChange={handleChange} />
                    <label htmlFor='male' className='text-sm'>Male</label>
                  </div>
                  <div className='flex items-center gap-3'>
                    <input type='radio' id='female' name='gender' checked={customerInformation.gender === 'female'} value='female' onChange={handleChange} />
                    <label htmlFor='female' className='text-sm'>Female</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='mb-7'>
            <h1 className='mb-6 text-2xl font-semibold'>Address Information</h1>
            <div className='flex md:flex-row flex-col md:items-center gap-6'>
              <div className='flex-1'>
                <label htmlFor='province' className='text-sm'>Province</label>
                <select name='province' id='province' className='outline-none border border-gray-300 w-full mt-4 rounded-md p-3 text-sm' value={customerInformation.province} onChange={handleChange}>
                  <option value=''>Select province</option>
                  {
                    provinces.map(item => (
                      <option key={item.id} value={item.name}>{item.name}</option>
                    ))
                  }
                </select>
              </div>
              <div className='flex-1'>
                <label htmlFor='city' className='text-sm'>City</label>
                <select name='city' id='city' className='outline-none border border-gray-300 w-full mt-4 rounded-md p-3 text-sm' value={customerInformation.city} onChange={handleChange}>
                  <option value=''>Select city</option>
                  {
                    cities.map(item => (
                      <option key={item.id} value={item.name}>{item.name}</option>
                    ))
                  }
                </select>
              </div>
            </div>
            <div className='flex md:flex-row flex-col md:items-center gap-6 mt-6'>
              <div className='flex-1'>
                <label htmlFor='district' className='text-sm'>District</label>
                <select name='district' id='district' className='outline-none border border-gray-300 w-full mt-4 rounded-md p-3 text-sm' value={customerInformation.district} onChange={handleChange}>
                  <option value=''>Select district</option>
                  {
                    districts.map(item => (
                      <option key={item.id} value={item.name}>{item.name}</option>
                    ))
                  }
                </select>
              </div>
              <div className='flex-1'>
                <label htmlFor='postalCode' className='text-sm'>Postal Code</label>
                <select name='postalCode' id='postalCode' className='outline-none border border-gray-300 w-full mt-4 rounded-md p-3 text-sm' value={customerInformation.postalCode} onChange={handleChange}>
                  <option value=''>Select postal code</option>
                  {
                    postalCodes.map(item => (
                      <option key={item['postal_code']} value={item['postal_code']}>{item['postal_code']}</option>
                    ))
                  }
                </select>
              </div>
            </div>
            <div className='mt-6'>
              <label htmlFor='address' className='text-sm'>Address Detail</label>
              <textarea name='address' id="address" className='w-full rounded-md outline-none border border-gray-300 resize-none h-28 text-sm p-3 mt-4' value={customerInformation.address} onChange={handleChange} />
            </div>
          </div>
          <div className='flex justify-end'>
            <button disabled={!customerInformation.name || loading} className={`${!customerInformation.name || loading ? 'bg-gray-300 hover:bg-gray-300 cursor-not-allowed' : 'bg-black hover:bg-gray-800 cursor-pointer'} text-white text-sm rounded-md px-7 py-3 transition`}>
              {
                loading
                ? 'Loading ...'
                : 'Save Changes'
              }
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  )
}

export default Profile