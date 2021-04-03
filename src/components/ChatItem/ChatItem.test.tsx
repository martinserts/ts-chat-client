import { render, screen } from '@testing-library/react';
import { StoredMessage } from '../../state/state';
import { ChatItem } from './ChatItem';

test('renders a tell message', () => {
  const message = {
    command: 'Tell',
    nickname: 'Ubiquiti',
    message: 'Hello world!',
    date: 'DATE',
  } as StoredMessage;
  render(<ChatItem message={message} />);
  expect(screen.getByText(/Ubiquiti/)).toBeInTheDocument();
  expect(screen.getByText(/Hello world!/)).toBeInTheDocument();
  expect(screen.getByText(/DATE/)).toBeInTheDocument();
});

test('renders a join message', () => {
  const message = {
    command: 'Join',
    nickname: 'Ubiquiti',
    date: 'DATE',
  } as StoredMessage;
  render(<ChatItem message={message} />);
  expect(screen.getByText(/Ubiquiti/)).toBeInTheDocument();
  expect(screen.getByText(/DATE/)).toBeInTheDocument();
});

test('renders a connection closed message', () => {
  const message = {
    command: 'ConnectionClosed',
    nickname: 'Ubiquiti',
    reason: 'Disconnected',
    date: 'DATE',
  } as StoredMessage;

  render(<ChatItem message={message} />);

  expect(screen.getByText(/Ubiquiti/)).toBeInTheDocument();
  expect(screen.getByText(/Disconnected/)).toBeInTheDocument();
  expect(screen.getByText(/DATE/)).toBeInTheDocument();
});

test('renders other stored messages as empty element', () => {
  const message = {
    command: 'Shutdown',
    reason: 'Disconnected',
    date: 'DATE',
  } as StoredMessage;

  const { container } = render(<ChatItem message={message} />);

  expect(container).toBeEmptyDOMElement();
});
