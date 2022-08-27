// create references to DOM elements
export default function getRefs() {
  return {
    form: document.querySelector('.search-form'),
    input: document.querySelector('.search-form__input'),
    gallery: document.querySelector('.gallery'),
  };
}
