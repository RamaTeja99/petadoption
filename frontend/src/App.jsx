import React from 'react'
import Navbar from './components/Navbar'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Pets from './pages/Pets'
import Login from './pages/Login'
import About from './pages/About'
import Contact from './pages/Contact'
import Adoption from './pages/Adoption'
import MyAdoptions from './pages/MyAdoptions'
import MyProfile from './pages/MyProfile'
import Footer from './components/Footer'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Verify from './pages/Verify'

const App = () => {

  return (
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/pets' element={<Pets />} />
        <Route path='/pets/:category' element={<Pets />} />
        <Route path='/login' element={<Login />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/adoption/:petId' element={<Adoption />} />
        <Route path='/my-adoptions' element={<MyAdoptions />} />
        <Route path='/my-profile' element={<MyProfile />} />
        <Route path='/verify' element={<Verify />} />
      </Routes>
      <Footer />
    </div>
  )

}

export default App