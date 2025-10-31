// tests/Chat.test.jsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi, beforeAll } from "vitest";
import Chat from "@/src/chat/chat";
import { TaskManagerContext } from "@/src/context/taskManagerContext";

// Mock scrollIntoView to prevent JSDOM errors
beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

describe("Chat component", () => {
  const mockContext = {
    socketRef: { current: { id: "socket-id", emit: vi.fn() } },
    chat: [],
    setChat: vi.fn(),
    user: "test-user",
    disableChat: false,
  };

  // Helper to render component with context
  const renderWithContext = (context = mockContext) =>
    render(
      <TaskManagerContext.Provider value={context}>
        <Chat />
      </TaskManagerContext.Provider>
    );

  test("renders messages icon and input", () => {
    renderWithContext();
    // Add data-testid="messages-icon-container" to the icon div
    expect(screen.getByTestId("messages-icon-container")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter the message")).toBeInTheDocument();
  });

  test("input is enabled when chat is not disabled", () => {
    renderWithContext();
    expect(screen.getByPlaceholderText("Enter the message")).not.toBeDisabled();
  });

  test("sending message emits socket event via Enter key", () => {
    renderWithContext();

    const input = screen.getByPlaceholderText("Enter the message");
    fireEvent.change(input, { target: { value: "Hello" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    expect(mockContext.socketRef.current.emit).toHaveBeenCalledWith("send-message", {
      sender: "socket-id",
      message: "Hello",
      user: "test-user",
    });

    // Input should be cleared after sending
    expect(input.value).toBe("");
  });

  test("clicking Send button also sends message", () => {
    renderWithContext();

    const input = screen.getByPlaceholderText("Enter the message");
    const button = screen.getByText("Send");

    fireEvent.change(input, { target: { value: "Hi there" } });
    fireEvent.click(button);

    expect(mockContext.socketRef.current.emit).toHaveBeenCalledWith("send-message", {
      sender: "socket-id",
      message: "Hi there",
      user: "test-user",
    });

    expect(input.value).toBe("");
  });

  test("toggles chat display when icon clicked", () => {
    renderWithContext();

    const icon = screen.getByTestId("messages-icon-container");
    // Add data-testid="chat" to the main chat div
    const chatDiv = screen.getByTestId("chat");

    expect(chatDiv).toHaveClass("translate-y-full");

    fireEvent.click(icon);
    expect(chatDiv).toHaveClass("translate-y-0");

    fireEvent.click(icon);
    expect(chatDiv).toHaveClass("translate-y-full");
  });

  test("unread messages counter updates correctly", () => {
    const contextWithMessages = {
      ...mockContext,
      chat: [{ message: "hi", sender: "other", user: "other" }],
    };

    renderWithContext(contextWithMessages);

    const icon = screen.getByTestId("messages-icon-container");

    // When chat is hidden, counter should show 1
    expect(screen.getByText("1")).toBeInTheDocument();

    // Open chat -> counter disappears
    fireEvent.click(icon);
    expect(screen.queryByText("1")).not.toBeInTheDocument();
  });

  test("cleans up chat and unread messages on unmount", () => {
    const { unmount } = renderWithContext();
    unmount();

    expect(mockContext.setChat).toHaveBeenCalledWith([]);
  });
});
