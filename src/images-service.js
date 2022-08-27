//API for requesting and receiving data from the server
const axios = require('axios');
// My API key is stored in a constant
const API_KEY = '29385448-a71fcce374d47abba8b3fae94';

export default class ImagesApiService {
  constructor() {
    this.HITS_PER_PAGE = 40;
    this.searchQuery = '';
    this.page = 1;
    this.isLoading = false;
  }

  async fetchImages() {
    axios.defaults.baseURL = 'https://pixabay.com/api';
    this.isLoading = true;
    const response = await axios.get(
      `/?key=${API_KEY}&q=${this.searchQuery}&page=${this.page}&per_page=${this.HITS_PER_PAGE}&image_type=photo&orientation=horizontal&safesearch=true`
    );
    this.incrementPage();
    this.isLoading = false;
    return response;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
