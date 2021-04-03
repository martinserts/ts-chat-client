import { render, screen } from '@testing-library/react';
import { ConnectionState } from '../../state/connectionState';
import { State } from '../../state/state';
import { ConnectionStatus } from './ConnectionStatus';

test('renders a connected icon, if connection is established', () => {
  const state = {
    connectionState: ConnectionState.Connected,
  } as State;

  render(<ConnectionStatus state={state} />);

  expect(screen.getByTitle(/Connection established/)).toBeInTheDocument();
});

test('renders an offline icon, if connection is broken', () => {
  const state = {
    connectionState: ConnectionState.Disconnected,
  } as State;

  render(<ConnectionStatus state={state} />);

  expect(screen.getByTitle(/You are offline!/)).toBeInTheDocument();
});
