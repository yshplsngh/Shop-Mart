import { useState } from 'react'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import Footer from './../components/general/Footer'
import Navbar from './../components/general/Navbar'
import HeadInfo from './../utils/HeadInfo'
import { FormSubmitted } from '../utils/interface'
import useStore from './../store/store'
import { patchDataAPI } from '../utils/fetchData'

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('')

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showNewPasswordConfirmation, setShowNewPasswordConfirmation] = useState(false)

  const [loading, setLoading] = useState(false)

  const { userState, initiate } = useStore()

  const handleSubmit = async(e: FormSubmitted) => {
    e.preventDefault()
    setLoading(true)

    if (newPassword !== newPasswordConfirmation) {
      initiate('New password confirmation should be matched with new password.', 'error')
      setLoading(false)
      return
    }

    try {
      const res = await patchDataAPI('/user/password', { currentPassword, newPassword }, userState.data.accessToken)
      initiate(res.data.msg, 'success')
      setCurrentPassword('')
      setNewPassword('')
      setNewPasswordConfirmation('')
    } catch (err: any) {
      initiate(err.response.data.msg, 'error')
      setLoading(false)
      return
    }

    setLoading(false)
  }

  return (
    <>
      <HeadInfo title='Change Password' />
      <Navbar />
      <div className='py-10 md:px-12 px-6'>
        <h1 className='text-center text-3xl font-medium'>Change Password</h1>
        <form onSubmit={handleSubmit} className='border border-gray-300 md:w-1/2 w-full rounded-md p-5 m-auto mt-8'>
          <div className='mb-6'>
            <label htmlFor='currentPassword' className='text-sm'>Current Password</label>
            <div className='w-full rounded-md border border-gray-300 relative px-5 py-2 mt-4'>
              <input type={`${showCurrentPassword ? 'text' : 'password'}`} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className='outline-none w-full text-sm pr-8' />
              <p className={`absolute top-1/2 -translate-y-1/2 left-5 text-sm text-gray-300 ${currentPassword ? 'hidden' : 'block'}`}>Current password</p>
              {
                showCurrentPassword
                ? <AiFillEyeInvisible onClick={() => setShowCurrentPassword(false)} className='absolute top-1/2 -translate-y-1/2 right-5 first-letter text-gray-500 cursor-pointer' />
                : <AiFillEye onClick={() => setShowCurrentPassword(true)} className='absolute top-1/2 -translate-y-1/2 right-5 first-letter text-gray-500 cursor-pointer' />
              }
            </div>
          </div>
          <div className='mb-6'>
            <label htmlFor='newPassword' className='text-sm'>New Password</label>
            <div className='w-full rounded-md border border-gray-300 relative px-5 py-2 mt-4'>
              <input type={`${showNewPassword ? 'text' : 'password'}`} value={newPassword} onChange={e => setNewPassword(e.target.value)} className='outline-none w-full text-sm pr-8' />
              <p className={`absolute top-1/2 -translate-y-1/2 left-5 text-sm text-gray-300 ${newPassword ? 'hidden' : 'block'}`}>New password</p>
              {
                showNewPassword
                ? <AiFillEyeInvisible onClick={() => setShowNewPassword(false)} className='absolute top-1/2 -translate-y-1/2 right-5 first-letter text-gray-500 cursor-pointer' />
                : <AiFillEye onClick={() => setShowNewPassword(true)} className='absolute top-1/2 -translate-y-1/2 right-5 first-letter text-gray-500 cursor-pointer' />
              }
            </div>
          </div>
          <div className='mb-7'>
            <label htmlFor='newPasswordConfirmation' className='text-sm'>New Password Confirmation</label>
            <div className='w-full rounded-md border border-gray-300 relative px-5 py-2 mt-4'>
              <input type={`${showNewPasswordConfirmation ? 'text' : 'password'}`} value={newPasswordConfirmation} onChange={e => setNewPasswordConfirmation(e.target.value)} className='outline-none w-full text-sm pr-8' />
              <p className={`absolute top-1/2 -translate-y-1/2 left-5 text-sm text-gray-300 ${newPasswordConfirmation ? 'hidden' : 'block'}`}>New password confirmation</p>
              {
                showNewPasswordConfirmation
                ? <AiFillEyeInvisible onClick={() => setShowNewPasswordConfirmation(false)} className='absolute top-1/2 -translate-y-1/2 right-5 first-letter text-gray-500 cursor-pointer' />
                : <AiFillEye onClick={() => setShowNewPasswordConfirmation(true)} className='absolute top-1/2 -translate-y-1/2 right-5 first-letter text-gray-500 cursor-pointer' />
              }
            </div>
          </div>
          <div className='flex justify-end'>
            <button disabled={loading || !currentPassword || !newPassword || !newPasswordConfirmation} className={`${loading || !currentPassword || !newPassword || !newPasswordConfirmation ? 'bg-gray-300 hover:bg-gray-300 cursor-not-allowed' : 'bg-black hover:bg-gray-800 cursor-pointer'} transition px-6 py-3 text-sm text-white rounded-md`}>
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

export default ChangePassword