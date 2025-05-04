const mainWrapper = document.getElementById("main");
const settings = JSON.parse(sessionStorage.getItem('setting'));

document.addEventListener('DOMContentLoaded', () => {
    const { profile, SEO, links, display } = settings;
    const { music } = display.share;
    const titleSettings = settings.display.title;
    Profile(profile, music, display, SEO, settings.plugins, titleSettings);
    Links(links);
    if (!display.blur) {
        document.body.style.setProperty('--global-blur', 'blur(0)');
    }

    const pages = document.querySelectorAll('.page');
    const pageIndicator = document.getElementById('pageIndicator');

    pageIndicator.innerHTML = '';

    pages.forEach((page, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');

        dot.addEventListener('click', () => {
            mainWrapper.scrollTo({
                top: page.offsetTop - mainWrapper.offsetTop, 
                behavior: 'smooth',
            });
        });

        pageIndicator.appendChild(dot);
    });

    const updateIndicator = (activeIndex) => {
        const dots = document.querySelectorAll('.page-indicator .dot');
        dots.forEach((dot, index) => {
            if (index === activeIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    };

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const activeIndex = Array.from(pages).indexOf(entry.target);
                    updateIndicator(activeIndex);

                    const pageName = entry.target.getAttribute('p-name');
                    if (pageName) {
                        document.title = `${pageName} | ${settings.profile.website_name}`;
                    }
                }
            });
        },
        {
            root: mainWrapper,
            threshold: [0.3],
        }
    );

    pages.forEach((page) => observer.observe(page));
});

function createLink(id, icon, target, url, linkName, description, onclick, isInBox = false) {
    const LinkBtnWrapper = document.createElement('a');

    Object.assign(LinkBtnWrapper, {
        id,
        target,
        title: linkName
    });

    if (url != false) {
        LinkBtnWrapper.href = url;
    }

    if (onclick) {
        LinkBtnWrapper.onclick = (e) => {
            e.preventDefault();
            new Function(onclick)();
        };
    }

    const LinkInfoTab = document.createElement('div');
    const LinkBtnIcon = document.createElement('i');
    const LinkBtnTitle = document.createElement('div');
    const LinkBtnDesc = document.createElement('div');
    LinkInfoTab.className = 'link-info-tab';
    LinkBtnWrapper.className = 'link-btn-box';

    LinkBtnTitle.innerText = linkName;
    LinkBtnTitle.className = 'link-title';
    LinkInfoTab.appendChild(LinkBtnIcon);
    LinkInfoTab.appendChild(LinkBtnTitle);
    LinkBtnWrapper.appendChild(LinkInfoTab);

    if (description) {
        LinkBtnDesc.innerText = description;
        LinkBtnDesc.className = 'link-desc';
        LinkBtnWrapper.appendChild(LinkBtnDesc);
    } else {
        LinkBtnDesc.remove();
    }

    if(icon.type === "fontawesome") {
        LinkBtnIcon.className = `link-icon ${icon.fontawesome}`;
    }else if(icon.type === "auto") {
        if(icon.fontawesome){
            LinkBtnIcon.className = `link-icon ${icon.fontawesome}`;
        }else{
            LinkBtnIcon.className = "link-icon-text";
            LinkBtnIcon.innerText = linkName.charAt(0).toUpperCase()
        }
    }

    LinkBtnWrapper.setAttribute('l-name', linkName);
    return LinkBtnWrapper;
}

function greetUser(settings) {
    const currentHour = new Date().getHours();
    const greetings = {
        morning: settings.morning || "Good morning!",
        afternoon: settings.afternoon || "Good afternoon!",
        evening: settings.evening || "Good evening!",
        night: settings.night || "Good night!"
    };

    if (currentHour >= 6 && currentHour < 12) {
        return greetings.morning;
    } else if (currentHour >= 12 && currentHour < 18) {
        return greetings.afternoon;
    } else if (currentHour >= 18 && currentHour < 21) {
        return greetings.evening;
    } else {
        return greetings.night;
    }
}

function Profile(profile, music, display, SEO, plugins_list, titleSettings) {
    const { icon, favicon } = profile;
    const { background } = display;
    const { language, description, google_verification } = SEO;
    const { music_data: musicSetting } = music;
    const darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const nameElement = document.getElementById('name');

    /* Basic HTML Elements */
    document.documentElement.lang = language || 'zh-TW';
    document.title = profile.website_name;
    document.getElementById('title').innerText = titleSettings.method === "greeting" ? greetUser(titleSettings.advanced_settings) : `HEY! ${profile.name}`;
    document.getElementById('description').innerText = profile.subtitle;

    /* Meta Tags */
    document.querySelector('meta[name="description"]')?.setAttribute('content', description || 'Powered by JerryIs-strong/Arona');
    document.querySelector('meta[name="google-site-verification"]')?.setAttribute('content', google_verification || '');
    if (favicon.default) {
        document.querySelector("link[rel='shortcut icon']").href = favicon.default;
        document.querySelector("link[rel='apple-touch-icon']").href = favicon.default;
    }

    Music(music, musicSetting);
    Background(background.url);
    Theme(darkMode, favicon.dark_mode);
    HolderIcon(icon, plugins_list);
}

function Music(music, musicSetting) {
    const musicElement = document.getElementById('MusicName');
    if (music.enable) {
        const musicNumber = Object.keys(musicSetting).length;
        const musicRandom = Math.floor(Math.random() * musicNumber) + 1;
        const musicKey = musicSetting[`music_${musicRandom}`];
        musicElement.innerText = musicKey.name;
        musicElement.href = musicKey.url;
        if (musicKey.album || musicKey.artist) {
            if (musicKey.album.length > 0) {
                var musicKeyName = `${musicKey.name} - ${musicKey.artist} • ${musicKey.album}`;
            } else {
                var musicKeyName = `${musicKey.name} - ${musicKey.artist}`;
            }
        }
        musicElement.innerText = musicKeyName;
        musicElement.title = musicKeyName;
        const currentMusic = {
            name: musicKey.name,
            artist: musicKey.artist
        }
        sessionStorage.setItem('current-music', JSON.stringify(currentMusic));
    } else {
        debug("音樂已禁用", "info")
        document.getElementById('music').remove();
    }
}

function Background(backgroundUrl) {
    const backgroundElement = document.getElementById('background');
    if (backgroundUrl.length > 0 && backgroundUrl.includes('/')) {
        backgroundElement.style.backgroundImage = `url(${backgroundUrl})`;
    } else {
        debug("本地壁紙設置錯誤", "warn");
        document.getElementById('background').remove();
    }
}

function Theme(darkMode, favicon) {
    document.documentElement.setAttribute("dark", darkMode ? "true" : "false");
    if (favicon.enable != false) {
        if (!darkMode) {
            document.querySelector("link[rel='shortcut icon']").href = favicon.path.light;
            document.querySelector("link[rel='apple-touch-icon']").href = favicon.path.light;
        } else {
            document.querySelector("link[rel='shortcut icon']").href = favicon.path.dark;
            document.querySelector("link[rel='apple-touch-icon']").href = favicon.path.dark;
        }
    }
}

function HolderIcon(holderIcon) {
    const imgElement = document.getElementById('img');
    if (holderIcon.method === "local") {
        imgElement.src = holderIcon.local.url;
    } else {
        debug("頭像設置錯誤", "warn");
        document.getElementById('img').remove();
    }
}

function Links(linkSettings) {
    const urlParams = new URLSearchParams(window.location.search);
    const linkGroup = document.getElementById('mediaBtn_wrapper');

    if (linkSettings && Object.keys(linkSettings).length > 0) {
        Object.entries(linkSettings).forEach(([category, linkDB]) => {
            Object.entries(linkDB).forEach(([key, link]) => {
                if (link.enable && link.name != urlParams.get('media') && key.includes("link_")) {
                    linkGroup.appendChild(createLink(key, link.icon, link.target, link.url, link.name, link.description, false, true));
                }
            });
        });
    } else {
        debug("連結設置錯誤", "warn");
        linkGroup.remove();
    }
}

function navigateTo(pageName) {
    const mainWrapper = document.getElementById('main');
    const targetPage = document.querySelector(`.page[p-name="${pageName}"]`);

    if (targetPage) {
        mainWrapper.scrollTo({
            top: targetPage.offsetTop - mainWrapper.offsetTop, // Adjust for wrapper offset
            behavior: 'smooth',
        });
    } else {
        console.error(`Page with name "${pageName}" not found.`);
    }
}