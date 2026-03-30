import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

const SessionTimeout = () => {
  const [isActive, setIsActive] = useState(true);
  const history = useHistory();
  const timeoutLimit = 1 * 60 * 5000; // 5 minutes

  let timeoutId;

  // Function to reset the timeout when there's user activity
  const resetTimeout = () => {
    if (timeoutId) clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      handleLogout();
    }, timeoutLimit);
  };

  // Function to log out the user
  const handleLogout = () => {
    setIsActive(false);
    alert('Session timed out due to inactivity!');
    localStorage.removeItem('userData')
    history.push('/'); // Navigate to login page
  };

  // Listen for user activity
  useEffect(() => {
    window.addEventListener('mousemove', resetTimeout);
    window.addEventListener('keydown', resetTimeout);

    // Start timeout on component mount
    resetTimeout();

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('mousemove', resetTimeout);
      window.removeEventListener('keydown', resetTimeout);
    };
  }, []);

  return (
     <></>
  );
};

export default SessionTimeout;
