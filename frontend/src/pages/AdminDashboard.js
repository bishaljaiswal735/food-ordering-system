import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddCategory from './AddCategory'
import ManageCategory from "./ManageCategory";

const AdminDashboard = () => {
  
  return (
    <div>
      <ManageCategory/>
    </div>
  )
}

export default AdminDashboard
