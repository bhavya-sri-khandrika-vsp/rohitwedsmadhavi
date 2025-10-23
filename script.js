document.getElementById('exploreBtn')?.addEventListener('click', () => {
  // Smooth scroll to the Events section
  const eventsSection = document.querySelector('#events');
  if (eventsSection) {
    eventsSection.scrollIntoView({ behavior: 'smooth' });
  }
});

// Function to scroll to contact section (for RSVP card)
function scrollToContact() {
  const contactSection = document.querySelector('#contact');
  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth' });
  }
}

// Background Music Functionality
document.addEventListener('DOMContentLoaded', function() {
  const backgroundMusic = document.getElementById('background-music');
  let musicPlaying = false;

  // Function to play background music
  function playBackgroundMusic() {
    if (backgroundMusic && !musicPlaying) {
      backgroundMusic.play().then(() => {
        musicPlaying = true;
        console.log('Background music started');
      }).catch(error => {
        console.log('Background music autoplay failed:', error);
        // Add a user interaction listener to start music
        document.addEventListener('click', function startMusicOnClick() {
          backgroundMusic.play().then(() => {
            musicPlaying = true;
            console.log('Background music started after user interaction');
          }).catch(console.error);
          document.removeEventListener('click', startMusicOnClick);
        }, { once: true });
      });
    }
  }

  // Function to pause background music
  function pauseBackgroundMusic() {
    if (backgroundMusic && musicPlaying) {
      backgroundMusic.pause();
      musicPlaying = false;
      console.log('Background music paused');
    }
  }

  // Function to resume background music
  function resumeBackgroundMusic() {
    if (backgroundMusic && !musicPlaying) {
      backgroundMusic.play().then(() => {
        musicPlaying = true;
        console.log('Background music resumed');
      }).catch(console.error);
    }
  }

  // Start background music when page loads
  playBackgroundMusic();

  // Monitor main wedding video
  const weddingVideo = document.getElementById('wedding-invite-video');
  if (weddingVideo) {
    weddingVideo.addEventListener('play', pauseBackgroundMusic);
    weddingVideo.addEventListener('pause', resumeBackgroundMusic);
    weddingVideo.addEventListener('ended', resumeBackgroundMusic);
  }

  // Monitor all video elements and iframes
  const allVideos = document.querySelectorAll('video');
  const allIframes = document.querySelectorAll('iframe');

  // Add listeners to all video elements
  allVideos.forEach(video => {
    video.addEventListener('play', pauseBackgroundMusic);
    video.addEventListener('pause', resumeBackgroundMusic);
    video.addEventListener('ended', resumeBackgroundMusic);
  });

  // Add listeners to iframes (for embedded videos)
  allIframes.forEach(iframe => {
    // For YouTube/Vimeo iframes, we'll use a different approach
    iframe.addEventListener('load', function() {
      // Try to detect if iframe content is playing
      // This is limited due to cross-origin restrictions
      iframe.contentWindow?.addEventListener?.('message', function(event) {
        if (event.data && typeof event.data === 'string') {
          if (event.data.includes('video-play') || event.data.includes('play')) {
            pauseBackgroundMusic();
          } else if (event.data.includes('video-pause') || event.data.includes('pause')) {
            resumeBackgroundMusic();
          }
        }
      });
    });
  });

  // Fallback: Pause music when user interacts with iframe areas
  allIframes.forEach(iframe => {
    iframe.addEventListener('mouseenter', function() {
      // Pause music when hovering over video iframes as a fallback
      setTimeout(pauseBackgroundMusic, 1000);
    });
  });

// Gallery Filter Functionality
  const filterButtons = document.querySelectorAll('.gallery-filter');
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  // Function to update button styles
  function updateButtonStyles(activeButton) {
    filterButtons.forEach(btn => {
      if (btn === activeButton) {
        // Active button styles
        btn.className = 'gallery-filter px-6 py-3 rounded-full font-medium transition-all duration-300 cursor-pointer whitespace-nowrap bg-gradient-to-r from-yellow-600 to-yellow-500 text-white shadow-lg';
      } else {
        // Inactive button styles
        btn.className = 'gallery-filter px-6 py-3 rounded-full font-medium transition-all duration-300 cursor-pointer whitespace-nowrap bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg';
      }
    });
  }
  
  // Function to filter gallery items
  function filterGallery(category) {
    galleryItems.forEach((item, index) => {
      const itemCategory = item.getAttribute('data-category');
      
      if (category === 'all' || itemCategory === category) {
        // Show item with animation
        item.style.display = 'block';
        item.style.opacity = '0';
        item.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
          item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        }, index * 100); // Staggered animation
      } else {
        // Hide item with animation
        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        item.style.opacity = '0';
        item.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
          item.style.display = 'none';
        }, 300);
      }
    });
  }
  
  // Add click event listeners to filter buttons
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      const filterValue = this.getAttribute('data-filter');
      
      // Update button styles
      updateButtonStyles(this);
      
      // Filter gallery items
      filterGallery(filterValue);
    });
  });
  
  // Initialize with all photos visible
  filterGallery('all');
});

// Lightbox Functionality
document.addEventListener('DOMContentLoaded', function() {
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxBackdrop = document.querySelector('.lightbox-backdrop');
  const galleryImages = document.querySelectorAll('.gallery-item img');
  
  // Function to open lightbox
  function openLightbox(imageSrc, imageAlt) {
    lightboxImage.src = imageSrc;
    lightboxImage.alt = imageAlt || 'Gallery Image';
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }
  
  // Function to close lightbox
  function closeLightbox() {
    lightboxModal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
    
    // Clear image src after animation completes
    setTimeout(() => {
      if (!lightboxModal.classList.contains('active')) {
        lightboxImage.src = '';
      }
    }, 300);
  }
  
  // Add click event listeners to gallery images
  galleryImages.forEach(image => {
    // Create zoom icon overlay for each image
    const imageContainer = image.parentElement;
    imageContainer.style.position = 'relative';
    imageContainer.style.overflow = 'hidden';
    
    // Create zoom overlay
    const zoomOverlay = document.createElement('div');
    zoomOverlay.className = 'zoom-overlay';
    zoomOverlay.innerHTML = '<i class="fas fa-search-plus"></i>';
    zoomOverlay.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
      cursor: pointer;
      z-index: 10;
    `;
    
    const zoomIcon = zoomOverlay.querySelector('i');
    zoomIcon.style.cssText = `
      color: white;
      font-size: 2rem;
      transform: scale(0.8);
      transition: transform 0.3s ease;
    `;
    
    imageContainer.appendChild(zoomOverlay);
    
    // Show/hide zoom overlay on hover
    imageContainer.addEventListener('mouseenter', () => {
      zoomOverlay.style.opacity = '1';
      zoomIcon.style.transform = 'scale(1)';
    });
    
    imageContainer.addEventListener('mouseleave', () => {
      zoomOverlay.style.opacity = '0';
      zoomIcon.style.transform = 'scale(0.8)';
    });
    
    // Open lightbox when zoom overlay is clicked
    zoomOverlay.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openLightbox(image.src, image.alt);
    });
    
    // Also allow clicking directly on the image
    image.addEventListener('click', (e) => {
      e.preventDefault();
      openLightbox(image.src, image.alt);
    });
  });
  
  // Close lightbox when close button is clicked
  lightboxClose.addEventListener('click', closeLightbox);
  
  // Close lightbox when backdrop is clicked
  lightboxBackdrop.addEventListener('click', closeLightbox);
  
  // Close lightbox when Escape key is pressed
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
      closeLightbox();
    }
  });
  
  // Prevent lightbox content from closing when clicked
  document.querySelector('.lightbox-content').addEventListener('click', (e) => {
    e.stopPropagation();
  });
});

// Video Controls and Autoplay Functionality
document.addEventListener('DOMContentLoaded', function() {
  const video = document.getElementById('wedding-invite-video');
  const playPauseBtn = document.getElementById('play-pause-btn');
  const replayBtn = document.getElementById('replay-btn');
  const forwardBtn = document.getElementById('forward-btn');
  const muteBtn = document.getElementById('mute-btn');
  const currentTimeSpan = document.getElementById('current-time');
  const durationSpan = document.getElementById('duration');
  const progressBar = document.getElementById('progress-bar');
  const customControls = document.getElementById('custom-video-controls');
  
  if (video) {
    // Format time helper function
    function formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
    
    // Update video duration when metadata loads
    video.addEventListener('loadedmetadata', function() {
      durationSpan.textContent = formatTime(video.duration);
    });
    
    // Update progress and current time
    video.addEventListener('timeupdate', function() {
      const progress = (video.currentTime / video.duration) * 100;
      progressBar.style.width = progress + '%';
      currentTimeSpan.textContent = formatTime(video.currentTime);
    });
    
    // Play/Pause button functionality
    playPauseBtn.addEventListener('click', function() {
      if (video.paused) {
        video.play();
        playPauseBtn.innerHTML = '<i class="fas fa-pause text-xl"></i>';
      } else {
        video.pause();
        playPauseBtn.innerHTML = '<i class="fas fa-play text-xl"></i>';
      }
    });
    
    // Update play/pause button when video state changes
    video.addEventListener('play', function() {
      playPauseBtn.innerHTML = '<i class="fas fa-pause text-xl"></i>';
    });
    
    video.addEventListener('pause', function() {
      playPauseBtn.innerHTML = '<i class="fas fa-play text-xl"></i>';
    });
    
    // Replay button functionality
    replayBtn.addEventListener('click', function() {
      video.currentTime = 0;
      video.play();
      playPauseBtn.innerHTML = '<i class="fas fa-pause text-xl"></i>';
    });
    
    // Forward 5 seconds button functionality
    forwardBtn.addEventListener('click', function() {
      video.currentTime = Math.min(video.currentTime + 5, video.duration);
    });
    
    // Mute/Unmute button functionality
    muteBtn.addEventListener('click', function() {
      // video.muted = !video.muted;
      // if (video.muted) {
      //   muteBtn.innerHTML = '<i class="fas fa-volume-mute text-lg"></i>';
      // } else {
      //   muteBtn.innerHTML = '<i class="fas fa-volume-up text-lg"></i>';
      // }
    });
    
    // Hide/Show custom controls on hover
    const videoContainer = video.parentElement;
    let controlsTimeout;
    
    function showControls() {
      customControls.style.opacity = '1';
      clearTimeout(controlsTimeout);
      controlsTimeout = setTimeout(() => {
        if (!video.paused) {
          customControls.style.opacity = '0';
        }
      }, 3000);
    }
    
    function hideControls() {
      if (!video.paused) {
        customControls.style.opacity = '0';
      }
    }
    
    videoContainer.addEventListener('mouseenter', showControls);
    videoContainer.addEventListener('mousemove', showControls);
    videoContainer.addEventListener('mouseleave', hideControls);
    
    // Show controls when video is paused
    video.addEventListener('pause', () => {
      customControls.style.opacity = '1';
    });
    
    // Create intersection observer for autoplay on first scroll
    let hasAutoPlayed = false;
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAutoPlayed) {
          // Autoplay on first scroll to section
          video.play().then(() => {
            hasAutoPlayed = true;
            console.log('Video autoplay started on first scroll');
          }).catch(error => {
            console.log('Video autoplay failed:', error);
            // Show controls if autoplay fails
            customControls.style.opacity = '1';
          });
        } else if (!entry.isIntersecting && !video.paused) {
          // Pause video when scrolled out of view
          video.pause();
        }
      });
    }, {
      threshold: 0.3, // Trigger when 30% of video is visible
      rootMargin: '0px 0px -100px 0px' // Add some margin for better UX
    });
    
    // Mark user interaction to prevent auto-pause when user is controlling
    let userInteracted = false;
    [playPauseBtn, replayBtn, forwardBtn].forEach(btn => {
      btn.addEventListener('click', () => {
        userInteracted = true;
        // Stop observing after user interaction to give them full control
        videoObserver.unobserve(video);
      });
    });
    
    // Start observing the video for autoplay
    videoObserver.observe(video);
    
    // Ensure video starts muted for autoplay compliance
    video.muted = true;
  }
});

// Digital Wedding Invite Interactive Features
document.addEventListener('DOMContentLoaded', function() {
  // Play/Pause Video functionality
  const playVideoBtn = document.getElementById('playVideoBtn');
  const inviteVideo = document.querySelector('#wedding-invite-video');
  
  if (playVideoBtn && inviteVideo) {
    playVideoBtn.addEventListener('click', function() {
      if (inviteVideo.paused) {
        inviteVideo.play();
        playVideoBtn.innerHTML = '<i class="fas fa-pause mr-2"></i>Pause Video';
      } else {
        inviteVideo.pause();
        playVideoBtn.innerHTML = '<i class="fas fa-play mr-2"></i>Play Video';
      }
    });
    
    // Reset button text when video ends
    inviteVideo.addEventListener('ended', function() {
      playVideoBtn.innerHTML = '<i class="fas fa-play mr-2"></i>Play Video';
    });
  }
  
  // Share functionality
  const shareBtn = document.getElementById('shareBtn');
  if (shareBtn) {
    shareBtn.addEventListener('click', function() {
      if (navigator.share) {
        navigator.share({
          title: 'Wedding Invitation',
          text: 'You are cordially invited to our wedding celebration!',
          url: window.location.href
        }).catch(console.error);
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
          const originalText = shareBtn.innerHTML;
          shareBtn.innerHTML = '<i class="fas fa-check mr-2"></i>Link Copied!';
          setTimeout(() => {
            shareBtn.innerHTML = originalText;
          }, 2000);
        });
      }
    });
  }
  
  // Download functionality
  const downloadBtn = document.getElementById('downloadBtn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', function() {
      // Create a temporary link to download the video
      const link = document.createElement('a');
      link.href = 'assets/GroomWeddingInvite.mp4';
      link.download = 'Wedding_Invitation_Video.mp4';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Visual feedback
      const originalText = downloadBtn.innerHTML;
      downloadBtn.innerHTML = '<i class="fas fa-check mr-2"></i>Downloaded!';
      setTimeout(() => {
        downloadBtn.innerHTML = originalText;
      }, 2000);
    });
  }
  
  // RSVP functionality
  const rsvpBtn = document.getElementById('rsvpBtn');
  if (rsvpBtn) {
    rsvpBtn.addEventListener('click', function() {
      // You can replace this with actual RSVP form or redirect
      alert('Thank you for your interest! Please contact us directly for RSVP.');
    });
  }
  
  // Social sharing buttons
  const socialButtons = {
    whatsapp: document.getElementById('shareWhatsApp'),
    facebook: document.getElementById('shareFacebook'),
    twitter: document.getElementById('shareTwitter'),
    instagram: document.getElementById('shareInstagram')
  };
  
  const shareText = encodeURIComponent('You are cordially invited to our wedding celebration! 💕');
  const shareUrl = encodeURIComponent(window.location.href);
  
  if (socialButtons.whatsapp) {
    socialButtons.whatsapp.addEventListener('click', function() {
      window.open(`https://wa.me/?text=${shareText} ${shareUrl}`, '_blank');
    });
  }
  
  if (socialButtons.facebook) {
    socialButtons.facebook.addEventListener('click', function() {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank');
    });
  }
  
  if (socialButtons.twitter) {
    socialButtons.twitter.addEventListener('click', function() {
      window.open(`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`, '_blank');
    });
  }
  
  if (socialButtons.instagram) {
    socialButtons.instagram.addEventListener('click', function() {
      // Instagram doesn't support direct sharing via URL, so we'll copy to clipboard
      navigator.clipboard.writeText(`${decodeURIComponent(shareText)} ${window.location.href}`).then(() => {
        alert('Link copied to clipboard! You can now paste it on Instagram.');
      });
    });
  }
  
  // Animated counters for guest statistics
  function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
      start += increment;
      if (start < target) {
        element.textContent = Math.floor(start);
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target;
      }
    }
    
    updateCounter();
  }
  
  // Initialize counters when they come into view
  const counters = document.querySelectorAll('.counter-number');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute('data-target'));
        animateCounter(entry.target, target);
        counterObserver.unobserve(entry.target);
      }
    });
  });
  
  counters.forEach(counter => {
    counterObserver.observe(counter);
  });

  // Engagement video autoplay on scroll
  const engagementVideo = document.getElementById('engagement-video-autoplay');
  const videoFallback = document.getElementById('video-fallback');
  let hasAutoPlayed = false;

  if (engagementVideo) {
    // Check if video loads successfully after a timeout
    setTimeout(() => {
      if (engagementVideo.style.display !== 'none' && videoFallback) {
        // Video seems to be loading, hide fallback
        videoFallback.style.display = 'none';
      }
    }, 3000);

    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAutoPlayed && engagementVideo.style.display !== 'none') {
          // Try to trigger autoplay by reloading the iframe with autoplay parameter
          const currentSrc = engagementVideo.src;
          // if (!currentSrc.includes('autoplay=1')) {
          //   // Handle both cases: with and without existing parameters
          //   const separator = currentSrc.includes('?') ? '&' : '?';
          //   engagementVideo.src = currentSrc + separator + 'autoplay=1';
          //   hasAutoPlayed = true;
          //   videoObserver.unobserve(engagementVideo);
          // }
        }
      });
    }, {
      threshold: 0.5 // Trigger when 50% of the video is visible
    });

    videoObserver.observe(engagementVideo);
  }
});

// Floating Controls Functionality
document.addEventListener('DOMContentLoaded', function() {
  const floatingMainBtn = document.getElementById('floating-main-btn');
  const floatingMenu = document.getElementById('floating-menu');
  const scrollTopBtn = document.getElementById('scroll-top-btn');
  const musicToggleBtn = document.getElementById('music-toggle-btn');
  const musicIcon = document.getElementById('music-icon');
  const volumeDownBtn = document.getElementById('volume-down-btn');
  const volumeUpBtn = document.getElementById('volume-up-btn');
  const backgroundMusic = document.getElementById('background-music');

  let menuOpen = false;
  let currentVolume = 0.5; // Default volume (50%)

  // Set initial volume
  if (backgroundMusic) {
    backgroundMusic.volume = currentVolume;
  }

  // Toggle floating menu
  floatingMainBtn?.addEventListener('click', function() {
    menuOpen = !menuOpen;
    
    if (menuOpen) {
      floatingMainBtn.classList.add('active');
      floatingMenu.classList.add('active');
    } else {
      floatingMainBtn.classList.remove('active');
      floatingMenu.classList.remove('active');
    }
  });

  // Close menu when clicking outside
  document.addEventListener('click', function(event) {
    if (!event.target.closest('.floating-controls') && menuOpen) {
      menuOpen = false;
      floatingMainBtn.classList.remove('active');
      floatingMenu.classList.remove('active');
    }
  });

  // Scroll to top functionality
  scrollTopBtn?.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Close menu after action
    setTimeout(() => {
      menuOpen = false;
      floatingMainBtn.classList.remove('active');
      floatingMenu.classList.remove('active');
    }, 300);
  });

  // Music toggle functionality
  musicToggleBtn?.addEventListener('click', function() {
    if (!backgroundMusic) return;

    if (backgroundMusic.paused) {
      backgroundMusic.play().then(() => {
        musicIcon.className = 'ri-pause-line';
        // musicIcon.textContent = '⏸';
        musicToggleBtn.classList.remove('paused');
        console.log('Background music resumed via floating button');
      }).catch(error => {
        console.error('Failed to play music:', error);
      });
    } else {
      backgroundMusic.pause();
      musicIcon.className = 'ri-play-line';
      // musicIcon.textContent = '▶';
      musicToggleBtn.classList.add('paused');
      console.log('Background music paused via floating button');
    }
  });

  // Volume down functionality
  volumeDownBtn?.addEventListener('click', function() {
    if (!backgroundMusic) return;

    currentVolume = Math.max(0, currentVolume - 0.1);
    backgroundMusic.volume = currentVolume;
    
    console.log('Volume decreased to:', Math.round(currentVolume * 100) + '%');
    
    // Visual feedback
    volumeDownBtn.style.transform = 'scale(0.9)';
    setTimeout(() => {
      volumeDownBtn.style.transform = 'scale(1)';
    }, 150);
  });

  // Volume up functionality
  volumeUpBtn?.addEventListener('click', function() {
    if (!backgroundMusic) return;

    currentVolume = Math.min(1, currentVolume + 0.1);
    backgroundMusic.volume = currentVolume;
    
    console.log('Volume increased to:', Math.round(currentVolume * 100) + '%');
    
    // Visual feedback
    volumeUpBtn.style.transform = 'scale(0.9)';
    setTimeout(() => {
      volumeUpBtn.style.transform = 'scale(1)';
    }, 150);
  });

  // Update music icon based on music state
  if (backgroundMusic) {
    backgroundMusic.addEventListener('play', function() {
      musicIcon.className = 'ri-pause-line';
      musicToggleBtn.classList.remove('paused');
    });

    backgroundMusic.addEventListener('pause', function() {
      musicIcon.className = 'ri-play-line';
      musicToggleBtn.classList.add('paused');
    });

    // Set initial icon state
    if (backgroundMusic.paused) {
      musicIcon.className = 'ri-play-line';
      musicToggleBtn.classList.add('paused');
    } else {
      musicIcon.className = 'ri-pause-line';
      musicToggleBtn.classList.remove('paused');
    }
  }

  // Show/hide floating button based on scroll position
  let lastScrollTop = 0;
  const floatingControls = document.getElementById('floating-controls');
  
  window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Show button when scrolled down more than 100px
    if (scrollTop > 100) {
      floatingControls.style.opacity = '1';
      floatingControls.style.visibility = 'visible';
    } else {
      floatingControls.style.opacity = '0.7';
    }
    
    lastScrollTop = scrollTop;
  });

  // Initial state - hide if at top
  if (window.pageYOffset <= 100) {
    floatingControls.style.opacity = '0.7';
  }
});

// Wedding & Reception Countdown Timer
document.addEventListener('DOMContentLoaded', function() {
  // Set the wedding date - October 30, 2025 at 10:00 AM
  const weddingDate = new Date('October 30, 2025 10:00:00').getTime();
  // Set the reception date - November 1, 2025 at 6:00 PM
  const receptionDate = new Date('November 1, 2025 18:00:00').getTime();
  let countdownInterval;
  
  function updateCountdown() {
    const now = new Date().getTime();
    const weddingDistance = weddingDate - now;
    const receptionDistance = receptionDate - now;
    
    let targetDate, targetDistance, eventType, eventTitle, eventDate, eventTime;
    
    // Determine which event to countdown to
    if (weddingDistance > 0) {
      // Wedding hasn't happened yet
      targetDate = weddingDate;
      targetDistance = weddingDistance;
      eventType = 'wedding';
      eventTitle = '🎉 Countdown to Our Big Day! 💕';
      eventDate = 'October 30, 2025';
      eventTime = 'at 10:00 AM';
    } else if (receptionDistance > 0) {
      // Wedding is over, but reception hasn't happened yet
      targetDate = receptionDate;
      targetDistance = receptionDistance;
      eventType = 'reception';
      eventTitle = '🥂 Countdown to Our Reception! 🎊';
      eventDate = 'November 1, 2025';
      eventTime = 'at 6:00 PM';
    } else {
      // Both events are over
      targetDistance = -1;
      eventType = 'finished';
    }
    
    // Update the title and date display
    const titleElement = document.querySelector('#wedding-countdown').previousElementSibling.querySelector('h5');
    const dateDisplayContainer = document.querySelector('.text-center.bg-white.rounded-xl');
    
    if (titleElement && eventType !== 'finished') {
      titleElement.textContent = eventTitle;
    }
    
    if (dateDisplayContainer && eventType !== 'finished') {
      const eventLabel = eventType === 'wedding' ? 'Wedding Day' : 'Reception Day';
      dateDisplayContainer.innerHTML = `
        <div class="text-lg font-semibold text-gray-800">${eventLabel}</div>
        <div class="text-2xl font-bold text-rose-600">${eventDate}</div>
        <div class="text-sm text-gray-600">${eventTime}</div>
      `;
    }
    
    if (targetDistance > 0) {
      // Calculate time units
      const days = Math.floor(targetDistance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((targetDistance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((targetDistance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((targetDistance % (1000 * 60)) / 1000);
      
      // Update the countdown display
      const daysElement = document.getElementById('days');
      const hoursElement = document.getElementById('hours');
      const minutesElement = document.getElementById('minutes');
      const secondsElement = document.getElementById('seconds');
      
      if (daysElement) daysElement.textContent = days.toString().padStart(2, '0');
      if (hoursElement) hoursElement.textContent = hours.toString().padStart(2, '0');
      if (minutesElement) minutesElement.textContent = minutes.toString().padStart(2, '0');
      if (secondsElement) secondsElement.textContent = seconds.toString().padStart(2, '0');
      
      // Add animation effect to seconds
      if (secondsElement) {
        secondsElement.parentElement.style.transform = 'scale(1.05)';
        setTimeout(() => {
          secondsElement.parentElement.style.transform = 'scale(1)';
        }, 200);
      }
    } else {
      // Both events are finished
      if (countdownInterval) clearInterval(countdownInterval);
      
      const countdownContainer = document.getElementById('wedding-countdown');
      if (countdownContainer) {
        countdownContainer.innerHTML = `
          <div class="col-span-4 text-center">
            <div class="text-4xl font-bold text-rose-600 mb-2">🎉 Thank You for Celebrating With Us! 🎉</div>
            <div class="text-lg text-gray-700">Our wedding and reception were magical!</div>
            <div class="text-sm text-gray-500 mt-2">October 30, 2025 - Wedding Day | November 1, 2025 - Reception</div>
          </div>
        `;
      }
      
      if (titleElement) {
        titleElement.textContent = '💕 Our Celebration is Complete! 💕';
      }
    }
  }
  
  // Update countdown immediately and then every second
  updateCountdown();
  countdownInterval = setInterval(updateCountdown, 1000);
});

// Wedding Wishes Management System
document.addEventListener('DOMContentLoaded', function() {
  const WISHES_STORAGE_KEY = 'wedding_wishes';
  const WISHES_PER_PAGE = 3;
  let currentWishesPage = 1;
  let allWishes = [];

  // Default wishes (fallback if no wishes in localStorage)
  const defaultWishes = [
    {
      id: 1,
      name: "Satya Sanofi",
      message: "I am really happy that she got the best one. I hope you take care of each other and have a happy and harmonious life forever❤️❤️❤️",
      timestamp: Date.now() - 86400000, // 1 day ago
      initials: "SS",
      color: "from-pink-400 to-red-400"
    },
    {
      id: 2,
      name: "Srilatha",
      message: "May your marriage be blessed with endless joy, prosperity, and togetherness. You both make such a perfect couple!",
      timestamp: Date.now() - 172800000, // 2 days ago
      initials: "SL",
      color: "from-purple-400 to-pink-400"
    },
    {
      id: 3,
      name: "Bhavya Sri",
      message: "Congratulations on finding your perfect match! May your love story continue to inspire everyone around you.",
      timestamp: Date.now() - 259200000, // 3 days ago
      initials: "BS",
      color: "from-blue-400 to-purple-400"
    }
  ];

  // Color options for wish avatars
  const colorOptions = [
    "from-pink-400 to-red-400",
    "from-purple-400 to-pink-400",
    "from-blue-400 to-purple-400",
    "from-green-400 to-blue-400",
    "from-yellow-400 to-orange-400",
    "from-indigo-400 to-purple-400",
    "from-red-400 to-pink-400",
    "from-teal-400 to-green-400"
  ];

  // Load wishes from localStorage or use defaults
  function loadWishes() {
    const savedWishes = localStorage.getItem(WISHES_STORAGE_KEY);
    if (savedWishes) {
      allWishes = JSON.parse(savedWishes);
    } else {
      allWishes = [...defaultWishes];
      saveWishes();
    }
    // Sort by timestamp (newest first)
    allWishes.sort((a, b) => b.timestamp - a.timestamp);
  }

  // Save wishes to localStorage
  function saveWishes() {
    localStorage.setItem(WISHES_STORAGE_KEY, JSON.stringify(allWishes));
  }

  // Generate initials from name
  function generateInitials(name) {
    return name.split(' ').map(word => word.charAt(0).toUpperCase()).join('').substring(0, 2);
  }

  // Get random color for avatar
  function getRandomColor() {
    return colorOptions[Math.floor(Math.random() * colorOptions.length)];
  }

  // Create wish HTML element
  function createWishElement(wish, animationDelay = 0) {
    return `
      <div class="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl wish-item" 
           style="animation-delay: ${animationDelay}ms" data-wish-id="${wish.id}">
        <div class="flex items-start space-x-4">
          <div class="w-12 h-12 bg-gradient-to-r ${wish.color} rounded-full flex items-center justify-center flex-shrink-0">
            <span class="text-white font-bold text-sm">${wish.initials}</span>
          </div>
          <div class="flex-1">
            <h4 class="font-semibold text-gray-800 mb-2">${wish.name}</h4>
            <p class="text-gray-600 leading-relaxed">${wish.message}</p>
            <div class="text-xs text-gray-400 mt-2">${formatTimestamp(wish.timestamp)}</div>
          </div>
        </div>
      </div>
    `;
  }

  // Format timestamp for display
  function formatTimestamp(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }

  // Display wishes (top 3 recent by default)
  function displayWishes(showAll = false) {
    const wishesContainer = document.querySelector('.lg\\:col-span-2 .space-y-6');
    if (!wishesContainer) return;

    const wishesToShow = showAll ? allWishes : allWishes.slice(0, WISHES_PER_PAGE);
    
    wishesContainer.innerHTML = wishesToShow.map((wish, index) => 
      createWishElement(wish, index * 100)
    ).join('');

    // Update Load More button visibility
    updateLoadMoreButton(showAll);
  }

  // Update Load More button
  function updateLoadMoreButton(showingAll) {
    const loadMoreContainer = document.querySelector('.text-center.mt-8');
    const loadMoreBtn = loadMoreContainer?.querySelector('button');
    
    if (!loadMoreBtn) return;

    if (allWishes.length <= WISHES_PER_PAGE) {
      loadMoreContainer.style.display = 'none';
    } else {
      loadMoreContainer.style.display = 'block';
      
      if (showingAll) {
        loadMoreBtn.innerHTML = '<i class="ri-arrow-up-line mr-2"></i>Show Less';
        loadMoreBtn.onclick = () => displayWishes(false);
      } else {
        loadMoreBtn.innerHTML = '<i class="ri-refresh-line mr-2"></i>Load More Wishes';
        loadMoreBtn.onclick = () => displayWishes(true);
      }
    }
  }

  // Add new wish
  function addWish(name, message) {
    const newWish = {
      id: Date.now(),
      name: name.trim(),
      message: message.trim(),
      timestamp: Date.now(),
      initials: generateInitials(name.trim()),
      color: getRandomColor()
    };

    allWishes.unshift(newWish); // Add to beginning (most recent)
    saveWishes();
    displayWishes(false); // Show only top 3 with new wish

    // Show success feedback
    showSuccessMessage();
  }

  // Show success message
  function showSuccessMessage() {
    const submitBtn = document.querySelector('#wedding-wishes button[type="submit"]');
    if (!submitBtn) return;

    const originalContent = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="ri-check-line mr-2"></i>Wish Sent Successfully!';
    submitBtn.disabled = true;
    submitBtn.classList.add('bg-green-500', 'hover:bg-green-600');
    submitBtn.classList.remove('bg-gradient-to-r', 'from-yellow-600', 'to-yellow-500', 'hover:from-yellow-700', 'hover:to-yellow-600');

    setTimeout(() => {
      submitBtn.innerHTML = originalContent;
      submitBtn.disabled = false;
      submitBtn.classList.remove('bg-green-500', 'hover:bg-green-600');
      submitBtn.classList.add('bg-gradient-to-r', 'from-yellow-600', 'to-yellow-500', 'hover:from-yellow-700', 'hover:to-yellow-600');
    }, 3000);
  }

  // Handle form submission
  function handleFormSubmission() {
    const form = document.getElementById('wedding-wishes');
    if (!form) return;

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = new FormData(form);
      const name = formData.get('name');
      const message = formData.get('message');

      if (name && message) {
        addWish(name, message);
        form.reset();
        
        // Reset character counter
        const charCounter = form.querySelector('.text-right.text-xs.text-gray-500');
        if (charCounter) {
          charCounter.textContent = '0/500 characters';
        }
      }
    });

    // Character counter for textarea
    const textarea = form.querySelector('textarea[name="message"]');
    const charCounter = form.querySelector('.text-right.text-xs.text-gray-500');
    
    if (textarea && charCounter) {
      textarea.addEventListener('input', function() {
        const length = this.value.length;
        charCounter.textContent = `${length}/500 characters`;
        
        if (length > 450) {
          charCounter.classList.add('text-red-500');
          charCounter.classList.remove('text-gray-500');
        } else {
          charCounter.classList.remove('text-red-500');
          charCounter.classList.add('text-gray-500');
        }
      });
    }
  }

  // Initialize wishes system
  function initWishesSystem() {
    loadWishes();
    displayWishes(false); // Show only top 3 initially
    handleFormSubmission();
  }

  // Start the wishes system
  initWishesSystem();
  
  // Initialize emoji picker
  initializeEmojiPicker();
});

// Emoji Picker Functionality
function initializeEmojiPicker() {
  const emojiBtn = document.getElementById('emoji-btn');
  const emojiPicker = document.getElementById('emoji-picker');
  const textarea = document.getElementById('wishes-textarea');
  const emojiItems = document.querySelectorAll('.emoji-item');

  if (!emojiBtn || !emojiPicker || !textarea) return;

  // Toggle emoji picker visibility
  emojiBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    emojiPicker.classList.toggle('hidden');
    
    // Add a subtle animation effect
    if (!emojiPicker.classList.contains('hidden')) {
      emojiPicker.style.opacity = '0';
      emojiPicker.style.transform = 'translateY(10px)';
      setTimeout(() => {
        emojiPicker.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
        emojiPicker.style.opacity = '1';
        emojiPicker.style.transform = 'translateY(0)';
      }, 10);
    }
  });

  // Handle emoji selection
  emojiItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const emoji = item.getAttribute('data-emoji');
      
      // Insert emoji at cursor position
      const cursorPosition = textarea.selectionStart;
      const textBefore = textarea.value.substring(0, cursorPosition);
      const textAfter = textarea.value.substring(textarea.selectionEnd);
      
      // Check if adding emoji would exceed character limit
      const newText = textBefore + emoji + textAfter;
      if (newText.length <= 500) {
        textarea.value = newText;
        
        // Update cursor position after emoji
        const newCursorPosition = cursorPosition + emoji.length;
        textarea.setSelectionRange(newCursorPosition, newCursorPosition);
        
        // Focus back to textarea
        textarea.focus();
        
        // Update character counter
        updateCharacterCounter();
        
        // Add visual feedback
        item.style.transform = 'scale(1.2)';
        setTimeout(() => {
          item.style.transform = 'scale(1)';
        }, 150);
      } else {
        // Show warning if character limit would be exceeded
        showTemporaryMessage('Character limit reached!', 'warning');
      }
      
      // Close picker after selection
      emojiPicker.classList.add('hidden');
    });
  });

  // Close picker when clicking outside
  document.addEventListener('click', (e) => {
    if (!emojiPicker.contains(e.target) && !emojiBtn.contains(e.target)) {
      emojiPicker.classList.add('hidden');
    }
  });

  // Close picker on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !emojiPicker.classList.contains('hidden')) {
      emojiPicker.classList.add('hidden');
      textarea.focus();
    }
  });

  // Update character counter function
  function updateCharacterCounter() {
    const characterCounter = document.querySelector('.text-right.text-xs.text-gray-500');
    if (characterCounter) {
      const currentLength = textarea.value.length;
      characterCounter.textContent = `${currentLength}/500 characters`;
      
      // Change color based on character count
      if (currentLength > 450) {
        characterCounter.classList.remove('text-gray-500');
        characterCounter.classList.add('text-red-500');
      } else if (currentLength > 400) {
        characterCounter.classList.remove('text-gray-500', 'text-red-500');
        characterCounter.classList.add('text-yellow-600');
      } else {
        characterCounter.classList.remove('text-red-500', 'text-yellow-600');
        characterCounter.classList.add('text-gray-500');
      }
    }
  }

  // Show temporary message function
  function showTemporaryMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `fixed top-4 right-4 px-4 py-2 rounded-lg text-white text-sm font-medium z-50 transition-all duration-300 ${
      type === 'warning' ? 'bg-red-500' : 'bg-blue-500'
    }`;
    messageDiv.textContent = message;
    messageDiv.style.transform = 'translateX(100%)';
    
    document.body.appendChild(messageDiv);
    
    // Animate in
    setTimeout(() => {
      messageDiv.style.transform = 'translateX(0)';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
      messageDiv.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (messageDiv.parentNode) {
          messageDiv.parentNode.removeChild(messageDiv);
        }
      }, 300);
    }, 3000);
  }

  // Update character counter on input
  textarea.addEventListener('input', updateCharacterCounter);
  
  // Initialize character counter
  updateCharacterCounter();
}

 