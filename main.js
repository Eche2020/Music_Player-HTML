document.getElementById('file').addEventListener('change', function () {
    const files = Array.from(this.files);
    const tableBody = document.querySelector('#musicTable tbody')
    let currentAudio = null;
    let currentIndex = 0;
    
    // clear existing rows
    tableBody.innerHTML = "";
    
    // function to fetch the songs through the existing files
    files.forEach((file, index) => {
        if (!file.type.startsWith("audio/")) {
            console.warn(`${file.name} is not an audio file.`);
            return;
        }

        const row = tableBody.insertRow();
        const cell = row.insertCell();
        cell.textContent = file.name;
        cell.classList.add("music-track");
        
        // eventlistener to play audio
        cell.addEventListener('click', () => {
            playAudio(index)
        })
    })

    // function to control the playAudio
    function playAudio(index) {
        if (currentAudio) {
            currentAudio.pause()   
        }

        currentIndex = index;
        const file = files[index]
        currentAudio = new Audio(URL.createObjectURL(file));  

        currentAudio.play();
        updateProgessBar();

        const playingCell = tableBody.rows[currentIndex].cells[0];
        tableBody.querySelectorAll('.playing').forEach((e) => e.classList.remove('playing'))
        playingCell.classList.add('playing')

        // Revoke the object URL after the audio starts playing to free memory
        currentAudio.addEventListener('canplaythrough', () => {
            URL.revokeObjectURL(currentAudio.src);
        });

        // update progress bar while the audio is playing
        currentAudio.addEventListener('timeupdate', updateProgessBar)


        // Reset the play/pause button when audio ends
        currentAudio.addEventListener('ended', () => {
            playPauseButton.textContent = "&#10073;&#10073;"
            playingCell.classList.remove("playing")
            progressBar.style.width = "0%"
        });
    }

    // function to update progress bar
    function updateProgessBar() {
        const progressBar = document.querySelector(".progress")
        if (currentAudio && currentAudio.duration) {
            const progress = (currentAudio.currentTime / currentAudio.duration) * 100;
            progressBar.style.width = `${progress}%`;
        } 
    }

    // button functionalities
    const playPauseButton = document.querySelector(".play-pause");
    playPauseButton.addEventListener('click', () => {
        if (currentAudio) {
            if (currentAudio.paused) {
                currentAudio.play();
                playPauseButton.textContent = "⏸"
            } else {
                currentAudio.pause();
                playPauseButton.textContent = "▶"
            }
        } else if (files.length > 0) {
            playAudio(0);
            playPauseButton.textContent = "⏸"
        }
    })

    document.querySelector('.prev').addEventListener('click', () => {
        if (files.length > 0) {
            const prevIndex = (currentIndex - 1 + files.length) % files.length;
            playAudio(prevIndex)
            playPauseButton.textContent = "⏸"
        }

    })

    document.querySelector('.next').addEventListener('click', () => {
        if (files.length > 0) {
            const nextIndex = (currentIndex + 1) % files.length;
            playAudio(nextIndex);
            playPauseButton.textContent = "⏸"
        }
    })


})