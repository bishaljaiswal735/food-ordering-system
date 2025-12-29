import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddCategory from './AddCategory'
import ManageCategory from "./ManageCategory";
import AddFood from "./AddFood";
import ManageFood from "./ManageFood";

const AdminDashboard = () => {
  
  return (
    <div>
      <ManageFood/>
    </div>
  )
}

export default AdminDashboard
