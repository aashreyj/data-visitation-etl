// src/components/Body.js
import React from 'react';
import { Outlet } from 'react-router-dom';

const Body = () => {
  return (
    <main className="body">
      <Outlet /> {/* Content from child routes */}
    </main>
  );
};

export default Body;