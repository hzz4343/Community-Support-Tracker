let onFormSubmit;

if (typeof document !== 'undefined') {
  const formNode = document.getElementById('donation-form');

  onFormSubmit = (event) => {
    event.preventDefault();

    const charityName = document.getElementById('charity-name').value;
    const donationAmount = document.getElementById('donation-amount').value;
    const donationDate = document.getElementById('donation-date').value;
    const donorComment = document.getElementById('donor-comment').value;

    // Validate the form 
    const inputNodes = Array.from(document.getElementsByClassName("formInput"))
    let errorFlag = false

    inputNodes.forEach((inputNode) => {
      const inputValue = inputNode.value
      const errorSpan = document.getElementById(`${inputNode.id}-error`);
      if (inputNode.id === "donation-amount" && parseFloat(inputValue) <= 0) {
        errorSpan.style.visibility = "visible";
        errorSpan.textContent = "Donation Amount must be a valid positive number.";
        errorFlag = true;
      } else if (inputValue == "") {
        errorSpan.style.visibility = "visible"
        errorFlag = true
      } else {
        errorSpan.style.visibility = "hidden"
      }
    })

    if (errorFlag) {
      return
    }

    // If validation passes, create a temporary data object
    const donationData = {
      charityName: charityName,
      donationAmount: parseFloat(donationAmount),
      donationDate: donationDate,
      donorComment: donorComment,
    };

    console.log(donationData);

    document.getElementById('donation-form').reset();

    alert('Donation submitted successfully!');

    return donationData;
  };

  formNode.addEventListener('submit', onFormSubmit);

}

function addFormListener(formNode, callback) {
  formNode.addEventListener("submit", callback);
}

if (typeof window === 'undefined') {
  // window object represents the browser window
  module.exports = { onFormSubmit, addFormListener };
} 
