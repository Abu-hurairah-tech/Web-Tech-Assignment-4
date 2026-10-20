var currentSlide = 0;
var slidesArray = [];
var isFullScreen = false;

var defaultMarkdown =
  "# This is Slide 01\n## This is Heading 02 in slide 01\n\nThis is your content on slide 01\n---\n# This is Slide 02\n## This is Heading 02 in slide 02\n\nThis is your content on slide 02";

// Load saved slides when page opens (Task 8)
window.onload = function () {
  var savedData = localStorage.getItem("mySavedSlides");
  if (savedData !== null) {
    document.getElementById("mdInput").value = savedData;
  } else {
    document.getElementById("mdInput").value = defaultMarkdown;
  }
  updateSlides();
};

// Convert basic markdown lines into HTML (Task 1 & 3)
function parseMarkdown(text) {
  var lines = text.split("\n");
  var html = "";

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    if (line.startsWith("### ")) {
      html += "<h3>" + line.substring(4) + "</h3>";
    } else if (line.startsWith("## ")) {
      html += "<h2>" + line.substring(3) + "</h2>";
    } else if (line.startsWith("# ")) {
      html += "<h1>" + line.substring(2) + "</h1>";
    } else if (line !== "") {
      html += "<p>" + line + "</p>";
    }
  }
  return html;
}

// Update slides in realtime (Task 3 & 4)
function updateSlides() {
  var rawText = document.getElementById("mdInput").value;
  slidesArray = rawText.split("---");

  if (currentSlide >= slidesArray.length) {
    currentSlide = slidesArray.length - 1;
  }
  if (currentSlide < 0) {
    currentSlide = 0;
  }

  showCurrentSlide();
}

// Display current slide, buttons state, and counter (Task 5 & 7)
function showCurrentSlide() {
  var contentArea = document.getElementById("slideContent");
  contentArea.innerHTML = parseMarkdown(slidesArray[currentSlide]);

  // Format: {current slide number} / {total number of slides}
  var countText = currentSlide + 1 + " / " + slidesArray.length;
  document.getElementById("slideCount").innerText = countText;

  // Disable Left button on first slide
  if (currentSlide === 0) {
    document.getElementById("leftBtn").disabled = true;
  } else {
    document.getElementById("leftBtn").disabled = false;
  }

  // Disable Right button on last slide
  if (currentSlide === slidesArray.length - 1) {
    document.getElementById("rightBtn").disabled = true;
  } else {
    document.getElementById("rightBtn").disabled = false;
  }
}

function prevSlide() {
  if (currentSlide > 0) {
    currentSlide--;
    showCurrentSlide();
  }
}

function nextSlide() {
  if (currentSlide < slidesArray.length - 1) {
    currentSlide++;
    showCurrentSlide();
  }
}

// Toggle presentation mode (Task 2d & 5)
function toggleFullScreen() {
  var screen = document.getElementById("slideScreen");
  var btn = document.getElementById("fullScreenBtn");

  if (!isFullScreen) {
    screen.classList.add("presentation-mode");
    btn.innerText = "Exit Full Screen";
    isFullScreen = true;
    if (screen.requestFullscreen) {
      screen.requestFullscreen();
    }
  } else {
    screen.classList.remove("presentation-mode");
    btn.innerText = "Full Screen";
    isFullScreen = false;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }
}

// Save slides in browser internal memory (Task 2c & 8)
function saveSlides() {
  var text = document.getElementById("mdInput").value;
  localStorage.setItem("mySavedSlides", text);

  var msg = document.getElementById("saveMsg");
  msg.innerText = "Saved!";
  setTimeout(function () {
    msg.innerText = "";
  }, 2000);
}

// Create new presentation (Task 2a)
function newPresentation() {
  document.getElementById("mdInput").value =
    "# New Slide 01\n\nWrite content here...";
  currentSlide = 0;
  updateSlides();
}

// Keyboard shortcuts (Task 6)
document.addEventListener("keydown", function (event) {
  // Ctrl + S to save
  if (event.ctrlKey && (event.key === "s" || event.key === "S")) {
    event.preventDefault();
    saveSlides();
  }

  // F11 for full screen
  if (event.key === "F11") {
    event.preventDefault();
    toggleFullScreen();
  }

  // Left and Right arrows (only when not typing inside textarea)
  if (document.activeElement.id !== "mdInput") {
    if (event.key === "ArrowRight") {
      nextSlide();
    } else if (event.key === "ArrowLeft") {
      prevSlide();
    }
  }
});
