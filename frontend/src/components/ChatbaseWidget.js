import { useRef, useState, useEffect } from 'react';
import { BsChatDotsFill } from 'react-icons/bs'; 
import ReactDOM from 'react-dom';

const ChatbaseWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const chatRef = useRef(null);
  
  const getUserEmail = () => {
    let email = localStorage.getItem('email'); 
    
    if (!email) {
      // Create a popup container
      const popupContainer = document.createElement('div');
      document.body.appendChild(popupContainer);
      
      // Define styles
      const popupStyles = {
        overlay: {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        },
        popup: {
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          width: '320px',
          maxWidth: '90%',
          textAlign: 'center'
        },
        button: {
          marginTop: '15px',
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px'
        }
      };
  
      // Create Login Popup component
      const LoginPopup = ({ onClose }) => (
        <div style={popupStyles.overlay}>
          <div style={popupStyles.popup}>
            <h3 style={{ marginTop: 0 }}>Please Login First</h3>
            <p>You need to login to start a new chat.</p>
            <button 
              style={popupStyles.button}
              onClick={onClose}
            >
              Go to Login Page
            </button>
          </div>
        </div>
      );
  
      // Render the popup
      ReactDOM.render(
        <LoginPopup 
          onClose={() => {
            // Clean up
            ReactDOM.unmountComponentAtNode(popupContainer);
            document.body.removeChild(popupContainer);
            // Redirect to login page
            window.location.href = '/login';
          }}
        />, 
        popupContainer
      );
  
      return null; // Return null since we're redirecting to login
    }
    
    return email;
  };

  const userEmail = getUserEmail();
  const chatBaseURL = `https://www.chatbase.co/chatbot-iframe/_mM7A2n98yKauCEj_KOfT?email=${encodeURIComponent(userEmail)}`;

  // Close chat when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatRef.current && !chatRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      {/* Floating Chat Button */}
      <div
        className="floating-button"
        style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000 }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)} // Toggle the chat window
          style={{
            backgroundColor: '#0f172a', // Dark navy blue
            border: 'none',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            color: 'white',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
            cursor: 'pointer',
            animation: 'floatUpDown 2.5s ease-in-out infinite',
          }}
          aria-label="Open Chat"
        >
          <BsChatDotsFill size={26} />
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div
          ref={chatRef}
          style={{
            position: 'fixed',
            bottom: '100px',
            right: '30px',
            width: '350px',
            height: '500px',
            backgroundColor: '#f9fafb',
            borderRadius: '10px',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden',
            zIndex: 999,
          }}
        >
          <iframe
            src={chatBaseURL} // Pass the email in the URL as a query parameter
            width="100%"
            height="100%"
            style={{ border: 'none' }}
            title="Chatbase Chatbot"
          ></iframe>
        </div>
      )}

      {/* Floating Animation Keyframes */}
      <style>{`
        @keyframes floatUpDown {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
      `}</style>
    </>
  );
};

export default ChatbaseWidget;
