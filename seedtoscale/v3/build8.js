"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __require = /* @__PURE__ */ ((x3) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x3, {
    get: (a3, b3) => (typeof require !== "undefined" ? require : a3)[b3]
  }) : x3)(function(x3) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x3 + '" is not supported');
  });
  var __copyProps = (to2, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to2, key) && key !== except)
          __defProp(to2, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to2;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  // src/form/DataGatheringManager.ts
  var DataGatheringManager = class {
    constructor(form) {
      __publicField(this, "form");
      this.form = form;
    }
    gatherStepData(fields) {
      const stepData = {};
      fields.forEach((field) => {
        if (field.name) {
          stepData[field.name] = this.getFieldValue(field);
        }
      });
      return stepData;
    }
    // collectCheckboxValues(groupName: string) {
    //   const checkboxes = document.querySelectorAll(`input[data-group="${groupName}"]`);
    //   return Array.from(checkboxes)
    //     .filter((checkbox) => checkbox.checked)
    //     .map((checkbox) => checkbox.value);
    // }
    gatherFormData() {
      const fields = this.form.querySelectorAll("input, select, textarea");
      const formData = {};
      fields.forEach((field) => {
        const inputField = field;
        if (inputField.name) {
          formData[inputField.name] = this.getFieldValue(inputField);
        }
      });
      return formData;
    }
    fillFormWithData(data) {
      Object.keys(data).forEach((key) => {
        const field = this.form.querySelector(`[name="${key}"]`);
        if (field) {
          if (field.type === "checkbox") {
            const checkbox = field;
            const value = data[key];
            if (value && !checkbox.checked) {
              setTimeout(() => {
                checkbox.click();
                console.log("[+] Checkbox Clicked");
              }, 0);
            }
          } else if (field.type === "radio") {
            const radio = this.form.querySelector(
              `input[name="${field.name}"][value="${data[key]}"]`
            );
            if (radio) {
              radio.click();
            }
          } else {
            field.value = data[key];
          }
        }
      });
      const customSelect = this.form.querySelectorAll('[fs-selectcustom-element="select"]');
      console.log("[+] CUSTOM SELECT", customSelect);
      if (customSelect && window.FsAttributes && window.FsAttributes.selectcustom) {
        window.FsAttributes.selectcustom.destroy();
        window.FsAttributes.selectcustom.init();
        customSelect.forEach((field) => {
          const optionsCount = field.querySelectorAll("option").length;
          const parent = field.parentElement;
          if (parent) {
            const aTags = parent.querySelectorAll("a");
            for (let i3 = 0; i3 < optionsCount - 1; i3++) {
              const nextElement = aTags[i3];
              if (nextElement) {
                parent.removeChild(nextElement);
              }
            }
          }
        });
      }
    }
    getFieldValue(field) {
      if (field.type === "checkbox") {
        return field.checked;
      }
      if (field.type === "radio") {
        const checkedRadio = this.form.querySelector(
          `input[name="${field.name}"]:checked`
        );
        return checkedRadio ? checkedRadio.value : null;
      }
      return field.value;
    }
  };

  // src/utils/index.ts
  var getFieldKeyName = (field) => {
    return field.name || field.dataset.group || "";
  };

  // src/form/FormIdentifierManager.ts
  var FORM_SELECTORS = {
    NEXT_BUTTON: '[data-form="next-btn"]',
    PREV_BUTTON: '[data-form="back-btn"]',
    RESET_BUTTON: '[data-form="reset-btn"]',
    SUBMIT_BUTTON: '[data-form="submit-btn"]'
  };
  var FormIdentifierManager = class {
    constructor(formSelector = '[data-form="multistep"]') {
      __publicField(this, "form");
      __publicField(this, "steps", []);
      this.form = document.querySelector(formSelector);
      if (!this.form) {
        throw new Error(`Form with selector "${formSelector}" not found.`);
      }
    }
    detectSteps(stepSelector = '[data-form="step"]') {
      const steps = this.form.querySelectorAll(stepSelector);
      if (steps.length === 0) {
        throw new Error(`No steps found using selector "${stepSelector}".`);
      }
      this.steps = Array.from(steps);
      return this.steps;
    }
    getCurrentStep() {
      const data = JSON.parse(localStorage.getItem("formState") || "{}");
      let currentStepIndex = 0;
      if (data.currentStep) {
        currentStepIndex = data.currentStep;
      }
      return {
        index: currentStepIndex,
        step: this.steps[currentStepIndex]
      };
    }
    detectButtons() {
      const nextButton = this.form.querySelector(FORM_SELECTORS.NEXT_BUTTON);
      const previousButton = this.form.querySelector(FORM_SELECTORS.PREV_BUTTON);
      const resetButton = this.form.querySelector(FORM_SELECTORS.RESET_BUTTON);
      const submitButton = this.form.querySelector(FORM_SELECTORS.SUBMIT_BUTTON);
      return {
        nextButton,
        previousButton,
        resetButton,
        submitButton
      };
    }
    detectVisibleInputFields() {
      const currentStep = this.getCurrentStep();
      const inputFields = this.detectFieldsInStep(currentStep.index);
      const fieldToValidate = this.detectFieldToValidateInStep(currentStep.index);
    }
    isVisible(element) {
      if (!element) return false;
      const style = getComputedStyle(element);
      return style.display !== "none";
    }
    detectFieldsInStep(stepIndex) {
      const steps = this.detectSteps();
      const currentStep = steps[stepIndex];
      if (!currentStep) {
        throw new Error(`Step at index ${stepIndex} not found.`);
      }
      const fields = currentStep.querySelectorAll(
        "input, select, textarea"
      );
      const visibleElements = Array.from(fields).filter(this.isVisible);
      return Array.from(fields);
    }
    //
    detectFieldToValidateInStep(stepIndex) {
      const steps = this.detectSteps();
      const currentStep = steps[stepIndex];
      if (!currentStep) {
        throw new Error(`Step at index ${stepIndex} not found.`);
      }
      const fields = currentStep.querySelectorAll("[data-validation]");
      const requriedFields = currentStep.querySelectorAll(
        "[required]"
      );
      console.log("====================================");
      console.log("[+] FIELD FOR VALIDATION", fields, requriedFields);
      console.log("====================================");
      const visibleFields = Array.from(fields).filter(this.isVisible);
      const visibleRequriedFields = Array.from(requriedFields).filter(this.isVisible);
      const finalMap = {};
      visibleFields.forEach((field) => {
        const inputField = field;
        const fieldKeyName = getFieldKeyName(inputField);
        finalMap[fieldKeyName] = inputField;
      });
      visibleRequriedFields.forEach((field) => {
        const inputField = field;
        const fieldKeyName = getFieldKeyName(inputField);
        finalMap[fieldKeyName] = inputField;
      });
      const results = Array.from([...Object.values(finalMap)]);
      console.log("[+] VISIBLE FIELD FOR VALIDATION", results);
      return results;
    }
    //
    getTotalSteps(stepSelector = '[data-form="step"]') {
      return this.detectSteps(stepSelector).length;
    }
    addEventListenerToButtons(type, callback) {
      const buttonSelector = this.getButtonSelectorByType(type);
      if (!buttonSelector) {
        console.error(`Unknown button type: "${type}"`);
        return;
      }
      this.form.querySelectorAll(buttonSelector).forEach((button) => {
        button.addEventListener("click", callback);
      });
    }
    removeEventListenersFromButtons(type, callback) {
      const buttonSelector = this.getButtonSelectorByType(type);
      if (!buttonSelector) {
        console.error(`Unknown button type: "${type}"`);
        return;
      }
      this.form.querySelectorAll(buttonSelector).forEach((button) => {
        button.removeEventListener("click", callback);
      });
    }
    handleEnterKeyPress(callback) {
      this.form.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          callback(event);
        }
      });
    }
    getButtonSelectorByType(type) {
      switch (type) {
        case "NEXT":
          return FORM_SELECTORS.NEXT_BUTTON;
        case "PREVIOUS":
          return FORM_SELECTORS.PREV_BUTTON;
        case "RESET":
          return FORM_SELECTORS.RESET_BUTTON;
        case "SUBMIT":
          return FORM_SELECTORS.SUBMIT_BUTTON;
        default:
          return null;
      }
    }
  };

  // src/form/FormValidationManager.ts
  var FormValidationManager = class {
    constructor(form) {
      __publicField(this, "form");
      __publicField(this, "errors", {});
      __publicField(this, "validators", {
        required: (value) => ({
          valid: value.trim() !== "",
          message: "This field is required."
        }),
        min: (value, length) => ({
          valid: value.length >= parseInt(length, 10),
          message: `Minimum length is ${length} characters.`
        }),
        max: (value, length) => ({
          valid: value.length <= parseInt(length, 10),
          message: `Maximum length is ${length} characters.`
        }),
        startswith: (value, prefix) => ({
          valid: value.startsWith(prefix),
          message: `Value must start with "${prefix}".`
        }),
        endswith: (value, suffix) => ({
          valid: value.endsWith(suffix),
          message: `Value must end with "${suffix}".`
        }),
        regex: (value, pattern) => ({
          valid: new RegExp(pattern).test(value),
          message: "Value does not match the required pattern."
        }),
        contains: (value, substring) => ({
          valid: value.includes(substring),
          message: `Value must contain "${substring}".`
        }),
        notcontains: (value, substring) => ({
          valid: !value.includes(substring),
          message: `Value must not contain "${substring}".`
        }),
        equals: (value, comparison) => ({
          valid: value === comparison,
          message: `Value must be exactly "${comparison}".`
        }),
        notequals: (value, comparison) => ({
          valid: value !== comparison,
          message: `Value must not be "${comparison}".`
        }),
        alphanumeric: (value) => ({
          valid: /^[a-zA-Z0-9]+$/.test(value),
          message: "Value must be alphanumeric."
        }),
        email: (value) => ({
          valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
          message: "Enter a valid email address."
        }),
        phone: () => ({
          valid: window.iti.isValidNumber(),
          message: "Enter a valid phone number."
        }),
        "checkbox-group": (value) => {
          const checkboxes = value.querySelectorAll('input[type="checkbox"]');
          const isChecked = Array.from(checkboxes).some((checkbox) => {
            return checkbox.checked;
          });
          return {
            valid: isChecked,
            message: "Please select at least one option."
          };
        },
        checkboxRequired: (value) => {
          return {
            valid: value === "true",
            message: "Please select at least one option."
          };
        }
      });
      __publicField(this, "errorSelector", ".onb-form-field-error");
      this.form = form;
    }
    validateField(field) {
      let rules = field.getAttribute("data-validation");
      let result = {
        valid: true,
        message: ""
      };
      let fieldName = getFieldKeyName(field);
      if (field.hasAttribute("required")) {
        rules = "required;" + rules;
      }
      if (rules) {
        const value = field.value;
        const rulesArray = rules.split(";");
        for (const rule of rulesArray) {
          const [ruleName, param] = rule.split(":");
          if (this.validators[ruleName]) {
            let localResult = { valid: true, message: "" };
            if (rule === "checkbox-group") {
              localResult = this.validators["checkbox-group"](field);
              fieldName = field.getAttribute("data-group") || "";
            } else {
              localResult = this.validators[ruleName](value, param);
            }
            const { valid, message } = localResult;
            result = { valid, message };
            if (!valid) {
              const customMessage = field.getAttribute(`data-error-${ruleName}`);
              result.message = customMessage || message;
              break;
            }
          }
        }
      }
      if (!result.valid) {
        this.errors[fieldName] = result.message;
      } else {
        delete this.errors[fieldName];
      }
      console.log("[+] FIELD VALIDATION RESULT", fieldName, result);
      return result;
    }
    // clearAllErrors() {}
    validateStep(fields) {
      let isStepValid = true;
      this.errors = {};
      fields.forEach((field) => {
        const fieldStatus = this.validateField(field);
        if (!fieldStatus.valid) {
          isStepValid = false;
        }
      });
      const result = { isStepValid, errors: this.errors };
      return result;
    }
    getErrors() {
      return this.errors;
    }
    showFieldError(field) {
      this.clearFieldError(field);
      const errorContainer = this.getErrorContainer(field);
      const keyName = field.name || field.dataset.group || "";
      console.log("[+] CHECKING ERROR FIELD", keyName);
      if (errorContainer && this.errors[keyName]) {
        console.log("%c[+] SHOWING ERROR FIELD", "color:red", keyName);
        errorContainer.textContent = this.errors[keyName];
        errorContainer.style.display = "block";
      }
    }
    clearStepErrors() {
      console.log("[+] Clearing Step Errors");
      const errorContainers = this.form.querySelectorAll(this.errorSelector);
      if (errorContainers && errorContainers.length > 0) {
        errorContainers.forEach((container) => {
          container.textContent = "";
          container.style.display = "none";
        });
      }
    }
    clearFieldError(field) {
      const errorContainer = this.getErrorContainer(field);
      console.log("[+] Clearing Error Field");
      if (errorContainer) {
        errorContainer.textContent = "";
        errorContainer.style.display = "none";
      }
    }
    showGlobalError(message) {
      const globalErrorContainer = this.form.querySelector('[data-form="global-error"]');
      if (globalErrorContainer) {
        globalErrorContainer.textContent = message;
        globalErrorContainer.style.display = "block";
      }
    }
    clearGlobalError() {
      const globalErrorContainer = this.form.querySelector('[data-form="global-error"]');
      if (globalErrorContainer) {
        globalErrorContainer.textContent = "";
        globalErrorContainer.style.display = "none";
      }
    }
    getErrorContainer(field) {
      let element = null;
      element = field.querySelector(this.errorSelector);
      if (!element) {
        const parent = field.closest(".onb-form-field-comp");
        element = parent?.querySelector(this.errorSelector);
      }
      return element;
    }
  };

  // node_modules/.pnpm/chalk@5.4.1/node_modules/chalk/source/vendor/ansi-styles/index.js
  var ANSI_BACKGROUND_OFFSET = 10;
  var wrapAnsi16 = (offset = 0) => (code) => `\x1B[${code + offset}m`;
  var wrapAnsi256 = (offset = 0) => (code) => `\x1B[${38 + offset};5;${code}m`;
  var wrapAnsi16m = (offset = 0) => (red, green, blue) => `\x1B[${38 + offset};2;${red};${green};${blue}m`;
  var styles = {
    modifier: {
      reset: [0, 0],
      // 21 isn't widely supported and 22 does the same thing
      bold: [1, 22],
      dim: [2, 22],
      italic: [3, 23],
      underline: [4, 24],
      overline: [53, 55],
      inverse: [7, 27],
      hidden: [8, 28],
      strikethrough: [9, 29]
    },
    color: {
      black: [30, 39],
      red: [31, 39],
      green: [32, 39],
      yellow: [33, 39],
      blue: [34, 39],
      magenta: [35, 39],
      cyan: [36, 39],
      white: [37, 39],
      // Bright color
      blackBright: [90, 39],
      gray: [90, 39],
      // Alias of `blackBright`
      grey: [90, 39],
      // Alias of `blackBright`
      redBright: [91, 39],
      greenBright: [92, 39],
      yellowBright: [93, 39],
      blueBright: [94, 39],
      magentaBright: [95, 39],
      cyanBright: [96, 39],
      whiteBright: [97, 39]
    },
    bgColor: {
      bgBlack: [40, 49],
      bgRed: [41, 49],
      bgGreen: [42, 49],
      bgYellow: [43, 49],
      bgBlue: [44, 49],
      bgMagenta: [45, 49],
      bgCyan: [46, 49],
      bgWhite: [47, 49],
      // Bright color
      bgBlackBright: [100, 49],
      bgGray: [100, 49],
      // Alias of `bgBlackBright`
      bgGrey: [100, 49],
      // Alias of `bgBlackBright`
      bgRedBright: [101, 49],
      bgGreenBright: [102, 49],
      bgYellowBright: [103, 49],
      bgBlueBright: [104, 49],
      bgMagentaBright: [105, 49],
      bgCyanBright: [106, 49],
      bgWhiteBright: [107, 49]
    }
  };
  var modifierNames = Object.keys(styles.modifier);
  var foregroundColorNames = Object.keys(styles.color);
  var backgroundColorNames = Object.keys(styles.bgColor);
  var colorNames = [...foregroundColorNames, ...backgroundColorNames];
  function assembleStyles() {
    const codes = /* @__PURE__ */ new Map();
    for (const [groupName, group] of Object.entries(styles)) {
      for (const [styleName, style] of Object.entries(group)) {
        styles[styleName] = {
          open: `\x1B[${style[0]}m`,
          close: `\x1B[${style[1]}m`
        };
        group[styleName] = styles[styleName];
        codes.set(style[0], style[1]);
      }
      Object.defineProperty(styles, groupName, {
        value: group,
        enumerable: false
      });
    }
    Object.defineProperty(styles, "codes", {
      value: codes,
      enumerable: false
    });
    styles.color.close = "\x1B[39m";
    styles.bgColor.close = "\x1B[49m";
    styles.color.ansi = wrapAnsi16();
    styles.color.ansi256 = wrapAnsi256();
    styles.color.ansi16m = wrapAnsi16m();
    styles.bgColor.ansi = wrapAnsi16(ANSI_BACKGROUND_OFFSET);
    styles.bgColor.ansi256 = wrapAnsi256(ANSI_BACKGROUND_OFFSET);
    styles.bgColor.ansi16m = wrapAnsi16m(ANSI_BACKGROUND_OFFSET);
    Object.defineProperties(styles, {
      rgbToAnsi256: {
        value(red, green, blue) {
          if (red === green && green === blue) {
            if (red < 8) {
              return 16;
            }
            if (red > 248) {
              return 231;
            }
            return Math.round((red - 8) / 247 * 24) + 232;
          }
          return 16 + 36 * Math.round(red / 255 * 5) + 6 * Math.round(green / 255 * 5) + Math.round(blue / 255 * 5);
        },
        enumerable: false
      },
      hexToRgb: {
        value(hex) {
          const matches = /[a-f\d]{6}|[a-f\d]{3}/i.exec(hex.toString(16));
          if (!matches) {
            return [0, 0, 0];
          }
          let [colorString] = matches;
          if (colorString.length === 3) {
            colorString = [...colorString].map((character) => character + character).join("");
          }
          const integer = Number.parseInt(colorString, 16);
          return [
            /* eslint-disable no-bitwise */
            integer >> 16 & 255,
            integer >> 8 & 255,
            integer & 255
            /* eslint-enable no-bitwise */
          ];
        },
        enumerable: false
      },
      hexToAnsi256: {
        value: (hex) => styles.rgbToAnsi256(...styles.hexToRgb(hex)),
        enumerable: false
      },
      ansi256ToAnsi: {
        value(code) {
          if (code < 8) {
            return 30 + code;
          }
          if (code < 16) {
            return 90 + (code - 8);
          }
          let red;
          let green;
          let blue;
          if (code >= 232) {
            red = ((code - 232) * 10 + 8) / 255;
            green = red;
            blue = red;
          } else {
            code -= 16;
            const remainder = code % 36;
            red = Math.floor(code / 36) / 5;
            green = Math.floor(remainder / 6) / 5;
            blue = remainder % 6 / 5;
          }
          const value = Math.max(red, green, blue) * 2;
          if (value === 0) {
            return 30;
          }
          let result = 30 + (Math.round(blue) << 2 | Math.round(green) << 1 | Math.round(red));
          if (value === 2) {
            result += 60;
          }
          return result;
        },
        enumerable: false
      },
      rgbToAnsi: {
        value: (red, green, blue) => styles.ansi256ToAnsi(styles.rgbToAnsi256(red, green, blue)),
        enumerable: false
      },
      hexToAnsi: {
        value: (hex) => styles.ansi256ToAnsi(styles.hexToAnsi256(hex)),
        enumerable: false
      }
    });
    return styles;
  }
  var ansiStyles = assembleStyles();
  var ansi_styles_default = ansiStyles;

  // node_modules/.pnpm/chalk@5.4.1/node_modules/chalk/source/vendor/supports-color/browser.js
  var level = (() => {
    if (!("navigator" in globalThis)) {
      return 0;
    }
    if (globalThis.navigator.userAgentData) {
      const brand = navigator.userAgentData.brands.find(({ brand: brand2 }) => brand2 === "Chromium");
      if (brand && brand.version > 93) {
        return 3;
      }
    }
    if (/\b(Chrome|Chromium)\//.test(globalThis.navigator.userAgent)) {
      return 1;
    }
    return 0;
  })();
  var colorSupport = level !== 0 && {
    level,
    hasBasic: true,
    has256: level >= 2,
    has16m: level >= 3
  };
  var supportsColor = {
    stdout: colorSupport,
    stderr: colorSupport
  };
  var browser_default = supportsColor;

  // node_modules/.pnpm/chalk@5.4.1/node_modules/chalk/source/utilities.js
  function stringReplaceAll(string, substring, replacer) {
    let index = string.indexOf(substring);
    if (index === -1) {
      return string;
    }
    const substringLength = substring.length;
    let endIndex = 0;
    let returnValue = "";
    do {
      returnValue += string.slice(endIndex, index) + substring + replacer;
      endIndex = index + substringLength;
      index = string.indexOf(substring, endIndex);
    } while (index !== -1);
    returnValue += string.slice(endIndex);
    return returnValue;
  }
  function stringEncaseCRLFWithFirstIndex(string, prefix, postfix, index) {
    let endIndex = 0;
    let returnValue = "";
    do {
      const gotCR = string[index - 1] === "\r";
      returnValue += string.slice(endIndex, gotCR ? index - 1 : index) + prefix + (gotCR ? "\r\n" : "\n") + postfix;
      endIndex = index + 1;
      index = string.indexOf("\n", endIndex);
    } while (index !== -1);
    returnValue += string.slice(endIndex);
    return returnValue;
  }

  // node_modules/.pnpm/chalk@5.4.1/node_modules/chalk/source/index.js
  var { stdout: stdoutColor, stderr: stderrColor } = browser_default;
  var GENERATOR = Symbol("GENERATOR");
  var STYLER = Symbol("STYLER");
  var IS_EMPTY = Symbol("IS_EMPTY");
  var levelMapping = [
    "ansi",
    "ansi",
    "ansi256",
    "ansi16m"
  ];
  var styles2 = /* @__PURE__ */ Object.create(null);
  var applyOptions = (object, options = {}) => {
    if (options.level && !(Number.isInteger(options.level) && options.level >= 0 && options.level <= 3)) {
      throw new Error("The `level` option should be an integer from 0 to 3");
    }
    const colorLevel = stdoutColor ? stdoutColor.level : 0;
    object.level = options.level === void 0 ? colorLevel : options.level;
  };
  var chalkFactory = (options) => {
    const chalk2 = (...strings) => strings.join(" ");
    applyOptions(chalk2, options);
    Object.setPrototypeOf(chalk2, createChalk.prototype);
    return chalk2;
  };
  function createChalk(options) {
    return chalkFactory(options);
  }
  Object.setPrototypeOf(createChalk.prototype, Function.prototype);
  for (const [styleName, style] of Object.entries(ansi_styles_default)) {
    styles2[styleName] = {
      get() {
        const builder = createBuilder(this, createStyler(style.open, style.close, this[STYLER]), this[IS_EMPTY]);
        Object.defineProperty(this, styleName, { value: builder });
        return builder;
      }
    };
  }
  styles2.visible = {
    get() {
      const builder = createBuilder(this, this[STYLER], true);
      Object.defineProperty(this, "visible", { value: builder });
      return builder;
    }
  };
  var getModelAnsi = (model, level2, type, ...arguments_) => {
    if (model === "rgb") {
      if (level2 === "ansi16m") {
        return ansi_styles_default[type].ansi16m(...arguments_);
      }
      if (level2 === "ansi256") {
        return ansi_styles_default[type].ansi256(ansi_styles_default.rgbToAnsi256(...arguments_));
      }
      return ansi_styles_default[type].ansi(ansi_styles_default.rgbToAnsi(...arguments_));
    }
    if (model === "hex") {
      return getModelAnsi("rgb", level2, type, ...ansi_styles_default.hexToRgb(...arguments_));
    }
    return ansi_styles_default[type][model](...arguments_);
  };
  var usedModels = ["rgb", "hex", "ansi256"];
  for (const model of usedModels) {
    styles2[model] = {
      get() {
        const { level: level2 } = this;
        return function(...arguments_) {
          const styler = createStyler(getModelAnsi(model, levelMapping[level2], "color", ...arguments_), ansi_styles_default.color.close, this[STYLER]);
          return createBuilder(this, styler, this[IS_EMPTY]);
        };
      }
    };
    const bgModel = "bg" + model[0].toUpperCase() + model.slice(1);
    styles2[bgModel] = {
      get() {
        const { level: level2 } = this;
        return function(...arguments_) {
          const styler = createStyler(getModelAnsi(model, levelMapping[level2], "bgColor", ...arguments_), ansi_styles_default.bgColor.close, this[STYLER]);
          return createBuilder(this, styler, this[IS_EMPTY]);
        };
      }
    };
  }
  var proto = Object.defineProperties(() => {
  }, {
    ...styles2,
    level: {
      enumerable: true,
      get() {
        return this[GENERATOR].level;
      },
      set(level2) {
        this[GENERATOR].level = level2;
      }
    }
  });
  var createStyler = (open, close, parent) => {
    let openAll;
    let closeAll;
    if (parent === void 0) {
      openAll = open;
      closeAll = close;
    } else {
      openAll = parent.openAll + open;
      closeAll = close + parent.closeAll;
    }
    return {
      open,
      close,
      openAll,
      closeAll,
      parent
    };
  };
  var createBuilder = (self2, _styler, _isEmpty) => {
    const builder = (...arguments_) => applyStyle(builder, arguments_.length === 1 ? "" + arguments_[0] : arguments_.join(" "));
    Object.setPrototypeOf(builder, proto);
    builder[GENERATOR] = self2;
    builder[STYLER] = _styler;
    builder[IS_EMPTY] = _isEmpty;
    return builder;
  };
  var applyStyle = (self2, string) => {
    if (self2.level <= 0 || !string) {
      return self2[IS_EMPTY] ? "" : string;
    }
    let styler = self2[STYLER];
    if (styler === void 0) {
      return string;
    }
    const { openAll, closeAll } = styler;
    if (string.includes("\x1B")) {
      while (styler !== void 0) {
        string = stringReplaceAll(string, styler.close, styler.open);
        styler = styler.parent;
      }
    }
    const lfIndex = string.indexOf("\n");
    if (lfIndex !== -1) {
      string = stringEncaseCRLFWithFirstIndex(string, closeAll, openAll, lfIndex);
    }
    return openAll + string + closeAll;
  };
  Object.defineProperties(createChalk.prototype, styles2);
  var chalk = createChalk();
  var chalkStderr = createChalk({ level: stderrColor ? stderrColor.level : 0 });
  var source_default = chalk;

  // src/utils/logger.ts
  var colors = ["cyan", "green", "yellow", "magenta", "blue"];
  function pickColorIndex(label) {
    let hash = 0;
    for (let i3 = 0; i3 < label.length; i3++) {
      hash = (hash << 5) - hash + label.charCodeAt(i3);
      hash |= 0;
    }
    return Math.abs(hash) % colors.length;
  }
  function createLogger(filename) {
    const label = filename;
    const colorIndex = pickColorIndex(label);
    const colorFn = source_default[colors[colorIndex]];
    return {
      log: (...args) => {
        console.log(colorFn(`[${label}]`), ...args);
      },
      // If you like, add log variants like info, warn, error below
      info: (...args) => {
        console.info(colorFn(`[${label} INFO]`), ...args);
      },
      warn: (...args) => {
        console.warn(colorFn(`[${label} WARN]`), ...args);
      },
      error: (...args) => {
        console.error(colorFn(`[${label} ERROR]`), ...args);
      }
    };
  }

  // src/form/UIManager.ts
  var logger = createLogger("UIManager");
  var UIManager = class {
    constructor(form, steps, buttons, customProgressBar) {
      __publicField(this, "form");
      __publicField(this, "steps", []);
      __publicField(this, "customProgressBar");
      __publicField(this, "buttons", {
        nextButton: null,
        previousButton: null,
        resetButton: null,
        submitButton: null
      });
      __publicField(this, "isProfilePage", false);
      this.form = form;
      this.steps = steps;
      this.buttons = buttons;
      this.customProgressBar = customProgressBar;
      const pathname = window.location.pathname;
      this.isProfilePage = false;
    }
    initiliaze() {
      if (this.isProfilePage) {
        this.steps.forEach((step, index) => {
          step.style.display = "block";
        });
        const backButtons = this.form.querySelectorAll(
          '[data-form="back-btn"]'
        );
        const nextButtons = this.form.querySelectorAll(
          '[data-form="next-btn"]'
        );
        const submitButtons = this.form.querySelectorAll(
          '[data-form="submit-btn"]'
        );
        this.removeBackButtons(Array.from(backButtons));
        this.updateNextButtonText(Array.from(nextButtons), "Save");
      }
    }
    removeBackButtons(buttons) {
      buttons.forEach((button) => {
        button.style.display = "none";
      });
    }
    updateNextButtonText(buttons, text) {
      buttons.forEach((button, index) => {
        button.setAttribute("stepIndex", index.toString());
        const div = button.querySelector("div");
        if (div) {
          div.textContent = text;
        }
      });
    }
    showStep(stepIndex) {
      let INDEX_TO_MATCH = stepIndex || 0;
      this.steps.forEach((step, index) => {
        if (this.isProfilePage) {
          step.style.display = "block";
        } else {
          step.style.display = index === INDEX_TO_MATCH ? "block" : "none";
        }
      });
      this.handleCustomProgressBar(INDEX_TO_MATCH);
    }
    handleCustomProgressBar(stepIndex) {
      this.customProgressBar?.forEach((progressBar, index) => {
        if (progressBar) {
          const progressBarSteps = progressBar.querySelectorAll(" :scope > *");
          if (progressBarSteps.length == this.steps.length) {
            progressBarSteps.forEach((step, index2) => {
              if (index2 === stepIndex) {
                step.classList.add("current");
              } else {
                step.classList.remove("current");
              }
            });
          }
        }
      });
    }
    disableButtons() {
      logger.log("[+] Disabling Buttons");
      Object.values(this.buttons).forEach((button) => {
        if (button) button.setAttribute("disabled", "true");
      });
    }
    enableButtons() {
      Object.values(this.buttons).forEach((button) => {
        if (button) button.removeAttribute("disabled");
      });
    }
    resetUI() {
      logger.log("[+] Resetting UI");
      this.hideSteps();
      this.enableButtons();
      if (this.steps.length > 0) {
        this.showStep(0);
      }
    }
  };

  // src/auth/multi-step-form-manager.ts
  var logger2 = createLogger("MSForm");
  var defaultCallback = (state) => {
  };
  var HIDDEN_CLASS = "hide";
  var MultiStepFormManager = class {
    constructor({
      formSelector,
      inputErrorMessageSelector = ".onb-form-field-error",
      options = {},
      onStepChange
    }) {
      __publicField(this, "form");
      __publicField(this, "state", {
        currentStep: 0,
        totalSteps: 0,
        formData: {},
        errors: {},
        direction: ""
      });
      __publicField(this, "selectors", {
        inputErrorMessageSelector: ".onb-form-field-error",
        customProgressBar: ".onb-prog-comp"
      });
      __publicField(this, "steps", []);
      __publicField(this, "formManager");
      __publicField(this, "uiManager");
      __publicField(this, "validationManager");
      __publicField(this, "dataManager");
      __publicField(this, "callbacks", {
        onStepChange: defaultCallback
      });
      __publicField(this, "options", {});
      __publicField(this, "isProfilePage", false);
      this.form = document.querySelector(formSelector);
      if (!this.form) {
        throw new Error(`Form with selector "${formSelector}" not found.`);
      }
      this.selectors.inputErrorMessageSelector = inputErrorMessageSelector;
      this.formManager = new FormIdentifierManager(formSelector);
      const form = this.formManager.form;
      this.steps = this.formManager.detectSteps();
      const buttons = this.formManager.detectButtons();
      const customProgressBar = document.querySelectorAll(
        `.onb-prog-container ${this.selectors.customProgressBar}`
      );
      this.uiManager = new UIManager(form, this.steps, buttons, customProgressBar);
      this.validationManager = new FormValidationManager(form);
      this.dataManager = new DataGatheringManager(form);
      this.callbacks.onStepChange = onStepChange;
      this.options = options;
      const pathname = window.location.pathname;
      this.isProfilePage = pathname.includes("/profile/edit");
    }
    initialize() {
      this.loadLocalStorage();
      const state = this.getState();
      let currentStep = 0;
      if (this.isProfilePage) {
        currentStep = 0;
      } else {
        currentStep = state.currentStep || 0;
      }
      this.updateState(
        {
          totalSteps: this.steps.length,
          currentStep
        },
        false
      );
      this.handleProfileEditPage();
      this.fixDataNameOfCollectionListChecboxes();
      this.dataManager.fillFormWithData(this.getState().formData);
      this.uiManager.showStep(this.state.currentStep);
      this.validationManager.clearStepErrors();
      this.attachEventListeners();
      this.form.classList.remove("hide");
      logger2.log("[+] INITIAL STATE", JSON.stringify(this.state, null, 2));
      const style = document.createElement("style");
      style.textContent = `.${HIDDEN_CLASS} { display: none; } .onb-form-select {display: block}`;
      document.head.appendChild(style);
      this.initConditionalVisibility();
      logger2.log("[+] afterSubmitRedrect, this.options", this.options);
    }
    fixDataNameOfCollectionListChecboxes() {
      const checkboxGroup = this.form.querySelectorAll('[data-validation="checkbox-group"]');
      checkboxGroup.forEach((checkboxGroup2) => {
        const checkboxes = checkboxGroup2.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach((checkbox) => {
          const requireResetOfName = checkbox.getAttribute("name")?.toLocaleLowerCase().startsWith("checkbox");
          if (requireResetOfName) {
            const id = checkbox.getAttribute("id");
            const groupName = checkboxGroup2.getAttribute("data-group");
            const newName = groupName + "_" + id;
            checkbox.setAttribute("name", newName);
          }
        });
      });
    }
    //
    //
    //
    handleProfileEditPage() {
      return false;
      if (this.isProfilePage) {
        this.state.currentStep = 0;
        this.state.totalSteps = this.steps.length;
      }
    }
    initConditionalVisibility() {
      const conditionallyVisibleFields = this.form.querySelectorAll(
        "[data-condition]"
      );
      conditionallyVisibleFields.forEach((field) => {
        const conditionAttribute = field.getAttribute("data-condition");
        logger2.log("[+] conditionAttribute", conditionAttribute);
        if (!conditionAttribute) {
          logger2.error("Condition attribute not found on field:", field);
          return;
        }
        const condition = JSON.parse(conditionAttribute.replaceAll("'", '"'));
        const conditionField = document.querySelector(
          `[name="${condition.field}"]`
        );
        if (!conditionField) {
          logger2.error(`Condition field "${condition.field}" not found.`);
          return;
        }
        const eventType = conditionField.type === "radio" ? "change" : "input";
        document.querySelectorAll(`[name="${condition.field}"]`).forEach((radio) => {
          radio.addEventListener(eventType, () => this.evaluateCondition(field, condition));
        });
        this.evaluateCondition(field, condition);
      });
    }
    evaluateCondition(field, condition) {
      logger2.log("evaluateCondition", field, condition);
      const conditionElements = document.querySelectorAll(
        `[name="${condition.field}"]`
      );
      logger2.log("[+] conditionField", conditionElements);
      let conditionFieldValue = "";
      if (conditionElements[0]?.type === "radio") {
        const selectedRadio = Array.from(conditionElements).find(
          (radio) => radio.checked
        );
        conditionFieldValue = selectedRadio ? selectedRadio.value : "";
      } else {
        conditionFieldValue = conditionElements[0]?.value || "";
      }
      if (String(conditionFieldValue) === String(condition.value)) {
        logger2.log("[+] Condition Met:", conditionFieldValue, condition.value);
        field.classList.remove(HIDDEN_CLASS);
        this.removeClassOnInputFields(field, HIDDEN_CLASS);
      } else {
        logger2.log("[+] Condition NOT Met:", conditionFieldValue, condition.value);
        field.classList.add(HIDDEN_CLASS);
        this.addClassOnInputFields(field, HIDDEN_CLASS);
      }
    }
    addClassOnInputFields(field, className) {
      const elements = field.querySelectorAll("input, select, textarea, [data-validation]");
      elements.forEach((element) => {
        element.classList.add(className);
      });
    }
    removeClassOnInputFields(field, className) {
      const elements = field.querySelectorAll("input, select, textarea, [data-validation]");
      elements.forEach((element) => {
        element.classList.remove(className);
      });
    }
    loadLocalStorage() {
      const formState = localStorage.getItem("formState");
      if (formState) {
        const state = JSON.parse(formState);
        this.state = { ...state };
      }
    }
    updateState({ currentStep, totalSteps, formData, errors, direction }, triggerCallback = false) {
      if (isNaN(currentStep) === false) {
        this.state.currentStep = currentStep || 0;
      }
      if (totalSteps) {
        this.state.totalSteps = totalSteps;
      }
      if (formData) {
        this.state.formData = formData;
      }
      if (errors) {
        this.state.errors = errors || {};
      }
      if (direction) {
        this.state.direction = direction;
      }
      localStorage.setItem("formState", JSON.stringify(this.state));
      if (triggerCallback) {
        this.callbacks.onStepChange(this.state);
      }
    }
    // private updateFormDataInState(partialData: Record<string, any>) {
    //   const updatedState = {
    //     ...this.state.formData,
    //     ...partialData,
    //   };
    //   logger.log('[+] Updating Form Data:', updatedState);
    //   this.state.formData = { ...updatedState };
    // }
    // private updateErrorsInState(errors: Record<string, string>) {
    //   logger.log('[+] ERRORS:', errors);
    //   this.state.errors = { ...errors };
    // }
    incrementCurrentStep() {
      if (this.state.currentStep < this.state.totalSteps) {
        const state = this.getState();
        const currentStep = state.currentStep + 1;
        this.updateState({
          currentStep
        });
      }
    }
    decrementCurrentStep(step) {
      logger2.log("] decrementCurrentStep", step);
      if (this.state.currentStep > 0) {
        const state = this.getState();
        const currentStep = state.currentStep - 1;
        this.updateState({
          currentStep
        });
      }
    }
    getState() {
      return JSON.parse(JSON.stringify(this.state));
    }
    attachEventListeners() {
      this.formManager.addEventListenerToButtons("NEXT", (event) => {
        this.action_next();
      });
      this.formManager.addEventListenerToButtons("PREVIOUS", () => {
        this.action_previous();
      });
      this.formManager.addEventListenerToButtons("SUBMIT", (event) => {
        this.submit(event);
      });
      this.form.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          this.action_next();
        }
      });
    }
    action_updateDataAndError() {
      const thisStepFields = this.formManager.detectFieldsInStep(this.state.currentStep);
      const fieldsToValidate = this.formManager.detectFieldToValidateInStep(this.state.currentStep);
      const { isStepValid, errors } = this.validationManager.validateStep(fieldsToValidate);
      const data = this.dataManager.gatherStepData(thisStepFields);
      logger2.log(" THIS STEP DATA", data);
      logger2.log("[+] THIS STEP ERRORS", Object.keys(errors).length, errors);
      const state = this.getState();
      let isOnboardingComplete = state.formData.isOnboardingComplete || false;
      if (!isOnboardingComplete && isStepValid && this.isLastStep()) {
        isOnboardingComplete = true;
      }
      this.updateState(
        {
          formData: { ...data, isOnboardingComplete },
          errors
        },
        isStepValid
      );
      return isStepValid;
    }
    isLastStep() {
      return this.state.currentStep === this.state.totalSteps - 1;
    }
    action_next() {
      this.state.direction = "NEXT";
      const isStepValid = this.action_updateDataAndError();
      logger2.log("[+] isStepValid", isStepValid);
      if (isStepValid) {
        if (this.isLastStep()) {
          if (this.options.afterSubmitRedrect) {
            window.location.assign(this.options.afterSubmitRedrect);
          } else {
            window.location.assign("/?submitted=true");
          }
        } else {
          this.incrementCurrentStep();
          const state = this.getState();
          logger2.log("[+] NEXT STATE:", JSON.stringify(state, null, 2));
          const currentStep = state.currentStep;
          this.uiManager.showStep(currentStep);
          this.validationManager.clearStepErrors();
        }
      } else {
        this.showErrorsInThisStep();
      }
    }
    submit(event) {
      logger2.log("[+] Submitting Form", event);
      event.preventDefault();
      this.action_next();
    }
    action_previous() {
      this.state.direction = "PREVIOUS";
      const state = this.getState();
      logger2.log("[+] PREVIOUS STATE:", state);
      const PREVIOUS_STEP = state.currentStep - 1;
      this.uiManager.showStep(PREVIOUS_STEP);
      this.decrementCurrentStep(this.state.currentStep);
    }
    showErrorsInThisStep() {
      const fieldsToValidate = this.formManager.detectFieldToValidateInStep(this.state.currentStep);
      const thisStepFields = this.formManager.detectFieldsInStep(this.state.currentStep);
      fieldsToValidate.forEach((field) => {
        this.validationManager.showFieldError(field);
      });
    }
    // clearCurrentStepErrors() {
    //   const steps = this.form.querySelectorAll('[data-form="step"]');
    //   const currentStep = steps[this.state.currentStep];
    //   const fields = currentStep.querySelectorAll('input, select, textarea');
    //   // Remove Error Class from Input Fields.
    //   fields.forEach((field: HTMLInputElement) => {
    //     field.classList.remove('error');
    //     const errorField =
    //       field.parentElement &&
    //       field.parentElement.querySelector(this.selectors.inputErrorMessageSelector);
    //     if (errorField) {
    //       // Hide Error Message.
    //       errorField.textContent = '';
    //     }
    //   });
    // }
    //
    //
    //
  };

  // node_modules/.pnpm/@auth0+auth0-spa-js@2.1.3/node_modules/@auth0/auth0-spa-js/dist/auth0-spa-js.production.esm.js
  function e(e3, t3) {
    var i3 = {};
    for (var o3 in e3) Object.prototype.hasOwnProperty.call(e3, o3) && t3.indexOf(o3) < 0 && (i3[o3] = e3[o3]);
    if (null != e3 && "function" == typeof Object.getOwnPropertySymbols) {
      var n3 = 0;
      for (o3 = Object.getOwnPropertySymbols(e3); n3 < o3.length; n3++) t3.indexOf(o3[n3]) < 0 && Object.prototype.propertyIsEnumerable.call(e3, o3[n3]) && (i3[o3[n3]] = e3[o3[n3]]);
    }
    return i3;
  }
  var t = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {};
  function i(e3) {
    return e3 && e3.__esModule && Object.prototype.hasOwnProperty.call(e3, "default") ? e3.default : e3;
  }
  function o(e3, t3) {
    return e3(t3 = { exports: {} }, t3.exports), t3.exports;
  }
  var n = o(function(e3, t3) {
    Object.defineProperty(t3, "__esModule", { value: true });
    var i3 = function() {
      function e4() {
        var e5 = this;
        this.locked = /* @__PURE__ */ new Map(), this.addToLocked = function(t4, i4) {
          var o3 = e5.locked.get(t4);
          void 0 === o3 ? void 0 === i4 ? e5.locked.set(t4, []) : e5.locked.set(t4, [i4]) : void 0 !== i4 && (o3.unshift(i4), e5.locked.set(t4, o3));
        }, this.isLocked = function(t4) {
          return e5.locked.has(t4);
        }, this.lock = function(t4) {
          return new Promise(function(i4, o3) {
            e5.isLocked(t4) ? e5.addToLocked(t4, i4) : (e5.addToLocked(t4), i4());
          });
        }, this.unlock = function(t4) {
          var i4 = e5.locked.get(t4);
          if (void 0 !== i4 && 0 !== i4.length) {
            var o3 = i4.pop();
            e5.locked.set(t4, i4), void 0 !== o3 && setTimeout(o3, 0);
          } else e5.locked.delete(t4);
        };
      }
      return e4.getInstance = function() {
        return void 0 === e4.instance && (e4.instance = new e4()), e4.instance;
      }, e4;
    }();
    t3.default = function() {
      return i3.getInstance();
    };
  });
  i(n);
  var a = i(o(function(e3, i3) {
    var o3 = t && t.__awaiter || function(e4, t3, i4, o4) {
      return new (i4 || (i4 = Promise))(function(n3, a4) {
        function r4(e5) {
          try {
            c4(o4.next(e5));
          } catch (e6) {
            a4(e6);
          }
        }
        function s4(e5) {
          try {
            c4(o4.throw(e5));
          } catch (e6) {
            a4(e6);
          }
        }
        function c4(e5) {
          e5.done ? n3(e5.value) : new i4(function(t4) {
            t4(e5.value);
          }).then(r4, s4);
        }
        c4((o4 = o4.apply(e4, t3 || [])).next());
      });
    }, a3 = t && t.__generator || function(e4, t3) {
      var i4, o4, n3, a4, r4 = { label: 0, sent: function() {
        if (1 & n3[0]) throw n3[1];
        return n3[1];
      }, trys: [], ops: [] };
      return a4 = { next: s4(0), throw: s4(1), return: s4(2) }, "function" == typeof Symbol && (a4[Symbol.iterator] = function() {
        return this;
      }), a4;
      function s4(a5) {
        return function(s5) {
          return function(a6) {
            if (i4) throw new TypeError("Generator is already executing.");
            for (; r4; ) try {
              if (i4 = 1, o4 && (n3 = 2 & a6[0] ? o4.return : a6[0] ? o4.throw || ((n3 = o4.return) && n3.call(o4), 0) : o4.next) && !(n3 = n3.call(o4, a6[1])).done) return n3;
              switch (o4 = 0, n3 && (a6 = [2 & a6[0], n3.value]), a6[0]) {
                case 0:
                case 1:
                  n3 = a6;
                  break;
                case 4:
                  return r4.label++, { value: a6[1], done: false };
                case 5:
                  r4.label++, o4 = a6[1], a6 = [0];
                  continue;
                case 7:
                  a6 = r4.ops.pop(), r4.trys.pop();
                  continue;
                default:
                  if (!(n3 = r4.trys, (n3 = n3.length > 0 && n3[n3.length - 1]) || 6 !== a6[0] && 2 !== a6[0])) {
                    r4 = 0;
                    continue;
                  }
                  if (3 === a6[0] && (!n3 || a6[1] > n3[0] && a6[1] < n3[3])) {
                    r4.label = a6[1];
                    break;
                  }
                  if (6 === a6[0] && r4.label < n3[1]) {
                    r4.label = n3[1], n3 = a6;
                    break;
                  }
                  if (n3 && r4.label < n3[2]) {
                    r4.label = n3[2], r4.ops.push(a6);
                    break;
                  }
                  n3[2] && r4.ops.pop(), r4.trys.pop();
                  continue;
              }
              a6 = t3.call(e4, r4);
            } catch (e5) {
              a6 = [6, e5], o4 = 0;
            } finally {
              i4 = n3 = 0;
            }
            if (5 & a6[0]) throw a6[1];
            return { value: a6[0] ? a6[1] : void 0, done: true };
          }([a5, s5]);
        };
      }
    }, r3 = t;
    Object.defineProperty(i3, "__esModule", { value: true });
    var s3 = "browser-tabs-lock-key", c3 = { key: function(e4) {
      return o3(r3, void 0, void 0, function() {
        return a3(this, function(e5) {
          throw new Error("Unsupported");
        });
      });
    }, getItem: function(e4) {
      return o3(r3, void 0, void 0, function() {
        return a3(this, function(e5) {
          throw new Error("Unsupported");
        });
      });
    }, clear: function() {
      return o3(r3, void 0, void 0, function() {
        return a3(this, function(e4) {
          return [2, window.localStorage.clear()];
        });
      });
    }, removeItem: function(e4) {
      return o3(r3, void 0, void 0, function() {
        return a3(this, function(e5) {
          throw new Error("Unsupported");
        });
      });
    }, setItem: function(e4, t3) {
      return o3(r3, void 0, void 0, function() {
        return a3(this, function(e5) {
          throw new Error("Unsupported");
        });
      });
    }, keySync: function(e4) {
      return window.localStorage.key(e4);
    }, getItemSync: function(e4) {
      return window.localStorage.getItem(e4);
    }, clearSync: function() {
      return window.localStorage.clear();
    }, removeItemSync: function(e4) {
      return window.localStorage.removeItem(e4);
    }, setItemSync: function(e4, t3) {
      return window.localStorage.setItem(e4, t3);
    } };
    function d3(e4) {
      return new Promise(function(t3) {
        return setTimeout(t3, e4);
      });
    }
    function u3(e4) {
      for (var t3 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz", i4 = "", o4 = 0; o4 < e4; o4++) {
        i4 += t3[Math.floor(Math.random() * t3.length)];
      }
      return i4;
    }
    var l3 = function() {
      function e4(t3) {
        this.acquiredIatSet = /* @__PURE__ */ new Set(), this.storageHandler = void 0, this.id = Date.now().toString() + u3(15), this.acquireLock = this.acquireLock.bind(this), this.releaseLock = this.releaseLock.bind(this), this.releaseLock__private__ = this.releaseLock__private__.bind(this), this.waitForSomethingToChange = this.waitForSomethingToChange.bind(this), this.refreshLockWhileAcquired = this.refreshLockWhileAcquired.bind(this), this.storageHandler = t3, void 0 === e4.waiters && (e4.waiters = []);
      }
      return e4.prototype.acquireLock = function(t3, i4) {
        return void 0 === i4 && (i4 = 5e3), o3(this, void 0, void 0, function() {
          var o4, n3, r4, l4, h3, p3, m3;
          return a3(this, function(a4) {
            switch (a4.label) {
              case 0:
                o4 = Date.now() + u3(4), n3 = Date.now() + i4, r4 = s3 + "-" + t3, l4 = void 0 === this.storageHandler ? c3 : this.storageHandler, a4.label = 1;
              case 1:
                return Date.now() < n3 ? [4, d3(30)] : [3, 8];
              case 2:
                return a4.sent(), null !== l4.getItemSync(r4) ? [3, 5] : (h3 = this.id + "-" + t3 + "-" + o4, [4, d3(Math.floor(25 * Math.random()))]);
              case 3:
                return a4.sent(), l4.setItemSync(r4, JSON.stringify({ id: this.id, iat: o4, timeoutKey: h3, timeAcquired: Date.now(), timeRefreshed: Date.now() })), [4, d3(30)];
              case 4:
                return a4.sent(), null !== (p3 = l4.getItemSync(r4)) && (m3 = JSON.parse(p3)).id === this.id && m3.iat === o4 ? (this.acquiredIatSet.add(o4), this.refreshLockWhileAcquired(r4, o4), [2, true]) : [3, 7];
              case 5:
                return e4.lockCorrector(void 0 === this.storageHandler ? c3 : this.storageHandler), [4, this.waitForSomethingToChange(n3)];
              case 6:
                a4.sent(), a4.label = 7;
              case 7:
                return o4 = Date.now() + u3(4), [3, 1];
              case 8:
                return [2, false];
            }
          });
        });
      }, e4.prototype.refreshLockWhileAcquired = function(e5, t3) {
        return o3(this, void 0, void 0, function() {
          var i4 = this;
          return a3(this, function(r4) {
            return setTimeout(function() {
              return o3(i4, void 0, void 0, function() {
                var i5, o4, r5;
                return a3(this, function(a4) {
                  switch (a4.label) {
                    case 0:
                      return [4, n.default().lock(t3)];
                    case 1:
                      return a4.sent(), this.acquiredIatSet.has(t3) ? (i5 = void 0 === this.storageHandler ? c3 : this.storageHandler, null === (o4 = i5.getItemSync(e5)) ? (n.default().unlock(t3), [2]) : ((r5 = JSON.parse(o4)).timeRefreshed = Date.now(), i5.setItemSync(e5, JSON.stringify(r5)), n.default().unlock(t3), this.refreshLockWhileAcquired(e5, t3), [2])) : (n.default().unlock(t3), [2]);
                  }
                });
              });
            }, 1e3), [2];
          });
        });
      }, e4.prototype.waitForSomethingToChange = function(t3) {
        return o3(this, void 0, void 0, function() {
          return a3(this, function(i4) {
            switch (i4.label) {
              case 0:
                return [4, new Promise(function(i5) {
                  var o4 = false, n3 = Date.now(), a4 = false;
                  function r4() {
                    if (a4 || (window.removeEventListener("storage", r4), e4.removeFromWaiting(r4), clearTimeout(s4), a4 = true), !o4) {
                      o4 = true;
                      var t4 = 50 - (Date.now() - n3);
                      t4 > 0 ? setTimeout(i5, t4) : i5(null);
                    }
                  }
                  window.addEventListener("storage", r4), e4.addToWaiting(r4);
                  var s4 = setTimeout(r4, Math.max(0, t3 - Date.now()));
                })];
              case 1:
                return i4.sent(), [2];
            }
          });
        });
      }, e4.addToWaiting = function(t3) {
        this.removeFromWaiting(t3), void 0 !== e4.waiters && e4.waiters.push(t3);
      }, e4.removeFromWaiting = function(t3) {
        void 0 !== e4.waiters && (e4.waiters = e4.waiters.filter(function(e5) {
          return e5 !== t3;
        }));
      }, e4.notifyWaiters = function() {
        void 0 !== e4.waiters && e4.waiters.slice().forEach(function(e5) {
          return e5();
        });
      }, e4.prototype.releaseLock = function(e5) {
        return o3(this, void 0, void 0, function() {
          return a3(this, function(t3) {
            switch (t3.label) {
              case 0:
                return [4, this.releaseLock__private__(e5)];
              case 1:
                return [2, t3.sent()];
            }
          });
        });
      }, e4.prototype.releaseLock__private__ = function(t3) {
        return o3(this, void 0, void 0, function() {
          var i4, o4, r4, d4;
          return a3(this, function(a4) {
            switch (a4.label) {
              case 0:
                return i4 = void 0 === this.storageHandler ? c3 : this.storageHandler, o4 = s3 + "-" + t3, null === (r4 = i4.getItemSync(o4)) ? [2] : (d4 = JSON.parse(r4)).id !== this.id ? [3, 2] : [4, n.default().lock(d4.iat)];
              case 1:
                a4.sent(), this.acquiredIatSet.delete(d4.iat), i4.removeItemSync(o4), n.default().unlock(d4.iat), e4.notifyWaiters(), a4.label = 2;
              case 2:
                return [2];
            }
          });
        });
      }, e4.lockCorrector = function(t3) {
        for (var i4 = Date.now() - 5e3, o4 = t3, n3 = [], a4 = 0; ; ) {
          var r4 = o4.keySync(a4);
          if (null === r4) break;
          n3.push(r4), a4++;
        }
        for (var c4 = false, d4 = 0; d4 < n3.length; d4++) {
          var u4 = n3[d4];
          if (u4.includes(s3)) {
            var l4 = o4.getItemSync(u4);
            if (null !== l4) {
              var h3 = JSON.parse(l4);
              (void 0 === h3.timeRefreshed && h3.timeAcquired < i4 || void 0 !== h3.timeRefreshed && h3.timeRefreshed < i4) && (o4.removeItemSync(u4), c4 = true);
            }
          }
        }
        c4 && e4.notifyWaiters();
      }, e4.waiters = void 0, e4;
    }();
    i3.default = l3;
  }));
  var r = { timeoutInSeconds: 60 };
  var s = { name: "auth0-spa-js", version: "2.1.3" };
  var c = () => Date.now();
  var d = class _d extends Error {
    constructor(e3, t3) {
      super(t3), this.error = e3, this.error_description = t3, Object.setPrototypeOf(this, _d.prototype);
    }
    static fromPayload({ error: e3, error_description: t3 }) {
      return new _d(e3, t3);
    }
  };
  var u = class _u extends d {
    constructor(e3, t3, i3, o3 = null) {
      super(e3, t3), this.state = i3, this.appState = o3, Object.setPrototypeOf(this, _u.prototype);
    }
  };
  var l = class _l extends d {
    constructor() {
      super("timeout", "Timeout"), Object.setPrototypeOf(this, _l.prototype);
    }
  };
  var h = class _h extends l {
    constructor(e3) {
      super(), this.popup = e3, Object.setPrototypeOf(this, _h.prototype);
    }
  };
  var p = class _p extends d {
    constructor(e3) {
      super("cancelled", "Popup closed"), this.popup = e3, Object.setPrototypeOf(this, _p.prototype);
    }
  };
  var m = class _m extends d {
    constructor(e3, t3, i3) {
      super(e3, t3), this.mfa_token = i3, Object.setPrototypeOf(this, _m.prototype);
    }
  };
  var f = class _f extends d {
    constructor(e3, t3) {
      super("missing_refresh_token", `Missing Refresh Token (audience: '${g(e3, ["default"])}', scope: '${g(t3)}')`), this.audience = e3, this.scope = t3, Object.setPrototypeOf(this, _f.prototype);
    }
  };
  function g(e3, t3 = []) {
    return e3 && !t3.includes(e3) ? e3 : "";
  }
  var w = () => window.crypto;
  var y = () => {
    const e3 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_~.";
    let t3 = "";
    return Array.from(w().getRandomValues(new Uint8Array(43))).forEach((i3) => t3 += e3[i3 % e3.length]), t3;
  };
  var k = (e3) => btoa(e3);
  var v = (t3) => {
    var { clientId: i3 } = t3, o3 = e(t3, ["clientId"]);
    return new URLSearchParams(((e3) => Object.keys(e3).filter((t4) => void 0 !== e3[t4]).reduce((t4, i4) => Object.assign(Object.assign({}, t4), { [i4]: e3[i4] }), {}))(Object.assign({ client_id: i3 }, o3))).toString();
  };
  var b = (e3) => ((e4) => decodeURIComponent(atob(e4).split("").map((e5) => "%" + ("00" + e5.charCodeAt(0).toString(16)).slice(-2)).join("")))(e3.replace(/_/g, "/").replace(/-/g, "+"));
  var _ = async (e3, t3) => {
    const i3 = await fetch(e3, t3);
    return { ok: i3.ok, json: await i3.json() };
  };
  var I = async (e3, t3, i3) => {
    const o3 = new AbortController();
    let n3;
    return t3.signal = o3.signal, Promise.race([_(e3, t3), new Promise((e4, t4) => {
      n3 = setTimeout(() => {
        o3.abort(), t4(new Error("Timeout when executing 'fetch'"));
      }, i3);
    })]).finally(() => {
      clearTimeout(n3);
    });
  };
  var S = async (e3, t3, i3, o3, n3, a3, r3) => {
    return s3 = { auth: { audience: t3, scope: i3 }, timeout: n3, fetchUrl: e3, fetchOptions: o3, useFormData: r3 }, c3 = a3, new Promise(function(e4, t4) {
      const i4 = new MessageChannel();
      i4.port1.onmessage = function(o4) {
        o4.data.error ? t4(new Error(o4.data.error)) : e4(o4.data), i4.port1.close();
      }, c3.postMessage(s3, [i4.port2]);
    });
    var s3, c3;
  };
  var O = async (e3, t3, i3, o3, n3, a3, r3 = 1e4) => n3 ? S(e3, t3, i3, o3, r3, n3, a3) : I(e3, o3, r3);
  async function T(t3, i3) {
    var { baseUrl: o3, timeout: n3, audience: a3, scope: r3, auth0Client: c3, useFormData: u3 } = t3, l3 = e(t3, ["baseUrl", "timeout", "audience", "scope", "auth0Client", "useFormData"]);
    const h3 = u3 ? v(l3) : JSON.stringify(l3);
    return await async function(t4, i4, o4, n4, a4, r4, s3) {
      let c4, u4 = null;
      for (let e3 = 0; e3 < 3; e3++) try {
        c4 = await O(t4, o4, n4, a4, r4, s3, i4), u4 = null;
        break;
      } catch (e4) {
        u4 = e4;
      }
      if (u4) throw u4;
      const l4 = c4.json, { error: h4, error_description: p3 } = l4, g3 = e(l4, ["error", "error_description"]), { ok: w3 } = c4;
      if (!w3) {
        const e3 = p3 || `HTTP error. Unable to fetch ${t4}`;
        if ("mfa_required" === h4) throw new m(h4, e3, g3.mfa_token);
        if ("missing_refresh_token" === h4) throw new f(o4, n4);
        throw new d(h4 || "request_error", e3);
      }
      return g3;
    }(`${o3}/oauth/token`, n3, a3 || "default", r3, { method: "POST", body: h3, headers: { "Content-Type": u3 ? "application/x-www-form-urlencoded" : "application/json", "Auth0-Client": btoa(JSON.stringify(c3 || s)) } }, i3, u3);
  }
  var j = (...e3) => {
    return (t3 = e3.filter(Boolean).join(" ").trim().split(/\s+/), Array.from(new Set(t3))).join(" ");
    var t3;
  };
  var C = class _C {
    constructor(e3, t3 = "@@auth0spajs@@", i3) {
      this.prefix = t3, this.suffix = i3, this.clientId = e3.clientId, this.scope = e3.scope, this.audience = e3.audience;
    }
    toKey() {
      return [this.prefix, this.clientId, this.audience, this.scope, this.suffix].filter(Boolean).join("::");
    }
    static fromKey(e3) {
      const [t3, i3, o3, n3] = e3.split("::");
      return new _C({ clientId: i3, scope: n3, audience: o3 }, t3);
    }
    static fromCacheEntry(e3) {
      const { scope: t3, audience: i3, client_id: o3 } = e3;
      return new _C({ scope: t3, audience: i3, clientId: o3 });
    }
  };
  var z = class {
    set(e3, t3) {
      localStorage.setItem(e3, JSON.stringify(t3));
    }
    get(e3) {
      const t3 = window.localStorage.getItem(e3);
      if (t3) try {
        return JSON.parse(t3);
      } catch (e4) {
        return;
      }
    }
    remove(e3) {
      localStorage.removeItem(e3);
    }
    allKeys() {
      return Object.keys(window.localStorage).filter((e3) => e3.startsWith("@@auth0spajs@@"));
    }
  };
  var P = class {
    constructor() {
      this.enclosedCache = /* @__PURE__ */ function() {
        let e3 = {};
        return { set(t3, i3) {
          e3[t3] = i3;
        }, get(t3) {
          const i3 = e3[t3];
          if (i3) return i3;
        }, remove(t3) {
          delete e3[t3];
        }, allKeys: () => Object.keys(e3) };
      }();
    }
  };
  var x = class {
    constructor(e3, t3, i3) {
      this.cache = e3, this.keyManifest = t3, this.nowProvider = i3 || c;
    }
    async setIdToken(e3, t3, i3) {
      var o3;
      const n3 = this.getIdTokenCacheKey(e3);
      await this.cache.set(n3, { id_token: t3, decodedToken: i3 }), await (null === (o3 = this.keyManifest) || void 0 === o3 ? void 0 : o3.add(n3));
    }
    async getIdToken(e3) {
      const t3 = await this.cache.get(this.getIdTokenCacheKey(e3.clientId));
      if (!t3 && e3.scope && e3.audience) {
        const t4 = await this.get(e3);
        if (!t4) return;
        if (!t4.id_token || !t4.decodedToken) return;
        return { id_token: t4.id_token, decodedToken: t4.decodedToken };
      }
      if (t3) return { id_token: t3.id_token, decodedToken: t3.decodedToken };
    }
    async get(e3, t3 = 0) {
      var i3;
      let o3 = await this.cache.get(e3.toKey());
      if (!o3) {
        const t4 = await this.getCacheKeys();
        if (!t4) return;
        const i4 = this.matchExistingCacheKey(e3, t4);
        i4 && (o3 = await this.cache.get(i4));
      }
      if (!o3) return;
      const n3 = await this.nowProvider(), a3 = Math.floor(n3 / 1e3);
      return o3.expiresAt - t3 < a3 ? o3.body.refresh_token ? (o3.body = { refresh_token: o3.body.refresh_token }, await this.cache.set(e3.toKey(), o3), o3.body) : (await this.cache.remove(e3.toKey()), void await (null === (i3 = this.keyManifest) || void 0 === i3 ? void 0 : i3.remove(e3.toKey()))) : o3.body;
    }
    async set(e3) {
      var t3;
      const i3 = new C({ clientId: e3.client_id, scope: e3.scope, audience: e3.audience }), o3 = await this.wrapCacheEntry(e3);
      await this.cache.set(i3.toKey(), o3), await (null === (t3 = this.keyManifest) || void 0 === t3 ? void 0 : t3.add(i3.toKey()));
    }
    async clear(e3) {
      var t3;
      const i3 = await this.getCacheKeys();
      i3 && (await i3.filter((t4) => !e3 || t4.includes(e3)).reduce(async (e4, t4) => {
        await e4, await this.cache.remove(t4);
      }, Promise.resolve()), await (null === (t3 = this.keyManifest) || void 0 === t3 ? void 0 : t3.clear()));
    }
    async wrapCacheEntry(e3) {
      const t3 = await this.nowProvider();
      return { body: e3, expiresAt: Math.floor(t3 / 1e3) + e3.expires_in };
    }
    async getCacheKeys() {
      var e3;
      return this.keyManifest ? null === (e3 = await this.keyManifest.get()) || void 0 === e3 ? void 0 : e3.keys : this.cache.allKeys ? this.cache.allKeys() : void 0;
    }
    getIdTokenCacheKey(e3) {
      return new C({ clientId: e3 }, "@@auth0spajs@@", "@@user@@").toKey();
    }
    matchExistingCacheKey(e3, t3) {
      return t3.filter((t4) => {
        var i3;
        const o3 = C.fromKey(t4), n3 = new Set(o3.scope && o3.scope.split(" ")), a3 = (null === (i3 = e3.scope) || void 0 === i3 ? void 0 : i3.split(" ")) || [], r3 = o3.scope && a3.reduce((e4, t5) => e4 && n3.has(t5), true);
        return "@@auth0spajs@@" === o3.prefix && o3.clientId === e3.clientId && o3.audience === e3.audience && r3;
      })[0];
    }
  };
  var Z = class {
    constructor(e3, t3, i3) {
      this.storage = e3, this.clientId = t3, this.cookieDomain = i3, this.storageKey = `a0.spajs.txs.${this.clientId}`;
    }
    create(e3) {
      this.storage.save(this.storageKey, e3, { daysUntilExpire: 1, cookieDomain: this.cookieDomain });
    }
    get() {
      return this.storage.get(this.storageKey);
    }
    remove() {
      this.storage.remove(this.storageKey, { cookieDomain: this.cookieDomain });
    }
  };
  var K = (e3) => "number" == typeof e3;
  var W = ["iss", "aud", "exp", "nbf", "iat", "jti", "azp", "nonce", "auth_time", "at_hash", "c_hash", "acr", "amr", "sub_jwk", "cnf", "sip_from_tag", "sip_date", "sip_callid", "sip_cseq_num", "sip_via_branch", "orig", "dest", "mky", "events", "toe", "txn", "rph", "sid", "vot", "vtm"];
  var E = (e3) => {
    if (!e3.id_token) throw new Error("ID token is required but missing");
    const t3 = ((e4) => {
      const t4 = e4.split("."), [i4, o4, n4] = t4;
      if (3 !== t4.length || !i4 || !o4 || !n4) throw new Error("ID token could not be decoded");
      const a3 = JSON.parse(b(o4)), r3 = { __raw: e4 }, s3 = {};
      return Object.keys(a3).forEach((e5) => {
        r3[e5] = a3[e5], W.includes(e5) || (s3[e5] = a3[e5]);
      }), { encoded: { header: i4, payload: o4, signature: n4 }, header: JSON.parse(b(i4)), claims: r3, user: s3 };
    })(e3.id_token);
    if (!t3.claims.iss) throw new Error("Issuer (iss) claim must be a string present in the ID token");
    if (t3.claims.iss !== e3.iss) throw new Error(`Issuer (iss) claim mismatch in the ID token; expected "${e3.iss}", found "${t3.claims.iss}"`);
    if (!t3.user.sub) throw new Error("Subject (sub) claim must be a string present in the ID token");
    if ("RS256" !== t3.header.alg) throw new Error(`Signature algorithm of "${t3.header.alg}" is not supported. Expected the ID token to be signed with "RS256".`);
    if (!t3.claims.aud || "string" != typeof t3.claims.aud && !Array.isArray(t3.claims.aud)) throw new Error("Audience (aud) claim must be a string or array of strings present in the ID token");
    if (Array.isArray(t3.claims.aud)) {
      if (!t3.claims.aud.includes(e3.aud)) throw new Error(`Audience (aud) claim mismatch in the ID token; expected "${e3.aud}" but was not one of "${t3.claims.aud.join(", ")}"`);
      if (t3.claims.aud.length > 1) {
        if (!t3.claims.azp) throw new Error("Authorized Party (azp) claim must be a string present in the ID token when Audience (aud) claim has multiple values");
        if (t3.claims.azp !== e3.aud) throw new Error(`Authorized Party (azp) claim mismatch in the ID token; expected "${e3.aud}", found "${t3.claims.azp}"`);
      }
    } else if (t3.claims.aud !== e3.aud) throw new Error(`Audience (aud) claim mismatch in the ID token; expected "${e3.aud}" but found "${t3.claims.aud}"`);
    if (e3.nonce) {
      if (!t3.claims.nonce) throw new Error("Nonce (nonce) claim must be a string present in the ID token");
      if (t3.claims.nonce !== e3.nonce) throw new Error(`Nonce (nonce) claim mismatch in the ID token; expected "${e3.nonce}", found "${t3.claims.nonce}"`);
    }
    if (e3.max_age && !K(t3.claims.auth_time)) throw new Error("Authentication Time (auth_time) claim must be a number present in the ID token when Max Age (max_age) is specified");
    if (null == t3.claims.exp || !K(t3.claims.exp)) throw new Error("Expiration Time (exp) claim must be a number present in the ID token");
    if (!K(t3.claims.iat)) throw new Error("Issued At (iat) claim must be a number present in the ID token");
    const i3 = e3.leeway || 60, o3 = new Date(e3.now || Date.now()), n3 = /* @__PURE__ */ new Date(0);
    if (n3.setUTCSeconds(t3.claims.exp + i3), o3 > n3) throw new Error(`Expiration Time (exp) claim error in the ID token; current time (${o3}) is after expiration time (${n3})`);
    if (null != t3.claims.nbf && K(t3.claims.nbf)) {
      const e4 = /* @__PURE__ */ new Date(0);
      if (e4.setUTCSeconds(t3.claims.nbf - i3), o3 < e4) throw new Error(`Not Before time (nbf) claim in the ID token indicates that this token can't be used just yet. Current time (${o3}) is before ${e4}`);
    }
    if (null != t3.claims.auth_time && K(t3.claims.auth_time)) {
      const n4 = /* @__PURE__ */ new Date(0);
      if (n4.setUTCSeconds(parseInt(t3.claims.auth_time) + e3.max_age + i3), o3 > n4) throw new Error(`Authentication Time (auth_time) claim in the ID token indicates that too much time has passed since the last end-user authentication. Current time (${o3}) is after last auth at ${n4}`);
    }
    if (e3.organization) {
      const i4 = e3.organization.trim();
      if (i4.startsWith("org_")) {
        const e4 = i4;
        if (!t3.claims.org_id) throw new Error("Organization ID (org_id) claim must be a string present in the ID token");
        if (e4 !== t3.claims.org_id) throw new Error(`Organization ID (org_id) claim mismatch in the ID token; expected "${e4}", found "${t3.claims.org_id}"`);
      } else {
        const e4 = i4.toLowerCase();
        if (!t3.claims.org_name) throw new Error("Organization Name (org_name) claim must be a string present in the ID token");
        if (e4 !== t3.claims.org_name) throw new Error(`Organization Name (org_name) claim mismatch in the ID token; expected "${e4}", found "${t3.claims.org_name}"`);
      }
    }
    return t3;
  };
  var R = o(function(e3, i3) {
    var o3 = t && t.__assign || function() {
      return o3 = Object.assign || function(e4) {
        for (var t3, i4 = 1, o4 = arguments.length; i4 < o4; i4++) for (var n4 in t3 = arguments[i4]) Object.prototype.hasOwnProperty.call(t3, n4) && (e4[n4] = t3[n4]);
        return e4;
      }, o3.apply(this, arguments);
    };
    function n3(e4, t3) {
      if (!t3) return "";
      var i4 = "; " + e4;
      return true === t3 ? i4 : i4 + "=" + t3;
    }
    function a3(e4, t3, i4) {
      return encodeURIComponent(e4).replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent).replace(/\(/g, "%28").replace(/\)/g, "%29") + "=" + encodeURIComponent(t3).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent) + function(e5) {
        if ("number" == typeof e5.expires) {
          var t4 = /* @__PURE__ */ new Date();
          t4.setMilliseconds(t4.getMilliseconds() + 864e5 * e5.expires), e5.expires = t4;
        }
        return n3("Expires", e5.expires ? e5.expires.toUTCString() : "") + n3("Domain", e5.domain) + n3("Path", e5.path) + n3("Secure", e5.secure) + n3("SameSite", e5.sameSite);
      }(i4);
    }
    function r3(e4) {
      for (var t3 = {}, i4 = e4 ? e4.split("; ") : [], o4 = /(%[\dA-F]{2})+/gi, n4 = 0; n4 < i4.length; n4++) {
        var a4 = i4[n4].split("="), r4 = a4.slice(1).join("=");
        '"' === r4.charAt(0) && (r4 = r4.slice(1, -1));
        try {
          t3[a4[0].replace(o4, decodeURIComponent)] = r4.replace(o4, decodeURIComponent);
        } catch (e5) {
        }
      }
      return t3;
    }
    function s3() {
      return r3(document.cookie);
    }
    function c3(e4, t3, i4) {
      document.cookie = a3(e4, t3, o3({ path: "/" }, i4));
    }
    i3.__esModule = true, i3.encode = a3, i3.parse = r3, i3.getAll = s3, i3.get = function(e4) {
      return s3()[e4];
    }, i3.set = c3, i3.remove = function(e4, t3) {
      c3(e4, "", o3(o3({}, t3), { expires: -1 }));
    };
  });
  i(R), R.encode, R.parse, R.getAll;
  var U = R.get;
  var L = R.set;
  var D = R.remove;
  var X = { get(e3) {
    const t3 = U(e3);
    if (void 0 !== t3) return JSON.parse(t3);
  }, save(e3, t3, i3) {
    let o3 = {};
    "https:" === window.location.protocol && (o3 = { secure: true, sameSite: "none" }), (null == i3 ? void 0 : i3.daysUntilExpire) && (o3.expires = i3.daysUntilExpire), (null == i3 ? void 0 : i3.cookieDomain) && (o3.domain = i3.cookieDomain), L(e3, JSON.stringify(t3), o3);
  }, remove(e3, t3) {
    let i3 = {};
    (null == t3 ? void 0 : t3.cookieDomain) && (i3.domain = t3.cookieDomain), D(e3, i3);
  } };
  var N = { get(e3) {
    const t3 = X.get(e3);
    return t3 || X.get(`_legacy_${e3}`);
  }, save(e3, t3, i3) {
    let o3 = {};
    "https:" === window.location.protocol && (o3 = { secure: true }), (null == i3 ? void 0 : i3.daysUntilExpire) && (o3.expires = i3.daysUntilExpire), (null == i3 ? void 0 : i3.cookieDomain) && (o3.domain = i3.cookieDomain), L(`_legacy_${e3}`, JSON.stringify(t3), o3), X.save(e3, t3, i3);
  }, remove(e3, t3) {
    let i3 = {};
    (null == t3 ? void 0 : t3.cookieDomain) && (i3.domain = t3.cookieDomain), D(e3, i3), X.remove(e3, t3), X.remove(`_legacy_${e3}`, t3);
  } };
  var J = { get(e3) {
    if ("undefined" == typeof sessionStorage) return;
    const t3 = sessionStorage.getItem(e3);
    return null != t3 ? JSON.parse(t3) : void 0;
  }, save(e3, t3) {
    sessionStorage.setItem(e3, JSON.stringify(t3));
  }, remove(e3) {
    sessionStorage.removeItem(e3);
  } };
  function F(e3, t3, i3) {
    var o3 = void 0 === t3 ? null : t3, n3 = function(e4, t4) {
      var i4 = atob(e4);
      if (t4) {
        for (var o4 = new Uint8Array(i4.length), n4 = 0, a4 = i4.length; n4 < a4; ++n4) o4[n4] = i4.charCodeAt(n4);
        return String.fromCharCode.apply(null, new Uint16Array(o4.buffer));
      }
      return i4;
    }(e3, void 0 !== i3 && i3), a3 = n3.indexOf("\n", 10) + 1, r3 = n3.substring(a3) + (o3 ? "//# sourceMappingURL=" + o3 : ""), s3 = new Blob([r3], { type: "application/javascript" });
    return URL.createObjectURL(s3);
  }
  var H;
  var Y;
  var G;
  var V;
  var M = (H = "Lyogcm9sbHVwLXBsdWdpbi13ZWItd29ya2VyLWxvYWRlciAqLwohZnVuY3Rpb24oKXsidXNlIHN0cmljdCI7Y2xhc3MgZSBleHRlbmRzIEVycm9ye2NvbnN0cnVjdG9yKHQscil7c3VwZXIociksdGhpcy5lcnJvcj10LHRoaXMuZXJyb3JfZGVzY3JpcHRpb249cixPYmplY3Quc2V0UHJvdG90eXBlT2YodGhpcyxlLnByb3RvdHlwZSl9c3RhdGljIGZyb21QYXlsb2FkKHtlcnJvcjp0LGVycm9yX2Rlc2NyaXB0aW9uOnJ9KXtyZXR1cm4gbmV3IGUodCxyKX19Y2xhc3MgdCBleHRlbmRzIGV7Y29uc3RydWN0b3IoZSxzKXtzdXBlcigibWlzc2luZ19yZWZyZXNoX3Rva2VuIixgTWlzc2luZyBSZWZyZXNoIFRva2VuIChhdWRpZW5jZTogJyR7cihlLFsiZGVmYXVsdCJdKX0nLCBzY29wZTogJyR7cihzKX0nKWApLHRoaXMuYXVkaWVuY2U9ZSx0aGlzLnNjb3BlPXMsT2JqZWN0LnNldFByb3RvdHlwZU9mKHRoaXMsdC5wcm90b3R5cGUpfX1mdW5jdGlvbiByKGUsdD1bXSl7cmV0dXJuIGUmJiF0LmluY2x1ZGVzKGUpP2U6IiJ9ImZ1bmN0aW9uIj09dHlwZW9mIFN1cHByZXNzZWRFcnJvciYmU3VwcHJlc3NlZEVycm9yO2NvbnN0IHM9ZT0+e3ZhcntjbGllbnRJZDp0fT1lLHI9ZnVuY3Rpb24oZSx0KXt2YXIgcj17fTtmb3IodmFyIHMgaW4gZSlPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoZSxzKSYmdC5pbmRleE9mKHMpPDAmJihyW3NdPWVbc10pO2lmKG51bGwhPWUmJiJmdW5jdGlvbiI9PXR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKXt2YXIgbz0wO2ZvcihzPU9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMoZSk7bzxzLmxlbmd0aDtvKyspdC5pbmRleE9mKHNbb10pPDAmJk9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChlLHNbb10pJiYocltzW29dXT1lW3Nbb11dKX1yZXR1cm4gcn0oZSxbImNsaWVudElkIl0pO3JldHVybiBuZXcgVVJMU2VhcmNoUGFyYW1zKChlPT5PYmplY3Qua2V5cyhlKS5maWx0ZXIoKHQ9PnZvaWQgMCE9PWVbdF0pKS5yZWR1Y2UoKCh0LHIpPT5PYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sdCkse1tyXTplW3JdfSkpLHt9KSkoT2JqZWN0LmFzc2lnbih7Y2xpZW50X2lkOnR9LHIpKSkudG9TdHJpbmcoKX07bGV0IG89e307Y29uc3Qgbj0oZSx0KT0+YCR7ZX18JHt0fWA7YWRkRXZlbnRMaXN0ZW5lcigibWVzc2FnZSIsKGFzeW5jKHtkYXRhOnt0aW1lb3V0OmUsYXV0aDpyLGZldGNoVXJsOmksZmV0Y2hPcHRpb25zOmMsdXNlRm9ybURhdGE6YX0scG9ydHM6W3BdfSk9PntsZXQgZjtjb25zdHthdWRpZW5jZTp1LHNjb3BlOmx9PXJ8fHt9O3RyeXtjb25zdCByPWE/KGU9Pntjb25zdCB0PW5ldyBVUkxTZWFyY2hQYXJhbXMoZSkscj17fTtyZXR1cm4gdC5mb3JFYWNoKCgoZSx0KT0+e3JbdF09ZX0pKSxyfSkoYy5ib2R5KTpKU09OLnBhcnNlKGMuYm9keSk7aWYoIXIucmVmcmVzaF90b2tlbiYmInJlZnJlc2hfdG9rZW4iPT09ci5ncmFudF90eXBlKXtjb25zdCBlPSgoZSx0KT0+b1tuKGUsdCldKSh1LGwpO2lmKCFlKXRocm93IG5ldyB0KHUsbCk7Yy5ib2R5PWE/cyhPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30scikse3JlZnJlc2hfdG9rZW46ZX0pKTpKU09OLnN0cmluZ2lmeShPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30scikse3JlZnJlc2hfdG9rZW46ZX0pKX1sZXQgaCxnOyJmdW5jdGlvbiI9PXR5cGVvZiBBYm9ydENvbnRyb2xsZXImJihoPW5ldyBBYm9ydENvbnRyb2xsZXIsYy5zaWduYWw9aC5zaWduYWwpO3RyeXtnPWF3YWl0IFByb21pc2UucmFjZShbKGQ9ZSxuZXcgUHJvbWlzZSgoZT0+c2V0VGltZW91dChlLGQpKSkpLGZldGNoKGksT2JqZWN0LmFzc2lnbih7fSxjKSldKX1jYXRjaChlKXtyZXR1cm4gdm9pZCBwLnBvc3RNZXNzYWdlKHtlcnJvcjplLm1lc3NhZ2V9KX1pZighZylyZXR1cm4gaCYmaC5hYm9ydCgpLHZvaWQgcC5wb3N0TWVzc2FnZSh7ZXJyb3I6IlRpbWVvdXQgd2hlbiBleGVjdXRpbmcgJ2ZldGNoJyJ9KTtmPWF3YWl0IGcuanNvbigpLGYucmVmcmVzaF90b2tlbj8oKChlLHQscik9PntvW24odCxyKV09ZX0pKGYucmVmcmVzaF90b2tlbix1LGwpLGRlbGV0ZSBmLnJlZnJlc2hfdG9rZW4pOigoZSx0KT0+e2RlbGV0ZSBvW24oZSx0KV19KSh1LGwpLHAucG9zdE1lc3NhZ2Uoe29rOmcub2ssanNvbjpmfSl9Y2F0Y2goZSl7cC5wb3N0TWVzc2FnZSh7b2s6ITEsanNvbjp7ZXJyb3I6ZS5lcnJvcixlcnJvcl9kZXNjcmlwdGlvbjplLm1lc3NhZ2V9fSl9dmFyIGR9KSl9KCk7Cgo=", Y = null, G = false, function(e3) {
    return V = V || F(H, Y, G), new Worker(V, e3);
  });
  var A = {};
  var B = class {
    constructor(e3, t3) {
      this.cache = e3, this.clientId = t3, this.manifestKey = this.createManifestKeyFrom(this.clientId);
    }
    async add(e3) {
      var t3;
      const i3 = new Set((null === (t3 = await this.cache.get(this.manifestKey)) || void 0 === t3 ? void 0 : t3.keys) || []);
      i3.add(e3), await this.cache.set(this.manifestKey, { keys: [...i3] });
    }
    async remove(e3) {
      const t3 = await this.cache.get(this.manifestKey);
      if (t3) {
        const i3 = new Set(t3.keys);
        return i3.delete(e3), i3.size > 0 ? await this.cache.set(this.manifestKey, { keys: [...i3] }) : await this.cache.remove(this.manifestKey);
      }
    }
    get() {
      return this.cache.get(this.manifestKey);
    }
    clear() {
      return this.cache.remove(this.manifestKey);
    }
    createManifestKeyFrom(e3) {
      return `@@auth0spajs@@::${e3}`;
    }
  };
  var $ = { memory: () => new P().enclosedCache, localstorage: () => new z() };
  var q = (e3) => $[e3];
  var Q = (t3) => {
    const { openUrl: i3, onRedirect: o3 } = t3, n3 = e(t3, ["openUrl", "onRedirect"]);
    return Object.assign(Object.assign({}, n3), { openUrl: false === i3 || i3 ? i3 : o3 });
  };
  var ee = new a();
  var te = class {
    constructor(e3) {
      let t3, i3;
      if (this.userCache = new P().enclosedCache, this.defaultOptions = { authorizationParams: { scope: "openid profile email" }, useRefreshTokensFallback: false, useFormData: true }, this._releaseLockOnPageHide = async () => {
        await ee.releaseLock("auth0.lock.getTokenSilently"), window.removeEventListener("pagehide", this._releaseLockOnPageHide);
      }, this.options = Object.assign(Object.assign(Object.assign({}, this.defaultOptions), e3), { authorizationParams: Object.assign(Object.assign({}, this.defaultOptions.authorizationParams), e3.authorizationParams) }), "undefined" != typeof window && (() => {
        if (!w()) throw new Error("For security reasons, `window.crypto` is required to run `auth0-spa-js`.");
        if (void 0 === w().subtle) throw new Error("\n      auth0-spa-js must run on a secure origin. See https://github.com/auth0/auth0-spa-js/blob/main/FAQ.md#why-do-i-get-auth0-spa-js-must-run-on-a-secure-origin for more information.\n    ");
      })(), e3.cache && e3.cacheLocation && console.warn("Both `cache` and `cacheLocation` options have been specified in the Auth0Client configuration; ignoring `cacheLocation` and using `cache`."), e3.cache) i3 = e3.cache;
      else {
        if (t3 = e3.cacheLocation || "memory", !q(t3)) throw new Error(`Invalid cache location "${t3}"`);
        i3 = q(t3)();
      }
      this.httpTimeoutMs = e3.httpTimeoutInSeconds ? 1e3 * e3.httpTimeoutInSeconds : 1e4, this.cookieStorage = false === e3.legacySameSiteCookie ? X : N, this.orgHintCookieName = `auth0.${this.options.clientId}.organization_hint`, this.isAuthenticatedCookieName = ((e4) => `auth0.${e4}.is.authenticated`)(this.options.clientId), this.sessionCheckExpiryDays = e3.sessionCheckExpiryDays || 1;
      const o3 = e3.useCookiesForTransactions ? this.cookieStorage : J;
      var n3;
      this.scope = j("openid", this.options.authorizationParams.scope, this.options.useRefreshTokens ? "offline_access" : ""), this.transactionManager = new Z(o3, this.options.clientId, this.options.cookieDomain), this.nowProvider = this.options.nowProvider || c, this.cacheManager = new x(i3, i3.allKeys ? void 0 : new B(i3, this.options.clientId), this.nowProvider), this.domainUrl = (n3 = this.options.domain, /^https?:\/\//.test(n3) ? n3 : `https://${n3}`), this.tokenIssuer = ((e4, t4) => e4 ? e4.startsWith("https://") ? e4 : `https://${e4}/` : `${t4}/`)(this.options.issuer, this.domainUrl), "undefined" != typeof window && window.Worker && this.options.useRefreshTokens && "memory" === t3 && (this.options.workerUrl ? this.worker = new Worker(this.options.workerUrl) : this.worker = new M());
    }
    _url(e3) {
      const t3 = encodeURIComponent(btoa(JSON.stringify(this.options.auth0Client || s)));
      return `${this.domainUrl}${e3}&auth0Client=${t3}`;
    }
    _authorizeUrl(e3) {
      return this._url(`/authorize?${v(e3)}`);
    }
    async _verifyIdToken(e3, t3, i3) {
      const o3 = await this.nowProvider();
      return E({ iss: this.tokenIssuer, aud: this.options.clientId, id_token: e3, nonce: t3, organization: i3, leeway: this.options.leeway, max_age: (n3 = this.options.authorizationParams.max_age, "string" != typeof n3 ? n3 : parseInt(n3, 10) || void 0), now: o3 });
      var n3;
    }
    _processOrgHint(e3) {
      e3 ? this.cookieStorage.save(this.orgHintCookieName, e3, { daysUntilExpire: this.sessionCheckExpiryDays, cookieDomain: this.options.cookieDomain }) : this.cookieStorage.remove(this.orgHintCookieName, { cookieDomain: this.options.cookieDomain });
    }
    async _prepareAuthorizeUrl(e3, t3, i3) {
      const o3 = k(y()), n3 = k(y()), a3 = y(), r3 = ((e4) => {
        const t4 = new Uint8Array(e4);
        return ((e5) => {
          const t5 = { "+": "-", "/": "_", "=": "" };
          return e5.replace(/[+/=]/g, (e6) => t5[e6]);
        })(window.btoa(String.fromCharCode(...Array.from(t4))));
      })(await (async (e4) => {
        const t4 = w().subtle.digest({ name: "SHA-256" }, new TextEncoder().encode(e4));
        return await t4;
      })(a3)), s3 = ((e4, t4, i4, o4, n4, a4, r4, s4) => Object.assign(Object.assign(Object.assign({ client_id: e4.clientId }, e4.authorizationParams), i4), { scope: j(t4, i4.scope), response_type: "code", response_mode: s4 || "query", state: o4, nonce: n4, redirect_uri: r4 || e4.authorizationParams.redirect_uri, code_challenge: a4, code_challenge_method: "S256" }))(this.options, this.scope, e3, o3, n3, r3, e3.redirect_uri || this.options.authorizationParams.redirect_uri || i3, null == t3 ? void 0 : t3.response_mode), c3 = this._authorizeUrl(s3);
      return { nonce: n3, code_verifier: a3, scope: s3.scope, audience: s3.audience || "default", redirect_uri: s3.redirect_uri, state: o3, url: c3 };
    }
    async loginWithPopup(e3, t3) {
      var i3;
      if (e3 = e3 || {}, !(t3 = t3 || {}).popup && (t3.popup = ((e4) => {
        const t4 = window.screenX + (window.innerWidth - 400) / 2, i4 = window.screenY + (window.innerHeight - 600) / 2;
        return window.open(e4, "auth0:authorize:popup", `left=${t4},top=${i4},width=400,height=600,resizable,scrollbars=yes,status=1`);
      })(""), !t3.popup)) throw new Error("Unable to open a popup for loginWithPopup - window.open returned `null`");
      const o3 = await this._prepareAuthorizeUrl(e3.authorizationParams || {}, { response_mode: "web_message" }, window.location.origin);
      t3.popup.location.href = o3.url;
      const n3 = await ((e4) => new Promise((t4, i4) => {
        let o4;
        const n4 = setInterval(() => {
          e4.popup && e4.popup.closed && (clearInterval(n4), clearTimeout(a4), window.removeEventListener("message", o4, false), i4(new p(e4.popup)));
        }, 1e3), a4 = setTimeout(() => {
          clearInterval(n4), i4(new h(e4.popup)), window.removeEventListener("message", o4, false);
        }, 1e3 * (e4.timeoutInSeconds || 60));
        o4 = function(r3) {
          if (r3.data && "authorization_response" === r3.data.type) {
            if (clearTimeout(a4), clearInterval(n4), window.removeEventListener("message", o4, false), e4.popup.close(), r3.data.response.error) return i4(d.fromPayload(r3.data.response));
            t4(r3.data.response);
          }
        }, window.addEventListener("message", o4);
      }))(Object.assign(Object.assign({}, t3), { timeoutInSeconds: t3.timeoutInSeconds || this.options.authorizeTimeoutInSeconds || 60 }));
      if (o3.state !== n3.state) throw new d("state_mismatch", "Invalid state");
      const a3 = (null === (i3 = e3.authorizationParams) || void 0 === i3 ? void 0 : i3.organization) || this.options.authorizationParams.organization;
      await this._requestToken({ audience: o3.audience, scope: o3.scope, code_verifier: o3.code_verifier, grant_type: "authorization_code", code: n3.code, redirect_uri: o3.redirect_uri }, { nonceIn: o3.nonce, organization: a3 });
    }
    async getUser() {
      var e3;
      const t3 = await this._getIdTokenFromCache();
      return null === (e3 = null == t3 ? void 0 : t3.decodedToken) || void 0 === e3 ? void 0 : e3.user;
    }
    async getIdTokenClaims() {
      var e3;
      const t3 = await this._getIdTokenFromCache();
      return null === (e3 = null == t3 ? void 0 : t3.decodedToken) || void 0 === e3 ? void 0 : e3.claims;
    }
    async loginWithRedirect(t3 = {}) {
      var i3;
      const o3 = Q(t3), { openUrl: n3, fragment: a3, appState: r3 } = o3, s3 = e(o3, ["openUrl", "fragment", "appState"]), c3 = (null === (i3 = s3.authorizationParams) || void 0 === i3 ? void 0 : i3.organization) || this.options.authorizationParams.organization, d3 = await this._prepareAuthorizeUrl(s3.authorizationParams || {}), { url: u3 } = d3, l3 = e(d3, ["url"]);
      this.transactionManager.create(Object.assign(Object.assign(Object.assign({}, l3), { appState: r3 }), c3 && { organization: c3 }));
      const h3 = a3 ? `${u3}#${a3}` : u3;
      n3 ? await n3(h3) : window.location.assign(h3);
    }
    async handleRedirectCallback(e3 = window.location.href) {
      const t3 = e3.split("?").slice(1);
      if (0 === t3.length) throw new Error("There are no query params available for parsing.");
      const { state: i3, code: o3, error: n3, error_description: a3 } = ((e4) => {
        e4.indexOf("#") > -1 && (e4 = e4.substring(0, e4.indexOf("#")));
        const t4 = new URLSearchParams(e4);
        return { state: t4.get("state"), code: t4.get("code") || void 0, error: t4.get("error") || void 0, error_description: t4.get("error_description") || void 0 };
      })(t3.join("")), r3 = this.transactionManager.get();
      if (!r3) throw new d("missing_transaction", "Invalid state");
      if (this.transactionManager.remove(), n3) throw new u(n3, a3 || n3, i3, r3.appState);
      if (!r3.code_verifier || r3.state && r3.state !== i3) throw new d("state_mismatch", "Invalid state");
      const s3 = r3.organization, c3 = r3.nonce, l3 = r3.redirect_uri;
      return await this._requestToken(Object.assign({ audience: r3.audience, scope: r3.scope, code_verifier: r3.code_verifier, grant_type: "authorization_code", code: o3 }, l3 ? { redirect_uri: l3 } : {}), { nonceIn: c3, organization: s3 }), { appState: r3.appState };
    }
    async checkSession(e3) {
      if (!this.cookieStorage.get(this.isAuthenticatedCookieName)) {
        if (!this.cookieStorage.get("auth0.is.authenticated")) return;
        this.cookieStorage.save(this.isAuthenticatedCookieName, true, { daysUntilExpire: this.sessionCheckExpiryDays, cookieDomain: this.options.cookieDomain }), this.cookieStorage.remove("auth0.is.authenticated");
      }
      try {
        await this.getTokenSilently(e3);
      } catch (e4) {
      }
    }
    async getTokenSilently(e3 = {}) {
      var t3;
      const i3 = Object.assign(Object.assign({ cacheMode: "on" }, e3), { authorizationParams: Object.assign(Object.assign(Object.assign({}, this.options.authorizationParams), e3.authorizationParams), { scope: j(this.scope, null === (t3 = e3.authorizationParams) || void 0 === t3 ? void 0 : t3.scope) }) }), o3 = await ((e4, t4) => {
        let i4 = A[t4];
        return i4 || (i4 = e4().finally(() => {
          delete A[t4], i4 = null;
        }), A[t4] = i4), i4;
      })(() => this._getTokenSilently(i3), `${this.options.clientId}::${i3.authorizationParams.audience}::${i3.authorizationParams.scope}`);
      return e3.detailedResponse ? o3 : null == o3 ? void 0 : o3.access_token;
    }
    async _getTokenSilently(t3) {
      const { cacheMode: i3 } = t3, o3 = e(t3, ["cacheMode"]);
      if ("off" !== i3) {
        const e3 = await this._getEntryFromCache({ scope: o3.authorizationParams.scope, audience: o3.authorizationParams.audience || "default", clientId: this.options.clientId });
        if (e3) return e3;
      }
      if ("cache-only" !== i3) {
        if (!await (async (e3, t4 = 3) => {
          for (let i4 = 0; i4 < t4; i4++) if (await e3()) return true;
          return false;
        })(() => ee.acquireLock("auth0.lock.getTokenSilently", 5e3), 10)) throw new l();
        try {
          if (window.addEventListener("pagehide", this._releaseLockOnPageHide), "off" !== i3) {
            const e4 = await this._getEntryFromCache({ scope: o3.authorizationParams.scope, audience: o3.authorizationParams.audience || "default", clientId: this.options.clientId });
            if (e4) return e4;
          }
          const e3 = this.options.useRefreshTokens ? await this._getTokenUsingRefreshToken(o3) : await this._getTokenFromIFrame(o3), { id_token: t4, access_token: n3, oauthTokenScope: a3, expires_in: r3 } = e3;
          return Object.assign(Object.assign({ id_token: t4, access_token: n3 }, a3 ? { scope: a3 } : null), { expires_in: r3 });
        } finally {
          await ee.releaseLock("auth0.lock.getTokenSilently"), window.removeEventListener("pagehide", this._releaseLockOnPageHide);
        }
      }
    }
    async getTokenWithPopup(e3 = {}, t3 = {}) {
      var i3;
      const o3 = Object.assign(Object.assign({}, e3), { authorizationParams: Object.assign(Object.assign(Object.assign({}, this.options.authorizationParams), e3.authorizationParams), { scope: j(this.scope, null === (i3 = e3.authorizationParams) || void 0 === i3 ? void 0 : i3.scope) }) });
      t3 = Object.assign(Object.assign({}, r), t3), await this.loginWithPopup(o3, t3);
      return (await this.cacheManager.get(new C({ scope: o3.authorizationParams.scope, audience: o3.authorizationParams.audience || "default", clientId: this.options.clientId }))).access_token;
    }
    async isAuthenticated() {
      return !!await this.getUser();
    }
    _buildLogoutUrl(t3) {
      null !== t3.clientId ? t3.clientId = t3.clientId || this.options.clientId : delete t3.clientId;
      const i3 = t3.logoutParams || {}, { federated: o3 } = i3, n3 = e(i3, ["federated"]), a3 = o3 ? "&federated" : "";
      return this._url(`/v2/logout?${v(Object.assign({ clientId: t3.clientId }, n3))}`) + a3;
    }
    async logout(t3 = {}) {
      const i3 = Q(t3), { openUrl: o3 } = i3, n3 = e(i3, ["openUrl"]);
      null === t3.clientId ? await this.cacheManager.clear() : await this.cacheManager.clear(t3.clientId || this.options.clientId), this.cookieStorage.remove(this.orgHintCookieName, { cookieDomain: this.options.cookieDomain }), this.cookieStorage.remove(this.isAuthenticatedCookieName, { cookieDomain: this.options.cookieDomain }), this.userCache.remove("@@user@@");
      const a3 = this._buildLogoutUrl(n3);
      o3 ? await o3(a3) : false !== o3 && window.location.assign(a3);
    }
    async _getTokenFromIFrame(e3) {
      const t3 = Object.assign(Object.assign({}, e3.authorizationParams), { prompt: "none" }), i3 = this.cookieStorage.get(this.orgHintCookieName);
      i3 && !t3.organization && (t3.organization = i3);
      const { url: o3, state: n3, nonce: a3, code_verifier: r3, redirect_uri: s3, scope: c3, audience: u3 } = await this._prepareAuthorizeUrl(t3, { response_mode: "web_message" }, window.location.origin);
      try {
        if (window.crossOriginIsolated) throw new d("login_required", "The application is running in a Cross-Origin Isolated context, silently retrieving a token without refresh token is not possible.");
        const i4 = e3.timeoutInSeconds || this.options.authorizeTimeoutInSeconds, h3 = await ((e4, t4, i5 = 60) => new Promise((o4, n4) => {
          const a4 = window.document.createElement("iframe");
          a4.setAttribute("width", "0"), a4.setAttribute("height", "0"), a4.style.display = "none";
          const r4 = () => {
            window.document.body.contains(a4) && (window.document.body.removeChild(a4), window.removeEventListener("message", s4, false));
          };
          let s4;
          const c4 = setTimeout(() => {
            n4(new l()), r4();
          }, 1e3 * i5);
          s4 = function(e5) {
            if (e5.origin != t4) return;
            if (!e5.data || "authorization_response" !== e5.data.type) return;
            const i6 = e5.source;
            i6 && i6.close(), e5.data.response.error ? n4(d.fromPayload(e5.data.response)) : o4(e5.data.response), clearTimeout(c4), window.removeEventListener("message", s4, false), setTimeout(r4, 2e3);
          }, window.addEventListener("message", s4, false), window.document.body.appendChild(a4), a4.setAttribute("src", e4);
        }))(o3, this.domainUrl, i4);
        if (n3 !== h3.state) throw new d("state_mismatch", "Invalid state");
        const p3 = await this._requestToken(Object.assign(Object.assign({}, e3.authorizationParams), { code_verifier: r3, code: h3.code, grant_type: "authorization_code", redirect_uri: s3, timeout: e3.authorizationParams.timeout || this.httpTimeoutMs }), { nonceIn: a3, organization: t3.organization });
        return Object.assign(Object.assign({}, p3), { scope: c3, oauthTokenScope: p3.scope, audience: u3 });
      } catch (e4) {
        throw "login_required" === e4.error && this.logout({ openUrl: false }), e4;
      }
    }
    async _getTokenUsingRefreshToken(e3) {
      const t3 = await this.cacheManager.get(new C({ scope: e3.authorizationParams.scope, audience: e3.authorizationParams.audience || "default", clientId: this.options.clientId }));
      if (!(t3 && t3.refresh_token || this.worker)) {
        if (this.options.useRefreshTokensFallback) return await this._getTokenFromIFrame(e3);
        throw new f(e3.authorizationParams.audience || "default", e3.authorizationParams.scope);
      }
      const i3 = e3.authorizationParams.redirect_uri || this.options.authorizationParams.redirect_uri || window.location.origin, o3 = "number" == typeof e3.timeoutInSeconds ? 1e3 * e3.timeoutInSeconds : null;
      try {
        const n3 = await this._requestToken(Object.assign(Object.assign(Object.assign({}, e3.authorizationParams), { grant_type: "refresh_token", refresh_token: t3 && t3.refresh_token, redirect_uri: i3 }), o3 && { timeout: o3 }));
        return Object.assign(Object.assign({}, n3), { scope: e3.authorizationParams.scope, oauthTokenScope: n3.scope, audience: e3.authorizationParams.audience || "default" });
      } catch (t4) {
        if ((t4.message.indexOf("Missing Refresh Token") > -1 || t4.message && t4.message.indexOf("invalid refresh token") > -1) && this.options.useRefreshTokensFallback) return await this._getTokenFromIFrame(e3);
        throw t4;
      }
    }
    async _saveEntryInCache(t3) {
      const { id_token: i3, decodedToken: o3 } = t3, n3 = e(t3, ["id_token", "decodedToken"]);
      this.userCache.set("@@user@@", { id_token: i3, decodedToken: o3 }), await this.cacheManager.setIdToken(this.options.clientId, t3.id_token, t3.decodedToken), await this.cacheManager.set(n3);
    }
    async _getIdTokenFromCache() {
      const e3 = this.options.authorizationParams.audience || "default", t3 = await this.cacheManager.getIdToken(new C({ clientId: this.options.clientId, audience: e3, scope: this.scope })), i3 = this.userCache.get("@@user@@");
      return t3 && t3.id_token === (null == i3 ? void 0 : i3.id_token) ? i3 : (this.userCache.set("@@user@@", t3), t3);
    }
    async _getEntryFromCache({ scope: e3, audience: t3, clientId: i3 }) {
      const o3 = await this.cacheManager.get(new C({ scope: e3, audience: t3, clientId: i3 }), 60);
      if (o3 && o3.access_token) {
        const { access_token: e4, oauthTokenScope: t4, expires_in: i4 } = o3, n3 = await this._getIdTokenFromCache();
        return n3 && Object.assign(Object.assign({ id_token: n3.id_token, access_token: e4 }, t4 ? { scope: t4 } : null), { expires_in: i4 });
      }
    }
    async _requestToken(e3, t3) {
      const { nonceIn: i3, organization: o3 } = t3 || {}, n3 = await T(Object.assign({ baseUrl: this.domainUrl, client_id: this.options.clientId, auth0Client: this.options.auth0Client, useFormData: this.options.useFormData, timeout: this.httpTimeoutMs }, e3), this.worker), a3 = await this._verifyIdToken(n3.id_token, i3, o3);
      return await this._saveEntryInCache(Object.assign(Object.assign(Object.assign(Object.assign({}, n3), { decodedToken: a3, scope: e3.scope, audience: e3.audience || "default" }), n3.scope ? { oauthTokenScope: n3.scope } : null), { client_id: this.options.clientId })), this.cookieStorage.save(this.isAuthenticatedCookieName, true, { daysUntilExpire: this.sessionCheckExpiryDays, cookieDomain: this.options.cookieDomain }), this._processOrgHint(o3 || a3.claims.org_id), Object.assign(Object.assign({}, n3), { decodedToken: a3 });
    }
  };

  // src/env.ts
  var logger3 = createLogger("ENV");
  var HOST = window.location.host;
  var IS_PRODUCTION = HOST == "www.seedtoscale.com";
  var PROTECTED_PAGES = ["/onboarding", "/profile", "/dashboard", "/profile"];
  var PROTECTED_CONTENT_PAGES = ["/blog", "/podcast", "/video"];
  var ENV_KEYS = {
    production: {
      AUTH0DOMAIN: "seedtoscale.au.auth0.com",
      AUTHO_CLIENT_ID: "iiLfr784Qf911CWf7HhYrDRfIuVGvn6f"
    },
    development: {
      AUTH0DOMAIN: "seedtoscale-dev.us.auth0.com",
      AUTHO_CLIENT_ID: "vQxonvUHjMSnug4MLvdiJnHuAvJtcV7V"
    }
  };
  function isProtectedRoute(currentRoute, protectedRoutes) {
    return protectedRoutes.some((protectedRoute) => {
      const isProtectedRoute2 = currentRoute.startsWith(protectedRoute);
      return isProtectedRoute2;
    });
  }
  function getKey(keyName) {
    const env = IS_PRODUCTION ? "production" : "development";
    const value = ENV_KEYS[env][keyName];
    logger3.log("[+] USING KEY", keyName, value);
    return value;
  }
  var ENV = {
    DOMAIN: HOST,
    AUTHO_DOMAIN: getKey("AUTH0DOMAIN"),
    AUTHO_CLIENT_ID: getKey("AUTHO_CLIENT_ID"),
    isProduction: IS_PRODUCTION,
    isLocalHost: HOST.includes("localhost")
  };
  logger3.log("[+] ENVIRONMENT", ENV.isProduction ? "Production" : "Development");
  var RELATIVE_ROUTES = {
    HOME: "/",
    LOGIN: "/",
    POST_LOGIN: "/setup",
    ONBOARDING: "/onboarding",
    DASHBOARD: "/dashboard",
    PROFILE: "/profile"
  };
  var ROUTES = {};
  Object.keys(RELATIVE_ROUTES).forEach((ROUTE_NAME) => {
    const PROTOCOL = ENV.DOMAIN.includes("localhost") ? "http://" : "https://";
    ROUTES[ROUTE_NAME] = `${PROTOCOL}${ENV.DOMAIN}${RELATIVE_ROUTES[ROUTE_NAME]}`;
  });
  var AUTH0_API_ROUTES = {
    USER: `https://${ENV.AUTHO_DOMAIN}/api/v2/users`
  };
  var isUserOrProtectedRoute = () => {
    const currentRoute = window.location.pathname;
    return isProtectedRoute(currentRoute, PROTECTED_PAGES);
  };
  var isProtectedContentRoute = () => {
    const currentRoute = window.location.pathname;
    return isProtectedRoute(currentRoute, PROTECTED_CONTENT_PAGES);
  };

  // src/auth/auth0client.ts
  var createAuth0Client = () => {
    const AuthO_Options = {
      domain: ENV.AUTHO_DOMAIN,
      clientId: ENV.AUTHO_CLIENT_ID,
      cacheLocation: "localstorage",
      authorizationParams: {
        audience: `https://${ENV.AUTHO_DOMAIN}/api/v2/`,
        redirect_uri: ROUTES.POST_LOGIN,
        scope: "openid profile email update:current_user_metadata read:current_user"
      }
    };
    return new te(AuthO_Options);
  };
  var LocalAuth0Client = createAuth0Client();

  // node_modules/.pnpm/posthog-js@1.207.8/node_modules/posthog-js/dist/module.js
  var e2;
  var t2 = "undefined" != typeof window ? window : void 0;
  var i2 = "undefined" != typeof globalThis ? globalThis : t2;
  var r2 = Array.prototype;
  var s2 = r2.forEach;
  var n2 = r2.indexOf;
  var o2 = null == i2 ? void 0 : i2.navigator;
  var a2 = null == i2 ? void 0 : i2.document;
  var l2 = null == i2 ? void 0 : i2.location;
  var u2 = null == i2 ? void 0 : i2.fetch;
  var c2 = null != i2 && i2.XMLHttpRequest && "withCredentials" in new i2.XMLHttpRequest() ? i2.XMLHttpRequest : void 0;
  var d2 = null == i2 ? void 0 : i2.AbortController;
  var h2 = null == o2 ? void 0 : o2.userAgent;
  var _2 = null != t2 ? t2 : {};
  var p2 = { DEBUG: false, LIB_VERSION: "1.207.8" };
  var v2 = "$copy_autocapture";
  var g2 = ["$snapshot", "$pageview", "$pageleave", "$set", "survey dismissed", "survey sent", "survey shown", "$identify", "$groupidentify", "$create_alias", "$$client_ingestion_warning", "$web_experiment_applied", "$feature_enrollment_update", "$feature_flag_called"];
  !function(e3) {
    e3.GZipJS = "gzip-js", e3.Base64 = "base64";
  }(e2 || (e2 = {}));
  function m2(e3, t3) {
    return -1 !== e3.indexOf(t3);
  }
  var b2 = function(e3) {
    return e3.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
  };
  var y2 = function(e3) {
    return e3.replace(/^\$/, "");
  };
  var w2 = Array.isArray;
  var S2 = Object.prototype;
  var E2 = S2.hasOwnProperty;
  var k2 = S2.toString;
  var x2 = w2 || function(e3) {
    return "[object Array]" === k2.call(e3);
  };
  var I2 = (e3) => "function" == typeof e3;
  var C2 = (e3) => e3 === Object(e3) && !x2(e3);
  var P2 = (e3) => {
    if (C2(e3)) {
      for (var t3 in e3) if (E2.call(e3, t3)) return false;
      return true;
    }
    return false;
  };
  var R2 = (e3) => void 0 === e3;
  var F2 = (e3) => "[object String]" == k2.call(e3);
  var T2 = (e3) => F2(e3) && 0 === e3.trim().length;
  var $2 = (e3) => null === e3;
  var M2 = (e3) => R2(e3) || $2(e3);
  var O2 = (e3) => "[object Number]" == k2.call(e3);
  var L2 = (e3) => "[object Boolean]" === k2.call(e3);
  var A2 = (e3) => e3 instanceof FormData;
  var D2 = (e3) => m2(g2, e3);
  var N2 = (e3) => {
    var i3 = { _log: function(i4) {
      if (t2 && (p2.DEBUG || _2.POSTHOG_DEBUG) && !R2(t2.console) && t2.console) {
        for (var r3 = ("__rrweb_original__" in t2.console[i4]) ? t2.console[i4].__rrweb_original__ : t2.console[i4], s3 = arguments.length, n3 = new Array(s3 > 1 ? s3 - 1 : 0), o3 = 1; o3 < s3; o3++) n3[o3 - 1] = arguments[o3];
        r3(e3, ...n3);
      }
    }, info: function() {
      for (var e4 = arguments.length, t3 = new Array(e4), r3 = 0; r3 < e4; r3++) t3[r3] = arguments[r3];
      i3._log("log", ...t3);
    }, warn: function() {
      for (var e4 = arguments.length, t3 = new Array(e4), r3 = 0; r3 < e4; r3++) t3[r3] = arguments[r3];
      i3._log("warn", ...t3);
    }, error: function() {
      for (var e4 = arguments.length, t3 = new Array(e4), r3 = 0; r3 < e4; r3++) t3[r3] = arguments[r3];
      i3._log("error", ...t3);
    }, critical: function() {
      for (var t3 = arguments.length, i4 = new Array(t3), r3 = 0; r3 < t3; r3++) i4[r3] = arguments[r3];
      console.error(e3, ...i4);
    }, uninitializedWarning: (e4) => {
      i3.error("You must initialize PostHog before calling ".concat(e4));
    }, createLogger: (t3) => N2("".concat(e3, " ").concat(t3)) };
    return i3;
  };
  var q2 = N2("[PostHog.js]");
  var B2 = q2.createLogger;
  var H2 = B2("[ExternalScriptsLoader]");
  var U2 = (e3, t3, i3) => {
    if (e3.config.disable_external_dependency_loading) return H2.warn("".concat(t3, " was requested but loading of external scripts is disabled.")), i3("Loading of external scripts is disabled");
    var r3 = () => {
      if (!a2) return i3("document not found");
      var r4 = a2.createElement("script");
      if (r4.type = "text/javascript", r4.crossOrigin = "anonymous", r4.src = t3, r4.onload = (e4) => i3(void 0, e4), r4.onerror = (e4) => i3(e4), e3.config.prepare_external_dependency_script && (r4 = e3.config.prepare_external_dependency_script(r4)), !r4) return i3("prepare_external_dependency_script returned null");
      var s3, n3 = a2.querySelectorAll("body > script");
      n3.length > 0 ? null === (s3 = n3[0].parentNode) || void 0 === s3 || s3.insertBefore(r4, n3[0]) : a2.body.appendChild(r4);
    };
    null != a2 && a2.body ? r3() : null == a2 || a2.addEventListener("DOMContentLoaded", r3);
  };
  function z2(e3, t3) {
    var i3 = Object.keys(e3);
    if (Object.getOwnPropertySymbols) {
      var r3 = Object.getOwnPropertySymbols(e3);
      t3 && (r3 = r3.filter(function(t4) {
        return Object.getOwnPropertyDescriptor(e3, t4).enumerable;
      })), i3.push.apply(i3, r3);
    }
    return i3;
  }
  function j2(e3) {
    for (var t3 = 1; t3 < arguments.length; t3++) {
      var i3 = null != arguments[t3] ? arguments[t3] : {};
      t3 % 2 ? z2(Object(i3), true).forEach(function(t4) {
        W2(e3, t4, i3[t4]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e3, Object.getOwnPropertyDescriptors(i3)) : z2(Object(i3)).forEach(function(t4) {
        Object.defineProperty(e3, t4, Object.getOwnPropertyDescriptor(i3, t4));
      });
    }
    return e3;
  }
  function W2(e3, t3, i3) {
    return t3 in e3 ? Object.defineProperty(e3, t3, { value: i3, enumerable: true, configurable: true, writable: true }) : e3[t3] = i3, e3;
  }
  function V2(e3, t3) {
    if (null == e3) return {};
    var i3, r3, s3 = function(e4, t4) {
      if (null == e4) return {};
      var i4, r4, s4 = {}, n4 = Object.keys(e4);
      for (r4 = 0; r4 < n4.length; r4++) i4 = n4[r4], t4.indexOf(i4) >= 0 || (s4[i4] = e4[i4]);
      return s4;
    }(e3, t3);
    if (Object.getOwnPropertySymbols) {
      var n3 = Object.getOwnPropertySymbols(e3);
      for (r3 = 0; r3 < n3.length; r3++) i3 = n3[r3], t3.indexOf(i3) >= 0 || Object.prototype.propertyIsEnumerable.call(e3, i3) && (s3[i3] = e3[i3]);
    }
    return s3;
  }
  _2.__PosthogExtensions__ = _2.__PosthogExtensions__ || {}, _2.__PosthogExtensions__.loadExternalDependency = (e3, t3, i3) => {
    var r3 = "/static/".concat(t3, ".js") + "?v=".concat(e3.version);
    if ("remote-config" === t3 && (r3 = "/array/".concat(e3.config.token, "/config.js")), "toolbar" === t3) {
      var s3 = 3e5, n3 = Math.floor(Date.now() / s3) * s3;
      r3 = "".concat(r3, "&t=").concat(n3);
    }
    var o3 = e3.requestRouter.endpointFor("assets", r3);
    U2(e3, o3, i3);
  }, _2.__PosthogExtensions__.loadSiteApp = (e3, t3, i3) => {
    var r3 = e3.requestRouter.endpointFor("api", t3);
    U2(e3, r3, i3);
  };
  var G2 = {};
  function J2(e3, t3, i3) {
    if (x2(e3)) {
      if (s2 && e3.forEach === s2) e3.forEach(t3, i3);
      else if ("length" in e3 && e3.length === +e3.length) {
        for (var r3 = 0, n3 = e3.length; r3 < n3; r3++) if (r3 in e3 && t3.call(i3, e3[r3], r3) === G2) return;
      }
    }
  }
  function Y2(e3, t3, i3) {
    if (!M2(e3)) {
      if (x2(e3)) return J2(e3, t3, i3);
      if (A2(e3)) {
        for (var r3 of e3.entries()) if (t3.call(i3, r3[1], r3[0]) === G2) return;
      } else for (var s3 in e3) if (E2.call(e3, s3) && t3.call(i3, e3[s3], s3) === G2) return;
    }
  }
  var K2 = function(e3) {
    for (var t3 = arguments.length, i3 = new Array(t3 > 1 ? t3 - 1 : 0), r3 = 1; r3 < t3; r3++) i3[r3 - 1] = arguments[r3];
    return J2(i3, function(t4) {
      for (var i4 in t4) void 0 !== t4[i4] && (e3[i4] = t4[i4]);
    }), e3;
  };
  var X2 = function(e3) {
    for (var t3 = arguments.length, i3 = new Array(t3 > 1 ? t3 - 1 : 0), r3 = 1; r3 < t3; r3++) i3[r3 - 1] = arguments[r3];
    return J2(i3, function(t4) {
      J2(t4, function(t5) {
        e3.push(t5);
      });
    }), e3;
  };
  function Q2(e3) {
    for (var t3 = Object.keys(e3), i3 = t3.length, r3 = new Array(i3); i3--; ) r3[i3] = [t3[i3], e3[t3[i3]]];
    return r3;
  }
  var Z2 = function(e3) {
    try {
      return e3();
    } catch (e4) {
      return;
    }
  };
  var ee2 = function(e3) {
    return function() {
      try {
        for (var t3 = arguments.length, i3 = new Array(t3), r3 = 0; r3 < t3; r3++) i3[r3] = arguments[r3];
        return e3.apply(this, i3);
      } catch (e4) {
        q2.critical("Implementation error. Please turn on debug mode and open a ticket on https://app.posthog.com/home#panel=support%3Asupport%3A."), q2.critical(e4);
      }
    };
  };
  var te2 = function(e3) {
    var t3 = {};
    return Y2(e3, function(e4, i3) {
      F2(e4) && e4.length > 0 && (t3[i3] = e4);
    }), t3;
  };
  function ie(e3, t3) {
    return i3 = e3, r3 = (e4) => F2(e4) && !$2(t3) ? e4.slice(0, t3) : e4, s3 = /* @__PURE__ */ new Set(), function e4(t4, i4) {
      return t4 !== Object(t4) ? r3 ? r3(t4, i4) : t4 : s3.has(t4) ? void 0 : (s3.add(t4), x2(t4) ? (n3 = [], J2(t4, (t5) => {
        n3.push(e4(t5));
      })) : (n3 = {}, Y2(t4, (t5, i5) => {
        s3.has(t5) || (n3[i5] = e4(t5, i5));
      })), n3);
      var n3;
    }(i3);
    var i3, r3, s3;
  }
  var re = function() {
    function e3(t3) {
      return t3 && (t3.preventDefault = e3.preventDefault, t3.stopPropagation = e3.stopPropagation), t3;
    }
    return e3.preventDefault = function() {
      this.returnValue = false;
    }, e3.stopPropagation = function() {
      this.cancelBubble = true;
    }, function(i3, r3, s3, n3, o3) {
      if (i3) if (i3.addEventListener && !n3) i3.addEventListener(r3, s3, !!o3);
      else {
        var a3 = "on" + r3, l3 = i3[a3];
        i3[a3] = /* @__PURE__ */ function(i4, r4, s4) {
          return function(n4) {
            if (n4 = n4 || e3(null == t2 ? void 0 : t2.event)) {
              var o4, a4 = true;
              I2(s4) && (o4 = s4(n4));
              var l4 = r4.call(i4, n4);
              return false !== o4 && false !== l4 || (a4 = false), a4;
            }
          };
        }(i3, s3, l3);
      }
      else q2.error("No valid element provided to register_event");
    };
  }();
  function se(e3, t3) {
    for (var i3 = 0; i3 < e3.length; i3++) if (t3(e3[i3])) return e3[i3];
  }
  var ne = "$people_distinct_id";
  var oe = "__alias";
  var ae = "__timers";
  var le = "$autocapture_disabled_server_side";
  var ue = "$heatmaps_enabled_server_side";
  var ce = "$exception_capture_enabled_server_side";
  var de = "$web_vitals_enabled_server_side";
  var he = "$dead_clicks_enabled_server_side";
  var _e = "$web_vitals_allowed_metrics";
  var pe = "$session_recording_enabled_server_side";
  var ve = "$console_log_recording_enabled_server_side";
  var ge = "$session_recording_network_payload_capture";
  var fe = "$session_recording_canvas_recording";
  var me = "$replay_sample_rate";
  var be = "$replay_minimum_duration";
  var ye = "$replay_script_config";
  var we = "$sesid";
  var Se = "$session_is_sampled";
  var Ee = "$session_recording_url_trigger_activated_session";
  var ke = "$session_recording_event_trigger_activated_session";
  var xe = "$enabled_feature_flags";
  var Ie = "$early_access_features";
  var Ce = "$stored_person_properties";
  var Pe = "$stored_group_properties";
  var Re = "$surveys";
  var Fe = "$surveys_activated";
  var Te = "$flag_call_reported";
  var $e = "$user_state";
  var Me = "$client_session_props";
  var Oe = "$capture_rate_limit";
  var Le = "$initial_campaign_params";
  var Ae = "$initial_referrer_info";
  var De = "$initial_person_info";
  var Ne = "$epp";
  var qe = "__POSTHOG_TOOLBAR__";
  var Be = "$posthog_cookieless";
  var He = [ne, oe, "__cmpns", ae, pe, ue, we, xe, $e, Ie, Pe, Ce, Re, Te, Me, Oe, Le, Ae, Ne];
  var Ue = B2("[FeatureFlags]");
  var ze = "$active_feature_flags";
  var je = "$override_feature_flags";
  var We = "$feature_flag_payloads";
  var Ve = (e3) => {
    var t3 = {};
    for (var [i3, r3] of Q2(e3 || {})) r3 && (t3[i3] = r3);
    return t3;
  };
  var Ge = class {
    constructor(e3) {
      W2(this, "_override_warning", false), W2(this, "_hasLoadedFlags", false), W2(this, "_requestInFlight", false), W2(this, "_reloadingDisabled", false), W2(this, "_additionalReloadRequested", false), W2(this, "_decideCalled", false), W2(this, "_flagsLoadedFromRemote", false), this.instance = e3, this.featureFlagEventHandlers = [];
    }
    decide() {
      if (this.instance.config.__preview_remote_config) this._decideCalled = true;
      else {
        var e3 = !this._reloadDebouncer && (this.instance.config.advanced_disable_feature_flags || this.instance.config.advanced_disable_feature_flags_on_first_load);
        this._callDecideEndpoint({ disableFlags: e3 });
      }
    }
    get hasLoadedFlags() {
      return this._hasLoadedFlags;
    }
    getFlags() {
      return Object.keys(this.getFlagVariants());
    }
    getFlagVariants() {
      var e3 = this.instance.get_property(xe), t3 = this.instance.get_property(je);
      if (!t3) return e3 || {};
      for (var i3 = K2({}, e3), r3 = Object.keys(t3), s3 = 0; s3 < r3.length; s3++) i3[r3[s3]] = t3[r3[s3]];
      return this._override_warning || (Ue.warn(" Overriding feature flags!", { enabledFlags: e3, overriddenFlags: t3, finalFlags: i3 }), this._override_warning = true), i3;
    }
    getFlagPayloads() {
      return this.instance.get_property(We) || {};
    }
    reloadFeatureFlags() {
      this._reloadingDisabled || this.instance.config.advanced_disable_feature_flags || this._reloadDebouncer || (this._reloadDebouncer = setTimeout(() => {
        this._callDecideEndpoint();
      }, 5));
    }
    clearDebouncer() {
      clearTimeout(this._reloadDebouncer), this._reloadDebouncer = void 0;
    }
    ensureFlagsLoaded() {
      this._hasLoadedFlags || this._requestInFlight || this._reloadDebouncer || this.reloadFeatureFlags();
    }
    setAnonymousDistinctId(e3) {
      this.$anon_distinct_id = e3;
    }
    setReloadingPaused(e3) {
      this._reloadingDisabled = e3;
    }
    _callDecideEndpoint(t3) {
      if (this.clearDebouncer(), !this.instance.config.advanced_disable_decide) if (this._requestInFlight) this._additionalReloadRequested = true;
      else {
        var i3 = { token: this.instance.config.token, distinct_id: this.instance.get_distinct_id(), groups: this.instance.getGroups(), $anon_distinct_id: this.$anon_distinct_id, person_properties: this.instance.get_property(Ce), group_properties: this.instance.get_property(Pe) };
        (null != t3 && t3.disableFlags || this.instance.config.advanced_disable_feature_flags) && (i3.disable_flags = true), this._requestInFlight = true, this.instance._send_request({ method: "POST", url: this.instance.requestRouter.endpointFor("api", "/decide/?v=3"), data: i3, compression: this.instance.config.disable_compression ? void 0 : e2.Base64, timeout: this.instance.config.feature_flag_request_timeout_ms, callback: (e3) => {
          var t4, r3, s3 = true;
          (200 === e3.statusCode && (this.$anon_distinct_id = void 0, s3 = false), this._requestInFlight = false, this._decideCalled) || (this._decideCalled = true, this.instance._onRemoteConfig(null !== (r3 = e3.json) && void 0 !== r3 ? r3 : {}));
          i3.disable_flags || (this._flagsLoadedFromRemote = !s3, this.receivedFeatureFlags(null !== (t4 = e3.json) && void 0 !== t4 ? t4 : {}, s3), this._additionalReloadRequested && (this._additionalReloadRequested = false, this._callDecideEndpoint()));
        } });
      }
    }
    getFeatureFlag(e3) {
      var t3 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
      if (this._hasLoadedFlags || this.getFlags() && this.getFlags().length > 0) {
        var i3, r3, s3, n3, o3, a3 = this.getFlagVariants()[e3], l3 = "".concat(a3), u3 = this.instance.get_property(Te) || {};
        if (t3.send_event || !("send_event" in t3)) {
          if (!(e3 in u3) || !u3[e3].includes(l3)) x2(u3[e3]) ? u3[e3].push(l3) : u3[e3] = [l3], null === (i3 = this.instance.persistence) || void 0 === i3 || i3.register({ [Te]: u3 }), this.instance.capture("$feature_flag_called", { $feature_flag: e3, $feature_flag_response: a3, $feature_flag_payload: this.getFeatureFlagPayload(e3) || null, $feature_flag_bootstrapped_response: (null === (r3 = this.instance.config.bootstrap) || void 0 === r3 || null === (s3 = r3.featureFlags) || void 0 === s3 ? void 0 : s3[e3]) || null, $feature_flag_bootstrapped_payload: (null === (n3 = this.instance.config.bootstrap) || void 0 === n3 || null === (o3 = n3.featureFlagPayloads) || void 0 === o3 ? void 0 : o3[e3]) || null, $used_bootstrap_value: !this._flagsLoadedFromRemote });
        }
        return a3;
      }
      Ue.warn('getFeatureFlag for key "' + e3 + `" failed. Feature flags didn't load in time.`);
    }
    getFeatureFlagPayload(e3) {
      return this.getFlagPayloads()[e3];
    }
    isFeatureEnabled(e3) {
      var t3 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
      if (this._hasLoadedFlags || this.getFlags() && this.getFlags().length > 0) return !!this.getFeatureFlag(e3, t3);
      Ue.warn('isFeatureEnabled for key "' + e3 + `" failed. Feature flags didn't load in time.`);
    }
    addFeatureFlagsHandler(e3) {
      this.featureFlagEventHandlers.push(e3);
    }
    removeFeatureFlagsHandler(e3) {
      this.featureFlagEventHandlers = this.featureFlagEventHandlers.filter((t3) => t3 !== e3);
    }
    receivedFeatureFlags(e3, t3) {
      if (this.instance.persistence) {
        this._hasLoadedFlags = true;
        var i3 = this.getFlagVariants(), r3 = this.getFlagPayloads();
        !function(e4, t4) {
          var i4 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}, r4 = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {}, s3 = e4.featureFlags, n3 = e4.featureFlagPayloads;
          if (s3) if (x2(s3)) {
            var o3 = {};
            if (s3) for (var a3 = 0; a3 < s3.length; a3++) o3[s3[a3]] = true;
            t4 && t4.register({ [ze]: s3, [xe]: o3 });
          } else {
            var l3 = s3, u3 = n3;
            e4.errorsWhileComputingFlags && (l3 = j2(j2({}, i4), l3), u3 = j2(j2({}, r4), u3)), t4 && t4.register({ [ze]: Object.keys(Ve(l3)), [xe]: l3 || {}, [We]: u3 || {} });
          }
        }(e3, this.instance.persistence, i3, r3), this._fireFeatureFlagsCallbacks(t3);
      }
    }
    override(e3) {
      var t3 = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
      if (!this.instance.__loaded || !this.instance.persistence) return Ue.uninitializedWarning("posthog.feature_flags.override");
      if (this._override_warning = t3, false === e3) this.instance.persistence.unregister(je);
      else if (x2(e3)) {
        for (var i3 = {}, r3 = 0; r3 < e3.length; r3++) i3[e3[r3]] = true;
        this.instance.persistence.register({ [je]: i3 });
      } else this.instance.persistence.register({ [je]: e3 });
    }
    onFeatureFlags(e3) {
      if (this.addFeatureFlagsHandler(e3), this._hasLoadedFlags) {
        var { flags: t3, flagVariants: i3 } = this._prepareFeatureFlagsForCallbacks();
        e3(t3, i3);
      }
      return () => this.removeFeatureFlagsHandler(e3);
    }
    updateEarlyAccessFeatureEnrollment(e3, t3) {
      var i3, r3 = (this.instance.get_property(Ie) || []).find((t4) => t4.flagKey === e3), s3 = { ["$feature_enrollment/".concat(e3)]: t3 }, n3 = { $feature_flag: e3, $feature_enrollment: t3, $set: s3 };
      r3 && (n3.$early_access_feature_name = r3.name), this.instance.capture("$feature_enrollment_update", n3), this.setPersonPropertiesForFlags(s3, false);
      var o3 = j2(j2({}, this.getFlagVariants()), {}, { [e3]: t3 });
      null === (i3 = this.instance.persistence) || void 0 === i3 || i3.register({ [ze]: Object.keys(Ve(o3)), [xe]: o3 }), this._fireFeatureFlagsCallbacks();
    }
    getEarlyAccessFeatures(e3) {
      var t3 = arguments.length > 1 && void 0 !== arguments[1] && arguments[1], i3 = this.instance.get_property(Ie);
      if (i3 && !t3) return e3(i3);
      this.instance._send_request({ url: this.instance.requestRouter.endpointFor("api", "/api/early_access_features/?token=".concat(this.instance.config.token)), method: "GET", callback: (t4) => {
        var i4;
        if (t4.json) {
          var r3 = t4.json.earlyAccessFeatures;
          return null === (i4 = this.instance.persistence) || void 0 === i4 || i4.register({ [Ie]: r3 }), e3(r3);
        }
      } });
    }
    _prepareFeatureFlagsForCallbacks() {
      var e3 = this.getFlags(), t3 = this.getFlagVariants();
      return { flags: e3.filter((e4) => t3[e4]), flagVariants: Object.keys(t3).filter((e4) => t3[e4]).reduce((e4, i3) => (e4[i3] = t3[i3], e4), {}) };
    }
    _fireFeatureFlagsCallbacks(e3) {
      var { flags: t3, flagVariants: i3 } = this._prepareFeatureFlagsForCallbacks();
      this.featureFlagEventHandlers.forEach((r3) => r3(t3, i3, { errorsLoading: e3 }));
    }
    setPersonPropertiesForFlags(e3) {
      var t3 = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1], i3 = this.instance.get_property(Ce) || {};
      this.instance.register({ [Ce]: j2(j2({}, i3), e3) }), t3 && this.instance.reloadFeatureFlags();
    }
    resetPersonPropertiesForFlags() {
      this.instance.unregister(Ce);
    }
    setGroupPropertiesForFlags(e3) {
      var t3 = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1], i3 = this.instance.get_property(Pe) || {};
      0 !== Object.keys(i3).length && Object.keys(i3).forEach((t4) => {
        i3[t4] = j2(j2({}, i3[t4]), e3[t4]), delete e3[t4];
      }), this.instance.register({ [Pe]: j2(j2({}, i3), e3) }), t3 && this.instance.reloadFeatureFlags();
    }
    resetGroupPropertiesForFlags(e3) {
      if (e3) {
        var t3 = this.instance.get_property(Pe) || {};
        this.instance.register({ [Pe]: j2(j2({}, t3), {}, { [e3]: {} }) });
      } else this.instance.unregister(Pe);
    }
  };
  Math.trunc || (Math.trunc = function(e3) {
    return e3 < 0 ? Math.ceil(e3) : Math.floor(e3);
  }), Number.isInteger || (Number.isInteger = function(e3) {
    return O2(e3) && isFinite(e3) && Math.floor(e3) === e3;
  });
  var Je = "0123456789abcdef";
  var Ye = class _Ye {
    constructor(e3) {
      if (this.bytes = e3, 16 !== e3.length) throw new TypeError("not 128-bit length");
    }
    static fromFieldsV7(e3, t3, i3, r3) {
      if (!Number.isInteger(e3) || !Number.isInteger(t3) || !Number.isInteger(i3) || !Number.isInteger(r3) || e3 < 0 || t3 < 0 || i3 < 0 || r3 < 0 || e3 > 281474976710655 || t3 > 4095 || i3 > 1073741823 || r3 > 4294967295) throw new RangeError("invalid field value");
      var s3 = new Uint8Array(16);
      return s3[0] = e3 / Math.pow(2, 40), s3[1] = e3 / Math.pow(2, 32), s3[2] = e3 / Math.pow(2, 24), s3[3] = e3 / Math.pow(2, 16), s3[4] = e3 / Math.pow(2, 8), s3[5] = e3, s3[6] = 112 | t3 >>> 8, s3[7] = t3, s3[8] = 128 | i3 >>> 24, s3[9] = i3 >>> 16, s3[10] = i3 >>> 8, s3[11] = i3, s3[12] = r3 >>> 24, s3[13] = r3 >>> 16, s3[14] = r3 >>> 8, s3[15] = r3, new _Ye(s3);
    }
    toString() {
      for (var e3 = "", t3 = 0; t3 < this.bytes.length; t3++) e3 = e3 + Je.charAt(this.bytes[t3] >>> 4) + Je.charAt(15 & this.bytes[t3]), 3 !== t3 && 5 !== t3 && 7 !== t3 && 9 !== t3 || (e3 += "-");
      if (36 !== e3.length) throw new Error("Invalid UUIDv7 was generated");
      return e3;
    }
    clone() {
      return new _Ye(this.bytes.slice(0));
    }
    equals(e3) {
      return 0 === this.compareTo(e3);
    }
    compareTo(e3) {
      for (var t3 = 0; t3 < 16; t3++) {
        var i3 = this.bytes[t3] - e3.bytes[t3];
        if (0 !== i3) return Math.sign(i3);
      }
      return 0;
    }
  };
  var Ke = class {
    constructor() {
      W2(this, "timestamp", 0), W2(this, "counter", 0), W2(this, "random", new Ze());
    }
    generate() {
      var e3 = this.generateOrAbort();
      if (R2(e3)) {
        this.timestamp = 0;
        var t3 = this.generateOrAbort();
        if (R2(t3)) throw new Error("Could not generate UUID after timestamp reset");
        return t3;
      }
      return e3;
    }
    generateOrAbort() {
      var e3 = Date.now();
      if (e3 > this.timestamp) this.timestamp = e3, this.resetCounter();
      else {
        if (!(e3 + 1e4 > this.timestamp)) return;
        this.counter++, this.counter > 4398046511103 && (this.timestamp++, this.resetCounter());
      }
      return Ye.fromFieldsV7(this.timestamp, Math.trunc(this.counter / Math.pow(2, 30)), this.counter & Math.pow(2, 30) - 1, this.random.nextUint32());
    }
    resetCounter() {
      this.counter = 1024 * this.random.nextUint32() + (1023 & this.random.nextUint32());
    }
  };
  var Xe;
  var Qe = (e3) => {
    if ("undefined" != typeof UUIDV7_DENY_WEAK_RNG && UUIDV7_DENY_WEAK_RNG) throw new Error("no cryptographically strong RNG available");
    for (var t3 = 0; t3 < e3.length; t3++) e3[t3] = 65536 * Math.trunc(65536 * Math.random()) + Math.trunc(65536 * Math.random());
    return e3;
  };
  t2 && !R2(t2.crypto) && crypto.getRandomValues && (Qe = (e3) => crypto.getRandomValues(e3));
  var Ze = class {
    constructor() {
      W2(this, "buffer", new Uint32Array(8)), W2(this, "cursor", 1 / 0);
    }
    nextUint32() {
      return this.cursor >= this.buffer.length && (Qe(this.buffer), this.cursor = 0), this.buffer[this.cursor++];
    }
  };
  var et = () => tt().toString();
  var tt = () => (Xe || (Xe = new Ke())).generate();
  var it = "Thu, 01 Jan 1970 00:00:00 GMT";
  var rt = "";
  var st = /[a-z0-9][a-z0-9-]+\.[a-z]{2,}$/i;
  function nt(e3, t3) {
    if (t3) {
      var i3 = function(e4) {
        var t4 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : a2;
        if (rt) return rt;
        if (!t4) return "";
        if (["localhost", "127.0.0.1"].includes(e4)) return "";
        for (var i4 = e4.split("."), r4 = Math.min(i4.length, 8), s3 = "dmn_chk_" + et(), n3 = new RegExp("(^|;)\\s*" + s3 + "=1"); !rt && r4--; ) {
          var o3 = i4.slice(r4).join("."), l3 = s3 + "=1;domain=." + o3;
          t4.cookie = l3, n3.test(t4.cookie) && (t4.cookie = l3 + ";expires=" + it, rt = o3);
        }
        return rt;
      }(e3);
      if (!i3) {
        var r3 = ((e4) => {
          var t4 = e4.match(st);
          return t4 ? t4[0] : "";
        })(e3);
        r3 !== i3 && q2.info("Warning: cookie subdomain discovery mismatch", r3, i3), i3 = r3;
      }
      return i3 ? "; domain=." + i3 : "";
    }
    return "";
  }
  var ot = { is_supported: () => !!a2, error: function(e3) {
    q2.error("cookieStore error: " + e3);
  }, get: function(e3) {
    if (a2) {
      try {
        for (var t3 = e3 + "=", i3 = a2.cookie.split(";").filter((e4) => e4.length), r3 = 0; r3 < i3.length; r3++) {
          for (var s3 = i3[r3]; " " == s3.charAt(0); ) s3 = s3.substring(1, s3.length);
          if (0 === s3.indexOf(t3)) return decodeURIComponent(s3.substring(t3.length, s3.length));
        }
      } catch (e4) {
      }
      return null;
    }
  }, parse: function(e3) {
    var t3;
    try {
      t3 = JSON.parse(ot.get(e3)) || {};
    } catch (e4) {
    }
    return t3;
  }, set: function(e3, t3, i3, r3, s3) {
    if (a2) try {
      var n3 = "", o3 = "", l3 = nt(a2.location.hostname, r3);
      if (i3) {
        var u3 = /* @__PURE__ */ new Date();
        u3.setTime(u3.getTime() + 24 * i3 * 60 * 60 * 1e3), n3 = "; expires=" + u3.toUTCString();
      }
      s3 && (o3 = "; secure");
      var c3 = e3 + "=" + encodeURIComponent(JSON.stringify(t3)) + n3 + "; SameSite=Lax; path=/" + l3 + o3;
      return c3.length > 3686.4 && q2.warn("cookieStore warning: large cookie, len=" + c3.length), a2.cookie = c3, c3;
    } catch (e4) {
      return;
    }
  }, remove: function(e3, t3) {
    try {
      ot.set(e3, "", -1, t3);
    } catch (e4) {
      return;
    }
  } };
  var at = null;
  var lt = { is_supported: function() {
    if (!$2(at)) return at;
    var e3 = true;
    if (R2(t2)) e3 = false;
    else try {
      var i3 = "__mplssupport__";
      lt.set(i3, "xyz"), '"xyz"' !== lt.get(i3) && (e3 = false), lt.remove(i3);
    } catch (t3) {
      e3 = false;
    }
    return e3 || q2.error("localStorage unsupported; falling back to cookie store"), at = e3, e3;
  }, error: function(e3) {
    q2.error("localStorage error: " + e3);
  }, get: function(e3) {
    try {
      return null == t2 ? void 0 : t2.localStorage.getItem(e3);
    } catch (e4) {
      lt.error(e4);
    }
    return null;
  }, parse: function(e3) {
    try {
      return JSON.parse(lt.get(e3)) || {};
    } catch (e4) {
    }
    return null;
  }, set: function(e3, i3) {
    try {
      null == t2 || t2.localStorage.setItem(e3, JSON.stringify(i3));
    } catch (e4) {
      lt.error(e4);
    }
  }, remove: function(e3) {
    try {
      null == t2 || t2.localStorage.removeItem(e3);
    } catch (e4) {
      lt.error(e4);
    }
  } };
  var ut = ["distinct_id", we, Se, Ne, De];
  var ct = j2(j2({}, lt), {}, { parse: function(e3) {
    try {
      var t3 = {};
      try {
        t3 = ot.parse(e3) || {};
      } catch (e4) {
      }
      var i3 = K2(t3, JSON.parse(lt.get(e3) || "{}"));
      return lt.set(e3, i3), i3;
    } catch (e4) {
    }
    return null;
  }, set: function(e3, t3, i3, r3, s3, n3) {
    try {
      lt.set(e3, t3, void 0, void 0, n3);
      var o3 = {};
      ut.forEach((e4) => {
        t3[e4] && (o3[e4] = t3[e4]);
      }), Object.keys(o3).length && ot.set(e3, o3, i3, r3, s3, n3);
    } catch (e4) {
      lt.error(e4);
    }
  }, remove: function(e3, i3) {
    try {
      null == t2 || t2.localStorage.removeItem(e3), ot.remove(e3, i3);
    } catch (e4) {
      lt.error(e4);
    }
  } });
  var dt = {};
  var ht = { is_supported: function() {
    return true;
  }, error: function(e3) {
    q2.error("memoryStorage error: " + e3);
  }, get: function(e3) {
    return dt[e3] || null;
  }, parse: function(e3) {
    return dt[e3] || null;
  }, set: function(e3, t3) {
    dt[e3] = t3;
  }, remove: function(e3) {
    delete dt[e3];
  } };
  var _t = null;
  var pt = { is_supported: function() {
    if (!$2(_t)) return _t;
    if (_t = true, R2(t2)) _t = false;
    else try {
      var e3 = "__support__";
      pt.set(e3, "xyz"), '"xyz"' !== pt.get(e3) && (_t = false), pt.remove(e3);
    } catch (e4) {
      _t = false;
    }
    return _t;
  }, error: function(e3) {
    q2.error("sessionStorage error: ", e3);
  }, get: function(e3) {
    try {
      return null == t2 ? void 0 : t2.sessionStorage.getItem(e3);
    } catch (e4) {
      pt.error(e4);
    }
    return null;
  }, parse: function(e3) {
    try {
      return JSON.parse(pt.get(e3)) || null;
    } catch (e4) {
    }
    return null;
  }, set: function(e3, i3) {
    try {
      null == t2 || t2.sessionStorage.setItem(e3, JSON.stringify(i3));
    } catch (e4) {
      pt.error(e4);
    }
  }, remove: function(e3) {
    try {
      null == t2 || t2.sessionStorage.removeItem(e3);
    } catch (e4) {
      pt.error(e4);
    }
  } };
  var vt = ["localhost", "127.0.0.1"];
  var gt = (e3) => {
    var t3 = null == a2 ? void 0 : a2.createElement("a");
    return R2(t3) ? null : (t3.href = e3, t3);
  };
  var ft = function(e3, t3) {
    return !!function(e4) {
      try {
        new RegExp(e4);
      } catch (e5) {
        return false;
      }
      return true;
    }(t3) && new RegExp(t3).test(e3);
  };
  var mt = function(e3) {
    var t3, i3, r3 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "&", s3 = [];
    return Y2(e3, function(e4, r4) {
      R2(e4) || R2(r4) || "undefined" === r4 || (t3 = encodeURIComponent(((e5) => e5 instanceof File)(e4) ? e4.name : e4.toString()), i3 = encodeURIComponent(r4), s3[s3.length] = i3 + "=" + t3);
    }), s3.join(r3);
  };
  var bt = function(e3, t3) {
    for (var i3, r3 = ((e3.split("#")[0] || "").split("?")[1] || "").split("&"), s3 = 0; s3 < r3.length; s3++) {
      var n3 = r3[s3].split("=");
      if (n3[0] === t3) {
        i3 = n3;
        break;
      }
    }
    if (!x2(i3) || i3.length < 2) return "";
    var o3 = i3[1];
    try {
      o3 = decodeURIComponent(o3);
    } catch (e4) {
      q2.error("Skipping decoding for malformed query param: " + o3);
    }
    return o3.replace(/\+/g, " ");
  };
  var yt = function(e3, t3, i3) {
    if (!e3 || !t3 || !t3.length) return e3;
    for (var r3 = e3.split("#"), s3 = r3[0] || "", n3 = r3[1], o3 = s3.split("?"), a3 = o3[1], l3 = o3[0], u3 = (a3 || "").split("&"), c3 = [], d3 = 0; d3 < u3.length; d3++) {
      var h3 = u3[d3].split("=");
      x2(h3) && (t3.includes(h3[0]) ? c3.push(h3[0] + "=" + i3) : c3.push(u3[d3]));
    }
    var _3 = l3;
    return null != a3 && (_3 += "?" + c3.join("&")), null != n3 && (_3 += "#" + n3), _3;
  };
  var wt = function(e3, t3) {
    var i3 = e3.match(new RegExp(t3 + "=([^&]*)"));
    return i3 ? i3[1] : null;
  };
  var St = "Mobile";
  var Et = "iOS";
  var kt = "Android";
  var xt = "Tablet";
  var It = kt + " " + xt;
  var Ct = "iPad";
  var Pt = "Apple";
  var Rt = Pt + " Watch";
  var Ft = "Safari";
  var Tt = "BlackBerry";
  var $t = "Samsung";
  var Mt = $t + "Browser";
  var Ot = $t + " Internet";
  var Lt = "Chrome";
  var At = Lt + " OS";
  var Dt = Lt + " " + Et;
  var Nt = "Internet Explorer";
  var qt = Nt + " " + St;
  var Bt = "Opera";
  var Ht = Bt + " Mini";
  var Ut = "Edge";
  var zt = "Microsoft " + Ut;
  var jt = "Firefox";
  var Wt = jt + " " + Et;
  var Vt = "Nintendo";
  var Gt = "PlayStation";
  var Jt = "Xbox";
  var Yt = kt + " " + St;
  var Kt = St + " " + Ft;
  var Xt = "Windows";
  var Qt = Xt + " Phone";
  var Zt = "Nokia";
  var ei = "Ouya";
  var ti = "Generic";
  var ii = ti + " " + St.toLowerCase();
  var ri = ti + " " + xt.toLowerCase();
  var si = "Konqueror";
  var ni = "(\\d+(\\.\\d+)?)";
  var oi = new RegExp("Version/" + ni);
  var ai = new RegExp(Jt, "i");
  var li = new RegExp(Gt + " \\w+", "i");
  var ui = new RegExp(Vt + " \\w+", "i");
  var ci = new RegExp(Tt + "|PlayBook|BB10", "i");
  var di = { "NT3.51": "NT 3.11", "NT4.0": "NT 4.0", "5.0": "2000", 5.1: "XP", 5.2: "XP", "6.0": "Vista", 6.1: "7", 6.2: "8", 6.3: "8.1", 6.4: "10", "10.0": "10" };
  var hi = (e3, t3) => t3 && m2(t3, Pt) || function(e4) {
    return m2(e4, Ft) && !m2(e4, Lt) && !m2(e4, kt);
  }(e3);
  var _i = function(e3, t3) {
    return t3 = t3 || "", m2(e3, " OPR/") && m2(e3, "Mini") ? Ht : m2(e3, " OPR/") ? Bt : ci.test(e3) ? Tt : m2(e3, "IE" + St) || m2(e3, "WPDesktop") ? qt : m2(e3, Mt) ? Ot : m2(e3, Ut) || m2(e3, "Edg/") ? zt : m2(e3, "FBIOS") ? "Facebook " + St : m2(e3, "UCWEB") || m2(e3, "UCBrowser") ? "UC Browser" : m2(e3, "CriOS") ? Dt : m2(e3, "CrMo") || m2(e3, Lt) ? Lt : m2(e3, kt) && m2(e3, Ft) ? Yt : m2(e3, "FxiOS") ? Wt : m2(e3.toLowerCase(), si.toLowerCase()) ? si : hi(e3, t3) ? m2(e3, St) ? Kt : Ft : m2(e3, jt) ? jt : m2(e3, "MSIE") || m2(e3, "Trident/") ? Nt : m2(e3, "Gecko") ? jt : "";
  };
  var pi = { [qt]: [new RegExp("rv:" + ni)], [zt]: [new RegExp(Ut + "?\\/" + ni)], [Lt]: [new RegExp("(" + Lt + "|CrMo)\\/" + ni)], [Dt]: [new RegExp("CriOS\\/" + ni)], "UC Browser": [new RegExp("(UCBrowser|UCWEB)\\/" + ni)], [Ft]: [oi], [Kt]: [oi], [Bt]: [new RegExp("(Opera|OPR)\\/" + ni)], [jt]: [new RegExp(jt + "\\/" + ni)], [Wt]: [new RegExp("FxiOS\\/" + ni)], [si]: [new RegExp("Konqueror[:/]?" + ni, "i")], [Tt]: [new RegExp(Tt + " " + ni), oi], [Yt]: [new RegExp("android\\s" + ni, "i")], [Ot]: [new RegExp(Mt + "\\/" + ni)], [Nt]: [new RegExp("(rv:|MSIE )" + ni)], Mozilla: [new RegExp("rv:" + ni)] };
  var vi = [[new RegExp(Jt + "; " + Jt + " (.*?)[);]", "i"), (e3) => [Jt, e3 && e3[1] || ""]], [new RegExp(Vt, "i"), [Vt, ""]], [new RegExp(Gt, "i"), [Gt, ""]], [ci, [Tt, ""]], [new RegExp(Xt, "i"), (e3, t3) => {
    if (/Phone/.test(t3) || /WPDesktop/.test(t3)) return [Qt, ""];
    if (new RegExp(St).test(t3) && !/IEMobile\b/.test(t3)) return [Xt + " " + St, ""];
    var i3 = /Windows NT ([0-9.]+)/i.exec(t3);
    if (i3 && i3[1]) {
      var r3 = i3[1], s3 = di[r3] || "";
      return /arm/i.test(t3) && (s3 = "RT"), [Xt, s3];
    }
    return [Xt, ""];
  }], [/((iPhone|iPad|iPod).*?OS (\d+)_(\d+)_?(\d+)?|iPhone)/, (e3) => {
    if (e3 && e3[3]) {
      var t3 = [e3[3], e3[4], e3[5] || "0"];
      return [Et, t3.join(".")];
    }
    return [Et, ""];
  }], [/(watch.*\/(\d+\.\d+\.\d+)|watch os,(\d+\.\d+),)/i, (e3) => {
    var t3 = "";
    return e3 && e3.length >= 3 && (t3 = R2(e3[2]) ? e3[3] : e3[2]), ["watchOS", t3];
  }], [new RegExp("(" + kt + " (\\d+)\\.(\\d+)\\.?(\\d+)?|" + kt + ")", "i"), (e3) => {
    if (e3 && e3[2]) {
      var t3 = [e3[2], e3[3], e3[4] || "0"];
      return [kt, t3.join(".")];
    }
    return [kt, ""];
  }], [/Mac OS X (\d+)[_.](\d+)[_.]?(\d+)?/i, (e3) => {
    var t3 = ["Mac OS X", ""];
    if (e3 && e3[1]) {
      var i3 = [e3[1], e3[2], e3[3] || "0"];
      t3[1] = i3.join(".");
    }
    return t3;
  }], [/Mac/i, ["Mac OS X", ""]], [/CrOS/, [At, ""]], [/Linux|debian/i, ["Linux", ""]]];
  var gi = function(e3) {
    return ui.test(e3) ? Vt : li.test(e3) ? Gt : ai.test(e3) ? Jt : new RegExp(ei, "i").test(e3) ? ei : new RegExp("(" + Qt + "|WPDesktop)", "i").test(e3) ? Qt : /iPad/.test(e3) ? Ct : /iPod/.test(e3) ? "iPod Touch" : /iPhone/.test(e3) ? "iPhone" : /(watch)(?: ?os[,/]|\d,\d\/)[\d.]+/i.test(e3) ? Rt : ci.test(e3) ? Tt : /(kobo)\s(ereader|touch)/i.test(e3) ? "Kobo" : new RegExp(Zt, "i").test(e3) ? Zt : /(kf[a-z]{2}wi|aeo[c-r]{2})( bui|\))/i.test(e3) || /(kf[a-z]+)( bui|\)).+silk\//i.test(e3) ? "Kindle Fire" : /(Android|ZTE)/i.test(e3) ? !new RegExp(St).test(e3) || /(9138B|TB782B|Nexus [97]|pixel c|HUAWEISHT|BTV|noble nook|smart ultra 6)/i.test(e3) ? /pixel[\daxl ]{1,6}/i.test(e3) && !/pixel c/i.test(e3) || /(huaweimed-al00|tah-|APA|SM-G92|i980|zte|U304AA)/i.test(e3) || /lmy47v/i.test(e3) && !/QTAQZ3/i.test(e3) ? kt : It : kt : new RegExp("(pda|" + St + ")", "i").test(e3) ? ii : new RegExp(xt, "i").test(e3) && !new RegExp(xt + " pc", "i").test(e3) ? ri : "";
  };
  var fi = "https?://(.*)";
  var mi = ["gclid", "gclsrc", "dclid", "gbraid", "wbraid", "fbclid", "msclkid", "twclid", "li_fat_id", "igshid", "ttclid", "rdt_cid", "irclid", "_kx"];
  var bi = X2(["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gad_source", "mc_cid"], mi);
  var yi = "<masked>";
  var wi = { campaignParams: function() {
    var { customTrackedParams: e3, maskPersonalDataProperties: t3, customPersonalDataProperties: i3 } = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
    if (!a2) return {};
    var r3 = t3 ? X2([], mi, i3 || []) : [];
    return this._campaignParamsFromUrl(yt(a2.URL, r3, yi), e3);
  }, _campaignParamsFromUrl: function(e3, t3) {
    var i3 = bi.concat(t3 || []), r3 = {};
    return Y2(i3, function(t4) {
      var i4 = bt(e3, t4);
      r3[t4] = i4 || null;
    }), r3;
  }, _searchEngine: function(e3) {
    return e3 ? 0 === e3.search(fi + "google.([^/?]*)") ? "google" : 0 === e3.search(fi + "bing.com") ? "bing" : 0 === e3.search(fi + "yahoo.com") ? "yahoo" : 0 === e3.search(fi + "duckduckgo.com") ? "duckduckgo" : null : null;
  }, _searchInfoFromReferrer: function(e3) {
    var t3 = wi._searchEngine(e3), i3 = "yahoo" != t3 ? "q" : "p", r3 = {};
    if (!$2(t3)) {
      r3.$search_engine = t3;
      var s3 = a2 ? bt(a2.referrer, i3) : "";
      s3.length && (r3.ph_keyword = s3);
    }
    return r3;
  }, searchInfo: function() {
    var e3 = null == a2 ? void 0 : a2.referrer;
    return e3 ? this._searchInfoFromReferrer(e3) : {};
  }, browser: _i, browserVersion: function(e3, t3) {
    var i3 = _i(e3, t3), r3 = pi[i3];
    if (R2(r3)) return null;
    for (var s3 = 0; s3 < r3.length; s3++) {
      var n3 = r3[s3], o3 = e3.match(n3);
      if (o3) return parseFloat(o3[o3.length - 2]);
    }
    return null;
  }, browserLanguage: function() {
    return navigator.language || navigator.userLanguage;
  }, browserLanguagePrefix: function() {
    var e3 = this.browserLanguage();
    return "string" == typeof e3 ? e3.split("-")[0] : void 0;
  }, os: function(e3) {
    for (var t3 = 0; t3 < vi.length; t3++) {
      var [i3, r3] = vi[t3], s3 = i3.exec(e3), n3 = s3 && (I2(r3) ? r3(s3, e3) : r3);
      if (n3) return n3;
    }
    return ["", ""];
  }, device: gi, deviceType: function(e3) {
    var t3 = gi(e3);
    return t3 === Ct || t3 === It || "Kobo" === t3 || "Kindle Fire" === t3 || t3 === ri ? xt : t3 === Vt || t3 === Jt || t3 === Gt || t3 === ei ? "Console" : t3 === Rt ? "Wearable" : t3 ? St : "Desktop";
  }, referrer: function() {
    return (null == a2 ? void 0 : a2.referrer) || "$direct";
  }, referringDomain: function() {
    var e3;
    return null != a2 && a2.referrer && (null === (e3 = gt(a2.referrer)) || void 0 === e3 ? void 0 : e3.host) || "$direct";
  }, referrerInfo: function() {
    return { $referrer: this.referrer(), $referring_domain: this.referringDomain() };
  }, initialPersonInfo: function() {
    return { r: this.referrer().substring(0, 1e3), u: null == l2 ? void 0 : l2.href.substring(0, 1e3) };
  }, initialPersonPropsFromInfo: function(e3) {
    var t3, { r: i3, u: r3 } = e3, s3 = { $initial_referrer: i3, $initial_referring_domain: null == i3 ? void 0 : "$direct" == i3 ? "$direct" : null === (t3 = gt(i3)) || void 0 === t3 ? void 0 : t3.host };
    if (r3) {
      s3.$initial_current_url = r3;
      var n3 = gt(r3);
      s3.$initial_host = null == n3 ? void 0 : n3.host, s3.$initial_pathname = null == n3 ? void 0 : n3.pathname, Y2(this._campaignParamsFromUrl(r3), function(e4, t4) {
        s3["$initial_" + y2(t4)] = e4;
      });
    }
    i3 && Y2(this._searchInfoFromReferrer(i3), function(e4, t4) {
      s3["$initial_" + y2(t4)] = e4;
    });
    return s3;
  }, timezone: function() {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (e3) {
      return;
    }
  }, timezoneOffset: function() {
    try {
      return (/* @__PURE__ */ new Date()).getTimezoneOffset();
    } catch (e3) {
      return;
    }
  }, properties: function() {
    var { maskPersonalDataProperties: e3, customPersonalDataProperties: i3 } = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
    if (!h2) return {};
    var r3 = e3 ? X2([], mi, i3 || []) : [], [s3, n3] = wi.os(h2);
    return K2(te2({ $os: s3, $os_version: n3, $browser: wi.browser(h2, navigator.vendor), $device: wi.device(h2), $device_type: wi.deviceType(h2), $timezone: wi.timezone(), $timezone_offset: wi.timezoneOffset() }), { $current_url: yt(null == l2 ? void 0 : l2.href, r3, yi), $host: null == l2 ? void 0 : l2.host, $pathname: null == l2 ? void 0 : l2.pathname, $raw_user_agent: h2.length > 1e3 ? h2.substring(0, 997) + "..." : h2, $browser_version: wi.browserVersion(h2, navigator.vendor), $browser_language: wi.browserLanguage(), $browser_language_prefix: wi.browserLanguagePrefix(), $screen_height: null == t2 ? void 0 : t2.screen.height, $screen_width: null == t2 ? void 0 : t2.screen.width, $viewport_height: null == t2 ? void 0 : t2.innerHeight, $viewport_width: null == t2 ? void 0 : t2.innerWidth, $lib: "web", $lib_version: p2.LIB_VERSION, $insert_id: Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10), $time: Date.now() / 1e3 });
  }, people_properties: function() {
    if (!h2) return {};
    var [e3, t3] = wi.os(h2);
    return K2(te2({ $os: e3, $os_version: t3, $browser: wi.browser(h2, navigator.vendor) }), { $browser_version: wi.browserVersion(h2, navigator.vendor) });
  } };
  var Si = ["cookie", "localstorage", "localstorage+cookie", "sessionstorage", "memory"];
  var Ei = class {
    constructor(e3) {
      this.config = e3, this.props = {}, this.campaign_params_saved = false, this.name = ((e4) => {
        var t3 = "";
        return e4.token && (t3 = e4.token.replace(/\+/g, "PL").replace(/\//g, "SL").replace(/=/g, "EQ")), e4.persistence_name ? "ph_" + e4.persistence_name : "ph_" + t3 + "_posthog";
      })(e3), this.storage = this.buildStorage(e3), this.load(), e3.debug && q2.info("Persistence loaded", e3.persistence, j2({}, this.props)), this.update_config(e3, e3), this.save();
    }
    buildStorage(e3) {
      -1 === Si.indexOf(e3.persistence.toLowerCase()) && (q2.critical("Unknown persistence type " + e3.persistence + "; falling back to localStorage+cookie"), e3.persistence = "localStorage+cookie");
      var t3 = e3.persistence.toLowerCase();
      return "localstorage" === t3 && lt.is_supported() ? lt : "localstorage+cookie" === t3 && ct.is_supported() ? ct : "sessionstorage" === t3 && pt.is_supported() ? pt : "memory" === t3 ? ht : "cookie" === t3 ? ot : ct.is_supported() ? ct : ot;
    }
    properties() {
      var e3 = {};
      return Y2(this.props, function(t3, i3) {
        if (i3 === xe && C2(t3)) for (var r3 = Object.keys(t3), s3 = 0; s3 < r3.length; s3++) e3["$feature/".concat(r3[s3])] = t3[r3[s3]];
        else a3 = i3, l3 = false, ($2(o3 = He) ? l3 : n2 && o3.indexOf === n2 ? -1 != o3.indexOf(a3) : (Y2(o3, function(e4) {
          if (l3 || (l3 = e4 === a3)) return G2;
        }), l3)) || (e3[i3] = t3);
        var o3, a3, l3;
      }), e3;
    }
    load() {
      if (!this.disabled) {
        var e3 = this.storage.parse(this.name);
        e3 && (this.props = K2({}, e3));
      }
    }
    save() {
      this.disabled || this.storage.set(this.name, this.props, this.expire_days, this.cross_subdomain, this.secure, this.config.debug);
    }
    remove() {
      this.storage.remove(this.name, false), this.storage.remove(this.name, true);
    }
    clear() {
      this.remove(), this.props = {};
    }
    register_once(e3, t3, i3) {
      if (C2(e3)) {
        R2(t3) && (t3 = "None"), this.expire_days = R2(i3) ? this.default_expiry : i3;
        var r3 = false;
        if (Y2(e3, (e4, i4) => {
          this.props.hasOwnProperty(i4) && this.props[i4] !== t3 || (this.props[i4] = e4, r3 = true);
        }), r3) return this.save(), true;
      }
      return false;
    }
    register(e3, t3) {
      if (C2(e3)) {
        this.expire_days = R2(t3) ? this.default_expiry : t3;
        var i3 = false;
        if (Y2(e3, (t4, r3) => {
          e3.hasOwnProperty(r3) && this.props[r3] !== t4 && (this.props[r3] = t4, i3 = true);
        }), i3) return this.save(), true;
      }
      return false;
    }
    unregister(e3) {
      e3 in this.props && (delete this.props[e3], this.save());
    }
    update_campaign_params() {
      if (!this.campaign_params_saved) {
        var e3 = wi.campaignParams({ customTrackedParams: this.config.custom_campaign_params, maskPersonalDataProperties: this.config.mask_personal_data_properties, customPersonalDataProperties: this.config.custom_personal_data_properties });
        P2(te2(e3)) || this.register(e3), this.campaign_params_saved = true;
      }
    }
    update_search_keyword() {
      this.register(wi.searchInfo());
    }
    update_referrer_info() {
      this.register_once(wi.referrerInfo(), void 0);
    }
    set_initial_person_info() {
      this.props[Le] || this.props[Ae] || this.register_once({ [De]: wi.initialPersonInfo() }, void 0);
    }
    get_referrer_info() {
      return te2({ $referrer: this.props.$referrer, $referring_domain: this.props.$referring_domain });
    }
    get_initial_props() {
      var e3 = {};
      Y2([Ae, Le], (t4) => {
        var i4 = this.props[t4];
        i4 && Y2(i4, function(t5, i5) {
          e3["$initial_" + y2(i5)] = t5;
        });
      });
      var t3 = this.props[De];
      if (t3) {
        var i3 = wi.initialPersonPropsFromInfo(t3);
        K2(e3, i3);
      }
      return e3;
    }
    safe_merge(e3) {
      return Y2(this.props, function(t3, i3) {
        i3 in e3 || (e3[i3] = t3);
      }), e3;
    }
    update_config(e3, t3) {
      if (this.default_expiry = this.expire_days = e3.cookie_expiration, this.set_disabled(e3.disable_persistence), this.set_cross_subdomain(e3.cross_subdomain_cookie), this.set_secure(e3.secure_cookie), e3.persistence !== t3.persistence) {
        var i3 = this.buildStorage(e3), r3 = this.props;
        this.clear(), this.storage = i3, this.props = r3, this.save();
      }
    }
    set_disabled(e3) {
      this.disabled = e3, this.disabled ? this.remove() : this.save();
    }
    set_cross_subdomain(e3) {
      e3 !== this.cross_subdomain && (this.cross_subdomain = e3, this.remove(), this.save());
    }
    get_cross_subdomain() {
      return !!this.cross_subdomain;
    }
    set_secure(e3) {
      e3 !== this.secure && (this.secure = e3, this.remove(), this.save());
    }
    set_event_timer(e3, t3) {
      var i3 = this.props[ae] || {};
      i3[e3] = t3, this.props[ae] = i3, this.save();
    }
    remove_event_timer(e3) {
      var t3 = (this.props[ae] || {})[e3];
      return R2(t3) || (delete this.props[ae][e3], this.save()), t3;
    }
    get_property(e3) {
      return this.props[e3];
    }
    set_property(e3, t3) {
      this.props[e3] = t3, this.save();
    }
  };
  function ki(e3) {
    var t3, i3;
    return (null === (t3 = JSON.stringify(e3, (i3 = [], function(e4, t4) {
      if (C2(t4)) {
        for (; i3.length > 0 && i3[i3.length - 1] !== this; ) i3.pop();
        return i3.includes(t4) ? "[Circular]" : (i3.push(t4), t4);
      }
      return t4;
    }))) || void 0 === t3 ? void 0 : t3.length) || 0;
  }
  function xi(e3) {
    var t3 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 66060288e-1;
    if (e3.size >= t3 && e3.data.length > 1) {
      var i3 = Math.floor(e3.data.length / 2), r3 = e3.data.slice(0, i3), s3 = e3.data.slice(i3);
      return [xi({ size: ki(r3), data: r3, sessionId: e3.sessionId, windowId: e3.windowId }), xi({ size: ki(s3), data: s3, sessionId: e3.sessionId, windowId: e3.windowId })].flatMap((e4) => e4);
    }
    return [e3];
  }
  var Ii = ((e3) => (e3[e3.DomContentLoaded = 0] = "DomContentLoaded", e3[e3.Load = 1] = "Load", e3[e3.FullSnapshot = 2] = "FullSnapshot", e3[e3.IncrementalSnapshot = 3] = "IncrementalSnapshot", e3[e3.Meta = 4] = "Meta", e3[e3.Custom = 5] = "Custom", e3[e3.Plugin = 6] = "Plugin", e3))(Ii || {});
  var Ci = ((e3) => (e3[e3.Mutation = 0] = "Mutation", e3[e3.MouseMove = 1] = "MouseMove", e3[e3.MouseInteraction = 2] = "MouseInteraction", e3[e3.Scroll = 3] = "Scroll", e3[e3.ViewportResize = 4] = "ViewportResize", e3[e3.Input = 5] = "Input", e3[e3.TouchMove = 6] = "TouchMove", e3[e3.MediaInteraction = 7] = "MediaInteraction", e3[e3.StyleSheetRule = 8] = "StyleSheetRule", e3[e3.CanvasMutation = 9] = "CanvasMutation", e3[e3.Font = 10] = "Font", e3[e3.Log = 11] = "Log", e3[e3.Drag = 12] = "Drag", e3[e3.StyleDeclaration = 13] = "StyleDeclaration", e3[e3.Selection = 14] = "Selection", e3[e3.AdoptedStyleSheet = 15] = "AdoptedStyleSheet", e3[e3.CustomElement = 16] = "CustomElement", e3))(Ci || {});
  function Pi(e3) {
    var t3;
    return e3 instanceof Element && (e3.id === qe || !(null === (t3 = e3.closest) || void 0 === t3 || !t3.call(e3, ".toolbar-global-fade-container")));
  }
  function Ri(e3) {
    return !!e3 && 1 === e3.nodeType;
  }
  function Fi(e3, t3) {
    return !!e3 && !!e3.tagName && e3.tagName.toLowerCase() === t3.toLowerCase();
  }
  function Ti(e3) {
    return !!e3 && 3 === e3.nodeType;
  }
  function $i(e3) {
    return !!e3 && 11 === e3.nodeType;
  }
  function Mi(e3) {
    return e3 ? b2(e3).split(/\s+/) : [];
  }
  function Oi(e3) {
    var i3 = null == t2 ? void 0 : t2.location.href;
    return !!(i3 && e3 && e3.some((e4) => i3.match(e4)));
  }
  function Li(e3) {
    var t3 = "";
    switch (typeof e3.className) {
      case "string":
        t3 = e3.className;
        break;
      case "object":
        t3 = (e3.className && "baseVal" in e3.className ? e3.className.baseVal : null) || e3.getAttribute("class") || "";
        break;
      default:
        t3 = "";
    }
    return Mi(t3);
  }
  function Ai(e3) {
    return M2(e3) ? null : b2(e3).split(/(\s+)/).filter((e4) => Ki(e4)).join("").replace(/[\r\n]/g, " ").replace(/[ ]+/g, " ").substring(0, 255);
  }
  function Di(e3) {
    var t3 = "";
    return Ui(e3) && !zi(e3) && e3.childNodes && e3.childNodes.length && Y2(e3.childNodes, function(e4) {
      var i3;
      Ti(e4) && e4.textContent && (t3 += null !== (i3 = Ai(e4.textContent)) && void 0 !== i3 ? i3 : "");
    }), b2(t3);
  }
  function Ni(e3) {
    return R2(e3.target) ? e3.srcElement || null : null !== (t3 = e3.target) && void 0 !== t3 && t3.shadowRoot ? e3.composedPath()[0] || null : e3.target || null;
    var t3;
  }
  var qi = ["a", "button", "form", "input", "select", "textarea", "label"];
  function Bi(e3) {
    var t3 = e3.parentNode;
    return !(!t3 || !Ri(t3)) && t3;
  }
  function Hi(e3, i3) {
    var r3 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : void 0, s3 = arguments.length > 3 ? arguments[3] : void 0, n3 = arguments.length > 4 ? arguments[4] : void 0;
    if (!t2 || !e3 || Fi(e3, "html") || !Ri(e3)) return false;
    if (null != r3 && r3.url_allowlist && !Oi(r3.url_allowlist)) return false;
    if (null != r3 && r3.url_ignorelist && Oi(r3.url_ignorelist)) return false;
    if (null != r3 && r3.dom_event_allowlist) {
      var o3 = r3.dom_event_allowlist;
      if (o3 && !o3.some((e4) => i3.type === e4)) return false;
    }
    for (var a3 = false, l3 = [e3], u3 = true, c3 = e3; c3.parentNode && !Fi(c3, "body"); ) if ($i(c3.parentNode)) l3.push(c3.parentNode.host), c3 = c3.parentNode.host;
    else {
      if (!(u3 = Bi(c3))) break;
      if (s3 || qi.indexOf(u3.tagName.toLowerCase()) > -1) a3 = true;
      else {
        var d3 = t2.getComputedStyle(u3);
        d3 && "pointer" === d3.getPropertyValue("cursor") && (a3 = true);
      }
      l3.push(u3), c3 = u3;
    }
    if (!function(e4, t3) {
      var i4 = null == t3 ? void 0 : t3.element_allowlist;
      if (R2(i4)) return true;
      var r4 = function(e5) {
        if (i4.some((t4) => e5.tagName.toLowerCase() === t4)) return { v: true };
      };
      for (var s4 of e4) {
        var n4 = r4(s4);
        if ("object" == typeof n4) return n4.v;
      }
      return false;
    }(l3, r3)) return false;
    if (!function(e4, t3) {
      var i4 = null == t3 ? void 0 : t3.css_selector_allowlist;
      if (R2(i4)) return true;
      var r4 = function(e5) {
        if (i4.some((t4) => e5.matches(t4))) return { v: true };
      };
      for (var s4 of e4) {
        var n4 = r4(s4);
        if ("object" == typeof n4) return n4.v;
      }
      return false;
    }(l3, r3)) return false;
    var h3 = t2.getComputedStyle(e3);
    if (h3 && "pointer" === h3.getPropertyValue("cursor") && "click" === i3.type) return true;
    var _3 = e3.tagName.toLowerCase();
    switch (_3) {
      case "html":
        return false;
      case "form":
        return (n3 || ["submit"]).indexOf(i3.type) >= 0;
      case "input":
      case "select":
      case "textarea":
        return (n3 || ["change", "click"]).indexOf(i3.type) >= 0;
      default:
        return a3 ? (n3 || ["click"]).indexOf(i3.type) >= 0 : (n3 || ["click"]).indexOf(i3.type) >= 0 && (qi.indexOf(_3) > -1 || "true" === e3.getAttribute("contenteditable"));
    }
  }
  function Ui(e3) {
    for (var t3 = e3; t3.parentNode && !Fi(t3, "body"); t3 = t3.parentNode) {
      var i3 = Li(t3);
      if (m2(i3, "ph-sensitive") || m2(i3, "ph-no-capture")) return false;
    }
    if (m2(Li(e3), "ph-include")) return true;
    var r3 = e3.type || "";
    if (F2(r3)) switch (r3.toLowerCase()) {
      case "hidden":
      case "password":
        return false;
    }
    var s3 = e3.name || e3.id || "";
    if (F2(s3)) {
      if (/^cc|cardnum|ccnum|creditcard|csc|cvc|cvv|exp|pass|pwd|routing|seccode|securitycode|securitynum|socialsec|socsec|ssn/i.test(s3.replace(/[^a-zA-Z0-9]/g, ""))) return false;
    }
    return true;
  }
  function zi(e3) {
    return !!(Fi(e3, "input") && !["button", "checkbox", "submit", "reset"].includes(e3.type) || Fi(e3, "select") || Fi(e3, "textarea") || "true" === e3.getAttribute("contenteditable"));
  }
  var ji = "(4[0-9]{12}(?:[0-9]{3})?)|(5[1-5][0-9]{14})|(6(?:011|5[0-9]{2})[0-9]{12})|(3[47][0-9]{13})|(3(?:0[0-5]|[68][0-9])[0-9]{11})|((?:2131|1800|35[0-9]{3})[0-9]{11})";
  var Wi = new RegExp("^(?:".concat(ji, ")$"));
  var Vi = new RegExp(ji);
  var Gi = "\\d{3}-?\\d{2}-?\\d{4}";
  var Ji = new RegExp("^(".concat(Gi, ")$"));
  var Yi = new RegExp("(".concat(Gi, ")"));
  function Ki(e3) {
    var t3 = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
    if (M2(e3)) return false;
    if (F2(e3)) {
      if (e3 = b2(e3), (t3 ? Wi : Vi).test((e3 || "").replace(/[- ]/g, ""))) return false;
      if ((t3 ? Ji : Yi).test(e3)) return false;
    }
    return true;
  }
  function Xi(e3) {
    var t3 = Di(e3);
    return Ki(t3 = "".concat(t3, " ").concat(Qi(e3)).trim()) ? t3 : "";
  }
  function Qi(e3) {
    var t3 = "";
    return e3 && e3.childNodes && e3.childNodes.length && Y2(e3.childNodes, function(e4) {
      var i3;
      if (e4 && "span" === (null === (i3 = e4.tagName) || void 0 === i3 ? void 0 : i3.toLowerCase())) try {
        var r3 = Di(e4);
        t3 = "".concat(t3, " ").concat(r3).trim(), e4.childNodes && e4.childNodes.length && (t3 = "".concat(t3, " ").concat(Qi(e4)).trim());
      } catch (e5) {
        q2.error("[AutoCapture]", e5);
      }
    }), t3;
  }
  function Zi(e3) {
    return function(e4) {
      var t3 = e4.map((e5) => {
        var t4, i3, r3 = "";
        if (e5.tag_name && (r3 += e5.tag_name), e5.attr_class) for (var s3 of (e5.attr_class.sort(), e5.attr_class)) r3 += ".".concat(s3.replace(/"/g, ""));
        var n3 = j2(j2(j2(j2({}, e5.text ? { text: e5.text } : {}), {}, { "nth-child": null !== (t4 = e5.nth_child) && void 0 !== t4 ? t4 : 0, "nth-of-type": null !== (i3 = e5.nth_of_type) && void 0 !== i3 ? i3 : 0 }, e5.href ? { href: e5.href } : {}), e5.attr_id ? { attr_id: e5.attr_id } : {}), e5.attributes), o3 = {};
        return Q2(n3).sort((e6, t5) => {
          var [i4] = e6, [r4] = t5;
          return i4.localeCompare(r4);
        }).forEach((e6) => {
          var [t5, i4] = e6;
          return o3[er(t5.toString())] = er(i4.toString());
        }), r3 += ":", r3 += Q2(n3).map((e6) => {
          var [t5, i4] = e6;
          return "".concat(t5, '="').concat(i4, '"');
        }).join("");
      });
      return t3.join(";");
    }(function(e4) {
      return e4.map((e5) => {
        var t3, i3, r3 = { text: null === (t3 = e5.$el_text) || void 0 === t3 ? void 0 : t3.slice(0, 400), tag_name: e5.tag_name, href: null === (i3 = e5.attr__href) || void 0 === i3 ? void 0 : i3.slice(0, 2048), attr_class: tr(e5), attr_id: e5.attr__id, nth_child: e5.nth_child, nth_of_type: e5.nth_of_type, attributes: {} };
        return Q2(e5).filter((e6) => {
          var [t4] = e6;
          return 0 === t4.indexOf("attr__");
        }).forEach((e6) => {
          var [t4, i4] = e6;
          return r3.attributes[t4] = i4;
        }), r3;
      });
    }(e3));
  }
  function er(e3) {
    return e3.replace(/"|\\"/g, '\\"');
  }
  function tr(e3) {
    var t3 = e3.attr__class;
    return t3 ? x2(t3) ? t3 : Mi(t3) : void 0;
  }
  var ir = "[SessionRecording]";
  var rr = "redacted";
  var sr = { initiatorTypes: ["audio", "beacon", "body", "css", "early-hint", "embed", "fetch", "frame", "iframe", "icon", "image", "img", "input", "link", "navigation", "object", "ping", "script", "track", "video", "xmlhttprequest"], maskRequestFn: (e3) => e3, recordHeaders: false, recordBody: false, recordInitialRequests: false, recordPerformance: false, performanceEntryTypeToObserve: ["first-input", "navigation", "paint", "resource"], payloadSizeLimitBytes: 1e6, payloadHostDenyList: [".lr-ingest.io", ".ingest.sentry.io", ".clarity.ms", "analytics.google.com"] };
  var nr = ["authorization", "x-forwarded-for", "authorization", "cookie", "set-cookie", "x-api-key", "x-real-ip", "remote-addr", "forwarded", "proxy-authorization", "x-csrf-token", "x-csrftoken", "x-xsrf-token"];
  var or = ["password", "secret", "passwd", "api_key", "apikey", "auth", "credentials", "mysql_pwd", "privatekey", "private_key", "token"];
  var ar = ["/s/", "/e/", "/i/"];
  function lr(e3, t3, i3, r3) {
    if (M2(e3)) return e3;
    var s3 = (null == t3 ? void 0 : t3["content-length"]) || function(e4) {
      return new Blob([e4]).size;
    }(e3);
    return F2(s3) && (s3 = parseInt(s3)), s3 > i3 ? ir + " ".concat(r3, " body too large to record (").concat(s3, " bytes)") : e3;
  }
  function ur(e3, t3) {
    if (M2(e3)) return e3;
    var i3 = e3;
    return Ki(i3, false) || (i3 = ir + " " + t3 + " body " + rr), Y2(or, (e4) => {
      var r3, s3;
      null !== (r3 = i3) && void 0 !== r3 && r3.length && -1 !== (null === (s3 = i3) || void 0 === s3 ? void 0 : s3.indexOf(e4)) && (i3 = ir + " " + t3 + " body " + rr + " as might contain: " + e4);
    }), i3;
  }
  var cr = (e3, t3) => {
    var i3, r3, s3, n3 = { payloadSizeLimitBytes: sr.payloadSizeLimitBytes, performanceEntryTypeToObserve: [...sr.performanceEntryTypeToObserve], payloadHostDenyList: [...t3.payloadHostDenyList || [], ...sr.payloadHostDenyList] }, o3 = false !== e3.session_recording.recordHeaders && t3.recordHeaders, a3 = false !== e3.session_recording.recordBody && t3.recordBody, l3 = false !== e3.capture_performance && t3.recordPerformance, u3 = (i3 = n3, s3 = Math.min(1e6, null !== (r3 = i3.payloadSizeLimitBytes) && void 0 !== r3 ? r3 : 1e6), (e4) => (null != e4 && e4.requestBody && (e4.requestBody = lr(e4.requestBody, e4.requestHeaders, s3, "Request")), null != e4 && e4.responseBody && (e4.responseBody = lr(e4.responseBody, e4.responseHeaders, s3, "Response")), e4)), c3 = (t4) => {
      return u3(((e4, t5) => {
        var i5, r5 = gt(e4.name), s4 = 0 === t5.indexOf("http") ? null === (i5 = gt(t5)) || void 0 === i5 ? void 0 : i5.pathname : t5;
        "/" === s4 && (s4 = "");
        var n4 = null == r5 ? void 0 : r5.pathname.replace(s4 || "", "");
        if (!(r5 && n4 && ar.some((e5) => 0 === n4.indexOf(e5)))) return e4;
      })((r4 = (i4 = t4).requestHeaders, M2(r4) || Y2(Object.keys(null != r4 ? r4 : {}), (e4) => {
        nr.includes(e4.toLowerCase()) && (r4[e4] = rr);
      }), i4), e3.api_host));
      var i4, r4;
    }, d3 = I2(e3.session_recording.maskNetworkRequestFn);
    return d3 && I2(e3.session_recording.maskCapturedNetworkRequestFn) && q2.warn("Both `maskNetworkRequestFn` and `maskCapturedNetworkRequestFn` are defined. `maskNetworkRequestFn` will be ignored."), d3 && (e3.session_recording.maskCapturedNetworkRequestFn = (t4) => {
      var i4 = e3.session_recording.maskNetworkRequestFn({ url: t4.name });
      return j2(j2({}, t4), {}, { name: null == i4 ? void 0 : i4.url });
    }), n3.maskRequestFn = I2(e3.session_recording.maskCapturedNetworkRequestFn) ? (t4) => {
      var i4, r4, s4, n4 = c3(t4);
      return n4 && null !== (i4 = null === (r4 = (s4 = e3.session_recording).maskCapturedNetworkRequestFn) || void 0 === r4 ? void 0 : r4.call(s4, n4)) && void 0 !== i4 ? i4 : void 0;
    } : (e4) => function(e5) {
      if (!R2(e5)) return e5.requestBody = ur(e5.requestBody, "Request"), e5.responseBody = ur(e5.responseBody, "Response"), e5;
    }(c3(e4)), j2(j2(j2({}, sr), n3), {}, { recordHeaders: o3, recordBody: a3, recordPerformance: l3, recordInitialRequests: l3 });
  };
  function dr(e3, t3, i3, r3, s3) {
    return t3 > i3 && (q2.warn("min cannot be greater than max."), t3 = i3), O2(e3) ? e3 > i3 ? (r3 && q2.warn(r3 + " cannot be  greater than max: " + i3 + ". Using max value instead."), i3) : e3 < t3 ? (r3 && q2.warn(r3 + " cannot be less than min: " + t3 + ". Using min value instead."), t3) : e3 : (r3 && q2.warn(r3 + " must be a number. using max or fallback. max: " + i3 + ", fallback: " + s3), dr(s3 || i3, t3, i3, r3));
  }
  var hr = class {
    constructor(e3) {
      var t3, i3, r3 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
      W2(this, "bucketSize", 100), W2(this, "refillRate", 10), W2(this, "mutationBuckets", {}), W2(this, "loggedTracker", {}), W2(this, "refillBuckets", () => {
        Object.keys(this.mutationBuckets).forEach((e4) => {
          this.mutationBuckets[e4] = this.mutationBuckets[e4] + this.refillRate, this.mutationBuckets[e4] >= this.bucketSize && delete this.mutationBuckets[e4];
        });
      }), W2(this, "getNodeOrRelevantParent", (e4) => {
        var t4 = this.rrweb.mirror.getNode(e4);
        if ("svg" !== (null == t4 ? void 0 : t4.nodeName) && t4 instanceof Element) {
          var i4 = t4.closest("svg");
          if (i4) return [this.rrweb.mirror.getId(i4), i4];
        }
        return [e4, t4];
      }), W2(this, "numberOfChanges", (e4) => {
        var t4, i4, r4, s3, n3, o3, a3, l3;
        return (null !== (t4 = null === (i4 = e4.removes) || void 0 === i4 ? void 0 : i4.length) && void 0 !== t4 ? t4 : 0) + (null !== (r4 = null === (s3 = e4.attributes) || void 0 === s3 ? void 0 : s3.length) && void 0 !== r4 ? r4 : 0) + (null !== (n3 = null === (o3 = e4.texts) || void 0 === o3 ? void 0 : o3.length) && void 0 !== n3 ? n3 : 0) + (null !== (a3 = null === (l3 = e4.adds) || void 0 === l3 ? void 0 : l3.length) && void 0 !== a3 ? a3 : 0);
      }), W2(this, "throttleMutations", (e4) => {
        if (3 !== e4.type || 0 !== e4.data.source) return e4;
        var t4 = e4.data, i4 = this.numberOfChanges(t4);
        t4.attributes && (t4.attributes = t4.attributes.filter((e5) => {
          var t5, i5, r5, [s3, n3] = this.getNodeOrRelevantParent(e5.id);
          if (0 === this.mutationBuckets[s3]) return false;
          (this.mutationBuckets[s3] = null !== (t5 = this.mutationBuckets[s3]) && void 0 !== t5 ? t5 : this.bucketSize, this.mutationBuckets[s3] = Math.max(this.mutationBuckets[s3] - 1, 0), 0 === this.mutationBuckets[s3]) && (this.loggedTracker[s3] || (this.loggedTracker[s3] = true, null === (i5 = (r5 = this.options).onBlockedNode) || void 0 === i5 || i5.call(r5, s3, n3)));
          return e5;
        }));
        var r4 = this.numberOfChanges(t4);
        return 0 !== r4 || i4 === r4 ? e4 : void 0;
      }), this.rrweb = e3, this.options = r3, this.refillRate = dr(null !== (t3 = this.options.refillRate) && void 0 !== t3 ? t3 : this.refillRate, 0, 100, "mutation throttling refill rate"), this.bucketSize = dr(null !== (i3 = this.options.bucketSize) && void 0 !== i3 ? i3 : this.bucketSize, 0, 100, "mutation throttling bucket size"), setInterval(() => {
        this.refillBuckets();
      }, 1e3);
    }
  };
  var _r = Uint8Array;
  var pr = Uint16Array;
  var vr = Uint32Array;
  var gr = new _r([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 0, 0, 0]);
  var fr = new _r([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 0, 0]);
  var mr = new _r([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
  var br = function(e3, t3) {
    for (var i3 = new pr(31), r3 = 0; r3 < 31; ++r3) i3[r3] = t3 += 1 << e3[r3 - 1];
    var s3 = new vr(i3[30]);
    for (r3 = 1; r3 < 30; ++r3) for (var n3 = i3[r3]; n3 < i3[r3 + 1]; ++n3) s3[n3] = n3 - i3[r3] << 5 | r3;
    return [i3, s3];
  };
  var yr = br(gr, 2);
  var wr = yr[0];
  var Sr = yr[1];
  wr[28] = 258, Sr[258] = 28;
  for (Er = br(fr, 0)[1], kr = new pr(32768), xr = 0; xr < 32768; ++xr) {
    Ir = (43690 & xr) >>> 1 | (21845 & xr) << 1;
    Ir = (61680 & (Ir = (52428 & Ir) >>> 2 | (13107 & Ir) << 2)) >>> 4 | (3855 & Ir) << 4, kr[xr] = ((65280 & Ir) >>> 8 | (255 & Ir) << 8) >>> 1;
  }
  var Ir;
  var Er;
  var kr;
  var xr;
  var Cr = function(e3, t3, i3) {
    for (var r3 = e3.length, s3 = 0, n3 = new pr(t3); s3 < r3; ++s3) ++n3[e3[s3] - 1];
    var o3, a3 = new pr(t3);
    for (s3 = 0; s3 < t3; ++s3) a3[s3] = a3[s3 - 1] + n3[s3 - 1] << 1;
    if (i3) {
      o3 = new pr(1 << t3);
      var l3 = 15 - t3;
      for (s3 = 0; s3 < r3; ++s3) if (e3[s3]) for (var u3 = s3 << 4 | e3[s3], c3 = t3 - e3[s3], d3 = a3[e3[s3] - 1]++ << c3, h3 = d3 | (1 << c3) - 1; d3 <= h3; ++d3) o3[kr[d3] >>> l3] = u3;
    } else for (o3 = new pr(r3), s3 = 0; s3 < r3; ++s3) o3[s3] = kr[a3[e3[s3] - 1]++] >>> 15 - e3[s3];
    return o3;
  };
  var Pr = new _r(288);
  for (xr = 0; xr < 144; ++xr) Pr[xr] = 8;
  for (xr = 144; xr < 256; ++xr) Pr[xr] = 9;
  for (xr = 256; xr < 280; ++xr) Pr[xr] = 7;
  for (xr = 280; xr < 288; ++xr) Pr[xr] = 8;
  var Rr = new _r(32);
  for (xr = 0; xr < 32; ++xr) Rr[xr] = 5;
  var Fr = Cr(Pr, 9, 0);
  var Tr = Cr(Rr, 5, 0);
  var $r = function(e3) {
    return (e3 / 8 >> 0) + (7 & e3 && 1);
  };
  var Mr = function(e3, t3, i3) {
    (null == i3 || i3 > e3.length) && (i3 = e3.length);
    var r3 = new (e3 instanceof pr ? pr : e3 instanceof vr ? vr : _r)(i3 - t3);
    return r3.set(e3.subarray(t3, i3)), r3;
  };
  var Or = function(e3, t3, i3) {
    i3 <<= 7 & t3;
    var r3 = t3 / 8 >> 0;
    e3[r3] |= i3, e3[r3 + 1] |= i3 >>> 8;
  };
  var Lr = function(e3, t3, i3) {
    i3 <<= 7 & t3;
    var r3 = t3 / 8 >> 0;
    e3[r3] |= i3, e3[r3 + 1] |= i3 >>> 8, e3[r3 + 2] |= i3 >>> 16;
  };
  var Ar = function(e3, t3) {
    for (var i3 = [], r3 = 0; r3 < e3.length; ++r3) e3[r3] && i3.push({ s: r3, f: e3[r3] });
    var s3 = i3.length, n3 = i3.slice();
    if (!s3) return [new _r(0), 0];
    if (1 == s3) {
      var o3 = new _r(i3[0].s + 1);
      return o3[i3[0].s] = 1, [o3, 1];
    }
    i3.sort(function(e4, t4) {
      return e4.f - t4.f;
    }), i3.push({ s: -1, f: 25001 });
    var a3 = i3[0], l3 = i3[1], u3 = 0, c3 = 1, d3 = 2;
    for (i3[0] = { s: -1, f: a3.f + l3.f, l: a3, r: l3 }; c3 != s3 - 1; ) a3 = i3[i3[u3].f < i3[d3].f ? u3++ : d3++], l3 = i3[u3 != c3 && i3[u3].f < i3[d3].f ? u3++ : d3++], i3[c3++] = { s: -1, f: a3.f + l3.f, l: a3, r: l3 };
    var h3 = n3[0].s;
    for (r3 = 1; r3 < s3; ++r3) n3[r3].s > h3 && (h3 = n3[r3].s);
    var _3 = new pr(h3 + 1), p3 = Dr(i3[c3 - 1], _3, 0);
    if (p3 > t3) {
      r3 = 0;
      var v3 = 0, g3 = p3 - t3, f2 = 1 << g3;
      for (n3.sort(function(e4, t4) {
        return _3[t4.s] - _3[e4.s] || e4.f - t4.f;
      }); r3 < s3; ++r3) {
        var m3 = n3[r3].s;
        if (!(_3[m3] > t3)) break;
        v3 += f2 - (1 << p3 - _3[m3]), _3[m3] = t3;
      }
      for (v3 >>>= g3; v3 > 0; ) {
        var b3 = n3[r3].s;
        _3[b3] < t3 ? v3 -= 1 << t3 - _3[b3]++ - 1 : ++r3;
      }
      for (; r3 >= 0 && v3; --r3) {
        var y3 = n3[r3].s;
        _3[y3] == t3 && (--_3[y3], ++v3);
      }
      p3 = t3;
    }
    return [new _r(_3), p3];
  };
  var Dr = function(e3, t3, i3) {
    return -1 == e3.s ? Math.max(Dr(e3.l, t3, i3 + 1), Dr(e3.r, t3, i3 + 1)) : t3[e3.s] = i3;
  };
  var Nr = function(e3) {
    for (var t3 = e3.length; t3 && !e3[--t3]; ) ;
    for (var i3 = new pr(++t3), r3 = 0, s3 = e3[0], n3 = 1, o3 = function(e4) {
      i3[r3++] = e4;
    }, a3 = 1; a3 <= t3; ++a3) if (e3[a3] == s3 && a3 != t3) ++n3;
    else {
      if (!s3 && n3 > 2) {
        for (; n3 > 138; n3 -= 138) o3(32754);
        n3 > 2 && (o3(n3 > 10 ? n3 - 11 << 5 | 28690 : n3 - 3 << 5 | 12305), n3 = 0);
      } else if (n3 > 3) {
        for (o3(s3), --n3; n3 > 6; n3 -= 6) o3(8304);
        n3 > 2 && (o3(n3 - 3 << 5 | 8208), n3 = 0);
      }
      for (; n3--; ) o3(s3);
      n3 = 1, s3 = e3[a3];
    }
    return [i3.subarray(0, r3), t3];
  };
  var qr = function(e3, t3) {
    for (var i3 = 0, r3 = 0; r3 < t3.length; ++r3) i3 += e3[r3] * t3[r3];
    return i3;
  };
  var Br = function(e3, t3, i3) {
    var r3 = i3.length, s3 = $r(t3 + 2);
    e3[s3] = 255 & r3, e3[s3 + 1] = r3 >>> 8, e3[s3 + 2] = 255 ^ e3[s3], e3[s3 + 3] = 255 ^ e3[s3 + 1];
    for (var n3 = 0; n3 < r3; ++n3) e3[s3 + n3 + 4] = i3[n3];
    return 8 * (s3 + 4 + r3);
  };
  var Hr = function(e3, t3, i3, r3, s3, n3, o3, a3, l3, u3, c3) {
    Or(t3, c3++, i3), ++s3[256];
    for (var d3 = Ar(s3, 15), h3 = d3[0], _3 = d3[1], p3 = Ar(n3, 15), v3 = p3[0], g3 = p3[1], f2 = Nr(h3), m3 = f2[0], b3 = f2[1], y3 = Nr(v3), w3 = y3[0], S3 = y3[1], E3 = new pr(19), k3 = 0; k3 < m3.length; ++k3) E3[31 & m3[k3]]++;
    for (k3 = 0; k3 < w3.length; ++k3) E3[31 & w3[k3]]++;
    for (var x3 = Ar(E3, 7), I3 = x3[0], C3 = x3[1], P3 = 19; P3 > 4 && !I3[mr[P3 - 1]]; --P3) ;
    var R3, F3, T3, $3, M3 = u3 + 5 << 3, O3 = qr(s3, Pr) + qr(n3, Rr) + o3, L3 = qr(s3, h3) + qr(n3, v3) + o3 + 14 + 3 * P3 + qr(E3, I3) + (2 * E3[16] + 3 * E3[17] + 7 * E3[18]);
    if (M3 <= O3 && M3 <= L3) return Br(t3, c3, e3.subarray(l3, l3 + u3));
    if (Or(t3, c3, 1 + (L3 < O3)), c3 += 2, L3 < O3) {
      R3 = Cr(h3, _3, 0), F3 = h3, T3 = Cr(v3, g3, 0), $3 = v3;
      var A3 = Cr(I3, C3, 0);
      Or(t3, c3, b3 - 257), Or(t3, c3 + 5, S3 - 1), Or(t3, c3 + 10, P3 - 4), c3 += 14;
      for (k3 = 0; k3 < P3; ++k3) Or(t3, c3 + 3 * k3, I3[mr[k3]]);
      c3 += 3 * P3;
      for (var D3 = [m3, w3], N3 = 0; N3 < 2; ++N3) {
        var q3 = D3[N3];
        for (k3 = 0; k3 < q3.length; ++k3) {
          var B3 = 31 & q3[k3];
          Or(t3, c3, A3[B3]), c3 += I3[B3], B3 > 15 && (Or(t3, c3, q3[k3] >>> 5 & 127), c3 += q3[k3] >>> 12);
        }
      }
    } else R3 = Fr, F3 = Pr, T3 = Tr, $3 = Rr;
    for (k3 = 0; k3 < a3; ++k3) if (r3[k3] > 255) {
      B3 = r3[k3] >>> 18 & 31;
      Lr(t3, c3, R3[B3 + 257]), c3 += F3[B3 + 257], B3 > 7 && (Or(t3, c3, r3[k3] >>> 23 & 31), c3 += gr[B3]);
      var H3 = 31 & r3[k3];
      Lr(t3, c3, T3[H3]), c3 += $3[H3], H3 > 3 && (Lr(t3, c3, r3[k3] >>> 5 & 8191), c3 += fr[H3]);
    } else Lr(t3, c3, R3[r3[k3]]), c3 += F3[r3[k3]];
    return Lr(t3, c3, R3[256]), c3 + F3[256];
  };
  var Ur = new vr([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]);
  var zr = function() {
    for (var e3 = new vr(256), t3 = 0; t3 < 256; ++t3) {
      for (var i3 = t3, r3 = 9; --r3; ) i3 = (1 & i3 && 3988292384) ^ i3 >>> 1;
      e3[t3] = i3;
    }
    return e3;
  }();
  var jr = function() {
    var e3 = 4294967295;
    return { p: function(t3) {
      for (var i3 = e3, r3 = 0; r3 < t3.length; ++r3) i3 = zr[255 & i3 ^ t3[r3]] ^ i3 >>> 8;
      e3 = i3;
    }, d: function() {
      return 4294967295 ^ e3;
    } };
  };
  var Wr = function(e3, t3, i3, r3, s3) {
    return function(e4, t4, i4, r4, s4, n3) {
      var o3 = e4.length, a3 = new _r(r4 + o3 + 5 * (1 + Math.floor(o3 / 7e3)) + s4), l3 = a3.subarray(r4, a3.length - s4), u3 = 0;
      if (!t4 || o3 < 8) for (var c3 = 0; c3 <= o3; c3 += 65535) {
        var d3 = c3 + 65535;
        d3 < o3 ? u3 = Br(l3, u3, e4.subarray(c3, d3)) : (l3[c3] = n3, u3 = Br(l3, u3, e4.subarray(c3, o3)));
      }
      else {
        for (var h3 = Ur[t4 - 1], _3 = h3 >>> 13, p3 = 8191 & h3, v3 = (1 << i4) - 1, g3 = new pr(32768), f2 = new pr(v3 + 1), m3 = Math.ceil(i4 / 3), b3 = 2 * m3, y3 = function(t5) {
          return (e4[t5] ^ e4[t5 + 1] << m3 ^ e4[t5 + 2] << b3) & v3;
        }, w3 = new vr(25e3), S3 = new pr(288), E3 = new pr(32), k3 = 0, x3 = 0, I3 = (c3 = 0, 0), C3 = 0, P3 = 0; c3 < o3; ++c3) {
          var R3 = y3(c3), F3 = 32767 & c3, T3 = f2[R3];
          if (g3[F3] = T3, f2[R3] = F3, C3 <= c3) {
            var $3 = o3 - c3;
            if ((k3 > 7e3 || I3 > 24576) && $3 > 423) {
              u3 = Hr(e4, l3, 0, w3, S3, E3, x3, I3, P3, c3 - P3, u3), I3 = k3 = x3 = 0, P3 = c3;
              for (var M3 = 0; M3 < 286; ++M3) S3[M3] = 0;
              for (M3 = 0; M3 < 30; ++M3) E3[M3] = 0;
            }
            var O3 = 2, L3 = 0, A3 = p3, D3 = F3 - T3 & 32767;
            if ($3 > 2 && R3 == y3(c3 - D3)) for (var N3 = Math.min(_3, $3) - 1, q3 = Math.min(32767, c3), B3 = Math.min(258, $3); D3 <= q3 && --A3 && F3 != T3; ) {
              if (e4[c3 + O3] == e4[c3 + O3 - D3]) {
                for (var H3 = 0; H3 < B3 && e4[c3 + H3] == e4[c3 + H3 - D3]; ++H3) ;
                if (H3 > O3) {
                  if (O3 = H3, L3 = D3, H3 > N3) break;
                  var U3 = Math.min(D3, H3 - 2), z3 = 0;
                  for (M3 = 0; M3 < U3; ++M3) {
                    var j3 = c3 - D3 + M3 + 32768 & 32767, W3 = j3 - g3[j3] + 32768 & 32767;
                    W3 > z3 && (z3 = W3, T3 = j3);
                  }
                }
              }
              D3 += (F3 = T3) - (T3 = g3[F3]) + 32768 & 32767;
            }
            if (L3) {
              w3[I3++] = 268435456 | Sr[O3] << 18 | Er[L3];
              var V3 = 31 & Sr[O3], G3 = 31 & Er[L3];
              x3 += gr[V3] + fr[G3], ++S3[257 + V3], ++E3[G3], C3 = c3 + O3, ++k3;
            } else w3[I3++] = e4[c3], ++S3[e4[c3]];
          }
        }
        u3 = Hr(e4, l3, n3, w3, S3, E3, x3, I3, P3, c3 - P3, u3);
      }
      return Mr(a3, 0, r4 + $r(u3) + s4);
    }(e3, null == t3.level ? 6 : t3.level, null == t3.mem ? Math.ceil(1.5 * Math.max(8, Math.min(13, Math.log(e3.length)))) : 12 + t3.mem, i3, r3, !s3);
  };
  var Vr = function(e3, t3, i3) {
    for (; i3; ++t3) e3[t3] = i3, i3 >>>= 8;
  };
  var Gr = function(e3, t3) {
    var i3 = t3.filename;
    if (e3[0] = 31, e3[1] = 139, e3[2] = 8, e3[8] = t3.level < 2 ? 4 : 9 == t3.level ? 2 : 0, e3[9] = 3, 0 != t3.mtime && Vr(e3, 4, Math.floor(new Date(t3.mtime || Date.now()) / 1e3)), i3) {
      e3[3] = 8;
      for (var r3 = 0; r3 <= i3.length; ++r3) e3[r3 + 10] = i3.charCodeAt(r3);
    }
  };
  var Jr = function(e3) {
    return 10 + (e3.filename && e3.filename.length + 1 || 0);
  };
  function Yr(e3, t3) {
    void 0 === t3 && (t3 = {});
    var i3 = jr(), r3 = e3.length;
    i3.p(e3);
    var s3 = Wr(e3, t3, Jr(t3), 8), n3 = s3.length;
    return Gr(s3, t3), Vr(s3, n3 - 8, i3.d()), Vr(s3, n3 - 4, r3), s3;
  }
  function Kr(e3, t3) {
    var i3 = e3.length;
    if ("undefined" != typeof TextEncoder) return new TextEncoder().encode(e3);
    for (var r3 = new _r(e3.length + (e3.length >>> 1)), s3 = 0, n3 = function(e4) {
      r3[s3++] = e4;
    }, o3 = 0; o3 < i3; ++o3) {
      if (s3 + 5 > r3.length) {
        var a3 = new _r(s3 + 8 + (i3 - o3 << 1));
        a3.set(r3), r3 = a3;
      }
      var l3 = e3.charCodeAt(o3);
      l3 < 128 || t3 ? n3(l3) : l3 < 2048 ? (n3(192 | l3 >>> 6), n3(128 | 63 & l3)) : l3 > 55295 && l3 < 57344 ? (n3(240 | (l3 = 65536 + (1047552 & l3) | 1023 & e3.charCodeAt(++o3)) >>> 18), n3(128 | l3 >>> 12 & 63), n3(128 | l3 >>> 6 & 63), n3(128 | 63 & l3)) : (n3(224 | l3 >>> 12), n3(128 | l3 >>> 6 & 63), n3(128 | 63 & l3));
    }
    return Mr(r3, 0, s3);
  }
  var Xr = "[SessionRecording]";
  var Qr = B2(Xr);
  var Zr = 3e5;
  var es = [Ci.MouseMove, Ci.MouseInteraction, Ci.Scroll, Ci.ViewportResize, Ci.Input, Ci.TouchMove, Ci.MediaInteraction, Ci.Drag];
  var ts = (e3) => ({ rrwebMethod: e3, enqueuedAt: Date.now(), attempt: 1 });
  function is(e3) {
    return function(e4, t3) {
      for (var i3 = "", r3 = 0; r3 < e4.length; ) {
        var s3 = e4[r3++];
        s3 < 128 || t3 ? i3 += String.fromCharCode(s3) : s3 < 224 ? i3 += String.fromCharCode((31 & s3) << 6 | 63 & e4[r3++]) : s3 < 240 ? i3 += String.fromCharCode((15 & s3) << 12 | (63 & e4[r3++]) << 6 | 63 & e4[r3++]) : (s3 = ((15 & s3) << 18 | (63 & e4[r3++]) << 12 | (63 & e4[r3++]) << 6 | 63 & e4[r3++]) - 65536, i3 += String.fromCharCode(55296 | s3 >> 10, 56320 | 1023 & s3));
      }
      return i3;
    }(Yr(Kr(JSON.stringify(e3))), true);
  }
  function rs(e3) {
    return e3.type === Ii.Custom && "sessionIdle" === e3.data.tag;
  }
  function ss(e3, t3) {
    return t3.some((t4) => "regex" === t4.matching && new RegExp(t4.url).test(e3));
  }
  var ns = class {
    get sessionIdleThresholdMilliseconds() {
      return this.instance.config.session_recording.session_idle_threshold_ms || 3e5;
    }
    get rrwebRecord() {
      var e3, t3;
      return null == _2 || null === (e3 = _2.__PosthogExtensions__) || void 0 === e3 || null === (t3 = e3.rrweb) || void 0 === t3 ? void 0 : t3.record;
    }
    get started() {
      return this._captureStarted;
    }
    get sessionManager() {
      if (!this.instance.sessionManager) throw new Error(Xr + " must be started with a valid sessionManager.");
      return this.instance.sessionManager;
    }
    get fullSnapshotIntervalMillis() {
      var e3, t3;
      return "trigger_pending" === this.triggerStatus ? 6e4 : null !== (e3 = null === (t3 = this.instance.config.session_recording) || void 0 === t3 ? void 0 : t3.full_snapshot_interval_millis) && void 0 !== e3 ? e3 : Zr;
    }
    get isSampled() {
      var e3 = this.instance.get_property(Se);
      return L2(e3) ? e3 : null;
    }
    get sessionDuration() {
      var e3, t3, i3 = null === (e3 = this.buffer) || void 0 === e3 ? void 0 : e3.data[(null === (t3 = this.buffer) || void 0 === t3 ? void 0 : t3.data.length) - 1], { sessionStartTimestamp: r3 } = this.sessionManager.checkAndGetSessionAndWindowId(true);
      return i3 ? i3.timestamp - r3 : null;
    }
    get isRecordingEnabled() {
      var e3 = !!this.instance.get_property(pe), i3 = !this.instance.config.disable_session_recording;
      return t2 && e3 && i3;
    }
    get isConsoleLogCaptureEnabled() {
      var e3 = !!this.instance.get_property(ve), t3 = this.instance.config.enable_recording_console_log;
      return null != t3 ? t3 : e3;
    }
    get canvasRecording() {
      var e3, t3, i3, r3, s3, n3, o3 = this.instance.config.session_recording.captureCanvas, a3 = this.instance.get_property(fe), l3 = null !== (e3 = null !== (t3 = null == o3 ? void 0 : o3.recordCanvas) && void 0 !== t3 ? t3 : null == a3 ? void 0 : a3.enabled) && void 0 !== e3 && e3, u3 = null !== (i3 = null !== (r3 = null == o3 ? void 0 : o3.canvasFps) && void 0 !== r3 ? r3 : null == a3 ? void 0 : a3.fps) && void 0 !== i3 ? i3 : 0, c3 = null !== (s3 = null !== (n3 = null == o3 ? void 0 : o3.canvasQuality) && void 0 !== n3 ? n3 : null == a3 ? void 0 : a3.quality) && void 0 !== s3 ? s3 : 0;
      return { enabled: l3, fps: dr(u3, 0, 12, "canvas recording fps"), quality: dr(c3, 0, 1, "canvas recording quality") };
    }
    get networkPayloadCapture() {
      var e3, t3, i3 = this.instance.get_property(ge), r3 = { recordHeaders: null === (e3 = this.instance.config.session_recording) || void 0 === e3 ? void 0 : e3.recordHeaders, recordBody: null === (t3 = this.instance.config.session_recording) || void 0 === t3 ? void 0 : t3.recordBody }, s3 = (null == r3 ? void 0 : r3.recordHeaders) || (null == i3 ? void 0 : i3.recordHeaders), n3 = (null == r3 ? void 0 : r3.recordBody) || (null == i3 ? void 0 : i3.recordBody), o3 = C2(this.instance.config.capture_performance) ? this.instance.config.capture_performance.network_timing : this.instance.config.capture_performance, a3 = !!(L2(o3) ? o3 : null == i3 ? void 0 : i3.capturePerformance);
      return s3 || n3 || a3 ? { recordHeaders: s3, recordBody: n3, recordPerformance: a3 } : void 0;
    }
    get sampleRate() {
      var e3 = this.instance.get_property(me);
      return O2(e3) ? e3 : null;
    }
    get minimumDuration() {
      var e3 = this.instance.get_property(be);
      return O2(e3) ? e3 : null;
    }
    get status() {
      return this.receivedDecide ? this.isRecordingEnabled ? this._urlBlocked ? "paused" : M2(this._linkedFlag) || this._linkedFlagSeen ? "trigger_pending" === this.triggerStatus ? "buffering" : L2(this.isSampled) ? this.isSampled ? "sampled" : "disabled" : "active" : "buffering" : "disabled" : "buffering";
    }
    get urlTriggerStatus() {
      var e3;
      return 0 === this._urlTriggers.length ? "trigger_disabled" : (null === (e3 = this.instance) || void 0 === e3 ? void 0 : e3.get_property(Ee)) === this.sessionId ? "trigger_activated" : "trigger_pending";
    }
    get eventTriggerStatus() {
      var e3;
      return 0 === this._eventTriggers.length ? "trigger_disabled" : (null === (e3 = this.instance) || void 0 === e3 ? void 0 : e3.get_property(ke)) === this.sessionId ? "trigger_activated" : "trigger_pending";
    }
    get triggerStatus() {
      var e3 = "trigger_activated" === this.eventTriggerStatus || "trigger_activated" === this.urlTriggerStatus, t3 = "trigger_pending" === this.eventTriggerStatus || "trigger_pending" === this.urlTriggerStatus;
      return e3 ? "trigger_activated" : t3 ? "trigger_pending" : "trigger_disabled";
    }
    constructor(e3) {
      if (W2(this, "queuedRRWebEvents", []), W2(this, "isIdle", false), W2(this, "_linkedFlagSeen", false), W2(this, "_lastActivityTimestamp", Date.now()), W2(this, "_linkedFlag", null), W2(this, "_removePageViewCaptureHook", void 0), W2(this, "_onSessionIdListener", void 0), W2(this, "_persistDecideOnSessionListener", void 0), W2(this, "_samplingSessionListener", void 0), W2(this, "_urlTriggers", []), W2(this, "_urlBlocklist", []), W2(this, "_urlBlocked", false), W2(this, "_eventTriggers", []), W2(this, "_removeEventTriggerCaptureHook", void 0), W2(this, "_forceAllowLocalhostNetworkCapture", false), W2(this, "_onBeforeUnload", () => {
        this._flushBuffer();
      }), W2(this, "_onOffline", () => {
        this._tryAddCustomEvent("browser offline", {});
      }), W2(this, "_onOnline", () => {
        this._tryAddCustomEvent("browser online", {});
      }), W2(this, "_onVisibilityChange", () => {
        if (null != a2 && a2.visibilityState) {
          var e4 = "window " + a2.visibilityState;
          this._tryAddCustomEvent(e4, {});
        }
      }), this.instance = e3, this._captureStarted = false, this._endpoint = "/s/", this.stopRrweb = void 0, this.receivedDecide = false, !this.instance.sessionManager) throw Qr.error("started without valid sessionManager"), new Error(Xr + " started without valid sessionManager. This is a bug.");
      if (this.instance.config.__preview_experimental_cookieless_mode) throw new Error(Xr + " cannot be used with __preview_experimental_cookieless_mode.");
      var { sessionId: t3, windowId: i3 } = this.sessionManager.checkAndGetSessionAndWindowId();
      this.sessionId = t3, this.windowId = i3, this.buffer = this.clearBuffer(), this.sessionIdleThresholdMilliseconds >= this.sessionManager.sessionTimeoutMs && Qr.warn("session_idle_threshold_ms (".concat(this.sessionIdleThresholdMilliseconds, ") is greater than the session timeout (").concat(this.sessionManager.sessionTimeoutMs, "). Session will never be detected as idle"));
    }
    startIfEnabledOrStop(e3) {
      this.isRecordingEnabled ? (this._startCapture(e3), null == t2 || t2.addEventListener("beforeunload", this._onBeforeUnload), null == t2 || t2.addEventListener("offline", this._onOffline), null == t2 || t2.addEventListener("online", this._onOnline), null == t2 || t2.addEventListener("visibilitychange", this._onVisibilityChange), this._setupSampling(), this._addEventTriggerListener(), M2(this._removePageViewCaptureHook) && (this._removePageViewCaptureHook = this.instance.on("eventCaptured", (e4) => {
        try {
          if ("$pageview" === e4.event) {
            var t3 = null != e4 && e4.properties.$current_url ? this._maskUrl(null == e4 ? void 0 : e4.properties.$current_url) : "";
            if (!t3) return;
            this._tryAddCustomEvent("$pageview", { href: t3 });
          }
        } catch (e5) {
          Qr.error("Could not add $pageview to rrweb session", e5);
        }
      })), this._onSessionIdListener || (this._onSessionIdListener = this.sessionManager.onSessionId((e4, t3, i3) => {
        var r3, s3, n3, o3;
        i3 && (this._tryAddCustomEvent("$session_id_change", { sessionId: e4, windowId: t3, changeReason: i3 }), null === (r3 = this.instance) || void 0 === r3 || null === (s3 = r3.persistence) || void 0 === s3 || s3.unregister(ke), null === (n3 = this.instance) || void 0 === n3 || null === (o3 = n3.persistence) || void 0 === o3 || o3.unregister(Ee));
      }))) : this.stopRecording();
    }
    stopRecording() {
      var e3, i3, r3, s3;
      this._captureStarted && this.stopRrweb && (this.stopRrweb(), this.stopRrweb = void 0, this._captureStarted = false, null == t2 || t2.removeEventListener("beforeunload", this._onBeforeUnload), null == t2 || t2.removeEventListener("offline", this._onOffline), null == t2 || t2.removeEventListener("online", this._onOnline), null == t2 || t2.removeEventListener("visibilitychange", this._onVisibilityChange), this.clearBuffer(), clearInterval(this._fullSnapshotTimer), null === (e3 = this._removePageViewCaptureHook) || void 0 === e3 || e3.call(this), this._removePageViewCaptureHook = void 0, null === (i3 = this._removeEventTriggerCaptureHook) || void 0 === i3 || i3.call(this), this._removeEventTriggerCaptureHook = void 0, null === (r3 = this._onSessionIdListener) || void 0 === r3 || r3.call(this), this._onSessionIdListener = void 0, null === (s3 = this._samplingSessionListener) || void 0 === s3 || s3.call(this), this._samplingSessionListener = void 0, Qr.info("stopped"));
    }
    makeSamplingDecision(e3) {
      var t3, i3 = this.sessionId !== e3, r3 = this.sampleRate;
      if (O2(r3)) {
        var s3, n3 = this.isSampled, o3 = i3 || !L2(n3);
        if (o3) s3 = Math.random() < r3;
        else s3 = n3;
        o3 && (s3 ? this._reportStarted("sampled") : Qr.warn("Sample rate (".concat(r3, ") has determined that this sessionId (").concat(e3, ") will not be sent to the server.")), this._tryAddCustomEvent("samplingDecisionMade", { sampleRate: r3, isSampled: s3 })), null === (t3 = this.instance.persistence) || void 0 === t3 || t3.register({ [Se]: s3 });
      } else {
        var a3;
        null === (a3 = this.instance.persistence) || void 0 === a3 || a3.register({ [Se]: null });
      }
    }
    onRemoteConfig(e3) {
      var t3, i3, r3, s3, n3, o3;
      (this._tryAddCustomEvent("$remote_config_received", e3), this._persistRemoteConfig(e3), this._linkedFlag = (null === (t3 = e3.sessionRecording) || void 0 === t3 ? void 0 : t3.linkedFlag) || null, null !== (i3 = e3.sessionRecording) && void 0 !== i3 && i3.endpoint) && (this._endpoint = null === (o3 = e3.sessionRecording) || void 0 === o3 ? void 0 : o3.endpoint);
      if (this._setupSampling(), !M2(this._linkedFlag) && !this._linkedFlagSeen) {
        var a3 = F2(this._linkedFlag) ? this._linkedFlag : this._linkedFlag.flag, l3 = F2(this._linkedFlag) ? null : this._linkedFlag.variant;
        this.instance.onFeatureFlags((e4, t4) => {
          var i4 = C2(t4) && a3 in t4, r4 = l3 ? t4[a3] === l3 : i4;
          r4 && this._reportStarted("linked_flag_matched", { linkedFlag: a3, linkedVariant: l3 }), this._linkedFlagSeen = r4;
        });
      }
      null !== (r3 = e3.sessionRecording) && void 0 !== r3 && r3.urlTriggers && (this._urlTriggers = e3.sessionRecording.urlTriggers), null !== (s3 = e3.sessionRecording) && void 0 !== s3 && s3.urlBlocklist && (this._urlBlocklist = e3.sessionRecording.urlBlocklist), null !== (n3 = e3.sessionRecording) && void 0 !== n3 && n3.eventTriggers && (this._eventTriggers = e3.sessionRecording.eventTriggers), this.receivedDecide = true, this.startIfEnabledOrStop();
    }
    _setupSampling() {
      O2(this.sampleRate) && M2(this._samplingSessionListener) && (this._samplingSessionListener = this.sessionManager.onSessionId((e3) => {
        this.makeSamplingDecision(e3);
      }));
    }
    _persistRemoteConfig(e3) {
      if (this.instance.persistence) {
        var t3, i3 = this.instance.persistence, r3 = () => {
          var t4, r4, s3, n3, o3, a3, l3, u3, c3 = null === (t4 = e3.sessionRecording) || void 0 === t4 ? void 0 : t4.sampleRate, d3 = M2(c3) ? null : parseFloat(c3), h3 = null === (r4 = e3.sessionRecording) || void 0 === r4 ? void 0 : r4.minimumDurationMilliseconds;
          i3.register({ [pe]: !!e3.sessionRecording, [ve]: null === (s3 = e3.sessionRecording) || void 0 === s3 ? void 0 : s3.consoleLogRecordingEnabled, [ge]: j2({ capturePerformance: e3.capturePerformance }, null === (n3 = e3.sessionRecording) || void 0 === n3 ? void 0 : n3.networkPayloadCapture), [fe]: { enabled: null === (o3 = e3.sessionRecording) || void 0 === o3 ? void 0 : o3.recordCanvas, fps: null === (a3 = e3.sessionRecording) || void 0 === a3 ? void 0 : a3.canvasFps, quality: null === (l3 = e3.sessionRecording) || void 0 === l3 ? void 0 : l3.canvasQuality }, [me]: d3, [be]: R2(h3) ? null : h3, [ye]: null === (u3 = e3.sessionRecording) || void 0 === u3 ? void 0 : u3.scriptConfig });
        };
        r3(), null === (t3 = this._persistDecideOnSessionListener) || void 0 === t3 || t3.call(this), this._persistDecideOnSessionListener = this.sessionManager.onSessionId(r3);
      }
    }
    log(e3) {
      var t3, i3 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "log";
      null === (t3 = this.instance.sessionRecording) || void 0 === t3 || t3.onRRwebEmit({ type: 6, data: { plugin: "rrweb/console@1", payload: { level: i3, trace: [], payload: [JSON.stringify(e3)] } }, timestamp: Date.now() });
    }
    _startCapture(e3) {
      if (!R2(Object.assign) && !R2(Array.from) && !(this._captureStarted || this.instance.config.disable_session_recording || this.instance.consent.isOptedOut())) {
        var t3, i3;
        if (this._captureStarted = true, this.sessionManager.checkAndGetSessionAndWindowId(), this.rrwebRecord) this._onScriptLoaded();
        else null === (t3 = _2.__PosthogExtensions__) || void 0 === t3 || null === (i3 = t3.loadExternalDependency) || void 0 === i3 || i3.call(t3, this.instance, this.scriptName, (e4) => {
          if (e4) return Qr.error("could not load recorder", e4);
          this._onScriptLoaded();
        });
        Qr.info("starting"), "active" === this.status && this._reportStarted(e3 || "recording_initialized");
      }
    }
    get scriptName() {
      var e3, t3, i3;
      return (null === (e3 = this.instance) || void 0 === e3 || null === (t3 = e3.persistence) || void 0 === t3 || null === (i3 = t3.get_property(ye)) || void 0 === i3 ? void 0 : i3.script) || "recorder";
    }
    isInteractiveEvent(e3) {
      var t3;
      return 3 === e3.type && -1 !== es.indexOf(null === (t3 = e3.data) || void 0 === t3 ? void 0 : t3.source);
    }
    _updateWindowAndSessionIds(e3) {
      var t3 = this.isInteractiveEvent(e3);
      t3 || this.isIdle || e3.timestamp - this._lastActivityTimestamp > this.sessionIdleThresholdMilliseconds && (this.isIdle = true, clearInterval(this._fullSnapshotTimer), this._tryAddCustomEvent("sessionIdle", { eventTimestamp: e3.timestamp, lastActivityTimestamp: this._lastActivityTimestamp, threshold: this.sessionIdleThresholdMilliseconds, bufferLength: this.buffer.data.length, bufferSize: this.buffer.size }), this._flushBuffer());
      var i3 = false;
      if (t3 && (this._lastActivityTimestamp = e3.timestamp, this.isIdle && (this.isIdle = false, this._tryAddCustomEvent("sessionNoLongerIdle", { reason: "user activity", type: e3.type }), i3 = true)), !this.isIdle) {
        var { windowId: r3, sessionId: s3 } = this.sessionManager.checkAndGetSessionAndWindowId(!t3, e3.timestamp), n3 = this.sessionId !== s3, o3 = this.windowId !== r3;
        this.windowId = r3, this.sessionId = s3, n3 || o3 ? (this.stopRecording(), this.startIfEnabledOrStop("session_id_changed")) : i3 && this._scheduleFullSnapshot();
      }
    }
    _tryRRWebMethod(e3) {
      try {
        return e3.rrwebMethod(), true;
      } catch (t3) {
        return this.queuedRRWebEvents.length < 10 ? this.queuedRRWebEvents.push({ enqueuedAt: e3.enqueuedAt || Date.now(), attempt: e3.attempt++, rrwebMethod: e3.rrwebMethod }) : Qr.warn("could not emit queued rrweb event.", t3, e3), false;
      }
    }
    _tryAddCustomEvent(e3, t3) {
      return this._tryRRWebMethod(ts(() => this.rrwebRecord.addCustomEvent(e3, t3)));
    }
    _tryTakeFullSnapshot() {
      return this._tryRRWebMethod(ts(() => this.rrwebRecord.takeFullSnapshot()));
    }
    _onScriptLoaded() {
      var e3, t3 = { blockClass: "ph-no-capture", blockSelector: void 0, ignoreClass: "ph-ignore-input", maskTextClass: "ph-mask", maskTextSelector: void 0, maskTextFn: void 0, maskAllInputs: true, maskInputOptions: { password: true }, maskInputFn: void 0, slimDOMOptions: {}, collectFonts: false, inlineStylesheet: true, recordCrossOriginIframes: false }, i3 = this.instance.config.session_recording;
      for (var [r3, s3] of Object.entries(i3 || {})) r3 in t3 && ("maskInputOptions" === r3 ? t3.maskInputOptions = j2({ password: true }, s3) : t3[r3] = s3);
      if (this.canvasRecording && this.canvasRecording.enabled && (t3.recordCanvas = true, t3.sampling = { canvas: this.canvasRecording.fps }, t3.dataURLOptions = { type: "image/webp", quality: this.canvasRecording.quality }), this.rrwebRecord) {
        this.mutationRateLimiter = null !== (e3 = this.mutationRateLimiter) && void 0 !== e3 ? e3 : new hr(this.rrwebRecord, { refillRate: this.instance.config.session_recording.__mutationRateLimiterRefillRate, bucketSize: this.instance.config.session_recording.__mutationRateLimiterBucketSize, onBlockedNode: (e4, t4) => {
          var i4 = "Too many mutations on node '".concat(e4, "'. Rate limiting. This could be due to SVG animations or something similar");
          Qr.info(i4, { node: t4 }), this.log(Xr + " " + i4, "warn");
        } });
        var n3 = this._gatherRRWebPlugins();
        this.stopRrweb = this.rrwebRecord(j2({ emit: (e4) => {
          this.onRRwebEmit(e4);
        }, plugins: n3 }, t3)), this._lastActivityTimestamp = Date.now(), this.isIdle = false, this._tryAddCustomEvent("$session_options", { sessionRecordingOptions: t3, activePlugins: n3.map((e4) => null == e4 ? void 0 : e4.name) }), this._tryAddCustomEvent("$posthog_config", { config: this.instance.config });
      } else Qr.error("onScriptLoaded was called but rrwebRecord is not available. This indicates something has gone wrong.");
    }
    _scheduleFullSnapshot() {
      if (this._fullSnapshotTimer && clearInterval(this._fullSnapshotTimer), !this.isIdle) {
        var e3 = this.fullSnapshotIntervalMillis;
        e3 && (this._fullSnapshotTimer = setInterval(() => {
          this._tryTakeFullSnapshot();
        }, e3));
      }
    }
    _gatherRRWebPlugins() {
      var e3, t3, i3, r3, s3 = [], n3 = null === (e3 = _2.__PosthogExtensions__) || void 0 === e3 || null === (t3 = e3.rrwebPlugins) || void 0 === t3 ? void 0 : t3.getRecordConsolePlugin;
      n3 && this.isConsoleLogCaptureEnabled && s3.push(n3());
      var o3 = null === (i3 = _2.__PosthogExtensions__) || void 0 === i3 || null === (r3 = i3.rrwebPlugins) || void 0 === r3 ? void 0 : r3.getRecordNetworkPlugin;
      this.networkPayloadCapture && I2(o3) && (!vt.includes(location.hostname) || this._forceAllowLocalhostNetworkCapture ? s3.push(o3(cr(this.instance.config, this.networkPayloadCapture))) : Qr.info("NetworkCapture not started because we are on localhost."));
      return s3;
    }
    onRRwebEmit(e3) {
      var t3;
      if (this._processQueuedEvents(), e3 && C2(e3)) {
        if (e3.type === Ii.Meta) {
          var i3 = this._maskUrl(e3.data.href);
          if (this._lastHref = i3, !i3) return;
          e3.data.href = i3;
        } else this._pageViewFallBack();
        if (this._checkUrlTriggerConditions(), "paused" !== this.status || function(e4) {
          return e4.type === Ii.Custom && "recording paused" === e4.data.tag;
        }(e3)) {
          e3.type === Ii.FullSnapshot && this._scheduleFullSnapshot(), e3.type === Ii.FullSnapshot && "trigger_pending" === this.triggerStatus && this.clearBuffer();
          var r3 = this.mutationRateLimiter ? this.mutationRateLimiter.throttleMutations(e3) : e3;
          if (r3) {
            var s3 = function(e4) {
              var t4 = e4;
              if (t4 && C2(t4) && 6 === t4.type && C2(t4.data) && "rrweb/console@1" === t4.data.plugin) {
                t4.data.payload.payload.length > 10 && (t4.data.payload.payload = t4.data.payload.payload.slice(0, 10), t4.data.payload.payload.push("...[truncated]"));
                for (var i4 = [], r4 = 0; r4 < t4.data.payload.payload.length; r4++) t4.data.payload.payload[r4] && t4.data.payload.payload[r4].length > 2e3 ? i4.push(t4.data.payload.payload[r4].slice(0, 2e3) + "...[truncated]") : i4.push(t4.data.payload.payload[r4]);
                return t4.data.payload.payload = i4, e4;
              }
              return e4;
            }(r3);
            if (this._updateWindowAndSessionIds(s3), !this.isIdle || rs(s3)) {
              if (rs(s3)) {
                var n3 = s3.data.payload;
                if (n3) {
                  var o3 = n3.lastActivityTimestamp, a3 = n3.threshold;
                  s3.timestamp = o3 + a3;
                }
              }
              var l3 = null === (t3 = this.instance.config.session_recording.compress_events) || void 0 === t3 || t3 ? function(e4) {
                if (ki(e4) < 1024) return e4;
                try {
                  if (e4.type === Ii.FullSnapshot) return j2(j2({}, e4), {}, { data: is(e4.data), cv: "2024-10" });
                  if (e4.type === Ii.IncrementalSnapshot && e4.data.source === Ci.Mutation) return j2(j2({}, e4), {}, { cv: "2024-10", data: j2(j2({}, e4.data), {}, { texts: is(e4.data.texts), attributes: is(e4.data.attributes), removes: is(e4.data.removes), adds: is(e4.data.adds) }) });
                  if (e4.type === Ii.IncrementalSnapshot && e4.data.source === Ci.StyleSheetRule) return j2(j2({}, e4), {}, { cv: "2024-10", data: j2(j2({}, e4.data), {}, { adds: is(e4.data.adds), removes: is(e4.data.removes) }) });
                } catch (e5) {
                  Qr.error("could not compress event - will use uncompressed event", e5);
                }
                return e4;
              }(s3) : s3, u3 = { $snapshot_bytes: ki(l3), $snapshot_data: l3, $session_id: this.sessionId, $window_id: this.windowId };
              "disabled" !== this.status ? this._captureSnapshotBuffered(u3) : this.clearBuffer();
            }
          }
        }
      }
    }
    _pageViewFallBack() {
      if (!this.instance.config.capture_pageview && t2) {
        var e3 = this._maskUrl(t2.location.href);
        this._lastHref !== e3 && (this._tryAddCustomEvent("$url_changed", { href: e3 }), this._lastHref = e3);
      }
    }
    _processQueuedEvents() {
      if (this.queuedRRWebEvents.length) {
        var e3 = [...this.queuedRRWebEvents];
        this.queuedRRWebEvents = [], e3.forEach((e4) => {
          Date.now() - e4.enqueuedAt <= 2e3 && this._tryRRWebMethod(e4);
        });
      }
    }
    _maskUrl(e3) {
      var t3 = this.instance.config.session_recording;
      if (t3.maskNetworkRequestFn) {
        var i3, r3 = { url: e3 };
        return null === (i3 = r3 = t3.maskNetworkRequestFn(r3)) || void 0 === i3 ? void 0 : i3.url;
      }
      return e3;
    }
    clearBuffer() {
      return this.buffer = { size: 0, data: [], sessionId: this.sessionId, windowId: this.windowId }, this.buffer;
    }
    _flushBuffer() {
      this.flushBufferTimer && (clearTimeout(this.flushBufferTimer), this.flushBufferTimer = void 0);
      var e3 = this.minimumDuration, t3 = this.sessionDuration, i3 = O2(t3) && t3 >= 0, r3 = O2(e3) && i3 && t3 < e3;
      if ("buffering" === this.status || "paused" === this.status || r3) return this.flushBufferTimer = setTimeout(() => {
        this._flushBuffer();
      }, 2e3), this.buffer;
      this.buffer.data.length > 0 && xi(this.buffer).forEach((e4) => {
        this._captureSnapshot({ $snapshot_bytes: e4.size, $snapshot_data: e4.data, $session_id: e4.sessionId, $window_id: e4.windowId, $lib: "web", $lib_version: p2.LIB_VERSION });
      });
      return this.clearBuffer();
    }
    _captureSnapshotBuffered(e3) {
      var t3, i3 = 2 + ((null === (t3 = this.buffer) || void 0 === t3 ? void 0 : t3.data.length) || 0);
      !this.isIdle && (this.buffer.size + e3.$snapshot_bytes + i3 > 943718.4 || this.buffer.sessionId !== this.sessionId) && (this.buffer = this._flushBuffer()), this.buffer.size += e3.$snapshot_bytes, this.buffer.data.push(e3.$snapshot_data), this.flushBufferTimer || this.isIdle || (this.flushBufferTimer = setTimeout(() => {
        this._flushBuffer();
      }, 2e3));
    }
    _captureSnapshot(e3) {
      this.instance.capture("$snapshot", e3, { _url: this.instance.requestRouter.endpointFor("api", this._endpoint), _noTruncate: true, _batchKey: "recordings", skip_client_rate_limiting: true });
    }
    _checkUrlTriggerConditions() {
      if (void 0 !== t2 && t2.location.href) {
        var e3 = t2.location.href, i3 = "paused" === this.status, r3 = ss(e3, this._urlBlocklist);
        r3 && !i3 ? this._pauseRecording() : !r3 && i3 && this._resumeRecording(), ss(e3, this._urlTriggers) && this._activateTrigger("url");
      }
    }
    _activateTrigger(e3) {
      var t3, i3;
      "trigger_pending" === this.triggerStatus && (null === (t3 = this.instance) || void 0 === t3 || null === (i3 = t3.persistence) || void 0 === i3 || i3.register({ ["url" === e3 ? Ee : ke]: this.sessionId }), this._flushBuffer(), this._reportStarted(e3 + "_trigger_matched"));
    }
    _pauseRecording() {
      "paused" !== this.status && (this._urlBlocked = true, clearInterval(this._fullSnapshotTimer), Qr.info("recording paused due to URL blocker"), this._tryAddCustomEvent("recording paused", { reason: "url blocker" }));
    }
    _resumeRecording() {
      "paused" === this.status && (this._urlBlocked = false, this._tryTakeFullSnapshot(), this._scheduleFullSnapshot(), this._tryAddCustomEvent("recording resumed", { reason: "left blocked url" }), Qr.info("recording resumed"));
    }
    _addEventTriggerListener() {
      0 !== this._eventTriggers.length && M2(this._removeEventTriggerCaptureHook) && (this._removeEventTriggerCaptureHook = this.instance.on("eventCaptured", (e3) => {
        try {
          this._eventTriggers.includes(e3.event) && this._activateTrigger("event");
        } catch (e4) {
          Qr.error("Could not activate event trigger", e4);
        }
      }));
    }
    overrideLinkedFlag() {
      this._linkedFlagSeen = true, this._tryTakeFullSnapshot(), this._reportStarted("linked_flag_overridden");
    }
    overrideSampling() {
      var e3;
      null === (e3 = this.instance.persistence) || void 0 === e3 || e3.register({ [Se]: true }), this._tryTakeFullSnapshot(), this._reportStarted("sampling_overridden");
    }
    overrideTrigger(e3) {
      this._activateTrigger(e3);
    }
    _reportStarted(e3, t3) {
      this.instance.register_for_session({ $session_recording_start_reason: e3 }), Qr.info(e3.replace("_", " "), t3), m2(["recording_initialized", "session_id_changed"], e3) || this._tryAddCustomEvent(e3, t3);
    }
  };
  var os = B2("[RemoteConfig]");
  var as = class {
    constructor(e3) {
      this.instance = e3;
    }
    get remoteConfig() {
      var e3, t3;
      return null === (e3 = _2._POSTHOG_REMOTE_CONFIG) || void 0 === e3 || null === (t3 = e3[this.instance.config.token]) || void 0 === t3 ? void 0 : t3.config;
    }
    _loadRemoteConfigJs(e3) {
      var t3, i3, r3;
      null !== (t3 = _2.__PosthogExtensions__) && void 0 !== t3 && t3.loadExternalDependency ? null === (i3 = _2.__PosthogExtensions__) || void 0 === i3 || null === (r3 = i3.loadExternalDependency) || void 0 === r3 || r3.call(i3, this.instance, "remote-config", () => e3(this.remoteConfig)) : (os.error("PostHog Extensions not found. Cannot load remote config."), e3());
    }
    _loadRemoteConfigJSON(e3) {
      this.instance._send_request({ method: "GET", url: this.instance.requestRouter.endpointFor("assets", "/array/".concat(this.instance.config.token, "/config")), callback: (t3) => {
        e3(t3.json);
      } });
    }
    load() {
      try {
        if (this.remoteConfig) return os.info("Using preloaded remote config", this.remoteConfig), void this.onRemoteConfig(this.remoteConfig);
        if (this.instance.config.advanced_disable_decide) return void os.warn("Remote config is disabled. Falling back to local config.");
        this._loadRemoteConfigJs((e3) => {
          if (!e3) return os.info("No config found after loading remote JS config. Falling back to JSON."), void this._loadRemoteConfigJSON((e4) => {
            this.onRemoteConfig(e4);
          });
          this.onRemoteConfig(e3);
        });
      } catch (e3) {
        os.error("Error loading remote config", e3);
      }
    }
    onRemoteConfig(e3) {
      e3 ? this.instance.config.__preview_remote_config ? (this.instance._onRemoteConfig(e3), false !== e3.hasFeatureFlags && this.instance.featureFlags.ensureFlagsLoaded()) : os.info("__preview_remote_config is disabled. Logging config instead", e3) : os.error("Failed to fetch remote config from PostHog.");
    }
  };
  var ls;
  var us = null != t2 && t2.location ? wt(t2.location.hash, "__posthog") || wt(location.hash, "state") : null;
  var cs = "_postHogToolbarParams";
  var ds = B2("[Toolbar]");
  !function(e3) {
    e3[e3.UNINITIALIZED = 0] = "UNINITIALIZED", e3[e3.LOADING = 1] = "LOADING", e3[e3.LOADED = 2] = "LOADED";
  }(ls || (ls = {}));
  var hs = class {
    constructor(e3) {
      this.instance = e3;
    }
    setToolbarState(e3) {
      _2.ph_toolbar_state = e3;
    }
    getToolbarState() {
      var e3;
      return null !== (e3 = _2.ph_toolbar_state) && void 0 !== e3 ? e3 : ls.UNINITIALIZED;
    }
    maybeLoadToolbar() {
      var e3, i3, r3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : void 0, s3 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : void 0, n3 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : void 0;
      if (!t2 || !a2) return false;
      r3 = null !== (e3 = r3) && void 0 !== e3 ? e3 : t2.location, n3 = null !== (i3 = n3) && void 0 !== i3 ? i3 : t2.history;
      try {
        if (!s3) {
          try {
            t2.localStorage.setItem("test", "test"), t2.localStorage.removeItem("test");
          } catch (e4) {
            return false;
          }
          s3 = null == t2 ? void 0 : t2.localStorage;
        }
        var o3, l3 = us || wt(r3.hash, "__posthog") || wt(r3.hash, "state"), u3 = l3 ? Z2(() => JSON.parse(atob(decodeURIComponent(l3)))) || Z2(() => JSON.parse(decodeURIComponent(l3))) : null;
        return u3 && "ph_authorize" === u3.action ? ((o3 = u3).source = "url", o3 && Object.keys(o3).length > 0 && (u3.desiredHash ? r3.hash = u3.desiredHash : n3 ? n3.replaceState(n3.state, "", r3.pathname + r3.search) : r3.hash = "")) : ((o3 = JSON.parse(s3.getItem(cs) || "{}")).source = "localstorage", delete o3.userIntent), !(!o3.token || this.instance.config.token !== o3.token) && (this.loadToolbar(o3), true);
      } catch (e4) {
        return false;
      }
    }
    _callLoadToolbar(e3) {
      var t3 = _2.ph_load_toolbar || _2.ph_load_editor;
      !M2(t3) && I2(t3) ? t3(e3, this.instance) : ds.warn("No toolbar load function found");
    }
    loadToolbar(e3) {
      var i3 = !(null == a2 || !a2.getElementById(qe));
      if (!t2 || i3) return false;
      var r3 = "custom" === this.instance.requestRouter.region && this.instance.config.advanced_disable_toolbar_metrics, s3 = j2(j2({ token: this.instance.config.token }, e3), {}, { apiURL: this.instance.requestRouter.endpointFor("ui") }, r3 ? { instrument: false } : {});
      if (t2.localStorage.setItem(cs, JSON.stringify(j2(j2({}, s3), {}, { source: void 0 }))), this.getToolbarState() === ls.LOADED) this._callLoadToolbar(s3);
      else if (this.getToolbarState() === ls.UNINITIALIZED) {
        var n3, o3;
        this.setToolbarState(ls.LOADING), null === (n3 = _2.__PosthogExtensions__) || void 0 === n3 || null === (o3 = n3.loadExternalDependency) || void 0 === o3 || o3.call(n3, this.instance, "toolbar", (e4) => {
          if (e4) return ds.error("[Toolbar] Failed to load", e4), void this.setToolbarState(ls.UNINITIALIZED);
          this.setToolbarState(ls.LOADED), this._callLoadToolbar(s3);
        }), re(t2, "turbolinks:load", () => {
          this.setToolbarState(ls.UNINITIALIZED), this.loadToolbar(s3);
        });
      }
      return true;
    }
    _loadEditor(e3) {
      return this.loadToolbar(e3);
    }
    maybeLoadEditor() {
      var e3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : void 0, t3 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : void 0, i3 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : void 0;
      return this.maybeLoadToolbar(e3, t3, i3);
    }
  };
  var _s = class {
    constructor(e3) {
      W2(this, "isPaused", true), W2(this, "queue", []), W2(this, "flushTimeoutMs", 3e3), this.sendRequest = e3;
    }
    enqueue(e3) {
      this.queue.push(e3), this.flushTimeout || this.setFlushTimeout();
    }
    unload() {
      this.clearFlushTimeout();
      var e3 = this.queue.length > 0 ? this.formatQueue() : {}, t3 = Object.values(e3), i3 = [...t3.filter((e4) => 0 === e4.url.indexOf("/e")), ...t3.filter((e4) => 0 !== e4.url.indexOf("/e"))];
      i3.map((e4) => {
        this.sendRequest(j2(j2({}, e4), {}, { transport: "sendBeacon" }));
      });
    }
    enable() {
      this.isPaused = false, this.setFlushTimeout();
    }
    setFlushTimeout() {
      var e3 = this;
      this.isPaused || (this.flushTimeout = setTimeout(() => {
        if (this.clearFlushTimeout(), this.queue.length > 0) {
          var t3 = this.formatQueue(), i3 = function(i4) {
            var r4 = t3[i4], s3 = (/* @__PURE__ */ new Date()).getTime();
            r4.data && x2(r4.data) && Y2(r4.data, (e4) => {
              e4.offset = Math.abs(e4.timestamp - s3), delete e4.timestamp;
            }), e3.sendRequest(r4);
          };
          for (var r3 in t3) i3(r3);
        }
      }, this.flushTimeoutMs));
    }
    clearFlushTimeout() {
      clearTimeout(this.flushTimeout), this.flushTimeout = void 0;
    }
    formatQueue() {
      var e3 = {};
      return Y2(this.queue, (t3) => {
        var i3, r3 = t3, s3 = (r3 ? r3.batchKey : null) || r3.url;
        R2(e3[s3]) && (e3[s3] = j2(j2({}, r3), {}, { data: [] })), null === (i3 = e3[s3].data) || void 0 === i3 || i3.push(r3.data);
      }), this.queue = [], e3;
    }
  };
  var ps = function(e3) {
    var t3, i3, r3, s3, n3 = "";
    for (t3 = i3 = 0, r3 = (e3 = (e3 + "").replace(/\r\n/g, "\n").replace(/\r/g, "\n")).length, s3 = 0; s3 < r3; s3++) {
      var o3 = e3.charCodeAt(s3), a3 = null;
      o3 < 128 ? i3++ : a3 = o3 > 127 && o3 < 2048 ? String.fromCharCode(o3 >> 6 | 192, 63 & o3 | 128) : String.fromCharCode(o3 >> 12 | 224, o3 >> 6 & 63 | 128, 63 & o3 | 128), $2(a3) || (i3 > t3 && (n3 += e3.substring(t3, i3)), n3 += a3, t3 = i3 = s3 + 1);
    }
    return i3 > t3 && (n3 += e3.substring(t3, e3.length)), n3;
  };
  var vs = !!c2 || !!u2;
  var gs = "text/plain";
  var fs = (e3, t3) => {
    var [i3, r3] = e3.split("?"), s3 = j2({}, t3);
    null == r3 || r3.split("&").forEach((e4) => {
      var [t4] = e4.split("=");
      delete s3[t4];
    });
    var n3 = mt(s3);
    return n3 = n3 ? (r3 ? r3 + "&" : "") + n3 : r3, "".concat(i3, "?").concat(n3);
  };
  var ms = (e3, t3) => JSON.stringify(e3, (e4, t4) => "bigint" == typeof t4 ? t4.toString() : t4, t3);
  var bs = (t3) => {
    var { data: i3, compression: r3 } = t3;
    if (i3) {
      if (r3 === e2.GZipJS) {
        var s3 = Yr(Kr(ms(i3)), { mtime: 0 }), n3 = new Blob([s3], { type: gs });
        return { contentType: gs, body: n3, estimatedSize: n3.size };
      }
      if (r3 === e2.Base64) {
        var o3 = function(e3) {
          var t4, i4, r4, s4, n4, o4 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", a4 = 0, l4 = 0, u3 = "", c3 = [];
          if (!e3) return e3;
          e3 = ps(e3);
          do {
            t4 = (n4 = e3.charCodeAt(a4++) << 16 | e3.charCodeAt(a4++) << 8 | e3.charCodeAt(a4++)) >> 18 & 63, i4 = n4 >> 12 & 63, r4 = n4 >> 6 & 63, s4 = 63 & n4, c3[l4++] = o4.charAt(t4) + o4.charAt(i4) + o4.charAt(r4) + o4.charAt(s4);
          } while (a4 < e3.length);
          switch (u3 = c3.join(""), e3.length % 3) {
            case 1:
              u3 = u3.slice(0, -2) + "==";
              break;
            case 2:
              u3 = u3.slice(0, -1) + "=";
          }
          return u3;
        }(ms(i3)), a3 = ((e3) => "data=" + encodeURIComponent("string" == typeof e3 ? e3 : ms(e3)))(o3);
        return { contentType: "application/x-www-form-urlencoded", body: a3, estimatedSize: new Blob([a3]).size };
      }
      var l3 = ms(i3);
      return { contentType: "application/json", body: l3, estimatedSize: new Blob([l3]).size };
    }
  };
  var ys = [];
  u2 && ys.push({ transport: "fetch", method: (e3) => {
    var t3, i3, { contentType: r3, body: s3, estimatedSize: n3 } = null !== (t3 = bs(e3)) && void 0 !== t3 ? t3 : {}, o3 = new Headers();
    Y2(e3.headers, function(e4, t4) {
      o3.append(t4, e4);
    }), r3 && o3.append("Content-Type", r3);
    var a3 = e3.url, l3 = null;
    if (d2) {
      var c3 = new d2();
      l3 = { signal: c3.signal, timeout: setTimeout(() => c3.abort(), e3.timeout) };
    }
    u2(a3, j2({ method: (null == e3 ? void 0 : e3.method) || "GET", headers: o3, keepalive: "POST" === e3.method && (n3 || 0) < 52428.8, body: s3, signal: null === (i3 = l3) || void 0 === i3 ? void 0 : i3.signal }, e3.fetchOptions)).then((t4) => t4.text().then((i4) => {
      var r4, s4 = { statusCode: t4.status, text: i4 };
      if (200 === t4.status) try {
        s4.json = JSON.parse(i4);
      } catch (e4) {
        q2.error(e4);
      }
      null === (r4 = e3.callback) || void 0 === r4 || r4.call(e3, s4);
    })).catch((t4) => {
      var i4;
      q2.error(t4), null === (i4 = e3.callback) || void 0 === i4 || i4.call(e3, { statusCode: 0, text: t4 });
    }).finally(() => l3 ? clearTimeout(l3.timeout) : null);
  } }), c2 && ys.push({ transport: "XHR", method: (e3) => {
    var t3, i3 = new c2();
    i3.open(e3.method || "GET", e3.url, true);
    var { contentType: r3, body: s3 } = null !== (t3 = bs(e3)) && void 0 !== t3 ? t3 : {};
    Y2(e3.headers, function(e4, t4) {
      i3.setRequestHeader(t4, e4);
    }), r3 && i3.setRequestHeader("Content-Type", r3), e3.timeout && (i3.timeout = e3.timeout), i3.withCredentials = true, i3.onreadystatechange = () => {
      if (4 === i3.readyState) {
        var t4, r4 = { statusCode: i3.status, text: i3.responseText };
        if (200 === i3.status) try {
          r4.json = JSON.parse(i3.responseText);
        } catch (e4) {
        }
        null === (t4 = e3.callback) || void 0 === t4 || t4.call(e3, r4);
      }
    }, i3.send(s3);
  } }), null != o2 && o2.sendBeacon && ys.push({ transport: "sendBeacon", method: (e3) => {
    var t3 = fs(e3.url, { beacon: "1" });
    try {
      var i3, { contentType: r3, body: s3 } = null !== (i3 = bs(e3)) && void 0 !== i3 ? i3 : {}, n3 = "string" == typeof s3 ? new Blob([s3], { type: r3 }) : s3;
      o2.sendBeacon(t3, n3);
    } catch (e4) {
    }
  } });
  var ws = ["retriesPerformedSoFar"];
  var Ss = class {
    constructor(e3) {
      W2(this, "isPolling", false), W2(this, "pollIntervalMs", 3e3), W2(this, "queue", []), this.instance = e3, this.queue = [], this.areWeOnline = true, !R2(t2) && "onLine" in t2.navigator && (this.areWeOnline = t2.navigator.onLine, t2.addEventListener("online", () => {
        this.areWeOnline = true, this.flush();
      }), t2.addEventListener("offline", () => {
        this.areWeOnline = false;
      }));
    }
    retriableRequest(e3) {
      var { retriesPerformedSoFar: t3 } = e3, i3 = V2(e3, ws);
      O2(t3) && t3 > 0 && (i3.url = fs(i3.url, { retry_count: t3 })), this.instance._send_request(j2(j2({}, i3), {}, { callback: (e4) => {
        var r3;
        200 !== e4.statusCode && (e4.statusCode < 400 || e4.statusCode >= 500) && (null != t3 ? t3 : 0) < 10 ? this.enqueue(j2({ retriesPerformedSoFar: t3 }, i3)) : null === (r3 = i3.callback) || void 0 === r3 || r3.call(i3, e4);
      } }));
    }
    enqueue(e3) {
      var t3 = e3.retriesPerformedSoFar || 0;
      e3.retriesPerformedSoFar = t3 + 1;
      var i3 = function(e4) {
        var t4 = 3e3 * Math.pow(2, e4), i4 = t4 / 2, r4 = Math.min(18e5, t4), s4 = (Math.random() - 0.5) * (r4 - i4);
        return Math.ceil(r4 + s4);
      }(t3), r3 = Date.now() + i3;
      this.queue.push({ retryAt: r3, requestOptions: e3 });
      var s3 = "Enqueued failed request for retry in ".concat(i3);
      navigator.onLine || (s3 += " (Browser is offline)"), q2.warn(s3), this.isPolling || (this.isPolling = true, this.poll());
    }
    poll() {
      this.poller && clearTimeout(this.poller), this.poller = setTimeout(() => {
        this.areWeOnline && this.queue.length > 0 && this.flush(), this.poll();
      }, this.pollIntervalMs);
    }
    flush() {
      var e3 = Date.now(), t3 = [], i3 = this.queue.filter((i4) => i4.retryAt < e3 || (t3.push(i4), false));
      if (this.queue = t3, i3.length > 0) for (var { requestOptions: r3 } of i3) this.retriableRequest(r3);
    }
    unload() {
      for (var { requestOptions: e3 } of (this.poller && (clearTimeout(this.poller), this.poller = void 0), this.queue)) try {
        this.instance._send_request(j2(j2({}, e3), {}, { transport: "sendBeacon" }));
      } catch (e4) {
        q2.error(e4);
      }
      this.queue = [];
    }
  };
  var Es;
  var ks = B2("[SessionId]");
  var xs = class {
    constructor(e3, t3, i3) {
      var r3;
      if (W2(this, "_sessionIdChangedHandlers", []), !e3.persistence) throw new Error("SessionIdManager requires a PostHogPersistence instance");
      if (e3.config.__preview_experimental_cookieless_mode) throw new Error("SessionIdManager cannot be used with __preview_experimental_cookieless_mode");
      this.config = e3.config, this.persistence = e3.persistence, this._windowId = void 0, this._sessionId = void 0, this._sessionStartTimestamp = null, this._sessionActivityTimestamp = null, this._sessionIdGenerator = t3 || et, this._windowIdGenerator = i3 || et;
      var s3 = this.config.persistence_name || this.config.token, n3 = this.config.session_idle_timeout_seconds || 1800;
      if (this._sessionTimeoutMs = 1e3 * dr(n3, 60, 36e3, "session_idle_timeout_seconds", 1800), e3.register({ $configured_session_timeout_ms: this._sessionTimeoutMs }), this.resetIdleTimer(), this._window_id_storage_key = "ph_" + s3 + "_window_id", this._primary_window_exists_storage_key = "ph_" + s3 + "_primary_window_exists", this._canUseSessionStorage()) {
        var o3 = pt.parse(this._window_id_storage_key), a3 = pt.parse(this._primary_window_exists_storage_key);
        o3 && !a3 ? this._windowId = o3 : pt.remove(this._window_id_storage_key), pt.set(this._primary_window_exists_storage_key, true);
      }
      if (null !== (r3 = this.config.bootstrap) && void 0 !== r3 && r3.sessionID) try {
        var l3 = ((e4) => {
          var t4 = e4.replace(/-/g, "");
          if (32 !== t4.length) throw new Error("Not a valid UUID");
          if ("7" !== t4[12]) throw new Error("Not a UUIDv7");
          return parseInt(t4.substring(0, 12), 16);
        })(this.config.bootstrap.sessionID);
        this._setSessionId(this.config.bootstrap.sessionID, (/* @__PURE__ */ new Date()).getTime(), l3);
      } catch (e4) {
        ks.error("Invalid sessionID in bootstrap", e4);
      }
      this._listenToReloadWindow();
    }
    get sessionTimeoutMs() {
      return this._sessionTimeoutMs;
    }
    onSessionId(e3) {
      return R2(this._sessionIdChangedHandlers) && (this._sessionIdChangedHandlers = []), this._sessionIdChangedHandlers.push(e3), this._sessionId && e3(this._sessionId, this._windowId), () => {
        this._sessionIdChangedHandlers = this._sessionIdChangedHandlers.filter((t3) => t3 !== e3);
      };
    }
    _canUseSessionStorage() {
      return "memory" !== this.config.persistence && !this.persistence.disabled && pt.is_supported();
    }
    _setWindowId(e3) {
      e3 !== this._windowId && (this._windowId = e3, this._canUseSessionStorage() && pt.set(this._window_id_storage_key, e3));
    }
    _getWindowId() {
      return this._windowId ? this._windowId : this._canUseSessionStorage() ? pt.parse(this._window_id_storage_key) : null;
    }
    _setSessionId(e3, t3, i3) {
      e3 === this._sessionId && t3 === this._sessionActivityTimestamp && i3 === this._sessionStartTimestamp || (this._sessionStartTimestamp = i3, this._sessionActivityTimestamp = t3, this._sessionId = e3, this.persistence.register({ [we]: [t3, e3, i3] }));
    }
    _getSessionId() {
      if (this._sessionId && this._sessionActivityTimestamp && this._sessionStartTimestamp) return [this._sessionActivityTimestamp, this._sessionId, this._sessionStartTimestamp];
      var e3 = this.persistence.props[we];
      return x2(e3) && 2 === e3.length && e3.push(e3[0]), e3 || [0, null, 0];
    }
    resetSessionId() {
      this._setSessionId(null, null, null);
    }
    _listenToReloadWindow() {
      null == t2 || t2.addEventListener("beforeunload", () => {
        this._canUseSessionStorage() && pt.remove(this._primary_window_exists_storage_key);
      });
    }
    checkAndGetSessionAndWindowId() {
      var e3 = arguments.length > 0 && void 0 !== arguments[0] && arguments[0], t3 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null;
      if (this.config.__preview_experimental_cookieless_mode) throw new Error("checkAndGetSessionAndWindowId should not be called in __preview_experimental_cookieless_mode");
      var i3 = t3 || (/* @__PURE__ */ new Date()).getTime(), [r3, s3, n3] = this._getSessionId(), o3 = this._getWindowId(), a3 = O2(n3) && n3 > 0 && Math.abs(i3 - n3) > 864e5, l3 = false, u3 = !s3, c3 = !e3 && Math.abs(i3 - r3) > this.sessionTimeoutMs;
      u3 || c3 || a3 ? (s3 = this._sessionIdGenerator(), o3 = this._windowIdGenerator(), ks.info("new session ID generated", { sessionId: s3, windowId: o3, changeReason: { noSessionId: u3, activityTimeout: c3, sessionPastMaximumLength: a3 } }), n3 = i3, l3 = true) : o3 || (o3 = this._windowIdGenerator(), l3 = true);
      var d3 = 0 === r3 || !e3 || a3 ? i3 : r3, h3 = 0 === n3 ? (/* @__PURE__ */ new Date()).getTime() : n3;
      return this._setWindowId(o3), this._setSessionId(s3, d3, h3), e3 || this.resetIdleTimer(), l3 && this._sessionIdChangedHandlers.forEach((e4) => e4(s3, o3, l3 ? { noSessionId: u3, activityTimeout: c3, sessionPastMaximumLength: a3 } : void 0)), { sessionId: s3, windowId: o3, sessionStartTimestamp: h3, changeReason: l3 ? { noSessionId: u3, activityTimeout: c3, sessionPastMaximumLength: a3 } : void 0, lastActivityTimestamp: r3 };
    }
    resetIdleTimer() {
      clearTimeout(this._enforceIdleTimeout), this._enforceIdleTimeout = setTimeout(() => {
        this.resetSessionId();
      }, 1.1 * this.sessionTimeoutMs);
    }
  };
  !function(e3) {
    e3.US = "us", e3.EU = "eu", e3.CUSTOM = "custom";
  }(Es || (Es = {}));
  var Is = "i.posthog.com";
  var Cs = class {
    constructor(e3) {
      W2(this, "_regionCache", {}), this.instance = e3;
    }
    get apiHost() {
      var e3 = this.instance.config.api_host.trim().replace(/\/$/, "");
      return "https://app.posthog.com" === e3 ? "https://us.i.posthog.com" : e3;
    }
    get uiHost() {
      var e3, t3 = null === (e3 = this.instance.config.ui_host) || void 0 === e3 ? void 0 : e3.replace(/\/$/, "");
      return t3 || (t3 = this.apiHost.replace(".".concat(Is), ".posthog.com")), "https://app.posthog.com" === t3 ? "https://us.posthog.com" : t3;
    }
    get region() {
      return this._regionCache[this.apiHost] || (/https:\/\/(app|us|us-assets)(\.i)?\.posthog\.com/i.test(this.apiHost) ? this._regionCache[this.apiHost] = Es.US : /https:\/\/(eu|eu-assets)(\.i)?\.posthog\.com/i.test(this.apiHost) ? this._regionCache[this.apiHost] = Es.EU : this._regionCache[this.apiHost] = Es.CUSTOM), this._regionCache[this.apiHost];
    }
    endpointFor(e3) {
      var t3 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "";
      if (t3 && (t3 = "/" === t3[0] ? t3 : "/".concat(t3)), "ui" === e3) return this.uiHost + t3;
      if (this.region === Es.CUSTOM) return this.apiHost + t3;
      var i3 = Is + t3;
      switch (e3) {
        case "assets":
          return "https://".concat(this.region, "-assets.").concat(i3);
        case "api":
          return "https://".concat(this.region, ".").concat(i3);
      }
    }
  };
  var Ps = "posthog-js";
  function Rs(e3) {
    var { organization: t3, projectId: i3, prefix: r3, severityAllowList: s3 = ["error"] } = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
    return (n3) => {
      var o3, a3, l3, u3, c3;
      if (!("*" === s3 || s3.includes(n3.level)) || !e3.__loaded) return n3;
      n3.tags || (n3.tags = {});
      var d3 = e3.requestRouter.endpointFor("ui", "/project/".concat(e3.config.token, "/person/").concat(e3.get_distinct_id()));
      n3.tags["PostHog Person URL"] = d3, e3.sessionRecordingStarted() && (n3.tags["PostHog Recording URL"] = e3.get_session_replay_url({ withTimestamp: true }));
      var h3 = (null === (o3 = n3.exception) || void 0 === o3 ? void 0 : o3.values) || [];
      h3.forEach((e4) => {
        e4.stacktrace && (e4.stacktrace.type = "raw", e4.stacktrace.frames.forEach((e5) => {
          e5.platform = "web:javascript";
        }));
      });
      var _3 = { $exception_message: (null === (a3 = h3[0]) || void 0 === a3 ? void 0 : a3.value) || n3.message, $exception_type: null === (l3 = h3[0]) || void 0 === l3 ? void 0 : l3.type, $exception_personURL: d3, $exception_level: n3.level, $exception_list: h3, $sentry_event_id: n3.event_id, $sentry_exception: n3.exception, $sentry_exception_message: (null === (u3 = h3[0]) || void 0 === u3 ? void 0 : u3.value) || n3.message, $sentry_exception_type: null === (c3 = h3[0]) || void 0 === c3 ? void 0 : c3.type, $sentry_tags: n3.tags };
      return t3 && i3 && (_3.$sentry_url = (r3 || "https://sentry.io/organizations/") + t3 + "/issues/?project=" + i3 + "&query=" + n3.event_id), e3.exceptions.sendExceptionEvent(_3), n3;
    };
  }
  var Fs = class {
    constructor(e3, t3, i3, r3, s3) {
      this.name = Ps, this.setupOnce = function(n3) {
        n3(Rs(e3, { organization: t3, projectId: i3, prefix: r3, severityAllowList: s3 }));
      };
    }
  };
  var Ts = B2("[SegmentIntegration]");
  function $s(e3, t3) {
    var i3 = e3.config.segment;
    if (!i3) return t3();
    !function(e4, t4) {
      var i4 = e4.config.segment;
      if (!i4) return t4();
      var r3 = (i5) => {
        var r4 = () => i5.anonymousId() || et();
        e4.config.get_device_id = r4, i5.id() && (e4.register({ distinct_id: i5.id(), $device_id: r4() }), e4.persistence.set_property($e, "identified")), t4();
      }, s3 = i4.user();
      "then" in s3 && I2(s3.then) ? s3.then((e5) => r3(e5)) : r3(s3);
    }(e3, () => {
      i3.register(((e4) => {
        Promise && Promise.resolve || Ts.warn("This browser does not have Promise support, and can not use the segment integration");
        var t4 = (t5, i4) => {
          var r3;
          if (!i4) return t5;
          t5.event.userId || t5.event.anonymousId === e4.get_distinct_id() || (Ts.info("No userId set, resetting PostHog"), e4.reset()), t5.event.userId && t5.event.userId !== e4.get_distinct_id() && (Ts.info("UserId set, identifying with PostHog"), e4.identify(t5.event.userId));
          var s3 = e4._calculate_event_properties(i4, null !== (r3 = t5.event.properties) && void 0 !== r3 ? r3 : {}, /* @__PURE__ */ new Date());
          return t5.event.properties = Object.assign({}, s3, t5.event.properties), t5;
        };
        return { name: "PostHog JS", type: "enrichment", version: "1.0.0", isLoaded: () => true, load: () => Promise.resolve(), track: (e5) => t4(e5, e5.event.event), page: (e5) => t4(e5, "$pageview"), identify: (e5) => t4(e5, "$identify"), screen: (e5) => t4(e5, "$screen") };
      })(e3)).then(() => {
        t3();
      });
    });
  }
  var Ms = class {
    constructor(e3) {
      this._instance = e3;
    }
    doPageView(e3, i3) {
      var r3, s3 = this._previousPageViewProperties(e3, i3);
      return this._currentPageview = { pathname: null !== (r3 = null == t2 ? void 0 : t2.location.pathname) && void 0 !== r3 ? r3 : "", pageViewId: i3, timestamp: e3 }, this._instance.scrollManager.resetContext(), s3;
    }
    doPageLeave(e3) {
      var t3;
      return this._previousPageViewProperties(e3, null === (t3 = this._currentPageview) || void 0 === t3 ? void 0 : t3.pageViewId);
    }
    doEvent() {
      var e3;
      return { $pageview_id: null === (e3 = this._currentPageview) || void 0 === e3 ? void 0 : e3.pageViewId };
    }
    _previousPageViewProperties(e3, t3) {
      var i3 = this._currentPageview;
      if (!i3) return { $pageview_id: t3 };
      var r3 = { $pageview_id: t3, $prev_pageview_id: i3.pageViewId }, s3 = this._instance.scrollManager.getContext();
      if (s3 && !this._instance.config.disable_scroll_properties) {
        var { maxScrollHeight: n3, lastScrollY: o3, maxScrollY: a3, maxContentHeight: l3, lastContentY: u3, maxContentY: c3 } = s3;
        if (!(R2(n3) || R2(o3) || R2(a3) || R2(l3) || R2(u3) || R2(c3))) {
          n3 = Math.ceil(n3), o3 = Math.ceil(o3), a3 = Math.ceil(a3), l3 = Math.ceil(l3), u3 = Math.ceil(u3), c3 = Math.ceil(c3);
          var d3 = n3 <= 1 ? 1 : dr(o3 / n3, 0, 1), h3 = n3 <= 1 ? 1 : dr(a3 / n3, 0, 1), _3 = l3 <= 1 ? 1 : dr(u3 / l3, 0, 1), p3 = l3 <= 1 ? 1 : dr(c3 / l3, 0, 1);
          r3 = K2(r3, { $prev_pageview_last_scroll: o3, $prev_pageview_last_scroll_percentage: d3, $prev_pageview_max_scroll: a3, $prev_pageview_max_scroll_percentage: h3, $prev_pageview_last_content: u3, $prev_pageview_last_content_percentage: _3, $prev_pageview_max_content: c3, $prev_pageview_max_content_percentage: p3 });
        }
      }
      return i3.pathname && (r3.$prev_pageview_pathname = i3.pathname), i3.timestamp && (r3.$prev_pageview_duration = (e3.getTime() - i3.timestamp.getTime()) / 1e3), r3;
    }
  };
  var Os;
  var Ls;
  var As;
  var Ds;
  var Ns;
  var qs;
  var Bs;
  var Hs;
  var Us = {};
  var zs = [];
  var js = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
  var Ws = Array.isArray;
  function Vs(e3, t3) {
    for (var i3 in t3) e3[i3] = t3[i3];
    return e3;
  }
  function Gs(e3) {
    var t3 = e3.parentNode;
    t3 && t3.removeChild(e3);
  }
  function Js(e3, t3, i3, r3, s3) {
    var n3 = { type: e3, props: t3, key: i3, ref: r3, __k: null, __: null, __b: 0, __e: null, __d: void 0, __c: null, constructor: void 0, __v: null == s3 ? ++As : s3, __i: -1, __u: 0 };
    return null == s3 && null != Ls.vnode && Ls.vnode(n3), n3;
  }
  function Ys(e3) {
    return e3.children;
  }
  function Ks(e3, t3) {
    this.props = e3, this.context = t3;
  }
  function Xs(e3, t3) {
    if (null == t3) return e3.__ ? Xs(e3.__, e3.__i + 1) : null;
    for (var i3; t3 < e3.__k.length; t3++) if (null != (i3 = e3.__k[t3]) && null != i3.__e) return i3.__e;
    return "function" == typeof e3.type ? Xs(e3) : null;
  }
  function Qs(e3) {
    var t3, i3;
    if (null != (e3 = e3.__) && null != e3.__c) {
      for (e3.__e = e3.__c.base = null, t3 = 0; t3 < e3.__k.length; t3++) if (null != (i3 = e3.__k[t3]) && null != i3.__e) {
        e3.__e = e3.__c.base = i3.__e;
        break;
      }
      return Qs(e3);
    }
  }
  function Zs(e3) {
    (!e3.__d && (e3.__d = true) && Ds.push(e3) && !en.__r++ || Ns !== Ls.debounceRendering) && ((Ns = Ls.debounceRendering) || qs)(en);
  }
  function en() {
    var e3, t3, i3, r3, s3, n3, o3, a3, l3;
    for (Ds.sort(Bs); e3 = Ds.shift(); ) e3.__d && (t3 = Ds.length, r3 = void 0, n3 = (s3 = (i3 = e3).__v).__e, a3 = [], l3 = [], (o3 = i3.__P) && ((r3 = Vs({}, s3)).__v = s3.__v + 1, Ls.vnode && Ls.vnode(r3), cn(o3, r3, s3, i3.__n, void 0 !== o3.ownerSVGElement, 32 & s3.__u ? [n3] : null, a3, null == n3 ? Xs(s3) : n3, !!(32 & s3.__u), l3), r3.__.__k[r3.__i] = r3, dn(a3, r3, l3), r3.__e != n3 && Qs(r3)), Ds.length > t3 && Ds.sort(Bs));
    en.__r = 0;
  }
  function tn(e3, t3, i3, r3, s3, n3, o3, a3, l3, u3, c3) {
    var d3, h3, _3, p3, v3, g3 = r3 && r3.__k || zs, f2 = t3.length;
    for (i3.__d = l3, rn(i3, t3, g3), l3 = i3.__d, d3 = 0; d3 < f2; d3++) null != (_3 = i3.__k[d3]) && "boolean" != typeof _3 && "function" != typeof _3 && (h3 = -1 === _3.__i ? Us : g3[_3.__i] || Us, _3.__i = d3, cn(e3, _3, h3, s3, n3, o3, a3, l3, u3, c3), p3 = _3.__e, _3.ref && h3.ref != _3.ref && (h3.ref && _n(h3.ref, null, _3), c3.push(_3.ref, _3.__c || p3, _3)), null == v3 && null != p3 && (v3 = p3), 65536 & _3.__u || h3.__k === _3.__k ? l3 = sn(_3, l3, e3) : "function" == typeof _3.type && void 0 !== _3.__d ? l3 = _3.__d : p3 && (l3 = p3.nextSibling), _3.__d = void 0, _3.__u &= -196609);
    i3.__d = l3, i3.__e = v3;
  }
  function rn(e3, t3, i3) {
    var r3, s3, n3, o3, a3, l3 = t3.length, u3 = i3.length, c3 = u3, d3 = 0;
    for (e3.__k = [], r3 = 0; r3 < l3; r3++) null != (s3 = e3.__k[r3] = null == (s3 = t3[r3]) || "boolean" == typeof s3 || "function" == typeof s3 ? null : "string" == typeof s3 || "number" == typeof s3 || "bigint" == typeof s3 || s3.constructor == String ? Js(null, s3, null, null, s3) : Ws(s3) ? Js(Ys, { children: s3 }, null, null, null) : void 0 === s3.constructor && s3.__b > 0 ? Js(s3.type, s3.props, s3.key, s3.ref ? s3.ref : null, s3.__v) : s3) ? (s3.__ = e3, s3.__b = e3.__b + 1, a3 = nn(s3, i3, o3 = r3 + d3, c3), s3.__i = a3, n3 = null, -1 !== a3 && (c3--, (n3 = i3[a3]) && (n3.__u |= 131072)), null == n3 || null === n3.__v ? (-1 == a3 && d3--, "function" != typeof s3.type && (s3.__u |= 65536)) : a3 !== o3 && (a3 === o3 + 1 ? d3++ : a3 > o3 ? c3 > l3 - o3 ? d3 += a3 - o3 : d3-- : d3 = a3 < o3 && a3 == o3 - 1 ? a3 - o3 : 0, a3 !== r3 + d3 && (s3.__u |= 65536))) : (n3 = i3[r3]) && null == n3.key && n3.__e && (n3.__e == e3.__d && (e3.__d = Xs(n3)), pn(n3, n3, false), i3[r3] = null, c3--);
    if (c3) for (r3 = 0; r3 < u3; r3++) null != (n3 = i3[r3]) && 0 == (131072 & n3.__u) && (n3.__e == e3.__d && (e3.__d = Xs(n3)), pn(n3, n3));
  }
  function sn(e3, t3, i3) {
    var r3, s3;
    if ("function" == typeof e3.type) {
      for (r3 = e3.__k, s3 = 0; r3 && s3 < r3.length; s3++) r3[s3] && (r3[s3].__ = e3, t3 = sn(r3[s3], t3, i3));
      return t3;
    }
    return e3.__e != t3 && (i3.insertBefore(e3.__e, t3 || null), t3 = e3.__e), t3 && t3.nextSibling;
  }
  function nn(e3, t3, i3, r3) {
    var s3 = e3.key, n3 = e3.type, o3 = i3 - 1, a3 = i3 + 1, l3 = t3[i3];
    if (null === l3 || l3 && s3 == l3.key && n3 === l3.type) return i3;
    if (r3 > (null != l3 && 0 == (131072 & l3.__u) ? 1 : 0)) for (; o3 >= 0 || a3 < t3.length; ) {
      if (o3 >= 0) {
        if ((l3 = t3[o3]) && 0 == (131072 & l3.__u) && s3 == l3.key && n3 === l3.type) return o3;
        o3--;
      }
      if (a3 < t3.length) {
        if ((l3 = t3[a3]) && 0 == (131072 & l3.__u) && s3 == l3.key && n3 === l3.type) return a3;
        a3++;
      }
    }
    return -1;
  }
  function on(e3, t3, i3) {
    "-" === t3[0] ? e3.setProperty(t3, null == i3 ? "" : i3) : e3[t3] = null == i3 ? "" : "number" != typeof i3 || js.test(t3) ? i3 : i3 + "px";
  }
  function an(e3, t3, i3, r3, s3) {
    var n3;
    e: if ("style" === t3) if ("string" == typeof i3) e3.style.cssText = i3;
    else {
      if ("string" == typeof r3 && (e3.style.cssText = r3 = ""), r3) for (t3 in r3) i3 && t3 in i3 || on(e3.style, t3, "");
      if (i3) for (t3 in i3) r3 && i3[t3] === r3[t3] || on(e3.style, t3, i3[t3]);
    }
    else if ("o" === t3[0] && "n" === t3[1]) n3 = t3 !== (t3 = t3.replace(/(PointerCapture)$|Capture$/, "$1")), t3 = t3.toLowerCase() in e3 ? t3.toLowerCase().slice(2) : t3.slice(2), e3.l || (e3.l = {}), e3.l[t3 + n3] = i3, i3 ? r3 ? i3.u = r3.u : (i3.u = Date.now(), e3.addEventListener(t3, n3 ? un : ln, n3)) : e3.removeEventListener(t3, n3 ? un : ln, n3);
    else {
      if (s3) t3 = t3.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
      else if ("width" !== t3 && "height" !== t3 && "href" !== t3 && "list" !== t3 && "form" !== t3 && "tabIndex" !== t3 && "download" !== t3 && "rowSpan" !== t3 && "colSpan" !== t3 && "role" !== t3 && t3 in e3) try {
        e3[t3] = null == i3 ? "" : i3;
        break e;
      } catch (e4) {
      }
      "function" == typeof i3 || (null == i3 || false === i3 && "-" !== t3[4] ? e3.removeAttribute(t3) : e3.setAttribute(t3, i3));
    }
  }
  function ln(e3) {
    var t3 = this.l[e3.type + false];
    if (e3.t) {
      if (e3.t <= t3.u) return;
    } else e3.t = Date.now();
    return t3(Ls.event ? Ls.event(e3) : e3);
  }
  function un(e3) {
    return this.l[e3.type + true](Ls.event ? Ls.event(e3) : e3);
  }
  function cn(e3, t3, i3, r3, s3, n3, o3, a3, l3, u3) {
    var c3, d3, h3, _3, p3, v3, g3, f2, m3, b3, y3, w3, S3, E3, k3, x3 = t3.type;
    if (void 0 !== t3.constructor) return null;
    128 & i3.__u && (l3 = !!(32 & i3.__u), n3 = [a3 = t3.__e = i3.__e]), (c3 = Ls.__b) && c3(t3);
    e: if ("function" == typeof x3) try {
      if (f2 = t3.props, m3 = (c3 = x3.contextType) && r3[c3.__c], b3 = c3 ? m3 ? m3.props.value : c3.__ : r3, i3.__c ? g3 = (d3 = t3.__c = i3.__c).__ = d3.__E : ("prototype" in x3 && x3.prototype.render ? t3.__c = d3 = new x3(f2, b3) : (t3.__c = d3 = new Ks(f2, b3), d3.constructor = x3, d3.render = vn), m3 && m3.sub(d3), d3.props = f2, d3.state || (d3.state = {}), d3.context = b3, d3.__n = r3, h3 = d3.__d = true, d3.__h = [], d3._sb = []), null == d3.__s && (d3.__s = d3.state), null != x3.getDerivedStateFromProps && (d3.__s == d3.state && (d3.__s = Vs({}, d3.__s)), Vs(d3.__s, x3.getDerivedStateFromProps(f2, d3.__s))), _3 = d3.props, p3 = d3.state, d3.__v = t3, h3) null == x3.getDerivedStateFromProps && null != d3.componentWillMount && d3.componentWillMount(), null != d3.componentDidMount && d3.__h.push(d3.componentDidMount);
      else {
        if (null == x3.getDerivedStateFromProps && f2 !== _3 && null != d3.componentWillReceiveProps && d3.componentWillReceiveProps(f2, b3), !d3.__e && (null != d3.shouldComponentUpdate && false === d3.shouldComponentUpdate(f2, d3.__s, b3) || t3.__v === i3.__v)) {
          for (t3.__v !== i3.__v && (d3.props = f2, d3.state = d3.__s, d3.__d = false), t3.__e = i3.__e, t3.__k = i3.__k, t3.__k.forEach(function(e4) {
            e4 && (e4.__ = t3);
          }), y3 = 0; y3 < d3._sb.length; y3++) d3.__h.push(d3._sb[y3]);
          d3._sb = [], d3.__h.length && o3.push(d3);
          break e;
        }
        null != d3.componentWillUpdate && d3.componentWillUpdate(f2, d3.__s, b3), null != d3.componentDidUpdate && d3.__h.push(function() {
          d3.componentDidUpdate(_3, p3, v3);
        });
      }
      if (d3.context = b3, d3.props = f2, d3.__P = e3, d3.__e = false, w3 = Ls.__r, S3 = 0, "prototype" in x3 && x3.prototype.render) {
        for (d3.state = d3.__s, d3.__d = false, w3 && w3(t3), c3 = d3.render(d3.props, d3.state, d3.context), E3 = 0; E3 < d3._sb.length; E3++) d3.__h.push(d3._sb[E3]);
        d3._sb = [];
      } else do {
        d3.__d = false, w3 && w3(t3), c3 = d3.render(d3.props, d3.state, d3.context), d3.state = d3.__s;
      } while (d3.__d && ++S3 < 25);
      d3.state = d3.__s, null != d3.getChildContext && (r3 = Vs(Vs({}, r3), d3.getChildContext())), h3 || null == d3.getSnapshotBeforeUpdate || (v3 = d3.getSnapshotBeforeUpdate(_3, p3)), tn(e3, Ws(k3 = null != c3 && c3.type === Ys && null == c3.key ? c3.props.children : c3) ? k3 : [k3], t3, i3, r3, s3, n3, o3, a3, l3, u3), d3.base = t3.__e, t3.__u &= -161, d3.__h.length && o3.push(d3), g3 && (d3.__E = d3.__ = null);
    } catch (e4) {
      t3.__v = null, l3 || null != n3 ? (t3.__e = a3, t3.__u |= l3 ? 160 : 32, n3[n3.indexOf(a3)] = null) : (t3.__e = i3.__e, t3.__k = i3.__k), Ls.__e(e4, t3, i3);
    }
    else null == n3 && t3.__v === i3.__v ? (t3.__k = i3.__k, t3.__e = i3.__e) : t3.__e = hn(i3.__e, t3, i3, r3, s3, n3, o3, l3, u3);
    (c3 = Ls.diffed) && c3(t3);
  }
  function dn(e3, t3, i3) {
    t3.__d = void 0;
    for (var r3 = 0; r3 < i3.length; r3++) _n(i3[r3], i3[++r3], i3[++r3]);
    Ls.__c && Ls.__c(t3, e3), e3.some(function(t4) {
      try {
        e3 = t4.__h, t4.__h = [], e3.some(function(e4) {
          e4.call(t4);
        });
      } catch (e4) {
        Ls.__e(e4, t4.__v);
      }
    });
  }
  function hn(e3, t3, i3, r3, s3, n3, o3, a3, l3) {
    var u3, c3, d3, h3, _3, p3, v3, g3 = i3.props, f2 = t3.props, m3 = t3.type;
    if ("svg" === m3 && (s3 = true), null != n3) {
      for (u3 = 0; u3 < n3.length; u3++) if ((_3 = n3[u3]) && "setAttribute" in _3 == !!m3 && (m3 ? _3.localName === m3 : 3 === _3.nodeType)) {
        e3 = _3, n3[u3] = null;
        break;
      }
    }
    if (null == e3) {
      if (null === m3) return document.createTextNode(f2);
      e3 = s3 ? document.createElementNS("http://www.w3.org/2000/svg", m3) : document.createElement(m3, f2.is && f2), n3 = null, a3 = false;
    }
    if (null === m3) g3 === f2 || a3 && e3.data === f2 || (e3.data = f2);
    else {
      if (n3 = n3 && Os.call(e3.childNodes), g3 = i3.props || Us, !a3 && null != n3) for (g3 = {}, u3 = 0; u3 < e3.attributes.length; u3++) g3[(_3 = e3.attributes[u3]).name] = _3.value;
      for (u3 in g3) _3 = g3[u3], "children" == u3 || ("dangerouslySetInnerHTML" == u3 ? d3 = _3 : "key" === u3 || u3 in f2 || an(e3, u3, null, _3, s3));
      for (u3 in f2) _3 = f2[u3], "children" == u3 ? h3 = _3 : "dangerouslySetInnerHTML" == u3 ? c3 = _3 : "value" == u3 ? p3 = _3 : "checked" == u3 ? v3 = _3 : "key" === u3 || a3 && "function" != typeof _3 || g3[u3] === _3 || an(e3, u3, _3, g3[u3], s3);
      if (c3) a3 || d3 && (c3.__html === d3.__html || c3.__html === e3.innerHTML) || (e3.innerHTML = c3.__html), t3.__k = [];
      else if (d3 && (e3.innerHTML = ""), tn(e3, Ws(h3) ? h3 : [h3], t3, i3, r3, s3 && "foreignObject" !== m3, n3, o3, n3 ? n3[0] : i3.__k && Xs(i3, 0), a3, l3), null != n3) for (u3 = n3.length; u3--; ) null != n3[u3] && Gs(n3[u3]);
      a3 || (u3 = "value", void 0 !== p3 && (p3 !== e3[u3] || "progress" === m3 && !p3 || "option" === m3 && p3 !== g3[u3]) && an(e3, u3, p3, g3[u3], false), u3 = "checked", void 0 !== v3 && v3 !== e3[u3] && an(e3, u3, v3, g3[u3], false));
    }
    return e3;
  }
  function _n(e3, t3, i3) {
    try {
      "function" == typeof e3 ? e3(t3) : e3.current = t3;
    } catch (e4) {
      Ls.__e(e4, i3);
    }
  }
  function pn(e3, t3, i3) {
    var r3, s3;
    if (Ls.unmount && Ls.unmount(e3), (r3 = e3.ref) && (r3.current && r3.current !== e3.__e || _n(r3, null, t3)), null != (r3 = e3.__c)) {
      if (r3.componentWillUnmount) try {
        r3.componentWillUnmount();
      } catch (e4) {
        Ls.__e(e4, t3);
      }
      r3.base = r3.__P = null, e3.__c = void 0;
    }
    if (r3 = e3.__k) for (s3 = 0; s3 < r3.length; s3++) r3[s3] && pn(r3[s3], t3, i3 || "function" != typeof e3.type);
    i3 || null == e3.__e || Gs(e3.__e), e3.__ = e3.__e = e3.__d = void 0;
  }
  function vn(e3, t3, i3) {
    return this.constructor(e3, i3);
  }
  Os = zs.slice, Ls = { __e: function(e3, t3, i3, r3) {
    for (var s3, n3, o3; t3 = t3.__; ) if ((s3 = t3.__c) && !s3.__) try {
      if ((n3 = s3.constructor) && null != n3.getDerivedStateFromError && (s3.setState(n3.getDerivedStateFromError(e3)), o3 = s3.__d), null != s3.componentDidCatch && (s3.componentDidCatch(e3, r3 || {}), o3 = s3.__d), o3) return s3.__E = s3;
    } catch (t4) {
      e3 = t4;
    }
    throw e3;
  } }, As = 0, Ks.prototype.setState = function(e3, t3) {
    var i3;
    i3 = null != this.__s && this.__s !== this.state ? this.__s : this.__s = Vs({}, this.state), "function" == typeof e3 && (e3 = e3(Vs({}, i3), this.props)), e3 && Vs(i3, e3), null != e3 && this.__v && (t3 && this._sb.push(t3), Zs(this));
  }, Ks.prototype.forceUpdate = function(e3) {
    this.__v && (this.__e = true, e3 && this.__h.push(e3), Zs(this));
  }, Ks.prototype.render = Ys, Ds = [], qs = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, Bs = function(e3, t3) {
    return e3.__v.__b - t3.__v.__b;
  }, en.__r = 0, Hs = 0;
  var gn;
  var fn;
  var mn;
  !function(e3, t3) {
    var i3 = { __c: t3 = "__cC" + Hs++, __: e3, Consumer: function(e4, t4) {
      return e4.children(t4);
    }, Provider: function(e4) {
      var i4, r3;
      return this.getChildContext || (i4 = [], (r3 = {})[t3] = this, this.getChildContext = function() {
        return r3;
      }, this.shouldComponentUpdate = function(e5) {
        this.props.value !== e5.value && i4.some(function(e6) {
          e6.__e = true, Zs(e6);
        });
      }, this.sub = function(e5) {
        i4.push(e5);
        var t4 = e5.componentWillUnmount;
        e5.componentWillUnmount = function() {
          i4.splice(i4.indexOf(e5), 1), t4 && t4.call(e5);
        };
      }), e4.children;
    } };
    i3.Provider.__ = i3.Consumer.contextType = i3;
  }({ isPreviewMode: false, previewPageIndex: 0, handleCloseSurveyPopup: () => {
  }, isPopup: true, onPreviewSubmit: () => {
  } }), function(e3) {
    e3.Popover = "popover", e3.API = "api", e3.Widget = "widget";
  }(gn || (gn = {})), function(e3) {
    e3.Open = "open", e3.MultipleChoice = "multiple_choice", e3.SingleChoice = "single_choice", e3.Rating = "rating", e3.Link = "link";
  }(fn || (fn = {})), function(e3) {
    e3.NextQuestion = "next_question", e3.End = "end", e3.ResponseBased = "response_based", e3.SpecificQuestion = "specific_question";
  }(mn || (mn = {}));
  var bn = class {
    constructor() {
      W2(this, "events", {}), this.events = {};
    }
    on(e3, t3) {
      return this.events[e3] || (this.events[e3] = []), this.events[e3].push(t3), () => {
        this.events[e3] = this.events[e3].filter((e4) => e4 !== t3);
      };
    }
    emit(e3, t3) {
      for (var i3 of this.events[e3] || []) i3(t3);
      for (var r3 of this.events["*"] || []) r3(e3, t3);
    }
  };
  var yn = class _yn {
    constructor(e3) {
      W2(this, "_debugEventEmitter", new bn()), W2(this, "checkStep", (e4, t3) => this.checkStepEvent(e4, t3) && this.checkStepUrl(e4, t3) && this.checkStepElement(e4, t3)), W2(this, "checkStepEvent", (e4, t3) => null == t3 || !t3.event || (null == e4 ? void 0 : e4.event) === (null == t3 ? void 0 : t3.event)), this.instance = e3, this.actionEvents = /* @__PURE__ */ new Set(), this.actionRegistry = /* @__PURE__ */ new Set();
    }
    init() {
      var e3;
      if (!R2(null === (e3 = this.instance) || void 0 === e3 ? void 0 : e3._addCaptureHook)) {
        var t3;
        null === (t3 = this.instance) || void 0 === t3 || t3._addCaptureHook((e4, t4) => {
          this.on(e4, t4);
        });
      }
    }
    register(e3) {
      var t3, i3;
      if (!R2(null === (t3 = this.instance) || void 0 === t3 ? void 0 : t3._addCaptureHook) && (e3.forEach((e4) => {
        var t4, i4;
        null === (t4 = this.actionRegistry) || void 0 === t4 || t4.add(e4), null === (i4 = e4.steps) || void 0 === i4 || i4.forEach((e5) => {
          var t5;
          null === (t5 = this.actionEvents) || void 0 === t5 || t5.add((null == e5 ? void 0 : e5.event) || "");
        });
      }), null !== (i3 = this.instance) && void 0 !== i3 && i3.autocapture)) {
        var r3, s3 = /* @__PURE__ */ new Set();
        e3.forEach((e4) => {
          var t4;
          null === (t4 = e4.steps) || void 0 === t4 || t4.forEach((e5) => {
            null != e5 && e5.selector && s3.add(null == e5 ? void 0 : e5.selector);
          });
        }), null === (r3 = this.instance) || void 0 === r3 || r3.autocapture.setElementSelectors(s3);
      }
    }
    on(e3, t3) {
      var i3;
      null != t3 && 0 != e3.length && (this.actionEvents.has(e3) || this.actionEvents.has(null == t3 ? void 0 : t3.event)) && this.actionRegistry && (null === (i3 = this.actionRegistry) || void 0 === i3 ? void 0 : i3.size) > 0 && this.actionRegistry.forEach((e4) => {
        this.checkAction(t3, e4) && this._debugEventEmitter.emit("actionCaptured", e4.name);
      });
    }
    _addActionHook(e3) {
      this.onAction("actionCaptured", (t3) => e3(t3));
    }
    checkAction(e3, t3) {
      if (null == (null == t3 ? void 0 : t3.steps)) return false;
      for (var i3 of t3.steps) if (this.checkStep(e3, i3)) return true;
      return false;
    }
    onAction(e3, t3) {
      return this._debugEventEmitter.on(e3, t3);
    }
    checkStepUrl(e3, t3) {
      if (null != t3 && t3.url) {
        var i3, r3 = null == e3 || null === (i3 = e3.properties) || void 0 === i3 ? void 0 : i3.$current_url;
        if (!r3 || "string" != typeof r3) return false;
        if (!_yn.matchString(r3, null == t3 ? void 0 : t3.url, (null == t3 ? void 0 : t3.url_matching) || "contains")) return false;
      }
      return true;
    }
    static matchString(e3, i3, r3) {
      switch (r3) {
        case "regex":
          return !!t2 && ft(e3, i3);
        case "exact":
          return i3 === e3;
        case "contains":
          var s3 = _yn.escapeStringRegexp(i3).replace(/_/g, ".").replace(/%/g, ".*");
          return ft(e3, s3);
        default:
          return false;
      }
    }
    static escapeStringRegexp(e3) {
      return e3.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
    }
    checkStepElement(e3, t3) {
      if ((null != t3 && t3.href || null != t3 && t3.tag_name || null != t3 && t3.text) && !this.getElementsList(e3).some((e4) => !(null != t3 && t3.href && !_yn.matchString(e4.href || "", null == t3 ? void 0 : t3.href, (null == t3 ? void 0 : t3.href_matching) || "exact")) && ((null == t3 || !t3.tag_name || e4.tag_name === (null == t3 ? void 0 : t3.tag_name)) && !(null != t3 && t3.text && !_yn.matchString(e4.text || "", null == t3 ? void 0 : t3.text, (null == t3 ? void 0 : t3.text_matching) || "exact") && !_yn.matchString(e4.$el_text || "", null == t3 ? void 0 : t3.text, (null == t3 ? void 0 : t3.text_matching) || "exact"))))) return false;
      if (null != t3 && t3.selector) {
        var i3, r3 = null == e3 || null === (i3 = e3.properties) || void 0 === i3 ? void 0 : i3.$element_selectors;
        if (!r3) return false;
        if (!r3.includes(null == t3 ? void 0 : t3.selector)) return false;
      }
      return true;
    }
    getElementsList(e3) {
      return null == (null == e3 ? void 0 : e3.properties.$elements) ? [] : null == e3 ? void 0 : e3.properties.$elements;
    }
  };
  var wn = class _wn {
    constructor(e3) {
      this.instance = e3, this.eventToSurveys = /* @__PURE__ */ new Map(), this.actionToSurveys = /* @__PURE__ */ new Map();
    }
    register(e3) {
      var t3;
      R2(null === (t3 = this.instance) || void 0 === t3 ? void 0 : t3._addCaptureHook) || (this.setupEventBasedSurveys(e3), this.setupActionBasedSurveys(e3));
    }
    setupActionBasedSurveys(e3) {
      var t3 = e3.filter((e4) => {
        var t4, i3, r3, s3;
        return (null === (t4 = e4.conditions) || void 0 === t4 ? void 0 : t4.actions) && (null === (i3 = e4.conditions) || void 0 === i3 || null === (r3 = i3.actions) || void 0 === r3 || null === (s3 = r3.values) || void 0 === s3 ? void 0 : s3.length) > 0;
      });
      if (0 !== t3.length) {
        if (null == this.actionMatcher) {
          this.actionMatcher = new yn(this.instance), this.actionMatcher.init();
          this.actionMatcher._addActionHook((e4) => {
            this.onAction(e4);
          });
        }
        t3.forEach((e4) => {
          var t4, i3, r3, s3, n3, o3, a3, l3, u3, c3;
          e4.conditions && null !== (t4 = e4.conditions) && void 0 !== t4 && t4.actions && null !== (i3 = e4.conditions) && void 0 !== i3 && null !== (r3 = i3.actions) && void 0 !== r3 && r3.values && (null === (s3 = e4.conditions) || void 0 === s3 || null === (n3 = s3.actions) || void 0 === n3 || null === (o3 = n3.values) || void 0 === o3 ? void 0 : o3.length) > 0 && (null === (a3 = this.actionMatcher) || void 0 === a3 || a3.register(e4.conditions.actions.values), null === (l3 = e4.conditions) || void 0 === l3 || null === (u3 = l3.actions) || void 0 === u3 || null === (c3 = u3.values) || void 0 === c3 || c3.forEach((t5) => {
            if (t5 && t5.name) {
              var i4 = this.actionToSurveys.get(t5.name);
              i4 && i4.push(e4.id), this.actionToSurveys.set(t5.name, i4 || [e4.id]);
            }
          }));
        });
      }
    }
    setupEventBasedSurveys(e3) {
      var t3;
      if (0 !== e3.filter((e4) => {
        var t4, i3, r3, s3;
        return (null === (t4 = e4.conditions) || void 0 === t4 ? void 0 : t4.events) && (null === (i3 = e4.conditions) || void 0 === i3 || null === (r3 = i3.events) || void 0 === r3 || null === (s3 = r3.values) || void 0 === s3 ? void 0 : s3.length) > 0;
      }).length) {
        null === (t3 = this.instance) || void 0 === t3 || t3._addCaptureHook((e4, t4) => {
          this.onEvent(e4, t4);
        }), e3.forEach((e4) => {
          var t4, i3, r3;
          null === (t4 = e4.conditions) || void 0 === t4 || null === (i3 = t4.events) || void 0 === i3 || null === (r3 = i3.values) || void 0 === r3 || r3.forEach((t5) => {
            if (t5 && t5.name) {
              var i4 = this.eventToSurveys.get(t5.name);
              i4 && i4.push(e4.id), this.eventToSurveys.set(t5.name, i4 || [e4.id]);
            }
          });
        });
      }
    }
    onEvent(e3, t3) {
      var i3, r3, s3 = (null === (i3 = this.instance) || void 0 === i3 || null === (r3 = i3.persistence) || void 0 === r3 ? void 0 : r3.props[Fe]) || [];
      if (_wn.SURVEY_SHOWN_EVENT_NAME == e3 && t3 && s3.length > 0) {
        var n3, o3 = null == t3 || null === (n3 = t3.properties) || void 0 === n3 ? void 0 : n3.$survey_id;
        if (o3) {
          var a3 = s3.indexOf(o3);
          a3 >= 0 && (s3.splice(a3, 1), this._updateActivatedSurveys(s3));
        }
      } else this.eventToSurveys.has(e3) && this._updateActivatedSurveys(s3.concat(this.eventToSurveys.get(e3) || []));
    }
    onAction(e3) {
      var t3, i3, r3 = (null === (t3 = this.instance) || void 0 === t3 || null === (i3 = t3.persistence) || void 0 === i3 ? void 0 : i3.props[Fe]) || [];
      this.actionToSurveys.has(e3) && this._updateActivatedSurveys(r3.concat(this.actionToSurveys.get(e3) || []));
    }
    _updateActivatedSurveys(e3) {
      var t3, i3;
      null === (t3 = this.instance) || void 0 === t3 || null === (i3 = t3.persistence) || void 0 === i3 || i3.register({ [Fe]: [...new Set(e3)] });
    }
    getSurveys() {
      var e3, t3, i3 = null === (e3 = this.instance) || void 0 === e3 || null === (t3 = e3.persistence) || void 0 === t3 ? void 0 : t3.props[Fe];
      return i3 || [];
    }
    getEventToSurveys() {
      return this.eventToSurveys;
    }
    _getActionMatcher() {
      return this.actionMatcher;
    }
  };
  W2(wn, "SURVEY_SHOWN_EVENT_NAME", "survey shown");
  var Sn = B2("[Surveys]");
  var En = { icontains: (e3) => !!t2 && t2.location.href.toLowerCase().indexOf(e3.toLowerCase()) > -1, not_icontains: (e3) => !!t2 && -1 === t2.location.href.toLowerCase().indexOf(e3.toLowerCase()), regex: (e3) => !!t2 && ft(t2.location.href, e3), not_regex: (e3) => !!t2 && !ft(t2.location.href, e3), exact: (e3) => (null == t2 ? void 0 : t2.location.href) === e3, is_not: (e3) => (null == t2 ? void 0 : t2.location.href) !== e3 };
  function kn(e3, t3, i3) {
    var r3, s3 = e3.questions[t3], n3 = t3 + 1;
    if (null === (r3 = s3.branching) || void 0 === r3 || !r3.type) return t3 === e3.questions.length - 1 ? mn.End : n3;
    if (s3.branching.type === mn.End) return mn.End;
    if (s3.branching.type === mn.SpecificQuestion) {
      if (Number.isInteger(s3.branching.index)) return s3.branching.index;
    } else if (s3.branching.type === mn.ResponseBased) {
      if (s3.type === fn.SingleChoice) {
        var o3, a3, l3 = s3.choices.indexOf("".concat(i3));
        if (null !== (o3 = s3.branching) && void 0 !== o3 && null !== (a3 = o3.responseValues) && void 0 !== a3 && a3.hasOwnProperty(l3)) {
          var u3 = s3.branching.responseValues[l3];
          return Number.isInteger(u3) ? u3 : u3 === mn.End ? mn.End : n3;
        }
      } else if (s3.type === fn.Rating) {
        var c3, d3;
        if ("number" != typeof i3 || !Number.isInteger(i3)) throw new Error("The response type must be an integer");
        var h3 = function(e4, t4) {
          if (3 === t4) {
            if (e4 < 1 || e4 > 3) throw new Error("The response must be in range 1-3");
            return 1 === e4 ? "negative" : 2 === e4 ? "neutral" : "positive";
          }
          if (5 === t4) {
            if (e4 < 1 || e4 > 5) throw new Error("The response must be in range 1-5");
            return e4 <= 2 ? "negative" : 3 === e4 ? "neutral" : "positive";
          }
          if (7 === t4) {
            if (e4 < 1 || e4 > 7) throw new Error("The response must be in range 1-7");
            return e4 <= 3 ? "negative" : 4 === e4 ? "neutral" : "positive";
          }
          if (10 === t4) {
            if (e4 < 0 || e4 > 10) throw new Error("The response must be in range 0-10");
            return e4 <= 6 ? "detractors" : e4 <= 8 ? "passives" : "promoters";
          }
          throw new Error("The scale must be one of: 3, 5, 7, 10");
        }(i3, s3.scale);
        if (null !== (c3 = s3.branching) && void 0 !== c3 && null !== (d3 = c3.responseValues) && void 0 !== d3 && d3.hasOwnProperty(h3)) {
          var _3 = s3.branching.responseValues[h3];
          return Number.isInteger(_3) ? _3 : _3 === mn.End ? mn.End : n3;
        }
      }
      return n3;
    }
    return Sn.warn("Falling back to next question index due to unexpected branching type"), n3;
  }
  var xn = class {
    constructor(e3) {
      W2(this, "getNextSurveyStep", kn), this.instance = e3, this._surveyEventReceiver = null;
    }
    onRemoteConfig(e3) {
      this._decideServerResponse = !!e3.surveys, Sn.info("decideServerResponse set to ".concat(this._decideServerResponse)), this.loadIfEnabled();
    }
    reset() {
      localStorage.removeItem("lastSeenSurveyDate");
      var e3 = (() => {
        for (var e4 = [], t3 = 0; t3 < localStorage.length; t3++) {
          var i3 = localStorage.key(t3);
          null != i3 && i3.startsWith("seenSurvey_") && e4.push(i3);
        }
        return e4;
      })();
      e3.forEach((e4) => localStorage.removeItem(e4));
    }
    loadIfEnabled() {
      if (this._surveyManager) Sn.info("Surveys already loaded.");
      else if (this.instance.config.disable_surveys) Sn.info("Disabled. Not loading surveys.");
      else {
        var e3 = null == _2 ? void 0 : _2.__PosthogExtensions__;
        if (e3) {
          var t3 = e3.generateSurveys;
          if (this._decideServerResponse) if (null == this._surveyEventReceiver && (this._surveyEventReceiver = new wn(this.instance)), t3) this._surveyManager = t3(this.instance);
          else {
            var i3 = e3.loadExternalDependency;
            i3 ? i3(this.instance, "surveys", (t4) => {
              var i4;
              t4 ? Sn.error("Could not load surveys script", t4) : this._surveyManager = null === (i4 = e3.generateSurveys) || void 0 === i4 ? void 0 : i4.call(e3, this.instance);
            }) : Sn.error("PostHog loadExternalDependency extension not found. Cannot load remote config.");
          }
          else Sn.warn("Decide not loaded yet. Not loading surveys.");
        } else Sn.error("PostHog Extensions not found.");
      }
    }
    getSurveys(e3) {
      var t3 = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
      if (this.instance.config.disable_surveys) return Sn.info("Disabled. Not loading surveys."), e3([]);
      null == this._surveyEventReceiver && (this._surveyEventReceiver = new wn(this.instance));
      var i3 = this.instance.get_property(Re);
      if (i3 && !t3) return Sn.info("Surveys already loaded."), e3(i3);
      this.instance._send_request({ url: this.instance.requestRouter.endpointFor("api", "/api/surveys/?token=".concat(this.instance.config.token)), method: "GET", callback: (t4) => {
        var i4, r3 = t4.statusCode;
        if (200 !== r3 || !t4.json) return Sn.error("Surveys API could not be loaded, status: ".concat(r3)), e3([]);
        var s3, n3 = t4.json.surveys || [], o3 = n3.filter((e4) => {
          var t5, i5, r4, s4, n4, o4, a3, l3, u3, c3, d3, h3;
          return (null === (t5 = e4.conditions) || void 0 === t5 ? void 0 : t5.events) && (null === (i5 = e4.conditions) || void 0 === i5 || null === (r4 = i5.events) || void 0 === r4 ? void 0 : r4.values) && (null === (s4 = e4.conditions) || void 0 === s4 || null === (n4 = s4.events) || void 0 === n4 || null === (o4 = n4.values) || void 0 === o4 ? void 0 : o4.length) > 0 || (null === (a3 = e4.conditions) || void 0 === a3 ? void 0 : a3.actions) && (null === (l3 = e4.conditions) || void 0 === l3 || null === (u3 = l3.actions) || void 0 === u3 ? void 0 : u3.values) && (null === (c3 = e4.conditions) || void 0 === c3 || null === (d3 = c3.actions) || void 0 === d3 || null === (h3 = d3.values) || void 0 === h3 ? void 0 : h3.length) > 0;
        });
        o3.length > 0 && (null === (s3 = this._surveyEventReceiver) || void 0 === s3 || s3.register(o3));
        return null === (i4 = this.instance.persistence) || void 0 === i4 || i4.register({ [Re]: n3 }), e3(n3);
      } });
    }
    getActiveMatchingSurveys(e3) {
      var t3 = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
      this.getSurveys((t4) => {
        var i3, r3 = t4.filter((e4) => !(!e4.start_date || e4.end_date)).filter((e4) => {
          var t5, i4, r4, s4;
          if (!e4.conditions) return true;
          var n4 = null === (t5 = e4.conditions) || void 0 === t5 || !t5.url || En[null !== (i4 = null === (r4 = e4.conditions) || void 0 === r4 ? void 0 : r4.urlMatchType) && void 0 !== i4 ? i4 : "icontains"](e4.conditions.url), o3 = null === (s4 = e4.conditions) || void 0 === s4 || !s4.selector || (null == a2 ? void 0 : a2.querySelector(e4.conditions.selector));
          return n4 && o3;
        }), s3 = null === (i3 = this._surveyEventReceiver) || void 0 === i3 ? void 0 : i3.getSurveys(), n3 = r3.filter((e4) => {
          var t5, i4, r4, n4, o3, a3, l3, u3, c3, d3, h3;
          if (!(e4.linked_flag_key || e4.targeting_flag_key || e4.internal_targeting_flag_key || null !== (t5 = e4.feature_flag_keys) && void 0 !== t5 && t5.length)) return true;
          var _3 = !e4.linked_flag_key || this.instance.featureFlags.isFeatureEnabled(e4.linked_flag_key), p3 = !e4.targeting_flag_key || this.instance.featureFlags.isFeatureEnabled(e4.targeting_flag_key), v3 = (null === (i4 = e4.conditions) || void 0 === i4 ? void 0 : i4.events) && (null === (r4 = e4.conditions) || void 0 === r4 || null === (n4 = r4.events) || void 0 === n4 ? void 0 : n4.values) && (null === (o3 = e4.conditions) || void 0 === o3 || null === (a3 = o3.events) || void 0 === a3 ? void 0 : a3.values.length) > 0, g3 = (null === (l3 = e4.conditions) || void 0 === l3 ? void 0 : l3.actions) && (null === (u3 = e4.conditions) || void 0 === u3 || null === (c3 = u3.actions) || void 0 === c3 ? void 0 : c3.values) && (null === (d3 = e4.conditions) || void 0 === d3 || null === (h3 = d3.actions) || void 0 === h3 ? void 0 : h3.values.length) > 0, f2 = !v3 && !g3 || (null == s3 ? void 0 : s3.includes(e4.id)), m3 = this._canActivateRepeatedly(e4), b3 = !(e4.internal_targeting_flag_key && !m3) || this.instance.featureFlags.isFeatureEnabled(e4.internal_targeting_flag_key), y3 = this.checkFlags(e4);
          return _3 && p3 && b3 && f2 && y3;
        });
        return e3(n3);
      }, t3);
    }
    checkFlags(e3) {
      var t3;
      return null === (t3 = e3.feature_flag_keys) || void 0 === t3 || !t3.length || e3.feature_flag_keys.every((e4) => {
        var { key: t4, value: i3 } = e4;
        return !t4 || !i3 || this.instance.featureFlags.isFeatureEnabled(i3);
      });
    }
    _canActivateRepeatedly(e3) {
      var t3;
      return M2(null === (t3 = _2.__PosthogExtensions__) || void 0 === t3 ? void 0 : t3.canActivateRepeatedly) ? (Sn.warn("init was not called"), false) : _2.__PosthogExtensions__.canActivateRepeatedly(e3);
    }
    canRenderSurvey(e3) {
      M2(this._surveyManager) ? Sn.warn("init was not called") : this.getSurveys((t3) => {
        var i3 = t3.filter((t4) => t4.id === e3)[0];
        this._surveyManager.canRenderSurvey(i3);
      });
    }
    renderSurvey(e3, t3) {
      M2(this._surveyManager) ? Sn.warn("init was not called") : this.getSurveys((i3) => {
        var r3 = i3.filter((t4) => t4.id === e3)[0];
        this._surveyManager.renderSurvey(r3, null == a2 ? void 0 : a2.querySelector(t3));
      });
    }
  };
  var In = B2("[RateLimiter]");
  var Cn = class {
    constructor(e3) {
      var t3, i3;
      W2(this, "serverLimits", {}), W2(this, "lastEventRateLimited", false), W2(this, "checkForLimiting", (e4) => {
        var t4 = e4.text;
        if (t4 && t4.length) try {
          (JSON.parse(t4).quota_limited || []).forEach((e5) => {
            In.info("".concat(e5 || "events", " is quota limited.")), this.serverLimits[e5] = (/* @__PURE__ */ new Date()).getTime() + 6e4;
          });
        } catch (e5) {
          return void In.warn('could not rate limit - continuing. Error: "'.concat(null == e5 ? void 0 : e5.message, '"'), { text: t4 });
        }
      }), this.instance = e3, this.captureEventsPerSecond = (null === (t3 = e3.config.rate_limiting) || void 0 === t3 ? void 0 : t3.events_per_second) || 10, this.captureEventsBurstLimit = Math.max((null === (i3 = e3.config.rate_limiting) || void 0 === i3 ? void 0 : i3.events_burst_limit) || 10 * this.captureEventsPerSecond, this.captureEventsPerSecond), this.lastEventRateLimited = this.clientRateLimitContext(true).isRateLimited;
    }
    clientRateLimitContext() {
      var e3, t3, i3, r3 = arguments.length > 0 && void 0 !== arguments[0] && arguments[0], s3 = (/* @__PURE__ */ new Date()).getTime(), n3 = null !== (e3 = null === (t3 = this.instance.persistence) || void 0 === t3 ? void 0 : t3.get_property(Oe)) && void 0 !== e3 ? e3 : { tokens: this.captureEventsBurstLimit, last: s3 };
      n3.tokens += (s3 - n3.last) / 1e3 * this.captureEventsPerSecond, n3.last = s3, n3.tokens > this.captureEventsBurstLimit && (n3.tokens = this.captureEventsBurstLimit);
      var o3 = n3.tokens < 1;
      return o3 || r3 || (n3.tokens = Math.max(0, n3.tokens - 1)), !o3 || this.lastEventRateLimited || r3 || this.instance.capture("$$client_ingestion_warning", { $$client_ingestion_warning_message: "posthog-js client rate limited. Config is set to ".concat(this.captureEventsPerSecond, " events per second and ").concat(this.captureEventsBurstLimit, " events burst limit.") }, { skip_client_rate_limiting: true }), this.lastEventRateLimited = o3, null === (i3 = this.instance.persistence) || void 0 === i3 || i3.set_property(Oe, n3), { isRateLimited: o3, remainingTokens: n3.tokens };
    }
    isServerRateLimited(e3) {
      var t3 = this.serverLimits[e3 || "events"] || false;
      return false !== t3 && (/* @__PURE__ */ new Date()).getTime() < t3;
    }
  };
  var Pn = (e3) => {
    var t3 = null == e3 ? void 0 : e3.config;
    return j2({ initialPathName: (null == l2 ? void 0 : l2.pathname) || "", referringDomain: wi.referringDomain() }, wi.campaignParams({ customTrackedParams: null == t3 ? void 0 : t3.custom_campaign_params, maskPersonalDataProperties: null == t3 ? void 0 : t3.mask_personal_data_properties, customPersonalDataProperties: null == t3 ? void 0 : t3.custom_personal_data_properties }));
  };
  var Rn = class {
    constructor(e3, t3, i3, r3) {
      W2(this, "_onSessionIdCallback", (e4) => {
        var t4 = this._getStoredProps();
        if (!t4 || t4.sessionId !== e4) {
          var i4 = { sessionId: e4, props: this._sessionSourceParamGenerator(this.instance) };
          this._persistence.register({ [Me]: i4 });
        }
      }), this.instance = e3, this._sessionIdManager = t3, this._persistence = i3, this._sessionSourceParamGenerator = r3 || Pn, this._sessionIdManager.onSessionId(this._onSessionIdCallback);
    }
    _getStoredProps() {
      return this._persistence.props[Me];
    }
    getSessionProps() {
      var e3, t3 = null === (e3 = this._getStoredProps()) || void 0 === e3 ? void 0 : e3.props;
      return t3 ? { $client_session_initial_referring_host: t3.referringDomain, $client_session_initial_pathname: t3.initialPathName, $client_session_initial_utm_source: t3.utm_source, $client_session_initial_utm_campaign: t3.utm_campaign, $client_session_initial_utm_medium: t3.utm_medium, $client_session_initial_utm_content: t3.utm_content, $client_session_initial_utm_term: t3.utm_term } : {};
    }
  };
  var Fn = ["ahrefsbot", "ahrefssiteaudit", "applebot", "baiduspider", "better uptime bot", "bingbot", "bingpreview", "bot.htm", "bot.php", "crawler", "deepscan", "duckduckbot", "facebookexternal", "facebookcatalog", "gptbot", "http://yandex.com/bots", "hubspot", "ia_archiver", "linkedinbot", "mj12bot", "msnbot", "nessus", "petalbot", "pinterest", "prerender", "rogerbot", "screaming frog", "semrushbot", "sitebulb", "slurp", "turnitin", "twitterbot", "vercelbot", "yahoo! slurp", "yandexbot", "headlesschrome", "cypress", "Google-HotelAdsVerifier", "adsbot-google", "apis-google", "duplexweb-google", "feedfetcher-google", "google favicon", "google web preview", "google-read-aloud", "googlebot", "googleweblight", "mediapartners-google", "storebot-google", "Bytespider;"];
  var Tn = function(e3, t3) {
    if (!e3) return false;
    var i3 = e3.toLowerCase();
    return Fn.concat(t3 || []).some((e4) => {
      var t4 = e4.toLowerCase();
      return -1 !== i3.indexOf(t4);
    });
  };
  var $n = function(e3, t3) {
    if (!e3) return false;
    var i3 = e3.userAgent;
    if (i3 && Tn(i3, t3)) return true;
    try {
      var r3 = null == e3 ? void 0 : e3.userAgentData;
      if (null != r3 && r3.brands && r3.brands.some((e4) => Tn(null == e4 ? void 0 : e4.brand, t3))) return true;
    } catch (e4) {
    }
    return !!e3.webdriver;
  };
  var Mn = class {
    constructor() {
      this.clicks = [];
    }
    isRageClick(e3, t3, i3) {
      var r3 = this.clicks[this.clicks.length - 1];
      if (r3 && Math.abs(e3 - r3.x) + Math.abs(t3 - r3.y) < 30 && i3 - r3.timestamp < 1e3) {
        if (this.clicks.push({ x: e3, y: t3, timestamp: i3 }), 3 === this.clicks.length) return true;
      } else this.clicks = [{ x: e3, y: t3, timestamp: i3 }];
      return false;
    }
  };
  var On = B2("[Dead Clicks]");
  var Ln = () => true;
  var An = (e3) => {
    var t3, i3 = !(null === (t3 = e3.instance.persistence) || void 0 === t3 || !t3.get_property(he)), r3 = e3.instance.config.capture_dead_clicks;
    return L2(r3) ? r3 : i3;
  };
  var Dn = class {
    get lazyLoadedDeadClicksAutocapture() {
      return this._lazyLoadedDeadClicksAutocapture;
    }
    constructor(e3, t3, i3) {
      this.instance = e3, this.isEnabled = t3, this.onCapture = i3, this.startIfEnabled();
    }
    onRemoteConfig(e3) {
      this.instance.persistence && this.instance.persistence.register({ [he]: null == e3 ? void 0 : e3.captureDeadClicks }), this.startIfEnabled();
    }
    startIfEnabled() {
      this.isEnabled(this) && this.loadScript(() => {
        this.start();
      });
    }
    loadScript(e3) {
      var t3, i3, r3;
      null !== (t3 = _2.__PosthogExtensions__) && void 0 !== t3 && t3.initDeadClicksAutocapture && e3(), null === (i3 = _2.__PosthogExtensions__) || void 0 === i3 || null === (r3 = i3.loadExternalDependency) || void 0 === r3 || r3.call(i3, this.instance, "dead-clicks-autocapture", (t4) => {
        t4 ? On.error("failed to load script", t4) : e3();
      });
    }
    start() {
      var e3;
      if (a2) {
        if (!this._lazyLoadedDeadClicksAutocapture && null !== (e3 = _2.__PosthogExtensions__) && void 0 !== e3 && e3.initDeadClicksAutocapture) {
          var t3 = C2(this.instance.config.capture_dead_clicks) ? this.instance.config.capture_dead_clicks : {};
          t3.__onCapture = this.onCapture, this._lazyLoadedDeadClicksAutocapture = _2.__PosthogExtensions__.initDeadClicksAutocapture(this.instance, t3), this._lazyLoadedDeadClicksAutocapture.start(a2), On.info("starting...");
        }
      } else On.error("`document` not found. Cannot start.");
    }
    stop() {
      this._lazyLoadedDeadClicksAutocapture && (this._lazyLoadedDeadClicksAutocapture.stop(), this._lazyLoadedDeadClicksAutocapture = void 0, On.info("stopping..."));
    }
  };
  var Nn = B2("[Heatmaps]");
  function qn(e3) {
    return C2(e3) && "clientX" in e3 && "clientY" in e3 && O2(e3.clientX) && O2(e3.clientY);
  }
  var Bn = class {
    constructor(e3) {
      var i3;
      W2(this, "rageclicks", new Mn()), W2(this, "_enabledServerSide", false), W2(this, "_initialized", false), W2(this, "_flushInterval", null), this.instance = e3, this._enabledServerSide = !(null === (i3 = this.instance.persistence) || void 0 === i3 || !i3.props[ue]), null == t2 || t2.addEventListener("beforeunload", () => {
        this.flush();
      });
    }
    get flushIntervalMilliseconds() {
      var e3 = 5e3;
      return C2(this.instance.config.capture_heatmaps) && this.instance.config.capture_heatmaps.flush_interval_milliseconds && (e3 = this.instance.config.capture_heatmaps.flush_interval_milliseconds), e3;
    }
    get isEnabled() {
      return R2(this.instance.config.capture_heatmaps) ? R2(this.instance.config.enable_heatmaps) ? this._enabledServerSide : this.instance.config.enable_heatmaps : false !== this.instance.config.capture_heatmaps;
    }
    startIfEnabled() {
      if (this.isEnabled) {
        if (this._initialized) return;
        Nn.info("starting..."), this._setupListeners(), this._flushInterval = setInterval(this.flush.bind(this), this.flushIntervalMilliseconds);
      } else {
        var e3, t3;
        clearInterval(null !== (e3 = this._flushInterval) && void 0 !== e3 ? e3 : void 0), null === (t3 = this.deadClicksCapture) || void 0 === t3 || t3.stop(), this.getAndClearBuffer();
      }
    }
    onRemoteConfig(e3) {
      var t3 = !!e3.heatmaps;
      this.instance.persistence && this.instance.persistence.register({ [ue]: t3 }), this._enabledServerSide = t3, this.startIfEnabled();
    }
    getAndClearBuffer() {
      var e3 = this.buffer;
      return this.buffer = void 0, e3;
    }
    _onDeadClick(e3) {
      this._onClick(e3.originalEvent, "deadclick");
    }
    _setupListeners() {
      t2 && a2 && (re(a2, "click", (e3) => this._onClick(e3 || (null == t2 ? void 0 : t2.event)), false, true), re(a2, "mousemove", (e3) => this._onMouseMove(e3 || (null == t2 ? void 0 : t2.event)), false, true), this.deadClicksCapture = new Dn(this.instance, Ln, this._onDeadClick.bind(this)), this.deadClicksCapture.startIfEnabled(), this._initialized = true);
    }
    _getProperties(e3, i3) {
      var r3 = this.instance.scrollManager.scrollY(), s3 = this.instance.scrollManager.scrollX(), n3 = this.instance.scrollManager.scrollElement(), o3 = function(e4, i4, r4) {
        for (var s4 = e4; s4 && Ri(s4) && !Fi(s4, "body"); ) {
          if (s4 === r4) return false;
          if (m2(i4, null == t2 ? void 0 : t2.getComputedStyle(s4).position)) return true;
          s4 = Bi(s4);
        }
        return false;
      }(Ni(e3), ["fixed", "sticky"], n3);
      return { x: e3.clientX + (o3 ? 0 : s3), y: e3.clientY + (o3 ? 0 : r3), target_fixed: o3, type: i3 };
    }
    _onClick(e3) {
      var t3, i3 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "click";
      if (!Pi(e3.target) && qn(e3)) {
        var r3 = this._getProperties(e3, i3);
        null !== (t3 = this.rageclicks) && void 0 !== t3 && t3.isRageClick(e3.clientX, e3.clientY, (/* @__PURE__ */ new Date()).getTime()) && this._capture(j2(j2({}, r3), {}, { type: "rageclick" })), this._capture(r3);
      }
    }
    _onMouseMove(e3) {
      !Pi(e3.target) && qn(e3) && (clearTimeout(this._mouseMoveTimeout), this._mouseMoveTimeout = setTimeout(() => {
        this._capture(this._getProperties(e3, "mousemove"));
      }, 500));
    }
    _capture(e3) {
      if (t2) {
        var i3 = t2.location.href;
        this.buffer = this.buffer || {}, this.buffer[i3] || (this.buffer[i3] = []), this.buffer[i3].push(e3);
      }
    }
    flush() {
      this.buffer && !P2(this.buffer) && this.instance.capture("$$heatmap", { $heatmap_data: this.getAndClearBuffer() });
    }
  };
  var Hn = class {
    constructor(e3) {
      W2(this, "_updateScrollData", () => {
        var e4, t3, i3, r3;
        this.context || (this.context = {});
        var s3 = this.scrollElement(), n3 = this.scrollY(), o3 = s3 ? Math.max(0, s3.scrollHeight - s3.clientHeight) : 0, a3 = n3 + ((null == s3 ? void 0 : s3.clientHeight) || 0), l3 = (null == s3 ? void 0 : s3.scrollHeight) || 0;
        this.context.lastScrollY = Math.ceil(n3), this.context.maxScrollY = Math.max(n3, null !== (e4 = this.context.maxScrollY) && void 0 !== e4 ? e4 : 0), this.context.maxScrollHeight = Math.max(o3, null !== (t3 = this.context.maxScrollHeight) && void 0 !== t3 ? t3 : 0), this.context.lastContentY = a3, this.context.maxContentY = Math.max(a3, null !== (i3 = this.context.maxContentY) && void 0 !== i3 ? i3 : 0), this.context.maxContentHeight = Math.max(l3, null !== (r3 = this.context.maxContentHeight) && void 0 !== r3 ? r3 : 0);
      }), this.instance = e3;
    }
    getContext() {
      return this.context;
    }
    resetContext() {
      var e3 = this.context;
      return setTimeout(this._updateScrollData, 0), e3;
    }
    startMeasuringScrollPosition() {
      null == t2 || t2.addEventListener("scroll", this._updateScrollData, true), null == t2 || t2.addEventListener("scrollend", this._updateScrollData, true), null == t2 || t2.addEventListener("resize", this._updateScrollData);
    }
    scrollElement() {
      if (!this.instance.config.scroll_root_selector) return null == t2 ? void 0 : t2.document.documentElement;
      var e3 = x2(this.instance.config.scroll_root_selector) ? this.instance.config.scroll_root_selector : [this.instance.config.scroll_root_selector];
      for (var i3 of e3) {
        var r3 = null == t2 ? void 0 : t2.document.querySelector(i3);
        if (r3) return r3;
      }
    }
    scrollY() {
      if (this.instance.config.scroll_root_selector) {
        var e3 = this.scrollElement();
        return e3 && e3.scrollTop || 0;
      }
      return t2 && (t2.scrollY || t2.pageYOffset || t2.document.documentElement.scrollTop) || 0;
    }
    scrollX() {
      if (this.instance.config.scroll_root_selector) {
        var e3 = this.scrollElement();
        return e3 && e3.scrollLeft || 0;
      }
      return t2 && (t2.scrollX || t2.pageXOffset || t2.document.documentElement.scrollLeft) || 0;
    }
  };
  var Un = B2("[AutoCapture]");
  function zn(e3, t3) {
    return t3.length > e3 ? t3.slice(0, e3) + "..." : t3;
  }
  function jn(e3) {
    if (e3.previousElementSibling) return e3.previousElementSibling;
    var t3 = e3;
    do {
      t3 = t3.previousSibling;
    } while (t3 && !Ri(t3));
    return t3;
  }
  function Wn(e3, t3, i3, r3) {
    var s3 = e3.tagName.toLowerCase(), n3 = { tag_name: s3 };
    qi.indexOf(s3) > -1 && !i3 && ("a" === s3.toLowerCase() || "button" === s3.toLowerCase() ? n3.$el_text = zn(1024, Xi(e3)) : n3.$el_text = zn(1024, Di(e3)));
    var o3 = Li(e3);
    o3.length > 0 && (n3.classes = o3.filter(function(e4) {
      return "" !== e4;
    })), Y2(e3.attributes, function(i4) {
      var s4;
      if ((!zi(e3) || -1 !== ["name", "id", "class", "aria-label"].indexOf(i4.name)) && ((null == r3 || !r3.includes(i4.name)) && !t3 && Ki(i4.value) && (s4 = i4.name, !F2(s4) || "_ngcontent" !== s4.substring(0, 10) && "_nghost" !== s4.substring(0, 7)))) {
        var o4 = i4.value;
        "class" === i4.name && (o4 = Mi(o4).join(" ")), n3["attr__" + i4.name] = zn(1024, o4);
      }
    });
    for (var a3 = 1, l3 = 1, u3 = e3; u3 = jn(u3); ) a3++, u3.tagName === e3.tagName && l3++;
    return n3.nth_child = a3, n3.nth_of_type = l3, n3;
  }
  function Vn(e3, i3) {
    for (var r3, s3, { e: n3, maskAllElementAttributes: o3, maskAllText: a3, elementAttributeIgnoreList: l3, elementsChainAsString: u3 } = i3, c3 = [e3], d3 = e3; d3.parentNode && !Fi(d3, "body"); ) $i(d3.parentNode) ? (c3.push(d3.parentNode.host), d3 = d3.parentNode.host) : (c3.push(d3.parentNode), d3 = d3.parentNode);
    var h3, _3 = [], p3 = {}, v3 = false, g3 = false;
    if (Y2(c3, (e4) => {
      var t3 = Ui(e4);
      "a" === e4.tagName.toLowerCase() && (v3 = e4.getAttribute("href"), v3 = t3 && v3 && Ki(v3) && v3), m2(Li(e4), "ph-no-capture") && (g3 = true), _3.push(Wn(e4, o3, a3, l3));
      var i4 = function(e5) {
        if (!Ui(e5)) return {};
        var t4 = {};
        return Y2(e5.attributes, function(e6) {
          if (e6.name && 0 === e6.name.indexOf("data-ph-capture-attribute")) {
            var i5 = e6.name.replace("data-ph-capture-attribute-", ""), r4 = e6.value;
            i5 && r4 && Ki(r4) && (t4[i5] = r4);
          }
        }), t4;
      }(e4);
      K2(p3, i4);
    }), g3) return { props: {}, explicitNoCapture: g3 };
    if (a3 || ("a" === e3.tagName.toLowerCase() || "button" === e3.tagName.toLowerCase() ? _3[0].$el_text = Xi(e3) : _3[0].$el_text = Di(e3)), v3) {
      var f2, b3;
      _3[0].attr__href = v3;
      var y3 = null === (f2 = gt(v3)) || void 0 === f2 ? void 0 : f2.host, w3 = null == t2 || null === (b3 = t2.location) || void 0 === b3 ? void 0 : b3.host;
      y3 && w3 && y3 !== w3 && (h3 = v3);
    }
    return { props: K2({ $event_type: n3.type, $ce_version: 1 }, u3 ? {} : { $elements: _3 }, { $elements_chain: Zi(_3) }, null !== (r3 = _3[0]) && void 0 !== r3 && r3.$el_text ? { $el_text: null === (s3 = _3[0]) || void 0 === s3 ? void 0 : s3.$el_text } : {}, h3 && "click" === n3.type ? { $external_click_url: h3 } : {}, p3) };
  }
  var Gn = class {
    constructor(e3) {
      W2(this, "_initialized", false), W2(this, "_isDisabledServerSide", null), W2(this, "rageclicks", new Mn()), W2(this, "_elementsChainAsString", false), this.instance = e3, this._elementSelectors = null;
    }
    get config() {
      var e3, t3, i3 = C2(this.instance.config.autocapture) ? this.instance.config.autocapture : {};
      return i3.url_allowlist = null === (e3 = i3.url_allowlist) || void 0 === e3 ? void 0 : e3.map((e4) => new RegExp(e4)), i3.url_ignorelist = null === (t3 = i3.url_ignorelist) || void 0 === t3 ? void 0 : t3.map((e4) => new RegExp(e4)), i3;
    }
    _addDomEventHandlers() {
      if (this.isBrowserSupported()) {
        if (t2 && a2) {
          var e3 = (e4) => {
            e4 = e4 || (null == t2 ? void 0 : t2.event);
            try {
              this._captureEvent(e4);
            } catch (e5) {
              Un.error("Failed to capture event", e5);
            }
          }, i3 = (e4) => {
            e4 = e4 || (null == t2 ? void 0 : t2.event), this._captureEvent(e4, v2);
          };
          re(a2, "submit", e3, false, true), re(a2, "change", e3, false, true), re(a2, "click", e3, false, true), this.config.capture_copied_text && (re(a2, "copy", i3, false, true), re(a2, "cut", i3, false, true));
        }
      } else Un.info("Disabling Automatic Event Collection because this browser is not supported");
    }
    startIfEnabled() {
      this.isEnabled && !this._initialized && (this._addDomEventHandlers(), this._initialized = true);
    }
    onRemoteConfig(e3) {
      e3.elementsChainAsString && (this._elementsChainAsString = e3.elementsChainAsString), this.instance.persistence && this.instance.persistence.register({ [le]: !!e3.autocapture_opt_out }), this._isDisabledServerSide = !!e3.autocapture_opt_out, this.startIfEnabled();
    }
    setElementSelectors(e3) {
      this._elementSelectors = e3;
    }
    getElementSelectors(e3) {
      var t3, i3 = [];
      return null === (t3 = this._elementSelectors) || void 0 === t3 || t3.forEach((t4) => {
        var r3 = null == a2 ? void 0 : a2.querySelectorAll(t4);
        null == r3 || r3.forEach((r4) => {
          e3 === r4 && i3.push(t4);
        });
      }), i3;
    }
    get isEnabled() {
      var e3, t3, i3 = null === (e3 = this.instance.persistence) || void 0 === e3 ? void 0 : e3.props[le], r3 = this._isDisabledServerSide;
      if ($2(r3) && !L2(i3) && !this.instance.config.advanced_disable_decide) return false;
      var s3 = null !== (t3 = this._isDisabledServerSide) && void 0 !== t3 ? t3 : !!i3;
      return !!this.instance.config.autocapture && !s3;
    }
    _captureEvent(e3) {
      var i3 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "$autocapture";
      if (this.isEnabled) {
        var r3, s3 = Ni(e3);
        if (Ti(s3) && (s3 = s3.parentNode || null), "$autocapture" === i3 && "click" === e3.type && e3 instanceof MouseEvent) this.instance.config.rageclick && null !== (r3 = this.rageclicks) && void 0 !== r3 && r3.isRageClick(e3.clientX, e3.clientY, (/* @__PURE__ */ new Date()).getTime()) && this._captureEvent(e3, "$rageclick");
        var n3 = i3 === v2;
        if (s3 && Hi(s3, e3, this.config, n3, n3 ? ["copy", "cut"] : void 0)) {
          var { props: o3, explicitNoCapture: a3 } = Vn(s3, { e: e3, maskAllElementAttributes: this.instance.config.mask_all_element_attributes, maskAllText: this.instance.config.mask_all_text, elementAttributeIgnoreList: this.config.element_attribute_ignorelist, elementsChainAsString: this._elementsChainAsString });
          if (a3) return false;
          var l3 = this.getElementSelectors(s3);
          if (l3 && l3.length > 0 && (o3.$element_selectors = l3), i3 === v2) {
            var u3, c3 = Ai(null == t2 || null === (u3 = t2.getSelection()) || void 0 === u3 ? void 0 : u3.toString()), d3 = e3.type || "clipboard";
            if (!c3) return false;
            o3.$selected_content = c3, o3.$copy_type = d3;
          }
          return this.instance.capture(i3, o3), true;
        }
      }
    }
    isBrowserSupported() {
      return I2(null == a2 ? void 0 : a2.querySelectorAll);
    }
  };
  var Jn = B2("[TracingHeaders]");
  var Yn = class {
    constructor(e3) {
      W2(this, "_restoreXHRPatch", void 0), W2(this, "_restoreFetchPatch", void 0), W2(this, "_startCapturing", () => {
        var e4, t3, i3, r3;
        R2(this._restoreXHRPatch) && (null === (e4 = _2.__PosthogExtensions__) || void 0 === e4 || null === (t3 = e4.tracingHeadersPatchFns) || void 0 === t3 || t3._patchXHR(this.instance.sessionManager));
        R2(this._restoreFetchPatch) && (null === (i3 = _2.__PosthogExtensions__) || void 0 === i3 || null === (r3 = i3.tracingHeadersPatchFns) || void 0 === r3 || r3._patchFetch(this.instance.sessionManager));
      }), this.instance = e3;
    }
    _loadScript(e3) {
      var t3, i3, r3;
      null !== (t3 = _2.__PosthogExtensions__) && void 0 !== t3 && t3.tracingHeadersPatchFns && e3(), null === (i3 = _2.__PosthogExtensions__) || void 0 === i3 || null === (r3 = i3.loadExternalDependency) || void 0 === r3 || r3.call(i3, this.instance, "tracing-headers", (t4) => {
        if (t4) return Jn.error("failed to load script", t4);
        e3();
      });
    }
    startIfEnabledOrStop() {
      var e3, t3;
      this.instance.config.__add_tracing_headers ? this._loadScript(this._startCapturing) : (null === (e3 = this._restoreXHRPatch) || void 0 === e3 || e3.call(this), null === (t3 = this._restoreFetchPatch) || void 0 === t3 || t3.call(this), this._restoreXHRPatch = void 0, this._restoreFetchPatch = void 0);
    }
  };
  var Kn;
  !function(e3) {
    e3[e3.PENDING = -1] = "PENDING", e3[e3.DENIED = 0] = "DENIED", e3[e3.GRANTED = 1] = "GRANTED";
  }(Kn || (Kn = {}));
  var Xn = class {
    constructor(e3) {
      this.instance = e3;
    }
    get config() {
      return this.instance.config;
    }
    get consent() {
      return this.getDnt() ? Kn.DENIED : this.storedConsent;
    }
    isOptedOut() {
      return this.consent === Kn.DENIED || this.consent === Kn.PENDING && this.config.opt_out_capturing_by_default;
    }
    isOptedIn() {
      return !this.isOptedOut();
    }
    optInOut(e3) {
      this.storage.set(this.storageKey, e3 ? 1 : 0, this.config.cookie_expiration, this.config.cross_subdomain_cookie, this.config.secure_cookie);
    }
    reset() {
      this.storage.remove(this.storageKey, this.config.cross_subdomain_cookie);
    }
    get storageKey() {
      var { token: e3, opt_out_capturing_cookie_prefix: t3 } = this.instance.config;
      return (t3 || "__ph_opt_in_out_") + e3;
    }
    get storedConsent() {
      var e3 = this.storage.get(this.storageKey);
      return "1" === e3 ? Kn.GRANTED : "0" === e3 ? Kn.DENIED : Kn.PENDING;
    }
    get storage() {
      if (!this._storage) {
        var e3 = this.config.opt_out_capturing_persistence_type;
        this._storage = "localStorage" === e3 ? lt : ot;
        var t3 = "localStorage" === e3 ? ot : lt;
        t3.get(this.storageKey) && (this._storage.get(this.storageKey) || this.optInOut("1" === t3.get(this.storageKey)), t3.remove(this.storageKey, this.config.cross_subdomain_cookie));
      }
      return this._storage;
    }
    getDnt() {
      return !!this.config.respect_dnt && !!se([null == o2 ? void 0 : o2.doNotTrack, null == o2 ? void 0 : o2.msDoNotTrack, _2.doNotTrack], (e3) => m2([true, 1, "1", "yes"], e3));
    }
  };
  var Qn = B2("[ExceptionAutocapture]");
  var Zn = class {
    constructor(e3) {
      var i3;
      W2(this, "originalOnUnhandledRejectionHandler", void 0), W2(this, "startCapturing", () => {
        var e4, i4, r3, s3;
        if (t2 && this.isEnabled && !this.hasHandlers && !this.isCapturing) {
          var n3 = null === (e4 = _2.__PosthogExtensions__) || void 0 === e4 || null === (i4 = e4.errorWrappingFunctions) || void 0 === i4 ? void 0 : i4.wrapOnError, o3 = null === (r3 = _2.__PosthogExtensions__) || void 0 === r3 || null === (s3 = r3.errorWrappingFunctions) || void 0 === s3 ? void 0 : s3.wrapUnhandledRejection;
          if (n3 && o3) try {
            this.unwrapOnError = n3(this.captureException.bind(this)), this.unwrapUnhandledRejection = o3(this.captureException.bind(this));
          } catch (e5) {
            Qn.error("failed to start", e5), this.stopCapturing();
          }
          else Qn.error("failed to load error wrapping functions - cannot start");
        }
      }), this.instance = e3, this.remoteEnabled = !(null === (i3 = this.instance.persistence) || void 0 === i3 || !i3.props[ce]), this.startIfEnabled();
    }
    get isEnabled() {
      var e3;
      return null !== (e3 = this.remoteEnabled) && void 0 !== e3 && e3;
    }
    get isCapturing() {
      var e3;
      return !(null == t2 || null === (e3 = t2.onerror) || void 0 === e3 || !e3.__POSTHOG_INSTRUMENTED__);
    }
    get hasHandlers() {
      return this.originalOnUnhandledRejectionHandler || this.unwrapOnError;
    }
    startIfEnabled() {
      this.isEnabled && !this.isCapturing && (Qn.info("enabled, starting..."), this.loadScript(this.startCapturing));
    }
    loadScript(e3) {
      var t3, i3;
      this.hasHandlers && e3(), null === (t3 = _2.__PosthogExtensions__) || void 0 === t3 || null === (i3 = t3.loadExternalDependency) || void 0 === i3 || i3.call(t3, this.instance, "exception-autocapture", (t4) => {
        if (t4) return Qn.error("failed to load script", t4);
        e3();
      });
    }
    stopCapturing() {
      var e3, t3;
      null === (e3 = this.unwrapOnError) || void 0 === e3 || e3.call(this), null === (t3 = this.unwrapUnhandledRejection) || void 0 === t3 || t3.call(this);
    }
    onRemoteConfig(e3) {
      var t3 = e3.autocaptureExceptions;
      this.remoteEnabled = !!t3 || false, this.instance.persistence && this.instance.persistence.register({ [ce]: this.remoteEnabled }), this.startIfEnabled();
    }
    captureException(e3) {
      var t3 = this.instance.requestRouter.endpointFor("ui");
      e3.$exception_personURL = "".concat(t3, "/project/").concat(this.instance.config.token, "/person/").concat(this.instance.get_distinct_id()), this.instance.exceptions.sendExceptionEvent(e3);
    }
  };
  var eo = B2("[Web Vitals]");
  var to = 9e5;
  var io = class {
    constructor(e3) {
      var t3;
      W2(this, "_enabledServerSide", false), W2(this, "_initialized", false), W2(this, "buffer", { url: void 0, metrics: [], firstMetricTimestamp: void 0 }), W2(this, "_flushToCapture", () => {
        clearTimeout(this._delayedFlushTimer), 0 !== this.buffer.metrics.length && (this.instance.capture("$web_vitals", this.buffer.metrics.reduce((e4, t4) => j2(j2({}, e4), {}, { ["$web_vitals_".concat(t4.name, "_event")]: j2({}, t4), ["$web_vitals_".concat(t4.name, "_value")]: t4.value }), {})), this.buffer = { url: void 0, metrics: [], firstMetricTimestamp: void 0 });
      }), W2(this, "_addToBuffer", (e4) => {
        var t4, i3 = null === (t4 = this.instance.sessionManager) || void 0 === t4 ? void 0 : t4.checkAndGetSessionAndWindowId(true);
        if (R2(i3)) eo.error("Could not read session ID. Dropping metrics!");
        else {
          this.buffer = this.buffer || { url: void 0, metrics: [], firstMetricTimestamp: void 0 };
          var r3 = this._currentURL();
          if (!R2(r3)) if (M2(null == e4 ? void 0 : e4.name) || M2(null == e4 ? void 0 : e4.value)) eo.error("Invalid metric received", e4);
          else if (this._maxAllowedValue && e4.value >= this._maxAllowedValue) eo.error("Ignoring metric with value >= " + this._maxAllowedValue, e4);
          else this.buffer.url !== r3 && (this._flushToCapture(), this._delayedFlushTimer = setTimeout(this._flushToCapture, this.flushToCaptureTimeoutMs)), R2(this.buffer.url) && (this.buffer.url = r3), this.buffer.firstMetricTimestamp = R2(this.buffer.firstMetricTimestamp) ? Date.now() : this.buffer.firstMetricTimestamp, e4.attribution && e4.attribution.interactionTargetElement && (e4.attribution.interactionTargetElement = void 0), this.buffer.metrics.push(j2(j2({}, e4), {}, { $current_url: r3, $session_id: i3.sessionId, $window_id: i3.windowId, timestamp: Date.now() })), this.buffer.metrics.length === this.allowedMetrics.length && this._flushToCapture();
        }
      }), W2(this, "_startCapturing", () => {
        var e4, t4, i3, r3, s3 = _2.__PosthogExtensions__;
        R2(s3) || R2(s3.postHogWebVitalsCallbacks) || ({ onLCP: e4, onCLS: t4, onFCP: i3, onINP: r3 } = s3.postHogWebVitalsCallbacks), e4 && t4 && i3 && r3 ? (this.allowedMetrics.indexOf("LCP") > -1 && e4(this._addToBuffer.bind(this)), this.allowedMetrics.indexOf("CLS") > -1 && t4(this._addToBuffer.bind(this)), this.allowedMetrics.indexOf("FCP") > -1 && i3(this._addToBuffer.bind(this)), this.allowedMetrics.indexOf("INP") > -1 && r3(this._addToBuffer.bind(this)), this._initialized = true) : eo.error("web vitals callbacks not loaded - not starting");
      }), this.instance = e3, this._enabledServerSide = !(null === (t3 = this.instance.persistence) || void 0 === t3 || !t3.props[de]), this.startIfEnabled();
    }
    get allowedMetrics() {
      var e3, t3, i3 = C2(this.instance.config.capture_performance) ? null === (e3 = this.instance.config.capture_performance) || void 0 === e3 ? void 0 : e3.web_vitals_allowed_metrics : void 0;
      return R2(i3) ? (null === (t3 = this.instance.persistence) || void 0 === t3 ? void 0 : t3.props[_e]) || ["CLS", "FCP", "INP", "LCP"] : i3;
    }
    get flushToCaptureTimeoutMs() {
      return (C2(this.instance.config.capture_performance) ? this.instance.config.capture_performance.web_vitals_delayed_flush_ms : void 0) || 5e3;
    }
    get _maxAllowedValue() {
      var e3 = C2(this.instance.config.capture_performance) && O2(this.instance.config.capture_performance.__web_vitals_max_value) ? this.instance.config.capture_performance.__web_vitals_max_value : to;
      return 0 < e3 && e3 <= 6e4 ? to : e3;
    }
    get isEnabled() {
      var e3 = C2(this.instance.config.capture_performance) ? this.instance.config.capture_performance.web_vitals : void 0;
      return L2(e3) ? e3 : this._enabledServerSide;
    }
    startIfEnabled() {
      this.isEnabled && !this._initialized && (eo.info("enabled, starting..."), this.loadScript(this._startCapturing));
    }
    onRemoteConfig(e3) {
      var t3 = C2(e3.capturePerformance) && !!e3.capturePerformance.web_vitals, i3 = C2(e3.capturePerformance) ? e3.capturePerformance.web_vitals_allowed_metrics : void 0;
      this.instance.persistence && (this.instance.persistence.register({ [de]: t3 }), this.instance.persistence.register({ [_e]: i3 })), this._enabledServerSide = t3, this.startIfEnabled();
    }
    loadScript(e3) {
      var t3, i3, r3;
      null !== (t3 = _2.__PosthogExtensions__) && void 0 !== t3 && t3.postHogWebVitalsCallbacks && e3(), null === (i3 = _2.__PosthogExtensions__) || void 0 === i3 || null === (r3 = i3.loadExternalDependency) || void 0 === r3 || r3.call(i3, this.instance, "web-vitals", (t4) => {
        t4 ? eo.error("failed to load script", t4) : e3();
      });
    }
    _currentURL() {
      var e3 = t2 ? t2.location.href : void 0;
      return e3 || eo.error("Could not determine current URL"), e3;
    }
  };
  var ro = { icontains: (e3, i3) => !!t2 && i3.href.toLowerCase().indexOf(e3.toLowerCase()) > -1, not_icontains: (e3, i3) => !!t2 && -1 === i3.href.toLowerCase().indexOf(e3.toLowerCase()), regex: (e3, i3) => !!t2 && ft(i3.href, e3), not_regex: (e3, i3) => !!t2 && !ft(i3.href, e3), exact: (e3, t3) => t3.href === e3, is_not: (e3, t3) => t3.href !== e3 };
  var so = class _so {
    constructor(e3) {
      var t3 = this;
      W2(this, "getWebExperimentsAndEvaluateDisplayLogic", function() {
        var e4 = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
        t3.getWebExperiments((e5) => {
          _so.logInfo("retrieved web experiments from the server"), t3._flagToExperiments = /* @__PURE__ */ new Map(), e5.forEach((e6) => {
            if (e6.feature_flag_key) {
              var i3;
              if (t3._flagToExperiments) _so.logInfo("setting flag key ", e6.feature_flag_key, " to web experiment ", e6), null === (i3 = t3._flagToExperiments) || void 0 === i3 || i3.set(e6.feature_flag_key, e6);
              var r3 = t3.instance.getFeatureFlag(e6.feature_flag_key);
              F2(r3) && e6.variants[r3] && t3.applyTransforms(e6.name, r3, e6.variants[r3].transforms);
            } else if (e6.variants) for (var s3 in e6.variants) {
              var n3 = e6.variants[s3];
              _so.matchesTestVariant(n3) && t3.applyTransforms(e6.name, s3, n3.transforms);
            }
          });
        }, e4);
      }), this.instance = e3, this.instance.onFeatureFlags((e4) => {
        this.onFeatureFlags(e4);
      });
    }
    onFeatureFlags(e3) {
      if (this._is_bot()) _so.logInfo("Refusing to render web experiment since the viewer is a likely bot");
      else if (!this.instance.config.disable_web_experiments) {
        if (M2(this._flagToExperiments)) return this._flagToExperiments = /* @__PURE__ */ new Map(), this.loadIfEnabled(), void this.previewWebExperiment();
        _so.logInfo("applying feature flags", e3), e3.forEach((e4) => {
          var t3;
          if (this._flagToExperiments && null !== (t3 = this._flagToExperiments) && void 0 !== t3 && t3.has(e4)) {
            var i3, r3 = this.instance.getFeatureFlag(e4), s3 = null === (i3 = this._flagToExperiments) || void 0 === i3 ? void 0 : i3.get(e4);
            r3 && null != s3 && s3.variants[r3] && this.applyTransforms(s3.name, r3, s3.variants[r3].transforms);
          }
        });
      }
    }
    previewWebExperiment() {
      var e3 = _so.getWindowLocation();
      if (null != e3 && e3.search) {
        var t3 = bt(null == e3 ? void 0 : e3.search, "__experiment_id"), i3 = bt(null == e3 ? void 0 : e3.search, "__experiment_variant");
        t3 && i3 && (_so.logInfo("previewing web experiments ".concat(t3, " && ").concat(i3)), this.getWebExperiments((e4) => {
          this.showPreviewWebExperiment(parseInt(t3), i3, e4);
        }, false, true));
      }
    }
    loadIfEnabled() {
      this.instance.config.disable_web_experiments || this.getWebExperimentsAndEvaluateDisplayLogic();
    }
    getWebExperiments(e3, t3, i3) {
      if (this.instance.config.disable_web_experiments && !i3) return e3([]);
      var r3 = this.instance.get_property("$web_experiments");
      if (r3 && !t3) return e3(r3);
      this.instance._send_request({ url: this.instance.requestRouter.endpointFor("api", "/api/web_experiments/?token=".concat(this.instance.config.token)), method: "GET", callback: (t4) => {
        if (200 !== t4.statusCode || !t4.json) return e3([]);
        var i4 = t4.json.experiments || [];
        return e3(i4);
      } });
    }
    showPreviewWebExperiment(e3, t3, i3) {
      var r3 = i3.filter((t4) => t4.id === e3);
      r3 && r3.length > 0 && (_so.logInfo("Previewing web experiment [".concat(r3[0].name, "] with variant [").concat(t3, "]")), this.applyTransforms(r3[0].name, t3, r3[0].variants[t3].transforms));
    }
    static matchesTestVariant(e3) {
      return !M2(e3.conditions) && (_so.matchUrlConditions(e3) && _so.matchUTMConditions(e3));
    }
    static matchUrlConditions(e3) {
      var t3;
      if (M2(e3.conditions) || M2(null === (t3 = e3.conditions) || void 0 === t3 ? void 0 : t3.url)) return true;
      var i3, r3, s3, n3 = _so.getWindowLocation();
      return !!n3 && (null === (i3 = e3.conditions) || void 0 === i3 || !i3.url || ro[null !== (r3 = null === (s3 = e3.conditions) || void 0 === s3 ? void 0 : s3.urlMatchType) && void 0 !== r3 ? r3 : "icontains"](e3.conditions.url, n3));
    }
    static getWindowLocation() {
      return null == t2 ? void 0 : t2.location;
    }
    static matchUTMConditions(e3) {
      var t3;
      if (M2(e3.conditions) || M2(null === (t3 = e3.conditions) || void 0 === t3 ? void 0 : t3.utm)) return true;
      var i3 = wi.campaignParams();
      if (i3.utm_source) {
        var r3, s3, n3, o3, a3, l3, u3, c3, d3, h3, _3, p3, v3, g3, f2, m3, b3 = null === (r3 = e3.conditions) || void 0 === r3 || null === (s3 = r3.utm) || void 0 === s3 || !s3.utm_campaign || (null === (n3 = e3.conditions) || void 0 === n3 || null === (o3 = n3.utm) || void 0 === o3 ? void 0 : o3.utm_campaign) == i3.utm_campaign, y3 = null === (a3 = e3.conditions) || void 0 === a3 || null === (l3 = a3.utm) || void 0 === l3 || !l3.utm_source || (null === (u3 = e3.conditions) || void 0 === u3 || null === (c3 = u3.utm) || void 0 === c3 ? void 0 : c3.utm_source) == i3.utm_source, w3 = null === (d3 = e3.conditions) || void 0 === d3 || null === (h3 = d3.utm) || void 0 === h3 || !h3.utm_medium || (null === (_3 = e3.conditions) || void 0 === _3 || null === (p3 = _3.utm) || void 0 === p3 ? void 0 : p3.utm_medium) == i3.utm_medium, S3 = null === (v3 = e3.conditions) || void 0 === v3 || null === (g3 = v3.utm) || void 0 === g3 || !g3.utm_term || (null === (f2 = e3.conditions) || void 0 === f2 || null === (m3 = f2.utm) || void 0 === m3 ? void 0 : m3.utm_term) == i3.utm_term;
        return b3 && w3 && S3 && y3;
      }
      return false;
    }
    static logInfo(e3) {
      for (var t3 = arguments.length, i3 = new Array(t3 > 1 ? t3 - 1 : 0), r3 = 1; r3 < t3; r3++) i3[r3 - 1] = arguments[r3];
      q2.info("[WebExperiments] ".concat(e3), i3);
    }
    applyTransforms(e3, t3, i3) {
      this._is_bot() ? _so.logInfo("Refusing to render web experiment since the viewer is a likely bot") : "control" !== t3 ? i3.forEach((i4) => {
        if (i4.selector) {
          var r3;
          _so.logInfo("applying transform of variant ".concat(t3, " for experiment ").concat(e3, " "), i4);
          var s3 = null === (r3 = document) || void 0 === r3 ? void 0 : r3.querySelectorAll(i4.selector);
          null == s3 || s3.forEach((e4) => {
            var t4 = e4;
            i4.attributes && i4.attributes.forEach((e5) => {
              switch (e5.name) {
                case "text":
                  t4.innerText = e5.value;
                  break;
                case "html":
                  t4.innerHTML = e5.value;
                  break;
                case "cssClass":
                  t4.className = e5.value;
                  break;
                default:
                  t4.setAttribute(e5.name, e5.value);
              }
            }), i4.text && (t4.innerText = i4.text), i4.html && (t4.parentElement ? t4.parentElement.innerHTML = i4.html : t4.innerHTML = i4.html), i4.css && t4.setAttribute("style", i4.css);
          });
        }
      }) : _so.logInfo("Control variants leave the page unmodified.");
    }
    _is_bot() {
      return o2 && this.instance ? $n(o2, this.instance.config.custom_blocked_useragents) : void 0;
    }
  };
  var no = class {
    constructor(e3) {
      this.instance = e3;
    }
    sendExceptionEvent(e3) {
      this.instance.capture("$exception", e3, { _noTruncate: true, _batchKey: "exceptionEvent" });
    }
  };
  var oo = ["$set_once", "$set"];
  var ao = B2("[SiteApps]");
  var lo = class {
    constructor(e3) {
      this.instance = e3, this.bufferedInvocations = [], this.apps = {};
    }
    get isEnabled() {
      return !!this.instance.config.opt_in_site_apps;
    }
    eventCollector(e3, t3) {
      if (t3) {
        var i3 = this.globalsForEvent(t3);
        this.bufferedInvocations.push(i3), this.bufferedInvocations.length > 1e3 && (this.bufferedInvocations = this.bufferedInvocations.slice(10));
      }
    }
    get siteAppLoaders() {
      var e3, t3;
      return null === (e3 = _2._POSTHOG_REMOTE_CONFIG) || void 0 === e3 || null === (t3 = e3[this.instance.config.token]) || void 0 === t3 ? void 0 : t3.siteApps;
    }
    init() {
      if (this.isEnabled) {
        var e3 = this.instance._addCaptureHook(this.eventCollector.bind(this));
        this.stopBuffering = () => {
          e3(), this.bufferedInvocations = [], this.stopBuffering = void 0;
        };
      }
    }
    globalsForEvent(e3) {
      var t3, i3, r3, s3, n3, o3, a3;
      if (!e3) throw new Error("Event payload is required");
      var l3 = {}, u3 = this.instance.get_property("$groups") || [], c3 = this.instance.get_property("$stored_group_properties") || {};
      for (var [d3, h3] of Object.entries(c3)) l3[d3] = { id: u3[d3], type: d3, properties: h3 };
      var { $set_once: _3, $set: p3 } = e3;
      return { event: j2(j2({}, V2(e3, oo)), {}, { properties: j2(j2(j2({}, e3.properties), p3 ? { $set: j2(j2({}, null !== (t3 = null === (i3 = e3.properties) || void 0 === i3 ? void 0 : i3.$set) && void 0 !== t3 ? t3 : {}), p3) } : {}), _3 ? { $set_once: j2(j2({}, null !== (r3 = null === (s3 = e3.properties) || void 0 === s3 ? void 0 : s3.$set_once) && void 0 !== r3 ? r3 : {}), _3) } : {}), elements_chain: null !== (n3 = null === (o3 = e3.properties) || void 0 === o3 ? void 0 : o3.$elements_chain) && void 0 !== n3 ? n3 : "", distinct_id: null === (a3 = e3.properties) || void 0 === a3 ? void 0 : a3.distinct_id }), person: { properties: this.instance.get_property("$stored_person_properties") }, groups: l3 };
    }
    setupSiteApp(e3) {
      var t3 = { id: e3.id, loaded: false, errored: false };
      this.apps[e3.id] = t3;
      var i3 = (i4) => {
        var r4;
        for (var s3 of (this.apps[e3.id].errored = !i4, this.apps[e3.id].loaded = true, ao.info("Site app with id ".concat(e3.id, " ").concat(i4 ? "loaded" : "errored")), i4 && this.bufferedInvocations.length && (ao.info("Processing ".concat(this.bufferedInvocations.length, " events for site app with id ").concat(e3.id)), this.bufferedInvocations.forEach((e4) => {
          var i5;
          return null === (i5 = t3.processEvent) || void 0 === i5 ? void 0 : i5.call(t3, e4);
        })), Object.values(this.apps))) if (!s3.loaded) return;
        null === (r4 = this.stopBuffering) || void 0 === r4 || r4.call(this);
      };
      try {
        var { processEvent: r3 } = e3.init({ posthog: this.instance, callback: (e4) => {
          i3(e4);
        } });
        r3 && (t3.processEvent = r3);
      } catch (t4) {
        ao.error("Error while initializing PostHog app with config id ".concat(e3.id), t4), i3(false);
      }
    }
    onCapturedEvent(e3) {
      if (0 !== Object.keys(this.apps).length) {
        var t3 = this.globalsForEvent(e3);
        for (var i3 of Object.values(this.apps)) try {
          var r3;
          null === (r3 = i3.processEvent) || void 0 === r3 || r3.call(i3, t3);
        } catch (t4) {
          ao.error("Error while processing event ".concat(e3.event, " for site app ").concat(i3.id), t4);
        }
      }
    }
    onRemoteConfig(e3) {
      var t3, i3, r3, s3 = this;
      if (null !== (t3 = this.siteAppLoaders) && void 0 !== t3 && t3.length) {
        if (!this.isEnabled) return void ao.error('PostHog site apps are disabled. Enable the "opt_in_site_apps" config to proceed.');
        for (var n3 of this.siteAppLoaders) this.setupSiteApp(n3);
        this.instance.on("eventCaptured", (e4) => this.onCapturedEvent(e4));
      } else if (null === (i3 = this.stopBuffering) || void 0 === i3 || i3.call(this), null !== (r3 = e3.siteApps) && void 0 !== r3 && r3.length) if (this.isEnabled) {
        var o3 = function(e4, t4) {
          var i4, r4;
          _2["__$$ph_site_app_".concat(e4)] = s3.instance, null === (i4 = _2.__PosthogExtensions__) || void 0 === i4 || null === (r4 = i4.loadSiteApp) || void 0 === r4 || r4.call(i4, s3.instance, t4, (t5) => {
            if (t5) return ao.error("Error while initializing PostHog app with config id ".concat(e4), t5);
          });
        };
        for (var { id: a3, url: l3 } of e3.siteApps) o3(a3, l3);
      } else ao.error('PostHog site apps are disabled. Enable the "opt_in_site_apps" config to proceed.');
    }
  };
  function uo(e3, t3, i3) {
    return ms({ distinct_id: e3, userPropertiesToSet: t3, userPropertiesToSetOnce: i3 });
  }
  var co = {};
  var ho = () => {
  };
  var _o = "posthog";
  var po = !vs && -1 === (null == h2 ? void 0 : h2.indexOf("MSIE")) && -1 === (null == h2 ? void 0 : h2.indexOf("Mozilla"));
  var vo = () => {
    var e3, i3, r3;
    return { api_host: "https://us.i.posthog.com", ui_host: null, token: "", autocapture: true, rageclick: true, cross_subdomain_cookie: (i3 = null == a2 ? void 0 : a2.location, r3 = null == i3 ? void 0 : i3.hostname, !!F2(r3) && "herokuapp.com" !== r3.split(".").slice(-2).join(".")), persistence: "localStorage+cookie", persistence_name: "", loaded: ho, store_google: true, custom_campaign_params: [], custom_blocked_useragents: [], save_referrer: true, capture_pageview: true, capture_pageleave: "if_capture_pageview", debug: l2 && F2(null == l2 ? void 0 : l2.search) && -1 !== l2.search.indexOf("__posthog_debug=true") || false, verbose: false, cookie_expiration: 365, upgrade: false, disable_session_recording: false, disable_persistence: false, disable_web_experiments: true, disable_surveys: false, enable_recording_console_log: void 0, secure_cookie: "https:" === (null == t2 || null === (e3 = t2.location) || void 0 === e3 ? void 0 : e3.protocol), ip: true, opt_out_capturing_by_default: false, opt_out_persistence_by_default: false, opt_out_useragent_filter: false, opt_out_capturing_persistence_type: "localStorage", opt_out_capturing_cookie_prefix: null, opt_in_site_apps: false, property_denylist: [], respect_dnt: false, sanitize_properties: null, request_headers: {}, inapp_protocol: "//", inapp_link_new_window: false, request_batching: true, properties_string_max_length: 65535, session_recording: {}, mask_all_element_attributes: false, mask_all_text: false, mask_personal_data_properties: false, custom_personal_data_properties: [], advanced_disable_decide: false, advanced_disable_feature_flags: false, advanced_disable_feature_flags_on_first_load: false, advanced_disable_toolbar_metrics: false, feature_flag_request_timeout_ms: 3e3, on_request_error: (e4) => {
      var t3 = "Bad HTTP status: " + e4.statusCode + " " + e4.text;
      q2.error(t3);
    }, get_device_id: (e4) => e4, _onCapture: ho, capture_performance: void 0, name: "posthog", bootstrap: {}, disable_compression: false, session_idle_timeout_seconds: 1800, person_profiles: "identified_only", __add_tracing_headers: false, before_send: void 0 };
  };
  var go = (e3) => {
    var t3 = {};
    R2(e3.process_person) || (t3.person_profiles = e3.process_person), R2(e3.xhr_headers) || (t3.request_headers = e3.xhr_headers), R2(e3.cookie_name) || (t3.persistence_name = e3.cookie_name), R2(e3.disable_cookie) || (t3.disable_persistence = e3.disable_cookie);
    var i3 = K2({}, t3, e3);
    return x2(e3.property_blacklist) && (R2(e3.property_denylist) ? i3.property_denylist = e3.property_blacklist : x2(e3.property_denylist) ? i3.property_denylist = [...e3.property_blacklist, ...e3.property_denylist] : q2.error("Invalid value for property_denylist config: " + e3.property_denylist)), i3;
  };
  var fo = class {
    constructor() {
      W2(this, "__forceAllowLocalhost", false);
    }
    get _forceAllowLocalhost() {
      return this.__forceAllowLocalhost;
    }
    set _forceAllowLocalhost(e3) {
      q2.error("WebPerformanceObserver is deprecated and has no impact on network capture. Use `_forceAllowLocalhostNetworkCapture` on `posthog.sessionRecording`"), this.__forceAllowLocalhost = e3;
    }
  };
  var mo = class _mo {
    get decideEndpointWasHit() {
      var e3, t3;
      return null !== (e3 = null === (t3 = this.featureFlags) || void 0 === t3 ? void 0 : t3.hasLoadedFlags) && void 0 !== e3 && e3;
    }
    constructor() {
      W2(this, "webPerformance", new fo()), W2(this, "version", p2.LIB_VERSION), W2(this, "_internalEventEmitter", new bn()), this.config = vo(), this.SentryIntegration = Fs, this.sentryIntegration = (e3) => function(e4, t3) {
        var i3 = Rs(e4, t3);
        return { name: Ps, processEvent: (e5) => i3(e5) };
      }(this, e3), this.__request_queue = [], this.__loaded = false, this.analyticsDefaultEndpoint = "/e/", this._initialPageviewCaptured = false, this._initialPersonProfilesConfig = null, this._cachedIdentify = null, this.featureFlags = new Ge(this), this.toolbar = new hs(this), this.scrollManager = new Hn(this), this.pageViewManager = new Ms(this), this.surveys = new xn(this), this.experiments = new so(this), this.exceptions = new no(this), this.rateLimiter = new Cn(this), this.requestRouter = new Cs(this), this.consent = new Xn(this), this.people = { set: (e3, t3, i3) => {
        var r3 = F2(e3) ? { [e3]: t3 } : e3;
        this.setPersonProperties(r3), null == i3 || i3({});
      }, set_once: (e3, t3, i3) => {
        var r3 = F2(e3) ? { [e3]: t3 } : e3;
        this.setPersonProperties(void 0, r3), null == i3 || i3({});
      } }, this.on("eventCaptured", (e3) => q2.info('send "'.concat(null == e3 ? void 0 : e3.event, '"'), e3));
    }
    init(e3, t3, i3) {
      if (i3 && i3 !== _o) {
        var r3, s3 = null !== (r3 = co[i3]) && void 0 !== r3 ? r3 : new _mo();
        return s3._init(e3, t3, i3), co[i3] = s3, co[_o][i3] = s3, s3;
      }
      return this._init(e3, t3, i3);
    }
    _init(i3) {
      var r3, s3, n3, o3 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, a3 = arguments.length > 2 ? arguments[2] : void 0;
      if (R2(i3) || T2(i3)) return q2.critical("PostHog was initialized without a token. This likely indicates a misconfiguration. Please check the first argument passed to posthog.init()"), this;
      if (this.__loaded) return q2.warn("You have already initialized PostHog! Re-initializing is a no-op"), this;
      this.__loaded = true, this.config = {}, this._triggered_notifs = [], o3.person_profiles && (this._initialPersonProfilesConfig = o3.person_profiles), this.set_config(K2({}, vo(), go(o3), { name: a3, token: i3 })), this.config.on_xhr_error && q2.error("on_xhr_error is deprecated. Use on_request_error instead"), this.compression = o3.disable_compression ? void 0 : e2.GZipJS, this.persistence = new Ei(this.config), this.sessionPersistence = "sessionStorage" === this.config.persistence || "memory" === this.config.persistence ? this.persistence : new Ei(j2(j2({}, this.config), {}, { persistence: "sessionStorage" }));
      var l3 = j2({}, this.persistence.props), u3 = j2({}, this.sessionPersistence.props);
      if (this._requestQueue = new _s((e3) => this._send_retriable_request(e3)), this._retryQueue = new Ss(this), this.__request_queue = [], this.config.__preview_experimental_cookieless_mode || (this.sessionManager = new xs(this), this.sessionPropsManager = new Rn(this, this.sessionManager, this.persistence)), new Yn(this).startIfEnabledOrStop(), this.siteApps = new lo(this), null === (r3 = this.siteApps) || void 0 === r3 || r3.init(), this.config.__preview_experimental_cookieless_mode || (this.sessionRecording = new ns(this), this.sessionRecording.startIfEnabledOrStop()), this.config.disable_scroll_properties || this.scrollManager.startMeasuringScrollPosition(), this.autocapture = new Gn(this), this.autocapture.startIfEnabled(), this.surveys.loadIfEnabled(), this.heatmaps = new Bn(this), this.heatmaps.startIfEnabled(), this.webVitalsAutocapture = new io(this), this.exceptionObserver = new Zn(this), this.exceptionObserver.startIfEnabled(), this.deadClicksAutocapture = new Dn(this, An), this.deadClicksAutocapture.startIfEnabled(), p2.DEBUG = p2.DEBUG || this.config.debug, p2.DEBUG && q2.info("Starting in debug mode", { this: this, config: o3, thisC: j2({}, this.config), p: l3, s: u3 }), this._sync_opt_out_with_persistence(), void 0 !== (null === (s3 = o3.bootstrap) || void 0 === s3 ? void 0 : s3.distinctID)) {
        var c3, d3, h3 = this.config.get_device_id(et()), _3 = null !== (c3 = o3.bootstrap) && void 0 !== c3 && c3.isIdentifiedID ? h3 : o3.bootstrap.distinctID;
        this.persistence.set_property($e, null !== (d3 = o3.bootstrap) && void 0 !== d3 && d3.isIdentifiedID ? "identified" : "anonymous"), this.register({ distinct_id: o3.bootstrap.distinctID, $device_id: _3 });
      }
      if (this._hasBootstrappedFeatureFlags()) {
        var v3, g3, f2 = Object.keys((null === (v3 = o3.bootstrap) || void 0 === v3 ? void 0 : v3.featureFlags) || {}).filter((e3) => {
          var t3, i4;
          return !(null === (t3 = o3.bootstrap) || void 0 === t3 || null === (i4 = t3.featureFlags) || void 0 === i4 || !i4[e3]);
        }).reduce((e3, t3) => {
          var i4, r4;
          return e3[t3] = (null === (i4 = o3.bootstrap) || void 0 === i4 || null === (r4 = i4.featureFlags) || void 0 === r4 ? void 0 : r4[t3]) || false, e3;
        }, {}), m3 = Object.keys((null === (g3 = o3.bootstrap) || void 0 === g3 ? void 0 : g3.featureFlagPayloads) || {}).filter((e3) => f2[e3]).reduce((e3, t3) => {
          var i4, r4, s4, n4;
          null !== (i4 = o3.bootstrap) && void 0 !== i4 && null !== (r4 = i4.featureFlagPayloads) && void 0 !== r4 && r4[t3] && (e3[t3] = null === (s4 = o3.bootstrap) || void 0 === s4 || null === (n4 = s4.featureFlagPayloads) || void 0 === n4 ? void 0 : n4[t3]);
          return e3;
        }, {});
        this.featureFlags.receivedFeatureFlags({ featureFlags: f2, featureFlagPayloads: m3 });
      }
      if (this.config.__preview_experimental_cookieless_mode) this.register_once({ distinct_id: Be, $device_id: null }, "");
      else if (!this.get_distinct_id()) {
        var b3 = this.config.get_device_id(et());
        this.register_once({ distinct_id: b3, $device_id: b3 }, ""), this.persistence.set_property($e, "anonymous");
      }
      return null == t2 || null === (n3 = t2.addEventListener) || void 0 === n3 || n3.call(t2, "onpagehide" in self ? "pagehide" : "unload", this._handle_unload.bind(this)), this.toolbar.maybeLoadToolbar(), o3.segment ? $s(this, () => this._loaded()) : this._loaded(), I2(this.config._onCapture) && this.config._onCapture !== ho && (q2.warn("onCapture is deprecated. Please use `before_send` instead"), this.on("eventCaptured", (e3) => this.config._onCapture(e3.event, e3))), this;
    }
    _onRemoteConfig(t3) {
      var i3, r3, s3, n3, o3, l3, u3, c3;
      if (!a2 || !a2.body) return q2.info("document not ready yet, trying again in 500 milliseconds..."), void setTimeout(() => {
        this._onRemoteConfig(t3);
      }, 500);
      this.compression = void 0, t3.supportedCompression && !this.config.disable_compression && (this.compression = m2(t3.supportedCompression, e2.GZipJS) ? e2.GZipJS : m2(t3.supportedCompression, e2.Base64) ? e2.Base64 : void 0), null !== (i3 = t3.analytics) && void 0 !== i3 && i3.endpoint && (this.analyticsDefaultEndpoint = t3.analytics.endpoint), this.set_config({ person_profiles: this._initialPersonProfilesConfig ? this._initialPersonProfilesConfig : "identified_only" }), null === (r3 = this.siteApps) || void 0 === r3 || r3.onRemoteConfig(t3), null === (s3 = this.sessionRecording) || void 0 === s3 || s3.onRemoteConfig(t3), null === (n3 = this.autocapture) || void 0 === n3 || n3.onRemoteConfig(t3), null === (o3 = this.heatmaps) || void 0 === o3 || o3.onRemoteConfig(t3), this.surveys.onRemoteConfig(t3), null === (l3 = this.webVitalsAutocapture) || void 0 === l3 || l3.onRemoteConfig(t3), null === (u3 = this.exceptionObserver) || void 0 === u3 || u3.onRemoteConfig(t3), null === (c3 = this.deadClicksAutocapture) || void 0 === c3 || c3.onRemoteConfig(t3);
    }
    _loaded() {
      try {
        this.config.loaded(this);
      } catch (e3) {
        q2.critical("`loaded` function failed", e3);
      }
      this._start_queue_if_opted_in(), this.config.capture_pageview && setTimeout(() => {
        this.consent.isOptedIn() && this._captureInitialPageview();
      }, 1), new as(this).load(), this.featureFlags.decide();
    }
    _start_queue_if_opted_in() {
      var e3;
      this.has_opted_out_capturing() || this.config.request_batching && (null === (e3 = this._requestQueue) || void 0 === e3 || e3.enable());
    }
    _dom_loaded() {
      this.has_opted_out_capturing() || J2(this.__request_queue, (e3) => this._send_retriable_request(e3)), this.__request_queue = [], this._start_queue_if_opted_in();
    }
    _handle_unload() {
      var e3, t3;
      this.config.request_batching ? (this._shouldCapturePageleave() && this.capture("$pageleave"), null === (e3 = this._requestQueue) || void 0 === e3 || e3.unload(), null === (t3 = this._retryQueue) || void 0 === t3 || t3.unload()) : this._shouldCapturePageleave() && this.capture("$pageleave", null, { transport: "sendBeacon" });
    }
    _send_request(e3) {
      this.__loaded && (po ? this.__request_queue.push(e3) : this.rateLimiter.isServerRateLimited(e3.batchKey) || (e3.transport = e3.transport || this.config.api_transport, e3.url = fs(e3.url, { ip: this.config.ip ? 1 : 0 }), e3.headers = j2({}, this.config.request_headers), e3.compression = "best-available" === e3.compression ? this.compression : e3.compression, e3.fetchOptions = e3.fetchOptions || this.config.fetch_options, ((e4) => {
        var t3, i3, r3, s3 = j2({}, e4);
        s3.timeout = s3.timeout || 6e4, s3.url = fs(s3.url, { _: (/* @__PURE__ */ new Date()).getTime().toString(), ver: p2.LIB_VERSION, compression: s3.compression });
        var n3 = null !== (t3 = s3.transport) && void 0 !== t3 ? t3 : "fetch", o3 = null !== (i3 = null === (r3 = se(ys, (e5) => e5.transport === n3)) || void 0 === r3 ? void 0 : r3.method) && void 0 !== i3 ? i3 : ys[0].method;
        if (!o3) throw new Error("No available transport method");
        o3(s3);
      })(j2(j2({}, e3), {}, { callback: (t3) => {
        var i3, r3, s3;
        (this.rateLimiter.checkForLimiting(t3), t3.statusCode >= 400) && (null === (r3 = (s3 = this.config).on_request_error) || void 0 === r3 || r3.call(s3, t3));
        null === (i3 = e3.callback) || void 0 === i3 || i3.call(e3, t3);
      } }))));
    }
    _send_retriable_request(e3) {
      this._retryQueue ? this._retryQueue.retriableRequest(e3) : this._send_request(e3);
    }
    _execute_array(e3) {
      var t3, i3 = [], r3 = [], s3 = [];
      J2(e3, (e4) => {
        e4 && (t3 = e4[0], x2(t3) ? s3.push(e4) : I2(e4) ? e4.call(this) : x2(e4) && "alias" === t3 ? i3.push(e4) : x2(e4) && -1 !== t3.indexOf("capture") && I2(this[t3]) ? s3.push(e4) : r3.push(e4));
      });
      var n3 = function(e4, t4) {
        J2(e4, function(e5) {
          if (x2(e5[0])) {
            var i4 = t4;
            Y2(e5, function(e6) {
              i4 = i4[e6[0]].apply(i4, e6.slice(1));
            });
          } else this[e5[0]].apply(this, e5.slice(1));
        }, t4);
      };
      n3(i3, this), n3(r3, this), n3(s3, this);
    }
    _hasBootstrappedFeatureFlags() {
      var e3, t3;
      return (null === (e3 = this.config.bootstrap) || void 0 === e3 ? void 0 : e3.featureFlags) && Object.keys(null === (t3 = this.config.bootstrap) || void 0 === t3 ? void 0 : t3.featureFlags).length > 0 || false;
    }
    push(e3) {
      this._execute_array([e3]);
    }
    capture(e3, t3, i3) {
      var r3;
      if (this.__loaded && this.persistence && this.sessionPersistence && this._requestQueue) {
        if (!this.consent.isOptedOut()) if (!R2(e3) && F2(e3)) {
          if (this.config.opt_out_useragent_filter || !this._is_bot()) {
            var s3 = null != i3 && i3.skip_client_rate_limiting ? void 0 : this.rateLimiter.clientRateLimitContext();
            if (null == s3 || !s3.isRateLimited) {
              this.sessionPersistence.update_search_keyword(), this.config.store_google && this.sessionPersistence.update_campaign_params(), this.config.save_referrer && this.sessionPersistence.update_referrer_info(), (this.config.store_google || this.config.save_referrer) && this.persistence.set_initial_person_info();
              var n3 = /* @__PURE__ */ new Date(), o3 = (null == i3 ? void 0 : i3.timestamp) || n3, a3 = et(), l3 = { uuid: a3, event: e3, properties: this._calculate_event_properties(e3, t3 || {}, o3, a3) };
              s3 && (l3.properties.$lib_rate_limit_remaining_tokens = s3.remainingTokens), (null == i3 ? void 0 : i3.$set) && (l3.$set = null == i3 ? void 0 : i3.$set);
              var u3 = this._calculate_set_once_properties(null == i3 ? void 0 : i3.$set_once);
              u3 && (l3.$set_once = u3), (l3 = ie(l3, null != i3 && i3._noTruncate ? null : this.config.properties_string_max_length)).timestamp = o3, R2(null == i3 ? void 0 : i3.timestamp) || (l3.properties.$event_time_override_provided = true, l3.properties.$event_time_override_system_time = n3);
              var c3 = j2(j2({}, l3.properties.$set), l3.$set);
              if (P2(c3) || this.setPersonPropertiesForFlags(c3), !M2(this.config.before_send)) {
                var d3 = this._runBeforeSend(l3);
                if (!d3) return;
                l3 = d3;
              }
              this._internalEventEmitter.emit("eventCaptured", l3);
              var h3 = { method: "POST", url: null !== (r3 = null == i3 ? void 0 : i3._url) && void 0 !== r3 ? r3 : this.requestRouter.endpointFor("api", this.analyticsDefaultEndpoint), data: l3, compression: "best-available", batchKey: null == i3 ? void 0 : i3._batchKey };
              return !this.config.request_batching || i3 && (null == i3 || !i3._batchKey) || null != i3 && i3.send_instantly ? this._send_retriable_request(h3) : this._requestQueue.enqueue(h3), l3;
            }
            q2.critical("This capture call is ignored due to client rate limiting.");
          }
        } else q2.error("No event name provided to posthog.capture");
      } else q2.uninitializedWarning("posthog.capture");
    }
    _addCaptureHook(e3) {
      return this.on("eventCaptured", (t3) => e3(t3.event, t3));
    }
    _calculate_event_properties(e3, t3, i3, r3) {
      if (i3 = i3 || /* @__PURE__ */ new Date(), !this.persistence || !this.sessionPersistence) return t3;
      var s3 = this.persistence.remove_event_timer(e3), n3 = j2({}, t3);
      if (n3.token = this.config.token, this.config.__preview_experimental_cookieless_mode && (n3.$cookieless_mode = true), "$snapshot" === e3) {
        var o3 = j2(j2({}, this.persistence.properties()), this.sessionPersistence.properties());
        return n3.distinct_id = o3.distinct_id, (!F2(n3.distinct_id) && !O2(n3.distinct_id) || T2(n3.distinct_id)) && q2.error("Invalid distinct_id for replay event. This indicates a bug in your implementation"), n3;
      }
      var l3, u3 = wi.properties({ maskPersonalDataProperties: this.config.mask_personal_data_properties, customPersonalDataProperties: this.config.custom_personal_data_properties });
      if (this.sessionManager) {
        var { sessionId: c3, windowId: d3 } = this.sessionManager.checkAndGetSessionAndWindowId();
        n3.$session_id = c3, n3.$window_id = d3;
      }
      if (this.sessionRecording && (n3.$recording_status = this.sessionRecording.status), this.requestRouter.region === Es.CUSTOM && (n3.$lib_custom_api_host = this.config.api_host), this.sessionPropsManager && this.config.__preview_send_client_session_params && ("$pageview" === e3 || "$pageleave" === e3 || "$autocapture" === e3)) {
        var _3 = this.sessionPropsManager.getSessionProps();
        n3 = K2(n3, _3);
      }
      if (l3 = "$pageview" === e3 ? this.pageViewManager.doPageView(i3, r3) : "$pageleave" === e3 ? this.pageViewManager.doPageLeave(i3) : this.pageViewManager.doEvent(), n3 = K2(n3, l3), "$pageview" === e3 && a2 && (n3.title = a2.title), !R2(s3)) {
        var p3 = i3.getTime() - s3;
        n3.$duration = parseFloat((p3 / 1e3).toFixed(3));
      }
      h2 && this.config.opt_out_useragent_filter && (n3.$browser_type = this._is_bot() ? "bot" : "browser"), (n3 = K2({}, u3, this.persistence.properties(), this.sessionPersistence.properties(), n3)).$is_identified = this._isIdentified(), x2(this.config.property_denylist) ? Y2(this.config.property_denylist, function(e4) {
        delete n3[e4];
      }) : q2.error("Invalid value for property_denylist config: " + this.config.property_denylist + " or property_blacklist config: " + this.config.property_blacklist);
      var v3 = this.config.sanitize_properties;
      v3 && (q2.error("sanitize_properties is deprecated. Use before_send instead"), n3 = v3(n3, e3));
      var g3 = this._hasPersonProcessing();
      return n3.$process_person_profile = g3, g3 && this._requirePersonProcessing("_calculate_event_properties"), n3;
    }
    _calculate_set_once_properties(e3) {
      if (!this.persistence || !this._hasPersonProcessing()) return e3;
      var t3 = K2({}, this.persistence.get_initial_props(), e3 || {}), i3 = this.config.sanitize_properties;
      return i3 && (q2.error("sanitize_properties is deprecated. Use before_send instead"), t3 = i3(t3, "$set_once")), P2(t3) ? void 0 : t3;
    }
    register(e3, t3) {
      var i3;
      null === (i3 = this.persistence) || void 0 === i3 || i3.register(e3, t3);
    }
    register_once(e3, t3, i3) {
      var r3;
      null === (r3 = this.persistence) || void 0 === r3 || r3.register_once(e3, t3, i3);
    }
    register_for_session(e3) {
      var t3;
      null === (t3 = this.sessionPersistence) || void 0 === t3 || t3.register(e3);
    }
    unregister(e3) {
      var t3;
      null === (t3 = this.persistence) || void 0 === t3 || t3.unregister(e3);
    }
    unregister_for_session(e3) {
      var t3;
      null === (t3 = this.sessionPersistence) || void 0 === t3 || t3.unregister(e3);
    }
    _register_single(e3, t3) {
      this.register({ [e3]: t3 });
    }
    getFeatureFlag(e3, t3) {
      return this.featureFlags.getFeatureFlag(e3, t3);
    }
    getFeatureFlagPayload(e3) {
      var t3 = this.featureFlags.getFeatureFlagPayload(e3);
      try {
        return JSON.parse(t3);
      } catch (e4) {
        return t3;
      }
    }
    isFeatureEnabled(e3, t3) {
      return this.featureFlags.isFeatureEnabled(e3, t3);
    }
    reloadFeatureFlags() {
      this.featureFlags.reloadFeatureFlags();
    }
    updateEarlyAccessFeatureEnrollment(e3, t3) {
      this.featureFlags.updateEarlyAccessFeatureEnrollment(e3, t3);
    }
    getEarlyAccessFeatures(e3) {
      var t3 = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
      return this.featureFlags.getEarlyAccessFeatures(e3, t3);
    }
    on(e3, t3) {
      return this._internalEventEmitter.on(e3, t3);
    }
    onFeatureFlags(e3) {
      return this.featureFlags.onFeatureFlags(e3);
    }
    onSessionId(e3) {
      var t3, i3;
      return null !== (t3 = null === (i3 = this.sessionManager) || void 0 === i3 ? void 0 : i3.onSessionId(e3)) && void 0 !== t3 ? t3 : () => {
      };
    }
    getSurveys(e3) {
      var t3 = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
      this.surveys.getSurveys(e3, t3);
    }
    getActiveMatchingSurveys(e3) {
      var t3 = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
      this.surveys.getActiveMatchingSurveys(e3, t3);
    }
    renderSurvey(e3, t3) {
      this.surveys.renderSurvey(e3, t3);
    }
    canRenderSurvey(e3) {
      this.surveys.canRenderSurvey(e3);
    }
    getNextSurveyStep(e3, t3, i3) {
      return this.surveys.getNextSurveyStep(e3, t3, i3);
    }
    identify(e3, t3, i3) {
      if (!this.__loaded || !this.persistence) return q2.uninitializedWarning("posthog.identify");
      if (O2(e3) && (e3 = e3.toString(), q2.warn("The first argument to posthog.identify was a number, but it should be a string. It has been converted to a string.")), e3) {
        if (["distinct_id", "distinctid"].includes(e3.toLowerCase())) q2.critical('The string "'.concat(e3, '" was set in posthog.identify which indicates an error. This ID should be unique to the user and not a hardcoded string.'));
        else if (this._requirePersonProcessing("posthog.identify")) {
          var r3 = this.get_distinct_id();
          if (this.register({ $user_id: e3 }), !this.get_property("$device_id")) {
            var s3 = r3;
            this.register_once({ $had_persisted_distinct_id: true, $device_id: s3 }, "");
          }
          e3 !== r3 && e3 !== this.get_property(oe) && (this.unregister(oe), this.register({ distinct_id: e3 }));
          var n3 = "anonymous" === (this.persistence.get_property($e) || "anonymous");
          e3 !== r3 && n3 ? (this.persistence.set_property($e, "identified"), this.setPersonPropertiesForFlags(t3 || {}, false), this.capture("$identify", { distinct_id: e3, $anon_distinct_id: r3 }, { $set: t3 || {}, $set_once: i3 || {} }), this.featureFlags.setAnonymousDistinctId(r3), this._cachedIdentify = uo(e3, t3, i3)) : (t3 || i3) && (this._cachedIdentify !== uo(e3, t3, i3) ? (this.setPersonProperties(t3, i3), this._cachedIdentify = uo(e3, t3, i3)) : q2.info("A duplicate posthog.identify call was made with the same properties. It has been ignored.")), e3 !== r3 && (this.reloadFeatureFlags(), this.unregister(Te));
        }
      } else q2.error("Unique user id has not been set in posthog.identify");
    }
    setPersonProperties(e3, t3) {
      (e3 || t3) && this._requirePersonProcessing("posthog.setPersonProperties") && (this.setPersonPropertiesForFlags(e3 || {}), this.capture("$set", { $set: e3 || {}, $set_once: t3 || {} }));
    }
    group(e3, t3, i3) {
      if (e3 && t3) {
        if (this._requirePersonProcessing("posthog.group")) {
          var r3 = this.getGroups();
          r3[e3] !== t3 && this.resetGroupPropertiesForFlags(e3), this.register({ $groups: j2(j2({}, r3), {}, { [e3]: t3 }) }), i3 && (this.capture("$groupidentify", { $group_type: e3, $group_key: t3, $group_set: i3 }), this.setGroupPropertiesForFlags({ [e3]: i3 })), r3[e3] === t3 || i3 || this.reloadFeatureFlags();
        }
      } else q2.error("posthog.group requires a group type and group key");
    }
    resetGroups() {
      this.register({ $groups: {} }), this.resetGroupPropertiesForFlags(), this.reloadFeatureFlags();
    }
    setPersonPropertiesForFlags(e3) {
      var t3 = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
      this.featureFlags.setPersonPropertiesForFlags(e3, t3);
    }
    resetPersonPropertiesForFlags() {
      this.featureFlags.resetPersonPropertiesForFlags();
    }
    setGroupPropertiesForFlags(e3) {
      var t3 = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
      this._requirePersonProcessing("posthog.setGroupPropertiesForFlags") && this.featureFlags.setGroupPropertiesForFlags(e3, t3);
    }
    resetGroupPropertiesForFlags(e3) {
      this.featureFlags.resetGroupPropertiesForFlags(e3);
    }
    reset(e3) {
      var t3, i3, r3, s3;
      if (q2.info("reset"), !this.__loaded) return q2.uninitializedWarning("posthog.reset");
      var n3 = this.get_property("$device_id");
      if (this.consent.reset(), null === (t3 = this.persistence) || void 0 === t3 || t3.clear(), null === (i3 = this.sessionPersistence) || void 0 === i3 || i3.clear(), this.surveys.reset(), null === (r3 = this.persistence) || void 0 === r3 || r3.set_property($e, "anonymous"), null === (s3 = this.sessionManager) || void 0 === s3 || s3.resetSessionId(), this._cachedIdentify = null, this.config.__preview_experimental_cookieless_mode) this.register_once({ distinct_id: Be, $device_id: null }, "");
      else {
        var o3 = this.config.get_device_id(et());
        this.register_once({ distinct_id: o3, $device_id: e3 ? o3 : n3 }, "");
      }
      this.register({ $last_posthog_reset: (/* @__PURE__ */ new Date()).toISOString() }, 1);
    }
    get_distinct_id() {
      return this.get_property("distinct_id");
    }
    getGroups() {
      return this.get_property("$groups") || {};
    }
    get_session_id() {
      var e3, t3;
      return null !== (e3 = null === (t3 = this.sessionManager) || void 0 === t3 ? void 0 : t3.checkAndGetSessionAndWindowId(true).sessionId) && void 0 !== e3 ? e3 : "";
    }
    get_session_replay_url(e3) {
      if (!this.sessionManager) return "";
      var { sessionId: t3, sessionStartTimestamp: i3 } = this.sessionManager.checkAndGetSessionAndWindowId(true), r3 = this.requestRouter.endpointFor("ui", "/project/".concat(this.config.token, "/replay/").concat(t3));
      if (null != e3 && e3.withTimestamp && i3) {
        var s3, n3 = null !== (s3 = e3.timestampLookBack) && void 0 !== s3 ? s3 : 10;
        if (!i3) return r3;
        var o3 = Math.max(Math.floor(((/* @__PURE__ */ new Date()).getTime() - i3) / 1e3) - n3, 0);
        r3 += "?t=".concat(o3);
      }
      return r3;
    }
    alias(e3, t3) {
      return e3 === this.get_property(ne) ? (q2.critical("Attempting to create alias for existing People user - aborting."), -2) : this._requirePersonProcessing("posthog.alias") ? (R2(t3) && (t3 = this.get_distinct_id()), e3 !== t3 ? (this._register_single(oe, e3), this.capture("$create_alias", { alias: e3, distinct_id: t3 })) : (q2.warn("alias matches current distinct_id - skipping api call."), this.identify(e3), -1)) : void 0;
    }
    set_config(e3) {
      var t3, i3, r3, s3, n3 = j2({}, this.config);
      C2(e3) && (K2(this.config, go(e3)), null === (t3 = this.persistence) || void 0 === t3 || t3.update_config(this.config, n3), this.sessionPersistence = "sessionStorage" === this.config.persistence || "memory" === this.config.persistence ? this.persistence : new Ei(j2(j2({}, this.config), {}, { persistence: "sessionStorage" })), lt.is_supported() && "true" === lt.get("ph_debug") && (this.config.debug = true), this.config.debug && (p2.DEBUG = true, q2.info("set_config", { config: e3, oldConfig: n3, newConfig: j2({}, this.config) })), null === (i3 = this.sessionRecording) || void 0 === i3 || i3.startIfEnabledOrStop(), null === (r3 = this.autocapture) || void 0 === r3 || r3.startIfEnabled(), null === (s3 = this.heatmaps) || void 0 === s3 || s3.startIfEnabled(), this.surveys.loadIfEnabled(), this._sync_opt_out_with_persistence());
    }
    startSessionRecording(e3) {
      var t3 = true === e3, i3 = { sampling: t3 || !(null == e3 || !e3.sampling), linked_flag: t3 || !(null == e3 || !e3.linked_flag), url_trigger: t3 || !(null == e3 || !e3.url_trigger), event_trigger: t3 || !(null == e3 || !e3.event_trigger) };
      if (Object.values(i3).some(Boolean)) {
        var r3, s3, n3, o3, a3;
        if (null === (r3 = this.sessionManager) || void 0 === r3 || r3.checkAndGetSessionAndWindowId(), i3.sampling) null === (s3 = this.sessionRecording) || void 0 === s3 || s3.overrideSampling();
        if (i3.linked_flag) null === (n3 = this.sessionRecording) || void 0 === n3 || n3.overrideLinkedFlag();
        if (i3.url_trigger) null === (o3 = this.sessionRecording) || void 0 === o3 || o3.overrideTrigger("url");
        if (i3.event_trigger) null === (a3 = this.sessionRecording) || void 0 === a3 || a3.overrideTrigger("event");
      }
      this.set_config({ disable_session_recording: false });
    }
    stopSessionRecording() {
      this.set_config({ disable_session_recording: true });
    }
    sessionRecordingStarted() {
      var e3;
      return !(null === (e3 = this.sessionRecording) || void 0 === e3 || !e3.started);
    }
    captureException(e3, t3) {
      var i3, r3 = new Error("PostHog syntheticException"), s3 = I2(null === (i3 = _2.__PosthogExtensions__) || void 0 === i3 ? void 0 : i3.parseErrorAsProperties) ? j2(j2({}, _2.__PosthogExtensions__.parseErrorAsProperties([e3.message, void 0, void 0, void 0, e3], { syntheticException: r3 })), t3) : j2({ $exception_level: "error", $exception_list: [{ type: e3.name, value: e3.message, mechanism: { handled: true, synthetic: false } }] }, t3);
      this.exceptions.sendExceptionEvent(s3);
    }
    loadToolbar(e3) {
      return this.toolbar.loadToolbar(e3);
    }
    get_property(e3) {
      var t3;
      return null === (t3 = this.persistence) || void 0 === t3 ? void 0 : t3.props[e3];
    }
    getSessionProperty(e3) {
      var t3;
      return null === (t3 = this.sessionPersistence) || void 0 === t3 ? void 0 : t3.props[e3];
    }
    toString() {
      var e3, t3 = null !== (e3 = this.config.name) && void 0 !== e3 ? e3 : _o;
      return t3 !== _o && (t3 = _o + "." + t3), t3;
    }
    _isIdentified() {
      var e3, t3;
      return "identified" === (null === (e3 = this.persistence) || void 0 === e3 ? void 0 : e3.get_property($e)) || "identified" === (null === (t3 = this.sessionPersistence) || void 0 === t3 ? void 0 : t3.get_property($e));
    }
    _hasPersonProcessing() {
      var e3, t3, i3, r3;
      return !("never" === this.config.person_profiles || "identified_only" === this.config.person_profiles && !this._isIdentified() && P2(this.getGroups()) && (null === (e3 = this.persistence) || void 0 === e3 || null === (t3 = e3.props) || void 0 === t3 || !t3[oe]) && (null === (i3 = this.persistence) || void 0 === i3 || null === (r3 = i3.props) || void 0 === r3 || !r3[Ne]));
    }
    _shouldCapturePageleave() {
      return true === this.config.capture_pageleave || "if_capture_pageview" === this.config.capture_pageleave && this.config.capture_pageview;
    }
    createPersonProfile() {
      this._hasPersonProcessing() || this._requirePersonProcessing("posthog.createPersonProfile") && this.setPersonProperties({}, {});
    }
    _requirePersonProcessing(e3) {
      return "never" === this.config.person_profiles ? (q2.error(e3 + ' was called, but process_person is set to "never". This call will be ignored.'), false) : (this._register_single(Ne, true), true);
    }
    _sync_opt_out_with_persistence() {
      var e3, t3, i3, r3, s3 = this.consent.isOptedOut(), n3 = this.config.opt_out_persistence_by_default, o3 = this.config.disable_persistence || s3 && !!n3;
      (null === (e3 = this.persistence) || void 0 === e3 ? void 0 : e3.disabled) !== o3 && (null === (i3 = this.persistence) || void 0 === i3 || i3.set_disabled(o3));
      (null === (t3 = this.sessionPersistence) || void 0 === t3 ? void 0 : t3.disabled) !== o3 && (null === (r3 = this.sessionPersistence) || void 0 === r3 || r3.set_disabled(o3));
    }
    opt_in_capturing(e3) {
      var t3;
      (this.consent.optInOut(true), this._sync_opt_out_with_persistence(), R2(null == e3 ? void 0 : e3.captureEventName) || null != e3 && e3.captureEventName) && this.capture(null !== (t3 = null == e3 ? void 0 : e3.captureEventName) && void 0 !== t3 ? t3 : "$opt_in", null == e3 ? void 0 : e3.captureProperties, { send_instantly: true });
      this.config.capture_pageview && this._captureInitialPageview();
    }
    opt_out_capturing() {
      this.consent.optInOut(false), this._sync_opt_out_with_persistence();
    }
    has_opted_in_capturing() {
      return this.consent.isOptedIn();
    }
    has_opted_out_capturing() {
      return this.consent.isOptedOut();
    }
    clear_opt_in_out_capturing() {
      this.consent.reset(), this._sync_opt_out_with_persistence();
    }
    _is_bot() {
      return o2 ? $n(o2, this.config.custom_blocked_useragents) : void 0;
    }
    _captureInitialPageview() {
      a2 && !this._initialPageviewCaptured && (this._initialPageviewCaptured = true, this.capture("$pageview", { title: a2.title }, { send_instantly: true }));
    }
    debug(e3) {
      false === e3 ? (null == t2 || t2.console.log("You've disabled debug mode."), localStorage && localStorage.removeItem("ph_debug"), this.set_config({ debug: false })) : (null == t2 || t2.console.log("You're now in debug mode. All calls to PostHog will be logged in your console.\nYou can disable this with `posthog.debug(false)`."), localStorage && localStorage.setItem("ph_debug", "true"), this.set_config({ debug: true }));
    }
    _runBeforeSend(e3) {
      if (M2(this.config.before_send)) return e3;
      var t3 = x2(this.config.before_send) ? this.config.before_send : [this.config.before_send], i3 = e3;
      for (var r3 of t3) {
        if (i3 = r3(i3), M2(i3)) {
          var s3 = "Event '".concat(e3.event, "' was rejected in beforeSend function");
          return D2(e3.event) ? q2.warn("".concat(s3, ". This can cause unexpected behavior.")) : q2.info(s3), null;
        }
        i3.properties && !P2(i3.properties) || q2.warn("Event '".concat(e3.event, "' has no properties after beforeSend function, this is likely an error."));
      }
      return i3;
    }
    getPageViewId() {
      var e3;
      return null === (e3 = this.pageViewManager._currentPageview) || void 0 === e3 ? void 0 : e3.pageViewId;
    }
  };
  !function(e3, t3) {
    for (var i3 = 0; i3 < t3.length; i3++) e3.prototype[t3[i3]] = ee2(e3.prototype[t3[i3]]);
  }(mo, ["identify"]);
  var bo;
  var yo = (bo = co[_o] = new mo(), function() {
    function e3() {
      e3.done || (e3.done = true, po = false, Y2(co, function(e4) {
        e4._dom_loaded();
      }));
    }
    null != a2 && a2.addEventListener && ("complete" === a2.readyState ? e3() : a2.addEventListener("DOMContentLoaded", e3, false)), t2 && re(t2, "load", e3, true);
  }(), bo);

  // src/auth/posthog.ts
  function getEnvironment() {
    return ENV.isProduction ? "production" : "development";
  }
  var initPosthog = () => {
    console.log("[+] Posthog - Enabled");
    yo.init("phc_KVCoqlB74IOeDIEbB3R1muP7XfmZTEi0G9WyfT1Y1av", {
      api_host: "https://ph-proxy.seedtoscale.com",
      person_profiles: "identified_only"
      // or 'always' to create profiles for anonymous users as well
      // capture_pageleave: false,
    });
    yo.register_once({
      ENVIRONMENT: getEnvironment()
    });
  };
  var getValuesFromUser = (user) => {
    const keysToPick = ["Organisation-Industry", "Organisation-Designation", "Organisation-Name"];
    const userMetadata = user.user_metadata || {};
    const userValues = keysToPick.reduce((acc, key) => {
      acc[key] = userMetadata[key] || "";
      return acc;
    }, {});
    return userValues;
  };
  var identifyUser = (user) => {
    const userId = user.user_id || "";
    if (userId && !yo._isIdentified()) {
      let firstName = user.given_name || (user.user_metadata ? user.user_metadata["First-Name"] : "");
      let lastName = user.family_name || (user.user_metadata ? user.user_metadata["Last-Name"] : "");
      firstName = firstName || "";
      lastName = lastName || "";
      let fullName = `${firstName} ${lastName}`;
      const userOptions = {
        email: user.email,
        name: fullName.trim(),
        ...getValuesFromUser(user)
      };
      yo.identify(userId, userOptions);
      console.log("[+] Posthog - User Identified", userId);
    }
  };
  var captureExceptions = (error) => {
    yo.captureException(error);
  };
  var logoutUser = () => {
    yo.reset();
  };
  var PosthogManager = {
    initPosthog,
    identifyUser,
    captureExceptions,
    logoutUser
  };

  // src/auth/countryMap.ts
  var countryCodeMap = {
    AF: "Afghanistan",
    AL: "Albania",
    DZ: "Algeria",
    AS: "American Samoa",
    AD: "Andorra",
    AO: "Angola",
    AI: "Anguilla",
    AQ: "Antarctica",
    AG: "Antigua and Barbuda",
    AR: "Argentina",
    AM: "Armenia",
    AW: "Aruba",
    AU: "Australia",
    AT: "Austria",
    AZ: "Azerbaijan",
    BS: "Bahamas",
    BH: "Bahrain",
    BD: "Bangladesh",
    BB: "Barbados",
    BY: "Belarus",
    BE: "Belgium",
    BZ: "Belize",
    BJ: "Benin",
    BM: "Bermuda",
    BT: "Bhutan",
    BO: "Bolivia",
    BQ: "Bonaire",
    BA: "Bosnia and Herzegovina",
    BW: "Botswana",
    BV: "Bouvet Island",
    BR: "Brazil",
    IO: "British Indian Ocean Territory",
    BN: "Brunei Darussalam",
    BG: "Bulgaria",
    BF: "Burkina Faso",
    BI: "Burundi",
    CV: "Cabo Verde",
    KH: "Cambodia",
    CM: "Cameroon",
    CA: "Canada",
    KY: "Cayman Islands",
    CF: "Central African Republic",
    TD: "Chad",
    CL: "Chile",
    CN: "China",
    CX: "Christmas Island",
    CC: "Cocos (Keeling) Islands",
    CO: "Colombia",
    KM: "Comoros",
    CG: "Congo",
    CD: "Congo (Democratic Republic of the)",
    CK: "Cook Islands",
    CR: "Costa Rica",
    HR: "Croatia",
    CU: "Cuba",
    CW: "Cura\xE7ao",
    CY: "Cyprus",
    CZ: "Czechia",
    CI: "C\xF4te d'Ivoire",
    DK: "Denmark",
    DJ: "Djibouti",
    DM: "Dominica",
    DO: "Dominican Republic",
    EC: "Ecuador",
    EG: "Egypt",
    SV: "El Salvador",
    GQ: "Equatorial Guinea",
    ER: "Eritrea",
    EE: "Estonia",
    SZ: "Eswatini",
    ET: "Ethiopia",
    FK: "Falkland Islands (Malvinas)",
    FO: "Faroe Islands",
    FJ: "Fiji",
    FI: "Finland",
    FR: "France",
    GF: "French Guiana",
    PF: "French Polynesia",
    TF: "French Southern Territories",
    GA: "Gabon",
    GM: "Gambia",
    GE: "Georgia",
    DE: "Germany",
    GH: "Ghana",
    GI: "Gibraltar",
    GR: "Greece",
    GL: "Greenland",
    GD: "Grenada",
    GP: "Guadeloupe",
    GU: "Guam",
    GT: "Guatemala",
    GG: "Guernsey",
    GN: "Guinea",
    GW: "Guinea-Bissau",
    GY: "Guyana",
    HT: "Haiti",
    HM: "Heard Island and McDonald Islands",
    VA: "Holy See (Vatican City State)",
    HN: "Honduras",
    HK: "Hong Kong",
    HU: "Hungary",
    IS: "Iceland",
    IN: "India",
    ID: "Indonesia",
    IR: "Iran",
    IQ: "Iraq",
    IE: "Ireland",
    IM: "Isle of Man",
    IL: "Israel",
    IT: "Italy",
    JM: "Jamaica",
    JP: "Japan",
    JE: "Jersey",
    JO: "Jordan",
    KZ: "Kazakhstan",
    KE: "Kenya",
    KI: "Kiribati",
    KP: "Korea (North)",
    KR: "Korea (South)",
    KW: "Kuwait",
    KG: "Kyrgyzstan",
    LA: "Laos",
    LV: "Latvia",
    LB: "Lebanon",
    LS: "Lesotho",
    LR: "Liberia",
    LY: "Libya",
    LI: "Liechtenstein",
    LT: "Lithuania",
    LU: "Luxembourg",
    MO: "Macao",
    MG: "Madagascar",
    MW: "Malawi",
    MY: "Malaysia",
    MV: "Maldives",
    ML: "Mali",
    MT: "Malta",
    MH: "Marshall Islands",
    MQ: "Martinique",
    MR: "Mauritania",
    MU: "Mauritius",
    YT: "Mayotte",
    MX: "Mexico",
    FM: "Micronesia",
    MD: "Moldova",
    MC: "Monaco",
    MN: "Mongolia",
    ME: "Montenegro",
    MS: "Montserrat",
    MA: "Morocco",
    MZ: "Mozambique",
    MM: "Myanmar",
    NA: "Namibia",
    NR: "Nauru",
    NP: "Nepal",
    NL: "Netherlands",
    NC: "New Caledonia",
    NZ: "New Zealand",
    NI: "Nicaragua",
    NE: "Niger",
    NG: "Nigeria",
    NU: "Niue",
    NF: "Norfolk Island",
    MK: "North Macedonia",
    MP: "Northern Mariana Islands",
    NO: "Norway",
    OM: "Oman",
    PK: "Pakistan",
    PW: "Palau",
    PS: "Palestine",
    PA: "Panama",
    PG: "Papua New Guinea",
    PY: "Paraguay",
    PE: "Peru",
    PH: "Philippines",
    PN: "Pitcairn",
    PL: "Poland",
    PT: "Portugal",
    PR: "Puerto Rico",
    QA: "Qatar",
    RO: "Romania",
    RU: "Russia",
    RW: "Rwanda",
    RE: "R\xE9union",
    BL: "Saint Barth\xE9lemy",
    SH: "Saint Helena",
    KN: "Saint Kitts and Nevis",
    LC: "Saint Lucia",
    MF: "Saint Martin",
    PM: "Saint Pierre and Miquelon",
    VC: "Saint Vincent and the Grenadines",
    WS: "Samoa",
    SM: "San Marino",
    ST: "Sao Tome and Principe",
    SA: "Saudi Arabia",
    SN: "Senegal",
    RS: "Serbia",
    SC: "Seychelles",
    SL: "Sierra Leone",
    SG: "Singapore",
    SX: "Sint Maarten",
    SK: "Slovakia",
    SI: "Slovenia",
    SB: "Solomon Islands",
    SO: "Somalia",
    ZA: "South Africa",
    GS: "South Georgia and the South Sandwich Islands",
    SS: "South Sudan",
    ES: "Spain",
    LK: "Sri Lanka",
    SD: "Sudan",
    SR: "Suriname",
    SJ: "Svalbard and Jan Mayen",
    SE: "Sweden",
    CH: "Switzerland",
    SY: "Syria",
    TW: "Taiwan",
    TJ: "Tajikistan",
    TZ: "Tanzania",
    TH: "Thailand",
    TL: "Timor-Leste",
    TG: "Togo",
    TK: "Tokelau",
    TO: "Tonga",
    TT: "Trinidad and Tobago",
    TN: "Tunisia",
    TR: "Turkey",
    TM: "Turkmenistan",
    TC: "Turks and Caicos Islands",
    TV: "Tuvalu",
    UG: "Uganda",
    UA: "Ukraine",
    AE: "United Arab Emirates",
    GB: "United Kingdom",
    US: "United States",
    UY: "Uruguay",
    UZ: "Uzbekistan",
    VU: "Vanuatu",
    VE: "Venezuela",
    VN: "Vietnam",
    EH: "Western Sahara",
    YE: "Yemen",
    ZM: "Zambia",
    ZW: "Zimbabwe"
  };

  // src/auth/user.ts
  var logger4 = createLogger("USER");
  var User = class {
    //   private accessToken: string;
    //   private authOClient: Auth0Client;
    constructor() {
      __publicField(this, "getAccessToken", async () => {
        const accessToken = await LocalAuth0Client.getTokenSilently();
        return accessToken;
      });
      __publicField(this, "getUser", async () => {
        const userProfile = await LocalAuth0Client.getUser();
        logger4.log("userProfile", userProfile);
        return userProfile;
      });
      __publicField(this, "getUserId", async () => {
        const userProfile = await this.getUser();
        return userProfile?.sub || "";
      });
      __publicField(this, "getUserWithMetadata", async () => {
        const userId = await this.getUserId();
        const accessToken = await this.getAccessToken();
        const API_ROUTE = AUTH0_API_ROUTES.USER + "/" + encodeURIComponent(userId);
        const response = await fetch(API_ROUTE, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        const userObject = await response.json();
        logger4.log("[+] User -> User Object", userObject);
        return userObject;
      });
      __publicField(this, "getUserFromLocalStorage", () => {
        const data = localStorage.getItem("formState") || "{}";
        const state = JSON.parse(data);
        return state.formData;
      });
      __publicField(this, "updateUserMetadata", async (user_metadata) => {
        const userId = await this.getUserId();
        const accessToken = await this.getAccessToken();
        const API_ROUTE = AUTH0_API_ROUTES.USER + "/" + encodeURIComponent(userId);
        const response = await fetch(API_ROUTE, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            user_metadata
          })
        });
        const user = await response.json();
        logger4.log("[+] User - Metadata Updated", userId, user);
      });
      __publicField(this, "updateMetaDataInLocalStorage", async (user_metadata, replaceState = false) => {
        logger4.log("[+] replaceState", replaceState);
        const data = localStorage.getItem("formState") || "{}";
        const state = JSON.parse(data);
        let newState = { ...state, formData: { ...state.formData, ...user_metadata } };
        localStorage.setItem("formState", JSON.stringify(newState));
      });
      __publicField(this, "showUserDetailsFromLocalStorage", () => {
        try {
          const user_metadata = this.getUserFromLocalStorage();
          const userData = {
            user_metadata
          };
          this.showUserDetailsOnScreen(userData);
        } catch (error) {
          console.error("UNABLE TO SHOW", error);
        }
      });
    }
    showUserDetailsOnScreen(user) {
      const elements = document.querySelectorAll("[data-user]");
      if (elements.length == 0) {
        return;
      }
      logger4.log("[+] Data User -> showUserDetailsOnScreen", user);
      elements.forEach((element) => {
        const template = element.getAttribute("data-user") || "";
        let finalString = template;
        const dataToCheck = {
          ...user,
          ...user.user_metadata
        };
        const parts = template.match(/{(.*?)}/g);
        parts?.forEach((part) => {
          const key = part.replace(/{|}/g, "");
          logger4.log("[key=]", key);
          const value = dataToCheck[key];
          logger4.log("[+] KEY VALUE", key, value);
          finalString = finalString.replace(new RegExp(part, "g"), dataToCheck[key] || "");
        });
        if (template == "initials") {
          finalString = dataToCheck["First-Name"]?.charAt(0);
        }
        const isImageTag = element.tagName == "IMG";
        const isInputTag = element.tagName == "INPUT";
        const isSelectTag = element.tagName == "SELECT";
        const isTextAreaTag = element.tagName == "TEXTAREA";
        if (isImageTag && finalString) {
          element.setAttribute("src", finalString);
        } else if (isInputTag || isSelectTag || isTextAreaTag) {
          console.log("[+] SETTING INPUT FIELD VALUES", finalString);
          element.value = finalString;
        } else {
          element.innerHTML = finalString;
        }
      });
      this.handleDataShowIfCondition(user);
    }
    handleVisibility(element, userStatus) {
      const dataShow = element.getAttribute("data-show");
      const dataStrip = element.getAttribute("data-strip");
      const dataHide = element.getAttribute("data-hide");
      logger4.log(
        "[+] ConditionalVisibility: dataShow, dataStrip, dataHide",
        dataShow,
        dataStrip,
        dataHide
      );
      if (dataShow) {
        const conditions = dataShow.split(";").map((cond) => cond.trim());
        const shouldShow = conditions.every((condition) => {
          if (condition === "user:loggedin") return userStatus.loggedIn;
          if (condition === "user:anon") return !userStatus.loggedIn;
          if (condition === "limit:reached") return userStatus.limitReached;
          if (condition === "limit:available") return !userStatus.limitReached;
          return true;
        });
        if (!shouldShow) {
          element.setAttribute("style", "display:none;");
        } else {
          element.removeAttribute("style");
        }
      }
      if (dataStrip) {
        const conditions = dataStrip.split(";").map((cond) => cond.trim());
        const shouldHide = conditions.every((condition) => {
          if (condition === "user:loggedin") return userStatus.loggedIn;
          if (condition === "user:anon") return !userStatus.loggedIn;
          if (condition === "limit:reached") return userStatus.limitReached;
          if (condition === "limit:available") return !userStatus.limitReached;
          return false;
        });
        console.log("dataStrip -> shouldHide", shouldHide);
        if (shouldHide) {
          element.setAttribute("style", "display:none;");
        }
      }
      if (dataHide) {
        const conditions = dataHide.split(";").map((cond) => cond.trim());
        const shouldHide = conditions.every((condition) => {
          if (condition === "user:loggedin") return userStatus.loggedIn;
          if (condition === "user:anon") return !userStatus.loggedIn;
          if (condition === "limit:reached") return userStatus.limitReached;
          if (condition === "limit:available") return !userStatus.limitReached;
          return false;
        });
        console.log("[+] dataHide -> shouldHide", shouldHide);
        if (shouldHide) {
          element.setAttribute("style", "display:none;");
        } else {
          element.removeAttribute("style");
        }
      }
    }
    handleDataShow(user) {
      const USER_STATUS = { loggedIn: false, limitReached: false, canAccessThisPage: false };
      if (user) {
        USER_STATUS.loggedIn = true;
      }
      const showElements = document.querySelectorAll("[data-show]");
      const hideElements = document.querySelectorAll("[data-hide]");
      const elements = [...Array.from(showElements), ...Array.from(hideElements)];
      elements.forEach((element) => {
        this.handleVisibility(element, USER_STATUS);
      });
    }
    handleDataShowIfCondition(user) {
      const elements = document.querySelectorAll("[data-show-if]");
      const metaData = user.user_metadata;
      if (elements.length == 0 || !metaData) {
        return;
      }
      elements.forEach((element) => {
        const showIf = element.getAttribute("data-show-if") || "";
        const condition = showIf.split(":");
        if (!condition) {
          return;
        }
        const key = condition[0];
        const value = condition[1];
        if (metaData[key] && metaData[key].toString() == value) {
          logger4.log("[+] ELEMENT ALREADY VISIBLE", key);
        } else {
          element.style.display = "none";
        }
      });
    }
    static async getLocationDetails() {
      const response = await fetch("https://ipinfo.io/json?token=43a22b23bbdddb");
      const data = await response.json();
      console.log("[+] LOCATION DETAILS", data);
      const countryCode = data.country;
      const countryName = countryCodeMap[countryCode];
      const city = data.city;
      let finalData = {};
      if (city) {
        finalData["City-Name"] = city;
      }
      if (countryName) {
        finalData["Country-Name"] = countryName;
      }
      return finalData;
    }
    static getUserIfMetadataMissing(userObject) {
      function isLinkedInLogin(userObject2) {
        return userObject2.identities.some(
          (identity) => identity.connection.toLowerCase() === "linkedin"
        );
      }
      const updatedUser = { ...userObject };
      const FIRST_NAME = "First-Name";
      const LAST_NAME = "Last-Name";
      const COUNTRY_NAME = "Country-Name";
      const CITY_NAME = "City-Name";
      const LINKEDIN_URL_KEY = "Linkedin-Url";
      if (!updatedUser.user_metadata) {
        updatedUser.user_metadata = {};
      }
      if (!updatedUser.user_metadata[FIRST_NAME]) {
        updatedUser.user_metadata[FIRST_NAME] = updatedUser.given_name;
      }
      if (!updatedUser.user_metadata[LAST_NAME]) {
        updatedUser.user_metadata[LAST_NAME] = updatedUser.family_name;
      }
      if (!updatedUser.user_metadata[COUNTRY_NAME] && updatedUser[COUNTRY_NAME]) {
        updatedUser.user_metadata[COUNTRY_NAME] = updatedUser[COUNTRY_NAME];
      }
      if (!updatedUser.user_metadata[CITY_NAME] && updatedUser[CITY_NAME]) {
        updatedUser.user_metadata[CITY_NAME] = updatedUser[CITY_NAME];
      }
      return updatedUser;
    }
  };
  __publicField(User, "clearFormStateInLocalStorage", () => {
    localStorage.removeItem("formState");
  });

  // src/auth/login.ts
  var logger5 = createLogger("LOGIN");
  var initAuthModule = async (userLoaded) => {
    logger5.log("[+] AUTH MODULE INITIALIZED");
    loginHandler(LocalAuth0Client, ".v2-sign-up-btn");
    loginHandler(LocalAuth0Client, '[data-action="login"]');
    logoutHandler(LocalAuth0Client, '[data-action="logout"]');
    await handleRedirectCallback(LocalAuth0Client);
    await checkAuthentication(LocalAuth0Client, userLoaded);
  };
  function takeUserToPostLoginRoute() {
    const postLoginRoute = getPostLoginRoute();
    if (postLoginRoute) {
      logger5.log("[+] takeUserToPostLoginRoute", postLoginRoute);
      removePostLoginRoute();
      window.history.replaceState({}, document.title, postLoginRoute);
      window.location.assign(postLoginRoute);
    } else {
      logger5.log("[+] takeUserToPostLoginRoute", RELATIVE_ROUTES.POST_LOGIN);
      takeUserToHome();
    }
  }
  function takeUserToHome() {
    window.history.replaceState({}, document.title, RELATIVE_ROUTES.DASHBOARD);
    window.location.assign(RELATIVE_ROUTES.DASHBOARD);
  }
  function takeUserToOnboarding() {
    window.history.replaceState({}, document.title, RELATIVE_ROUTES.ONBOARDING);
    window.location.assign(RELATIVE_ROUTES.ONBOARDING);
  }
  var handleRedirectCallback = async (auth0Client) => {
    try {
      const searchParams = location.search;
      const ifLoginCallback = searchParams.includes("state=") && (searchParams.includes("code=") || searchParams.includes("error="));
      const isLogoutCallBack = searchParams.includes("logout=true");
      if (ifLoginCallback) {
        await auth0Client.handleRedirectCallback();
        const user = await getCurrentUser(auth0Client);
        logger5.log("[+] handleRedirectCallback-> user", user);
        const user_metadata = user.user_metadata;
        logger5.log("user_metadata", user_metadata);
        if (user_metadata && user_metadata["isOnboardingComplete"]) {
          takeUserToPostLoginRoute();
        } else {
          takeUserToOnboarding();
        }
      }
      if (isLogoutCallBack) {
        setTimeout(takeUserToHome, 2e3);
      }
    } catch (error) {
      logger5.log("[+] handleRedirectCallback", error);
      PosthogManager.captureExceptions(error);
      window.location.assign(RELATIVE_ROUTES.HOME + "?error=error_while_logging_in");
    }
  };
  var setAuthenticatedCookie = function(status, logMessage = "Not Set") {
    logger5.log("[+] setAuthenticatedCookie LOG", logMessage);
    document.cookie = `isAuthenticated=${status}; Path=/;`;
  };
  var getCurrentUser = async (auth0Client) => {
    try {
      logger5.log("[+] getCurrentUser [STARTS]");
      setAuthenticatedCookie(false, "default");
      const accessToken = await auth0Client.getTokenSilently();
      const isAuthenticated = await auth0Client.isAuthenticated();
      const userProfile = await auth0Client.getUser();
      let user = null;
      setAuthenticatedCookie(isAuthenticated, "USER IS AUTHENTICATED");
      logger5.log("[+] isAuthenticated", isAuthenticated);
      if (userProfile) {
        const userId = userProfile.sub || "";
        const response = await fetch(
          `https://${ENV.AUTHO_DOMAIN}/api/v2/users/${encodeURIComponent(userId)}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` }
          }
        );
        user = await response.json();
        logger5.log("user->metadata", user.user_metadata);
        try {
          const details = await User.getLocationDetails();
          user = { ...user, ...details };
          logger5.log("getLocationDetails", user);
        } catch (error) {
          console.log("[+] Error in fetching location details", error);
        }
        user = await User.getUserIfMetadataMissing(user);
      }
      return user;
    } catch (error) {
      logger5.log("getCurrentUser-> ERROR", error);
      setAuthenticatedCookie(false, "USER AUTH ERROR");
      throw error;
    }
  };
  var redirectAnonUserFromProtectedRoute = async (auth0Client) => {
    try {
      const isAuthenticated = await auth0Client.isAuthenticated();
      logger5.log(
        "[+] !isAuthenticated && isUserOrProtectedRoute()",
        !isAuthenticated,
        isUserOrProtectedRoute()
      );
      if (!isAuthenticated && isUserOrProtectedRoute()) {
        logger5.log("[+] Redirecting User to Login Page");
        await auth0Client.loginWithRedirect({
          appState: { targetUrl: window.location.pathname }
        });
      }
    } catch (error) {
      logger5.error("redirectAnonUserFromProtectedRoute", error);
    }
  };
  var checkAuthentication = async (auth0Client, userLoaded) => {
    logger5.log("[+] checkAuthentication - Method");
    try {
      logger5.log("[+] checkAuthentication - Method - 1");
      const user = await getCurrentUser(auth0Client);
      logger5.log("[+] checkAuthentication - Method - 2");
      userLoaded(user);
    } catch (error) {
      logger5.log("checkAuthentication", error);
      userLoaded(null);
      redirectAnonUserFromProtectedRoute(auth0Client);
    }
  };
  function writeArticleLinkForPostLogin() {
    const pathname = window.location.pathname;
    const KEYNAME = "POST_LOGIN_ROUTE";
    localStorage.setItem(KEYNAME, pathname);
  }
  function removePostLoginRoute() {
    localStorage.removeItem("POST_LOGIN_ROUTE");
  }
  function getPostLoginRoute() {
    const route = localStorage.getItem("POST_LOGIN_ROUTE");
    return route;
  }
  var loginHandler = (auth0Client, elementId = "#login-button") => {
    const elements = document.querySelectorAll(elementId);
    if (elements && elements.length) {
      elements.forEach((element) => {
        element.addEventListener("click", (e3) => {
          e3.preventDefault();
          if (isProtectedContentRoute()) {
            console.log("[+] writeArticleLinkForPostLogin");
            writeArticleLinkForPostLogin();
          }
          auth0Client.loginWithRedirect();
        });
      });
    } else {
      logger5.info("[-] Login Button Not Found");
    }
  };
  var logoutHandler = (auth0Client, elementId = "#logout-button") => {
    const elements = document.querySelectorAll(elementId);
    if (elements && elements.length) {
      elements.forEach((element) => {
        element.addEventListener("click", (e3) => {
          e3.preventDefault();
          setAuthenticatedCookie(false, "LOGOUT");
          User.clearFormStateInLocalStorage();
          PosthogManager.logoutUser();
          auth0Client.logout({
            logoutParams: {
              returnTo: ROUTES.POST_LOGIN + "?logout=true"
            }
          });
        });
      });
    }
  };

  // src/auth/nudge-manager.ts
  var NudgeHandler = class {
    constructor(config) {
      __publicField(this, "element");
      __publicField(this, "closeButton");
      __publicField(this, "cookieName");
      __publicField(this, "delay");
      this.element = document.querySelector(`[${config.elementSelector}]`);
      this.closeButton = document.querySelector(`[${config.closeButtonSelector}]`);
      this.cookieName = config.cookieName;
      this.delay = config.delay;
      if (!this.element) {
        console.error("Nudge element not found.");
        return;
      }
      this.init();
    }
    // Initialize the nudge behavior
    init() {
      if (this.getCookie(this.cookieName)) {
        console.log("Nudge dismissed previously. It will not appear.");
        return;
      }
      setTimeout(() => {
        this.showNudge();
      }, this.delay * 1e3);
      if (this.closeButton) {
        this.closeButton.addEventListener("click", () => this.closeNudge());
      }
    }
    // Show the nudge
    showNudge() {
      if (this.element) {
        this.element.classList.remove("hide");
      }
    }
    // Close the nudge and store state in a cookie
    closeNudge() {
      if (this.element) {
        this.element.classList.add("hide");
      }
      this.setCookie(this.cookieName, "dismissed", 365);
    }
    // Get the value of a cookie
    getCookie(name) {
      const cookieArr = document.cookie.split(";");
      for (const cookie of cookieArr) {
        const [key, value] = cookie.trim().split("=");
        if (key === name) {
          return value || null;
        }
      }
      return null;
    }
    // Set a cookie
    setCookie(name, value, days) {
      const date = /* @__PURE__ */ new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1e3);
      document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
    }
  };

  // src/template/recentArticle.html
  var recentArticle_default = '<a\n  id="w-node-_2d62179d-8156-36fb-2518-94981619b40e-56888ad6"\n  href="{{url}}"\n  class="dashboard-content-card w-inline-block"\n  ><div class="dash_card-img-wrapper">\n    <img src="{{featuredImage}}" loading="lazy" alt="" class="dash_card-img" />\n  </div>\n  <div\n    id="w-node-_2d62179d-8156-36fb-2518-94981619b411-56888ad6"\n    class="dash_card-content is-recently-viewed"\n  >\n    <div class="dash_card-topic">{{contentType}}</div>\n    <h2 class="dash_card-title">{{title}}</h2>\n  </div>\n</a>\n';

  // src/content/recent-articles.ts
  var logger6 = createLogger("RECENT ARTICLES");
  var MAX_ARTICLE_COUNT = window.MAX_ARTICLE_COUNT || 20;
  var CONSTANT = {
    ARTICLE_LIST: "RECENT_ARTICLE_LIST"
  };
  var selectorsMap = {
    blogTitle: ".blog-internal_heading",
    podcastTitle: ".blog-internal_heading",
    blogImage: "#featuredImage",
    podcastImage: ".content-internal_video-thumbnail"
  };
  var isBlog = window.location.pathname.startsWith("/blog/");
  var isPodcast = window.location.pathname.startsWith("/podcast/");
  var isVideo = window.location.pathname.startsWith("/video/");
  var selectors = {
    title: isBlog ? selectorsMap.blogTitle : isPodcast ? selectorsMap.podcastTitle : "",
    image: isBlog ? selectorsMap.blogImage : isPodcast ? selectorsMap.podcastImage : ""
  };
  function addArticle(article) {
    logger6.log("Adding Article", article);
    const allArticlesString = localStorage.getItem(CONSTANT.ARTICLE_LIST) || "[]";
    const allArticles = JSON.parse(allArticlesString);
    const newArticleList = allArticles.filter((a3) => a3.url !== article.url);
    newArticleList.unshift(article);
    if (newArticleList.length > MAX_ARTICLE_COUNT) {
      newArticleList.pop();
    }
    logger6.log("New Article List", newArticleList);
    localStorage.setItem(CONSTANT.ARTICLE_LIST, JSON.stringify(newArticleList));
  }
  function getArticleFromWebpage() {
    const title = document.querySelector(selectors.title)?.textContent;
    const image = document.querySelector(selectors.image)?.getAttribute("src");
    const url = window.location.href;
    const type = url.split("/")[3];
    const description = "";
    logger6.log("Article", { title, description, image, url, type });
    if (title && image) {
      addArticle({ title, description, image, url, type });
    }
  }
  function renderArticlesOnScreen(container = '[data-content="recent-articles"]') {
    logger6.log("Rendering Articles");
    const articles = getRecentArticles();
    if (articles && articles.length > 0) {
      logger6.log("Articles", articles);
      const articleContainer = document.querySelector(container);
      const articleListHtml = [];
      if (articleContainer) {
        articles.forEach((article) => {
          let template = recentArticle_default;
          template = template.replaceAll("{{title}}", article.title).replaceAll("{{description}}", article.description).replaceAll("{{image}}", article.image).replaceAll("{{featuredImage}}", article.image).replaceAll("{{contentType}}", article.type).replaceAll("{{url}}", article.url).replaceAll("{{articleLink}}", article.url);
          articleListHtml.push(template);
        });
        articleContainer.innerHTML = articleListHtml.join("");
        initializeSwiper();
      }
    } else {
      logger6.log("Articles not found");
      showEmptyScreen();
    }
  }
  function showEmptyScreen() {
    logger6.log("Showing Empty Screen");
    const mainSelector = `[data-content="recent-articles"]`;
    const mainElement = document.querySelector(mainSelector);
    if (mainElement) {
      mainElement.remove();
    }
    const selector = `[data-content="recently-viewed-empty"]`;
    const element = document.querySelector(selector);
    if (element) {
      element.classList.remove("hide");
    }
  }
  function initializeSwiper() {
    logger6.log("Initializing Swiper");
    const swiper = new Swiper('[data-content="recent-articles"]', {
      slidesPerView: "auto",
      spaceBetween: 54,
      // Gap between slides (in px)
      navigation: {
        nextEl: ".dash-recent-swiper-arrow-next",
        // Use your custom next button
        prevEl: ".dash-recent-swiper-arrow-prev"
        // Use your custom prev button
      },
      loop: false
      // Optional: Enable infinite loop
    });
    logger6.log("Swiper Initialized");
  }
  function run() {
    logger6.log("[+] RECENT ARTICLE MANAGER -> Running");
    const articlesToTrack = ["/blog/", "/podcast/", "/video/"];
    const pathname = window.location.pathname;
    const toAddArticle = articlesToTrack.some((article) => pathname.startsWith(article));
    logger6.log("toAddArticle", toAddArticle);
    if (toAddArticle) {
      getArticleFromWebpage();
    }
    renderArticlesOnScreen();
  }
  function getRecentArticles() {
    const allArticlesString = localStorage.getItem(CONSTANT.ARTICLE_LIST) || "[]";
    return JSON.parse(allArticlesString);
  }
  var RecentArticleManager = {
    run,
    getRecentArticles,
    renderArticlesOnScreen
  };

  // src/content/phonenumber-input.js
  var run2 = () => {
    const input = document.querySelector("#Whatsapp-Number");
    window.iti = window.intlTelInput(input, {
      // Automatically detect the country using geoIpLookup
      initialCountry: "auto",
      geoIpLookup: function(callback) {
        fetch("https://ipapi.co/json/").then((response) => response.json()).then((data) => {
          callback(data.country_code);
        }).catch(() => {
          callback("us");
        });
      },
      separateDialCode: true,
      strictMode: true,
      // Set the placeholder number type to 'FIXED_LINE'
      placeholderNumberType: "FIXED_LINE",
      // Load the utils script for validation
      loadUtils: () => import("https://cdn.jsdelivr.net/npm/intl-tel-input@25.2.0/build/js/utils.js")
    });
    const dialCode = document.querySelector(".dialCode");
    const errorMsg = document.querySelector("#Tel-Error-Msg");
    const validMsg = document.querySelector("#valid-msg");
    const updateInputValue = function() {
      dialCode.value = "+" + window.iti.getSelectedCountryData().dialCode;
    };
    input.addEventListener("input", updateInputValue, false);
    input.addEventListener("countrychange", updateInputValue, false);
    const errorMap = [
      "Invalid number",
      "Invalid country code",
      "Too short",
      "Too long",
      "Invalid number"
    ];
    const reset = function() {
      input.classList.remove("error");
      errorMsg.innerHTML = "";
      errorMsg.classList.add("hide");
      validMsg.classList.add("hide");
    };
    input.addEventListener("blur", function() {
      reset();
      if (input.value.trim()) {
        if (window.iti.isValidNumber()) {
          validMsg.classList.remove("hide");
        } else {
          input.classList.add("error");
          const errorCode = window.iti.getValidationError();
          errorMsg.innerHTML = errorMap[errorCode] || "Invalid number";
          errorMsg.classList.remove("hide");
        }
      }
    });
    input.addEventListener("change", reset);
    input.addEventListener("keyup", reset);
  };
  var PhoneNumberManager = {
    run: run2
  };

  // src/auth/reset.ts
  var trimSelectOptions = function() {
    const elements = document.querySelectorAll(".onb-form-select option");
    elements.forEach((element) => {
      element.value = element.value.trim();
      element.text = element.text.trim();
    });
  };
  var run3 = function() {
    trimSelectOptions();
  };
  var ResetWebflow = {
    run: run3
  };

  // src/index.ts
  var logger7 = createLogger("INDEX");
  window.Webflow || (window.Webflow = []);
  window.Webflow.push(() => {
    ResetWebflow.run();
    const loader = document.querySelector(".onb-preloader");
    const formSelector = '[data-form="multistep"]';
    const form = document.querySelector(formSelector);
    if (loader) {
      loader.classList.remove("hide");
    }
    const user = new User();
    let MSF;
    if (user) {
      user.showUserDetailsFromLocalStorage();
    }
    function userLoaded(userObject) {
      logger7.log("[+] UserLoaded", userObject);
      if (userObject && !userObject.error) {
        const replaceState = true;
        user.updateMetaDataInLocalStorage(userObject.user_metadata, replaceState);
        user.showUserDetailsOnScreen(userObject);
        PosthogManager.identifyUser(userObject);
        if (MSF) {
          MSF.initialize();
          setTimeout(() => {
            loader?.classList.add("hide");
          }, 1e3);
        }
      } else {
        new NudgeHandler({
          elementSelector: 'data-limit-type="nudge"',
          closeButtonSelector: 'data-action="close-nudge"',
          cookieName: "nudgeDismissed",
          delay: 7
          // N seconds
        });
      }
      const loginButton = document.querySelector("#login-button");
      const dashboardButton = document.querySelector("#dashboard-button");
      if (loginButton) {
        loginButton.style.display = "none";
        loginButton?.classList.add("hide");
      }
      dashboardButton?.classList.remove("hide");
      if (window.location.pathname === "/") {
        user.handleDataShow(userObject);
      }
    }
    if (form) {
      logger7.log("[+] Form", form);
      form.classList.add("hide");
      MSF = new MultiStepFormManager({
        formSelector,
        inputErrorMessageSelector: ".onb-form-field-error",
        options: {
          afterSubmitRedrect: document.querySelector(formSelector)?.getAttribute("data-redirect") || RELATIVE_ROUTES.HOME
        },
        onStepChange: (state) => {
          logger7.log("onStepChange", state);
          const errors = Object.keys(state.errors);
          if (errors.length == 0) {
            user.updateUserMetadata(state.formData);
          }
        }
      });
    }
    initAuthModule(userLoaded);
    PosthogManager.initPosthog();
    RecentArticleManager.run();
    PhoneNumberManager.run();
  });
})();
