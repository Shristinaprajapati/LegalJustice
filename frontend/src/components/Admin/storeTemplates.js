// import React from 'react';
// import ReactDOMServer from 'react-dom/server';
// import axios from 'axios';
// import DivorceAgreementTemplate from './htmlTemplates/DivorceAgreementTemplate.jsx';
// import RealEstateAgreementTemplate from './htmlTemplates/RealEstateAgreementTemplate.jsx';

// // Render the React components to static HTML
// const divorceAgreementHtml = ReactDOMServer.renderToStaticMarkup(<DivorceAgreementTemplate />);
// const realEstateAgreementHtml = ReactDOMServer.renderToStaticMarkup(<RealEstateAgreementTemplate />);

// // Send the rendered HTML to the backend
// const storeTemplate = async () => {
//   try {
//     await axios.post('http://localhost:8080/api/store-template', {
//       name: 'Divorce Agreement Template',
//       content: divorceAgreementHtml,
//       category: 'Family Law',
//     });

//     await axios.post('http://localhost:8080/api/store-template', {
//       name: 'Real Estate Agreement Template',
//       content: realEstateAgreementHtml,
//       category: 'Real Estate Documents',
//     });

//     console.log('Templates have been stored!');
//   } catch (error) {
//     console.error('Error storing template:', error);
//   }
// };

// // Call the function to store templates
// storeTemplate();
