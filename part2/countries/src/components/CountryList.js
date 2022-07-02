import { useState } from 'react';

import CountryDetail from './CountryDetail';

const CountryList = ({ countries }) => {
  const [showCountry, setShowCountry] = useState({});
  return (
    <div>
      <ul style={{ listStyle: 'none', padding: '0px' }}>
        {countries.map((country) => (
          <li key={country.name.common}>
            {country.name.common}
            <button
              onClick={() => setShowCountry(country)}
              style={{ marginLeft: '8px' }}
            >
              show
            </button>
          </li>
        ))}
      </ul>
      {showCountry.name && <CountryDetail country={showCountry} />}
    </div>
  );
};

export default CountryList;
