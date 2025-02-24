const HeroIcon = () => {
  return (
    <div
      className='hidden md:block relative animate-spin'
      style={{ animationDuration: '15s' }}
    >
      <svg
        viewBox='0 0 200 200'
        width='200'
        height='200'
        className='text-lg tracking-widest'
      >
        <defs>
          <path
            id='circlePath'
            fill='none'
            d='M 100,100 m -75,0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0'
          />
        </defs>
        <text fill='black'>
          <textPath href='#circlePath' startOffset='0%'>
            Explore
          </textPath>
          <textPath href='#circlePath' startOffset='22.5%'>
            •
          </textPath>
          <textPath href='#circlePath' startOffset='30%'>
            Discover
          </textPath>
          <textPath href='#circlePath' startOffset='53%'>
            •
          </textPath>
          <textPath href='#circlePath' startOffset='60%'>
            Stay Informed
          </textPath>
          <textPath href='#circlePath' startOffset='95%'>
            •
          </textPath>
        </text>
      </svg>

      {/* Center Button */}
      <div className='absolute inset-0 m-auto w-16 h-16 bg-[#2c586a] rounded-full flex items-center justify-center animate-pulse' />
    </div>
  )
};

export default HeroIcon
