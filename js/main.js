const swiperChannel = new Swiper(".channel-slider", {
    // Optional parameters
    loop: true,
    slidesPerView: 1,
    spaceBetween: 20,
    breakpoints: {
        1900: {
            slidesPerView: 6,
        },
        1600: {
            slidesPerView: 5,
        },
        1300: {
            slidesPerView: 4,
        },
        1100: {
            slidesPerView: 3,
        },
        800: {
            slidesPerView: 2,
        },
    },
    // Navigation arrows
    navigation: {
        nextEl: ".channel-button-next",
        prevEl: ".channel-button-prev",
    },
});

const swiperRecommended = new Swiper(".recommended-slider", {
    // Optional parameters
    loop: true,
    slidesPerView: 1,
    spaceBetween: 20,
    breakpoints: {
        1600: {
            slidesPerView: 3,
        },
        1200: {
            slidesPerView: 2,
        },
    },
    // Navigation arrows
    navigation: {
        nextEl: ".recommended-button-next",
        prevEl: ".recommended-button-prev",
    },
});

const swiperChannelRecommended = new Swiper(".channel-recommended-slider", {
    // Optional parameters
    loop: true,
    slidesPerView: 1,
    spaceBetween: 20,
    breakpoints: {
        1900: {
            slidesPerView: 6,
        },
        1600: {
            slidesPerView: 5,
        },
        1300: {
            slidesPerView: 4,
        },
        1100: {
            slidesPerView: 3,
        },
        800: {
            slidesPerView: 2,
        },
    },
    // Navigation arrows
    navigation: {
        nextEl: ".channel-recommended-button-next",
        prevEl: ".channel-recommended-button-prev",
    },
});

const searchBtn = document.querySelector(".mobile-search");
const mobileSearch = document.querySelector(".input-group");
searchBtn.addEventListener("click", () => {
    mobileSearch.classList.toggle("is-open");
});

if (document.documentElement.scrollWidth <= 640) {
    swiperChannel.destroy();
    swiperRecommended.destroy();
    swiperChannelRecommended.destroy();
}
