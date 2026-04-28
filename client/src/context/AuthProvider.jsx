import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { callUserAuthApi } from '../services/apiCalls';

function AuthProvider({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 🪪 Verify User
    const verifyCookie = async () => {
      console.log('called');
      const response = await callUserAuthApi();
      console.log(response, 'response');

      if (response?.userCredentials) {
        console.log(response.userCredentials, 'credentials');
        setUser(response?.userCredentials.username);
        sessionStorage.setItem('username', response?.userCredentials.username);
      }

      return response?.success
        ? navigate(
            location.pathname === '/' || location.pathname === '/auth'
              ? '/games'
              : `${location.pathname}`,
            { replace: true }
          )
        : navigate('/auth', { replace: true });
    };

    if (!sessionStorage.getItem('username')) verifyCookie();
    else {
      setUser(sessionStorage.getItem('username'));
      navigate(
        location.pathname === '/' || location.pathname === '/auth'
          ? '/games'
          : `${location.pathname}`,
        { replace: true }
      );
    }

    // Window history
    // console.log(window.history);
  }, [location.pathname]);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}

export default AuthProvider;
