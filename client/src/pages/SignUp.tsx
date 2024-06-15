import { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import Logo from "../components/general/Logo"
import HeadInfo from "../utils/HeadInfo"
import { APP_NAME } from "../utils/constant"
import { FormSubmitted } from "../utils/interface"
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { validEmail, validPassword } from '../utils/validator'
import useStore from './../store/store'
import { postDataAPI } from '../utils/fetchData'

const SignUp = () => {
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)

  const { initiate } = useStore()

  const navigate = useNavigate()

  const handleSubmit = async(e: FormSubmitted) => {
    e.preventDefault()

    setLoading(true)

    if (!name || !email || !password || !passwordConfirmation) {
      initiate('Please provide required field for registration purpose.', 'error')
    }

    if (!validEmail(email)) {
      initiate('Please provide valid email for register purpose.', 'error')
    }

    if (password.length < 8) {
      initiate('Password should be at least 8 characters.', 'error')
    } else if (!validPassword(password)) {
      initiate('Password should contains lowercase, uppercase, number, and symbol.', 'error')
    }

    if (password !== passwordConfirmation) {
      initiate('Password confirmation should be matched.', 'error')
    }

    try {
      const res = await postDataAPI('/user/register', { name, email, password })
      initiate(res.data.msg, 'success')
      navigate('/login')
    } catch (err: any) {
      initiate(err.response.data.msg, 'error')
    }

    setLoading(false)
  }

  return (
    <>
      <HeadInfo title='Sign Up' />
      <div className='flex w-full h-screen'>
        <div className='flex-1 lg:px-20 px-8 flex flex-col justify-center'>
          <div className='flex justify-center mb-7'>
            <Link to='/'>
              <Logo size='md'  />
            </Link>
          </div>
          <h1 className='text-center text-xl mb-5'>{APP_NAME}</h1>
          <p className='text-center text-3xl font-medium'>Lets Become Member!</p>
          <form onSubmit={handleSubmit} className='mt-9'>
            <div className='w-full rounded-full border border-gray-400 relative px-5 py-2'>
              <input type='text' value={name} onChange={e => setName(e.target.value)} className='outline-none w-full text-sm ' />
              <p className={`absolute top-1/2 -translate-y-1/2 left-5 text-sm text-gray-300 ${name ? 'hidden' : 'block'}`}>Name</p>
            </div>
            <div className='w-full rounded-full border border-gray-400 relative px-5 py-2 mt-6'>
              <input type='text' value={email} onChange={e => setEmail(e.target.value)} className='outline-none w-full text-sm ' />
              <p className={`absolute top-1/2 -translate-y-1/2 left-5 text-sm text-gray-300 ${email ? 'hidden' : 'block'}`}>Email address</p>
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
            <div className='w-full rounded-full border border-gray-400 relative px-5 py-2 mt-6'>
              <input type={`${showPasswordConfirmation ? 'text' : 'password'}`} value={passwordConfirmation} onChange={e => setPasswordConfirmation(e.target.value)} className='outline-none w-full text-sm pr-8' />
              <p className={`absolute top-1/2 -translate-y-1/2 left-5 text-sm text-gray-300 ${passwordConfirmation ? 'hidden' : 'block'}`}>Password Confirmation</p>
              {
                showPasswordConfirmation
                ? <AiFillEyeInvisible onClick={() => setShowPasswordConfirmation(false)} className='absolute top-1/2 -translate-y-1/2 right-5 first-letter text-gray-500 cursor-pointer' />
                : <AiFillEye onClick={() => setShowPasswordConfirmation(true)} className='absolute top-1/2 -translate-y-1/2 right-5 first-letter text-gray-500 cursor-pointer' />
              }
            </div>
            <button disabled={loading || !name || !email || !password || !passwordConfirmation} className={`${loading || !name || !email || !password || !passwordConfirmation ? 'bg-gray-300 hover:bg-gray-300 cursor-not-allowed' : 'bg-black hover:bg-gray-800 cursor-pointer'} outline-none transition-all text-white w-full py-3 text-sm rounded-full mt-8`}>
              {
                loading ? 'Loading ...' : 'Sign Up'
              }
            </button>
          </form>
          <p className='text-xs font-semibold text-center mt-5 text-gray-400'>Already have an account? <Link to='/login' className='text-black'>Login</Link></p>  
        </div>
        <div className='flex-1 px-20 bg-gray-200 md:block hidden relative'>
          <img src={`${process.env.PUBLIC_URL}/images/photos/register.jpg`} alt={`${APP_NAME} Sign Up`} className='object-cover w-full h-full absolute top-0 left-0 pointer-events-none' />
        </div>
      </div>
    </>
  )
}

export default SignUp