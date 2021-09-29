const playPauseButton = document.querySelector("#play-btn");
const video = document.querySelector(".video");
const progressRange = document.querySelector("#progress-range");
const progressBar = document.querySelector("#progress-bar");
const screenSizeController = document.querySelector("#screen-size");
const volumeIcon = document.getElementById("volume-icon");
const videoContainer = document.querySelector("#player-container");
const volumeRange = document.querySelector("#volume-range");
const volumeBar = document.querySelector("#volume-bar");

const timeElapsed = document.querySelector(".time-elapsed");
const duration = document.querySelector(".time-duration");
const playerSpeed = document.querySelector("#player-speed");

let play = false;

// Play & Pause ----------------------------------- //
function pauseVideo() {
  video.pause();
  play = false;
  playPauseButton.classList.replace("fa-pause", "fa-play");
}

function playVideo() {
  video.play();
  play = true;
  playPauseButton.classList.replace("fa-play", "fa-pause");
}

// Progress Bar ---------------------------------- //
function updateProgressBar(e) {
  let currentTime = e.srcElement.currentTime;
  let duration = e.srcElement.duration;
  let persentageBar = (currentTime / duration) * 100;
  progressBar.style.width = `${persentageBar}%`;
  timeElapsed.textContent = `${getTimeFormat(currentTime)} /`;
  duration.textContent = getTimeFormat(duration);
}

function getTimeFormat(time) {
  let minutes = Math.floor(time / 60);
  let seconds = Math.floor(time % 60);
  if (seconds < 10) seconds = `0${seconds}`;
  return `${minutes}:${seconds}`;
}

function updateVideo(e) {
  const totalWidth = progressRange.offsetWidth;
  const userClickWidth = e.offsetX;
  const newTime = userClickWidth / totalWidth;
  const videoPercentage = newTime * 100;
  progressBar.style.width = `${videoPercentage}%`;
  video.currentTime = newTime * video.duration;
}

// Volume Controls --------------------------- //
let lastVolume = 1;

function volumeControl(e) {
  let volume = e.offsetX / volumeRange.offsetWidth;
  if (volume < 0.1) volume = 0;
  else if (volume > 0.9) volume = 1;

  volumeBar.style.width = `${volume * 100}%`;
  video.volume = volume;
  volumeIcon.className = "";
  //Change icon of volume according to changing of volume
  if (volume > 0.7) volumeIcon.classList.add("fas", "fa-volume-up");
  else if (volume < 0.7 && volume > 0)
    volumeIcon.classList.add("fas", "fa-volume-down");
  else volumeIcon.classList.add("fas", "fa-volume-off");

  lastVolume = volume;
}

function toggleVolume() {
  volumeIcon.className = "";
  if (video.volume) {
    lastVolume = video.volume;
    video.volume = 0;
    volumeBar.style.width = `0%`;
    volumeIcon.classList.add("fas", "fa-volume-mute");
  } else {
    video.volume = lastVolume;
    volumeBar.style.width = `${lastVolume * 100}%`;
    volumeIcon.classList.add("fas", "fa-volume-up");
  }
}

// Change Playback Speed -------------------- //
function changeSpeed(e) {
  video.playbackRate = e.srcElement.value;
}

// Fullscreen ------------------------------- //
/* View in fullscreen */
function openFullscreen(elem) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    /* IE11 */
    elem.msRequestFullscreen();
  }
  video.classList.add("video-fullscreen");
}

/* Close fullscreen */
function closeFullscreen(elem) {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    /* IE11 */
    document.msExitFullscreen();
  }
  video.classList.remove("video-fullscreen");
}

let fullScreen = false;
function setScreenSize() {
  if (!fullScreen) {
    openFullscreen(videoContainer);
  } else {
    closeFullscreen(videoContainer);
  }
  fullScreen = !fullScreen;
}

//EventListner
playPauseButton.addEventListener("click", (e) =>
  play ? pauseVideo(e) : playVideo(e)
);

video.addEventListener("click", (e) => (play ? pauseVideo(e) : playVideo(e)));
video.addEventListener("timeupdate", updateProgressBar);
progressRange.addEventListener("click", updateVideo);
screenSizeController.addEventListener("click", setScreenSize);
video.addEventListener("ended", pauseVideo);
volumeRange.addEventListener("click", volumeControl);
volumeIcon.addEventListener("click", toggleVolume);
playerSpeed.addEventListener("change", changeSpeed);
