const { addFormListener, onFormSubmit, collectDonationData, validationForm, validateForm } = require('../donation-tracker-script');
const { JSDOM } = require('jsdom');

test("setupForm correctly adds the callback", () => {
  // fake function; only returns true
  const mockCallback = jest.fn(() => true);

  // setup dom
  const dom = new JSDOM(`<!DOCTYPE html><form id="test-form"></form>`);
  global.document = dom.window.document;

  // query form node
  const formNode = document.querySelector("#test-form");

  // invoke mocked function on submit event
  addFormListener(formNode, mockCallback);

  let submitEvent = new dom.window.Event("submit");
  // force submit event to be triggered on form node
  formNode.dispatchEvent(submitEvent);

  expect(mockCallback).toHaveBeenCalled();
});

test("collectDonationData function correctly collects form data", () => {
  // Set up the DOM with a fake form structure
  const dom = new JSDOM(`
    <!DOCTYPE html>
    <html>
      <body>
        <form id="donation-form">
          <input id="charity-name" class="formInput" type="text" value="Charity X" />
          <input id="donation-amount" class="formInput" type="number" value="50" />
          <input id="donation-date" class="formInput" type="date" value="2024-11-26" />
          <textarea id="donor-comment" class="formInput">Great cause!</textarea>
          <button type="submit">Submit</button>
        </form>
      </body>
    </html>
  `);

  // Mock the document in global scope
  global.document = dom.window.document;

  // Act on collectDonationData function
  const result = collectDonationData()

  // Define the expected donation data
  const expectedDonationData = {
    charityName: "Charity X",
    donationAmount: 50,
    donationDate: "2024-11-26",
    donorComment: "Great cause!"
  };

  expect(result).toEqual(expectedDonationData);
})

test("errorFlag raised when any of required fields are empty", () => {
  // Set up the DOM with a fake form structure
  const dom = new JSDOM(`
    <!DOCTYPE html>
    <html>
      <body>
        <form id="donation-form">
          <input id="charity-name" class="formInput" type="text" value="" />
          <span
              id="charity-name-error"
              class="error-message"
              style="visibility: hidden"
              >Charity Name is required.</span
            >
          <input id="donation-amount" class="formInput" type="number" value="" />
          <span
              id="donation-amount-error"
              class="error-message"
              style="visibility: hidden"
              >Donation Amount must be a valid positive number.</span
            >
          <input id="donation-date" class="formInput" type="date" value="" />
          <span
              id="donation-date-error"
              class="error-message"
              style="visibility: hidden"
              >Date of Donation is required.</span
            >
          <textarea id="donor-comment" class="formInput"></textarea>
          <span
              id="donor-comment-error"
              class="error-message"
              style="visibility: hidden"
              >Donor message is required.</span
            >
          <button type="submit">Submit</button>
        </form>
      </body>
    </html>
  `);

  // Mock the document in global scope
  global.document = dom.window.document;
  const inputNodes = Array.from(global.document.getElementsByClassName("formInput"))

  // Act on validateForm
  const errorFlag = validateForm(inputNodes)

  // Assert 
  expect(errorFlag).toBe(true);
  expect(document.getElementById('charity-name-error').style.visibility).toBe('visible');
  expect(document.getElementById('donation-amount-error').style.visibility).toBe('visible');
  expect(document.getElementById('donation-date-error').style.visibility).toBe('visible');
  expect(document.getElementById('donor-comment-error').style.visibility).toBe('visible');
})

test("test if donation amount is not valid", () => {
  const dom = new JSDOM(`
    <!DOCTYPE html>
    <html>
      <body>
        <form id="donation-form">
          <input id="charity-name" class="formInput" type="text" value="Charity X" />
          <span
              id="charity-name-error"
              class="error-message"
              style="visibility: hidden"
              >Charity Name is required.</span
            >
          <input id="donation-amount" class="formInput" type="number" value="-50" />
          <span
              id="donation-amount-error"
              class="error-message"
              style="visibility: hidden"
              >Donation Amount must be a valid positive number.</span
            >
          <input id="donation-date" class="formInput" type="date" value="2024-11-26" />
          <span
              id="donation-date-error"
              class="error-message"
              style="visibility: hidden"
              >Date of Donation is required.</span
            >
          <textarea id="donor-comment" class="formInput">Great causes!</textarea>
          <span
              id="donor-comment-error"
              class="error-message"
              style="visibility: hidden"
              >Donor message is required.</span
            >
          <button type="submit">Submit</button>
        </form>
      </body>
    </html>
  `);

  // Mock the document in global scope
  global.document = dom.window.document;
  const inputNodes = Array.from(global.document.getElementsByClassName("formInput"))

  // Act on validateForm
  const errorFlag = validateForm(inputNodes)

  // Assert 
  expect(errorFlag).toBe(true);
  expect(document.getElementById('donation-amount-error').style.visibility).toBe('visible');
})

test("test temporary data object is populated", () => {
  // Set up the DOM with a fake form structure
  const dom = new JSDOM(`
    <!DOCTYPE html>
    <html>
      <body>
        <form id="donation-form">
          <input id="charity-name" class="formInput" type="text" value="Charity X" />
          <span
              id="charity-name-error"
              class="error-message"
              style="visibility: hidden"
              >Charity Name is required.</span
            >
          <input id="donation-amount" class="formInput" type="number" value="50" />
          <span
              id="donation-amount-error"
              class="error-message"
              style="visibility: hidden"
              >Donation Amount must be a valid positive number.</span
            >
          <input id="donation-date" class="formInput" type="date" value="2024-11-26" />
          <span
              id="donation-date-error"
              class="error-message"
              style="visibility: hidden"
              >Date of Donation is required.</span
            >
          <textarea id="donor-comment" class="formInput">Great cause!</textarea>
          <span
              id="donor-comment-error"
              class="error-message"
              style="visibility: hidden"
              >Donor message is required.</span
            >
          <button type="submit">Submit</button>
          <span
              id="successSubmission"
              class="successSubmission"
              style="visibility: hidden"
              >Submitted successfully!</span
            >
        </form>
      </body>
    </html>
  `);

  // Mock the document in global scope
  global.document = dom.window.document;

  const mockValidateForm = jest.fn(validationForm);
  const mockCollectDonationData = jest.fn(collectDonationData);

  // Act
  const mockEvent = { preventDefault: jest.fn() };
  const result = onFormSubmit(mockEvent);

  // Define the expected donation data
  const expectedDonationData = {
    charityName: "Charity X",
    donationAmount: 50,
    donationDate: "2024-11-26",
    donorComment: "Great cause!"
  };

  expect(result).toEqual(expectedDonationData);
})  