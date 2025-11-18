document.addEventListener("DOMContentLoaded", () => {



    const audio = new Audio();
    audio.preload = "auto";

    const playBtn = document.getElementById("play");
    const prevBtn = document.getElementById("prev");
    const nextBtn = document.getElementById("next");
    const loopBtn = document.getElementById("loop");
    const replayBtn = document.getElementById("replay");
    const soundBtn = document.getElementById("sound");

    const progress = document.getElementById("progress");
    const currentTimeEl = document.getElementById("start");
    const durationEl = document.getElementById("end");
    const volumeSlider = document.getElementById("volume-slider");

    const songTitle = document.querySelector(".content h1");
    const artistName = document.querySelector(".content p");
    const songImg = document.querySelector(".audio-img");

    const playlistPanel = document.getElementById("playlist");

    const playlistToggle = document.getElementById("playlist-toggle");
    const deleteBtn = document.getElementById("delete-song");


    // SONG LIST

    const songs = [
        { img: './assets/yaquloban.jpg', title: 'Ya Quloban', artist: 'Abdulla AlSinani', src: './assets/Ya_quluban_min_xadidin_-_Ya_quluban_min_xadidin_(mp3.pm).mp3' },
        { img: './assets/wohi_kuda_hai_img.jpg', title: 'Wohi Khuda hai', artist: 'Atif Aslam', src: './assets/wohi_kuda_hai.mp3' },
        { img: './assets/Tajdar-e-Haram-img.jpg', title: 'Tajdar e haram', artist: 'Atif Aslam', src: './assets/Tajdar-e-Haram-Without-Music-Live-Version-Atif-Aslam.mp3' },
        { img: './assets/rehmatullialameen_img.jpg', title: 'Rehmat ul lil Alamin', artist: 'Maher Zain', src: './assets/rehmatullialameen.mp3' },
        { img: './assets/lam_yati_nazeroun_img.jpg', title: 'Lam Yati Nazeron', artist: 'Faraz Butt', src: './assets/lam_yati_nazeroun-[AudioTrimmer.com].mp3' },
        { img: './assets/Kaha main Kahan img.jpg', title: 'Jahan Roza e pak e khairul wara hai', artist: 'Qari Waheed Zafar Qazmi', src: './assets/Kaha main Kaha ye Madine ki galiyan   Naat   Rah e Hidayat TV(MP3_160K) (1).mp3' },
        { img: './assets/illahi_teri_choukhat_par_img.jpg', title: 'Ilahi Teri Choukhat Par', artist: 'Dr. Rida Khan', src: './assets/illahi_teri_choukhat_par.mp3' }
    ];


    let index = 0;
    let isPlaying = false;
    let isLoop = false;


    // FUNCTIONS

    function loadSong(i) {
        const song = songs[i];
        audio.src = song.src;
        songTitle.textContent = song.title;
        artistName.textContent = song.artist;
        songImg.src = song.img;
        updatePlaylistUI();
    }

    function playSong() {
        isPlaying = true;
        playBtn.querySelector("i").classList.replace("fa-play", "fa-pause");
        audio.play();
    }

    function pauseSong() {
        isPlaying = false;
        playBtn.querySelector("i").classList.replace("fa-pause", "fa-play");
        audio.pause();
    }

    function handlePlayButton() {
        isPlaying ? pauseSong() : playSong();
    }

    function nextSong() {
        index = (index + 1) % songs.length;
        loadSong(index);
        playSong();
    }

    function prevSong() {
        index = (index - 1 + songs.length) % songs.length;
        loadSong(index);
        playSong();
    }

    function toggleLoop() {
        isLoop = !isLoop;
        audio.loop = isLoop;
        if (isLoop) {
            loopBtn.style.background = "#f9a5cfff";
        } else {
            loopBtn.style.background = "transparent";
        }
    }


    function replaySong() {
        audio.currentTime = 0;
        playSong();
    }

    function toggleMute() {
        audio.muted = !audio.muted;
        soundBtn.querySelector("i").classList.toggle("fa-volume-mute");
    }

    function formatTime(sec) {
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return `${m}:${s < 10 ? "0" : ""}${s}`;
    }

    function togglePlaylist() {
        const isOpening = playlistPanel.style.display === "none";
        playlistPanel.style.display = isOpening ? "block" : "none";
        const elementsToToggle = [
            songImg,
            document.querySelector(".strtime"),
            document.querySelector(".controls"),
            document.querySelector(".volume")
        ];

        elementsToToggle.forEach(el => {
            el.style.display = isOpening ? "none" : "";
        });
        progress.style.display = isOpening ? "none" : "";
        const loopReplayRow = document.querySelectorAll(".icons-top")[1];
        loopReplayRow.style.display = isOpening ? "none" : "flex";
        document.querySelectorAll(".icons-top")[0].style.display = "flex";
        document.querySelector(".content").style.display = "block";
    }


    function updatePlaylistUI() {
        playlistPanel.innerHTML = "";

        songs.forEach((song, i) => {
            const div = document.createElement("div");
            div.classList.add("playlist-item");
            div.innerHTML = `${i + 1}. ${song.title} - ${song.artist}`;
            if (i === index) div.classList.add("active");

            div.addEventListener("click", () => {
                index = i;
                loadSong(index);
                playSong();
                updatePlaylistUI();
            });

            playlistPanel.appendChild(div);
        });
    }

    function deleteCurrentSong() {
    if (songs.length <= 1) {
        alert("❌ Cannot delete the last song!");
        return;
    }

    const confirmDelete = confirm(" Are you sure you want to delete this song?");
    
    if (!confirmDelete) return; 
    songs.splice(index, 1);

    index = index % songs.length;

    loadSong(index);
    updatePlaylistUI();
}


    // EVENT LISTENERS

    playBtn.addEventListener("click", handlePlayButton);
    prevBtn.addEventListener("click", prevSong);
    nextBtn.addEventListener("click", nextSong);
    loopBtn.addEventListener("click", toggleLoop);
    replayBtn.addEventListener("click", replaySong);
    soundBtn.addEventListener("click", toggleMute);

    audio.addEventListener("loadedmetadata", () => {
        durationEl.textContent = formatTime(audio.duration);
    });

    audio.addEventListener("timeupdate", () => {
        progress.value = audio.currentTime / audio.duration;
        currentTimeEl.textContent = formatTime(audio.currentTime);
    });

    progress.addEventListener("input", () => {
        audio.currentTime = progress.value * audio.duration;
    });

    volumeSlider.addEventListener("input", () => {
        audio.volume = volumeSlider.value;
    });

    audio.addEventListener("ended", () => {
        if (!isLoop) nextSong();
    });

    playlistToggle.addEventListener("click", togglePlaylist);
    deleteBtn.addEventListener("click", deleteCurrentSong);

    loadSong(index);
});
