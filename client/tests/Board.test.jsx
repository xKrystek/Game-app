import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Board from "@/src/board/Board";
import { TaskManagerContext } from "@/src/context/taskManagerContext";
import { callLogoutUser } from "@/src/services";

// Mock callLogoutUser so it doesn't actually logout
vi.mock("@/src/services", () => ({
  callLogoutUser: vi.fn(() => Promise.resolve()),
}));

describe("Board Component", () => {
  const mockContext = {
    board: {
      one: "", two: "", three: "",
      four: "", five: "", six: "",
      seven: "", eight: "", nine: "",
    },
    player: "X",
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
    setRematch: vi.fn(),
  };

  function renderBoard(contextOverrides = {}) {
    return render(
      <MemoryRouter>
        <TaskManagerContext.Provider value={{ ...mockContext, ...contextOverrides }}>
          <Board />
        </TaskManagerContext.Provider>
      </MemoryRouter>
    );
  }

  test("displays player's turn", () => {
    renderBoard({ yourTurn: true });
    expect(screen.getByText(/Your turn: X/i)).toBeInTheDocument();
  });

  test("displays opponent's turn", () => {
    renderBoard({ yourTurn: false });
    expect(screen.getByText(/Opponent's Turn/i)).toBeInTheDocument();
  });

  test("displays game over and you won", () => {
    renderBoard({ GameCheck: () => "X", gameOver: true, player: "X" });
    expect(screen.getByText(/Game Over/i)).toBeInTheDocument();
    expect(screen.getByText(/You won/i)).toBeInTheDocument();
  });

  test("displays game over and you lost", () => {
    renderBoard({ GameCheck: () => "O", gameOver: true, player: "X" });
    expect(screen.getByText(/Game Over/i)).toBeInTheDocument();
    expect(screen.getByText(/You lost/i)).toBeInTheDocument();
  });

  test("displays tie", () => {
    renderBoard({ GameCheck: () => "tie", tie: true });
    expect(screen.getByText(/TIE !!/i)).toBeInTheDocument();
  });

  test("clicking Play Again button triggers playAgainButton function", () => {
    renderBoard({ displayBtn: true });
    const btn = screen.getByText(/Play Again/i);
    fireEvent.click(btn);
    expect(mockContext.playAgainButton).toHaveBeenCalled();
  });

  test("clicking board cell triggers handleBoardOnClick if game not over", () => {
    renderBoard({ GameCheck: () => null });
    const cell = screen.getByText("", { selector: "[data-cell='one']" });
    fireEvent.click(cell);
    expect(mockContext.handleBoardOnClick).toHaveBeenCalled();
  });

  test("clicking logout button calls callLogoutUser", () => {
    renderBoard();
    const logoutBtn = screen.getByText(/LogOut/i);
    fireEvent.click(logoutBtn);
    expect(callLogoutUser).toHaveBeenCalled();
  });
});
