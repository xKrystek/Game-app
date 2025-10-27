import { describe, expect, test } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import GamesMenu from '../src/pages/games';
import { render, screen } from '@testing-library/react';

describe('GamesMenu Page check', () => {
  test('Games to choose', () => {
    render(
      <MemoryRouter>
        <GamesMenu />
      </MemoryRouter>
    );
    expect(screen.getByText(/tic-tac-toe/i)).toBeInTheDocument();
    expect(screen.getByText(/ships/i)).toBeInTheDocument();
  });
});
