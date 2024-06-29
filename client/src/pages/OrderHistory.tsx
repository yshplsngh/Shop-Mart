import { AiFillEye } from 'react-icons/ai'
import { currencyFormatter } from '../utils/currency'
import Footer from './../components/general/Footer'
import Navbar from './../components/general/Navbar'
import HeadInfo from './../utils/HeadInfo'

const OrderHistory = () => {
  return (
    <>
      <HeadInfo title='Order History' />
      <Navbar />
      <div className='py-10 md:px-12 px-6'>
        <div>
          <h1 className='text-center text-3xl font-medium'>Order History</h1>
        </div>
        <div className='overflow-x-auto w-full mt-12'>
          <table className='w-full text-left'>
            <thead className='text-sm text-gray-500 font-normal'>
              <tr>
                <th className='pb-5'>Order ID</th>
                <th className='pb-5'>Items Count</th>
                <th className='pb-5'>Shipping Cost</th>
                <th className='pb-5'>Total</th>
                <th className='pb-5'>Payment Status</th>
                <th className='pb-5'>Order Date</th>
                <th className='pb-5'>Action</th>
              </tr>
            </thead>
            <tbody className='text-sm'>
              <tr className='border-b border-gray-200'>
                <td className='py-4'>637832</td>
                <td>4</td>
                <td>{currencyFormatter(20000)},00</td>
                <td>{currencyFormatter(20000)},00</td>
                <td>SUCCEEDED</td>
                <td>25 January 2023</td>
                <td className='flex items-center gap-5 py-4'>
                  <AiFillEye className='text-blue-500 text-xl cursor-pointer' />
                  <button className='bg-green-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-green-700 transition'>Complete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default OrderHistory