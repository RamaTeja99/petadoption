import axios from 'axios'
import React, { useContext, useState } from 'react'
import { ShelterContext } from '../context/ShelterContext'
import { AdminContext } from '../context/AdminContext'
import { toast } from 'react-toastify'

const Login = () => {

    const [state, setState] = useState('Admin')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const { setSToken } = useContext(ShelterContext)
    const { setAToken } = useContext(AdminContext)

    const onSubmitHandler = async (event) => {

        event.preventDefault();

        if (state === 'Admin') {

            const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password })
            if (data.success) {
                setAToken(data.token)
                localStorage.setItem('aToken', data.token)
            } else {
                toast.error(data.message)
            }

        } else {

            const { data } = await axios.post(backendUrl + '/api/pet/login', { email, password })
            if (data.success) {
                setSToken(data.token)
                localStorage.setItem('sToken', data.token)
            } else {
                toast.error(data.message)
            }

        }

    }

    return (
        <form onSubmit={onSubmitHandler} className='min-h-screen flex items-center justify-center w-full'>
            <div className='bg-white shadow-md rounded-lg px-8 py-6 max-w-md'>
                <h1 className='text-2xl font-semibold mb-4'>{state} Login</h1>
                <div className='mb-3 min-w-72'>
                    <p className='text-sm font-medium text-gray-700 mb-2'>Email</p>
                    <input onChange={(e) => setEmail(e.target.value)} value={email} className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none' type="email" required />
                </div>
                <div className='mb-3'>
                    <p className='text-sm font-medium text-gray-700 mb-2'>Password</p>
                    <input onChange={(e) => setPassword(e.target.value)} value={password} className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none' type="password" required />
                </div>
                <button className='mt-2 w-full py-2 px-4 rounded-md text-white bg-primary'>Login</button>
                {
                    state === 'Admin'
                        ? <p>Shelter Login? <span className='text-primary underline cursor-pointer' onClick={() => setState('Shelter')}>Click here</span></p>
                        : <p>Admin Login? <span className='text-primary underline cursor-pointer' onClick={() => setState('Admin')}>Click here</span></p>
                }
            </div>
        </form>
    )

}

export default Login