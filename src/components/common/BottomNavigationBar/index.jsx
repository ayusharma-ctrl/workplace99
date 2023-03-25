import React, { useEffect, useState } from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
// import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import ChatIcon from '@mui/icons-material/Chat';
import TurnedInIcon from '@mui/icons-material/TurnedIn';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

//this is for the mobile screens

const BottomNavigationBar = () => {

    const userData = useSelector((state) => state.login)
    const userType = userData?.userInfo?.userType || null
    const [value, setValue] = useState('profile');
    const navigate = useNavigate();
    const location = useLocation();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(()=>{
        const index = location.pathname.lastIndexOf('/')
        setValue(location.pathname.slice(index+1))
    },[])
    
//using mediaquery to identify device screen size
    const isXsScreen = useMediaQuery('(max-width:600px)');

    const redirect = (type) => {
        if (type === 'jobs') {
            userType === 'candidate' ? navigate('/candidate/jobs') : navigate('/employer/jobs')
        }
        else if (type === 'profile') {
            userType === 'candidate' ? navigate('/candidate/profile') : navigate('/employer/profile')
        }
        else if (type === 'conversation') {
            userType === 'candidate' ? navigate('/candidate/conversation') : navigate('/employer/conversation')
        }
        else {
            userType === 'candidate' ? navigate('/candidate/applications') : navigate('/employer/applicants')
        }
    }

    useEffect(() => {
        redirect(value)
    }, [value])


    return (
        <>
            {userType !==null && isXsScreen && (
                <BottomNavigation sx={{ width: '100vw', position: 'fixed', bottom: 0, zIndex: 1, backgroundColor: 'rgb(240,245,235,1)' }} value={value} onChange={handleChange}>
                    <BottomNavigationAction
                        label="Jobs"
                        value="jobs"
                        icon={<WorkIcon />}
                    />
                    <BottomNavigationAction
                        label="Applicatons"
                        value="application"
                        icon={<TurnedInIcon />}
                    />
                    <BottomNavigationAction
                        label="Chat"
                        value="conversation"
                        icon={<ChatIcon />}
                    />
                    <BottomNavigationAction
                        label="Profile"
                        value="profile"
                        icon={<PersonIcon />}
                    />
                </BottomNavigation>
            )}
        </>
    )
}

export default BottomNavigationBar