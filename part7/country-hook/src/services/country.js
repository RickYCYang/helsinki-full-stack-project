import axios from 'axios';

const getCountry = async (country) => {
  const res = await axios.get(
    `https://restcountries.com/v3.1/name/${country}?fullText=true`
  );
  return res.data;
};

const countryService = { getCountry };
export default countryService;
