function validateForm(inputNodes) {
  let errorFlag = false

  inputNodes.forEach((inputNode) => {
    const inputValue = inputNode.value
    const errorSpan = document.getElementById(`${inputNode.id}-error`);
    if (inputValue == "" || (inputNode.id === "donation-amount" && parseFloat(inputValue) <= 0)) {
      errorSpan.style.visibility = "visible"
      errorFlag = true
    } else {
      errorSpan.style.visibility = "hidden"
    }
  })
  return errorFlag;
}

function collectDonationData() {
  const charityName = document.getElementById('charity-name').value;
  const donationAmount = document.getElementById('donation-amount').value;
  const donationDate = document.getElementById('donation-date').value;
  const donorComment = document.getElementById('donor-comment').value;

  const donationData = {
    charityName: charityName,
    donationAmount: parseFloat(donationAmount),
    donationDate: donationDate,
    donorComment: donorComment,
  };

  return donationData;
}

function onFormSubmit(event) {
  event.preventDefault();

  // Validate the form 
  const inputNodes = Array.from(document.getElementsByClassName("formInput"))
  const isError = validateForm(inputNodes)

  if (isError == false) {
    // If validation passes, create a temporary data object

    const donationData = collectDonationData();

    document.getElementById('donation-form').reset();
    const successSpan = document.getElementById('successSubmission');
    successSpan.style.visibility = "visible";

    saveSubmissionData(donationData);
    displaySubmissionData();

    console.log(donationData);
    return donationData;
  }
};

function addFormListener(formNode, callback) {
  formNode.addEventListener("submit", callback);
}

function saveSubmissionData(data) {
  let submissionData = localStorage.getItem("donation-data");
  if (submissionData == null) {
    submissionData = [];
  } else {
    submissionData = JSON.parse(submissionData);
  }
  submissionData.push(data);
  localStorage.setItem("donation-data", JSON.stringify(submissionData));
}

function displaySubmissionData() {
  const donationTable = document.querySelector("#donation-table tbody");
  donationTable.innerHTML = "";
  let submissionData = JSON.parse(localStorage.getItem("donation-data"));

  submissionData.forEach(({ charityName, donationAmount, donationDate, donorComment }, index) => {
    const row = donationTable.insertRow();
    row.insertCell(0).textContent = charityName;
    row.insertCell(1).textContent = donationAmount;
    row.insertCell(2).textContent = donationDate;
    row.insertCell(3).textContent = donorComment;
    row.insertCell(4).innerHTML = `<button onclick="deleteLogRow(${index})">Delete</button>`;
  });
}

function deleteLogRow(index) {
  let submissionData = localStorage.getItem("donation-data");
  submissionData = JSON.parse(submissionData);

  submissionData.splice(index, 1);

  if (submissionData.length === 0) {
    localStorage.removeItem("donation-data");
  }
  else {
    localStorage.setItem("donation-data", JSON.stringify(submissionData));
  }

  displaySubmissionData();
}

// if window is not undefined, meaning, we are in a web app
if (typeof window !== "undefined") {
  // if the window exists (if we are using the browser as our runtime environment)
  // run init when the window loads
  window.onload = () => {
    const formNode = document.getElementById('donation-form');
    formNode.addEventListener('submit', onFormSubmit);
    displaySubmissionData()
  };
} else {
  module.exports = { addFormListener, onFormSubmit, validateForm, collectDonationData, saveSubmissionData, displaySubmissionData }
}