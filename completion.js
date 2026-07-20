"use strict";


/*
    ---------------------------------------------------
    PAGE ELEMENTS
    ---------------------------------------------------
*/

const dialogueText =
    document.getElementById("dialogue-text");

const dialogueMeasure =
    document.getElementById(
        "completion-dialogue-measure"
    );

const choiceList =
    document.getElementById("choice-list");

const choiceButtons = Array.from(
    document.querySelectorAll(".choice-button")
);

const fadeScreen =
    document.getElementById("fade-screen");


/*
    ---------------------------------------------------
    DIALOGUE
    ---------------------------------------------------
*/

const openingLines = [
    "IS THAT WHAT YOU SEEK. . . ?",
    "COMPLETION.",
    "AN ADMIRABLE OBJECTIVE INDEED.",
    "THEN, HOW WILL YOU ATTAIN IT?"
];


const choiceResponses = {
    violent: [
        "CURIOUS.",
        "THEN I AM INTRIGUED TO SEE HOW THAT SHOULD TURN OUT."
    ],

    pragmatic: [
        "LOGICAL.",
        "A RESPECTABLE WAY OF THINKING."
    ],

    peaceful: [
        "AN HONORABLE DISPOSITION.",
        "BUT WILL YOU MAINTAIN IT?"
    ]
};


/*
    ---------------------------------------------------
    TIMING
    ---------------------------------------------------
*/

const normalTypeSpeed = 95;
const commaPause = 260;
const periodPause = 320;
const ellipsisPause = 650;

const openingDelay = 1400;
const lineStartDelay = 180;
const choiceStartDelay = 950;
const responseStartDelay = 650;
const finalResponseDelay = 1800;

const choiceTypeSpeed = 85;
const delayBetweenChoices = 280;


/*
    ---------------------------------------------------
    STATE
    ---------------------------------------------------
*/

let currentLines = openingLines;
let currentLineIndex = 0;
let currentCharacterIndex = 0;

let typingTimer = null;

let isTyping = false;
let canAdvance = false;
let choicesVisible = false;
let choicesReady = false;
let responseChosen = false;
let transitionStarted = false;

let selectedChoiceIndex = 0;


/*
    ---------------------------------------------------
    DIALOGUE CENTERING
    ---------------------------------------------------
*/

function prepareCurrentLineWidth() {
    const fullLine =
        currentLines[currentLineIndex];

    dialogueMeasure.textContent =
        fullLine;

    dialogueMeasure.style.width =
        "max-content";

    const maximumWidth =
        Math.min(
            820,
            window.innerWidth * 0.88
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

    dialogueText.style.width =
        `${measuredWidth}px`;
}


/*
    ---------------------------------------------------
    MAIN TYPEWRITER
    ---------------------------------------------------
*/

function typeCurrentLine() {
    clearTimeout(typingTimer);

    prepareCurrentLineWidth();

    dialogueText.textContent = "";

    currentCharacterIndex = 0;
    isTyping = true;
    canAdvance = false;

    typeNextCharacter();
}


function typeNextCharacter() {
    const fullLine =
        currentLines[currentLineIndex];

    if (
        currentCharacterIndex >=
        fullLine.length
    ) {
        finishTypingLine();
        return;
    }

    dialogueText.textContent +=
        fullLine.charAt(
            currentCharacterIndex
        );

    const delay =
        getCharacterDelay(
            fullLine,
            currentCharacterIndex
        );

    currentCharacterIndex += 1;

    typingTimer = setTimeout(
        typeNextCharacter,
        delay
    );
}


function getCharacterDelay(line, index) {
    const character =
        line.charAt(index);

    const textSoFar =
        line.substring(
            0,
            index + 1
        );

    if (
        textSoFar.endsWith(". . .")
    ) {
        return ellipsisPause;
    }

    if (
        character === "." &&
        line
            .substring(index)
            .startsWith(". .")
    ) {
        return normalTypeSpeed;
    }

    if (character === ",") {
        return commaPause;
    }

    if (
        character === "." ||
        character === "?" ||
        character === "!"
    ) {
        return periodPause;
    }

    return normalTypeSpeed;
}


function finishTypingLine() {
    isTyping = false;

    const isLastLine =
        currentLineIndex ===
        currentLines.length - 1;

    if (
        isLastLine &&
        !responseChosen
    ) {
        setTimeout(
            beginChoicePresentation,
            choiceStartDelay
        );

        return;
    }

    if (
        isLastLine &&
        responseChosen
    ) {
        setTimeout(
            beginReliquaryTransition,
            finalResponseDelay
        );

        return;
    }

    canAdvance = true;
}


/*
    ---------------------------------------------------
    ADVANCING DIALOGUE
    ---------------------------------------------------
*/

function advanceDialogue() {
    if (
        transitionStarted ||
        choicesVisible
    ) {
        return;
    }

    if (isTyping) {
        completeCurrentLine();
        return;
    }

    if (!canAdvance) {
        return;
    }

    canAdvance = false;
    currentLineIndex += 1;

    setTimeout(
        typeCurrentLine,
        lineStartDelay
    );
}


function completeCurrentLine() {
    clearTimeout(typingTimer);

    dialogueText.textContent =
        currentLines[
            currentLineIndex
        ];

    finishTypingLine();
}


/*
    ---------------------------------------------------
    CHOICE SETUP
    ---------------------------------------------------
*/

function prepareChoiceButtons() {
    choiceButtons.forEach(
        (button) => {
            const fullText =
                button.dataset.label;

            button.innerHTML = "";

            const placeholder =
                document.createElement(
                    "span"
                );

            placeholder.className =
                "choice-placeholder";

            placeholder.textContent =
                fullText;

            const typedText =
                document.createElement(
                    "span"
                );

            typedText.className =
                "choice-typed";

            typedText.setAttribute(
                "aria-hidden",
                "true"
            );

            button.appendChild(
                placeholder
            );

            button.appendChild(
                typedText
            );

            button.classList.remove(
                "selected"
            );
        }
    );
}


/*
    ---------------------------------------------------
    CHOICE TYPEWRITER
    ---------------------------------------------------
*/

function beginChoicePresentation() {
    if (
        responseChosen ||
        transitionStarted
    ) {
        return;
    }

    choicesVisible = true;
    choicesReady = false;

    choiceList.hidden = false;

    choiceList.classList.remove(
        "ready"
    );

    prepareChoiceButtons();

    typeChoiceButton(
        0,
        () => {
            setTimeout(
                () => {
                    typeChoiceButton(
                        1,
                        () => {
                            setTimeout(
                                () => {
                                    typeChoiceButton(
                                        2,
                                        finishChoicePresentation
                                    );
                                },
                                delayBetweenChoices
                            );
                        }
                    );
                },
                delayBetweenChoices
            );
        }
    );
}


function finishChoicePresentation() {
    choicesReady = true;

    choiceList.classList.add(
        "ready"
    );

    selectedChoiceIndex = 0;

    updateSelectedChoice();
}


function typeChoiceButton(
    buttonIndex,
    onComplete
) {
    const button =
        choiceButtons[
            buttonIndex
        ];

    const fullText =
        button.dataset.label;

    const typedText =
        button.querySelector(
            ".choice-typed"
        );

    let characterIndex = 0;

    function typeNextChoiceCharacter() {
        if (
            characterIndex >=
            fullText.length
        ) {
            if (onComplete) {
                onComplete();
            }

            return;
        }

        typedText.textContent +=
            fullText.charAt(
                characterIndex
            );

        characterIndex += 1;

        setTimeout(
            typeNextChoiceCharacter,
            choiceTypeSpeed
        );
    }

    typeNextChoiceCharacter();
}


/*
    ---------------------------------------------------
    CHOICE SELECTION
    ---------------------------------------------------
*/

function updateSelectedChoice() {
    if (!choicesReady) {
        return;
    }

    choiceButtons.forEach(
        (button, index) => {
            button.classList.toggle(
                "selected",
                index ===
                    selectedChoiceIndex
            );
        }
    );
}


function moveChoice(direction) {
    if (
        !choicesVisible ||
        !choicesReady
    ) {
        return;
    }

    selectedChoiceIndex +=
        direction;

    if (
        selectedChoiceIndex < 0
    ) {
        selectedChoiceIndex =
            choiceButtons.length - 1;
    }

    if (
        selectedChoiceIndex >=
        choiceButtons.length
    ) {
        selectedChoiceIndex = 0;
    }

    updateSelectedChoice();
}


function selectCurrentChoice() {
    if (
        !choicesVisible ||
        !choicesReady
    ) {
        return;
    }

    const selectedButton =
        choiceButtons[
            selectedChoiceIndex
        ];

    choosePath(
        selectedButton.dataset.choice
    );
}


function choosePath(choiceName) {
    if (
        !choicesVisible ||
        !choicesReady ||
        responseChosen
    ) {
        return;
    }

    responseChosen = true;
    choicesVisible = false;
    choicesReady = false;

    localStorage.setItem(
        "completion_path",
        choiceName
    );

    dialogueText.textContent = "";

    choiceList.hidden = true;

    choiceList.classList.remove(
        "ready"
    );

    currentLines =
        choiceResponses[
            choiceName
        ];

    currentLineIndex = 0;

    setTimeout(
        typeCurrentLine,
        responseStartDelay
    );
}


/*
    ---------------------------------------------------
    RELIQUARY TRANSITION
    ---------------------------------------------------
*/

function beginReliquaryTransition() {
    if (transitionStarted) {
        return;
    }

    transitionStarted = true;

    fadeScreen.classList.add(
        "active"
    );

    setTimeout(
        () => {
            window.location.href =
                "reliquary.html";
        },
        1300
    );
}


/*
    ---------------------------------------------------
    MOUSE
    ---------------------------------------------------
*/

document.addEventListener(
    "click",
    (event) => {
        if (
            event.target.closest(
                ".choice-button"
            )
        ) {
            return;
        }

        advanceDialogue();
    }
);


choiceButtons.forEach(
    (button, index) => {
        button.addEventListener(
            "mouseenter",
            () => {
                if (!choicesReady) {
                    return;
                }

                selectedChoiceIndex =
                    index;

                updateSelectedChoice();
            }
        );

        button.addEventListener(
            "click",
            () => {
                choosePath(
                    button.dataset.choice
                );
            }
        );
    }
);


/*
    ---------------------------------------------------
    KEYBOARD
    ---------------------------------------------------
*/

document.addEventListener(
    "keydown",
    (event) => {
        const pressedKey =
            event.key.toLowerCase();

        if (choicesVisible) {
            if (
                pressedKey ===
                    "arrowup" ||
                pressedKey === "w"
            ) {
                event.preventDefault();

                moveChoice(-1);
                return;
            }

            if (
                pressedKey ===
                    "arrowdown" ||
                pressedKey === "s"
            ) {
                event.preventDefault();

                moveChoice(1);
                return;
            }

            if (
                pressedKey === "z" ||
                pressedKey ===
                    "enter" ||
                pressedKey === " "
            ) {
                event.preventDefault();

                selectCurrentChoice();
            }

            return;
        }

        if (
            pressedKey === "z" ||
            pressedKey === "enter" ||
            pressedKey === " "
        ) {
            event.preventDefault();

            advanceDialogue();
        }
    }
);


/*
    ---------------------------------------------------
    BEGIN
    ---------------------------------------------------
*/

setTimeout(
    typeCurrentLine,
    openingDelay
);