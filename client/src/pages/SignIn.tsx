import { useState, useEffect } from 'react'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { Link, useNavigate } from 'react-router-dom'
import { APP_NAME } from './../utils/constant'
import { FormSubmitted } from './../utils/interface'
import HeadInfo from './../utils/HeadInfo'
import Logo from './../components/general/Logo'
import useStore from './../store/store'
import { validEmail } from '../utils/validator'

const SignIn = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const [showPassword, setShowPassword] = useState(false)

  const [loading, setLoading] = useState(false)

  const { initiate, login, userState } = useStore()

  const navigate = useNavigate()

  const handleSubmit = async(e: FormSubmitted) => {
    e.preventDefault()

    setLoading(true)

    if (!email || !password) {
      setLoading(false)
      return initiate('Please provide required field for registration purpose.', 'error')
    }

    if (!validEmail(email)) {
      setLoading(false)
      return initiate('Please provide valid email address for login purpose', 'error')
    }

    try {
      await login({ email, password })
    } catch (err: any) {
      initiate(err.response.data.msg, 'error')
    }

    setLoading(false)
  }

  useEffect(() => {
    if (userState.data.accessToken) {
      if (userState.data.user?.role === 'customer') {
        navigate('/')
      } else if (userState.data.user?.role === 'admin') {
        navigate('/admin')
      }
    }
  }, [navigate, userState.data])

  return (
    <>
      <HeadInfo title='Sign In' />
      <div className='flex w-full h-screen'>
        <div className='flex-1 lg:px-20 px-8 flex flex-col justify-center'>
          <div className='flex justify-center mb-7'>
            <Link to='/'>
              <Logo size='md'  />
            </Link>
          </div>
          <h1 className='text-center text-xl mb-5'>{APP_NAME}</h1>
          <p className='text-center text-3xl font-medium'>Welcome Back!</p>
          <form onSubmit={handleSubmit} className='mt-9'>
            <div className='w-full rounded-full border border-gray-400 relative px-5 py-2'>
              <input type='text' value={email} onChange={e => setEmail(e.target.value)} className='outline-none w-full text-sm ' />
              <p className={`absolute top-1/2 -translate-y-1/2 left-5 text-sm pointer-events-none text-gray-300 ${email ? 'hidden' : 'block'}`}>Email address</p>
            </div>
            <div className='w-full rounded-full border border-gray-400 relative px-5 py-2 mt-6'>
              <input type={`${showPassword ? 'text' : 'password'}`} value={password} onChange={e => setPassword(e.target.value)} className='outline-none w-full text-sm pr-8' />
              <p className={`absolute top-1/2 -translate-y-1/2 left-5 text-sm text-gray-300 ${password ? 'hidden' : 'block'}`}>Password</p>
              {
                showPassword
                ? <AiFillEyeInvisible onClick={() => setShowPassword(false)} className='absolute top-1/2 -translate-y-1/2 right-5 first-letter text-gray-500 cursor-pointer' />
                : <AiFillEye onClick={() => setShowPassword(true)} className='absolute top-1/2 -translate-y-1/2 right-5 first-letter text-gray-500 cursor-pointer' />
              }
            </div>
            <button disabled={loading || !email || !password} className={`${loading || !email || !password ? 'bg-gray-300 hover:bg-gray-300 cursor-not-allowed' : 'bg-black hover:bg-gray-800 cursor-pointer'} outline-none transition-all text-white w-full py-3 text-sm rounded-full mt-8`}>
              {
                loading
                ? 'Loading ...'
                : 'Sign In'
              }
            </button>
          </form>
          <p className='text-xs font-semibold text-center mt-5 text-gray-400'>Don't have an account? <Link to='/register' className='text-black'>Register</Link></p>
          <div className='flex items-center w-full gap-3 mt-8'>
            <div className='flex-1 border-b border-gray-400' />
            <p className='text-xs text-gray-500'>Or</p>
            <div className='flex-1 border-b border-gray-400' />
          </div>
          <button className='flex items-center justify-center w-full gap-4 rounded-full py-3 text-sm mt-9 bg-gray-900 hover:bg-gray-800 transition text-white'>
            <img src={`${process.env.PUBLIC_URL}/images/external_icons/google.png`} alt={`${APP_NAME} Sign In With Google`} className='w-4 h-4 pointer-events-none' />
            Continue with Google
          </button>
        </div>
        <div className='flex-1 px-20 bg-gray-200 md:block hidden relative'>
          <img src={`${process.env.PUBLIC_URL}/images/photos/login.jpg`} alt={`${APP_NAME} Sign In`} className='object-cover w-full h-full absolute top-0 left-0 pointer-events-none' />
        </div>
      </div>
    </>
  )
}

export default SignIn