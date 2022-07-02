import React from 'react';

const Notification = ({ message, type = 'noraml' }) => {
  const notificationStyle = {
    backgroundColor: 'lightgray',
    border: '3px solid',
    borderRadius: '8px',
    fontSize: '24px',
    padding: '12px',
    marginBottom: '16px',
    color: type === 'error' ? 'red' : 'green',
    borderColor: type === 'error' ? 'red' : 'green',
  };

  return <div style={notificationStyle}>{message}</div>;
};

export default Notification;
