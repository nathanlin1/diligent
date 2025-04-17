import {createContext, useContext, useState} from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);

  const login = async (email, password) => {
    const response = await fetch('http://localhost:3010/api/v0/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    getUserId(email);
    localStorage.setItem('token', data.token);
    setUser({email});
  };

  const getUserId = async (email) => {
    const response = await fetch(`http://localhost:3010/api/v0/users/email/${email}`, {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
    });
    const data = await response.json();
    setUserId(data.id);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{user, userId, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
