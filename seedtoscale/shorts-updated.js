document.addEventListener("DOMContentLoaded", function () {
    // Preload first few shorts
    const firstShorts = document.querySelectorAll(".shorts-video-comp");
    const preloadedVideos = new Map();
    
    // Preload first 3 shorts
    for (let i = 0; i < Math.min(3, firstShorts.length); i++) {
        const videoUrl = firstShorts[i].getAttribute("shorts-link");
        if (videoUrl) {
            const preloadVideo = document.createElement("video");
            preloadVideo.src = videoUrl;
            preloadVideo.preload = "auto";
            preloadVideo.muted = true;
            preloadVideo.load();
            preloadedVideos.set(videoUrl, preloadVideo);
        }
    }

    function initShortsControls(container) {
        const video = container.querySelector("video");
        const playIcon = container.querySelector(".shorts-play-icon");
        const pauseIcon = container.querySelector(".shorts-pause-icon");
        const muteIcon = container.querySelector(".shorts-mute-icon");
        const unmuteIcon = container.querySelector(".shorts-unmute-icon");
        const preloader = container.querySelector(".shorts-preloader");

        if (!video || !playIcon || !pauseIcon || !muteIcon || !unmuteIcon) return;

        function updateIcons() {
            playIcon.style.display = video.paused ? "block" : "none";
            pauseIcon.style.display = video.paused ? "none" : "block";
            muteIcon.style.display = video.muted ? "block" : "none";
            unmuteIcon.style.display = video.muted ? "none" : "block";
        }

        playIcon.addEventListener("click", () => {
            video.play();
            if (preloader) preloader.style.display = "none";
            updateIcons();
        });
        pauseIcon.addEventListener("click", () => {
            video.pause();
            updateIcons();
        });
        muteIcon.addEventListener("click", () => {
            video.muted = false;
            updateIcons();
        });
        unmuteIcon.addEventListener("click", () => {
            video.muted = true;
            updateIcons();
        });

        video.addEventListener("play", updateIcons);
        video.addEventListener("pause", updateIcons);
        video.addEventListener("volumechange", updateIcons);

        // Hide preloader when video is ready
        video.addEventListener("loadeddata", () => {
            if (preloader) preloader.style.display = "none";
        });

        video.addEventListener("canplaythrough", () => {
            if (preloader) preloader.style.display = "none";
        });

        updateIcons(); // Initial icon sync
    }

    const popup = document.querySelector(".shorts-popup-component");
    const videoElement = popup.querySelector("video");
    const sourceElement = videoElement.querySelector("source");
    const playMuteWrapper = popup.querySelector(".shorts-play-mute-comp");
    const closeButton = popup.querySelector(".shorts-close-btn");
    const articleLink = popup.querySelector(".shorts-article-link"); // Link block in popup

    // Hide play/mute controls initially
    playMuteWrapper.style.display = "none";

    // Open popup when clicking any .shorts-video-comp
    document.querySelectorAll(".shorts-video-comp").forEach((videoComp) => {
        videoComp.addEventListener("click", function () {
            const videoUrl = this.getAttribute("shorts-link");
            const resourceLink = this.getAttribute("rel-resource-link"); // New attribute

            if (videoUrl) {
                sourceElement.src = videoUrl;
                // Show preloader before video starts loading
                const preloader = popup.querySelector(".shorts-preloader");
                if (preloader) preloader.style.display = "block";

                videoElement.load();
                playMuteWrapper.style.display = "none";

                // Try to autoplay unmuted; fallback to muted if blocked
                videoElement.muted = false;
                videoElement.play().then(() => {
                    playMuteWrapper.style.display = "flex";
                    initShortsControls(popup);
                }).catch(() => {
                    videoElement.muted = true;
                    videoElement.play();
                    playMuteWrapper.style.display = "flex";
                    initShortsControls(popup);
                });

                // Show or hide the article link based on whether resourceLink is set
                if (resourceLink && articleLink) {
                    const href = /^https?:\/\//i.test(resourceLink) ? resourceLink : "https://" + resourceLink;
                    articleLink.setAttribute("href", href);
                    articleLink.style.display = "block"; // Ensure link is visible
                } else if (articleLink) {
                    articleLink.style.display = "none"; // Hide link when no URL provided
                }

                popup.style.display = "flex";
            }
        });
    });

    // Close popup
    function closePopup() {
        popup.style.display = "none";
        videoElement.pause();
        sourceElement.src = "";
        videoElement.load();
        if (articleLink) {
            articleLink.setAttribute("href", ""); // Clear the link
        }
    }
    closeButton.addEventListener("click", closePopup);

    // Close when clicking outside video
    popup.addEventListener("click", function (e) {
        if (e.target.classList.contains("shorts-popup-bg")) {
            closePopup();
        }
    });

    document.querySelectorAll(".story-card").forEach(initShortsControls);
});
