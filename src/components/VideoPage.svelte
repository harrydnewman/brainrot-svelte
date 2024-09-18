<script>
    import { Link } from 'svelte-routing';
    import VideoContainer from '../lib/VideoContainer.svelte';

    let scrollTop = 0;
    let mappedScrollValue = 0;
    let initialScrollTop = 0;
    let action = 'none';

    function handleScrollUpdate(value) {
        mappedScrollValue = value; // Update the mapped scroll value
    }
    function handleInitialScrollValue(value) {
        initialScrollTop = value; // Update the initial scroll value
    }

    function getRandomColor(){
        let colors = ["red", "blue", "green", "yellow", "purple", "orange", "pink", "brown", "gray", "black", "white"];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    function requestVideoUpdate() {
        // Change the overlay colors to indicate an update
        const topOverlay = document.querySelector('.top-overlay');
        const bottomOverlay = document.querySelector('.bottom-overlay');
        
        if (topOverlay instanceof HTMLElement && bottomOverlay instanceof HTMLElement) {
            topOverlay.style.backgroundColor = 'rgba(255, 0, 0, 0.5)'; // Red semi-transparent
            bottomOverlay.style.backgroundColor = 'rgba(255, 0, 0, 0.5)'; // Red semi-transparent
        }

        // Wait for 5 seconds
        setTimeout(() => {
            // Get a random color
            let color = getRandomColor();
            // Apply the random color to the overlays
            if (topOverlay instanceof HTMLElement && bottomOverlay instanceof HTMLElement) {
                topOverlay.style.backgroundColor = color;
                bottomOverlay.style.backgroundColor = color;
            }

            // Return the video data (for now just use colors)
            let returnedData = {
                updating: false,
                videoFile: color // for now just use colors
            };
        }, 5000);
    }

    async function handleVideoUpdate()  {
      console.log("handleVideoUpdate");
      let color = getRandomColor();

      
      let returnedData = {
        color: color,
    }
    return returnedData;
  }
</script>

<div class="container">
    <!-- <h1>Video Scroll Page</h1> -->

    <div class="video-container">
        <VideoContainer onScrollUpdate={handleScrollUpdate} onInitialScrollValue={handleInitialScrollValue}  onVideoUpdate={handleVideoUpdate} requestVideoUpdate={requestVideoUpdate}/> <!-- Pass the callback -->
    </div>

    <div class="video-information">
        <h1>Video Title</h1>
        <p>Video Description</p>
        <p>Scroll Value: {mappedScrollValue}</p>
        <p>Initial Scroll Value: {initialScrollTop}</p>
        <p>Action: {action}</p>
    </div>
</div>

<style>
    .container {
        display: inline-flex;
        align-items: left;
        height: 100%;
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
        overflow-y: scroll;
    }

    .video-container {
        align-items: center;
        min-width: 390px;
        height: 90vh;
        /* background-color: red; */
        /* overflow: hidden; */
    }

    .container::-webkit-scrollbar {
        display: none;
    }
</style>
