const formNode = document.getElementById('donation-form');

formNode.addEventListener('submit', (event) => {
  event.preventDefault();

  const charityName = document.getElementById('charity-name').value;
  const donationAmount = document.getElementById('donation-amount').value;
  const donationDate = document.getElementById('donation-date').value;
  const donorComment = document.getElementById('donor-comment').value;

  if (!charityName) {
    alert('Charity Name is required.');
    return;
  }

  if (!donationAmount || Number(donationAmount) <= 0) {
    alert('Donation Amount must be a valid positive number.');
    return;
  }

  if (!donationDate) {
    alert('Date of Donation is required.');
    return;
  }

  if (!donorComment) {
    alert('Donor message is required.');
    return;
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
});
