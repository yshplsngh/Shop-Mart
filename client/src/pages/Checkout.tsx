import { useState, useEffect, useRef } from 'react'
import Footer from './../components/general/Footer'
import Navbar from './../components/general/Navbar'
import HeadInfo from './../utils/HeadInfo'
import { useNavigate } from 'react-router-dom'
import { FormChanged } from '../utils/interface'
import { BITESHIP_AUTHORIZATION_KEY, LOCATION_API_KEY } from '../config/key'
import useStore from './../store/store'
import { APP_NAME } from '../utils/constant'
import { currencyFormatter } from '../utils/currency'
import Loader from '../components/general/Loader'
import Payment from '../components/modal/Checkout/Payment'
import { validEmail, validPhoneNumber } from '../utils/validator'

interface ILocation {
  id: string
  name: string
}

interface ICourierRates {
  courier_service_name: string
  duration: string
  price: number
}

const Checkout = () => {
  const [provinces, setProvinces] = useState<ILocation[]>([])
  const [cities, setCities] = useState<ILocation[]>([])
  const [districts, setDistricts] = useState<ILocation[]>([])
  const [postalCodes, setPostalCodes] = useState([])

  const [loadingShipmentCost, setLoadingShipmentCost] = useState(false)
  const [selectedCourier, setSelectedCourier] = useState('')
  const [selectedService, setSelectedService] = useState<Partial<ICourierRates>>()
  const [JNEPrice, setJNEPrice] = useState<ICourierRates[]>([])
  const [JNTPrice, setJNTPrice] = useState<ICourierRates[]>([])
  const [sicepatPrice, setSicepatPrice] = useState<ICourierRates[]>([])

  const [shippingInformation, setShippingInformation] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    province: '',
    city: '',
    district: '',
    postalCode: ''
  })

  const [openPaymentModal, setOpenPaymentModal] = useState(false)

  const paymentModalRef = useRef() as React.MutableRefObject<HTMLDivElement>

  const navigate = useNavigate()

  const { userState, cartState, initiate } = useStore()

  const handleChange = (e: FormChanged) => {
    const { name, value } = e.target
    setShippingInformation({ ...shippingInformation, [name]: value })
  }

  const handleSelectCourier = async(courier: string) => {
    setSelectedService({})
    setLoadingShipmentCost(true)
    setSelectedCourier(courier)

    const shippingItems = []

    for (let i = 0; i < cartState.data.length; i++) {
      if (cartState.data[i].selected) {
        shippingItems.push({
          'name': cartState.data[i].product.name,
          'description': cartState.data[i].product.name,
          'value': cartState.data[i].product.price,
          'length': cartState.data[i].product.length,
          'width': cartState.data[i].product.width,
          'height': cartState.data[i].product.height,
          'weight': cartState.data[i].product.weight,
          'quantity': cartState.data[i].qty
        })
      }
    }

    const data = {
      'origin_postal_code': 11530,
      'destination_postal_code': shippingInformation.postalCode,
      'couriers': courier,
      'items': shippingItems
    }

    try {
      const res = await fetch('https://api.biteship.com/v1/rates/couriers', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          Authorization: `${BITESHIP_AUTHORIZATION_KEY}`,
          'Content-Type': 'application/json'
        }
      })

      const jsonData = await res.json()
      
      if (courier === 'jne') {
        setJNEPrice(jsonData.pricing)
      } else if (courier === 'jnt') {
        setJNTPrice(jsonData.pricing)
      } else if (courier === 'sicepat') {
        setSicepatPrice(jsonData.pricing)
      }
    } catch (err: any) {
      setJNEPrice([])
      setJNTPrice([])
      setSicepatPrice([])
    }

    setLoadingShipmentCost(false)
  }

  const handleClickPayNow = () => {
    if (
      !shippingInformation.firstName ||
      !shippingInformation.lastName ||
      !shippingInformation.email ||
      !shippingInformation.phone ||
      !shippingInformation.address ||
      !shippingInformation.province ||
      !shippingInformation.city ||
      !shippingInformation.district ||
      !shippingInformation.postalCode ||
      !selectedCourier ||
      !selectedService?.price
    ) {
      initiate('Please provide required field to checkout', 'error')
      return
    }

    if (!validEmail(shippingInformation.email)) {
      initiate('Please provide valid email address', 'error')
      return
    }

    if (!validPhoneNumber(shippingInformation.phone)) {
      initiate('Please provide valid phone number', 'error')
      return
    }

    setOpenPaymentModal(true)
  }

  useEffect(() => {
    const checkIfClickedOutside = (e: MouseEvent) => {
      if (openPaymentModal && paymentModalRef.current && !paymentModalRef.current.contains(e.target as Node)) {
        setOpenPaymentModal(false)
      }
    }

    document.addEventListener('mousedown', checkIfClickedOutside)
    return () => document.removeEventListener('mousedown', checkIfClickedOutside)
  }, [openPaymentModal])

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

    if (!shippingInformation.province) {
      setCities([])
      return
    }

    const selectedProvince = provinces.find(item => item.name === shippingInformation.province)
    if (selectedProvince)
      fetchCitiesData(selectedProvince.id)
  }, [shippingInformation.province, provinces])

  useEffect(() => {
    const fetchDistrictsData = async(cityId: string) => {
      const districtsData = await fetch(`https://api.goapi.io/regional/kecamatan?kota_id=${cityId}&api_key=${LOCATION_API_KEY}`)
      const jsonData = await districtsData.json()
      setDistricts(jsonData.data)
    }

    if (!shippingInformation.city || !shippingInformation.province) {
      setDistricts([])
      return
    }

    const selectedCity = cities.find(item => item.name === shippingInformation.city)
    if (selectedCity)
      fetchDistrictsData(selectedCity.id)
  }, [shippingInformation.city, shippingInformation.province, cities])

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

    if (!shippingInformation.district || !shippingInformation.city || !shippingInformation.province) {
      setPostalCodes([])
      return
    }

    fetchPostalCodes(shippingInformation.district)
  }, [shippingInformation.district, shippingInformation.city, shippingInformation.province])

  useEffect(() => {
    if (!userState.data.accessToken) {
      navigate('/login')
    }
  }, [userState.data.accessToken, navigate])

  return (
    <>
      <HeadInfo title='Checkout' />
      <Navbar />
      {
        cartState.data.filter(item => item.selected).length === 0
        ? (
          <div className='py-10 md:px-12 px-6'>
            <div className='bg-orange-500 w-full text-white rounded-md text-sm font-semibold text-center p-3'>
              <p>Your cart is currently empty</p>
            </div>
          </div>
        )
        : (
          <div className='py-10 md:px-12 px-6 flex gap-12 md:flex-row flex-col'>
            <div className='flex-1'>
              <h1 className='text-2xl font-semibold'>Shipping Information</h1>
              <div className='mt-8'>
                <div className='flex md:items-center md:flex-row flex-col md:gap-6 gap-7'>
                  <div className='flex-1'>
                    <label htmlFor='firstName' className='text-sm'>First Name</label>
                    <input type='text' id='firstName' name='firstName' value={shippingInformation.firstName} onChange={handleChange} placeholder='Enter your first name' autoComplete='off' className='outline-none border border-gray-300 w-full rounded-full p-3 text-sm mt-3' />
                  </div>
                  <div className='flex-1'>
                    <label htmlFor='lastName' className='text-sm'>Last Name</label>
                    <input type='text' id='lastName' name='lastName' value={shippingInformation.lastName} onChange={handleChange} placeholder='Enter your last name' autoComplete='off' className='outline-none border border-gray-300 w-full rounded-full p-3 text-sm mt-3' />
                  </div>
                </div>
                <div className='flex md:items-center md:flex-row flex-col md:gap-6 gap-7 mt-7'>
                  <div className='flex-1'>
                    <label htmlFor='email' className='text-sm'>Email</label>
                    <input type='text' id='email' name='email' value={shippingInformation.email} onChange={handleChange} placeholder='Enter your email' autoComplete='off' className='outline-none border border-gray-300 w-full rounded-full p-3 text-sm mt-3' />
                  </div>
                  <div className='flex-1'>
                    <label htmlFor='phone' className='text-sm'>Phone Number</label>
                    <div className='w-full border border-gray-300 rounded-full flex-1 mt-3 px-4 py-3 flex items-center gap-3'>
                      <div className='flex items-center gap-2'>
                        <div className='w-8 h-6 border border-gray-300'>
                          <div className='w-full h-3 bg-red-500' />
                          <div className='w-full h-2 bg-white' />
                        </div>
                        <p>+62</p>
                      </div>
                      <input type='text' id='phone' name='phone' value={shippingInformation.phone.replace(/[^0-9]/g, '')} onChange={handleChange} placeholder='Enter your phone number' autoComplete='off' className='outline-none text-sm w-full' />
                    </div>
                  </div>
                </div>
                <div className='mt-7'>
                  <label htmlFor='address' className='address'>Address Detail</label>
                  <textarea placeholder='Enter your address detail' name='address' id='address' value={shippingInformation.address} onChange={handleChange} className='outline-none border border-gray-300 w-full h-28 rounded-lg resize-none mt-3 p-3 text-sm' />
                </div>
                <div className='flex md:items-center md:flex-row flex-col md:gap-6 gap-7 mt-7'>
                  <div className='flex-1'>
                    <label htmlFor='province' className='text-sm'>Province</label>
                    <select name='province' id='province' value={shippingInformation.province} onChange={handleChange} className='outline-none border border-gray-300 w-full mt-3 rounded-full p-3 text-sm'>
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
                    <select name='city' id='city' value={shippingInformation.city} onChange={handleChange} className='outline-none border border-gray-300 w-full mt-3 rounded-full p-3 text-sm'>
                      <option value=''>Select city</option>
                      {
                        cities.map(item => (
                          <option key={item.id} value={item.name}>{item.name}</option>
                        ))
                      }
                    </select>
                  </div>
                </div>
                <div className='flex md:items-center md:flex-row flex-col md:gap-6 gap-7 mt-7'>
                  <div className='flex-1'>
                    <label htmlFor='district' className='text-sm'>District</label>
                    <select name='district' id='district' value={shippingInformation.district} onChange={handleChange} className='outline-none border border-gray-300 w-full mt-3 rounded-full p-3 text-sm'>
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
                    <select name='postalCode' id='postalCode' value={shippingInformation.postalCode} onChange={handleChange} className='outline-none border border-gray-300 w-full mt-3 rounded-full p-3 text-sm'>
                      <option value=''>Select postal code</option>
                      {
                        postalCodes.map(item => (
                          <option key={item['postal_code']} value={item['postal_code']}>{item['postal_code']}</option>
                        ))
                      }
                    </select>
                  </div>
                </div>
              </div>
              {
                (shippingInformation.address.length > 5 && shippingInformation.province && shippingInformation.city && shippingInformation.district && shippingInformation.postalCode) &&
                <div className='mt-10'>
                  <h1 className='text-2xl font-semibold'>Courier Selection</h1>
                  <div className='mt-6 border border-gray-300 rounded-lg p-5'>
                    <div className='flex items-center justify-between'>
                      <div onClick={() => handleSelectCourier('jne')} className={`w-24 h-12 flex items-center justify-center cursor-pointer px-3 py-2 transition ${selectedCourier === 'jne' ? 'border-black border-2 rounded-md' : 'hover:border-2 hover:border-black hover:rounded-md'}`}>
                        <img src={`${process.env.PUBLIC_URL}/images/couriers/jne.png`} alt={`${APP_NAME} - JNE Expedition`} className='w-full h-full' />
                      </div>
                      <div onClick={() => handleSelectCourier('jnt')} className={`w-32 h-12 flex items-center justify-center cursor-pointer px-3 py-2 transition ${selectedCourier === 'jnt' ? 'border-black border-2 rounded-md' : 'hover:border-2 hover:border-black hover:rounded-md'}`}>
                        <img src={`${process.env.PUBLIC_URL}/images/couriers/jnt.png`} alt={`${APP_NAME} - JNE Expedition`} className='w-full h-full' />
                      </div>
                      <div onClick={() => handleSelectCourier('sicepat')} className={`w-38 h-12 flex items-center justify-center cursor-pointer px-3 py-2 transition ${selectedCourier === 'sicepat' ? 'border-black border-2 rounded-md' : 'hover:border-2 hover:border-black hover:rounded-md'}`}>
                        <img src={`${process.env.PUBLIC_URL}/images/couriers/sicepat.png`} alt={`${APP_NAME} - JNE Expedition`} className='w-full h-full' />
                      </div>
                    </div>
                    {
                      selectedCourier &&
                      loadingShipmentCost
                      ? (
                        <div className='flex items-center justify-center mt-8'>
                          <Loader size='xl' />
                        </div>
                      )
                      : (
                        <>
                          <hr className='my-5' />
                          <div className='flex flex-col gap-4'>
                            {
                              selectedCourier === 'jne'
                              ? (
                                JNEPrice.length === 0
                                ? (
                                  <div className='rounded-md bg-red-500 text-white text-sm w-full p-3 font-semibold text-center'>
                                    <p>No service available</p>
                                  </div>
                                ) : (
                                  <>
                                    {
                                      JNEPrice.map(item => (
                                        <div onClick={() => setSelectedService(item)} key={item.courier_service_name} className={`${selectedService?.courier_service_name === item.courier_service_name ? 'border-4 border-black' : 'border-2 border-gray-300'} cursor-pointer flex items-center justify-between rounded-md p-3 hover:border-black transition`}>
                                          <div>
                                            <h1 className='text-lg font-semibold'>{item.courier_service_name}</h1>
                                            <p className='text-sm text-gray-500 mt-3'>Estimated arrival: {item.duration}</p>
                                          </div>
                                          <p className='font-semibold'>{currencyFormatter(item.price)},00</p>
                                        </div>
                                      ))
                                    }
                                  </>
                                )
                              )
                              : selectedCourier === 'jnt'
                                ? (
                                  JNTPrice.length === 0
                                  ? (
                                    <div className='rounded-md bg-red-500 text-white text-sm w-full p-3 font-semibold text-center'>
                                      <p>No service available</p>
                                    </div>
                                  )
                                  : (
                                    <>
                                      {
                                        JNTPrice.map(item => (
                                          <div onClick={() => setSelectedService(item)} key={item.courier_service_name} className={`${selectedService?.courier_service_name === item.courier_service_name ? 'border-4 border-black' : 'border-gray-300 border-2'} cursor-pointer flex items-center justify-between rounded-md p-3 hover:border-black transition`}>
                                            <div>
                                              <h1 className='text-lg font-semibold'>{item.courier_service_name}</h1>
                                              <p className='text-sm text-gray-500 mt-3'>Estimated arrival: {item.duration}</p>
                                            </div>
                                            <p className='font-semibold'>{currencyFormatter(item.price)},00</p>
                                          </div>
                                        ))
                                      }
                                    </>
                                  )
                                )
                                : selectedCourier === 'sicepat'
                                  ? (
                                    sicepatPrice.length === 0
                                    ? (
                                      <div className='rounded-md bg-red-500 text-white text-sm w-full p-3 font-semibold text-center'>
                                        <p>No service available</p>
                                      </div>
                                    )
                                    : (
                                      <>
                                        {
                                          sicepatPrice.map(item => (
                                            <div onClick={() => setSelectedService(item)} key={item.courier_service_name} className={`${selectedService?.courier_service_name === item.courier_service_name ? 'border-4 border-black' : 'border-2 border-gray-300'} cursor-pointer flex items-center justify-between rounded-md p-3 hover:border-black transition`}>
                                              <div>
                                                <h1 className='text-lg font-semibold'>{item.courier_service_name}</h1>
                                                <p className='text-sm text-gray-500 mt-3'>Estimated arrival: {item.duration}</p>
                                              </div>
                                              <p className='font-semibold'>{currencyFormatter(item.price)},00</p>
                                            </div>
                                          ))
                                        }
                                      </>
                                    )
                                  )
                                  : ''
                            }
                          </div>
                        </>
                      )
                    }
                  </div>
                </div>
              }
            </div>
            <div className='flex-1 sticky top-10 h-fit'>
              <h1 className='text-2xl font-semibold'>Your Order</h1>
              <div className='mt-8'>
                <div className='flex flex-col md:gap-8 gap-16 max-h-[435px] overflow-auto hide-scrollbar'>
                  {
                    cartState.data.map((item, idx) => (
                      item.selected &&
                      <div key={idx} className='flex md:items-center justify-between md:flex-row flex-col md:gap-0 gap-3'>
                        <div className='flex items-center gap-3'>
                          <div className='w-28 h-28 rounded-md border border-gray-300'>
                            <img src={item.product.images[0]} alt={`${APP_NAME} - ${item.product.name}`} className='w-full h-full object-cover rounded-md' />
                          </div>
                          <div>
                            <div className='flex items-center gap-3'>
                              <h1 className='text-xl font-semibold'>{item.product.name}</h1>
                              {
                                item.discount > 0 &&
                                <div className='bg-red-500 text-xs rounded-md text-white p-2 shadow-md font-semibold'>
                                  <p>{item.discount}% Off</p>
                                </div>
                              }
                            </div>
                            <p className='text-sm text-gray-500 mt-2'>Size: {item.size}</p>
                            <p className='text-sm text-gray-500 mt-1'>Qty: {item.qty}</p>
                            <p className='text-sm text-gray-500 mt-1'>Color: {item.color.colorName}</p>
                          </div>
                        </div>
                        <div>
                          {
                            item.discount
                            ? (
                              <div className='text-right'>
                                <p className='text-gray-300 line-through'>{currencyFormatter(item.product.price * item.qty)},00</p>
                                <p className='font-semibold text-lg'>{currencyFormatter((item.product.price - ((item.discount * item.product.price) / 100)) * item.qty)},00</p>
                              </div>
                            )
                            : (
                              <p className='font-semibold text-lg text-right'>{currencyFormatter(item.product.price * item.qty)},00</p>
                            )
                          }
                        </div>
                      </div>
                    ))
                  }
                </div>
                <div className='mt-8'>
                  <div className='mb-7'>
                    <div className='flex items-center justify-between mb-3'>
                      <p>Subtotal</p>
                      <p>{currencyFormatter(cartState.data.reduce((acc, item) => (item.selected ? ((item.product.price - ((item.discount * item.product.price) / 100)) * item.qty) : 0) + acc, 0))},00</p>
                    </div>
                    <div className='flex items-center justify-between'>
                      <p>Shipping Cost</p>
                      <p>{currencyFormatter(selectedService?.price || 0)},00</p>
                    </div>
                    <hr className='my-5' /> 
                    <div className='flex items-center justify-between font-semibold'>
                      <p>Total</p>
                      <p>{currencyFormatter(cartState.data.reduce((acc, item) => (item.selected ? ((item.product.price - ((item.discount * item.product.price) / 100)) * item.qty) : 0) + acc, 0) + (selectedService?.price || 0))},00</p>
                    </div>
                  </div>
                  <button onClick={handleClickPayNow} disabled={!shippingInformation.firstName || !shippingInformation.lastName || !shippingInformation.email || !shippingInformation.phone || !shippingInformation.address || !shippingInformation.province || !shippingInformation.city || !shippingInformation.district || !shippingInformation.postalCode || !selectedCourier || !selectedService?.price} className={`${!shippingInformation.firstName || !shippingInformation.lastName || !shippingInformation.email || !shippingInformation.phone || !shippingInformation.address || !shippingInformation.province || !shippingInformation.city || !shippingInformation.district || !shippingInformation.postalCode || !selectedCourier || !selectedService?.price ? 'bg-gray-300 cursor-not-allowed hover:bg-gray-300' : 'bg-black cursor-pointer hover:bg-gray-800'} w-full py-3 transition text-white font-semibold rounded-full text-sm`}>Pay Now</button>
                </div>
              </div>
            </div>
          </div>
        )
      }
      <Footer />

      <Payment
        openPaymentModal={openPaymentModal}
        setOpenPaymentModal={setOpenPaymentModal}
        paymentModalRef={paymentModalRef}
        subtotal={cartState.data.reduce((acc, item) => (item.selected ? ((item.product.price - ((item.discount * item.product.price) / 100)) * item.qty) : 0) + acc, 0)}
        shipping={selectedService?.price || 0}
        total={cartState.data.reduce((acc, item) => (item.selected ? ((item.product.price - ((item.discount * item.product.price) / 100)) * item.qty) : 0) + acc, 0) + (selectedService?.price || 0)}
        phone={shippingInformation.phone}
        user={userState.data.user?.name as string}
      />
    </>
  )
}

export default Checkout