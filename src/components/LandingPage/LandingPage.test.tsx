import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { State } from '../../state/state';
import { LandingPage } from './LandingPage';

test('renders top bar and handles nickname submission', async () => {
  const setNickname = jest.fn();
  const state = ({ setNickname } as unknown) as State;

  render(<LandingPage state={state} />);

  expect(screen.getByText(/Welcome to Ubiquiti chat!/)).toBeInTheDocument();
  expect(screen.getByText(/Enter the nickname/)).toBeInTheDocument();

  const control = screen.getByRole(/Nickname/);
  const input = control.querySelector('input');
  expect(input).toBeTruthy();

  fireEvent.change(input!, { target: { value: 'Ubiquiti' } });
  await waitFor(() => screen.getByDisplayValue('Ubiquiti'));

  fireEvent.keyUp(control, { key: 'Enter', code: 'Enter' });
  await waitFor(() => expect(setNickname).toBeCalledWith('Ubiquiti'));
});

test('rejects submission of an invalid nickname', async () => {
  const setNickname = jest.fn();
  const state = ({ setNickname } as unknown) as State;

  render(<LandingPage state={state} />);

  const button = screen.getByRole('button');
  expect(button).toBeDisabled();

  const control = screen.getByRole(/Nickname/);
  const input = control.querySelector('input');

  fireEvent.change(input!, { target: { value: 'ab_invalid' } });
  expect(button).toBeDisabled();

  fireEvent.keyUp(control, { key: 'Enter', code: 'Enter' });
  await waitFor(() => expect(setNickname).not.toBeCalled());
});

test('displays error on submission failure', async () => {
  const setNickname = jest.fn();
  const state = ({ setNickname } as unknown) as State;

  render(<LandingPage state={state} />);

  const control = screen.getByRole(/Nickname/);
  const input = control.querySelector('input');
  expect(input).toBeTruthy();

  fireEvent.change(input!, { target: { value: 'Ubiquiti' } });
  await waitFor(() => screen.getByDisplayValue('Ubiquiti'));

  setNickname.mockReturnValue('Failed to submit');
  fireEvent.keyUp(control, { key: 'Enter', code: 'Enter' });
  await waitFor(() => expect(setNickname).toBeCalledWith('Ubiquiti'));

  expect(screen.getByText(/Failed to submit/)).toBeInTheDocument();

  fireEvent.click(screen.getByLabelText(/Close/));

  await waitFor(() => expect(screen.queryByText(/Failed to submit/)).not.toBeInTheDocument());
});
