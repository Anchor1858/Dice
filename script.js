// ======================================================
// 1. Language Data
// ======================================================

const TEXT = {

    zh: {

        languageName: "中文",

        title: "骰子出目概率计算器",

        help: "ⓘ",

        calculate: "计算概率",

        // Sentence 1

        throw: "投掷",

        dice: "枚",

        sides: "面骰，修正",

        target: "，目标值",

        custom: "其它",

        customTarget: "输入目标值",

        // Sentence 2

        times: "次",

        probability: "的概率为：",

        all: "全部",

        atLeastOnce: "至少一次",

        success: "成功",

        failure: "失败",

        // Help Dialog

        helpTitle: "使用说明",

        helpText: `
            <p>这是一个用于计算骰子出目概率的计算器。</p >

            <p>
                预设的使用场景是多元恐怖TRPG inSANe规则，也就是说
                <strong>成功的定义是大于等于目标值，失败的定义是小于目标值。</strong>
            </p >

            <p>
                通过调整骰子面数和反向设置目标值等方法，
                或许也可用于其它TRPG规则。
            </p >

            <p>
                修正值可直接整合进目标值，
                但游玩过程中务必不要忘记自己的修正！
            </p >
        `,

        close: "关闭",

        // Probability Comments

        comments: [

            {
                min: 1.0,
                text: "👍"
            },

            {
                min: 0.6,
                text: "真是容易得一不小心就会让人放松警惕呢"
            },

            {
                min: 0.4,
                text: "会赢吗"
            },

            {
                min: Number.MIN_VALUE,
                text: "骰门"
            },

            {
                min: 0,
                text: "阿门"
            }

        ]

    },



    en: {

        languageName: "English",

        title: "Dice Roll Probability Calculator",

        help: "ⓘ",

        calculate: "Calculate",

        // Sentence 1

        throw: "Roll",

        dice: "",

        sides: "-sided dice, modifier",

        target: ", target",

        custom: "Custom",

        customTarget: "Enter target",

        // Sentence 2

        times: "times, the probability of",

        probability: "is:",

        all: "all",

        atLeastOnce: "at least one",

        success: "success",

        failure: "failure",

        // Help Dialog

        helpTitle: "Instructions",

        helpText: `
            <p>
                This calculator is designed to calculate the probability of dice rolls.
            </p >

            <p>
                Default mode is based on the multigenre horror RPG
                inSANe, where
                <strong>
                    success means the result is equal to or greater than
                    the target value, while failure means it is smaller.
                </strong>
            </p >

            <p>
                It may also be useful for other TRPG systems by adjusting
                the number of sides or reversing the target value.
            </p >

            <p>
                Modifier can be integrated into the target,
                just don't forget them.
            </p >
        `,

        close: "Close",

        // Probability Comments

        comments: [

            {
                min: 1.0,
                text: "👍"
            },

            {
                min: 0.6,
                text: "Now that is winnability"
            },

            {
                min: 0.4,
                text: "Nice try"
            },

            {
                min: Number.MIN_VALUE,
                text: "Time to start praying"
            },

            {
                min: 0,
                text: "RIP"
            }

        ]

    }

};

// ======================================================
// 2. DOM References
// ======================================================

const UI = {

    // ------------------------------
    // Header
    // ------------------------------

    title: document.getElementById("title"),

    helpButton: document.getElementById("helpButton"),

    language: document.getElementById("language"),


    // ------------------------------
    // Sentence 1
    // ------------------------------

    textThrow1: document.getElementById("textThrow1"),

    diceCount: document.getElementById("diceCount"),

    textDice: document.getElementById("textDice"),

    diceSides: document.getElementById("diceSides"),

    textSides: document.getElementById("textSides"),

    modifier: document.getElementById("modifier"),

    textTarget: document.getElementById("textTarget"),

    targetMode: document.getElementById("targetMode"),


    // ------------------------------
    // Custom Target
    // ------------------------------

    customTargetArea: document.getElementById("customTargetArea"),

    customTargetLabel: document.getElementById("customTargetLabel"),

    customTarget: document.getElementById("customTarget"),


    // ------------------------------
    // Sentence 2
    // ------------------------------

    textThrow2: document.getElementById("textThrow2"),

    times: document.getElementById("times"),

    textTimes: document.getElementById("textTimes"),

    mode: document.getElementById("mode"),

    resultType: document.getElementById("resultType"),

    textProbability: document.getElementById("textProbability"),


    // ------------------------------
    // Buttons
    // ------------------------------

    calcButton: document.getElementById("calcButton"),


    // ------------------------------
    // Result
    // ------------------------------

    result: document.getElementById("result"),

    comment: document.getElementById("comment"),


    // ------------------------------
    // Help Dialog
    // ------------------------------

    helpDialog: document.getElementById("helpDialog"),

    helpTitle: document.getElementById("helpTitle"),

    helpContent: document.getElementById("helpContent"),

    closeHelp: document.getElementById("closeHelp")

};

// ======================================================
// 3. Constants
// ======================================================

// Dice Count
// Corresponds to:
// choices = [1 ~ 10]
const DICE_COUNTS = [];

for (let i = 1; i <= 10; i++) {
    DICE_COUNTS.push(i);
}


// Dice Sides
// Corresponds to:
// ["4", "6", "8", "10", "20", "100"]
const DICE_SIDES = [
    4,
    6,
    8,
    10,
    20,
    100
];


// Modifier
// Corresponds to:
// [-10 ~ 10]
const MODIFIERS = [];

for (let i = -10; i <= 10; i++) {
    MODIFIERS.push(i);
}


// Preset Target Values
// Corresponds to:
// ["2" ~ "12"]
const TARGET_VALUES = [];

for (let i = 2; i <= 12; i++) {
    TARGET_VALUES.push(i);
}


// Roll Times
// Corresponds to:
// [1 ~ 10]
const TIMES = [];

for (let i = 1; i <= 10; i++) {
    TIMES.push(i);
}


// Default Values
// Keep all default selections together.

const DEFAULTS = {

    language: "zh",

    diceCount: 2,

    diceSides: 6,

    modifier: 0,

    target: 5,

    customTarget: 5,

    times: 1,

    mode: "atLeastOnce",

    resultType: "success"

};

// ======================================================
// 4. Global State
// ======================================================

const STATE = {

    // Current UI Language
    language: DEFAULTS.language,

    // Latest calculated probability
    // null means no calculation has been performed yet.
    probability: null

};

// ======================================================
// 5. Utility Functions
// ======================================================

/**
 * Return the current language object.
 *
 * @returns {Object}
 */
function getText() {

    return TEXT[STATE.language];

}


/**
 * Remove all options from a select element.
 *
 * @param {HTMLSelectElement} select
 */
function clearSelect(select) {

    select.replaceChildren();

}


/**
 * Populate a select element.
 *
 * Supported formats:
 *
 * [1,2,3]
 *
 * [
 *     { value: "a", text: "A" },
 *     { value: "b", text: "B" }
 * ]
 *
 * @param {HTMLSelectElement} select
 * @param {Array} options
 * @param {*} selectedValue
 */
function fillSelect(select, options, selectedValue = null) {

    clearSelect(select);

    for (const item of options) {

        const option = document.createElement("option");

        let value;
        let text;

        if (
            typeof item === "object" &&
            item !== null &&
            "value" in item
        ) {

            value = item.value;
            text = item.text;

        }
        else {

            value = item;
            text = item;

        }

        option.value = String(value);
        option.textContent = String(text);

        if (
            selectedValue !== null &&
            String(value) === String(selectedValue)
        ) {
            option.selected = true;
        }

        select.appendChild(option);

    }

}


/**
 * Set the selected value of a select element.
 *
 * Returns true if successful.
 *
 * @param {HTMLSelectElement} select
 * @param {*} value
 * @returns {boolean}
 */
function setSelectValue(select, value) {

    const stringValue = String(value);

    for (const option of select.options) {

        if (option.value === stringValue) {

            select.value = stringValue;

            return true;

        }

    }

    return false;

}


/**
 * Return the currently selected target value.
 *
 * @returns {number}
 */
function getTargetValue() {

    const t = getText();

    if (UI.targetMode.value === "custom") {
        return Number(UI.customTarget.value);
    }

    return Number(UI.targetMode.value);

}


/**
 * Show or hide the custom target input.
 */
function updateCustomTargetVisibility() {

    const t = getText();

    if (UI.targetMode.value === "custom") {

        UI.customTargetArea.classList.remove("hidden");

    }
    else {

        UI.customTargetArea.classList.add("hidden");

    }

}

// ======================================================
// 6. Probability Functions
// ======================================================

/**
 * Calculate the probability of success for a single roll.
 *
 * Corresponds to:
 * single_roll_probability() in Python.
 *
 * @param {number} numDice
 * @param {number} sides
 * @param {number} modifier
 * @param {number} target
 * @returns {number}
 */
function singleRollProbability(numDice, sides, modifier, target) {

    // Counter({0:1})
    let distribution = new Map();
    distribution.set(0, 1);

    // Repeat for each die
    for (let i = 0; i < numDice; i++) {

        const newDistribution = new Map();

        for (const [total, count] of distribution) {

            for (let face = 1; face <= sides; face++) {

                const newTotal = total + face;

                if (!newDistribution.has(newTotal)) {
                    newDistribution.set(newTotal, 0);
                }

                newDistribution.set(
                    newTotal,
                    newDistribution.get(newTotal) + count
                );

            }

        }

        distribution = newDistribution;

    }

    const totalOutcomes = sides ** numDice;

    let success = 0;

    for (const [total, count] of distribution) {

        if (total + modifier >= target) {
            success += count;
        }

    }

    return success / totalOutcomes;

}


/**
 * Format probability.
 *
 * Corresponds to:
 * format_probability() in Python.
 *
 * @param {number} probability
 * @returns {string}
 */
function formatProbability(probability) {

    if (probability === 0) {
        return "0.00000%";
    }

    if (probability === 1) {
        return "100.00000%";
    }

    const display =
        Math.floor(probability * 100 * 100000) / 100000;

    if (display === 0) {
        return "<0.00001%";
    }

    if (display >= 99.99999) {
        return ">99.99999%";
    }

    return `${display.toFixed(5)}%`;

}


/**
 * Return probability comment.
 *
 * Corresponds to:
 * comment() in Python.
 *
 * @param {number} probability
 * @returns {string}
 */
function getComment(probability) {

    const comments = getText().comments;

    for (const comment of comments) {

        if (probability >= comment.min) {
            return comment.text;
        }

    }

    return "";

}

// ======================================================
// 7. UI Functions
// ======================================================

/**
 * Update header.
 */
function updateHeader() {

    const t = getText();

    UI.title.textContent = t.title;

    UI.helpButton.textContent = t.help;

    UI.calcButton.textContent = t.calculate;

    fillSelect(
        UI.language,
        Object.entries(TEXT).map(([value, language]) => ({
            value,
            text: language.languageName
        })),
        STATE.language
    );

}


/**
 * Update Sentence 1.
 */
function updateSentence1() {

    const t = getText();

    UI.textThrow1.textContent = t.throw;
    UI.textDice.textContent = t.dice;
    UI.textSides.textContent = t.sides;
    UI.textTarget.textContent = t.target;
    UI.customTargetLabel.textContent = t.customTarget;


    fillSelect(
        UI.diceCount,
        DICE_COUNTS,
        UI.diceCount.value || DEFAULTS.diceCount
    );

    fillSelect(
        UI.diceSides,
        DICE_SIDES,
        UI.diceSides.value || DEFAULTS.diceSides
    );

    fillSelect(
        UI.modifier,
        MODIFIERS,
        UI.modifier.value || DEFAULTS.modifier
    );


    const previousTarget = UI.targetMode.value || String(DEFAULTS.target);

    fillSelect(
        UI.targetMode,
        [
            ...TARGET_VALUES,
            {
                value: "custom",
                text: t.custom
            }
        ]
    );

    if (!setSelectValue(UI.targetMode, previousTarget)) {

        setSelectValue(UI.targetMode, "custom");

    }

    updateCustomTargetVisibility();

}


/**
 * Update Sentence 2.
 */
function updateSentence2() {

    const t = getText();

    UI.textThrow2.textContent = t.throw;
    UI.textTimes.textContent = t.times;
    UI.textProbability.textContent = t.probability;


    fillSelect(
        UI.times,
        TIMES,
        UI.times.value || DEFAULTS.times
    );


    fillSelect(
        UI.mode,
        [
            {
                value: "all",
                text: t.all
            },
            {
                value: "atLeastOnce",
                text: t.atLeastOnce
            }
        ],
        UI.mode.value || DEFAULTS.mode
    );


    fillSelect(
        UI.resultType,
        [
            {
                value: "success",
                text: t.success
            },
            {
                value: "failure",
                text: t.failure
            }
        ],
        UI.resultType.value || DEFAULTS.resultType
    );

}


/**
 * Update help dialog.
 */
function updateHelpDialog() {

    const t = getText();

    UI.helpTitle.textContent = t.helpTitle;

    UI.helpContent.innerHTML = t.helpText;

    UI.closeHelp.textContent = t.close;

}


/**
 * Update the whole UI.
 */
function updateUI() {

    updateHeader();

    updateSentence1();

    updateSentence2();

    updateHelpDialog();

}

// ======================================================
// 8. Event Functions
// ======================================================

/**
 * Change application language.
 */
function changeLanguage() {

    STATE.language = UI.language.value;

    updateUI();

}


/**
 * Calculate probability.
 */
function calculate() {

    const numDice = Number(UI.diceCount.value);

    const sides = Number(UI.diceSides.value);

    const modifier = Number(UI.modifier.value);

    const target = getTargetValue();

    const times = Number(UI.times.value);

    const mode = UI.mode.value;

    const resultType = UI.resultType.value;


    const singleProbability = singleRollProbability(
        numDice,
        sides,
        modifier,
        target
    );


    let probability;


   if (resultType === "success") {
        if (times === 1) {
            probability = singleProbability;
        }
        else if (mode === "all") {

            probability = singleProbability ** times;

        }
        else {

            probability = 1 - (1 - singleProbability) ** times;

        }

    }
    else {
        if (times === 1) {
            probability = 1 - singleProbability;
        }
        else if (mode === "all") {

            probability = (1 - singleProbability) ** times;

        }
        else {

            probability = 1 - singleProbability ** times;

        }

    }


    UI.result.textContent = formatProbability(probability);

    UI.comment.textContent = getComment(probability);

}


/**
 * Open help dialog.
 */
function openHelp() {

    UI.helpDialog.showModal();

}


/**
 * Close help dialog.
 */
function closeHelp() {

    UI.helpDialog.close();

}


/**
 * Bind all event listeners.
 */
function bindEvents() {

    UI.language.addEventListener(
        "change",
        changeLanguage
    );


    UI.targetMode.addEventListener(
        "change",
        updateCustomTargetVisibility
    );


    UI.calcButton.addEventListener(
        "click",
        calculate
    );


    UI.helpButton.addEventListener(
        "click",
        openHelp
    );


    UI.closeHelp.addEventListener(
        "click",
        closeHelp
    );

}

// ======================================================
// 9. Initialization
// ======================================================

/**
 * Initialize the application.
 */
function initialize() {

    // Initialize language
    STATE.language = DEFAULTS.language;

    // Build the user interface
    updateUI();

    // Bind all events
    bindEvents();

    // Clear initial result
    UI.result.textContent = "";

    UI.comment.textContent = "";

}


/**
 * Start the application
 */
document.addEventListener(
    "DOMContentLoaded",
    initialize
);