import { Box, Container, Grid, Typography } from '@mui/material'
import React from 'react'
import Logo from '../../assets/logo.png'
import GitHubIcon from '@mui/icons-material/GitHub';
import './landingpage.css'

function Footer() {
  return (
    <Box
      sx={{
        width: "100%",
        height: "auto",
        backgroundColor: "secondary.main",
        paddingTop: "1rem",
        paddingBottom: "1.5rem",
      }}
    >
      <Container>
        <Grid container direction="column" alignItems="center">
          <Grid item xs={12}
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              flexDirection: 'column'
            }}

          >
            <img src={Logo} alt='logo' style={{ width: '90px', height: '45px' }} ></img>
            <Typography color="black" variant="h6">
              About Us
            </Typography>

            <div style={{ margin: '10px 0 10px auto', width: '80vw', textAlign: 'end', lineHeight: 'clamp(9px,1.3vw,14px)' }}>
              <Typography color="black" fontSize={'clamp(10px,1.3vw,14px)'} variant="h9">
                A platform that connects companies with talented candidates. Our website allows companies to register and post job and internship opportunities, and engage with potential candidates through our real-time chat feature.
              </Typography>
            </div>

            <div style={{ margin: '10px 0 10px auto', width: '80vw', textAlign: 'end', lineHeight: 'clamp(9px,1.3vw,14px)' }}>
              <Typography color="black" fontSize={'clamp(10px,1.3vw,14px)'} variant="h9">
                For candidates, our website provides a seamless experience to apply for jobs or internships, chat with employers, and find the best fit for their career goals.
              </Typography>
            </div>

            <div style={{ margin: '10px 0 20px auto', width: '80vw', textAlign: 'end', lineHeight: 'clamp(9px,1.3vw,14px)' }}>
              <Typography color="black" fontSize={'clamp(10px,1.3vw,14px)'} variant="h9">
                We are committed to providing a completely free service to both companies and candidates. We do not offer any subscription plans or hidden fees. Our mission is to create a level playing field for job seekers and companies, and to make the hiring process more transparent and accessible for all.
              </Typography>
            </div>

          </Grid>

          <Grid item xs={12}>
            <Typography color="textSecondary" variant="subtitle1">
              {`© ${new Date().getFullYear()} Work Place. All rights reserved.`}
            </Typography>

            <Typography width={'80vw'} color="textSecondary" variant="subtitle1">
              GitHub@ayusharma-ctrl

              <div className='gitIcon' style={{ float: 'right', cursor:'pointer'}}>
                <GitHubIcon/>
              </div>

            </Typography>
          </Grid>

        </Grid>
      </Container>
    </Box>
  )
}

export default Footer