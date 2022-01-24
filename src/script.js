
const addMemoryButton = document.getElementById('add-memory');
const hideSlideOutButton = document.getElementById('hide-slide-out')
const cancelSlideOutButton= document.getElementById('cancel-slide-out')
const slideOutOverlay = document.getElementById('slide-out-overlay')

function close() {
  slideOutOverlay.classList.add("hidden");
}

function open() {
  slideOutOverlay.classList.remove("hidden");
}


addMemoryButton.onclick = open;
hideSlideOutButton.onclick = close;
cancelSlideOutButton.onclick = close;

