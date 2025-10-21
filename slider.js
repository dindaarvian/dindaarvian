const slider = document.getElementById('gallery-slider');
const images = slider.querySelectorAll('img');
const totalImages = images.length;
let index = 0;
const visible = 3; // tampil 3 gambar per frame
let autoSlide;

function updateSlide() {
  const width = images[0].clientWidth + 10; // +gap
  slider.style.transform = `translateX(${-index * width}px)`;
}

function nextSlide() {
  if (index < totalImages - visible) index++;
  else index = 0;
  updateSlide();
}

function prevSlide() {
  if (index > 0) index--;
  else index = totalImages - visible;
  updateSlide();
}

function startAutoSlide() {
  autoSlide = setInterval(nextSlide, 3000);
}
function stopAutoSlide() {
  clearInterval(autoSlide);
}

document.querySelector('.slide-btn.next').addEventListener('click', () => {
  stopAutoSlide(); nextSlide(); startAutoSlide();
});
document.querySelector('.slide-btn.prev').addEventListener('click', () => {
  stopAutoSlide(); prevSlide(); startAutoSlide();
});

// Swipe support (HP)
let startX = 0;
slider.addEventListener('touchstart', e => startX = e.touches[0].clientX);
slider.addEventListener('touchend', e => {
  const endX = e.changedTouches[0].clientX;
  if (startX - endX > 50) { stopAutoSlide(); nextSlide(); startAutoSlide(); }
  else if (endX - startX > 50) { stopAutoSlide(); prevSlide(); startAutoSlide(); }
});

// Start auto-slide
startAutoSlide();