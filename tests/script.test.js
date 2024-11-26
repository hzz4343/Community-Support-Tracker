const { onFormSubmit } = require('../script');

const { JSDOM } = require('jsdom');

// Import the function you want to test
const { fireEvent } = require('@testing-library/dom');

describe('Calls onFormSubmit when the form is submitted', () => {
  // Arrange
  beforeEach(() => {
    // Set up the HTML structure in the test DOM
    dom = new JSDOM(`
      <form id="donation-form">
        // <input type="text" id="charity-name" name="charity-name" />
        // <input type="number" id="donation-amount" name="donation-amount" />
        // <input type="date" id="donation-date" name="donation-date" />
        // <textarea id="donor-comment" name="donor-comment"></textarea>
        // <button type="submit">Submit Donation</button>
      </form>
    `);

    global.document = dom.window.document;
    formNode = global.document.getElementById('donation-form');

    // Attach the onFormSubmit listener
    // formNode.addEventListener('submit', onFormSubmit);
  });

  // Act and Assert
  test('calls onFormSubmit when the form is submitted', () => {
    // Spy on the onFormSubmit function
    const MockOnFormSubmit = jest.fn(onFormSubmit);
    // formNode.removeEventListener('submit', onFormSubmit);
    formNode.addEventListener('submit', MockOnFormSubmit);

    // Simulate a form submission
    fireEvent.submit(formNode);

    // Assert that the spy was called
    expect(MockOnFormSubmit).toHaveBeenCalled();
  });
});


