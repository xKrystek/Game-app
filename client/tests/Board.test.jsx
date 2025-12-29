import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import Board from '@/src/board/TicTacToeBoard';
import { TicTacToeContext } from '@/src/context/TicTacToeContext';
import * as apiCalls from '@/src/services/apiCalls';
import { MemoryRouter } from 'react-router-dom';

// ---------- MOCK MODULES ----------

// Mock react-router-dom before importing anything that uses it
const mockedNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');

  return {
    __esModule: true,        // IMPORTANT
    ...actual,              // preserve everything
    default: actual.default, // preserve default export
    useNavigate: () => mockedNavigate
  };
});

// Mock callLogoutUser
vi.spyOn(apiCalls, 'callLogoutUser').mockResolvedValue();

// ---------- MOCK CONTEXT ----------

const mockContext = {
  board: {
    one: '',
    two: '',
    three: '',
    four: '',
    five: '',
    six: '',
    seven: '',
    eight: '',
    nine: ''
  },
  player: 'X',
  setTie: vi.fn(),
  tie: false,
  displayBtn: false,
  setDisplayBtn: vi.fn(),
  handleBoardOnClick: vi.fn(),
  playAgainButton: vi.fn(),
  GameCheck: vi.fn(() => null),
  yourTurn: true,
  setYourTurn: vi.fn(),
  gameOver: false,
  setGameOver: vi.fn(),
  setRematch: vi.fn()
};

function renderBoard(contextOverrides = {}) {
  return render(
    <MemoryRouter>
<<<<<<< HEAD
      <TaskManagerContext.Provider
=======
      <TicTacToeContext.Provider
>>>>>>> bb300400509a0f8300ea06db78bfe5385fb42378
        value={{ ...mockContext, ...contextOverrides }}
      >
        <Board />
      </TicTacToeContext.Provider>
    </MemoryRouter>
  );
}

// Reset mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});

// ---------- TESTS ----------

describe('Board Component', () => {
  test("displays player's turn", () => {
    renderBoard({ yourTurn: true });
    expect(screen.getByText(/Your turn: X/i)).toBeInTheDocument();
  });

  test("displays opponent's turn", () => {
    renderBoard({ yourTurn: false });
    expect(screen.getByText(/Opponent's Turn/i)).toBeInTheDocument();
  });

  test('displays game over and you won', () => {
    renderBoard({ GameCheck: () => 'X', gameOver: true, player: 'X' });
    expect(screen.getByText(/Game Over/i)).toBeInTheDocument();
    expect(screen.getByText(/You won/i)).toBeInTheDocument();
  });

  test('displays game over and you lost', () => {
    renderBoard({ GameCheck: () => 'O', gameOver: true, player: 'X' });
    expect(screen.getByText(/Game Over/i)).toBeInTheDocument();
    expect(screen.getByText(/You lost/i)).toBeInTheDocument();
  });

  test('displays tie', () => {
    renderBoard({ GameCheck: () => 'tie', tie: true });
    expect(screen.getByText(/TIE !!/i)).toBeInTheDocument();
  });

  test('clicking Play Again button triggers playAgainButton function', () => {
    renderBoard({ displayBtn: true });
    const btn = screen.getByText(/Play Again/i);
    fireEvent.click(btn);
    expect(mockContext.playAgainButton).toHaveBeenCalled();
  });

  test('clicking board cell triggers handleBoardOnClick if game not over', () => {
    renderBoard({ GameCheck: () => null });
    const cell = screen.getByText('', { selector: "[data-cell='one']" });
    fireEvent.click(cell);
    expect(mockContext.handleBoardOnClick).toHaveBeenCalled();
  });

  test('clicking logout button calls callLogoutUser and navigates', async () => {
    renderBoard();

    const logoutBtn = screen.getByText(/LogOut/i);
    fireEvent.click(logoutBtn);

    // Wait for any async promise resolution
    await new Promise(process.nextTick);

    expect(apiCalls.callLogoutUser).toHaveBeenCalled();
    expect(mockedNavigate).toHaveBeenCalledWith('/auth');
  });
});
