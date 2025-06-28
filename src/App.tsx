import { Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import Login from './pages/Login';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import CategoriesPage from './pages/CategoryList';
import LocationsPage from './pages/LocationList';
import ProjectsPage from './pages/ProjectList';
import ProductTagsPage from './pages/ProductTagList';
import MovementsPage from './pages/MovementList';
import LotsPage from './pages/LotsList';
import AdministratorPage from './pages/AdministratorPage';
import TagsPage from './pages/TagList';
import KitsPage from './pages/KitsList';
import KitComponentesPage from './pages/KitComponentsList';
import ProveedoresPage from './pages/ProveedoresList';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout/>}>
        <Route path='login' element={<Login/>} />
        <Route path='product_list' element={<ProductList/>} />
        <Route path='category_list' element={<CategoriesPage/>} />
        <Route path='location_list' element={<LocationsPage/>} />
        <Route path='project_list' element={<ProjectsPage/>} />
        <Route path='product_tag_list' element={<ProductTagsPage/>} />
        <Route path='movement_list' element={<MovementsPage/>} />
        <Route path='lot_list' element={<LotsPage/>} />
        <Route path='tag_list' element={<TagsPage/>} />
        <Route path='kit_list' element={<KitsPage/>} />
        <Route path='kit_component_list' element={<KitComponentesPage/>} />
        <Route path='proveedores_list' element={<ProveedoresPage/>} />
        <Route path='administrator' element={<AdministratorPage/>} />
        <Route index element={<Home />}/>
      </Route>
    </Routes>
  )
}

export default App
