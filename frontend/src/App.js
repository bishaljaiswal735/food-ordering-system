import logo from './logo.svg';
import './App.css';
import Home from './pages/home';
import {BrowserRouter,Routes, Route} from 'react-router-dom';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminProtectedRoute from './components/AdminProtectedRoute';

function App() {
  return (
    <BrowserRouter><Routes>
      <Route path='/' element={<Home/>}></Route>
      <Route path='/adminlogin/' element={<AdminLogin/>}></Route>
      <Route path="/admin" element={<AdminProtectedRoute />}>
          <Route index element={<AdminDashboard />} />
       </Route>
      </Routes>
      </BrowserRouter>
  );
}

export default App;
