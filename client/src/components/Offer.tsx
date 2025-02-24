import { FaPlane, FaNewspaper, FaGlobe, FaVideo } from 'react-icons/fa'

const WhatWeOffer = () => {
  const offerings = [
    {
      icon: <FaPlane className='text-4xl text-[#2c586a]' />,
      title: 'Travel Guides & Tips',
      description:
        'Discover hidden gems, top destinations, and expert advice to make your journeys unforgettable.'
    },
    {
      icon: <FaNewspaper className='text-4xl text-[#2c586a]' />,
      title: 'Breaking News & Insights',
      description:
        'Stay up to date with the latest happenings around the globe, from politics to culture.'
    },
    {
      icon: <FaGlobe className='text-4xl text-[#2c586a]' />,
      title: 'Cultural Stories',
      description:
        'Dive into diverse traditions, food, and people shaping our world.'
    },
    {
      icon: <FaVideo className='text-4xl text-[#2c586a]' />,
      title: 'Visual Journeys',
      description:
        'Experience destinations through breathtaking photography and video storytelling.'
    },
  ]

  return (
    <section className='py-16 bg-gray-50'>
      <div className='max-w-6xl mx-auto px-6'>
        <h2 className='text-3xl md:text-4xl font-bold text-[#2c586a] text-center'>
          What We Offer
        </h2>
        <p className='text-lg text-gray-600 text-center mt-4 max-w-3xl mx-auto'>
          Join us on this exciting journey as we bridge the gap between
          adventure and awareness.
        </p>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-10'>
          {offerings.map((offer, index) => (
            <div
              key={index}
              className='bg-white p-6 rounded-lg shadow-lg text-center flex flex-col items-center hover:ease-in-out transform hover:-translate-y-1 hover:scale-105'
            >
              {offer.icon}
              <h3 className='text-xl font-semibold text-[#2c586a] mt-4'>
                {offer.title}
              </h3>
              <p className='text-gray-600 mt-2'>{offer.description}</p>
            </div>
          ))}
        </div>

        <div className='text-center mt-12'>
          <button className='bg-[#2c586a] text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-[#234956] transition duration-300'>
            Start Exploring. Stay Informed.
          </button>
        </div>
      </div>
    </section>
  )
};

export default WhatWeOffer
