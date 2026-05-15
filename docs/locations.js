import {
  Country,
  State
} from "https://cdn.jsdelivr.net/npm/country-state-city@3.2.1/+esm";

export const LOCATION_DATA = {};

Country.getAllCountries().forEach(country => {
  const countryName = country.name;
  const states = State.getStatesOfCountry(country.isoCode);

  LOCATION_DATA[countryName] = {};

  states.forEach(state => {
    LOCATION_DATA[countryName][state.name] = [];
  });
});
