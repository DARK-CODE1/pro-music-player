const $ = document
const container = $.querySelector('.container'),
    musicImg = container.querySelector('.img-area img'),
    favorite = container.querySelector('.heart'),
    musicName = container.querySelector('.song-details .name'),
    musicArtist = container.querySelector('.song-details .artist'),
    mainAudio = container.querySelector('#main-audio'),
    playPauseBtn = container.querySelector('.play-pause'),
    nextBtn = container.querySelector('#Next'),
    pervBtn = container.querySelector('#Perv'),
    progressBar = container.querySelector('.progress-bar'),
    progressArea = container.querySelector('.progress-area'),
    moreMusicBtn = container.querySelector('#queue'),
    closeMusicBtn = container.querySelector('#close'),
    musicList = container.querySelector('.music-list');

let musicIndex = 1;
/*
    if you want to start point be random then replace let musicIndex = 1; with code below

    let musicIndex = Math.floor((Math.random() * allMusic.length) + 1); 
 */

window.addEventListener('load', () => {
    loadMusic(musicIndex);
    playingSong();
});
//load Music function
function loadMusic(indexNumb) {
    musicName.innerHTML = allMusic[indexNumb - 1].name;
    musicArtist.innerHTML = allMusic[indexNumb - 1].artist;
    musicImg.src = `images/${allMusic[indexNumb -1].img}.jpg`;
    mainAudio.src = `songs/${allMusic[indexNumb -1].scr}.mp3`;
};

//play Music function
function palyMusic() {
    container.classList.add('paused');
    playPauseBtn.querySelector('i').innerText = 'pause'
    mainAudio.play();
};

//pause Music function
function pauseMusic() {
    container.classList.remove('paused');
    playPauseBtn.querySelector('i').innerText = 'play_arrow'
    mainAudio.pause();
};

//next Music function
function nextMusic() {
    musicIndex++;
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playingSong();
    palyMusic()
};
//perv Music function
function pervMusic() {
    musicIndex--;
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    palyMusic();
    playingSong();
    
};

favorite.addEventListener('click', ()=>{
    favorite.classList.toggle('favorite')
})

function removeLike() {
    if (favorite.classList.contains) {
        favorite.classList.remove('favorite');
    }
}
//play or Pause button event
playPauseBtn.addEventListener('click', () => {
    isMusicPaused = container.classList.contains("paused");
    isMusicPaused ? pauseMusic() : palyMusic();
});

//next button event
nextBtn.addEventListener('click', () => {
    nextMusic()
});
//play or Pause button event
pervBtn.addEventListener('click', () => {
    pervMusic()
});

//update progressbar by current time
mainAudio.addEventListener('timeupdate', (e) => {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    //show music Duration time
    let musicCurrentTime = container.querySelector('.current-time'),
        musicDuration = container.querySelector('.max-duration')
    mainAudio.addEventListener('loadeddata', (e) => {
        let mianAdDuration = mainAudio.duration;
        let totalMin = Math.floor(mianAdDuration / 60);
        let totalSec = Math.floor(mianAdDuration % 60);
        if (totalSec < 10) {
            totalSec = `0${totalSec}`
        }

        musicDuration.innerText = `${totalMin}:${totalSec}`
    });

    //show current time
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if (currentSec < 10) {
        currentSec = `0${currentSec}`
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`
});

progressArea.addEventListener('click', (e) => {
    let progressWidth = progressArea.clientWidth;
    let clickedOffsetX = e.offsetX;
    let songDuration = mainAudio.duration;
    mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
});

//repeat  repeat_one  shuffle icon set
const repeatBtn = container.querySelector('#repeat-list');
repeatBtn.addEventListener('click', () => {
    let getText = repeatBtn.innerText;
    switch (getText) {
        case "repeat":
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "song looped")
            break;
        case "repeat_one":
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title", "playback shuffled")
            break;
        case "shuffle":
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title", "playlist looped")
            break;
    }
})

mainAudio.addEventListener('ended', () => {
    let getText = repeatBtn.innerText;
    switch (getText) {
        case "repeat":
            nextMusic();
            break;
        case "repeat_one":
            mainAudio.currentTime = 0;
            loadMusic(musicIndex);
            palyMusic();
            break;
        case "shuffle":
            let randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            do {
                randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            } while (musicIndex == randIndex);
            musicIndex = randIndex;
            loadMusic(musicIndex);
            palyMusic();
            playingSong();
            break;
    }
})

//show and hide music list
moreMusicBtn.addEventListener('click', () => {
    musicList.classList.toggle("show");
});

closeMusicBtn.addEventListener('click', () => {
    moreMusicBtn.click();
});

const ulTag = container.querySelector('ul');

for (let i = 0; i < allMusic.length; i++) {
    let liTag = `
    <li li-index="${i+1}">
     <div class="row">
       <span >${allMusic[i].name}</span>
       <p >${allMusic[i].artist}</p>
     </div>
     <audio id="${allMusic[i].scr}" src="songs/${allMusic[i].scr}.mp3"></audio>
     <span class="${allMusic[i].scr} audio-duration">1:45</span>
    </li>`;
    ulTag.insertAdjacentHTML('beforeend', liTag);

    let liAudioDurationTag = ulTag.querySelector(`.${allMusic[i].scr}`);
    let liAudioTag = ulTag.querySelector(`#${allMusic[i].scr}`);

    liAudioTag.addEventListener('loadeddata', (e) => {
        let duration = liAudioTag.duration;
        let totalMin = Math.floor(duration / 60);
        let totalSec = Math.floor(duration % 60);
        if (totalSec < 10) {
            totalSec = `0${totalSec}`
        }

        liAudioDurationTag.innerText = `${totalMin}:${totalSec}`;
        liAudioDurationTag.setAttribute('t-duration',`${totalMin}:${totalSec}`);
    });
}

const allLiTags = ulTag.querySelectorAll('li');

function playingSong() {
    for (let j = 0; j < allLiTags.length; j++) {
    let audioTag = allLiTags[j].querySelector(".audio-duration");
        
        if (allLiTags[j].classList.contains('playing')) {
            allLiTags[j].classList.remove('playing');
           
            let adDuration = audioTag.getAttribute('t-duration');
            audioTag.innerText=adDuration;
        }

        if (favorite.classList.contains) {
            favorite.classList.remove('favorite');
        }
        
        if (allLiTags[j].getAttribute('li-index') == musicIndex) {
            allLiTags[j].classList.add('playing');
            audioTag.innerHTML='Playing';
            
        }
        allLiTags[j].setAttribute('onclick', 'clicked(this)');
    }
}

function clicked(elment) {
    let getIndex = elment.getAttribute('li-index');
    musicIndex = getIndex;
    loadMusic(musicIndex);
    palyMusic();
    playingSong();
}
