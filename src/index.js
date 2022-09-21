import Debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import './css/styles.css';
import { fetchCountries } from './fetchCountries';
const inputRef = document.querySelector('#search-box');
const countryListRef = document.querySelector('.country-list');
const countryInfoRef = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;

inputRef.addEventListener('input', Debounce(onInput, DEBOUNCE_DELAY));

function onInput(evt) {
  countryListRef.innerHTML = '';
  countryInfoRef.innerHTML = '';
  const valueFromInput = evt.target.value.trim();
  if (!valueFromInput) {
    return;
  }
  fetchCountries(valueFromInput)
    .then(arrCountries => {
      numberOfCountries(arrCountries);
    })
    .catch(error => Notify.failure('Oops, there is no country with that name'));
}

function numberOfCountries(arr) {
  if (arr.length === 1) {
    singleCountry(arr);
  } else if (arr.length >= 2 && arr.length <= 10) {
    severalCountries(arr);
  } else {
    Notify.info('Too many matches found. Please enter a more specific name.');
  }
}

function singleCountry(data) {
  countryInfoRef.innerHTML = singleCountryMarkup(data);
  console.log(data);
}

function severalCountries(data) {
  countryListRef.innerHTML = severalCountriesMarkup(data);
}

function singleCountryMarkup(data) {
  const markup = data
    .map(
      country =>
        `<img width="100px" height="60px" src="${
          country.flags.png
        }" alt="flag" />
    <strong class="title">${country.name.official}</strong>
    <p class="value"><span>Capital:  </span>${country.capital}</p>
    <p class="value"><span>Population:  </span>${country.population}</p>
    <p class="value"><span>Languages:  </span>${Object.values(
      country.languages
    )}</p>`
    )
    .join('');
  return markup;
}

function severalCountriesMarkup(data) {
  const markup = data
    .map(
      country =>
        `<li class="country-item">
      <img width=50px height=30px src="${country.flags.png}" alt="flag"/>
      <p>${country.name.official}</p>
    </li>`
    )
    .join('');
  return markup;
}
