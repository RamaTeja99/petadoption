import React, { useContext } from "react";
import { ShelterContext } from "./context/ShelterContext";
import { AdminContext } from "./context/AdminContext";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Admin/Dashboard";
import AllAdoptions from "./pages/Admin/AllAdoptions";
import AddPet from "./pages/Admin/AddPet";
import PetsList from "./pages/Admin/PetsList";
import Login from "./pages/Login";
import ShelterAdoptions from "./pages/Shelter/ShelterAdoptions";
import ShelterDashboard from "./pages/Shelter/ShelterDashboard";
import ShelterProfile from "./pages/Shelter/ShelterProfile";

const App = () => {
  const { sToken } = useContext(ShelterContext);
  const { aToken } = useContext(AdminContext);

  return sToken || aToken ? (
    <div className="bg-[#F8F9FD]">
      <ToastContainer />
      <Navbar />
      <div className="flex items-start">
        <Sidebar />
        <Routes>
          {/* Admin Routes */}
          <Route path="/" element={<></>} />
          <Route path="/admin-dashboard" element={<Dashboard />} />
          <Route path="/all-adoptions" element={<AllAdoptions />} />
          <Route path="/add-pet" element={<AddPet />} />
          <Route path="/pet-list" element={<PetsList />} />

          {/* Shelter Routes */}
          <Route path="/shelter-dashboard" element={<ShelterDashboard />} />
          <Route path="/shelter-adoptions" element={<ShelterAdoptions />} />
          <Route path="/shelter-profile" element={<ShelterProfile />} />
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <ToastContainer />
      <Login />
    </>
  );
};

export default App;
