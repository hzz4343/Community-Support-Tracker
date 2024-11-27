test("onFormSubmit function correctly collects form data", () => {
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
    global.window = dom.window;

    // Select the form node
    const formNode = document.querySelector("#donation-form");

    // Create a mock event to simulate form submission
    let submitEvent = new dom.window.Event("submit");

    // Call onFormSubmit manually with the mock event
    const returnValue = onFormSubmit(submitEvent);

    // Define the expected donation data
    const expectedDonationData = {
        charityName: "Charity X",
        donationAmount: 50,
        donationDate: "2024-11-26",
        donorComment: "Great cause!"
    };

    // Check if the return value matches the expected donation data
    expect(returnValue).toEqual(expectedDonationData);
});
