import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { NavLink } from 'react-router-dom'
import { ShelterContext } from '../context/ShelterContext'
import { AdminContext } from '../context/AdminContext'

const Sidebar = () => {

    const { sToken } = useContext(ShelterContext)
    const { aToken } = useContext(AdminContext)

    return (
        <div className='min-h-screen bg-white border-r'>
            {
                aToken && <ul className='text-[#515151] mt-5'>
                    <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`} to={'/admin-dashboard'}>
                        <img className='min-w-5' src={assets.home_icon} alt="" />
                        <p className='hidden md:block'>Dashboard</p>
                    </NavLink>
                    <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`} to={'/all-adoptions'}>
                        <img className='min-w-5' src={assets.appointment_icon} alt="" />
                        <p className='hidden md:block'>Adoptions</p>
                    </NavLink>
                    <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`} to={'/add-pet'}>
                        <img className='min-w-5' src={assets.add_icon} alt="" />
                        <p className='hidden md:block'>Add Pet</p>
                    </NavLink>
                    <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`} to={'/pet-list'}>
                        <img className='min-w-5' src={assets.people_icon} alt="" />
                        <p className='hidden md:block'>Pets List</p>
                    </NavLink>
                </ul>
            }
            {
                sToken && <ul className='text-[#515151] mt-5'>
                    <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`} to={'/shelter-dashboard'}>
                        <img className='min-w-5' src={assets.home_icon} alt="" />
                        <p className='hidden md:block'>Dashboard</p>
                    </NavLink>
                    <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`} to={'/shelter-adoptions'}>
                        <img className='min-w-5' src={assets.appointment_icon} alt="" />
                        <p className='hidden md:block'>Adoptions</p>
                    </NavLink>
                    <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`} to={'/shelter-profile'}>
                        <img className='min-w-5' src={assets.people_icon} alt="" />
                        <p className='hidden md:block'>Profile</p>
                    </NavLink>
                </ul>
            }
        </div>
    )
}

export default Sidebar