import { useEffect } from 'react';

const ScrollToTopOnLoad = () => {
  useEffect(() => {
    // Scroll to the top of the page on component load
    window.scrollTo(0, 0);
  }, []);

  return null; // This component doesn't render anything
};

export default ScrollToTopOnLoad;
