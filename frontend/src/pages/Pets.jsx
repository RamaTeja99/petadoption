import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate, useParams } from 'react-router-dom'

const Pets = () => {

    const { category } = useParams()
    const [filterPet, setFilterPet] = useState([])
    const [showFilter, setShowFilter] = useState(false)
    const navigate = useNavigate()
    const { pets } = useContext(AppContext)

    const applyFilter = () => {
        if (category) {
            console.log('Filtering by category:', category)
            console.log('Available pets:', pets)
            const filtered = pets.filter(pet => pet.breed === category)
            console.log('Filtered pets:', filtered)
            setFilterPet(filtered)
        } else {
            setFilterPet(pets)
        }
    }

    useEffect(() => {
        applyFilter()
    }, [pets, category])

    return (
        <div>
            <p className='text-gray-600'>Browse through our rescued pets.</p>
            <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
                <button onClick={() => setShowFilter(!showFilter)} className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? 'bg-primary text-white' : ''}`}>Filters</button>
                <div className={`flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
                    <p onClick={() => category === 'Dogs' ? navigate('/pets') : navigate('/pets/Dogs')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${category === 'Dogs' ? 'bg-[#E2E5FF] text-black ' : ''}`}>Dogs</p>
                    <p onClick={() => category === 'Cats' ? navigate('/pets') : navigate('/pets/Cats')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${category === 'Cats' ? 'bg-[#E2E5FF] text-black ' : ''}`}>Cats</p>
                    <p onClick={() => category === 'Birds' ? navigate('/pets') : navigate('/pets/Birds')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${category === 'Birds' ? 'bg-[#E2E5FF] text-black ' : ''}`}>Birds</p>
                    <p onClick={() => category === 'Rabbits' ? navigate('/pets') : navigate('/pets/Rabbits')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${category === 'Rabbits' ? 'bg-[#E2E5FF] text-black ' : ''}`}>Rabbits</p>
                    <p onClick={() => category === 'Fish' ? navigate('/pets') : navigate('/pets/Fish')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${category === 'Fish' ? 'bg-[#E2E5FF] text-black ' : ''}`}>Fish</p>
                    <p onClick={() => category === 'Others' ? navigate('/pets') : navigate('/pets/Others')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${category === 'Others' ? 'bg-[#E2E5FF] text-black ' : ''}`}>Others</p>
                </div>
                <div className='w-full grid grid-cols-auto gap-4 gap-y-6'>
                    {
                        filterPet.map((item, index) => (
                            <div onClick={() => navigate(`/adoption/${item._id}`)} className='border border-[#C9D8FF] rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500' key={index}>
                                <img className='bg-[#EAEFFF]' src={item.image} alt="" />
                                <div className='p-4'>
                                    <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500' : "text-gray-500"}`}>
                                        <p className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : "bg-gray-500"}`}></p><p>{item.available ? 'Available' : "Not Available"}</p>
                                    </div>
                                    <p className='text-[#262626] text-lg font-medium'>{item.name}</p>
                                    <p className='text-[#5C5C5C] text-sm'>{item.breed}</p>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
            {filterPet.length === 0 && (
                <div className='text-center py-10'>
                    <p className='text-gray-500'>No pets found in this category.</p>
                    <p className='text-sm text-gray-400 mt-2'>Try selecting a different category or check back later.</p>
                </div>
            )}
        </div>
    )
}

export default Pets