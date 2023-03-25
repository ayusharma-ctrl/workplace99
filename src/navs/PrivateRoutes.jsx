import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'


//if user is logged in, then check if onboarding process is completed or not, if yes then access granted
//else redirect to onboard component
//if not loggedin, then redirect to home page or auth page

const PrivateRoutes = ({ type }) => {

  const userData = useSelector((state) => state.login)

  return (
    <div>
      {userData?.userInfo && userData?.userInfo?.userType === type ? (
        <Outlet />
      ) : (
        !userData?.user ? (
          <Navigate to='/' />
        ) : (
          type === 'candidate' ? <Navigate to='/candidate/onboarding' /> : <Navigate to='/employer/onboarding' />
        )
      )}
    </div>
  )
}

export default React.memo(PrivateRoutes)