
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const Index = () => {
  // This page is just a redirect gateway to either splash screen or dashboard
  return <Navigate to="/" replace />;
};

export default Index;
