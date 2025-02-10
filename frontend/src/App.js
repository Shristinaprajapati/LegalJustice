import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import '@fortawesome/fontawesome-free/css/all.min.css';

import Main from './components/Main/index.jsx'; 
import Login from './components/Login'; 
import SignUp from './components/SignUp'; 
import Service from './components/Service.jsx';
import EmailVerify from "./components/EmailVerify";
import ForgotPassword from "./components/ForgotPassword";
import PasswordReset from "./components/PasswordReset";
import ResetPassword from "./components/password-reset";
import PracticeArea from "./components/Main/PracticeArea/practiceArea";
// import Resetpassword from "./components/ResetPassword";


import AdminPanel from "./components/Admin/AdminDashboard";
import Bookings from "./components/Admin/Bookings/booking.jsx";
import Services from "./components/Admin/Services/services.jsx";
import Document from "./components/Admin/Templates/AdminDocument.jsx";

import DivorseFrom from "./components/Admin/htmlTemplates/DivorseAgreementForm.jsx";
import DivorseTemplate from "./components/Admin/htmlTemplates/ClientCards.jsx";
import EditDocument from "./components/Admin/Templates/EditDocument.jsx";


import BookingPop from "./components/Admin/Bookings/bookingpopup.jsx";




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
        {/* <Route path="/reset-password" element={<Resetpassword />} /> */}
        <Route path="/service" element={<Service />} />
        <Route path="/password-reset/:id/:token" element={<ResetPassword />} />
        <Route path="/practice-areas" element={<PracticeArea />} />

      
        <Route path="/admin/AdminDashboard" element={<AdminPanel />} />
        <Route path ="/booking" element={<Bookings/>}/>
        <Route path ="/services" element={<Services/>}/>
        <Route path ="/document" element={<Document/>}/>


        <Route path ="/divorseform" element={<DivorseFrom/>}/>
        <Route path ="/divorsetemplate" element={<DivorseTemplate/>}/>
        <Route path ="/editdocument" element={<EditDocument/>}/>


        <Route path ="/booking-pop" element={<BookingPop/>}/>

        
      </Routes>
    </Router>
  );
}

export default App;






// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import '@fortawesome/fontawesome-free/css/all.min.css';

// import Main from './components/Main/index.jsx'; 
// import Login from './components/Login'; 
// import SignUp from './components/SignUp'; 
// import Service from './components/Service.jsx';
// import EmailVerify from "./components/EmailVerify";
// import ForgotPassword from "./components/ForgotPassword";
// import ResetPassword from "./components/ResetPassword";  // Corrected
// import PracticeArea from "./components/Main/PracticeArea/practiceArea";

// import AdminPanel from "./components/Admin/AdminDashboard";
// import Bookings from "./components/Admin/Bookings/booking.jsx";
// import Services from "./components/Admin/Services/services.jsx";
// import Document from "./components/Admin/Templates/AdminDocument.jsx";
// import Documentpaper from "./components/Admin/Document/document.jsx";
// import TemplatePost from "./components/Admin/Templates/TemplatePost.jsx";

// import TemplateOne from "./components/Admin/htmlTemplates/template1.jsx";
// import DivorceForm from "./components/Admin/htmlTemplates/DivorseAgreementForm.jsx"; // Corrected
// import DivorceTemplate from "./components/Admin/htmlTemplates/ClientCards.jsx";     // Corrected
// import Divorce from "./components/Admin/htmlTemplates/DivorceTemplate.jsx";         // Corrected

// function App() {
//   const user = localStorage.getItem("token");
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={user ? <Main /> : <Navigate replace to="/main" />} />
//         <Route path="/main" element={<Main />} /> 
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<SignUp />} />
//         <Route path="/users/:id/verify/:token" element={<EmailVerify />} />
//         <Route path="/forgot-password" element={<ForgotPassword />} />
//         <Route path="/password-reset/:id/:token" element={<ResetPassword />} />
//         <Route path="/reset-password" element={<ResetPassword />} />
//         <Route path="/service" element={<Service />} />
//         <Route path="/practice-areas" element={<PracticeArea />} />

//         <Route path="/admin/AdminDashboard" element={<AdminPanel />} />
//         <Route path="/booking" element={<Bookings />} />
//         <Route path="/services" element={<Services />} />
//         <Route path="/document" element={<Document />} />
//         <Route path="/documentpaper" element={<Documentpaper />} />
//         <Route path="/admin/templates/post" element={<TemplatePost />} />

//         <Route path="/templateOne" element={<TemplateOne />} />
//         <Route path="/divorceform" element={<DivorceForm />} />
//         <Route path="/divorcetemplate" element={<DivorceTemplate />} />
//         <Route path="/divorce" element={<Divorce />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;


