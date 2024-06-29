import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import Detail from './pages/products/Detail'
import Products from './pages/products'
import Cart from './pages/Cart'
import Product from './pages/admin/Product'
import Category from './pages/admin/Category'
import SignUp from './pages/SignUp'
import ProductDiscount from './pages/admin/ProductDiscount'
import Alert from './components/general/Alert'
import useStore from './store/store'
import Dashboard from './pages/admin/Dashboard'
import OwnerPick from './pages/admin/OwnerPick'
import BottomAlert from './components/general/BottomAlert'
import Checkout from './pages/Checkout'
import Profile from './pages/Profile'
import ChangePassword from './pages/ChangePassword'
import Order from './pages/admin/Order'
import OrderHistory from './pages/OrderHistory'

const App = () => {
  const { userState, refreshToken, readCart, readWishlist } = useStore()

  useEffect(() => {
    refreshToken()

    if (userState.data.accessToken) {
      readCart(userState.data.accessToken)
      readWishlist(userState.data.accessToken)      
    } else {
      readCart()
      readWishlist()
    }
  }, [refreshToken, readCart, readWishlist, userState.data.accessToken])

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<SignIn />} />
          <Route path='/register' element={<SignUp />} />
          <Route path='/products' element={<Products />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/checkout' element={<Checkout />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/change-password' element={<ChangePassword />} />
          <Route path='/order-history' element={<OrderHistory />} />
          <Route path='/admin' element={<Dashboard />} />
          <Route path='/admin/product' element={<Product />} />
          <Route path='/admin/category' element={<Category />} />
          <Route path='/admin/product-discount' element={<ProductDiscount />} />
          <Route path='/admin/order' element={<Order />} />
          <Route path='/admin/owners-pick' element={<OwnerPick />} />
          <Route path='/products/:slug' element={<Detail />} />
        </Routes>
      </Router>
      
      <BottomAlert />
      <Alert />
    </>
  )
}

export default App