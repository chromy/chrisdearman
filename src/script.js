import PhotoSwipeLightbox from 'photoswipe/lightbox';
import PhotoSwipe from 'photoswipe';

const lightbox = new PhotoSwipeLightbox({
  gallery: '#gallery--simple',
  children: 'a',
  pswpModule: PhotoSwipe
});
lightbox.init();
