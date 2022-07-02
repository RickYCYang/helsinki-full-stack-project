import Weather from './Weather';

const CountryDetail = ({ country }) => {
  return (
    <div>
      <h3>{country.name.common}</h3>
      <p>capital {country.capital?.[0]}</p>
      <p>area {country.area}</p>
      <h4>languages:</h4>
      <ul>
        {Object.values(country.languages).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img src={country.flags?.png} alt="flag" />
      {country.capital && <Weather capital={country.capital?.[0]} />}
    </div>
  );
};

export default CountryDetail;
