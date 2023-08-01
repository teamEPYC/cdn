// logging
const logMessage = (message) => {
  const messageBase = `[+] Form: ${message}`;
  if (window.location.hostname.includes("webflow.io")) {
    console.warn(messageBase);
  }
};

const atomsForm = document.querySelector("#wf-form-Application-Form");

// Get all the steps and navigation buttons
const steps = Array.from(document.querySelectorAll("[data-step]"));

const prevButton = document.getElementById("prevButton");
if (prevButton) {
  prevButton.addEventListener("click", previousStep);
} else {
  logMessage("Cannot initialize previous button");
}

const nextButton = document.getElementById("nextButton");
if (nextButton) {
  nextButton.addEventListener("click", nextStep);
} else {
  logMessage("Cannot initialize next button");
}

const formStartButton = document.querySelector("#form-start");
if (formStartButton) {
  formStartButton.addEventListener("click", nextStep);
} else {
  logMessage("Cannot initialize form start button");
}

const submitButton = document.getElementById("submit-button");

const stepsIndicator = document.getElementById("stepsIndicator");

const stepIndicatorNames = [
  "Home",
  "Program",
  "Profile",
  "Startup Details",
  "Pitch Deck",
  "About You",
  // "Technology",
  "Others",
];

// Validation

const textAreaValidator = (value, context) => {
  const len = value.split(/[\s]+/);
  return !(len.length > 100);
};
const textAreaErrorMessage = "Use less than 100 words";

const urlValidator = (value, context) => {
  if (!value) {
    return true;
  }
  try {
    const url = new URL(value);
    return true;
  } catch (_) {
    return false;
  }
};
const urlErrorMessage = "Please input a valid URL";

// initialise plugin
const phoneNumberInput = document.querySelector("#phone");
const dialCode = document.querySelector(".dialCode");

const iti = intlTelInput(phoneNumberInput, {
  initialCountry: "in",
  preferredCountries: ["in", "sg"],
  // nationalMode: false,
  placeholderNumberType: "FIXED_LINE_OR_MOBILE",
  customPlaceholder: function (
    selectedCountryPlaceholder,
    selectedCountryData
  ) {
    if (selectedCountryData.iso2 === "in") {
      return "74104 10123";
    }
    return selectedCountryPlaceholder;
  },
});

const updateInputValue = function (event) {
  if (dialCode) {
    dialCode.value = "+" + iti.getSelectedCountryData().dialCode;
  }
};
if (phoneNumberInput) {
  phoneNumberInput.addEventListener("input", updateInputValue, false);
  phoneNumberInput.addEventListener("countrychange", updateInputValue, false);
}
const phoneValidator = (value, context) => {
  if (iti.isValidNumber()) {
    if (phoneNumberInput) {
      $(phoneNumberInput).focus();
    }
    return true;
  }
  const errorCode = iti.getValidationError();
  if (phoneNumberInput) {
    $(phoneNumberInput).focus();
  }
  return false;
};

const currencyValidator = (value, context) => {
  return value >= 0;
};

// Validation schema
const schema = {
  "Program-Type": [{ rule: "required" }],
  "Applicant-Linkedin-URL": [
    { rule: "required" },
    {
      validator: urlValidator,
      errorMessage: urlErrorMessage,
    },
  ],
  "Email-Address": [
    { rule: "required" },
    {
      rule: "email",
    },
  ],
  "First-Name": [{ rule: "required" }],
  "Contact-Number": [
    { rule: "required" },
    {
      validator: phoneValidator,
      errorMessage: "Invalid phone number",
    },
  ],
  "Current-Team": [{ rule: "required" }],
  "Teams-AI-Experience": [
    {
      validator: textAreaValidator,
      errorMessage: textAreaErrorMessage,
    },
  ],
  "Teams-Industry-Experience": [
    {
      validator: textAreaValidator,
      errorMessage: textAreaErrorMessage,
    },
  ],
  "Company-Website": [
    {
      validator: urlValidator,
      errorMessage: urlErrorMessage,
    },
  ],
  "Demo-URL": [
    {
      validator: urlValidator,
      errorMessage: urlErrorMessage,
    },
  ],
  "Time-Commitment": [{ rule: "required" }],
  "Company-Stage": [{ rule: "required" }],
  "Amount-Raised": [
    {
      validator: currencyValidator,
      errorMessage: "Amount cannot be negative",
    },
  ],
  "Startup-Idea": [
    { rule: "required" },
    {
      validator: textAreaValidator,
      errorMessage: textAreaErrorMessage,
    },
  ],
  "Pitch-Deck-File": [
    {
      rule: "minFilesCount",
      value: 1,
      errorMessage: "Please upload your pitch deck",
    },
  ],
  "I-am-remarkably-good-at": [
    {
      validator: textAreaValidator,
      errorMessage: textAreaErrorMessage,
    },
  ],
  "I-am-leveraging-technology-in-my-business-by": [
    {
      validator: textAreaValidator,
      errorMessage: textAreaErrorMessage,
    },
  ],
  "About-Previous-Batch-Experience": [
    {
      validator: textAreaValidator,
      errorMessage: textAreaErrorMessage,
    },
  ],
  "Different-Idea-Because": [
    {
      validator: textAreaValidator,
      errorMessage: textAreaErrorMessage,
    },
  ],
  "Why-Applying": [
    {
      validator: textAreaValidator,
      errorMessage: textAreaErrorMessage,
    },
  ],
  "Previous-Batch": [{ rule: "required" }],
  "Applied-for-Previous-Batch-but": [
    {
      validator: textAreaValidator,
      errorMessage: textAreaErrorMessage,
    },
  ],
  "Fellow-Founder": [{ rule: "required" }],
  "Agree-to-Terms": [
    {
      rule: "required",
      errorMessage: "Please accept our Privacy Policy.",
    },
  ],
};

let validator;

// Function to initialize validation for a specific step
function initValidation(step) {
  validator = new window.JustValidate(atomsForm, {
    rules: {},
    // lockForm: true,
    validateBeforeSubmitting: true,
    errorLabelStyle: {
      fontSize: "14px",
      color: "#ea384c",
    },
  });

  // Toggle button state based on form validity
  validator.onValidate(({ isValid, isSubmitted, fields, groups }) => {
    // console.log({ isValid, fields, groups });
    if (isValid) {
      enableNextButton();
      enableSubmitButton();
    } else {
      disableNextButton();
      disableSubmitButton();
    }
  });
  const fields = $(step).find("input, textarea");

  // Add rules for each field in the current step
  fields.each((index, field) => {
    //
    const { type, name } = field;

    if (name) {
      const rules = schema[name];
      // console.log({ name, rules });
      if (rules) {
        if (type && type === "radio") {
          const radioParent = $(field).parents(".radio-button-wrapper");
          if (radioParent && radioParent[0]) {
            validator.addRequiredGroup(radioParent[0], "Select one option");
          }
        } else if (type && type === "checkbox") {
          if (name === "Agree-to-Terms") {
            const checkboxParent = $(field).parents(".terms-checkbox-wrapper");
            if (checkboxParent && checkboxParent[0]) {
              // console.log(checkboxParent[0], rules);
              validator.addRequiredGroup(
                checkboxParent[0],
                "Please accept our Privacy Policy."
              );
            }
          } else {
            const checkboxParent = $(field).parents(".checkbox-wrapper");
            if (checkboxParent && checkboxParent[0]) {
              validator.addRequiredGroup(
                checkboxParent[0],
                "Select atleast one option"
              );
            }
          }
        } else {
          const parents = $(field).parents(".form-fields-wrapper");
          let errorsContainer;
          if (parents && parents[0]) {
            errorsContainer = parents[0];
          }
          validator.addField(field, rules, {
            errorsContainer,
          });
        }
      }
    } else {
      logMessage("init validation: invalid name");
    }
  });
}

// Function to remove validation for a specific step
function removeValidation() {
  if (validator) {
    validator.destroy();
  }
}

// Navigation

// Function to store step counter value in localStorage
const storeStepInLocalStorage = () => {
  const value = getCurrentStep();
  const serializedValues = JSON.stringify(value);
  localStorage.setItem("formStep", serializedValues);
};

// Function to read step counter value from localStorage and navigate to that step
function restoreStepFromLocalStorage() {
  const formStep = localStorage.getItem("formStep") || 1;
  const stepCount = parseInt(formStep, 10);
  navigateToStep(stepCount);
}

function deleteStepFromLocalStorage() {
  localStorage.removeItem("formStep");
}

// Helper function to get the current step
function getCurrentStep() {
  const currentStepElement = document.querySelector(
    '[data-step]:not([style*="display: none"])'
  );
  if (currentStepElement) {
    const dataStep = currentStepElement.getAttribute("data-step");
    if (dataStep) {
      return parseInt(dataStep, 10);
    }
  }
  return 1;
}

// Helper function to navigate to a specific step
async function navigateToStep(stepNumber) {
  const previousStep = getCurrentStep();
  steps.forEach((step) => {
    if (step.getAttribute("data-step") === stepNumber.toString()) {
      removeValidation();
      const container = stepNumber === steps.length ? atomsForm : step;
      initValidation(container);
      step.style.display = "grid";
    } else {
      step.style.display = "none";
    }
  });

  storeStepInLocalStorage();

  toggleNaviagtionButtonVisibility(stepNumber);
  toggleSubmitButtonVisibility(stepNumber);

  // Disable next steps in the steps indicator
  if (stepsIndicator) {
    const stepIndicators = Array.from(stepsIndicator.children);
    stepIndicators.forEach((indicator, index) => {
      if (index === stepNumber - 1) {
        indicator.classList.add("text-style-bold");
      } else {
        indicator.classList.remove("text-style-bold");
      }
    });
    stepIndicators.forEach((indicator, index) => {
      //
      if (index >= stepNumber) {
        indicator.classList.add("breadcrumbs-disabled");
      } else {
        indicator.classList.remove("breadcrumbs-disabled");
      }
    });
  } else {
    logMessage("Cannot update stepsIndicator");
  }

  // validate form after changing step
  setTimeout(async () => {
    await validator.revalidate();
    if (validator.isValid) {
      enableNextButton();
    }
    setTimeout(() => {
      // if (
      //   /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)
      // ) {
      const currentStep = getCurrentStep();
      if (previousStep !== stepNumber)
        window.scrollTo({ top: 0, behavior: "smooth" });
      // }
    }, 200);
  }, 500);
}

// Create the steps indicator with clickable step names
steps.forEach((step, index) => {
  const dataStep = step.getAttribute("data-step");
  if (dataStep) {
    const stepNumber = parseInt(dataStep, 10);
    const stepName = stepIndicatorNames[stepNumber - 1];
    const stepIndicator = document.createElement("a");
    stepIndicator.href = "#";
    stepIndicator.classList.add("breadcrumb-link");
    stepIndicator.textContent = `${stepName}${
      index === steps.length - 1 ? "" : " >"
    }`;
    stepIndicator.addEventListener("click", () => {
      navigateToStep(stepNumber);
    });
    if (stepsIndicator) {
      stepsIndicator.appendChild(stepIndicator);
    } else {
      logMessage("Cannot find stepsIndicator container");
    }
  }
});

// Function to navigate to the previous step
function previousStep() {
  const currentStep = getCurrentStep();
  if (currentStep) {
    const previousStep = currentStep - 1;

    if (previousStep >= 1) {
      navigateToStep(previousStep);
    }
  } else {
    logMessage("Cannot go to the previous step");
  }
}

// Function to navigate to the next step
async function nextStep() {
  const currentStep = getCurrentStep();
  // null check

  if (currentStep) {
    const nextStep = currentStep + 1;

    if (nextStep <= steps.length) {
      // Validate the current step before navigating to the next
      const isValid = await validator.revalidate();
      if (isValid || currentStep === 1) {
        // if (currentStep === 4) {
        //   const demoUpload = document.querySelector("#Demo-Upload");
        //   if (demoUpload && !demoUpload.value) {
        //     localStorage.removeItem("Demo-Upload");
        //   }
        // }
        disableNextButton();
        disableSubmitButton();
        navigateToStep(nextStep);
      }
    }
  } else {
    logMessage("Cannot go to next step");
  }
}

function toggleNaviagtionButtonVisibility(stepNumber) {
  // Update button visibility based on the current step
  if (prevButton) {
    prevButton.style.display = stepNumber === 1 ? "none" : "flex";
  }
  if (nextButton) {
    nextButton.style.display =
      stepNumber === steps.length || stepNumber === 1 ? "none" : "flex";
  }
}

function disableNextButton() {
  if (nextButton) {
    nextButton.classList.add("is-disabled");
  }
}

function enableNextButton() {
  if (nextButton) {
    nextButton.classList.remove("is-disabled");
  }
}

function disableSubmitButton() {
  if (submitButton) {
    submitButton.classList.add("is-disabled");
  }
}

function enableSubmitButton() {
  if (submitButton) {
    submitButton.classList.remove("is-disabled");
  }
}

function toggleSubmitButtonVisibility(stepNumber) {
  // Update button visibility based on the current step
  if (submitButton) {
    submitButton.style.display = stepNumber === steps.length ? "flex" : "none";
  }
}

// Conditional Logic
function resetHiddenFields(container) {
  $(container)
    .find(
      'input[type="text"], input[type="number"], input[type="email"], textarea'
    )
    .each(function () {
      if ($(this).is(":hidden")) {
        $(this).val("");
      }
    });

  $(container)
    .find('input[type="radio"]')
    .each(function () {
      const currentRadio = $(this);

      if (currentRadio.is(":checked")) {
        currentRadio.prop("checked", false);
        $(currentRadio).siblings().removeClass("w--redirected-checked");
      }
    });
}

function hideAndClearFields(container) {
  $(container).hide();
  resetHiddenFields(container);
}

const maxInput = 5;
const addMore = $("#team-member").find(".add-more-field");

function toggleAddMoreVisibility() {
  const inputCount = $(".linkedin-field-wrapper").find("input:visible").length;

  if (inputCount === maxInput) {
    addMore.hide();
  } else {
    addMore.show();
  }
}

function addDeleteButtonListener(deleteButton) {
  deleteButton.on("click", (event) => {
    const parent = $(event.target).parents(".linkedin-field");
    parent.hide();
    resetHiddenFields(parent[0]);

    storeFormStateInLocalStorage(atomsForm);

    const inputCount = $(".linkedin-field-wrapper").find(
      "input:visible"
    ).length;
    validator.removeField(`#co-founder-${inputCount + 1}`);
    toggleAddMoreVisibility();
  });
}

const addConditionalLogic = () => {
  // Step 1
  $(`input[type='radio'][name='Program-Type']`).on("input", () => {
    const programType = $(
      "input[type='radio'][name='Program-Type']:checked"
    ).val();
    hideAndClearFields("#segment-ai");
    hideAndClearFields("#segment-industry");
    hideAndClearFields("#program-others");
    if (programType === "AI") {
      $("#segment-ai").show();
    } else if (programType === "Industry 5.0") {
      $("#segment-industry").show();
    } else {
      $("#program-others").show();
    }
  });

  $(`input[type='radio'][name='Segment-Industry']`).on("input", () => {
    const programType = $(
      "input[type='radio'][name='Segment-Industry']:checked"
    ).val();
    if (programType === "Other") {
      $("#industry-other").show();
    } else {
      hideAndClearFields("#industry-other");
    }
  });

  // Step 2
  $(`input[type='radio'][name='Current-Team']`).on("input", () => {
    const currentTeam = $(
      "input[type='radio'][name='Current-Team']:checked"
    ).val();
    if (currentTeam === "Have co-founder") {
      $("#team-member").show();
      validator.addField("#co-founder-1", [
        { rule: "required" },
        {
          validator: urlValidator,
          errorMessage: urlErrorMessage,
        },
      ]);

      if (addMore) {
        addMore.on("click", () => {
          const inputCount = $(".linkedin-field-wrapper").find(
            "input:visible"
          ).length;
          if (inputCount < maxInput) {
            const inputContainer = $(".linkedin-field-wrapper");
            const nextInput = inputContainer
              .children("div:visible:last")
              .next();
            nextInput.css("display", "flex");

            validator.addField(
              `#co-founder-${inputContainer.find("input:visible").length}`,
              [
                {
                  validator: urlValidator,
                  errorMessage: urlErrorMessage,
                },
              ],
              {
                errorsContainer: nextInput,
              }
            );
            const deleteButton = nextInput.find(".remove-field");
            addDeleteButtonListener(deleteButton);
            toggleAddMoreVisibility();
          }
        });
      }
    } else {
      hideAndClearFields("#team-member");
      validator.removeField("#co-founder-1");
      const addMore = $("#team-member").find(".add-more-field");
      if (addMore) {
        addMore.off("click");
      }
    }
  });

  $(`input[type='radio'][name='Program-Type']`).on("input", () => {
    const programType = $(
      "input[type='radio'][name='Program-Type']:checked"
    ).val();
    hideAndClearFields("#ai-experience");
    hideAndClearFields("#industry-experience");
    if (programType === "AI") {
      $("#ai-experience").show();
    } else if (programType === "Industry 5.0") {
      $("#industry-experience").show();
    }
  });

  // Step 3
  $(`input[type='radio'][name='Funded']`).on("input", () => {
    const isFunded = $("input[type='radio'][name='Funded']:checked").val();
    hideAndClearFields("#show-funded");
    if (isFunded === "Yes") {
      $("#show-funded").show();
    }
  });

  // Step 5
  $(`input[type='radio'][name='Program-Type']`).on("input", () => {
    const programType = $(
      "input[type='radio'][name='Program-Type']:checked"
    ).val();
    hideAndClearFields("#ai-flow");
    hideAndClearFields("#technology");
    if (programType === "Industry 5.0") {
      $("#technology").css("display", "grid");
    } else {
      $("#ai-flow").css("display", "grid");
    }
  });

  // Step 6
  $(`input[type='radio'][name='Previous-Batch']`).on("input", () => {
    const previousBatch = $(
      "input[type='radio'][name='Previous-Batch']:checked"
    ).val();
    hideAndClearFields("#applied-batch");
    if (previousBatch === "Yes") {
      $("#applied-batch").show();
    }
  });

  $(`input[type='radio'][name='Previously-Applied']`).on("input", () => {
    const previouslyApplied = $(
      "input[type='radio'][name='Previously-Applied']:checked"
    ).val();
    hideAndClearFields("#elaborate-field");
    if (previouslyApplied) {
      $("#elaborate-field").show();
    }
  });

  $(`#learnt-others`).on("input", () => {
    const learntOthers = $("#learnt-others").is(":checked");
    hideAndClearFields("#heard-others");
    if (learntOthers) {
      $("#heard-others").show();
    }
  });
};

// State Management

// Function to read the values of all child inputs of a form
function readFormValues(form) {
  const inputs = Array.from(form.querySelectorAll("input, textarea, select"));
  const values = {};

  inputs.forEach((input) => {
    const { name, value, type, disabled } = input;

    if (!name || disabled) return;
    if (type === "file") {
      // const fileInput = input;
      // console.log(fileInput, fileInput.value);
      // if (fileInput.value) {
      //   localStorage.setItem("Demo-Upload", fileInput.value);
      // }
      return;
    } else if (type === "checkbox") {
      const checkboxInput = input;
      values[name] = checkboxInput.checked;
    } else if (type === "radio") {
      const radioInput = input;
      if (radioInput.checked) {
        values[name] = radioInput.value;
      } else if (!values.hasOwnProperty(name)) {
        values[name] = "";
      }
    } else {
      values[name] = value;
    }
  });

  return values;
}

// Function to store form values in a cookie
function storeFormStateInLocalStorage(form) {
  const values = readFormValues(form);
  const serializedValues = JSON.stringify(values);
  localStorage.setItem("formState", serializedValues);
}

function writeFormValues(serializedValues, form) {
  const values = JSON.parse(serializedValues);

  Object.entries(values).forEach(([name, value]) => {
    const inputs = form.querySelectorAll(
      `input[name="${name}"], textarea[name="${name}"]`
    );

    if (inputs.length === 0) {
      return;
    } // Skip if no inputs found

    const inputType = inputs[0].type;

    if (inputType === "file") {
      // const demoUpload = JSON.parse(localStorage.getItem("Demo-Upload"));
      // const fileInput = inputs[0];
      // if (fileInput.value !== demoUpload) {
      //   navigateToStep(4);
      // }
      return;
    }
    if (inputType === "checkbox") {
      const checkboxInput = inputs[0];
      checkboxInput.checked = value;
      if (value) {
        $(checkboxInput).siblings().addClass("w--redirected-checked");
        checkboxInput.dispatchEvent(new Event("input"));
      }
    } else if (inputType === "radio") {
      inputs.forEach((input) => {
        const radioInput = input;
        if (radioInput.value === value) {
          radioInput.checked = true;
          radioInput.dispatchEvent(new Event("input"));
          $(radioInput).siblings().addClass("w--redirected-checked");
        }
      });
    } else {
      const textInput = inputs[0];
      textInput.value = value;
      if (value && textInput.name.includes("Co---Founder-Linkedin")) {
        $(textInput).parent().css("display", "flex");

        validator.addField(
          textInput,
          [
            {
              validator: urlValidator,
              errorMessage: urlErrorMessage,
            },
          ],
          {
            errorsContainer: $(textInput).parent()[0],
          }
        );
        const deleteButton = $(textInput).parent().find(".remove-field");
        addDeleteButtonListener(deleteButton);
        toggleAddMoreVisibility();
      }
      textInput.dispatchEvent(new Event("input"));
      if (inputType === "textarea") {
        updateTextAreaWordCount(textInput);
      }
    }
  });
}

// Function to read form values from the cookie and set them on child inputs
function restoreFormStateFromLocalStorage(form) {
  const serializedValues = localStorage.getItem("formState");
  if (serializedValues) {
    writeFormValues(serializedValues, form);
  }
}

function deleteFormStateFromLocalStorage() {
  localStorage.removeItem("formState");
}

// Function to handle input event
function handleInput(event) {
  const { target } = event;
  const { form } = target;

  // save the state of the whole form on each input event
  storeFormStateInLocalStorage(form);

  // Update word count when the sibling textarea receives input
  // console.log(target.type);
  if (target.type === "textarea") {
    updateTextAreaWordCount(target);
  }
}

function updateTextAreaWordCount(target) {
  const counter = $(target).siblings(".word-limit");
  if (counter) {
    counter.text(
      `Word Limit: ${target.value ? target.value.split(/[\s]+/).length : 0}/100`
    );
  }
}

// initialize conditional logic, validation, navigation and state storage
const initalizeForm = (form) => {
  addConditionalLogic();
  restoreStepFromLocalStorage();
  restoreFormStateFromLocalStorage(form);
  toggleNaviagtionButtonVisibility(getCurrentStep());
  toggleSubmitButtonVisibility(getCurrentStep());
  //

  const inputs = Array.from(form.querySelectorAll("input, textarea, select"));
  inputs.forEach((input) => {
    const { type } = input;
    if (type !== "submit") {
      input.addEventListener("input", handleInput);
    }
  });
};

initalizeForm(atomsForm);

// Only submit the form if the fields are valid
$(atomsForm).on("submit", (event) => {
  event.preventDefault();
  const { fields, groupFields } = validator;
  const invalidFields = [];
  Object.values(fields).forEach((field) => {
    if (!field.isValid) invalidFields.push(field);
  });
  Object.values(groupFields).forEach((group) => {
    if (!group.isValid) invalidFields.push(group);
  });
  if (invalidFields && invalidFields[0]) {
    const step = $(invalidFields[0].elem).parents(".form-step");
    if (step.length && step[0]) {
      const dataStep = step[0].getAttribute("data-step");
      if (dataStep) {
        navigateToStep(parseInt(dataStep, 10));
      }
    }
  }

  if (validator.isValid) {
    deleteFormStateFromLocalStorage();
    deleteStepFromLocalStorage();
    removeValidation();

    setTimeout(() => {
      resetHiddenFields(atomsForm);
    }, 2000);
  }

  return validator.isValid;
});

// Prevent form submission on pressing enter key
$(document).on("keydown", ":input:not(textarea)", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
  }
});
