const { JSDOM } = require("jsdom");
const { onFormSubmit } = require("../script");

beforeEach(() => {
    global.alert = jest.fn();
});

test("Test that the function is triggered on form submission.", () => {
    const mockPreventDefault = jest.fn();
    const dom = new JSDOM(`
        <!DOCTYPE html>
        <form id="volunteer-hours-form">
            <input id="charityNameInput" value="Sion Kim" />
            <input id="hoursVolunteeredInput" value="7" />
            <input id="whenVolunteertingDateInput" value="2024-08-30" />
            <input type="radio" name="rating" value="5" checked />
        </form>
    `);
    global.document = dom.window.document;
    const formNode = document.querySelector("#volunteer-hours-form");
    formNode.addEventListener("submit", mockPreventDefault);
    let submitEvent = new dom.window.Event("submit");
    formNode.dispatchEvent(submitEvent);
    expect(mockPreventDefault).toHaveBeenCalled();
});

test("Test that the function correctly collects form data.", () => {
    const mockPreventDefault = jest.fn();
    const dom = new JSDOM(`
        <!DOCTYPE html>
        <form id="volunteer-hours-form">
            <input id="charityNameInput" value="Sion Kim" />
            <input id="hoursVolunteeredInput" value="7" />
            <input id="whenVolunteertingDateInput" value="2024-08-30" />
            <input type="radio" name="rating" value="5" checked />
        </form>
    `);
    global.document = dom.window.document;
    const mockEvent = {
        preventDefault: mockPreventDefault,
        target: document.querySelector("#volunteer-hours-form"),
    };
    const result = onFormSubmit(mockEvent);
    expect(global.alert).toHaveBeenCalledWith("Thank you for Submission!");
    expect(result.data).toEqual({
        charityName: "Sion Kim",
        hoursVolunteered: 7,
        volunteeringDate: "2024-08-30",
        ratings: ["5"],
    });
});

test("Test if the function correctly identifies and flags when any of the required fields are left empty.", () => {
    const mockPreventDefault = jest.fn();
    const dom = new JSDOM(`
        <!DOCTYPE html>
        <form id="volunteer-hours-form">
            <input id="charityNameInput" value="" />
            <input id="hoursVolunteeredInput" value="" />
            <input id="whenVolunteertingDateInput" value="" />
        </form>
    `);
    global.document = dom.window.document;
    const mockEvent = {
        preventDefault: mockPreventDefault,
        target: document.querySelector("#volunteer-hours-form"),
    };
    const result = onFormSubmit(mockEvent);
    expect(result).toEqual(undefined);
    expect(global.alert).toHaveBeenCalledWith("Submission failed!");
});

test("Test if the function correctly identifies and flags when the charity name are not valid.", () => {
    const mockPreventDefault = jest.fn();
    const dom = new JSDOM(`
        <!DOCTYPE html>
        <form id="volunteer-hours-form">
            <input id="charityNameInput" value=" " />
            <input id="hoursVolunteeredInput" value="7" />
            <input id="whenVolunteertingDateInput" value="2024-08-30" />
            <input type="radio" name="rating" value="5" checked />
        </form>
    `);
    global.document = dom.window.document;
    const mockEvent = {
        preventDefault: mockPreventDefault,
        target: document.querySelector("#volunteer-hours-form"),
    };
    const result = onFormSubmit(mockEvent);
    expect(result).toEqual(undefined);
    expect(global.alert).toHaveBeenCalledWith("Submission failed!");
});

test("Test if the function correctly identifies and flags when the hours volunteered are not valid.", () => {
    const mockPreventDefault = jest.fn();
    const dom = new JSDOM(`
        <!DOCTYPE html>
        <form id="volunteer-hours-form">
            <input id="charityNameInput" value="Sion Kim" />
            <input id="hoursVolunteeredInput" value="-7" />
            <input id="whenVolunteertingDateInput" value="2024-08-30" />
            <input type="radio" name="rating" value="5" checked />
        </form>
    `);
    global.document = dom.window.document;
    const mockEvent = {
        preventDefault: mockPreventDefault,
        target: document.querySelector("#volunteer-hours-form"),
    };
    const result = onFormSubmit(mockEvent);
    expect(result).toEqual(undefined);
    expect(global.alert).toHaveBeenCalledWith("Submission failed!");

});

test("Test if the function correctly identifies and flags when the experience rating is not within the range of 1-5.", () => {
    const mockPreventDefault = jest.fn();
    const dom = new JSDOM(`
        <!DOCTYPE html>
        <form id="volunteer-hours-form">
            <input id="charityNameInput" value="Sion Kim" />
            <input id="hoursVolunteeredInput" value="7" />
            <input id="whenVolunteertingDateInput" value="2024-08-30" />
            <input type="radio" name="rating" value="6" checked />
        </form>
    `);
    global.document = dom.window.document;
    const mockEvent = {
        preventDefault: mockPreventDefault,
        target: document.querySelector("#volunteer-hours-form"),
    };
    const result = onFormSubmit(mockEvent);
    expect(result).toEqual(undefined);
    expect(global.alert).toHaveBeenCalledWith("Submission failed!");
});

test("Test that the temporary data object is correctly populated with form data.", () => {
    const mockPreventDefault = jest.fn();
    const dom = new JSDOM(`
        <!DOCTYPE html>
        <form id="volunteer-hours-form">
            <input id="charityNameInput" value="Sion Kim" />
            <input id="hoursVolunteeredInput" value="7" />
            <input id="whenVolunteertingDateInput" value="2024-08-30" />
            <input type="radio" name="rating" value="5" checked />
        </form>
    `);
    global.document = dom.window.document;
    const mockEvent = {
        preventDefault: mockPreventDefault,
        target: document.querySelector("#volunteer-hours-form"),
    };
    const result = onFormSubmit(mockEvent);
    expect(global.alert).toHaveBeenCalledWith("Thank you for Submission!");
    expect(result.data).toEqual({
        charityName: "Sion Kim",
        hoursVolunteered: 7,
        volunteeringDate: "2024-08-30",
        ratings: ["5"],
    });
});
