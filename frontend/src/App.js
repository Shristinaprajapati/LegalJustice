import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Main from './components/Main/index.jsx'; 
import Login from './components/Login'; 
import SignUp from './components/SignUp'; 
import Service from './components/Service.jsx';
import EmailVerify from "./components/EmailVerify";
import ForgotPassword from "./components/ForgotPassword";
import PasswordReset from "./components/PasswordReset";
import ResetPassword from "./components/password-reset";


import AdminPanel from "./components/Admin/AdminDashboard";
import Bookings from "./components/Admin/Bookings/booking.jsx";
import Services from "./components/Admin/Services/services.jsx";
import Document from "./components/Admin/Templates/AdminDocument.jsx";


function App() {
  const user = localStorage.getItem("token");
  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Main /> : <Navigate replace to="/main" />} />
			
        <Route path="/main" element={<Main />} /> 
        <Route path="/login" element={<Login />} /> {/* Login route */}
        <Route path="/signup" element={<SignUp />} /> {/* SignUp route */}
			  <Route path="/users/:id/verify/:token" element={<EmailVerify />} />
			  <Route path="/forgot-password" element={<ForgotPassword />} />
		  	<Route path="/password-reset/:id/:token" element={<PasswordReset />} />
        <Route path="/service" element={<Service />} />
        <Route path="/password-reset/:id/:token" element={<ResetPassword />} />


        <Route path="/admin/AdminDashboard" element={<AdminPanel />} />
        <Route path ="/booking" element={<Bookings/>}/>
        <Route path ="/services" element={<Services/>}/>
        <Route path ="/document" element={<Document/>}/>
        
      </Routes>
    </Router>
  );
}

export default App;

// import { Route, Routes, Navigate } from "react-router-dom";
// import Main from "./components/Main";
// import SignUp from './components/SignUp'; 
// import Login from "./components/Login";
// import EmailVerify from "./components/EmailVerify";
// import ForgotPassword from "./components/ForgotPassword";
// import PasswordReset from "./components/PasswordReset";

// function App() {
// 	const user = localStorage.getItem("token");

// 	return (
// 		<Routes>
// 			{user && <Route path="/" exact element={<Main />} />}
// 			<Route path="/signup" exact element={<SignUp />} />
// 			<Route path="/login" exact element={<Login />} />
// 			<Route path="/" element={<Navigate replace to="/login" />} />
// 			<Route path="/users/:id/verify/:token" element={<EmailVerify />} />
// 			<Route path="/forgot-password" element={<ForgotPassword />} />
// 			<Route path="/password-reset/:id/:token" element={<PasswordReset />} />
// 		</Routes>
// 	);
// }

// export default App;

