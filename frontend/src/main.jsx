import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'; 
import {
  createBrowserRouter,
  
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom'
import store from './store.js'
import {Provider} from 'react-redux'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import PrivateRoute from './components/PrivateRoute.jsx'
import PmPrivateRoute from './components/pmPrivateRoute.jsx'
import AdminPrivateRoute from './components/AdminPrivateRoute.jsx'
import HomeScreen from './screens/HomeScreen.jsx'
import LoginScreen from './screens/LoginScreen.jsx'
import SeForgotPasswordScreen from './screens/SeForgotPasswordScreen.jsx'
import SeResetPasswordScreen from './screens/SeResetPasswordScreen.jsx'
import RegisterScreen from './screens/RegisterScreen.jsx'
import ProfileScreen from './screens/ProfileScreen.jsx' 
import DashScreen from './screens/DashScreen.jsx'
import SeTeamScreen from './screens/SeTeamScreen.jsx'
import SeRequestScreen from './screens/SeRequestScreen.jsx'
import SePermissionScreen from './screens/SePermissionScreen.jsx'
import SeDocumentScreen from './screens/SeDocumentScreen.jsx'
import SeLocationScreen from './screens/SeLocationScreen.jsx'
import SeVideoChatScreen from './screens/SeVideoChat.jsx';
import Chat from './screens/Chat/Chat.jsx'
import PmChat from './screens/Chat/PmChat.jsx';
import PmLoginScreen from './screens/PmLoginScreen.jsx'
import PmRegisterScreen from './screens/PmRegisterScreen.jsx'
import PmProfileScreen from './screens/PmProfileScreen.jsx'
import PmDashScreen from './screens/PmDashScreen.jsx'
import PmTeamScreen from './screens/PmTeamScreen.jsx'
import PmDocumentScreen from './screens/PmDocumentScreen.jsx'
import PmLocationScreen from './screens/PmLocationScreen.jsx'
import PmRequestScreen from './screens/PmRequestScreen.jsx'


import AdminLoginScreen from './screens/AdminLoginScreen.jsx'
import AdminDashScreen from './screens/AdminDashScreen.jsx'
import AdminProjectScreen from './screens/AdminProjectScreen.jsx'

import AdminPmScreen from './screens/AdminPmScreen.jsx'
import AdminSeScreen from './screens/AdminSeScreen.jsx'


const router = createBrowserRouter(  
  createRoutesFromElements(
    <Route path = '/' element={<App />}>
      <Route index={true} path='/'element={<HomeScreen />} />
      <Route path='/login'element={<LoginScreen />} />
      <Route path='/seforgotpassword'element={<SeForgotPasswordScreen />} />
      <Route path='/seresetpassword/:_id/:token'element={<SeResetPasswordScreen />} />
      <Route path='/chat'element={<Chat />} />
      <Route path='/register'element={<RegisterScreen />} />
      <Route path='' element={<PrivateRoute />}>
      <Route path='/profile' element={<ProfileScreen />} />
      <Route path='/dash' element={<DashScreen />} />
      <Route path='/seteam' element={<SeTeamScreen />} />
      <Route path='/serequest' element={<SeRequestScreen />} />
      <Route path='/sepermission' element={<SePermissionScreen />} />
      <Route path='/selocation' element={<SeLocationScreen />} />
      <Route path='/document' element={<SeDocumentScreen />} />
      <Route path='/chat' element={<Chat />} />
      <Route path='/sevideochat' element={<SeVideoChatScreen />} />
      </Route>
      
      
      <Route path='/pmlogin'element={<PmLoginScreen />} />
      <Route path='/pmregister'element={<PmRegisterScreen />} />
      <Route path='' element={<PmPrivateRoute />}>
      <Route path='/pmprofile' element={<PmProfileScreen />} />
      <Route path='/pmdash' element={<PmDashScreen />} />
      <Route path='/pmteam' element={<PmTeamScreen />} />
      <Route path='/pmdocument' element={<PmDocumentScreen />} />
      <Route path='/pmrequest' element={<PmRequestScreen />} />
      <Route path='/pmlocation' element={<PmLocationScreen />} />
      <Route path='/pmchat' element={<PmChat />} />
      </Route> 


      <Route path='/adminlogin'element={<AdminLoginScreen />} />
      
      <Route path='' element={<AdminPrivateRoute />}>
      
      <Route path='/admindash' element={<AdminDashScreen />} />
      <Route path='/adminproject' element={<AdminProjectScreen />} />
    
      <Route path='/adminpm' element={<AdminPmScreen />} />
      <Route path='/adminse' element={<AdminSeScreen />} />
      
      </Route>
      
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
     
  <Provider store={store}>
      <React.StrictMode>
      <GoogleOAuthProvider clientId="454338849591-93m2q6138f1sklce464o1et4f1kcvg9a.apps.googleusercontent.com">
        <RouterProvider router= {router}/>
        </GoogleOAuthProvider>;
      </React.StrictMode>
     </Provider>
  
)
