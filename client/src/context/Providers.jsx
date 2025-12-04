import React from 'react';
import TicTacToeProvider from "./TicTacToeProvider.jsx"
import ShipsProvider from './ShipsProvider.jsx';

export default function Providers({ children }) {
  return (
    <TicTacToeProvider>
      <ShipsProvider>
        {children}
      </ShipsProvider>
    </TicTacToeProvider>
  );
}