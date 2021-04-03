import { render, screen } from '@testing-library/react';
import { ConnectionClosedMessage } from '../../api/message';
import { ConnectionClosed } from './ConnectionClosed';

test('renders a connection closed message', () => {
  const message = {
    command: 'ConnectionClosed',
    nickname: 'Ubiquiti',
    reason: 'Disconnected',
    date: 'DATE',
  } as ConnectionClosedMessage & { date: string };

  render(<ConnectionClosed message={message} />);

  expect(screen.getByText(/Ubiquiti/)).toBeInTheDocument();
  expect(screen.getByText(/Disconnected/)).toBeInTheDocument();
  expect(screen.getByText(/DATE/)).toBeInTheDocument();
});
