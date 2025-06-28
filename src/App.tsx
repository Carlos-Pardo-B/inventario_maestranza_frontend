import { Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import Login from './pages/Login';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import CategoriesPage from './pages/CategoryList';
import LocationsPage from './pages/LocationList';
import ProjectsPage from './pages/ProjectList';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout/>}>
        <Route path='login' element={<Login/>} />
        <Route path='product_list' element={<ProductList/>} />
        <Route path='category_list' element={<CategoriesPage/>} />
        <Route path='location_list' element={<LocationsPage/>} />
        <Route path='project_list' element={<ProjectsPage/>} />
        <Route index element={<Home />}/>
      </Route>
    </Routes>
  )
}

export default App
