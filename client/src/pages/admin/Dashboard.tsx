import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from './../../components/template/AdminLayout'
import useStore from './../../store/store'

const Dashboard = () => {
  const navigate = useNavigate()

  const { userState } = useStore()

  useEffect(() => {
    if (!userState.loading) {
      if (userState.data.accessToken) {
        if (userState.data.user?.role !== 'admin') {
          navigate('/')
        }
      } else {
        navigate('/login')
      }
    }
  }, [userState.data, userState.loading, navigate])

  return (
    <>
      <AdminLayout title='Dashboard'>
        <div className='flex flex-col h-full'>
          {/* header */}
          <div className='flex items-center justify-between'>
            <h1 className='text-xl font-semibold'>Dashboard</h1>
          </div>
        </div>
      </AdminLayout>
    </>
  )
}

export default Dashboard