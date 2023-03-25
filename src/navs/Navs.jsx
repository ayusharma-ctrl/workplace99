import React from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landingpage from '../components/landingPage/index'
import Auth from '../components/auth/index'
import CandidateJobs from '../components/candidate/Jobs/index'
import CandidateProfile from '../components/candidate/Profile/index'
import CandidateOnboarding from '../components/candidate/Onboarding/index'
import CandidateApplications from '../components/candidate/Applications/index'
import CandidateConversation from '../components/candidate/Conversation/index'

import EmployerJobs from '../components/employer/jobs/index'
import EmployerProfile from '../components/employer/profile/index'
import EmployerOnboarding from '../components/employer/onboarding/index'
import EmployerApplicants from '../components/employer/applicants/index'
import EmployerConversation from '../components/employer/conversation/index'

import TopBar from '../components/landingPage/TopBar';
import BottomNavigationBar from '../components/common/BottomNavigationBar';

import RestrictedRoutes from './RestrictedRoutes';
import PrivateRoutes from './PrivateRoutes';
import SemiPrivate from './SemiPrivate';


function Navs() {
  return (
    <BrowserRouter>
      <TopBar />
      <BottomNavigationBar/>
      <Routes>
        <Route path="/" element={<Landingpage />} />

        <Route path='/' element={<RestrictedRoutes />} >
          <Route path='/employer/auth' element={<Auth usertype={'Employer'} />} />
          <Route path='/candidate/auth' element={<Auth usertype={'Candidate'} />} />
        </Route>

        <Route path='/' element={<SemiPrivate />} >
          <Route path='/candidate/onboarding' element={<CandidateOnboarding />} />
          <Route path='/employer/onboarding' element={<EmployerOnboarding />} />
        </Route>

        <Route path='/candidate' element={<PrivateRoutes type={"candidate"} />} >
          <Route path='/candidate/jobs' element={<CandidateJobs />} />
          <Route path='/candidate/profile' element={<CandidateProfile />} />
          <Route path='/candidate/applications' element={<CandidateApplications />} />
          <Route path='/candidate/conversation' element={<CandidateConversation />} />
        </Route>

        <Route path='/employer' element={<PrivateRoutes type={"employer"} />} >
          <Route path='/employer/jobs' element={<EmployerJobs />} />
          <Route path='/employer/profile' element={<EmployerProfile />} />
          <Route path='/employer/applicants' element={<EmployerApplicants />} />
          <Route path='/employer/conversation' element={<EmployerConversation />} />
        </Route>

      </Routes>

    </BrowserRouter>
  )
}
export default Navs

// 1. define Router Components
// this will store mapping between URL and Component