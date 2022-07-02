import { useEffect, useState } from 'react';

/** third party libs */
import axios from 'axios';

/** components */
import CountryDetail from './components/CountryDetail';
import CountryList from './components/CountryList';

function App() {
  /** states */
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState('');

  /** load all countries by calling web api */
  useEffect(() => {
    const fetchCountries = async () => {
      const res = await axios.get('https://restcountries.com/v3.1/all');
      setCountries(res.data);
    };
    fetchCountries();
  }, []);

  const filteredCountries = countries.filter((country) =>
    country?.name?.official?.toUpperCase().includes(search.toUpperCase())
  );

  return (
    <div>
      <div>
        <span style={{ marginRight: '8px' }}>find countries</span>
        <input
          value={search}
          disabled={countries.length <= 0}
          onChange={(event) => setSearch(event.target.value)}
        />
        <div>
          {search &&
            (filteredCountries.length > 10 ? (
              <p>Too many matches, specify another filter</p>
            ) : filteredCountries.length > 1 ? (
              <CountryList countries={filteredCountries} />
            ) : filteredCountries.length === 1 ? (
              <CountryDetail country={filteredCountries[0]} />
            ) : (
              <p>No country found</p>
            ))}
        </div>
      </div>
    </div>
  );
}

export default App;
