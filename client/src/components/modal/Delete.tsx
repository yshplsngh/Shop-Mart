import { PiSealWarningFill } from 'react-icons/pi'

interface IProps {
  openDeleteModal: boolean
  setOpenDeleteModal: React.Dispatch<React.SetStateAction<boolean>>
  deleteModalRef: React.MutableRefObject<HTMLDivElement>
  handleDelete: () => void
  name: string
  entity: string
  removeSelectedItem: () => void
}

const Delete: React.FC<IProps> = ({ openDeleteModal, setOpenDeleteModal, deleteModalRef, handleDelete, name, entity, removeSelectedItem }) => {
  const handleClickClose = () => {
    setOpenDeleteModal(false)
    removeSelectedItem()
  }

  return (
    <div className={`${openDeleteModal ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} fixed top-0 left-0 bottom-0 right-0 bg-[rgba(0,0,0,.6)] flex items-center justify-center transition-opacity`}>
      <div ref={deleteModalRef} className={`w-1/3 flex flex-col max-h-[90%] bg-white rounded-lg ${openDeleteModal ? 'translate-y-0' : '-translate-y-10'} transition-transform p-8 flex items-center justify-center`}>
        <PiSealWarningFill className='text-9xl text-orange-500' />
        <p className='mt-4 text-center'>Are you sure to delete <strong>{name}</strong> {entity}?</p>
        <div className='mt-6 flex items-center gap-5 justify-center'>
          <button onClick={handleClickClose} className='bg-gray-200 rounded-md px-6 py-3 text-sm hover:bg-gray-300 transition'>No, I'm not sure</button>
          <button onClick={handleDelete} className='font-bold bg-red-500 text-white px-6 py-3 rounded-md text-sm hover:bg-red-600 transition'>Yes, I'm sure</button>
        </div>
      </div>
    </div>
  )
}

export default Delete