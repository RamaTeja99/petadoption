import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const AdminContext = createContext()

const AdminContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '')
    const [adoptions, setAdoptions] = useState([])
    const [pets, setPets] = useState([])
    const [dashData, setDashData] = useState(false)

    // Getting all Pets data from Database using API
    const getAllPets = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/all-pets', { headers: { aToken } })
            if (data.success) {
                setPets(data.pets)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // Function to change pet availability using API
    const changeAvailability = async (petId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/change-availability', { petId }, { headers: { aToken } })
            if (data.success) {
                toast.success(data.message)
                getAllPets()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // Getting all adoption data from Database using API
    const getAllAdoptions = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/adoptions', { headers: { aToken } })
            if (data.success) {
                setAdoptions(data.adoptions.reverse())
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }
    }

    // Function to cancel adoption using API
    const cancelAdoption = async (adoptionId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/cancel-adoption', { adoptionId }, { headers: { aToken } })
            if (data.success) {
                toast.success(data.message)
                getAllAdoptions()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }
    }

    // Getting Admin Dashboard data from Database using API
    const getDashData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/dashboard', { headers: { aToken } })
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
        aToken, setAToken,
        pets,
        getAllPets,
        changeAvailability,
        adoptions,
        getAllAdoptions,
        getDashData,
        cancelAdoption,
        dashData
    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )

}

export default AdminContextProvider