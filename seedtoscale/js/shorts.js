document.addEventListener("DOMContentLoaded", function () {
    const popup = document.querySelector(".shorts-popup-component");
    const videoElement = popup.querySelector("video");
    const sourceElement = videoElement.querySelector("source");
    const playMuteWrapper = popup.querySelector(".shorts-play-mute-comp"); // Play/Mute controls wrapper
    const playIcon = popup.querySelector(".shorts-play-icon");
    const pauseIcon = popup.querySelector(".shorts-pause-icon"); // ✅ Correct class for pause button
    const muteIcon = popup.querySelector(".shorts-mute-wrapper .shorts-mute-icon");
    const unmuteIcon = popup.querySelector(".shorts-mute-wrapper .shorts-unmute-icon");
    const closeButton = popup.querySelector(".shorts-close-btn");

    // Hide play/mute controls initially
    playMuteWrapper.style.display = "none";

    function resetIcons() {
        if (videoElement.paused) {
            playIcon.style.display = "block";
            pauseIcon.style.display = "none";
        } else {
            playIcon.style.display = "none";
            pauseIcon.style.display = "block";
        }

        if (videoElement.muted) {
            muteIcon.style.display = "block";
            unmuteIcon.style.display = "none";
        } else {
            muteIcon.style.display = "none";
            unmuteIcon.style.display = "block";
        }
    }

    // Open popup when clicking any shorts-video-comp
    document.querySelectorAll(".shorts-video-comp").forEach((videoComp) => {
        videoComp.addEventListener("click", function () {
            const videoUrl = this.getAttribute("shorts-link");
            if (videoUrl) {
                sourceElement.src = videoUrl;
                videoElement.load(); // Reload the video with the new source

                // Hide controls until video has loaded
                playMuteWrapper.style.display = "none";

                // Try to autoplay unmuted, if blocked fallback to muted autoplay
                videoElement.muted = false;
                videoElement.play().then(() => {
                    resetIcons(); // Ensure icons match the actual state
                }).catch(() => {
                    console.warn("Autoplay with sound blocked, playing muted.");
                    videoElement.muted = true; // Fallback to muted autoplay if necessary
                    videoElement.play();
                });

                popup.style.display = "flex";
            }
        });
    });

    // Show play/mute controls when video is ready
    videoElement.addEventListener("loadeddata", function () {
        playMuteWrapper.style.display = "flex"; // Show controls only when video is loaded
        resetIcons();
    });

    // Play/Pause functionality
    playIcon.addEventListener("click", function () {
        videoElement.play();
        resetIcons(); // Ensure icons update immediately
    });

    pauseIcon.addEventListener("click", function () {
        videoElement.pause();
        resetIcons(); // Ensure icons update immediately
    });

    // Also listen for video play/pause events (fixes button glitches)
    videoElement.addEventListener("play", resetIcons);
    videoElement.addEventListener("pause", resetIcons);

    // Mute/Unmute functionality
    muteIcon.addEventListener("click", function () {
        videoElement.muted = false;
        resetIcons();
    });

    unmuteIcon.addEventListener("click", function () {
        videoElement.muted = true;
        resetIcons();
    });

    // Close popup
    closeButton.addEventListener("click", function () {
        popup.style.display = "none";
        videoElement.pause();
        sourceElement.src = ""; // Clear video source to prevent autoplay block
        videoElement.load(); // Ensure video reloads on next open
    });

    // Close when clicking outside video
    popup.addEventListener("click", function (e) {
        if (e.target.classList.contains("shorts-popup-bg")) {
            popup.style.display = "none";
            videoElement.pause();
            sourceElement.src = ""; // Clear video source
            videoElement.load(); // Ensure video reloads on next open
        }
    });
});
