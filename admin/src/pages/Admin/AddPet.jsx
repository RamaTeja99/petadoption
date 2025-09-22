import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'
import axios from 'axios'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const AddPet = () => {

    const [petImg, setPetImg] = useState(false)
    const [name, setName] = useState('')
    const [shelterEmail, setShelterEmail] = useState('')
    const [shelterPassword, setShelterPassword] = useState('')
    const [age, setAge] = useState('1 Year')
    const [fees, setFees] = useState('')
    const [about, setAbout] = useState('')
    const [breed, setBreed] = useState('Dogs')
    const [gender, setGender] = useState('')
    const [address1, setAddress1] = useState('')
    const [address2, setAddress2] = useState('')
    const [shelterName, setShelterName] = useState('')
    const [shelterPhone, setShelterPhone] = useState('')

    const { backendUrl } = useContext(AppContext)
    const { aToken } = useContext(AdminContext)

    const onSubmitHandler = async (event) => {

        event.preventDefault()

        try {

            if (!petImg) {
                return toast.error('Image Not Selected')
            }

            const formData = new FormData();

            formData.append('image', petImg)
            formData.append('name', name)
            formData.append('breed', breed)
            formData.append('age', age)
            formData.append('gender', gender)
            formData.append('fees', Number(fees))
            formData.append('about', about)
            formData.append('address', JSON.stringify({ line1: address1, line2: address2 }))
            formData.append('shelter', JSON.stringify({ 
                name: shelterName,
                email: shelterEmail, 
                password: shelterPassword,
                phone: shelterPhone
            }))

            // console log formdata
            formData.forEach((value, key) => {
                console.log(`${key}: ${value}`);
            });

            const { data } = await axios.post(backendUrl + '/api/admin/add-pet', formData, { headers: { aToken } })

            if (data.success) {
                toast.success(data.message)
                setPetImg(false)
                setName('')
                setShelterEmail('')
                setShelterPassword('')
                setAddress1('')
                setAddress2('')
                setGender('')
                setAbout('')
                setFees('')
                setShelterName('')
                setShelterPhone('')
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    return (
        <form onSubmit={onSubmitHandler} className='m-5 w-full'>

            <p className='mb-3 text-lg font-medium'>Add Pet for Adoption</p>

            <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>
                <div className='flex items-center gap-4 mb-8 text-gray-500'>
                    <label htmlFor="pet-img">
                        <img className='w-16 bg-gray-100 rounded-full cursor-pointer' src={petImg ? URL.createObjectURL(petImg) : assets.upload_area} alt="" />
                    </label>
                    <input onChange={(e) => setPetImg(e.target.files[0])} type="file" id="pet-img" hidden />
                    <p>Upload pet<br />picture</p>
                </div>

                <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>

                    <div className='w-full lg:flex-1 flex flex-col gap-4'>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Pet name</p>
                            <input onChange={(e) => setName(e.target.value)} value={name} className='border rounded px-3 py-2' type="text" placeholder='Name' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Pet breed</p>
                            <select onChange={(e) => setBreed(e.target.value)} value={breed} className='border rounded px-3 py-2'>
                                <option value="Dogs">Dogs</option>
                                <option value="Cats">Cats</option>
                                <option value="Birds">Birds</option>
                                <option value="Rabbits">Rabbits</option>
                                <option value="Fish">Fish</option>
                                <option value="Others">Others</option>
                            </select>
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Pet age</p>
                            <select onChange={(e) => setAge(e.target.value)} value={age} className='border rounded px-3 py-2'>
                                <option value="3 Months">3 Months</option>
                                <option value="6 Months">6 Months</option>
                                <option value="1 Year">1 Year</option>
                                <option value="2 Years">2 Years</option>
                                <option value="3 Years">3 Years</option>
                                <option value="4 Years">4 Years</option>
                                <option value="5+ Years">5+ Years</option>
                            </select>
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Pet gender</p>
                            <input onChange={(e) => setGender(e.target.value)} value={gender} className='border rounded px-3 py-2' type="text" placeholder='Male/Female' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Adoption fees</p>
                            <input onChange={(e) => setFees(e.target.value)} value={fees} className='border rounded px-3 py-2' type="number" placeholder='500' required />
                        </div>

                    </div>

                    <div className='w-full lg:flex-1 flex flex-col gap-4'>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Shelter name</p>
                            <input onChange={(e) => setShelterName(e.target.value)} value={shelterName} className='border rounded px-3 py-2' type="text" placeholder='Shelter Name' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Shelter email</p>
                            <input onChange={(e) => setShelterEmail(e.target.value)} value={shelterEmail} className='border rounded px-3 py-2' type="email" placeholder='Shelter Email' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Shelter password</p>
                            <input onChange={(e) => setShelterPassword(e.target.value)} value={shelterPassword} className='border rounded px-3 py-2' type="password" placeholder='Password' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Shelter phone</p>
                            <input onChange={(e) => setShelterPhone(e.target.value)} value={shelterPhone} className='border rounded px-3 py-2' type="tel" placeholder='Phone Number' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Address</p>
                            <input onChange={(e) => setAddress1(e.target.value)} value={address1} className='border rounded px-3 py-2' type="text" placeholder='Address 1' required />
                            <input onChange={(e) => setAddress2(e.target.value)} value={address2} className='border rounded px-3 py-2' type="text" placeholder='Address 2' required />
                        </div>

                    </div>

                </div>

                <div>
                    <p className='mt-4 mb-2'>About pet</p>
                    <textarea onChange={(e) => setAbout(e.target.value)} value={about} className='w-full px-4 pt-2 border rounded' placeholder='Write about pet' rows={5} required></textarea>
                </div>

                <button type='submit' className='bg-primary px-10 py-3 mt-4 text-white rounded-full'>Add pet</button>
            </div>

        </form>
    )

}

export default AddPet