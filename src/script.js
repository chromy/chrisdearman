
const addMemoryButton = document.getElementById('add-memory');
const hideSlideOutButton = document.getElementById('hide-slide-out')
const slideOutOverlay = document.getElementById('slide-out-overlay')

addMemoryButton.onclick = () => {
  slideOutOverlay.style.setProperty("display", null);
};
hideSlideOutButton.onclick = () => {
  slideOutOverlay.style.setProperty("display", "none");
};

