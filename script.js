// LinkedIn Portfolio Page JavaScript
class LinkedInPortfolio {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupEventListeners());
        } else {
            this.setupEventListeners();
        }
    }

    setupEventListeners() {
        // Navigation smooth scrolling
        this.setupSmoothScrolling();
        
        // Video controls
        this.setupVideoControls();
        
        // Video error handling
        this.setupVideoErrorHandling();
        
        // Intersection Observer for animations
        this.setupIntersectionObserver();
        
        // Fullscreen modal for seminars
        this.setupFullscreenModal();
        
        // Window resize handler (debounced)
        window.addEventListener('resize', () => this.handleResize());
    }

    setupFullscreenModal() {
        const fullscreenBtns = document.querySelectorAll('.fullscreen-btn');
        const modal = document.getElementById('fullscreenModal');
        const closeBtn = document.getElementById('closeModal');
        const fullscreenImage = document.getElementById('fullscreenImage');
        const modalTitle = document.getElementById('modalTitle');
        const modalDate = document.getElementById('modalDate');

        if (!modal || !closeBtn || !fullscreenImage) return;

        // Open modal when fullscreen button is clicked
        fullscreenBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                
                const seminarItem = btn.closest('.seminar-item');
                const image = seminarItem.querySelector('.seminar-image');
                const title = seminarItem.querySelector('.seminar-details h4');
                const date = seminarItem.querySelector('.seminar-date');
                const highResImage = seminarItem.getAttribute('data-image');
                
                // Set modal content
                fullscreenImage.src = highResImage || image.src;
                fullscreenImage.alt = image.alt;
                modalTitle.textContent = title ? title.textContent : '';
                modalDate.textContent = date ? date.textContent : '';
                
                // Show modal
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        // Close modal
        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        };

        closeBtn.addEventListener('click', closeModal);
        
        // Close modal when clicking outside the image
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    setupVideoControls() {
        const videoContainers = document.querySelectorAll('.video-container');
        
        videoContainers.forEach(container => {
            const video = container.querySelector('video');
            const overlay = container.querySelector('.video-overlay');
            const playBtn = container.querySelector('.play-btn');
            
            if (!video || !overlay || !playBtn) return;
            
            // Play button click
            playBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.playVideo(video, overlay);
            });
            
            // Video click to play/pause
            video.addEventListener('click', () => {
                if (video.paused) {
                    this.playVideo(video, overlay);
                } else {
                    this.pauseVideo(video, overlay);
                }
            });
            
            // Video ended
            video.addEventListener('ended', () => {
                overlay.style.display = 'flex';
                playBtn.innerHTML = '<i class="fas fa-play"></i>';
            });
            
            // Video pause
            video.addEventListener('pause', () => {
                if (video.currentTime < video.duration) {
                    overlay.style.display = 'flex';
                    playBtn.innerHTML = '<i class="fas fa-play"></i>';
                }
            });
            
            // Video play
            video.addEventListener('play', () => {
                overlay.style.display = 'none';
            });
        });
    }

    playVideo(video, overlay) {
        video.play();
        overlay.style.display = 'none';
        
        // Update play button
        const playBtn = overlay.querySelector('.play-btn');
        if (playBtn) {
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }
    }

    pauseVideo(video, overlay) {
        video.pause();
        overlay.style.display = 'flex';
        
        // Update play button
        const playBtn = overlay.querySelector('.play-btn');
        if (playBtn) {
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    }

    setupSmoothScrolling() {
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 72; // Account for fixed navbar
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Update active nav link
                    this.updateActiveNavLink(link);
                }
            });
        });
        
        // Update active nav link on scroll
        window.addEventListener('scroll', () => this.updateActiveNavLinkOnScroll());
    }

    updateActiveNavLink(activeLink) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }

    updateActiveNavLinkOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100; // Offset for navbar
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    this.updateActiveNavLink(activeLink);
                }
            }
        });
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Observe all cards
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }

    handleResize() {
        // Debounce resize events for better performance
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            // Handle responsive changes if needed
        }, 150);
    }

    // Error handling for video loading
    setupVideoErrorHandling() {
        const videos = document.querySelectorAll('.post-card video');
        
        videos.forEach(video => {
            video.addEventListener('error', (e) => {
                console.warn('Video failed to load:', e);
                const container = video.closest('.video-container');
                if (container) {
                    container.innerHTML = `
                        <div class="video-error">
                            <i class="fas fa-exclamation-triangle"></i>
                            <p>Video unavailable</p>
                        </div>
                    `;
                }
            });
            
            video.addEventListener('loadstart', () => {
                const overlay = video.parentElement.querySelector('.video-overlay');
                if (overlay) {
                    overlay.style.opacity = '0.8';
                }
            });
            
            video.addEventListener('canplay', () => {
                const overlay = video.parentElement.querySelector('.video-overlay');
                if (overlay) {
                    overlay.style.opacity = '1';
                }
            });
        });
    }
}

// Additional utility functions
class PortfolioUtils {
    static formatDate(date) {
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return '1 day ago';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
        return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) > 1 ? 's' : ''} ago`;
    }

    static animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        const timer = setInterval(() => {
            start += increment;
            element.textContent = Math.floor(start);
            
            if (start >= target) {
                element.textContent = target;
                clearInterval(timer);
            }
        }, 16);
    }

    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Enhanced interactions
class PortfolioInteractions {
    constructor() {
        this.setupSkillHovers();
        this.setupProfileActions();
    }

    setupSkillHovers() {
        const skillItems = document.querySelectorAll('.skill-item');
        
        skillItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateX(5px)';
                item.style.transition = 'transform 0.2s ease';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateX(0)';
            });
        });
    }

    setupProfileActions() {
        const profileBtns = document.querySelectorAll('.profile-actions .btn');
        
        profileBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                const btnText = btn.textContent.trim();
                
                switch (btnText) {
                    case 'Connect':
                        this.handleConnect(btn);
                        break;
                    case 'Message':
                        this.handleMessage(btn);
                        break;
                    case 'Resume':
                        this.handleResume(btn);
                        break;
                }
            });
        });
    }

    handleConnect(btn) {
        const isConnected = btn.classList.contains('connected');
        
        if (isConnected) {
            btn.innerHTML = '<i class="fas fa-plus"></i> Connect';
            btn.classList.remove('connected');
        } else {
            btn.innerHTML = '<i class="fas fa-check"></i> Connected';
            btn.classList.add('connected');
            this.showToast('Connection request sent!');
        }
    }

    handleMessage(btn) {
        this.showToast('Message feature would open here');
    }

    handleResume(btn) {
        // Create a link to download the actual resume file
        const link = document.createElement('a');
        link.href = './assets/Kent_Ann_Ecal_Resume.pdf'; // Adjust this path to where your resume file is stored
        link.download = 'Kent_Ann_Ecal_Resume.pdf';
        
        // Show toast notification
        this.showToast('Resume download started');
        
        // Trigger the download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    showToast(message) {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: #0a66c2;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        // Animate out and remove
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure content is loaded first
    setTimeout(() => {
        // Initialize main portfolio functionality
        const portfolio = new LinkedInPortfolio();
        const interactions = new PortfolioInteractions();
        
        // Add some dynamic content updates
        setTimeout(() => {
            // Animate connection count
            const connectionCount = document.querySelector('.connection-count');
            if (connectionCount) {
                PortfolioUtils.animateCounter(connectionCount, parseInt(connectionCount.textContent) || 500, 1500);
            }
            
            // Animate endorsement counts
            const endorsementCounts = document.querySelectorAll('.endorsement-count');
            endorsementCounts.forEach((count, index) => {
                setTimeout(() => {
                    const target = parseInt(count.textContent);
                    if (target) {
                        PortfolioUtils.animateCounter(count, target, 1000);
                    }
                }, index * 200);
            });
        }, 1000); // Reduced delay since content should load faster now
    }, 500); // Give the embedded content loader time to finish
    
    // Add loading state removal
    document.body.classList.add('loaded');
});

// Export for potential external use
window.LinkedInPortfolio = LinkedInPortfolio;
window.PortfolioUtils = PortfolioUtils;
window.PortfolioInteractions = PortfolioInteractions;