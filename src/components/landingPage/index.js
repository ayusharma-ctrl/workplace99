import React from 'react'
import RightJobSection from './RightJobSection';
import OnePlatform from './OnePlatform'
import AllJobs from './AllJobs';
import Footer from './Footer';
import './landingpage.css';


function Landingpage() {
  return (
    <div>
      <RightJobSection />
      <OnePlatform />
      <AllJobs />
      <Footer />
    </div>
  )
}

export default Landingpage