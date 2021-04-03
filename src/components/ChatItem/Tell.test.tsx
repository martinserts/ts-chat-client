import { render, screen } from '@testing-library/react';
import { TellMessage } from '../../api/message';
import { Tell } from './Tell';

test('renders a tell message', () => {
  const message = {
    command: 'Tell',
    nickname: 'Ubiquiti',
    message: 'Hello world!',
    date: 'DATE',
  } as TellMessage & { date: string };

  render(<Tell message={message} />);

  expect(screen.getByText(/Ubiquiti/)).toBeInTheDocument();
  expect(screen.getByText(/Hello world!/)).toBeInTheDocument();
  expect(screen.getByText(/DATE/)).toBeInTheDocument();
  const avatar = screen.getByText(/^U$/);
  expect(avatar).toBeInTheDocument();
  expect(avatar).toHaveStyle({ 'background-color': 'blue' });
});
