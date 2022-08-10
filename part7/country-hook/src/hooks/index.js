import { useState, useEffect } from 'react';
import countryService from '../services/country';

export const useField = (type) => {
  const [value, setValue] = useState('');

  const onChange = (event) => {
    setValue(event.target.value);
  };

  return {
    type,
    value,
    onChange,
  };
};

export const useCountry = (name) => {
  const [country, setCountry] = useState(null);

  useEffect(() => {
    if (name) {
      countryService
        .getCountry(name)
        .then((data) => {
          setCountry(data[0]);
        })
        .catch((err) => {
          console.error(err);
          setCountry(null);
        });
    }
  }, [name]);

  return country;
};
