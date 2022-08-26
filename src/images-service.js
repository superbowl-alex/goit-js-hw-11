const axios = require('axios');
const API_KEY = '29385448-a71fcce374d47abba8b3fae94';

//API for requesting and receiving data from the server
export default class ImagesApiService {
  constructor() {
    this.HITS_PER_PAGE = 40;
    this.searchQuery = '';
    this.page = 1;
    this.totalPages = 0;
  }

  async fetchImages() {
    axios.defaults.baseURL = 'https://pixabay.com/api';
    const response = await axios.get(
      `/?key=${API_KEY}&q=${this.searchQuery}&page=${this.page}&per_page=${this.HITS_PER_PAGE}&image_type=photo&orientation=horizontal&safesearch=true`
    );
    console.log(this);
    this.incrementPage();
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
