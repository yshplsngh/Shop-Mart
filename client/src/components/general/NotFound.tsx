import { Link } from "react-router-dom"
import { APP_NAME } from "../../utils/constant"
import Logo from "./Logo"

const NotFound = () => {
  return (
    <div className='w-screen h-screen overflow-hidden flex flex-col items-center justify-center'>
      <div className='flex items-center justify-center flex-col gap-4'>
        <Logo size='lg' />
        <h1 className='text-2xl font-semibold'>{APP_NAME}</h1>
      </div>
      <p className='text-5xl font-semibold mt-16'>404 | Not Found</p>
      <Link to='/' className='bg-black text-white rounded-md px-5 py-3 mt-16 transition hover:bg-gray-800'>
        Back to Home
      </Link>
    </div>
  )
}

export default NotFound