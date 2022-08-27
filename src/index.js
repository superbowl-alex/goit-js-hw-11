// Import required packages, entities and modules
import Notiflix from 'notiflix';
import markup from './markup';
import getRefs from './get-refs';
import ImagesApiService from './images-service';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// Initializing references to DOM elements
const refs = getRefs();
// Total number of pages in backend response
let totalPages = 0;
// Boolean variable that signals that we have reached the end of the collection
let overflow = false;

// Creating an instance of a class ImagesApiService
const imagesApiService = new ImagesApiService();

// Add eventListeners
refs.form.addEventListener('submit', onSearch);
window.addEventListener('scroll', handleWindowScroll);

// Creating an instance of a class SimpleLightbox
const lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
  captionsData: 'alt',
});
lightbox.on('show.lightbox');

// Function that run on the form submit
function onSearch(e) {
  e.preventDefault();
  let currentQuery = e.target.elements.searchQuery.value.trim();
  if (imagesApiService.query === currentQuery) {
    return;
  }
  clearOutput();
  imagesApiService.query = currentQuery;
  imagesApiService.resetPage();
  if (!imagesApiService.query) {
    return;
  } else {
    imagesApiService
      .fetchImages()
      .then(({ data }) => {
        totalPages = Math.ceil(data.totalHits / imagesApiService.HITS_PER_PAGE);
        validationData(data);
        render(data);
      })
      .catch(error => console.log(error));
  }
}

// Function that run an infinite scroll
function handleWindowScroll({ target }) {
  if (
    window.scrollY + window.innerHeight + 10 >=
      document.documentElement.scrollHeight &&
    !imagesApiService.isLoading &&
    !overflow
  ) {
    onLoadMore();
  }
}

// A function that calls the server when more images need to be loaded
function onLoadMore() {
  imagesApiService
    .fetchImages()
    .then(({ data }) => {
      render(data);
      if (imagesApiService.page > totalPages) {
        Notiflix.Notify.warning(
          "We're sorry, but you've reached the end of search results."
        );
        overflow = true;
      }
    })
    .catch(error => console.log(error));
}

// Output cleaning function
function clearOutput() {
  refs.gallery.innerHTML = '';
}

// Markup render function
function render(data) {
  refs.gallery.insertAdjacentHTML(
    'beforeend',
    data.hits.map(hit => markup(hit)).join('')
  );
  lightbox.refresh();
}

// Backend response validation
function validationData(data) {
  // If no images were found for your request
  if (data.hits.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  // If pictures were found according to your request
  else {
    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
  }
}
