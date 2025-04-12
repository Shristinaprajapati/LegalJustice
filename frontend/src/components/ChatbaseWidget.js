import { useRef, useState, useEffect } from 'react';
import { BsChatDotsFill } from 'react-icons/bs'; // Chat icon

const ChatbaseWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const chatRef = useRef(null);

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
          onClick={() => setIsOpen(!isOpen)}
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
            src="https://www.chatbase.co/chatbot-iframe/_mM7A2n98yKauCEj_KOfT"
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
