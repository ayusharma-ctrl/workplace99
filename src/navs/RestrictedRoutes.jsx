import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'


//restricting user to access auth page in case if logged in

const RestrictedRoutes = () => {

    const userData = useSelector((state) => state.login)

    return (
        <div>
            {userData?.userInfo ? (userData?.userInfo?.userType === 'candidate' ? (<Navigate to='/candidate/profile' />) : (<Navigate to='/employer/profile' />))
                : (<Outlet />)}
        </div>
    )
}

export default React.memo(RestrictedRoutes)