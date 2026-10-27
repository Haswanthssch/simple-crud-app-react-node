import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import App from './App';

jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

test('creates a user with a name and email', async () => {
  axios.get.mockResolvedValue({ data: [] });
  axios.post.mockResolvedValue({
    data: { id: 1, name: 'Ada Lovelace', email: 'ada@example.com' },
  });

  render(<App />);

  fireEvent.change(screen.getByRole('textbox', { name: /new user name/i }), {
    target: { value: 'Ada Lovelace' },
  });
  fireEvent.change(screen.getByRole('textbox', { name: /new user email/i }), {
    target: { value: 'ada@example.com' },
  });
  fireEvent.click(screen.getByRole('button', { name: /add user/i }));

  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith(
      expect.any(String),
      { name: 'Ada Lovelace', email: 'ada@example.com' }
    );
    expect(screen.getByText('ada@example.com')).toBeInTheDocument();
  });
});
