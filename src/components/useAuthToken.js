// src/hooks/useAuthToken.js
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { auth } from '../firebase';

const useAuthToken = () => {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const tokenExpirationTime = new Date(user.stsTokenManager.expirationTime);

        // Check for token expiry and log out user if expired
        const now = new Date();
        if (now >= tokenExpirationTime) {
          auth.signOut();
        }
      }
    });

    return () => unsubscribe();
  }, []);
};

export default useAuthToken;
