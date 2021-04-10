const swiperChannel = new Swiper(".channel-slider", {
    // Optional parameters
    loop: true,
    slidesPerView: 6,
    // Navigation arrows
    navigation: {
        nextEl: ".channel-button-next",
        prevEl: ".channel-button-prev",
    },
});

const swiperRecommended = new Swiper(".recommended-slider", {
    // Optional parameters
    loop: true,
    slidesPerView: 3,
    // Navigation arrows
    navigation: {
        nextEl: ".recommended-button-next",
        prevEl: ".recommended-button-prev",
    },
});

const swiperChannelRecommended = new Swiper(".channel-recommended-slider", {
    // Optional parameters
    loop: true,
    slidesPerView: 6,
    // Navigation arrows
    navigation: {
        nextEl: ".channel-recommended-button-next",
        prevEl: ".channel-recommended-button-prev",
    },
});
