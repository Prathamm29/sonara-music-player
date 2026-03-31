let isLoop = false;
let isShuffle = false;

let likedSongs = JSON.parse(localStorage.getItem("likedSongs")) || [];

const songs = [
  { name: "Trouble", src: "songs/song1.mp3", cover: "covers/cover1.jpg" },
  { name: "American Wedding", src: "songs/song2.mp3", cover: "covers/cover2.jpg" },
  { name: "Hold Me Down", src: "songs/song3.mp3", cover: "covers/cover3.jpg" },
  { name: "Superpowers", src: "songs/song4.mp3", cover: "covers/cover4.jpg" },
  { name: "Slow Dancing in the Dark", src: "songs/song5.mp3", cover: "covers/cover5.jpg" },
  { name: "Dracula", src: "songs/song6.mp3", cover: "covers/cover6.jpg" },
  { name: "The Less I Know The Better", src: "songs/song7.mp3", cover: "covers/cover7.jpg" },
  { name: "Thinkin Bout You", src: "songs/song8.mp3", cover: "covers/cover8.jpg" },
  { name: "Nights", src: "songs/song9.mp3", cover: "covers/cover9.jpg" },
  { name: "Dark Red", src: "songs/song10.mp3", cover: "covers/cover10.jpg" },
  { name: "Feel Good Inc", src: "songs/song11.mp3", cover: "covers/cover11.jpg" },
  { name: "That’s What I Like", src: "songs/song12.mp3", cover: "covers/cover12.jpg" },
  { name: "All Falls Down", src: "songs/song13.mp3", cover: "covers/cover13.jpg" },
  { name: "Bound 2", src: "songs/song14.mp3", cover: "covers/cover14.jpg" },
  { name: "Can’t Tell Me Nothing", src: "songs/song15.mp3", cover: "covers/cover15.jpg" },
  { name: "Father Stretch My Hands", src: "songs/song16.mp3", cover: "covers/cover16.jpg" }
];

let currentSong = 0;

const audio = document.getElementById("audio");
const playlist = document.getElementById("playlist");
const progress = document.getElementById("progress");
const progressContainer = document.getElementById("progressContainer");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const volumeSlider = document.getElementById("volumeSlider");
const shuffleBtn = document.getElementById("shuffleBtn");
const likeBtn = document.getElementById("likeBtn");

// 🎧 Playlist
songs.forEach((song, index) => {
  const li = document.createElement("li");
  li.innerText = song.name;
  li.onclick = () => loadSong(index);
  li.id = "song-" + index;
  playlist.appendChild(li);
});

// ▶️ Play/Pause
function togglePlay() {
  const cover = document.getElementById("cover");
  const btn = document.getElementById("playBtn");

  if (audio.paused) {
    audio.play();
    btn.innerText = "⏸";
    cover.style.animationPlayState = "running";
    cover.classList.add("playing");
  } else {
    audio.pause();
    btn.innerText = "▶️";
    cover.style.animationPlayState = "paused";
    cover.classList.remove("playing");
  }
}

// 🎵 Load Song
function loadSong(index) {
  currentSong = index;

  audio.src = songs[index].src;
  audio.play();

  document.getElementById("songTitle").innerText = songs[index].name;
  document.getElementById("cover").src = songs[index].cover;
  document.getElementById("playBtn").innerText = "⏸";

  document.querySelectorAll("li").forEach(li => li.classList.remove("active"));
  document.getElementById("song-" + index).classList.add("active");

  updateLikeButton();
  updatePlaylistUI();
}

// ⏭ NEXT (FIXED SHUFFLE)
function playNext() {
  if (isShuffle) {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * songs.length);
    } while (randomIndex === currentSong);

    loadSong(randomIndex);
  } else {
    currentSong = (currentSong + 1) % songs.length;
    loadSong(currentSong);
  }
}

// ⏮ PREV
function prevSong() {
  currentSong = (currentSong - 1 + songs.length) % songs.length;
  loadSong(currentSong);
}

// 🔊 Progress
audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;

  const percent = (audio.currentTime / audio.duration) * 100;
  progress.style.width = percent + "%";

  const format = t =>
    Math.floor(t / 60) + ":" + (Math.floor(t % 60)).toString().padStart(2, "0");

  currentTimeEl.textContent = format(audio.currentTime);
  durationEl.textContent = format(audio.duration);
});

// ⏩ SEEK
progressContainer.addEventListener("click", (e) => {
  if (!audio.duration) return;

  const rect = progressContainer.getBoundingClientRect();
  const clickX = e.clientX - rect.left;

  audio.currentTime = (clickX / rect.width) * audio.duration;
});

// 🔊 Volume
audio.volume = 1;
volumeSlider.addEventListener("input", () => {
  audio.volume = volumeSlider.value;
});

// 🔁 Loop
function toggleLoop() {
  isLoop = !isLoop;
  document.getElementById("loopBtn").innerText = isLoop ? "🔂" : "🔁";
  audio.loop = isLoop;
}

// 🔀 Shuffle toggle
shuffleBtn.addEventListener("click", () => {
  isShuffle = !isShuffle;
  shuffleBtn.innerText = isShuffle ? "🔀 ON" : "🔀";
});

// ❤️ Like system
function updateLikeButton() {
  likeBtn.innerText = likedSongs.includes(currentSong) ? "❤️" : "🤍";
}

likeBtn.addEventListener("click", () => {
  if (likedSongs.includes(currentSong)) {
    likedSongs = likedSongs.filter(i => i !== currentSong);
  } else {
    likedSongs.push(currentSong);
  }

  localStorage.setItem("likedSongs", JSON.stringify(likedSongs));
  updateLikeButton();
  updatePlaylistUI();
});

function updatePlaylistUI() {
  songs.forEach((song, index) => {
    const li = document.getElementById("song-" + index);
    li.innerText = likedSongs.includes(index)
      ? "❤️ " + song.name
      : song.name;
  });
}

// 🔚 Auto next
audio.addEventListener("ended", () => {
  if (!isLoop) playNext();
});

// ⌨️ Space
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    togglePlay();
  }
});

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();

  songs.forEach((song, index) => {
    const li = document.getElementById("song-" + index);

    if (song.name.toLowerCase().includes(value)) {
      li.style.display = "block";
    } else {
      li.style.display = "none";
    }
  });
});

// 🚀 Start
loadSong(currentSong);

