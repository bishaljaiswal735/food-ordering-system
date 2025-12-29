import logo from './logo.svg';
import './App.css';
import Home from './pages/home';
import {BrowserRouter,Routes, Route} from 'react-router-dom';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import AddFood from './pages/AddFood';
import AddCategory from './pages/AddCategory';
import ManageCategory from './pages/ManageCategory';
import ManageFood from './pages/ManageFood';


function App() {
  return (
    <BrowserRouter><Routes>
      <Route path='/' element={<Home/>}></Route>
      <Route path='/adminlogin/' element={<AdminLogin/>}></Route>
      <Route path="/admin" element={<AdminProtectedRoute />}>
          <Route index element={<AdminDashboard />} />
          <Route path='addfood' element={<AddFood/>} />
          <Route path='managefood' element={<ManageFood/>} />
          <Route path='addcategory' element={<AddCategory/>} />
          <Route path='managecategory' element={<ManageCategory/>} />
       </Route>
      </Routes>
      </BrowserRouter>
  );
}

export default App;
