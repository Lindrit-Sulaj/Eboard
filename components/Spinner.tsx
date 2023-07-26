import React from 'react'

export default function Spinner() {
  return (
    <div className='w-full h-screen absolute top-0 left-0 flex justify-center items-center'><div className="lds-ripple"><div></div><div></div></div></div>
  )
}
