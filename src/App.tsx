import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './components/navbar'
import Users from './pages/users'
import Categories from './pages/categories'
import Products from './pages/products'
import Cart from './pages/cart'

function App() {

  return (
    <>
      <Navbar />
      <div className='mx-auto max-w-7xl p-2 sm:p-6 lg:p-8 bg-gray-100'>
        <Routes>
          <Route path='/users' element={<Users />} />
          <Route path='/categories' element={<Categories />} />
          <Route path='/products' element={<Products />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='*' element={<Navigate to={"/users"} />} />
        </Routes>
      </div>
    </>
  )
}

export default App
