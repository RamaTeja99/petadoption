import axios from 'axios'
import React, { useContext, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'

const Verify = () => {

    const [searchParams, setSearchParams] = useSearchParams()
    const success = searchParams.get("success")
    const adoptionId = searchParams.get("adoptionId")
    const { backendUrl, token } = useContext(AppContext)
    const navigate = useNavigate()

    // Function to verify stripe payment
    const verifyStripe = async () => {

        try {

            const { data } = await axios.post(backendUrl + "/api/user/verifyStripe", { success, adoptionId }, { headers: { token } })

            if (data.success) {
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }

            navigate("/my-adoptions")

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    useEffect(() => {
        if (token, adoptionId, success) {
            verifyStripe()
        }
    }, [token])

    return (
        <div>

        </div>
    )

}

export default Verify