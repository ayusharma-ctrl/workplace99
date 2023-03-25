import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const SemiPrivate = () => {

    const userData = useSelector((state) => state.login)

  return (
    <div>
        {userData?.user ? (
            <Outlet/>
        ) : (
            <Navigate to='/' />
        )}
    </div>
  )
}

export default SemiPrivate