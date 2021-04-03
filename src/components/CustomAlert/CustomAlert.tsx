import { FunctionComponent } from 'react';
import Alert, { Color } from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

type CustomAlertProps = {
  alert?: string;
  clearAlert: () => void;
  severity: Color;
};

export const CustomAlert: FunctionComponent<CustomAlertProps> = ({ alert, clearAlert, severity }) => {
  const handleAlertClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') return;
    clearAlert();
  };

  return (
    <Snackbar open={!!alert} autoHideDuration={12000} onClose={handleAlertClose}>
      <Alert elevation={6} variant="filled" onClose={handleAlertClose} severity={severity}>
        {alert}
      </Alert>
    </Snackbar>
  );
};
