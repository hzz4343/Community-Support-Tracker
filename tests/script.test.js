const { addFormListener } = require('../script');
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

