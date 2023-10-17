import { useState, useEffect } from 'react';

function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  // Add an event listener to track scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // You can use 'auto' for instant scroll
    });
  };

  return (
    <div>
      <button
        onClick={scrollToTop}
        style={{ display: isVisible ? 'block' : 'none' }}
      >
        Scroll to Top
      </button>
    </div>
  );
}

export default ScrollToTopButton;
