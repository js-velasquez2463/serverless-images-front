import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { parseJwt } from  '../../utils/helpers';
import './index.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();  // Usa el contexto de autenticación

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://q8onxhk818.execute-api.us-east-1.amazonaws.com/Prod/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const data = (await response.json()).token;
      console.log('dataa', data)
      if (data.AccessToken && data.IdToken && data.RefreshToken) {
        login(data);  // Envía todos los tokens al contexto de autenticación
        navigate('/'); // Redirige al usuario a la página principal después del login exitoso.
        const decoded = parseJwt(data.IdToken);
        //console.log('token decodeedd', decoded)
      } else {
        setError('Login fallido. Por favor, intente de nuevo.');
      }
    } catch (error) {
      console.error(error);
      setError('Error en el servidor. Por favor, intente más tarde.');
    }
  };
 
  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Usuario:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label>Contraseña:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">Iniciar Sesión</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}

export default Login;
