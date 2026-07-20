"use strict";


/*
    ===================================================
    ELEMENTS
    ===================================================
*/

const starField =
    document.getElementById("star-field");

const doorScene =
    document.getElementById("door-scene");

const doorPixel =
    document.getElementById("door-pixel");

const doorReveal =
    document.getElementById("door-reveal");

const doorButton =
    document.getElementById("door-button");

const reliquaryScene =
    document.getElementById("reliquary-scene");

const relicGallery =
    document.getElementById("relic-gallery");

const relicSlots = Array.from(
    document.querySelectorAll(".relic-slot")
);

const focusLayer =
    document.getElementById("focus-layer");

const fragmentStage =
    document.getElementById("fragment-stage");

const fragmentTravelStars =
    document.getElementById(
        "fragment-travel-stars"
    );

const fragmentButton =
    document.getElementById("fragment-button");

const fragmentImage =
    document.getElementById("fragment-image");

const readingStage =
    document.getElementById("reading-stage");

const dialogueMeasure =
    document.getElementById("dialogue-measure");

const relicDialogue =
    document.getElementById("relic-dialogue");

const returnButton =
    document.getElementById("return-button");

const sceneFade =
    document.getElementById("scene-fade");

const doorSound =
    document.getElementById("door-sound");

const creditsNoise =
    document.getElementById("credits-noise");


const soundtrackBack =
    document.getElementById("soundtrack-back");

const volumeControl =
    document.getElementById("volume-control");

const volumeButton =
    document.getElementById("volume-button");

const volumePanel =
    document.getElementById("volume-panel");

const volumeSlider =
    document.getElementById("volume-slider");


/*
    ===================================================
    ENDING ELEMENTS
    ===================================================
*/

const endingOverlay =
    document.createElement("section");

endingOverlay.className =
    "reliquary-ending";

endingOverlay.hidden = true;

endingOverlay.innerHTML = `
    <div class="ending-white"></div>

    <div class="ending-black">
        <div class="ending-question-wrap">
            <p
                class="ending-question-measure"
                aria-hidden="true"
            ></p>

            <p
                class="ending-question"
                aria-live="polite"
            ></p>
        </div>

        <div
            class="credit-screen credit-logo"
            data-credit-screen="logo"
            hidden
        >
            <img
                class="credit-logo-image"
                src="images/utp-logo.png"
                alt="Undertale Purple"
            >

            <p class="credit-subtitle">
                THE RELIQUARY
            </p>
        </div>

        <div
            class="credit-screen credit-music"
            data-credit-screen="music"
            hidden
        >
            <h2>MUSIC</h2>

            <div class="music-credit-grid">
                <div>
                    <p class="credit-work">
                        COMPLETION
                    </p>

                    <p class="credit-name">
                        ToeBeans
                    </p>
                </div>

                <div>
                    <p class="credit-work">
                        The Invitation
                    </p>

                    <p class="credit-name">
                        ToeBeans
                    </p>
                </div>

                <div>
                    <p class="credit-work">
                        The Witness
                    </p>

                    <p class="credit-name">
                        Hafuny
                    </p>
                </div>

                <div>
                    <p class="credit-work">
                        The Authority
                    </p>

                    <p class="credit-name">
                        Hafuny
                    </p>
                </div>

                <div>
                    <p class="credit-work">
                        The Synthesis
                    </p>

                    <p class="credit-name">
                        ToeBeans
                    </p>
                </div>

                <div>
                    <p class="credit-work">
                        The Fragment
                    </p>

                    <p class="credit-name">
                        Hafuny
                    </p>
                </div>
            </div>
        </div>

        <div
            class="credit-screen credit-production"
            data-credit-screen="production"
            hidden
        >
            <div class="production-credit">
                <h2>SPRITEWORK</h2>

                <p>ToeBeans</p>
            </div>

            <div class="production-credit">
                <h2>PROGRAMMING</h2>

                <p>ToeBeans</p>
            </div>
        </div>
    </div>
`;

document.body.appendChild(
    endingOverlay
);

const soundtrackEnd =
    document.getElementById("soundtrack-end");

const rememberText =
    document.getElementById("remember-text");

const soundtrackLink =
    document.getElementById("soundtrack-link");

const rememberMeasure =
    document.getElementById("remember-measure");

const soundtrackLinkMeasure =
    document.getElementById(
        "soundtrack-link-measure"
    );


const endingWhite =
    endingOverlay.querySelector(
        ".ending-white"
    );

const endingBlack =
    endingOverlay.querySelector(
        ".ending-black"
    );

const endingQuestionWrap =
    endingOverlay.querySelector(
        ".ending-question-wrap"
    );

const endingQuestionMeasure =
    endingOverlay.querySelector(
        ".ending-question-measure"
    );

const endingQuestion =
    endingOverlay.querySelector(
        ".ending-question"
    );

const creditScreens = Array.from(
    endingOverlay.querySelectorAll(
        ".credit-screen"
    )
);


/*
    ===================================================
    AUDIO
    ===================================================
*/

const reliquaryMusic =
    document.getElementById(
        "reliquary-music"
    );

const relicMusic = {
    invitation:
        document.getElementById(
            "music-invitation"
        ),

    witness:
        document.getElementById(
            "music-witness"
        ),

    authority:
        document.getElementById(
            "music-authority"
        ),

    synthesis:
        document.getElementById(
            "music-synthesis"
        ),

    fragment:
        document.getElementById(
            "music-fragment"
        )
};


[
    reliquaryMusic,
    ...Object.values(relicMusic),
    creditsNoise
].forEach((audioElement) => {
    if (!audioElement) {
        return;
    }

    audioElement.preload = "auto";
    audioElement.load();

    audioElement.addEventListener(
        "error",
        () => {
            console.error(
                "AUDIO FAILED:",
                audioElement.currentSrc
            );
        }
    );
});


if (reliquaryMusic) {
    reliquaryMusic.loop = true;
}


Object.values(relicMusic).forEach(
    (audioElement) => {
        if (audioElement) {
            audioElement.loop = true;
        }
    }
);


if (creditsNoise) {
    creditsNoise.loop = false;
}


const audioFadeFrames =
    new Map();


/*
    ===================================================
    MASTER VOLUME
    ===================================================
*/

const allAudioElements = [
    doorSound,
    reliquaryMusic,
    creditsNoise,
    ...Object.values(relicMusic)
].filter(Boolean);

let masterVolume =
    Number(volumeSlider.value) / 100;


function clampVolume(volume) {
    return Math.max(
        0,
        Math.min(
            1,
            Number(volume) || 0
        )
    );
}


function setAudioVolume(
    audioElement,
    intendedVolume
) {
    if (!audioElement) {
        return;
    }

    const safeVolume =
        clampVolume(
            intendedVolume
        );

    audioElement.dataset.intendedVolume =
        String(safeVolume);

    audioElement.volume =
        clampVolume(
            safeVolume *
            masterVolume
        );
}


function applyMasterVolume() {
    allAudioElements.forEach(
        (audioElement) => {
            const intendedVolume =
                Number(
                    audioElement.dataset
                        .intendedVolume ??
                    1
                );

            audioElement.volume =
                clampVolume(
                    intendedVolume *
                    masterVolume
                );
        }
    );
}


/*
    ===================================================
    RELIC DATA
    ===================================================
*/

const relicData = {
    invitation: {
        colors: [
            "#ff3047",
            "#a53eff"
        ],

        dialogue: [
            "AN INVITATION, WHETHER ACCEPTED OR IMPOSED, ALWAYS DRAWS ONE INTO SOMETHING NEW.",
            "WHEN HOPE RECEIVES THEIRS, IT IS UNCLEAR WHICH IT WILL BE.",
            "AFTER ALL, A PERFORMANCE ALWAYS NEEDS A CROWD."
        ]
    },

    witness: {
        colors: [
            "#ff912b"
        ],

        dialogue: [
            "TO WITNESS EVENTS DEEMED SUPERNATURAL IS TO STAND APART FROM OTHERS.",
            "IN THE UNDERGROUND, EVEN THE EARTH WITNESSES COUNTLESS THINGS LEFT UNEXPLAINED.",
            "WHEN THE WOOD BEARS ITS TESTIMONY, WILL HOPE ACCEPT WHAT STANDS BEFORE THEM?"
        ]
    },

    authority: {
        colors: [
            "#48e374",
            "#ffe452"
        ],

        dialogue: [
            "AUTHORITY, IN THE RIGHT HANDS, COMMANDS ORDER AND JUSTICE.",
            "BUT IF IT WERE TO FALL INTO THE POSSESSION OF THOSE DEEMED UNFIT...",
            "COULD THE UNWORTHY YET PROVE THEMSELVES?"
        ]
    },

    synthesis: {
        colors: [
            "#ff354e",
            "#3e7fff"
        ],

        dialogue: [
            "RELICS OF HUMAN MAGIC, ALL BUT ONE.",
            "A PRODIGY SETS HER SIGHTS ON REPLICATION. ON... SYNTHESIS.",
            "BUT IN HER PURSUIT OF PERFECTION, WILL SHE MISTAKE THE PAST FOR SOMETHING TO OVERCOME?"
        ]
    },

    fragment: {
        colors: [
            "#ffffff",
            "#b8b8c1",
            "#74747e"
        ],

        dialogue: [
            "A FRAGMENT, BOUND TO THE SOUL OF ANOTHER, SETS ITS SIGHTS ON COMPLETION.",
            "BUT HOW CAN ONE ATTAIN SUCH A THING WITHOUT FIRST REALIZING THEIR CONDITION?",
            "A PART IS JUST A PART, AFTER ALL.",
            "IT MAY THINK. IT MAY SPEAK. IT MAY EVEN REMEMBER.",
            "YET A MEMORY WITHOUT CONTEXT CAN EASILY MISTAKE ITSELF FOR THE WHOLE.",
            "PERHAPS COMPLETION IS NOT SOMETHING IT CAN ACHIEVE.",
            "PERHAPS IT IS SOMETHING IT HAS ALREADY LOST."
        ]
    }
};


/*
    ===================================================
    TIMING
    ===================================================
*/

const initialBlackDelay = 1100;
const pixelDisplayTime = 750;
const doorRevealDuration = 4200;

/*
    Faster disappearance of the unselected relics.
*/
const otherRelicFadeTime = 330;

const relicTravelDuration = 1050;

const typeSpeed = 48;
const commaPause = 155;
const sentencePause = 230;

const inputCooldown = 330;

const relicRevealGap = 360;

/*
    Fragment ending.
*/
const fragmentEndingPause = 1700;
const fragmentExitDuration = 2600;

const whiteHoldTime = 700;
const fragmentMusicFadeTime = 1200;
const blackFadeTime = 1400;
const blackQuestionDelay = 1200;

const endingQuestionSpeed = 68;

/*
    Credit screens.
*/
const logoCreditDuration = 4300;
const musicCreditDuration = 4300;
const productionCreditDuration = 4300;
const creditTransitionDuration = 650;


/*
    ===================================================
    STATE
    ===================================================
*/

let doorReady = false;
let doorEntered = false;

let selectedRelicName = null;
let activeFocusRelic = null;

const viewedRelics =
    new Set();

let dialogueLines = [];
let dialogueLineIndex = 0;
let dialogueCharacterIndex = 0;

let dialogueTyping = false;
let dialogueLineComplete = false;
let dialogueFinished = false;

let dialogueTimer = null;

let lastDialogueInputTime = 0;

let activeStarColors = [
    "#ffffff"
];

let fragmentEndingScheduled = false;
let endingStarted = false;

let endingQuestionTyping = false;
let endingQuestionComplete = false;

let creditsStarted = false;
let currentCreditIndex = -1;

let creditTimer = null;


/*
    ===================================================
    2× PIXEL SIZING
    ===================================================
*/

function applyDoubleSize(image) {
    if (
        !image ||
        image.dataset.doubled === "true" ||
        !image.naturalWidth ||
        !image.naturalHeight
    ) {
        return;
    }

    image.style.width =
        `${image.naturalWidth * 2}px`;

    image.style.height =
        `${image.naturalHeight * 2}px`;

    image.style.maxWidth = "none";
    image.style.maxHeight = "none";

    image.dataset.doubled = "true";
}


function preparePixelImages() {
    const images = Array.from(
        document.querySelectorAll(
            ".pixel-image"
        )
    );

    images.forEach((image) => {
        if (image.complete) {
            applyDoubleSize(image);
            return;
        }

        image.addEventListener(
            "load",
            () => {
                applyDoubleSize(image);
            },
            {
                once: true
            }
        );
    });
}


/*
    ===================================================
    MAIN STARS
    ===================================================
*/

const STAR_COUNT = 76;


function createMainStars() {
    starField.innerHTML = "";

    for (
        let index = 0;
        index < STAR_COUNT;
        index += 1
    ) {
        const star =
            document.createElement("span");

        star.className = "star";

        star.style.left =
            `${Math.random() * 100}%`;

        star.style.top =
            `${Math.random() * 100}%`;

        star.style.setProperty(
            "--star-size",
            `${1.5 + Math.random() * 2.7}px`
        );

        star.style.setProperty(
            "--star-duration",
            `${2.2 + Math.random() * 4.5}s`
        );

        star.style.setProperty(
            "--star-delay",
            `${Math.random() * -8}s`
        );

        starField.appendChild(star);
    }

    updateMainStarColors();
}


function updateMainStarColors() {
    const stars = Array.from(
        starField.querySelectorAll(
            ".star"
        )
    );

    stars.forEach((star) => {
        const color =
            activeStarColors[
                Math.floor(
                    Math.random() *
                    activeStarColors.length
                )
            ];

        star.style.setProperty(
            "--star-color",
            color
        );
    });
}


function setMainStarColors(colors) {
    activeStarColors = [
        ...colors
    ];

    updateMainStarColors();

    setTimeout(
        updateMainStarColors,
        260
    );

    setTimeout(
        updateMainStarColors,
        620
    );
}


/*
    ===================================================
    FRAGMENT TRAVEL STARS
    ===================================================
*/

function createFragmentTravelStars() {
    fragmentTravelStars.innerHTML = "";

    const colors = [
        "#ffffff",
        "#c3c3cb",
        "#85858f"
    ];

    for (
        let index = 0;
        index < 64;
        index += 1
    ) {
        const star =
            document.createElement("span");

        star.className =
            "travel-star";

        star.style.left =
            `${Math.random() * 100}%`;

        star.style.top =
            `${Math.random() * 145}%`;

        star.style.setProperty(
            "--travel-size",
            `${1 + Math.random() * 2.5}px`
        );

        star.style.setProperty(
            "--travel-duration",
            `${3.4 + Math.random() * 5.2}s`
        );

        star.style.setProperty(
            "--travel-delay",
            `${Math.random() * -8}s`
        );

        star.style.setProperty(
            "--travel-opacity",
            `${0.32 + Math.random() * 0.58}`
        );

        star.style.setProperty(
            "--travel-color",
            colors[
                Math.floor(
                    Math.random() *
                    colors.length
                )
            ]
        );

        fragmentTravelStars.appendChild(
            star
        );
    }
}


/*
    ===================================================
    DOOR
    ===================================================
*/

function beginDoorSequence() {
    setTimeout(() => {
        doorPixel.classList.add(
            "visible"
        );
    }, initialBlackDelay);

    setTimeout(() => {
        doorPixel.classList.add(
            "hidden"
        );

        doorReveal.classList.add(
            "visible"
        );
    }, (
        initialBlackDelay +
        pixelDisplayTime
    ));

    setTimeout(() => {
        doorReady = true;

        doorButton.disabled = false;

        doorButton.classList.add(
            "ready"
        );
    }, (
        initialBlackDelay +
        pixelDisplayTime +
        doorRevealDuration
    ));
}


function enterReliquary() {
    if (
        !doorReady ||
        doorEntered
    ) {
        return;
    }

    doorEntered = true;
    doorReady = false;

    doorButton.disabled = true;

    doorScene.classList.add(
        "removed"
    );

    cancelAudioFade(
        doorSound
    );

    doorSound.pause();
    doorSound.currentTime = 0;

    setAudioVolume(
        doorSound,
        0.92
    );

    doorSound.play().catch(() => {});

    startAudio(
        reliquaryMusic,
        0
    );

    sceneFade.classList.add(
        "active"
    );

    setTimeout(() => {
        reliquaryScene.hidden = false;

        createMainStars();

        setMainStarColors([
            "#ffffff"
        ]);

        starField.classList.add(
            "visible"
        );

        requestAnimationFrame(() => {
            reliquaryScene.classList.add(
                "visible"
            );
        });

        setTimeout(() => {
            sceneFade.classList.remove(
                "active"
            );

            revealAvailableRelics();

            fadeAudio(
                reliquaryMusic,
                0.48,
                2100
            );
        }, 420);

    }, 720);
}


/*
    ===================================================
    LEFT-TO-RIGHT RELIC REVEAL
    ===================================================
*/

function revealAvailableRelics() {
    const availableSlots =
        relicSlots.filter(
            (slot) =>
                !slot.classList.contains(
                    "removed"
                )
        );

    relicGallery.classList.remove(
        "revealing"
    );

    relicSlots.forEach((slot) => {
        slot.classList.remove(
            "available"
        );

        slot.style.transitionDelay =
            "0ms";
    });

    void relicGallery.offsetWidth;

    relicGallery.classList.add(
        "revealing"
    );

    availableSlots.forEach(
        (slot, visibleIndex) => {
            slot.style.transitionDelay =
                `${visibleIndex * relicRevealGap}ms`;

            slot.classList.add(
                "available"
            );
        }
    );
}


/*
    ===================================================
    RELIC SELECTION
    ===================================================
*/

function selectRelic(relicName) {
    if (selectedRelicName !== null) {
        return;
    }

    const slot =
        relicSlots.find(
            (relicSlot) =>
                relicSlot.dataset.relic ===
                relicName
        );

    const data =
        relicData[relicName];

    const music =
        relicMusic[relicName];

    if (
        !slot ||
        !data ||
        !music ||
        slot.classList.contains(
            "removed"
        )
    ) {
        return;
    }

    const sourceImage =
        slot.querySelector(
            ".relic-image"
        );

    selectedRelicName =
        relicName;

    relicSlots.forEach((relicSlot) => {
        const button =
            relicSlot.querySelector(
                ".relic-button"
            );

        button.disabled = true;
    });

    startAudio(
        music,
        0
    );

    fadeAudio(
        reliquaryMusic,
        0,
        500,
        true
    );

    setMainStarColors(
        data.colors
    );

    activeFocusRelic =
        createFocusRelic(
            sourceImage
        );

    slot.classList.add(
        "chosen"
    );

    relicGallery.classList.add(
        "selecting"
    );

    setTimeout(() => {
        moveFocusRelicToCenter(
            activeFocusRelic
        );

        fadeAudio(
            music,
            0.72,
            1400
        );

        setTimeout(() => {
            beginDialogue(
                data.dialogue
            );
        }, relicTravelDuration);

    }, otherRelicFadeTime);
}


function createFocusRelic(sourceImage) {
    const rectangle =
        sourceImage.getBoundingClientRect();

    const wrapper =
        document.createElement("div");

    const image =
        sourceImage.cloneNode(true);

    image.removeAttribute("style");
    image.removeAttribute("id");

    image.style.width = "100%";
    image.style.height = "100%";
    image.style.maxWidth = "none";
    image.style.maxHeight = "none";

    wrapper.className =
        "focus-relic";

    wrapper.style.left =
        `${rectangle.left}px`;

    wrapper.style.top =
        `${rectangle.top}px`;

    wrapper.style.width =
        `${rectangle.width}px`;

    wrapper.style.height =
        `${rectangle.height}px`;

    wrapper.style.transform =
        "translate3d(0, 0, 0)";

    wrapper.appendChild(image);
    focusLayer.appendChild(wrapper);

    void wrapper.offsetWidth;

    return wrapper;
}


function moveFocusRelicToCenter(
    focusRelic
) {
    if (!focusRelic) {
        return;
    }

    const currentRectangle =
        focusRelic.getBoundingClientRect();

    const scale =
        Math.min(
            1.28,
            320 / currentRectangle.width
        );

    const targetX =
        (
            window.innerWidth / 2
        ) -
        (
            currentRectangle.left +
            currentRectangle.width / 2
        );

    const targetY =
        (
            window.innerHeight * 0.34
        ) -
        (
            currentRectangle.top +
            currentRectangle.height / 2
        );

    focusRelic.style.transform =
        `translate3d(
            ${targetX}px,
            ${targetY}px,
            0
        ) scale(${scale})`;
}


/*
    ===================================================
    DIALOGUE
    ===================================================
*/

function beginDialogue(lines) {
    clearTimeout(dialogueTimer);

    dialogueLines = [
        ...lines
    ];

    dialogueLineIndex = 0;
    dialogueCharacterIndex = 0;

    dialogueTyping = false;
    dialogueLineComplete = false;
    dialogueFinished = false;

    fragmentEndingScheduled = false;

    relicDialogue.textContent = "";
    returnButton.hidden = true;

    readingStage.hidden = false;

    prepareCurrentLine();
    typeNextCharacter();
}


function prepareCurrentLine() {
    const line =
        dialogueLines[
            dialogueLineIndex
        ];

    dialogueMeasure.textContent =
        line;

    dialogueMeasure.style.width =
        "max-content";

    const maximumWidth =
        Math.min(
            1120,
            window.innerWidth * 0.92
        );

    const measuredWidth =
        Math.min(
            Math.ceil(
                dialogueMeasure
                    .getBoundingClientRect()
                    .width
            ) + 4,
            maximumWidth
        );

    relicDialogue.style.width =
        `${measuredWidth}px`;

    relicDialogue.textContent = "";

    dialogueCharacterIndex = 0;
    dialogueTyping = true;
    dialogueLineComplete = false;
}


function typeNextCharacter() {
    const line =
        dialogueLines[
            dialogueLineIndex
        ];

    typeDialogueStyleText({
        element: relicDialogue,
        text: line,

        getIndex: () =>
            dialogueCharacterIndex,

        setIndex: (nextIndex) => {
            dialogueCharacterIndex =
                nextIndex;
        },

        setTimer: (timer) => {
            dialogueTimer =
                timer;
        },

        onComplete:
            finishTypedLine
    });
}


function getCharacterDelay(character) {
    if (character === ",") {
        return commaPause;
    }

    if (
        character === "." ||
        character === "?" ||
        character === "!"
    ) {
        return sentencePause;
    }

    return typeSpeed;
}


function typeDialogueStyleText({
    element,
    text,
    getIndex,
    setIndex,
    setTimer,
    onComplete
}) {
    const characterIndex =
        getIndex();

    if (
        characterIndex >=
        text.length
    ) {
        onComplete();
        return;
    }

    const character =
        text.charAt(
            characterIndex
        );

    element.textContent +=
        character;

    setIndex(
        characterIndex + 1
    );

    setTimer(
        setTimeout(
            () => {
                typeDialogueStyleText({
                    element,
                    text,
                    getIndex,
                    setIndex,
                    setTimer,
                    onComplete
                });
            },
            getCharacterDelay(
                character
            )
        )
    );
}


function finishTypedLine() {
    dialogueTyping = false;
    dialogueLineComplete = true;

    const isFinalLine =
        dialogueLineIndex ===
        dialogueLines.length - 1;

    if (
        selectedRelicName === "fragment" &&
        isFinalLine
    ) {
        scheduleFragmentEnding();
    }
}


function advanceDialogue() {
    const now =
        performance.now();

    if (
        now -
        lastDialogueInputTime <
        inputCooldown
    ) {
        return;
    }

    lastDialogueInputTime = now;

    if (
        endingQuestionComplete &&
        !creditsStarted
    ) {
        beginCreditsImmediately();
        return;
    }

    if (
        readingStage.hidden ||
        dialogueFinished ||
        endingStarted
    ) {
        return;
    }

    if (dialogueTyping) {
        finishCurrentLineImmediately();
        return;
    }

    if (!dialogueLineComplete) {
        return;
    }

    const isFinalLine =
        dialogueLineIndex ===
        dialogueLines.length - 1;

    if (isFinalLine) {
        dialogueFinished = true;
        dialogueLineComplete = false;

        if (
            selectedRelicName !==
            "fragment"
        ) {
            returnButton.hidden = false;
        }

        return;
    }

    dialogueLineIndex += 1;

    prepareCurrentLine();
    typeNextCharacter();
}


function finishCurrentLineImmediately() {
    clearTimeout(dialogueTimer);

    relicDialogue.textContent =
        dialogueLines[
            dialogueLineIndex
        ];

    dialogueCharacterIndex =
        dialogueLines[
            dialogueLineIndex
        ].length;

    finishTypedLine();
}


/*
    ===================================================
    RETURN FROM MAIN RELIC
    ===================================================
*/

function returnFromReading() {
    if (
        selectedRelicName === null ||
        selectedRelicName === "fragment"
    ) {
        return;
    }

    clearTimeout(dialogueTimer);

    const leavingName =
        selectedRelicName;

    const leavingMusic =
        relicMusic[leavingName];

    readingStage.hidden = true;
    returnButton.hidden = true;

    relicDialogue.textContent = "";

    const selectedSlot =
        relicSlots.find(
            (slot) =>
                slot.dataset.relic ===
                leavingName
        );

    viewedRelics.add(
        leavingName
    );

    const allMainRelicsViewed =
        viewedRelics.size === 4;

    if (allMainRelicsViewed) {
        fadeAudio(
            leavingMusic,
            0,
            350,
            true
        );
    }
    else {
        fadeAudio(
            leavingMusic,
            0,
            750,
            true
        );

        startAudio(
            reliquaryMusic,
            0
        );

        setTimeout(() => {
            fadeAudio(
                reliquaryMusic,
                0.48,
                1450
            );
        }, 150);
    }

    if (activeFocusRelic) {
        activeFocusRelic.style.opacity =
            "0";
    }

    setTimeout(() => {
        if (activeFocusRelic) {
            activeFocusRelic.remove();
            activeFocusRelic = null;
        }

        if (selectedSlot) {
            selectedSlot.classList.add(
                "removed"
            );

            selectedSlot.classList.remove(
                "chosen",
                "available"
            );

            selectedSlot.style
                .transitionDelay = "0ms";
        }

        relicGallery.classList.remove(
            "selecting"
        );

        selectedRelicName = null;

        if (allMainRelicsViewed) {
            showFragment();
            return;
        }

        setMainStarColors([
            "#ffffff"
        ]);

        relicSlots.forEach((slot) => {
            if (
                !slot.classList.contains(
                    "removed"
                )
            ) {
                const button =
                    slot.querySelector(
                        ".relic-button"
                    );

                button.disabled = false;
            }
        });

        revealAvailableRelics();

    }, 620);
}


/*
    ===================================================
    FRAGMENT
    ===================================================
*/

function showFragment() {
    relicGallery.hidden = true;

    fadeAudio(
        reliquaryMusic,
        0,
        300,
        true
    );

    setMainStarColors([
        "#ffffff",
        "#b8b8c1",
        "#74747e"
    ]);

    starField.classList.add(
        "visible"
    );

    fragmentTravelStars.innerHTML = "";

    fragmentTravelStars.classList.remove(
        "visible",
        "ending"
    );

    fragmentStage.hidden = false;

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            fragmentStage.classList.add(
                "visible"
            );
        });
    });
}


function selectFragment() {
    if (selectedRelicName !== null) {
        return;
    }

    selectedRelicName = "fragment";
    fragmentButton.disabled = true;

    starField.classList.remove(
        "visible"
    );

    createFragmentTravelStars();

    setTimeout(() => {
        fragmentTravelStars.classList.add(
            "visible"
        );

        fragmentStage.classList.add(
            "travelling"
        );
    }, 220);

    startAudio(
        relicMusic.fragment,
        0
    );

    fadeAudio(
        relicMusic.fragment,
        0.72,
        1500
    );

    setTimeout(() => {
        beginDialogue(
            relicData.fragment.dialogue
        );
    }, 1600);
}


/*
    ===================================================
    FRAGMENT ENDING
    ===================================================
*/

function scheduleFragmentEnding() {
    if (
        fragmentEndingScheduled ||
        endingStarted
    ) {
        return;
    }

    fragmentEndingScheduled = true;
    dialogueFinished = true;

    setTimeout(
        beginFragmentEnding,
        fragmentEndingPause
    );
}


function beginFragmentEnding() {
    if (endingStarted) {
        return;
    }

    endingStarted = true;

    readingStage.hidden = true;
    returnButton.hidden = true;

    endingOverlay.hidden = false;

    const fragmentRectangle =
        fragmentButton.getBoundingClientRect();

    const fragmentCenterY =
        fragmentRectangle.top +
        fragmentRectangle.height / 2;

    const distanceToTop =
        fragmentCenterY +
        fragmentRectangle.height / 2 +
        20;

    fragmentButton.style.setProperty(
        "--fragment-exit-distance",
        `${distanceToTop}px`
    );

    fragmentButton.style.setProperty(
        "--fragment-exit-duration",
        `${fragmentExitDuration}ms`
    );

    endingWhite.style.setProperty(
        "--fragment-exit-duration",
        `${fragmentExitDuration}ms`
    );

    fragmentStage.classList.add(
        "ending-rise"
    );

    fragmentTravelStars.classList.add(
        "ending"
    );

    requestAnimationFrame(() => {
        endingOverlay.classList.add(
            "active"
        );

        endingWhite.classList.add(
            "visible"
        );
    });

    /*
        Fragment and white fade finish together.
        Music remains present until white is complete.
    */

    setTimeout(() => {
        fadeAudio(
            relicMusic.fragment,
            0,
            fragmentMusicFadeTime,
            true
        );

        setTimeout(() => {
            endingBlack.classList.add(
                "visible"
            );

            endingWhite.classList.remove(
                "visible"
            );

            setTimeout(() => {
                typeEndingQuestion(
                    "WELL, DID YOU FIND WHAT YOU WERE LOOKING FOR?"
                );
            }, (
                blackFadeTime +
                blackQuestionDelay
            ));

        }, (
            whiteHoldTime +
            fragmentMusicFadeTime
        ));

    }, fragmentExitDuration);
}


function prepareEndingQuestion(text) {
    endingQuestionMeasure.textContent =
        text;

    endingQuestionMeasure.style.width =
        "max-content";

    const maximumWidth =
        Math.min(
            1000,
            window.innerWidth * 0.9
        );

    const measuredWidth =
        Math.min(
            Math.ceil(
                endingQuestionMeasure
                    .getBoundingClientRect()
                    .width
            ) + 4,
            maximumWidth
        );

    endingQuestion.style.width =
        `${measuredWidth}px`;
}


function typeEndingQuestion(text) {
    endingQuestionTyping = true;
    endingQuestionComplete = false;

    endingQuestionWrap.hidden = false;
    endingQuestion.textContent = "";

    prepareEndingQuestion(text);

    let characterIndex = 0;

    function typeNextEndingCharacter() {
        if (
            characterIndex >=
            text.length
        ) {
            endingQuestionTyping = false;
            endingQuestionComplete = true;
            return;
        }

        endingQuestion.textContent +=
            text.charAt(
                characterIndex
            );

        characterIndex += 1;

        setTimeout(
            typeNextEndingCharacter,
            endingQuestionSpeed
        );
    }

    typeNextEndingCharacter();
}


/*
    ===================================================
    CREDITS
    ===================================================
*/

function beginCreditsImmediately() {
    if (
        creditsStarted ||
        !endingQuestionComplete
    ) {
        return;
    }

    creditsStarted = true;
    endingQuestionComplete = false;

    endingQuestionWrap.hidden = true;

    /*
        No delay here. The title appears in the same
        input frame that dismisses the final question.
    */

    showCreditScreen(0);
}


function playCreditsNoise() {
    if (!creditsNoise) {
        return;
    }

    cancelAudioFade(
        creditsNoise
    );

    creditsNoise.pause();
    creditsNoise.currentTime = 0;

    setAudioVolume(
        creditsNoise,
        0.9
    );

    creditsNoise.play().catch(() => {});
}


function showCreditScreen(index) {
    clearTimeout(creditTimer);

    creditScreens.forEach((screen) => {
        screen.hidden = true;

        screen.classList.remove(
            "visible",
            "leaving"
        );
    });

    currentCreditIndex = index;

    if (
        currentCreditIndex >=
        creditScreens.length
    ) {
        finishCredits();
        return;
    }

    const screen =
        creditScreens[
            currentCreditIndex
        ];

    screen.hidden = false;

    playCreditsNoise();

    /*
        The first credit appears immediately.
    */

    screen.classList.add(
        "visible"
    );

    let duration =
        logoCreditDuration;

    if (currentCreditIndex === 1) {
        duration =
            musicCreditDuration;
    }

    if (currentCreditIndex === 2) {
        duration =
            productionCreditDuration;
    }

    creditTimer = setTimeout(() => {
        screen.classList.add(
            "leaving"
        );

        creditTimer = setTimeout(() => {
            showCreditScreen(
                currentCreditIndex + 1
            );
        }, creditTransitionDuration);

    }, duration);
}


function finishCredits() {
    clearTimeout(creditTimer);

    playCreditsNoise();

    /*
        Instant cut to black.
        No fade.
    */

    creditScreens.forEach((screen) => {
    screen.hidden = true;

    screen.classList.remove(
        "visible",
        "leaving"
    );
});

beginSoundtrackEnding();

    endingBlack.classList.add(
        "credits-finished"

        
    );
}


/*
    ===================================================
    AUDIO HELPERS
    ===================================================
*/

async function startAudio(
    audioElement,
    startingVolume = 0
) {
    if (!audioElement) {
        return false;
    }

    cancelAudioFade(
        audioElement
    );

    audioElement.pause();
    audioElement.currentTime = 0;

    setAudioVolume(
        audioElement,
        startingVolume
    );

    try {
        await audioElement.play();

        return true;
    }
    catch (error) {
        console.warn(
            "Audio playback was blocked:",
            audioElement.currentSrc,
            error
        );

        return false;
    }
}


function fadeAudio(
    audioElement,
    targetVolume,
    duration,
    stopAtEnd = false
) {
    if (!audioElement) {
        return;
    }

    cancelAudioFade(
        audioElement
    );

    const startVolume =
        Number(
            audioElement.dataset
                .intendedVolume ??
            0
        );

    const endVolume =
        clampVolume(
            targetVolume
        );

    const startTime =
        performance.now();

    function updateFade(now) {
        const progress =
            Math.min(
                1,
                (
                    now -
                    startTime
                ) /
                Math.max(
                    1,
                    duration
                )
            );

        const easedProgress =
            1 -
            Math.pow(
                1 - progress,
                3
            );

        const currentVolume =
            startVolume +
            (
                endVolume -
                startVolume
            ) *
            easedProgress;

        setAudioVolume(
            audioElement,
            currentVolume
        );

        if (progress < 1) {
            const frame =
                requestAnimationFrame(
                    updateFade
                );

            audioFadeFrames.set(
                audioElement,
                frame
            );

            return;
        }

        audioFadeFrames.delete(
            audioElement
        );

        setAudioVolume(
            audioElement,
            endVolume
        );

        if (
            stopAtEnd &&
            endVolume <= 0.001
        ) {
            audioElement.pause();
            audioElement.currentTime = 0;
        }
    }

    const frame =
        requestAnimationFrame(
            updateFade
        );

    audioFadeFrames.set(
        audioElement,
        frame
    );
}


function cancelAudioFade(
    audioElement
) {
    const existingFrame =
        audioFadeFrames.get(
            audioElement
        );

    if (
        existingFrame !==
        undefined
    ) {
        cancelAnimationFrame(
            existingFrame
        );

        audioFadeFrames.delete(
            audioElement
        );
    }
}

function prepareMeasuredTyping(
    element,
    measureElement,
    text,
    maximumWidth
) {
    measureElement.textContent =
        text;

    measureElement.style.width =
        "max-content";

    const measuredWidth =
        Math.min(
            Math.ceil(
                measureElement
                    .getBoundingClientRect()
                    .width
            ) + 4,
            maximumWidth
        );

    element.style.width =
        `${measuredWidth}px`;
}


function typeMeasuredEndingText(
    element,
    measureElement,
    text,
    done
) {
    clearTimeout(
        element._typingTimer
    );

    prepareMeasuredTyping(
        element,
        measureElement,
        text,
        Math.min(
            1120,
            window.innerWidth * 0.92
        )
    );

    element.textContent = "";

    let characterIndex = 0;

    typeDialogueStyleText({
        element,
        text,

        getIndex: () =>
            characterIndex,

        setIndex: (nextIndex) => {
            characterIndex =
                nextIndex;
        },

        setTimer: (timer) => {
            element._typingTimer =
                timer;
        },

        onComplete: () => {
            if (done) {
                done();
            }
        }
    });
}


function beginSoundtrackEnding() {
    soundtrackEnd.hidden = false;

    rememberText.textContent = "";
    soundtrackLink.textContent = "";

    soundtrackBack.hidden = true;

    soundtrackBack.classList.remove(
        "visible"
    );

    typeMeasuredEndingText(
            rememberText,
            rememberMeasure,
            "SHOULD YOU WISH TO REMEMBER.",
            () => {
                setTimeout(() => {
                    typeMeasuredEndingText(
                        soundtrackLink,
                        soundtrackLinkMeasure,
                        "ORIGINAL SOUNDTRACK",
                        () => {
                            setTimeout(() => {
                                soundtrackBack.hidden =
                                    false;

                                requestAnimationFrame(
                                    () => {
                                        requestAnimationFrame(
                                            () => {
                                                soundtrackBack
                                                    .classList
                                                    .add(
                                                        "visible"
                                                    );
                                            }
                                        );
                                    }
                                );
                            }, 900);
                        }
                    );
                }, 800);
            }
        );
}


function updateVolumeDisplay() {
    const percentage =
        Number(
            volumeSlider.value
        );

    volumeSlider.style.setProperty(
        "--volume-fill",
        `${percentage}%`
    );

    volumeButton.textContent =
        percentage === 0
            ? "VOLUME: OFF"
            : `VOLUME: ${percentage}%`;
}


/*
    ===================================================
    EVENTS
    ===================================================
*/


soundtrackBack.addEventListener(
    "click",
    (event) => {
        event.preventDefault();
        event.stopPropagation();

        const homePageUrl =
            new URL(
                "./index.html",
                window.location.href
            );

        window.location.replace(
            homePageUrl.href
        );
    }
);


volumeButton.addEventListener(
    "click",
    (event) => {
        event.stopPropagation();

        const opening =
            volumePanel.hidden;

        volumePanel.hidden =
            !opening;

        volumeControl.classList.toggle(
            "open",
            opening
        );

        volumeButton.setAttribute(
            "aria-expanded",
            String(opening)
        );
    }
);


volumePanel.addEventListener(
    "pointerup",
    (event) => {
        event.stopPropagation();
    }
);


volumeSlider.addEventListener(
    "input",
    () => {
        masterVolume =
            Number(
                volumeSlider.value
            ) / 100;

        applyMasterVolume();
        updateVolumeDisplay();
    }
);


doorButton.addEventListener(
    "click",
    enterReliquary
);


relicSlots.forEach((slot) => {
    const relicName =
        slot.dataset.relic;

    const button =
        slot.querySelector(
            ".relic-button"
        );

    button.addEventListener(
        "click",
        () => {
            selectRelic(
                relicName
            );
        }
    );
});


fragmentButton.addEventListener(
    "click",
    selectFragment
);


returnButton.addEventListener(
    "click",
    (event) => {
        event.stopPropagation();

        returnFromReading();
    }
);


document.addEventListener(
    "pointerup",
    (event) => {
        if (
            event.target.closest(
                ".door-button"
            ) ||
            event.target.closest(
                ".relic-button"
            ) ||
            event.target.closest(
                ".fragment-button"
            ) ||
            event.target.closest(
                ".return-button"
            ) ||
            event.target.closest(
                "#volume-control"
            ) ||
            event.target.closest(
                "#soundtrack-end"
            )
        ) {
            return;
        }

        if (endingQuestionTyping) {
            return;
        }

        advanceDialogue();
    }
);


document.addEventListener(
    "keydown",
    (event) => {
        const key =
            event.key.toLowerCase();

        if (
            key !== "z" &&
            key !== "enter" &&
            key !== " "
        ) {
            return;
        }

        event.preventDefault();

        if (endingQuestionTyping) {
            return;
        }

        advanceDialogue();
    }
);


/*
    ===================================================
    BEGIN
    ===================================================
*/

preparePixelImages();
beginDoorSequence();