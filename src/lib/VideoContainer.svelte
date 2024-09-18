<!-- this needs to be cleaned uop -->
<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  let innerScrollTop = 0;
  let maxScrollTop = 0;


  export let initialScrollTop = 0;
  export let mappedScrollValue = 0;
  export let onScrollUpdate;
  export let onInitialScrollValue;
  export let onVideoUpdate;
  export let requestVideoUpdate;

  let counter = 0;
  let sameCounter = 0;
  let scrollPosition = 0;
  let resettingValue = false;

  let updating = false;

  let innerContainer;
  let middleElement;
  let videoContainer;
  let bottomOverlay;
  let topOverlay;
  let originalScrollPosition = 0; // Store the original scroll position
  let resetInterval;

  let previousMappedScrollValue = 0; // Store previous value
  let interval; // Variable to hold the interval ID

  function setUpNewVideo(data){
    console.log("Setting up new video");
    console.log(data)
    updating = false;
    topOverlay.style.height = `${0}%`;
    bottomOverlay.style.height = `${0}%`;
    bottomOverlay.style.backgroundColor = `rgba(148, 148, 148, 0.512)`; /* White opaque */
    topOverlay.style.backgroundColor = `rgba(148, 148, 148, 0.512)`;
    innerContainer.style.backgroundColor = data.color;
    innerContainer.scrollTop = initialScrollTop;
    return
  }


  function handleInnerScroll() {
    innerScrollTop = innerContainer.scrollTop;
    if (bottomOverlay && topOverlay) {
        topOverlay.style.height = `${0}%`;
        bottomOverlay.style.height = `${0}%`;
      counter += 1;
      if (counter <= 1) {
        initialScrollTop = innerScrollTop;
        if (onInitialScrollValue) {
          onInitialScrollValue(initialScrollTop);
        }
      }
      mappedScrollValue = mapNumRange(innerScrollTop,0,maxScrollTop, -100, 100);
      if (mappedScrollValue < 0) {
        topOverlay.style.height = `${mappedScrollValue * -1}%`;
        bottomOverlay.style.height = `${0}%`;
      } else if (mappedScrollValue > 0) {
        bottomOverlay.style.height = `${mappedScrollValue}%`;
        topOverlay.style.height = `${0}%`;
      }
        else if (mappedScrollValue > 100){
            bottomOverlay.style.height = `${100}%`;
            topOverlay.style.height = `${0}%`;
            
            
            
        }
        else if (mappedScrollValue < -100){
            topOverlay.style.height = `${-100}%`;
            bottomOverlay.style.height = `${0}%`;
            
        }
       else {
        topOverlay.style.height = `${0}%`;
        bottomOverlay.style.height = `${0}%`;
      }
      if (onScrollUpdate) {
        onScrollUpdate(mappedScrollValue); // Call the callback function
      }
    }
  }

  onMount(() => {
    if (innerContainer) {
      innerContainer.addEventListener("scroll", handleInnerScroll);
      maxScrollTop = innerContainer.scrollHeight - innerContainer.clientHeight;
      //store the original scroll position here
    }

    if (videoContainer && innerContainer) {
      innerContainer.style.height = `${videoContainer.clientHeight}px`;
    }

    // Set up the interval to check for changes
    interval = setInterval(() => {
      if (mappedScrollValue != 0 && !resettingValue) {
        if (mappedScrollValue === previousMappedScrollValue) {
          sameCounter += 1;
          if (sameCounter == 1) {
            resettingValue = true;
            resetValue();
          }
        } else {
          previousMappedScrollValue = mappedScrollValue; // Update previous value
          sameCounter = 0;
        }
      }
    }, 100); // Check every 100 milliseconds

    return () => {
      if (innerContainer) {
        innerContainer.removeEventListener("scroll", handleInnerScroll);
      }
      clearInterval(interval); // Clear the interval on component destroy
    };
  });

  onMount(() => {
    if (innerContainer && middleElement) {
      const containerHeight = innerContainer.clientHeight;
      const elementPosition = middleElement.offsetTop;
      scrollPosition =
        elementPosition - containerHeight / 2 + middleElement.clientHeight / 2;

      innerContainer.scrollTop = scrollPosition;

      handleInnerScroll();
    }
  });

  async function resetValue() {
    console.log("Resetting value");

    let greaterThanZero = false;
    if (mappedScrollValue > 0) {
      greaterThanZero = true;
    }
    resetInterval = setInterval(async () => {
        if (mappedScrollValue >= 100 || mappedScrollValue <= -100){
            console.log("loading new video")
            resettingValue = false;
          clearInterval(resetInterval);
          console.log("getting video data")
            let videoData = await onVideoUpdate()
            
           
            setUpNewVideo(videoData)
          
          
            return;
        }
        else {
            onVideoUpdate("none")
        }

       
      if (greaterThanZero) {
        console.log("We resetting!!!");
        
        if (mappedScrollValue > 0) {
          mappedScrollValue -= 1;
          bottomOverlay.style.height = `${mappedScrollValue}%`;

          if (innerScrollTop > initialScrollTop) {
            innerContainer.scrollTop -= 5;
          } else if (innerScrollTop <= initialScrollTop) {
            innerContainer.scrollTop = initialScrollTop;
          }
        } else {
          mappedScrollValue = 0;
          bottomOverlay.style.height = `${0}%`;
          innerContainer.scrollTop = initialScrollTop;
          resettingValue = false;
          clearInterval(resetInterval);
          return;
        }
      } else if (!greaterThanZero) {
        console.log("We resetting less than zero!!!");
        if (mappedScrollValue < 0) {
          mappedScrollValue += 1;
          bottomOverlay.style.height = `${mappedScrollValue}%`;

          if (innerScrollTop < initialScrollTop) {
            innerContainer.scrollTop += 5;
          } else if (innerScrollTop >= initialScrollTop) {
            innerContainer.scrollTop = initialScrollTop;
          }
        } else {
          mappedScrollValue = 0;
          bottomOverlay.style.height = `${0}%`;
          innerContainer.scrollTop = initialScrollTop;
          resettingValue = false;
          clearInterval(resetInterval);
          return;
        }
      }
    
      if (onScrollUpdate) {
        onScrollUpdate(mappedScrollValue);
      }
    }, 2);
  }

  function mapNumRange(num, inMin, inMax, outMin, outMax) {
    return ((num - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  }
</script>

<div class="container">
  <div class="video-container" bind:this={videoContainer}>
    <div class="top-overlay" bind:this={topOverlay}></div>
    <div class="video-container-inner" bind:this={innerContainer}>
      <div class="scroll-filler">
        {#each Array(20) as _, i}
          <p>Scrollable content {i + 1}</p>
        {/each}
      </div>
      <p class="scroll-number" bind:this={middleElement}>
        Inner Scroll Top: {innerScrollTop}
      </p>
      <div class="scroll-filler">
        {#each Array(20) as _, i}
          <p>Scrollable content {i + 11}</p>
        {/each}
      </div>
    </div>
    <div class="bottom-overlay" bind:this={bottomOverlay}></div>
  </div>
</div>

<style>
  .scroll-number {
    z-index: 0;
    visibility: hidden;
  }

  .top-overlay {
    top: 0;
  }
  .bottom-overlay {
    bottom: 0;
  }

  .bottom-overlay,
  .top-overlay {
    position: absolute;
    width: 100%;
    height: 0%; /* Adjust height as needed */
    background-color: rgba(148, 148, 148, 0.512); /* White opaque */
    pointer-events: none;
    z-index: 100;
  }

  .scroll-filler {
    visibility: hidden;
  }
  .video-container-inner {
    height: 100%;
    background-color: green;
    overflow-y: auto;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
  }

  .video-container-inner::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }

  .video-container {
    width: 350px;
    height: calc(350px * 16 / 9);
    position: relative;
    outline: 4px solid black;
    border-radius: 10px;
    overflow: hidden;
  }

  .container {
    display: flex;
    align-items: center;
    padding-left: 20px;
    position: fixed;
    width: 100%;
    height: 100vh;
  }
</style>
