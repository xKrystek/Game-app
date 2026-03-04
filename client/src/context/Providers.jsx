import React from 'react';
import TicTacToeProvider from './TicTacToeProvider.jsx';
import ShipsProvider from './ShipsProvider.jsx';
import AuthProvider from './AuthProvider.jsx';

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <TicTacToeProvider>
        <ShipsProvider>{children}</ShipsProvider>
      </TicTacToeProvider>
    </AuthProvider>
  );
}
