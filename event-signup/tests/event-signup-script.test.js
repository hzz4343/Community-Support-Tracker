const { JSDOM } = require("jsdom");
const {
  onFormSubmit,
  validateForm,
  formListener,
  showError,
  clearErrors,
  validateEvent, 
  validateRep, 
  validateEmail, 
  validateRole
} = require("../event-signup-script");

let dom;
let document;

beforeEach(() => {
  dom = new JSDOM(`
    <form id="event-form">
      <input type="text" id="event-name" />
      <span id="event-error" class="error-message"></span>
      <input type="text" id="rep-name" />
      <span id="name-error" class="error-message"></span>
      <input type="text" id="rep-email" />
      <span id="email-error" class="error-message"></span>
      <select id="role-selection">
        <option value=""></option>
        <option value="sponsor">Sponsor</option>
        <option value="participant">Participant</option>
        <option value="organizer">Organizer</option>
      </select>
      <span id="role-error" class="error-message"></span>
      <button type="submit">Submit</button>
    </form>
  `);

  document = dom.window.document;
  global.document = document;
});

test('validateEvent should return true for valid event name', () => {
  document.getElementById('event-name').value = '10k Marathon For Cancer Awareness';

  expect(validateEvent()).toBe(true);
});

test('validateEvent should return false if no input is provided', () => {
  document.getElementById('event-name').value = '';

  expect(validateEvent()).toBe(false);
});

test('validateRep should return true for valid representative name', () => {
  document.getElementById('rep-name').value = 'Zachary';

  expect(validateRep()).toBe(true);
});

test('validateRep should return false if no input is provided', () => {
  document.getElementById('rep-name').value = '';

  expect(validateRep()).toBe(false);
});

test('validateRep should return false if name doesn\'t start with a capital letter', () => {
  document.getElementById('rep-name').value = 'zachary';

  expect(validateRep()).toBe(false);
});

test('validateRep should return false if name is too short', () => {
  document.getElementById('rep-name').value = 'Za';

  expect(validateRep()).toBe(false);
});

test('validateEmail should return true for valid email', () => {
  document.getElementById('rep-email').value = 'zachary@email.com';

  expect(validateEmail()).toBe(true);
});

test('validateEmail should return false if no input is provided', () => {
  document.getElementById('rep-email').value = '';

  expect(validateEmail()).toBe(false);
});

test('validateEmail should return false if email is not in the correct format', () => {
  document.getElementById('rep-email').value = 'zachary@email';

  expect(validateEmail()).toBe(false);
})

test('validateRole should return true if a role is selected', () => {
  document.getElementById('role-selection').value ='sponsor';

  expect(validateRole()).toBe(true);
});

test('validateRole should return false if no role is selected', () => {
  document.getElementById('role-selection').value = '';

  expect(validateRole()).toBe(false);
});

test('validateForm should return true if all fields are valid', () => {
  document.getElementById('event-name').value = '10k Marathon For Cancer Awareness';
  document.getElementById('rep-name').value = 'Zachary';
  document.getElementById('rep-email').value = 'zachary@email.com';
  document.getElementById('role-selection').value ='sponsor';

  expect(validateForm()).toBe(true);
});

test('validateForm should return false if any field is invalid', () => {
  document.getElementById('event-name').value = '';
  document.getElementById('rep-name').value = 'Zachary';
  document.getElementById('rep-email').value = 'zachary@email.com';
  document.getElementById('role-selection').value = '';

  expect(validateForm()).toBe(false);
});

test('showError displays correct error message', () => {
  const fieldName = 'name';
  const errorMessage = 'Representative\'s name must be between 3 and 10 characters';

  showError(fieldName, errorMessage);

  const errorElement = document.getElementById(`${fieldName}-error`);

  expect(errorElement.textContent).toBe(errorMessage);

  expect(errorElement.classList.contains('error-visible')).toBe(true);
});

test('onFormSubmit triggers on form submission', () => {
  const mockPreventDefault = jest.fn();
  const dom = new JSDOM(`
      <form id="event-form">
      <input type="text" id="event-name" value="10k Marathon For Cancer Awareness"/>
      <span id="event-error" class="error-message"></span>
      <input type="text" id="rep-name" value="Zachary"/>
      <span id="name-error" class="error-message"></span>
      <input type="text" id="rep-email" value="zachary@email.com/>
      <span id="email-error" class="error-message"></span>
      <select id="role-selection" value="sponsor">
        <option value=""></option>
        <option value="sponsor">Sponsor</option>
        <option value="participant">Participant</option>
        <option value="organizer">Organizer</option>
      </select>
      <span id="role-error" class="error-message"></span>
      <button type="submit">Submit</button>
    </form>
  `);

  global.document = dom.window.document;

  const formNode = document.querySelector("#event-form");

  formNode.addEventListener("submit", mockPreventDefault);

  let submitEvent = new dom.window.Event("submit");

  formNode.dispatchEvent(submitEvent);

  expect(mockPreventDefault).toHaveBeenCalled();
});

test('onFormSubmit collects form data and populates tempDataObj', () => {
  const mockPreventDefault = jest.fn();

  const mockEvent = {
      preventDefault: mockPreventDefault,
      target: document.querySelector("#event-form"),
  };

  document.getElementById('event-name').value = '10k Marathon For Cancer Awareness';
  document.getElementById('rep-name').value = 'Zachary';
  document.getElementById('rep-email').value = 'zachary@email.com';
  document.getElementById('role-selection').value = 'sponsor';
  
  const result = onFormSubmit(mockEvent);

  expect(result).not.toBeNull();
  expect(result.data).toEqual({
      eventName: "10k Marathon For Cancer Awareness",
      companyRepName: "Zachary",
      repEmail: "zachary@email.com",
      role: "sponsor",
  });
  expect(mockPreventDefault).toHaveBeenCalled();
});

test("formListener successful callback", () => {
const mockCallback = jest.fn(() => true);

const dom = new JSDOM(`
<!DOCTYPE html>
<form id="test-form">
    <input type="text" id="event-name" />
    <button type="submit">Submit</button>
</form>
`);

global.document = dom.window.document;

const formNode = global.document.querySelector("#test-form");

formListener(formNode, mockCallback);

let submitEvent = new dom.window.Event("submit");

formNode.dispatchEvent(submitEvent);

expect(mockCallback).toHaveBeenCalled();
});