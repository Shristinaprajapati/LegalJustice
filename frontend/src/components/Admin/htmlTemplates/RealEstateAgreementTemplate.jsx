// RealEstateAgreementTemplate.js
import React from 'react';

const RealEstateAgreementTemplate = () => {
    // useEffect(() => {
    //     const storeTemplate = async () => {
    //       try {
    //         const response = await axios.post('http://localhost:8080/api/store-template', {
    //           name: 'Real Estate Agreement Template',
    //           content: '<div>Rendered Real Estate Agreement Template</div>', // Replace with actual HTML if needed
    //           category: 'Real Estate Documents',
    //         });
    //         console.log(response.data.message);
    //       } catch (error) {
    //         console.error('Error storing Real Estate Agreement Template:', error);
    //       }
    //     };
    
    //     storeTemplate();
    //   }, []); // Empty array ensures it runs only once
  return (
    <div>
      <h2>Real Estate Agreement</h2>
      <p><strong>Property Owner:</strong> [Property Owner Name]</p>
      <p><strong>Property Address:</strong> [Property Address]</p>
      <p><strong>Sale Price:</strong> [Sale Price]</p>
      <p><strong>Buyer:</strong> [Buyer Name]</p>
      <p><strong>Closing Date:</strong> [Closing Date]</p>
    </div>
  );
};

export default RealEstateAgreementTemplate;
