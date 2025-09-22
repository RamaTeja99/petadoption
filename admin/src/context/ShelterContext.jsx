import { createContext, useState } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'

export const ShelterContext = createContext()

const ShelterContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [sToken, setSToken] = useState(localStorage.getItem('sToken') ? localStorage.getItem('sToken') : '')
    const [adoptions, setAdoptions] = useState([])
    const [dashData, setDashData] = useState(false)
    const [profileData, setProfileData] = useState(false)

    // Getting Shelter adoption data from Database using API
    const getAdoptions = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/pet/adoptions', { headers: { sToken } })
            if (data.success) {
                setAdoptions(data.adoptions.reverse())
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // Getting Shelter profile data from Database using API  
    const getProfileData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/pet/profile', { headers: { sToken } })
            console.log(data.profileData)
            setProfileData(data.profileData)
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // Function to cancel adoption visit using API
    const cancelAdoption = async (adoptionId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/pet/cancel-adoption', { adoptionId }, { headers: { sToken } })
            if (data.success) {
                toast.success(data.message)
                getAdoptions()
                // after creating dashboard
                getDashData()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }
    }

    // Function to Mark adoption completed using API
    const completeAdoption = async (adoptionId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/pet/complete-adoption', { adoptionId }, { headers: { sToken } })
            if (data.success) {
                toast.success(data.message)
                getAdoptions()
                // Later after creating getDashData Function
                getDashData()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }
    }

    // Getting Shelter dashboard data using API
    const getDashData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/pet/dashboard', { headers: { sToken } })
            if (data.success) {
                setDashData(data.dashData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const value = {
        sToken, setSToken, backendUrl,
        adoptions,
        getAdoptions,
        cancelAdoption,
        completeAdoption,
        dashData, getDashData,
        profileData, setProfileData,
        getProfileData,
    }

    return (
        <ShelterContext.Provider value={value}>
            {props.children}
        </ShelterContext.Provider>
    )

}

export default ShelterContextProvider