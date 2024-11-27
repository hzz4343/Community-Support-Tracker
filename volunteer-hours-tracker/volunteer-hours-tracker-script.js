function isEmpty(value) {
    return value === null || value.trim() === "" || typeof value === "undefined";
}

function isHours(value, minimum) {
    const numValue = parseFloat(value);
    return !isNaN(numValue) && numValue >= minimum;
}

function isValidCheckedOption(options) {
    return options.some(option => option.checked);
}

function isValidRating(ratingArray) {
    const rating = Number(ratingArray[0]?.value);
    return rating >= 1 && rating <= 5;
}

const showError = (fieldName, message) => {
    const errorFieldId = `${fieldName}Error`;
    const errorField = document.getElementById(errorFieldId);

    if (!errorField) {
        console.log(`Error field with ID '${errorFieldId}' not found.`);
        return;
    }

    errorField.textContent = message;
    errorField.classList.add("error-visible");

    console.log(`Error: ${message}`);

};

const clearErrors = () => {
    const errorMessages = document.querySelectorAll(".error-message");
    errorMessages.forEach((errorField) => {
        errorField.textContent = "";
        errorField.classList.remove("error-visible");
    });

    console.log("Errors cleared");
};

const onFormSubmit = e => {

    e.preventDefault();

    const formData = {
        charityName: document.querySelector("#charityNameInput").value,
        hoursVolunteered: document.querySelector("#hoursVolunteeredInput").value,
        volunteeringDate: document.querySelector("#whenVolunteertingDateInput").value,
        rating: Array.from(document.querySelectorAll('input[name="rating"]:checked'))
    };

    clearErrors();

    let isValid = true;

    if (isEmpty(formData.charityName)) {
        showError("charityNameInput", "Charity Name cannot be empty");
        isValid = false;
    } else {
        console.log("Charity Name:", formData.charityName);
    }

    if (!isHours(formData.hoursVolunteered, 0.5)) {
        showError("hoursVolunteeredInput", "Volunteered hours cannot be less than 0.5 (30min)");
        isValid = false;
    } else {
        console.log("Volunteered hours:", formData.hoursVolunteered);
    }

    if (isEmpty(formData.volunteeringDate)) {
        showError("whenVolunteertingDateInput", "Volunteering Date cannot be empty");
        isValid = false;
    } else {
        console.log("Volunteering Date:", formData.volunteeringDate);
    }

    if (!isValidCheckedOption(formData.rating)) {
        showError("rating", "Stars cannot be empty");
        isValid = false;
    } else if (!isValidRating(formData.rating)) {
        showError("rating", "Stars cannot be out of range (1-5)");
        isValid = false;
    } else {
        const ratings = formData.rating.map(({ value }) => Number(value));
        console.log("Rating:", ratings);
    }

    if (isValid) {
        const submissionData = {
            charityName: formData.charityName,
            hoursVolunteered: parseFloat(formData.hoursVolunteered),
            volunteeringDate: formData.volunteeringDate,
            ratings: formData.rating.map(({ value }) => value)
        };
        console.log("Submission Data:", submissionData);

        e.target.reset();

        alert("Thank you for Submission!");
        console.log("Submission succeeded!");
        return { data: submissionData };
    } else {
        alert("Submission failed!");
        console.log("Submission failed!");
    }
};

if (typeof window === "undefined") {
    module.exports = {
        onFormSubmit
    };
} else {
    const formEle = document.getElementById("volunteer-hours-form");
    formEle.addEventListener("submit", onFormSubmit);
}