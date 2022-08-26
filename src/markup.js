export default function markup({
  largeImageURL,
  webformatURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `<div class="gallery__card">
    <a class="gallery__item" href="${largeImageURL}">
      <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
    <div class="gallery__info">
    <p class="gallery__info-item">
      <b>Likes</b>${likes}
    </p>
    <p class="gallery__info-item">
      <b>Views</b>${views}
    </p>
    <p class="gallery__info-item">
      <b>Comments</b>${comments}
    </p>
    <p class="gallery__info-item">
      <b>Downloads</b>${downloads}
    </p>
  </div>
</div>`;
}
