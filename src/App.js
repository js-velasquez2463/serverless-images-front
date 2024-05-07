import React from 'react';
import ImageTable from './components/imageTable/ImageTable';
import AddImage from './components/addImage/AddImage';
import Login from './components/login/Login'; // Asegúrate de importar el componente Login
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Asegúrate de importar AuthProvider
import LoadingIndicator from './components/loader/LoadingIndicator'; 
import { LoadingProvider } from './hooks/useLoading';
import { PrivateRoute } from './components/privateRoute/PrivateRoute';

const App = () => {
  const dtaMock = {
    name: 'Jane Cooper',
    title: 'Regional Paradigm Technician',
    status: 'ACTIVE',
    age: 27,
    role: 'Admin',
    imageSrc: 'https://st2.depositphotos.com/4211709/7708/i/450/depositphotos_77085751-stock-photo-flower.jpg',
  };

  const tableData = [
    dtaMock,
    dtaMock,
    dtaMock,
    dtaMock,
    dtaMock,
    dtaMock,
    dtaMock,
    dtaMock,
    dtaMock,
    dtaMock,
    dtaMock,
    dtaMock,
  ];

  return (
    <AuthProvider>
      <LoadingProvider>
        <LoadingIndicator />
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/add-image" element={<PrivateRoute><AddImage /></PrivateRoute>} />
            <Route path="/" element={<PrivateRoute><ImageTable data={tableData} itemsPerPage={5} /></PrivateRoute>} />
          </Routes>
        </Router>
      </LoadingProvider>
    </AuthProvider>
  );
}

export default App;