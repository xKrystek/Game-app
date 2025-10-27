import { render, screen, waitFor } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import Scoreboard from '@/src/scoreboard/scoreboard';
import { TaskManagerContext } from '@/src/context/taskManagerContext';

describe('Scoreboard rematch flow', () => {
  test('Only you clicked rematch → section visible', () => {
    const setRematch = vi.fn();
    const setRematchYou = vi.fn();
    const setRematchOponent = vi.fn();

    render(
      <TaskManagerContext.Provider
        value={{
          playersUsernamesList: [['example', 'abc'], ['example2', 'xxx']],
          socketRef: { current: { id: 'abc' } },
          rematch: true,
          setRematch,
          rematchYou: true,
          rematchOponent: false,
          setRematchYou,
          setRematchOponent,
          yourScore: 0,
          oponentScore: 0,
        }}
      >
        <Scoreboard />
      </TaskManagerContext.Provider>
    );

    const rematchWrapper = screen.getByText(/rematch/).parentElement;
    expect(rematchWrapper).toHaveClass('visible'); // still visible
    expect(setRematch).not.toHaveBeenCalled();
  });

  test('Only opponent clicked rematch → section visible', () => {
    const setRematch = vi.fn();
    const setRematchYou = vi.fn();
    const setRematchOponent = vi.fn();

    render(
      <TaskManagerContext.Provider
        value={{
          playersUsernamesList: [['example', 'abc'], ['example2', 'xxx']],
          socketRef: { current: { id: 'abc' } },
          rematch: true,
          setRematch,
          rematchYou: false,
          rematchOponent: true,
          setRematchYou,
          setRematchOponent,
          yourScore: 0,
          oponentScore: 0,
        }}
      >
        <Scoreboard />
      </TaskManagerContext.Provider>
    );

    const rematchWrapper = screen.getByText(/rematch/).parentElement;
    expect(rematchWrapper).toHaveClass('visible'); // still visible
    expect(setRematch).not.toHaveBeenCalled();
  });

  test('Both clicked rematch → section invisible and state resets', () => {
    const setRematch = vi.fn();
    const setRematchYou = vi.fn();
    const setRematchOponent = vi.fn();

    render(
      <TaskManagerContext.Provider
        value={{
          playersUsernamesList: [['example', 'abc'], ['example2', 'xxx']],
          socketRef: { current: { id: 'abc' } },
          rematch: true,
          setRematch,
          rematchYou: true,
          rematchOponent: true,
          setRematchYou,
          setRematchOponent,
          yourScore: 0,
          oponentScore: 0,
        }}
      >
        <Scoreboard />
      </TaskManagerContext.Provider>
    );

    const rematchWrapper = screen.getByText(/rematch/).parentElement;

    // useEffect should fire and call setters
    expect(setRematch).toHaveBeenCalledWith(false);
    expect(setRematchYou).toHaveBeenCalledWith(false);
    expect(setRematchOponent).toHaveBeenCalledWith(false);

    // rematch section should be invisible
    waitFor(() => {
      expect(rematchWrapper).toHaveClass('invisible');
    })
  });
});
