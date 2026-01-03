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
import SearchPage from './pages/SearchPage';
import Register from './pages/Register';
import Login from './pages/Login';
import FoodDetail from './pages/FoodDetail';
import Cart from './pages/Cart';
import PaymentPage from './pages/PaymentPage';
import OrderDetails from './pages/OrderDetails';
import MyOrders from './pages/MyOrders';
import ProfilePage from './pages/ProfilePage';
import ChangePassword from './pages/ChangePassword';
import OrdersNotConfirmed from './pages/OrdersNotConfirmed';
import OrdersConfirmed from './pages/OrdersConfirmed';
import OrderCancelled from './pages/OrderCancelled';
import FoodPickup from './pages/FoodPickup';
import FoodDelivered from './pages/FoodDelivered';
import FoodbeingPrepared from './pages/FoodbeingPrepared';
import AllOrders from './pages/AllOrders';
import OrderReport from './pages/OrderReport';
import ViewFoodOrder from './pages/ViewFoodOrder';
import SearchOrders from './pages/SearchOrders';
import EditCategory from './pages/EditCategory';
import EditFood from './pages/EditFood';
import ManageUser from './pages/ManageUser';
import FoodList from './pages/FoodList';
import TrackOrder from './pages/TrackOrder';


function App() {
  return (
    <BrowserRouter><Routes>
      <Route path='/' element={<Home/>}></Route>
      <Route path='/adminlogin' element={<AdminLogin/>}></Route>
      <Route path='/search' element={<SearchPage/>}></Route>
      <Route path='/login' element={<Login/>}></Route>
      <Route path='/register' element={<Register/>}></Route>
      <Route path="/food/:id" element={<FoodDetail/>} />
      <Route path='/cart' element={<Cart/>}></Route>
      <Route path='/payment' element={<PaymentPage/>}></Route>
      <Route path='/my-orders' element={<MyOrders/>}></Route>
      <Route path='/profile' element={<ProfilePage/>}></Route>
      <Route path="/track" element={<TrackOrder />} />
      <Route path='/change-password' element={<ChangePassword/>}></Route>
      <Route path="/foods" element={<FoodList />} />
      <Route path='/order-details/:order_number' element={<OrderDetails/>}></Route>
      <Route path="/admin" element={<AdminProtectedRoute />}>
          <Route index element={<AdminDashboard />} />
          <Route path='addfood' element={<AddFood/>} />
          <Route path='managefood' element={<ManageFood/>} />
          <Route path='addcategory' element={<AddCategory/>} />
          <Route path='managecategory' element={<ManageCategory/>} />
          <Route path='users' element={<ManageUser/>} />
          <Route path='orders/new' element={<OrdersNotConfirmed/>} />
          <Route path='orders/confirmed' element={<OrdersConfirmed/>} />
          <Route path='orders/cancelled' element={<OrderCancelled/>} />
          <Route path='orders/pickup' element={<FoodPickup/>} />
          <Route path='orders/delivered' element={<FoodDelivered/>} />
          <Route path='orders/preparing' element={<FoodbeingPrepared/>} />
          <Route path='orders/all' element={<AllOrders/>} />
          <Route path='report-datewise' element={<OrderReport/>} />
          <Route path='order-view/:order_number' element={<ViewFoodOrder/>} />
          <Route path='order-search' element={<SearchOrders/>} />
          <Route path='category-edit/:id' element={<EditCategory/>} />
          <Route path='food-edit/:id' element={<EditFood/>} />

       </Route>
      </Routes>
      </BrowserRouter>
  );
}

export default App;
