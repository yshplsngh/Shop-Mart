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

const App = () => {
  const { refreshToken } = useStore()

  useEffect(() => {
    refreshToken()
  }, [refreshToken])

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<SignIn />} />
          <Route path='/register' element={<SignUp />} />
          <Route path='/products' element={<Products />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/admin' element={<Dashboard />} />
          <Route path='/admin/product' element={<Product />} />
          <Route path='/admin/category' element={<Category />} />
          <Route path='/admin/product-discount' element={<ProductDiscount />} />
          <Route path='/products/:slug' element={<Detail />} />
        </Routes>
      </Router>
      
      <Alert />
    </>
  )
}

export default App