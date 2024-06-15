import { IoIosCheckmarkCircle } from 'react-icons/io'
import { IoCloseCircle } from 'react-icons/io5'
import useStore from './../../store/store'

const Alert = () => {
  const { alertState, clear } = useStore()

  return (
    <div className={`${alertState.type ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} fixed top-0 left-0 bottom-0 p-6 right-0 bg-[rgba(0,0,0,.6)] flex items-center justify-center transition-opacity`}>
      <div className={`lg:w-1/3 md:w-2/3 w-full flex flex-col max-h-[90%] bg-white rounded-lg ${alertState.type ? 'translate-y-0' : '-translate-y-8'} transition-transform p-8 items-center justify-center`}>
        {
          alertState.type === 'error'
          ? <IoCloseCircle className='text-9xl text-red-500' />
          : alertState.type === 'success'
            ? <IoIosCheckmarkCircle className='text-9xl text-green-600' />
            : ''
        }
        <p className='mt-4 font-bold'>{alertState.type === 'error' ? 'Operation Failed' : alertState.type === 'success' ? 'Operation Success' : ''}</p>
        <p className='mt-2 text-sm text-gray-500 text-center'>{alertState.message}</p>
        <div className='mt-8'>
          <button onClick={clear} className={`font-bold text-white px-6 py-3 rounded-md text-sm ${alertState.type === 'success' ? 'bg-green-500 hover:bg-green-600' : alertState.type === 'error' ? 'bg-red-500 hover:bg-red-600' : ''} transition`}>OK, I got it</button>
        </div>
      </div>
    </div>
  )
}

export default Alert