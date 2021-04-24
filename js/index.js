import { API_KEY, CLIENT_ID } from "./api.js";
const formSearch = document.querySelector(".form-search");
const formInput = formSearch.querySelector(".input-search");

// const gloAcademyList = document.querySelector(".glo-academy-list");
// const trendingList = document.querySelector(".trending-list");
// const musicList = document.querySelector(".music-list");

const content = document.querySelector(".content");

const navMenuMore = document.querySelector(".nav-menu-more");
const showMore = navMenuMore.querySelector(".show-more");
// const svgMore = showMore.querySelector(".icon");
const navMenuSubscriptions = document.querySelector(".nav-menu-subscriptions");

//sidebar
const navLinkLiked = document.querySelectorAll(".nav-link-liked");
const navLinkHome = document.querySelectorAll(".nav-link-home");
const navLinkTrending = document.querySelectorAll(".nav-link-trending");
const navLinkSubscriptions = document.querySelectorAll(".nav-link-subscriptions");

const navLinkMusic = document.querySelector(".nav-link-music");
const navLinkGames = document.querySelector(".nav-link-games");

const createCard = (dataVideo) => {
    const card = document.createElement("li");
    card.classList.add("video-card");
    const viewCount = dataVideo.statistics?.viewCount;

    const imgUrl = dataVideo.snippet.thumbnails.high.url;
    const videoId = typeof dataVideo.id === "string" ? dataVideo.id : dataVideo.id.videoId;
    // statistics ? dataVideo.id : dataVideo.id.videoId;
    const videoTitle = dataVideo.snippet.title;
    const channelTitle = dataVideo.snippet.channelTitle;
    const videoDate = dataVideo.snippet.publishedAt;
    card.innerHTML = `
            <div class="video-thumb">
              <a class="link-video youtube-modal" href="https://youtu.be/${videoId}">
                <img src="${imgUrl}" alt="" class="thumbnail">
              </a>

            </div>
            <h3 class="video-title">${videoTitle}</h3>
            <div class="video-info">
              <span class="video-counter">
                ${viewCount ? "        <span class='video-views'>" + getViewer(viewCount) + "</span>" : ""}
                <span class="video-date">${getDateDiff(new Date(videoDate))}</span>
              </span>
              <span class="video-channel">${channelTitle}</span>
            </div>
    `;
    // console.log(dataVideo);
    return card;
};

const createList = (listVideo, title, clear = false) => {
    if (clear) {
        content.textContent = "";
    }

    const channel = document.createElement("section");
    channel.classList.add("channel");
    if (title) {
        const header = document.createElement("h2");
        header.textContent = title;
        channel.insertAdjacentElement("afterbegin", header);
    }
    const wrapper = document.createElement("li");
    wrapper.classList.add("video-list");

    channel.insertAdjacentElement("beforeend", wrapper);
    // console.log(listVideo);
    listVideo.forEach((video) => wrapper.append(createCard(video)));

    content.insertAdjacentElement("beforeend", channel);
};

const createSubscription = (dataSubscription) => {
    const subscr = document.createElement("li");
    subscr.classList.add("nav-item");

    const {
        resourceId: { channelId },
        title: channelTitle,
        thumbnails: {
            high: { url: channelImg },
        },
    } = dataSubscription.snippet;
    subscr.innerHTML = `
          <a href="#" class="nav-link" data-channel-id="${channelId}" data-title="${channelTitle}">
            <img src="${channelImg}" alt="Channel: ${channelTitle}" class="nav-image">
            <span class="nav-text">${channelTitle}</span>
          </a>
    `;
    return subscr;
};

const createSubscriptionsList = (wrapper, listSubscriptions) => {
    wrapper.textContent = "";
    console.log(listSubscriptions);
    listSubscriptions.forEach((subscr) => wrapper.append(createSubscription(subscr)));
};

const getDateDiff = (date) => {
    const currentDay = Date.parse(new Date());
    const days = Math.round((currentDay - Date.parse(date)) / 86400000);
    if (days > 30) {
        if (days > 60) {
            const years = Math.round(days / 365);
            if (years > 1) {
                return years + " years ago";
            } else if (years === 1) {
                return "One year ago";
            }
            return Math.round(days / 30) + " months ago";
        }
        return "One month ago";
    } else {
        if (days > 1) {
            return days + " days ago";
        }
        return "One day ago";
    }
};

const getViewer = (count) => {
    if (count >= 1000000) {
        return Math.round(count / 100000) / 10 + "M views";
    }
    if (count >= 1000) {
        return Math.round(count / 1000) + "K views";
    }
    return count + " views";
};

//youtubeAPI

const authBtn = document.querySelector(".auth-btn");
const userAvatar = document.querySelector(".user-avatar");

const handleSuccessAuth = (data) => {
    console.log("handleSuccessAuth");
    // console.log(data);
    authBtn.classList.add("hide");
    userAvatar.classList.remove("hide");
    userAvatar.src = data.getImageUrl();
    userAvatar.alt = data.getName();
    // const obj = {
    //     part: "snippet, contentDetails, statistics",
    //     id: "UC-oW28YpH6V8SUZ4JV1V-AQ",
    // };
    // gapi.client.youtube.channels.list(obj).then((data) => {
    //     console.log(data);
    // });
    requestSubscriptions((data) => {
        // console.log(data);
        createSubscriptionsList(navMenuSubscriptions, data);
    });
};

const handleNoAuth = () => {
    console.log("handleNoAuth");
    authBtn.classList.remove("hide");
    userAvatar.classList.add("hide");
    userAvatar.src = "";
    userAvatar.alt = "";
};

const handleAuth = () => {
    // gapi.auth2.getAuth();
    // console.log(gapi.auth2);
    gapi.auth2.getAuthInstance().signIn();
};
const handleSignout = () => {
    gapi.auth2.getAuthInstance().signOut();
};

const updateStatusAuth = (data) => {
    console.log("updateStatusAuth");
    console.log(data);
    data.isSignedIn.listen(() => {
        updateStatusAuth(data);
    });
    console.log(data.isSignedIn.get());
    if (data.isSignedIn.get()) {
        const userData = data.currentUser.get().getBasicProfile();
        handleSuccessAuth(userData);
    } else {
        handleNoAuth();
    }
};

// var GoogleAuth; // Google Auth object.
function initClient() {
    gapi.client
        .init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            scope: "https://www.googleapis.com/auth/youtube.readonly",
            discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"],
        })
        .then(() => {
            authBtn.addEventListener("click", handleAuth);
            userAvatar.addEventListener("click", handleSignout);
            // console.log(gapi.auth2);
            updateStatusAuth(gapi.auth2.getAuthInstance());
        })
        .then(loadScreen)
        .catch((error) => {
            authBtn.removeEventListener("click", handleAuth);
            userAvatar.removeEventListener("click", handleSignout);
            console.log("error = " + error.details);
            console.dir(error);
            alert("Авторизация не удалась.");
        });
}

gapi.load("client:auth2", initClient);

const getChannel = () => {
    const settings = {
        part: "snippet, statistics",
        id: "UC-oW28YpH6V8SUZ4JV1V-AQ",
    };
    gapi.client.youtube.channels.list(settings).then((response) => {
        console.log(data);
    });
};

//load screen

const requestVideos = (channelId, callback, quantity = 6) => {
    gapi.client.youtube.search
        .list({
            part: "snippet",
            channelId,
            maxResults: quantity,
            order: "date",
        })
        // .then((response) => {
        //     callback(response.items);
        // })
        // .then((data) => {
        //     // callback(data);
        //     console.log("success");
        //     console.log(data);
        // })
        // .catch((error) => {
        //     console.log("Error : " + error.details);
        // });
        .execute((response) => {
            callback(response.items);
        });
};

const requestTrending = (callback, quantity = 6) => {
    gapi.client.youtube.videos
        .list({
            part: "snippet, statistics",
            chart: "mostPopular",
            regionCode: "RU",
            maxResults: quantity,
        })
        .execute((response) => {
            callback(response.items);
        });
};

const requestThemedContent = (callback, category, quantity = 6) => {
    gapi.client.youtube.videos
        .list({
            part: "snippet, statistics",
            chart: "mostPopular",
            regionCode: "RU",
            maxResults: quantity,
            videoCategoryId: category,
        })
        .execute((response) => {
            callback(response.items);
        });
};

const requestSearch = (query, callback, quantity = 12) => {
    gapi.client.youtube.search
        .list({
            part: "snippet",
            q: query,
            maxResults: quantity,
            order: "relevance",
        })
        .execute((response) => {
            callback(response.items);
        });
};

const requestSubscriptions = (callback, quantity = 6) => {
    gapi.client.youtube.subscriptions
        .list({
            part: "snippet",
            mine: true,
            maxResults: quantity,
            order: "unread",
        })
        .execute((response) => {
            callback(response.items);
        });
};

const requestLiked = (callback, quantity = 6) => {
    gapi.client.youtube.videos
        .list({
            part: "contentDetails, snippet, statistics",
            maxResults: quantity,
            myRating: "like",
        })
        .execute((response) => {
            callback(response.items);
        });
};

const loadScreen = () => {
    //
    content.innerHTML = '<h3 class="preload"></h3>';

    requestVideos("UCv5dc2Zi6j5IXQ_NKTZuSLA", (data) => {
        content.textContent = "";
        createList(data, "НАРОДОВЛАСТИЕ", false);
        requestTrending((data) => {
            createList(data, "Популярные видео", false);
            requestThemedContent((data) => {
                createList(data, "Популярная музыка", false);
            }, "10");
        });
    });
    formSearch.addEventListener("submit", (event) => {
        event.preventDefault();
        requestSearch(formInput.value, (data) => {
            console.log(data);
            createList(data, "Результат поиска", true);
        });
    });
};

showMore.addEventListener("click", (event) => {
    event.preventDefault();
    navMenuMore.classList.toggle("nav-menu-more-show");
});

navMenuSubscriptions.addEventListener("click", (event) => {
    event.preventDefault();
    const target = event.target;
    const linkChannel = target.closest(".nav-link");
    requestVideos(
        linkChannel.dataset.channelId,
        (data) => {
            // content.textContent = "";
            createList(data, linkChannel.dataset.title, true);
        },
        12
    );
});

navLinkLiked.forEach((liked) => {
    liked.addEventListener("click", (event) => {
        event.preventDefault();
        requestLiked((data) => {
            createList(data, "Понравившиеся видео", true);
        }, 12);
    });
});

navLinkHome.forEach((elem) => {
    elem.addEventListener("click", (event) => {
        event.preventDefault();
        loadScreen();
    });
});

navLinkTrending.forEach((elem) => {
    elem.addEventListener("click", (event) => {
        event.preventDefault();
        requestTrending((data) => {
            createList(data, "Популярные видео", true);
        }, 20);
    });
});

navLinkSubscriptions.forEach((elem) => {
    elem.addEventListener("click", (event) => {
        event.preventDefault();
        requestSubscriptions((data) => {
            createList(data, "Подписки", true);
        }, 20);
    });
});

navLinkMusic.addEventListener("click", (event) => {
    event.preventDefault();
    requestThemedContent(
        (data) => {
            createList(data, "Музыка", true);
        },
        "10",
        12
    );
});

navLinkGames.addEventListener("click", (event) => {
    event.preventDefault();
    requestThemedContent(
        (data) => {
            createList(data, "Игры", true);
        },
        "20",
        12
    );
});
