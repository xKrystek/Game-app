import { vi, describe, expect, test } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SignIn from '../src/pages/sign-in';
import SignUp from '../src/pages/sign-up';
import { useForm } from 'react-hook-form';
import CommonForm from '../src/components/common-form';
import { signInControls } from '../src/config/formConfig';

function SignInWithFakeSubmit() {
  const formData = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const fakeHandleSubmit = vi.fn(() => {
    formData.reset(); // just reset the form
  });

  return (
    <MemoryRouter>
      <CommonForm
        formControls={signInControls}
        form={formData}
        buttonText="Sign in"
        handleSubmit={fakeHandleSubmit}
      />
    </MemoryRouter>
  );
}

describe('AuthPage render check', () => {
  test('Sign-in Page', () => {
    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );
    expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
  });

  test('Sign-Up Page', () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );
    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
  });

  test('form resets on submit', async () => {
    render(<SignInWithFakeSubmit />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByText(/sign in/i);

    // Type something in the inputs
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Click submit
    fireEvent.click(submitButton);

    // Check that inputs are reset
    await waitFor(() => {
      expect(emailInput.value).toBe('');
      expect(passwordInput.value).toBe('');
    });
  });
});
