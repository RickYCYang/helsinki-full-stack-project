import React, { useState, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';

const Togglable = forwardRef(({ buttonLabel, children }, refs) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? 'none' : '' };
  const showWhenVisible = { display: visible ? '' : 'none' };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility,
    };
  });

  return (
    <div>
      <div style={hideWhenVisible}>
        <Button variant="contained" onClick={toggleVisibility}>
          {buttonLabel}
        </Button>
      </div>
      <div style={showWhenVisible} className="togglableContent">
        {children}
        <Button variant="contained" onClick={toggleVisibility}>
          cancel
        </Button>
      </div>
    </div>
  );
});

Togglable.displayName = 'Togglable';

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
};

export default Togglable;
