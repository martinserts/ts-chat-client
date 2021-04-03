import { fireEvent, render, screen } from '@testing-library/react';
import { CustomAlert } from './CustomAlert';

test('renders a an alert message and clears it, when closed', () => {
  const clearAlert = jest.fn();

  render(<CustomAlert alert="Error occured!" clearAlert={clearAlert} severity="error" />);

  expect(screen.getByText(/Error occured!/)).toBeInTheDocument();

  fireEvent.click(screen.getByLabelText(/Close/));
  expect(clearAlert).toBeCalled();
});
