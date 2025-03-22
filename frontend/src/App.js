import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import '@fortawesome/fontawesome-free/css/all.min.css';
import ProtectedRoute from './components/ProtectedRoute';

import Main from './components/Main/index.jsx'; 
import Login from './components/Login'; 
import SignUp from './components/SignUp'; 
import Service from './components/Service.jsx';
import EmailVerify from "./components/EmailVerify";
import ForgotPassword from "./components/ForgotPassword";
import PasswordReset from "./components/PasswordReset";
import PracticeArea from "./components/Main/PracticeArea/practiceArea";
import Contact from "./components/contact/contact.jsx";
import Blog from "./components/Blog/blogclient.jsx";
import BlogPage from "./components/Blog/blogDetail.jsx";


import AdminPanel from "./components/Admin/AdminDashboard";
import Bookings from "./components/Admin/Bookings/booking.jsx";
import Services from "./components/Admin/Services/services.jsx";
import Document from "./components/Admin/Templates/AdminDocument.jsx";
import ContactForm from "./components/Admin/Contact/AdminContact.jsx";
import PaymentHistory from "./components/Admin/Payment/paymentHistory.jsx";
import PaymentComplete from "./components/Main/completepayment.jsx";
import PrivacyPolicy from "./components/privacyPolicy.jsx";
import TermsCondition from "./components/TermsCondition.jsx";


import DivorseFrom from "./components/Admin/htmlTemplates/DivorseAgreementForm.jsx";
import DivorseTemplate from "./components/Admin/htmlTemplates/ClientCards.jsx";
import RentalTemplate from "./components/Admin/htmlTemplates/RentalCard.jsx";
import MarriageproofTemplate from "./components/Admin/htmlTemplates/MarriageproofCard.jsx";
import PropertytransferTemplate from "./components/Admin/htmlTemplates/PropertyCard.jsx";
import EmploymentTemplate from "./components/Admin/htmlTemplates/EmploymentCard.jsx";
import EditDocument from "./components/Admin/Templates/EditDocument.jsx";
import PartnerTemplate from "./components/Admin/htmlTemplates/PartnershipCard.jsx";
import PartnerForm from "./components/Admin/htmlTemplates/PartnershipAgreementForm.jsx";
import RentalForm from "./components/Admin/htmlTemplates/RentalAgreementForm.jsx";
import MarriageForm from "./components/Admin/htmlTemplates/MarriageproofAgreementForm.jsx";
import PropertyForm from "./components/Admin/htmlTemplates/PropertytransferAgreementForm.jsx";
import EmploymentForm from "./components/Admin/htmlTemplates/EmploymentcontractForm.jsx";
import AdminBlogList from "./components/Admin/Blog/AdminBlogList.jsx";
import BlogDetail from "./components/Admin/Blog/BlogDetail.jsx";
import PaymentSuccessful from "./components/PaymentSuccessful.jsx";
import PostContent from "./components/Admin/PostContent/PostContent.jsx";



import BookingPop from "./components/Admin/Bookings/bookingpopup.jsx";
import { Toaster } from 'react-hot-toast';





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
        <Route path="/reset-password" element={<PasswordReset />} />
        {/* <Route path="/reset-password" element={<Resetpassword />} /> */}
        <Route path="/service" element={<Service />} />
        {/* <Route path="/password-reset/:id/:token" element={<ResetPassword />} /> */}
        <Route path="/practice-areas" element={<PracticeArea />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blogDetail/:id" element={<BlogPage />} />
        <Route path="/privacypolicy" element={<PrivacyPolicy />} />
        <Route path="/terms&condition" element={<TermsCondition />} />
      
        <Route element={<ProtectedRoute />}>
        <Route path="/admin/AdminDashboard" element={<AdminPanel />} />
        <Route path ="/booking" element={<Bookings/>}/>
        <Route path ="/services" element={<Services/>}/>
        <Route path ="/document" element={<Document/>}/>
        <Route path="/contactform" element={<ContactForm />} />
        <Route path="/admin/blogs" element={<AdminBlogList />} />
        <Route path="/blog/:id" element={<BlogDetail />} /> 
        <Route path="/successful/:serviceId/:clientId" element={<PaymentSuccessful />} />
        <Route path="/successfull/:serviceId/:clientId" element={<PaymentComplete />} />
        <Route path="/admin/payment-history" element={<PaymentHistory />} />
        <Route path="/admin/post" element={<PostContent />} />
        </Route>

        <Route path ="/divorseform" element={<DivorseFrom/>}/>
        <Route path ="/partnerform" element={<PartnerForm />}/>
        <Route path ="/rentalform" element={<RentalForm />}/>
        <Route path ="/marriageform" element={<MarriageForm />}/>
        <Route path ="/propertyform" element={<PropertyForm />}/>
        <Route path ="/employmentform" element={<EmploymentForm />}/>
        <Route path ="/divorsetemplate" element={<DivorseTemplate/>}/>
        <Route path ="/partnershiptemplate" element={<PartnerTemplate/>}/>
        <Route path ="/rentaltemplate" element={<RentalTemplate/>}/>
        <Route path ="/marriageprooftemplate" element={<MarriageproofTemplate/>}/>
        <Route path ="/employmenttemplate" element={<EmploymentTemplate/>}/>
        <Route path ="/propertytransfer" element={<PropertytransferTemplate/>}/>

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


