import { Notify } from 'notiflix';
import debounce from 'lodash.debounce';

import './css/styles.css';
import { fetchCountries } from './fetch-countries.js';

const DEBOUNCE_DELAY = 300;

const onSearchinput = evt => {
  const searchValue = evt.target.value.trim().toLowerCase();
  console.log(searchValue);
  if (searchValue) {
    fetchCountries(searchValue)
      .then(result => displayResult(result))
      .catch(err => Notify.failure('Oops, there is no country with that name'));
  } else {
    refs.countryInfo.innerHTML = '';
    refs.countryList.innerHTML = '';
  }
};

const refs = {};

window.addEventListener('load', () => {
  refs.searchInput = document.querySelector('#search-box');
  refs.countryList = document.querySelector('.country-list');
  refs.countryInfo = document.querySelector('.country-info');
  refs.searchInput.addEventListener('input', debounce(onSearchinput, DEBOUNCE_DELAY));
});

function displayResult(countryArr) {
  console.log(countryArr, countryArr.length);
  if (countryArr.length === 0) {
    Notify.failure('Oops, there is no country with that name');
    return;
  }
  if (countryArr.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
    return;
  }
  if (countryArr.length === 1) {
    detailedMarkup(countryArr[0]);
    return;
  }
  listMarkup(countryArr);
}

function detailedMarkup(country) {
  console.log('detailed');
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = `<h2><img src=${country.flags.svg} alt="flag of ${
    country.name.official
  } class="flag-icon flag-icon-large" width="42" /> ${
    country.name.official
  }</h2><p><b>Capital: </b>${country.capital}</p><p><b>Population: </b>${
    country.population
  }</p><p><b>Languages: </b>${Object.values(country.languages).join(', ')}</p >`;
}

function listMarkup(countryArr) {
  const markup = countryArr.map(country => {
    const li = document.createElement('li');
    li.innerHTML = `<img src=${country.flags.svg} class="flag-icon" width="32" alt="flag of ${country.name.official}" /> ${country.name.official}`;
    return li;
  });
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
  refs.countryList.append(...markup);
}
