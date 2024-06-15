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

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<SignIn />} />
        <Route path='/register' element={<SignUp />} />
        <Route path='/products' element={<Products />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/admin/product' element={<Product />} />
        <Route path='/admin/category' element={<Category />} />
        <Route path='/admin/product-discount' element={<ProductDiscount />} />
        <Route path='/products/:slug' element={<Detail />} />
      </Routes>
    </Router>
  )
}

export default App