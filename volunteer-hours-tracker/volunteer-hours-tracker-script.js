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

function deleteLog() {
    localStorage.removeItem("volunteer-data");
    displaySubmissionData();
    calculateTotalHours()
    alert("Log Deleted");
    console.log("Log Deleted");
}

function saveSubmissionData(neoSubmissionData) {
    let submissionData = localStorage.getItem("volunteer-data");
    console.log("LocalData: JSON", submissionData);
    if (submissionData == null) {
        submissionData = [];
    } else {
        submissionData = JSON.parse(submissionData);
    }
    console.log("LocalData : Array", submissionData);
    console.log("Neo 2 : Object", neoSubmissionData);
    submissionData.push(neoSubmissionData);
    localStorage.setItem("volunteer-data", JSON.stringify(submissionData));
    console.log("LocalData + Neo : JSON", localStorage.getItem("volunteer-data"));
}

function displaySubmissionData() {
    const volunteerHoursTable = document.querySelector("#volunteer-hours-table tbody");
    volunteerHoursTable.innerHTML = "";
    let submissionData = localStorage.getItem("volunteer-data");
    if (submissionData === null) {
        submissionData = [];
    } else {
        submissionData = JSON.parse(submissionData);
    }
    submissionData.forEach(({ charityName, hoursVolunteered, volunteeringDate, ratings }, index) => {
        const row = volunteerHoursTable.insertRow();
        row.insertCell(0).textContent = charityName;
        row.insertCell(1).textContent = hoursVolunteered;
        row.insertCell(2).textContent = volunteeringDate;
        row.insertCell(3).textContent = ratings;
        row.insertCell(4).innerHTML = `<button onclick="deleteLogRow(${index})">Delete</button>`;
    });
}

function calculateTotalHours() {
    let submissionData = localStorage.getItem("volunteer-data");
    if (submissionData === null) {
        submissionData = [];
    } else {
        submissionData = JSON.parse(submissionData);
    }
    let totalHours = 0;
    for (let i = 0; i < submissionData.length; i++) {
        totalHours += Number(submissionData[i].hoursVolunteered);
    }
    document.getElementById("total-hours").textContent = totalHours;
}

function deleteLogRow(index) {
    let submissionData = localStorage.getItem("volunteer-data");
    if (submissionData === null) {
        submissionData = [];
    } else {
        submissionData = JSON.parse(submissionData);
    }
    submissionData.splice(index, 1);
    localStorage.setItem("volunteer-data", JSON.stringify(submissionData));
    displaySubmissionData();
    calculateTotalHours();
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
        console.log("Neo 1 : Object:", submissionData)
        if (typeof window !== "undefined") {
            saveSubmissionData(submissionData);
            displaySubmissionData();
            calculateTotalHours();
        }
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
        onFormSubmit,
        saveSubmissionData,
        displaySubmissionData,
        calculateTotalHours,
        deleteLogRow
    };
} else {
    const formEle = document.getElementById("volunteer-hours-form");
    formEle.addEventListener("submit", onFormSubmit);

    const deleteEle = document.getElementById("delete-log");
    deleteEle.addEventListener("click", deleteLog);

    document.addEventListener("DOMContentLoaded", () => {
        displaySubmissionData();
        calculateTotalHours();
    });
}