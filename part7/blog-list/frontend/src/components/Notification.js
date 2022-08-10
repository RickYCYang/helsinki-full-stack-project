import React from 'react';
import PropTypes from 'prop-types';
import Alert from '@mui/material/Alert';

const Notification = ({ message, error }) => {
  return (
    message && <Alert severity={error ? 'error' : 'success'}>{message}</Alert>
  );
};

Notification.propTypes = {
  message: PropTypes.string,
  error: PropTypes.bool,
};

export default Notification;
