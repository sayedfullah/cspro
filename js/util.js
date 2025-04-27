(()=>
{
    document.addEventListener('DOMContentLoaded', function () {
        // Generic function to initialize a carousel
        function initCarousel(containerId) {
            const container = document.getElementById(containerId);
            if (!container) return;

            const emojiList = container.querySelector('.emoji-list');
            const emojiItems = container.querySelectorAll('.emoji-item');
            const prevButton = container.querySelector('.nav-prev');
            const nextButton = container.querySelector('.nav-next');
            const carousel = container.querySelector('.emoji-carousel');

            let scrollAmount = 0;
            const itemWidth = 60; // Width of each item + margins
            const scrollStep = itemWidth * 3; // Scroll 3 items at a time

            // Navigation buttons for this carousel
            if (prevButton) {
                prevButton.addEventListener('click', function () {
                    scrollAmount = Math.max(scrollAmount - scrollStep, 0);
                    emojiList.style.transform = `translateX(-${scrollAmount}px)`;
                });
            }

            if (nextButton) {
                nextButton.addEventListener('click', function () {
                    const maxScroll = emojiList.scrollWidth - carousel.clientWidth;
                    scrollAmount = Math.min(scrollAmount + scrollStep, maxScroll);
                    emojiList.style.transform = `translateX(-${scrollAmount}px)`;
                });
            }

            // Return methods that can be used externally
            return {
                scrollLeft: function () {
                    if (prevButton) prevButton.click();
                },
                scrollRight: function () {
                    if (nextButton) nextButton.click();
                }
            };
        }

        // Initialize all carousels
        for (let i = 1; i <= 4; i++) { initCarousel(`emoji-carousel-${i}`); }});
})();