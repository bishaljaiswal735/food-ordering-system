import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddCategory from './AddCategory'

const AdminDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('access')
  const[isLoading,setLoading] = useState(true)
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/admin-check/",{
       method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`}})
        .then((response) => {
          if(!response.ok){
            throw new Error('Not authorize')
          }
          else {
            return response.json()
          }
        })
        .then(() => {
           setLoading(false);})
        .catch(()=>{
           localStorage.removeItem("access");
           localStorage.removeItem("refresh");
          navigate('/adminlogin')
        })
  },[])
    if (isLoading) {
      return null
    }
  return (
    <div>
      <AddCategory/>
    </div>
  )
}

export default AdminDashboard
