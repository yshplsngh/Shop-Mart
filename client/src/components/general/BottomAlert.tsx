import { useEffect } from 'react'
import { FaRegCircleCheck } from 'react-icons/fa6'
import useStore from './../../store/store'

const BottomAlert = () => {
  const { bottomAlertState, clearBottomAlert } = useStore()

  useEffect(() => {
    const removeAlertAfter3Seconds = () => {
      setTimeout(() => {
        clearBottomAlert()
      }, 1750);
    }

    if (bottomAlertState.entity)
      removeAlertAfter3Seconds()
  }, [bottomAlertState.entity, clearBottomAlert])

  return (
    <div className='fixed bottom-8 z-10 left-1/2 -translate-x-1/2 md:w-auto w-full'>
      {
        bottomAlertState.type === 'success'
        ? (
          <div className={`flex relative before:content-[""] bg-white shadow-xl rounded-md before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-green-500 py-4 px-10 items-center gap-4 text-green-500 font-semibold border border-gray-200`}>
            <FaRegCircleCheck />
            <p>Item has been added to {bottomAlertState.entity}</p>
          </div>
        )
        : bottomAlertState.type === 'error'
          ? (
            <div className={`flex relative before:content-[""] bg-white shadow-xl rounded-md before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-red-500 py-4 px-10 items-center gap-4 text-red-500 font-semibold border border-gray-200`}>
              <FaRegCircleCheck />
              <p>Item has been removed from {bottomAlertState.entity}</p>
            </div>
          )
          : ''
      }
    </div>
  )
}

export default BottomAlert