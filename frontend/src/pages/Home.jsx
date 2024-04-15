import React, { useState } from 'react'
import ResponsiveAppBar from '../components/Navbar'
import ActionAreaCard from '../components/Card'
import axios from 'axios'

const Home = () => {
    const [destinations, setDestinations] = useState([])
    const [flights, setFlights] = useState([])
    const [hotels, setHotels] = useState([])
    const [query, setQuery] = useState("")

    function search(e) {
        e.preventDefault()
        setQuery(e.target.value)
    }

    async function searchHandler() {
        try {
            const response = await axios.get(`http://localhost:3000/destinations/location/${query}`);

            setDestinations(response.data.destinations)
            setFlights(response.data.flights)
            setHotels(response.data.hotels)
            console.log(destinations)
        } catch (error) {
            console.error('Error fetching search results:', error);
            throw error;
        }
    }

    return (
        <div>
            <ResponsiveAppBar />
            <div className="w-full max-w-xl flex mx-auto my-5 text-lg border border-gray-300">
                <input
                    type="text"
                    className="w-full placeholder-gray-400 text-gray-900 p-4 outline-none"
                    placeholder="Search"
                    onChange={search}
                    value={query}
                />
                <button className="bg-white p-4" onClick={searchHandler}>🔍</button>
            </div>
            <div className='px-6'>
                {
                    destinations.length !== 0 &&
                    <>
                        <div className='text-center text-3xl font-semibold mt-10 my-5'>Destinations</div>
                        <div className='flex justify-evenly flex-wrap'>
                            {destinations.map(dest => (
                                <ActionAreaCard key={dest.destination_id} data={dest} type="destination" />
                            ))}
                        </div>
                    </>
                }
                {
                    hotels.length !== 0 &&
                    <>
                        <div className='text-center text-3xl font-semibold mt-10 my-5'>Hotels</div>
                        <div className='flex justify-evenly flex-wrap'>
                            {hotels.map(hotel => (
                                <ActionAreaCard key={hotel.hotel_id} data={hotel} type="hotel" />
                            ))}
                        </div>
                    </>
                }
                {
                    flights.length !== 0 &&
                    <>
                        <div className='text-center text-3xl font-semibold mt-10 my-5'>Flights</div>
                        <div className='flex justify-evenly flex-wrap'>
                            {destinations.map(dest => (
                                <ActionAreaCard key={dest.destination_id} data={dest} type="destination" />
                            ))}
                        </div>
                    </>
                }
            </div>
        </div >
    )
}

export default Home
