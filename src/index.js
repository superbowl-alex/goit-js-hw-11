// import required packages and entities
// import getRefs from './get-refs';
import Notiflix from 'notiflix';
import markup from './markup';
import ImagesApiService from './images-service';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const axios = require('axios');

//
const refs = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('.search-form__input'),
  gallery: document.querySelector('.gallery'),
  buttonLoadMore: document.querySelector('[data-action="load-more"]'),
};

const imagesApiService = new ImagesApiService();
let totalPages = 0;

// add an eventListener to the form
refs.form.addEventListener('submit', onSearch);
refs.buttonLoadMore.addEventListener('click', onLoadMore);

const lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
  captionsData: 'alt',
});
lightbox.on('show.lightbox');

// function that run on the form submit
function onSearch(e) {
  e.preventDefault();
  clearOutput();
  imagesApiService.query = e.currentTarget.elements.searchQuery.value.trim();
  imagesApiService.resetPage();
  if (imagesApiService.query) {
    imagesApiService
      .fetchImages()
      .then(({ data }) => {
        console.log(data);
        totalPages = Math.ceil(data.totalHits / imagesApiService.HITS_PER_PAGE);
        if (data.hits.length !== 0) {
          Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        }
        render(data);
      })
      .catch(error => console.log(error));
  }
}

function onLoadMore() {
  imagesApiService
    .fetchImages()
    .then(({ data }) => {
      console.log(data);
      render(data);
      smoothScroll();
      if (imagesApiService.page > totalPages) {
        refs.buttonLoadMore.classList.add('is-hidden');
        Notiflix.Notify.warning(
          "We're sorry, but you've reached the end of search results."
        );
      }
    })
    .catch(error => console.log(error));
}

// output cleaning function
function clearOutput() {
  refs.gallery.innerHTML = '';
  refs.buttonLoadMore.classList.add('is-hidden');
}

// markup render function
function render(data) {
  // if the backend returned more than 10 countries
  if (data.hits.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    refs.gallery.insertAdjacentHTML(
      'beforeend',
      data.hits.map(hit => markup(hit)).join('')
    );
    refs.buttonLoadMore.classList.remove('is-hidden');
    lightbox.refresh();
  }
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
