const tagInput = document.querySelector("#tagInput");
const tagList = document.querySelector("#tagList");
const joinForm = document.querySelector("#joinForm");
const formMessage = document.querySelector("#formMessage");
const formSlides = [...document.querySelectorAll(".form-slide")];
const formSlider = document.querySelector(".form-slides");
const formTitle = document.querySelector("#formTitle");
const formStepNumber = document.querySelector("#formStepNumber");
const nextFormSlide = document.querySelector("#nextFormSlide");
const previousFormSlide = document.querySelector("#previousFormSlide");
const tags = new Set();
let activeFormSlide = 0;

function showFormSlide(index) {
    const activeSlide = formSlides[index];
    activeSlide.inert = false;
    activeSlide.setAttribute("aria-hidden", "false");
    activeFormSlide = index;
    formSlider.classList.toggle("is-second-step", index === 1);
    formTitle.textContent = index === 0 ? "Profil pengendara" : "Ceritakan perjalananmu";
    formStepNumber.textContent = `0${index + 1}`;

    formSlides.forEach((slide, slideIndex) => {
        const isActive = slideIndex === index;
        if (!isActive) {
            slide.setAttribute("aria-hidden", "true");
            slide.inert = true;
        }
    });

    const firstControl = activeSlide.querySelector("input, select, textarea, button");
    if (firstControl) {
        firstControl.focus();
    }
}

function validateActiveFormSlide() {
    const invalidField = [...formSlides[activeFormSlide].querySelectorAll("input, select, textarea")]
        .find((field) => field.willValidate && !field.validity.valid);

    if (invalidField) {
        invalidField.reportValidity();
        return false;
    }

    return true;
}

nextFormSlide.addEventListener("click", () => {
    if (validateActiveFormSlide()) {
        showFormSlide(1);
    }
});

previousFormSlide.addEventListener("click", () => {
    showFormSlide(0);
});

function normalizeTag(value) {
    return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function renderTags() {
    tagList.replaceChildren();

    tags.forEach((tag) => {
        const chip = document.createElement("span");
        chip.className = "tag-chip";

        const label = document.createElement("span");
        label.textContent = tag;

        const removeButton = document.createElement("button");
        removeButton.className = "tag-remove";
        removeButton.type = "button";
        removeButton.setAttribute("aria-label", `Hapus tag ${tag}`);
        removeButton.textContent = "×";
        removeButton.addEventListener("click", () => {
            tags.delete(tag);
            renderTags();
        });

        chip.append(label, removeButton);
        tagList.append(chip);
    });
}

tagInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") {
        return;
    }

    event.preventDefault();
    const tag = normalizeTag(tagInput.value);
    if (tag && !tags.has(tag)) {
        tags.add(tag);
        renderTags();
    }
    tagInput.value = "";
});

joinForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validateActiveFormSlide()) {
        return;
    }

    if (activeFormSlide === 0) {
        showFormSlide(1);
        return;
    }

    const name = document.querySelector("#fullName").value.trim();
    const experience = new FormData(joinForm).get("experience");
    const city = document.querySelector("#city").value;
    formMessage.textContent = `Terima kasih, ${name}! Ceritamu dari ${city} dengan pilihan ${experience} sudah tercatat.`;
});

joinForm.addEventListener("input", () => {
    formMessage.textContent = "";
});

const carOptions = document.querySelectorAll(".car-option");
const carShowcase = document.querySelector("#carShowcase");
const carImage = document.querySelector("#carImage");
const carImageSource = document.querySelector("#carImageSource");
const previousCarButton = document.querySelector("#previousCar");
const nextCarButton = document.querySelector("#nextCar");
const trackSelect = document.querySelector("#trackSelect");
const trackInfo = document.querySelector("#trackInfo");
const cars = {
    gt3: {
        number: "01 / 09",
        category: "GERMAN ENGINEERING · TRACK",
        name: "Porsche 911 GT3",
        year: "2024",
        engine: "4.0L flat-six",
        power: "502 hp",
        acceleration: "3,4 dtk",
        drivetrain: "RWD",
        description: "Mesin naturally aspirated dengan respons tajam, dibuat untuk presisi di lintasan sekaligus kesenangan di jalan raya.",
        image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c1/Porsche_992_GT3_1X7A0323.jpg/1280px-Porsche_992_GT3_1X7A0323.jpg",
        source: "https://commons.wikimedia.org/wiki/File:Porsche_992_GT3_1X7A0323.jpg",
        alt: "Porsche 911 GT3 generasi 992",
        tracks: [
            { name: "Spa-Francorchamps", type: "Sirkuit cepat · Belgia", meta: "7,0 km · Tantangan tinggi" },
            { name: "Laguna Seca", type: "Sirkuit teknis · California", meta: "3,6 km · Tantangan menengah" },
            { name: "Hakone Pass", type: "Jalur pegunungan · Jepang", meta: "12,4 km · Tantangan tinggi" }
        ]
    },
    supra: {
        number: "02 / 09",
        category: "JAPANESE ENGINEERING · SPORT",
        name: "Toyota GR Supra",
        year: "2024",
        engine: "3.0L inline-six",
        power: "382 hp",
        acceleration: "4,1 dtk",
        drivetrain: "RWD",
        description: "Coupe sport dengan mesin turbo enam silinder, distribusi bobot seimbang, dan karakter responsif untuk jalan berliku.",
        image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e5/2020_Toyota_GR_Supra_%28United_States%29.png/1280px-2020_Toyota_GR_Supra_%28United_States%29.png",
        source: "https://commons.wikimedia.org/wiki/File:2020_Toyota_GR_Supra_(United_States).png",
        alt: "Toyota GR Supra generasi A90",
        tracks: [
            { name: "Hakone Pass", type: "Jalur pegunungan · Jepang", meta: "12,4 km · Tantangan tinggi" },
            { name: "Tsukuba Circuit", type: "Sirkuit teknis · Jepang", meta: "2,0 km · Tantangan menengah" },
            { name: "Coastal Run", type: "Jalur pesisir · Pacific Coast", meta: "18,2 km · Tantangan santai" }
        ]
    },
    gtr: {
        number: "03 / 09",
        category: "JAPANESE ENGINEERING · AWD",
        name: "Nissan GT-R",
        year: "2024",
        engine: "3.8L twin-turbo V6",
        power: "565 hp",
        acceleration: "3,2 dtk",
        drivetrain: "AWD",
        description: "Performa twin-turbo dan sistem penggerak semua roda menghadirkan traksi kuat serta akselerasi yang meyakinkan.",
        image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ef/2009-2010_Nissan_GT-R_%28R35%29_coupe_01.jpg/1280px-2009-2010_Nissan_GT-R_%28R35%29_coupe_01.jpg",
        source: "https://commons.wikimedia.org/wiki/File:2009-2010_Nissan_GT-R_(R35)_coupe_01.jpg",
        alt: "Nissan GT-R generasi R35",
        tracks: [
            { name: "Fuji Speedway", type: "Sirkuit Grand Prix · Jepang", meta: "4,6 km · Tantangan tinggi" },
            { name: "Hakone Pass", type: "Jalur pegunungan · Jepang", meta: "12,4 km · Tantangan tinggi" },
            { name: "Autobahn Sprint", type: "Rute kecepatan tinggi · Jerman", meta: "21,0 km · Tantangan tinggi" }
        ]
    },
    ferrari: {
        number: "04 / 09",
        category: "ITALIAN ENGINEERING · SUPERCAR",
        name: "Ferrari 488 GTB Spider",
        year: "2017",
        engine: "3.9L twin-turbo V8",
        power: "661 hp",
        acceleration: "3,0 dtk",
        drivetrain: "RWD",
        description: "V8 twin-turbo bertenaga besar dalam coupe bermesin tengah yang memadukan akselerasi kuat dengan keseimbangan responsif.",
        image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7c/2018_Ferrari_488_GTB_Spider_S-A_3.9_Front.jpg/1280px-2018_Ferrari_488_GTB_Spider_S-A_3.9_Front.jpg",
        source: "https://commons.wikimedia.org/wiki/File:2018_Ferrari_488_GTB_Spider_S-A_3.9_Front.jpg",
        alt: "Ferrari 488 GTB Spider",
        tracks: [
            { name: "Monza GP", type: "Sirkuit cepat · Italia", meta: "5,8 km · Tantangan tinggi" },
            { name: "Spa-Francorchamps", type: "Sirkuit cepat · Belgia", meta: "7,0 km · Tantangan tinggi" },
            { name: "Amalfi Coast Run", type: "Jalur pesisir · Italia", meta: "16,5 km · Tantangan menengah" }
        ]
    },
    huracan: {
        number: "05 / 09",
        category: "ITALIAN ENGINEERING · AWD",
        name: "Lamborghini Huracán LP 610-4",
        year: "2020",
        engine: "5.2L naturally aspirated V10",
        power: "602 hp",
        acceleration: "3,2 dtk",
        drivetrain: "AWD",
        description: "Huracán LP 610-4 memadukan mesin V10 naturally aspirated dan sistem penggerak semua roda dalam paket supercar bermesin tengah.",
        image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/ca/2017_Lamborghini_Huracan_LP610.jpg/1280px-2017_Lamborghini_Huracan_LP610.jpg",
        source: "https://commons.wikimedia.org/wiki/File:2017_Lamborghini_Huracan_LP610.jpg",
        alt: "Lamborghini Huracán LP 610-4",
        tracks: [
            { name: "Monza GP", type: "Sirkuit cepat · Italia", meta: "5,8 km · Tantangan tinggi" },
            { name: "Imola Circuit", type: "Sirkuit teknis · Italia", meta: "4,9 km · Tantangan tinggi" },
            { name: "Alpine Pass", type: "Jalur pegunungan · Alpen", meta: "14,2 km · Tantangan tinggi" }
        ]
    },
    bmw: {
        number: "06 / 09",
        category: "GERMAN ENGINEERING · COUPE",
        name: "BMW M4 Competition",
        year: "2024",
        engine: "3.0L twin-turbo inline-six",
        power: "503 hp",
        acceleration: "3,8 dtk",
        drivetrain: "RWD",
        description: "Coupe performa tinggi dengan enam silinder turbo, setelan suspensi adaptif, dan keseimbangan untuk jalan maupun sirkuit.",
        image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e2/2021_BMW_M4_Competition_Automatic_3.0_Front.jpg/1280px-2021_BMW_M4_Competition_Automatic_3.0_Front.jpg",
        source: "https://commons.wikimedia.org/wiki/File:2021_BMW_M4_Competition_Automatic_3.0_Front.jpg",
        alt: "BMW M4 Competition generasi G82",
        tracks: [
            { name: "Nürburgring GP", type: "Sirkuit Grand Prix · Jerman", meta: "5,1 km · Tantangan tinggi" },
            { name: "Hockenheimring", type: "Sirkuit · Jerman", meta: "4,6 km · Tantangan menengah" },
            { name: "Black Forest Run", type: "Jalur hutan · Jerman", meta: "19,3 km · Tantangan menengah" }
        ]
    },
    mustang: {
        number: "07 / 09",
        category: "AMERICAN ENGINEERING · MUSCLE",
        name: "Ford Mustang Dark Horse",
        year: "2024",
        engine: "5.0L naturally aspirated V8",
        power: "500 hp",
        acceleration: "4,1 dtk",
        drivetrain: "RWD",
        description: "V8 berkapasitas besar dengan karakter muscle car klasik dan penyetelan sasis yang siap untuk lintasan.",
        image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/49/Ford_Mustang_Dark_Horse_Rutesheimer_Autoschau_2025_DSC_9225.jpg/1280px-Ford_Mustang_Dark_Horse_Rutesheimer_Autoschau_2025_DSC_9225.jpg",
        source: "https://commons.wikimedia.org/wiki/File:Ford_Mustang_Dark_Horse_Rutesheimer_Autoschau_2025_DSC_9225.jpg",
        alt: "Ford Mustang Dark Horse generasi ketujuh",
        tracks: [
            { name: "Laguna Seca", type: "Sirkuit teknis · California", meta: "3,6 km · Tantangan menengah" },
            { name: "Road America", type: "Sirkuit jalan raya · Wisconsin", meta: "6,5 km · Tantangan tinggi" },
            { name: "Pacific Coast Run", type: "Jalur pesisir · California", meta: "18,2 km · Tantangan santai" }
        ]
    },
    corvette: {
        number: "08 / 09",
        category: "AMERICAN ENGINEERING · MID-ENGINE",
        name: "Chevrolet Corvette Stingray",
        year: "2024",
        engine: "6.2L naturally aspirated V8",
        power: "495 hp",
        acceleration: "2,9 dtk",
        drivetrain: "RWD",
        description: "Tata letak mesin tengah membawa distribusi bobot yang berbeda pada ikon sport Amerika dengan V8 naturally aspirated.",
        image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4b/Chevrolet_Corvette_C8_IAA_2021_1X7A0156.jpg/1280px-Chevrolet_Corvette_C8_IAA_2021_1X7A0156.jpg",
        source: "https://commons.wikimedia.org/wiki/File:Chevrolet_Corvette_C8_IAA_2021_1X7A0156.jpg",
        alt: "Chevrolet Corvette generasi C8",
        tracks: [
            { name: "Road America", type: "Sirkuit jalan raya · Wisconsin", meta: "6,5 km · Tantangan tinggi" },
            { name: "Sebring International", type: "Sirkuit ketahanan · Florida", meta: "6,0 km · Tantangan tinggi" },
            { name: "Coastal Run", type: "Jalur pesisir · Pacific Coast", meta: "18,2 km · Tantangan santai" }
        ]
    },
    mclaren: {
        number: "09 / 09",
        category: "BRITISH ENGINEERING · SUPERCAR",
        name: "McLaren 720S",
        year: "2022",
        engine: "4.0L twin-turbo V8",
        power: "710 hp",
        acceleration: "2,9 dtk",
        drivetrain: "RWD",
        description: "Supercar bermesin tengah dengan konstruksi ringan, tenaga besar, dan fokus pada respons serta kelincahan.",
        image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/23/2018_McLaren_720S_V8_S-A_4.0.jpg/1280px-2018_McLaren_720S_V8_S-A_4.0.jpg",
        source: "https://commons.wikimedia.org/wiki/File:2018_McLaren_720S_V8_S-A_4.0.jpg",
        alt: "McLaren 720S",
        tracks: [
            { name: "Silverstone GP", type: "Sirkuit Grand Prix · Inggris", meta: "5,9 km · Tantangan tinggi" },
            { name: "Spa-Francorchamps", type: "Sirkuit cepat · Belgia", meta: "7,0 km · Tantangan tinggi" },
            { name: "Highland Sprint", type: "Jalur dataran tinggi · Skotlandia", meta: "22,1 km · Tantangan menengah" }
        ]
    }
};

const trackLocations = {
    "Spa-Francorchamps": {
        venue: "Circuit de Spa-Francorchamps",
        location: "Stavelot, Wallonia, Belgia"
    },
    "Laguna Seca": {
        venue: "WeatherTech Raceway Laguna Seca",
        location: "Monterey County, California, Amerika Serikat"
    },
    "Hakone Pass": {
        venue: "Hakone Turnpike",
        location: "Hakone, Prefektur Kanagawa, Jepang"
    },
    "Tsukuba Circuit": {
        venue: "Tsukuba Circuit",
        location: "Shimotsuma, Prefektur Ibaraki, Jepang"
    },
    "Coastal Run": {
        venue: "Pacific Coast Highway",
        location: "Pesisir California, Amerika Serikat"
    },
    "Fuji Speedway": {
        venue: "Fuji Speedway",
        location: "Oyama, Prefektur Shizuoka, Jepang"
    },
    "Autobahn Sprint": {
        venue: "Rute Autobahn (rute representatif)",
        location: "Jerman"
    },
    "Monza GP": {
        venue: "Autodromo Nazionale Monza",
        location: "Monza, Lombardy, Italia"
    },
    "Amalfi Coast Run": {
        venue: "Strada Statale 163 Amalfitana",
        location: "Pesisir Amalfi, Campania, Italia"
    },
    "Imola Circuit": {
        venue: "Autodromo Internazionale Enzo e Dino Ferrari",
        location: "Imola, Emilia-Romagna, Italia"
    },
    "Alpine Pass": {
        venue: "Stelvio Pass",
        location: "Tyrol Selatan, Italia"
    },
    "Nürburgring GP": {
        venue: "Nürburgring Grand Prix Circuit",
        location: "Nürburg, Rhineland-Palatinate, Jerman"
    },
    "Hockenheimring": {
        venue: "Hockenheimring Baden-Württemberg",
        location: "Hockenheim, Baden-Württemberg, Jerman"
    },
    "Black Forest Run": {
        venue: "Schwarzwaldhochstraße (B500)",
        location: "Black Forest, Baden-Württemberg, Jerman"
    },
    "Road America": {
        venue: "Road America",
        location: "Elkhart Lake, Wisconsin, Amerika Serikat"
    },
    "Pacific Coast Run": {
        venue: "Pacific Coast Highway · Big Sur",
        location: "Pesisir California, Amerika Serikat"
    },
    "Sebring International": {
        venue: "Sebring International Raceway",
        location: "Sebring, Florida, Amerika Serikat"
    },
    "Silverstone GP": {
        venue: "Silverstone Circuit",
        location: "Silverstone, Northamptonshire, Inggris"
    },
    "Highland Sprint": {
        venue: "North Coast 500",
        location: "Scottish Highlands, Skotlandia"
    }
};

function renderTracks(car) {
    trackSelect.replaceChildren();
    car.tracks.forEach((track, index) => {
        const option = document.createElement("option");
        option.value = String(index);
        option.textContent = track.name;
        trackSelect.append(option);
    });

    trackSelect.value = "0";
    updateTrackInfo(car.tracks[0]);
}

function updateTrackInfo(track) {
    const location = trackLocations[track.name];
    document.querySelector("#trackType").textContent = track.type;
    document.querySelector("#trackMeta").textContent = track.meta;
    document.querySelector("#trackVenue").textContent = location.venue;
    document.querySelector("#trackLocation").textContent = location.location;
    trackInfo.classList.remove("is-updating");
    requestAnimationFrame(() => trackInfo.classList.add("is-updating"));
}

trackSelect.addEventListener("change", () => {
    const activeCar = cars[document.querySelector(".car-option.is-active").dataset.car];
    const selectedTrack = activeCar.tracks[Number(trackSelect.value)];
    if (selectedTrack) {
        updateTrackInfo(selectedTrack);
    }
});

function selectCar(option) {
    const car = cars[option.dataset.car];
    if (!car || option.classList.contains("is-active")) {
        return;
    }

    carOptions.forEach((item) => {
        const isSelected = item === option;
        item.classList.toggle("is-active", isSelected);
        item.setAttribute("aria-pressed", String(isSelected));
    });

    document.querySelector("#carNumber").textContent = car.number;
    document.querySelector("#carCategory").textContent = car.category;
    document.querySelector("#carName").textContent = car.name;
    document.querySelector("#carYear").textContent = car.year;
    document.querySelector("#carEngine").textContent = car.engine;
    document.querySelector("#carPower").textContent = car.power;
    document.querySelector("#carAccel").textContent = car.acceleration;
    document.querySelector("#carDrive").textContent = car.drivetrain;
    document.querySelector("#carDescription").textContent = car.description;
    carImage.alt = car.alt;
    carImage.src = car.image;
    carImageSource.href = car.source;
    renderTracks(car);

    carShowcase.classList.remove("is-changing");
    requestAnimationFrame(() => {
        carShowcase.classList.add("is-changing");
    });
}

carOptions.forEach((option) => {
    option.addEventListener("click", () => selectCar(option));
});

function moveCarSelection(direction) {
    const activeIndex = Array.from(carOptions).findIndex((option) => option.classList.contains("is-active"));
    const nextIndex = (activeIndex + direction + carOptions.length) % carOptions.length;
    selectCar(carOptions[nextIndex]);
}

previousCarButton.addEventListener("click", () => moveCarSelection(-1));
nextCarButton.addEventListener("click", () => moveCarSelection(1));

renderTracks(cars[document.querySelector(".car-option.is-active").dataset.car]);

document.querySelectorAll(".driven-logo").forEach((logo) => {
    logo.addEventListener("click", () => {
        logo.classList.remove("is-animating");
        void logo.offsetWidth;
        logo.classList.add("is-animating");
    });

    logo.addEventListener("animationend", (event) => {
        if (event.animationName === "logo-word-flash") {
            logo.classList.remove("is-animating");
        }
    });
});

const pageTransition = document.querySelector("#pageTransition");
const navTargets = document.querySelectorAll(".site-navbar .navbar-nav a[href^=\"#\"]:not([href=\"#\"])");
let transitionTimer;
let navigationTimer;

navTargets.forEach((link) => {
    link.addEventListener("click", (event) => {
        const target = document.querySelector(link.getAttribute("href"));
        if (!target) {
            return;
        }

        event.preventDefault();
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            target.scrollIntoView({ behavior: "auto" });
            history.replaceState(null, "", link.getAttribute("href"));
            return;
        }

        window.clearTimeout(transitionTimer);
        window.clearTimeout(navigationTimer);
        pageTransition.classList.remove("is-active");
        void pageTransition.offsetWidth;
        pageTransition.classList.add("is-active");

        const expandedMenu = document.querySelector("#mainNav.show");
        if (expandedMenu && window.bootstrap) {
            window.bootstrap.Collapse.getOrCreateInstance(expandedMenu).hide();
        }

        navigationTimer = window.setTimeout(() => {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
            history.replaceState(null, "", link.getAttribute("href"));
        }, 300);

        transitionTimer = window.setTimeout(() => {
            pageTransition.classList.remove("is-active");
        }, 780);
    });
});

const revealTargets = document.querySelectorAll(".experience-cards, .garage-heading, .garage-layout, .community-section .container");
if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealTargets.forEach((target) => {
        target.classList.add("reveal-on-scroll");
        revealObserver.observe(target);
    });
}
