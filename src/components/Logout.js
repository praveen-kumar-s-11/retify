// hooks/useLogout.js
import { auth } from '../firebase';

const useLogout = () => {
  const logout = async () => {
    try {
      await auth.signOut();
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return logout;
};

export default useLogout;
