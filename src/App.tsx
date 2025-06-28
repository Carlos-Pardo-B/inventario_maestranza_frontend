import { Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import Login from './pages/Login';
import Home from './pages/Home';
import ProductList from './pages/ProductList';



function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout/>}>
        <Route path='login' element={<Login/>} />
        <Route path='product_list' element={<ProductList/>} />
        <Route index element={<Home />}/>
      </Route>
    </Routes>
  )
}

export default App
