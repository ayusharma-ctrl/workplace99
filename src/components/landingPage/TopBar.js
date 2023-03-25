import React, { useContext, useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Logo from '../../assets/logo.png';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { LOGOUT } from '../../store/reducers/Reducer';
import { db } from '../../firebaseconfig';
import { doc, getDoc } from 'firebase/firestore';
import Logout from '../../assets/logout.png'
import User from '../../assets/user.png'
import Brightness4Icon from '@mui/icons-material/Brightness4';
import { Darkmode } from './../common/Darkmode/index';
import toast from '../common/Toast/index';

// 3 different arrays, based on this, we are designing Navbar buttons
//if user is not logged in
const pages = [
  {
    title: 'Home',
    path: '/',
  },
  {
    title: 'Find Jobs',
    path: '/candidate/auth'
  },
  {
    title: 'Find Candidates',
    path: '/employer/auth'
  }
];
//if user is logged in
const candi = [
  {
    title: 'Jobs',
    path: '/candidate/jobs',
  },
  {
    title: 'Applications',
    path: '/candidate/applications'
  },
  {
    title: 'Conversations',
    path: '/candidate/conversation'
  }
];

const empy = [
  {
    title: 'Jobs',
    path: '/employer/jobs',
  },
  {
    title: 'Applications',
    path: '/employer/applicants'
  },
  {
    title: 'Conversations',
    path: '/employer/conversation'
  }
];


function TopBar() {
//fetching data from redux store
  const userData = useSelector((state) => state.login)
//fetching Darkmode from context API  
  const { theme, toggleTheme } = useContext(Darkmode);
//using this to change of update redux state by sending an action
  const dispatch = useDispatch()
//defining important states
  const [usertype, setUserType] = useState('')
  const [role, setRole] = useState(null)
  const [pages2, setPages2] = useState([])
//using these states for mui hamburger buttons to work/ui responsiveness
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
//fetching current page location
  const atPath = useLocation().pathname
  // console.log(atPath)

//this is to navigate
  const navigate = useNavigate();

//onclick of profile button func
  const profile = () => {
    if (usertype === "candidate") {
      toast("data updated sucessfully", "success");
      navigate('/candidate/profile')
    } else {
      toast("data updated sucessfully", "success");
      navigate('/employer/profile')
    }
  }
//logout button func
  const logout = () => {
    setRole(null)
    dispatch(LOGOUT())
    navigate('/')
  }

//mui menu funcs
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };


//function to redirect user
  const RedirectUser = (path) => {
    navigate(path)
  }

  const redirectToHome = () => {
    navigate('/')
  }  

//fetching user from database by using user email
  const fetchData = async () => {
    try {
      if (userData.user) {
        const docRef = doc(db, 'users', userData.user.email);
        const docSnap = await getDoc(docRef);
//if user exists in our database
        if (docSnap.exists()) {
          const userType = docSnap?.data()?.userType;
          setUserType(userType);
//updating role state, employer or candidate
          if (userType === 'employer') {
            setRole(docSnap?.data()?.role);
          } else {
            setRole(docSnap?.data()?.primaryRole);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

//useEffect so that we can update our Navbar data on user existence  
  useEffect(() => {
    fetchData();
  }, [userData]);
//based on this, we are able to display the right buttons in Navbar menu
  useEffect(() => {
    userData?.userInfo?.userType === 'employer'
      ? setPages2(empy)
      : setPages2(candi);
  }, [userData]);

  

  return (
    <AppBar className='glass-component'
      style={{
        color: theme['--text-color'],
        backgroundColor: theme['--background-color']
      }}
      position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters>

          <Typography
            variant="h6"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              cursor: 'pointer'
            }}
          >
            <img
              width='100px'
              src={Logo}
              alt="logo"
              onClick={redirectToHome}
            />
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon
                style={{
                  color: '#000',
                }}
              />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {userData.userInfo ? pages2.map((page) => (
                <MenuItem key={page.title} onClick={() => RedirectUser(page.path)}>
                  <Typography
                    style={{
                      color: page.path === atPath ? 'purple' : '#000',
                      borderBottom: page.path === atPath ? '1px solid purple' : 'none'
                    }}
                    textAlign="center">{page.title}</Typography>
                </MenuItem>
              )) : pages.map((page) => (
                <MenuItem key={page.title} onClick={() => RedirectUser(page.path)}>
                  <Typography
                    style={{
                      color: page.path === atPath ? 'purple' : '#000',
                      borderBottom: page.path === atPath ? '1px solid purple' : 'none'
                    }}
                    textAlign="center">{page.title}</Typography>
                </MenuItem>
              ))
              }
            </Menu>
          </Box>
          {/* <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} /> */}
          <Typography
            variant="h5"
            noWrap
            component="a"
            onClick={redirectToHome}
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <img
              width='80px'
              src={Logo}
              alt="logo"
            />
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {userData.userInfo ? pages2.map((page) => (
              <Button
                sx={{
                  color: page.path === atPath ? 'purple' : '#000',
                  my: 2,
                  display: 'block'
                }}
                key={page.title}
                onClick={() => RedirectUser(page.path)}
              >
                {page.title}
              </Button>
            )) : pages.map((page) => (
              <Button
                sx={{
                  color: page.path === atPath ? 'purple' : '#000',
                  my: 2,
                  display: 'block'
                }}
                key={page.title}
                onClick={() => RedirectUser(page.path)}
              >
                {page.title}
              </Button>
            ))
            }
          </Box>


          {userData.userInfo ? (<div>
            <Typography textAlign="center" margin='0 10px' color='black' fontSize='clamp(8px, 1vw, 14px)'>{userData?.user?.displayName}</Typography>
            <Typography textAlign="center" margin='0 10px' color='black' fontSize='clamp(7px, 0.8vw, 12px)'>{role || userData?.userInfo ? role : ""}</Typography>
          </div>) : null
          }


          {/* avatar settings */}
          {userData.userInfo ? (<Box sx={{ flexGrow: 0 }} >
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="ProfilePhoto" src={userData.user.photoURL} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={profile}>
                <img src={User} alt='img' style={{ marginRight: '4px' }}></img>
                <Typography textAlign="center">Profile</Typography>
              </MenuItem>
              <MenuItem onClick={toggleTheme}>
                <Brightness4Icon />
                <Typography textAlign="center">Theme</Typography>
              </MenuItem>
              <MenuItem onClick={logout} >
                <img src={Logout} alt='img' style={{ marginRight: '4px' }}></img>
                <Typography textAlign="center">Logout</Typography>
              </MenuItem>

            </Menu>
          </Box>) : (<Brightness4Icon onClick={toggleTheme} />)}

        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default TopBar


// const fetchData = async () => {
  //   if (userData.user) {
  //     const docRef = doc(db, "users", userData.user.email);
  //     const docSnap = await getDoc(docRef);
  //     if (docSnap.exists()) {
  //       // console.log(docSnap?.data()?.userType);
  //       setUserType(docSnap?.data()?.userType)
  //       if (docSnap?.data()?.userType === 'employer') {
  //         setRole(docSnap?.data()?.role)
  //         console.log(role)
  //       }
  //       else {
  //         setRole(docSnap?.data()?.primaryRole)
  //         console.log(role)
  //       }
  //       // setUserInformation(docSnap.data());
  //       // setScreenLoading(false);
  //     } else {
  //       // doc.data() will be undefined in this case
  //       // console.log("No such document!");
  //       // setScreenLoading(false);
  //     }
  //   }
  // };


  // useEffect(() => {
  //   setUserType(userData?.userInfo?.userType || null)
  // }, [userData])

  // useEffect(()=>{
  //   setRole(role)
  //   console.log(role)
  // },[role])

  // useEffect(() => {
  //   console.log(role);
  // }, [role]);

  // useEffect(() => {
  //   // console.log('role:', role);
  //   // console.log('photoURL:', userData?.userInfo?.photoURL);
  // }, [role, userData?.userInfo?.photoURL]);
