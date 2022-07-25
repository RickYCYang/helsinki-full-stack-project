import React from 'react';
import PropTypes from 'prop-types';

const Notification = ({ message, error }) => {
  const notificationStyle = {
    backgroundColor: 'lightgray',
    border: '3px solid',
    borderRadius: '8px',
    fontSize: '24px',
    padding: '12px',
    marginBottom: '16px',
    color: error ? 'red' : 'green',
    borderColor: error ? 'red' : 'green',
  };

  return (
    message && (
      <div id="notification" style={notificationStyle}>
        {message}
      </div>
    )
  );
};

Notification.propTypes = {
  message: PropTypes.string,
  error: PropTypes.bool,
};

export default Notification;
