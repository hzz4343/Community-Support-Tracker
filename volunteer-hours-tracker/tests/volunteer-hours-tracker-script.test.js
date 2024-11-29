const { JSDOM } = require("jsdom");
const { onFormSubmit, saveSubmissionData, displaySubmissionData, calculateTotalHours, deleteLogRow } = require("../volunteer-hours-tracker-script");

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

test("Test that the function correctly collects form data. & Test that the temporary data object is correctly populated with form data.", () => {
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
            <input type="radio" name="rating" value="" />
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

test("Test that data is correctly stored in localStorage.", () => {
    const dom = new JSDOM();

    global.document = dom.window.document;

    global.localStorage = {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn()
    };

    const mockNeoData = {
        charityName: "Sion Kim",
        hoursVolunteered: 7,
        volunteeringDate: "2024-08-30",
        ratings: ["5"]
    };

    const mockCompData = [
        {
            charityName: "Min",
            hoursVolunteered: 1,
            volunteeringDate: "2024-12-06",
            ratings: ["1"]
        },
        {
            charityName: "Sion Kim",
            hoursVolunteered: 7,
            volunteeringDate: "2024-08-30",
            ratings: ["5"]
        }
    ];

    let mockLocalData = [
        {
            charityName: "Min",
            hoursVolunteered: 1,
            volunteeringDate: "2024-12-06",
            ratings: ["1"]
        }
    ];

    localStorage.getItem = jest.fn((key) => {
        if (key === "submissionData") {
            return JSON.stringify(mockLocalData);
        }
    });

    localStorage.setItem = jest.fn((key, value) => {
        if (key === "submissionData") {
            mockLocalData = JSON.parse(value); 
        }
    });

    saveSubmissionData(mockNeoData);
    expect(mockLocalData).toEqual(mockCompData);
});

test("Test that data is correctly retrieved from localStorage and loaded into the table.", () => {
    const dom = new JSDOM(`
        <!DOCTYPE html>
        <table id="volunteer-hours-table">
            <tbody></tbody>
        </table>
    `);
    global.document = dom.window.document;

    global.localStorage = {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn()
    };

    const mockData = [
        {
            charityName: "Min",
            hoursVolunteered: 1,
            volunteeringDate: "2024-12-06",
            ratings: ["1"]
        },
        {
            charityName: "Sion Kim",
            hoursVolunteered: 7,
            volunteeringDate: "2024-08-30",
            ratings: ["5"]
        }
    ];

    localStorage.getItem = jest.fn((key) => {
        if (key === "submissionData") {
            return JSON.stringify(mockData);
        }
    });

    displaySubmissionData();

    const tableRows = document.querySelectorAll("#volunteer-hours-table tbody tr");

    expect(tableRows.length).toBe(2);

    const cellsOne = tableRows[0].querySelectorAll("td");
    expect(cellsOne[0].textContent).toBe("Min");
    expect(cellsOne[1].textContent).toBe("1");
    expect(cellsOne[2].textContent).toBe("2024-12-06");
    expect(cellsOne[3].textContent).toBe("1");

    const cellsTwo = tableRows[1].querySelectorAll("td");
    expect(cellsTwo[0].textContent).toBe("Sion Kim");
    expect(cellsTwo[1].textContent).toBe("7");
    expect(cellsTwo[2].textContent).toBe("2024-08-30");
    expect(cellsTwo[3].textContent).toBe("5");
});

test("Test that the summary section correctly calculates and displays the total hours volunteered.", () => {
    const dom = new JSDOM(`
        <!DOCTYPE html>
        <div id="summary-section">
            <h3>Total Volunteered Hours</h3>
            <p id="total-hours">0</p>
        </div>
    `);
    global.document = dom.window.document;
    
    global.localStorage = {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn()
    };
    
    const mockData = [
        {
            charityName: "Min",
            hoursVolunteered: 1,
            volunteeringDate: "2024-12-06",
            ratings: ["1"]
        },
        {
            charityName: "Sion Kim",
            hoursVolunteered: 7,
            volunteeringDate: "2024-08-30",
            ratings: ["5"]
        }
    ];

    localStorage.getItem = jest.fn((key) => {
        if (key === "submissionData") {
            return JSON.stringify(mockData);
        }
    });

    calculateTotalHours();

    const totalHours = document.querySelector("#total-hours").textContent;
    expect(totalHours).toBe("8");
});

test("Test that the delete button removes a record from the table.", () => {
    const dom = new JSDOM(`
        <!DOCTYPE html>
        <html>
        <body>
            <table id="volunteer-hours-table">
                <tbody></tbody>
            </table>
            <div id="summary-section">
            <p id="total-hours">0</p>
            </div>
        </body>
        </html>
    `);

    global.document = dom.window.document;

    global.localStorage = {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn()
    };

    let mockData = [
        {
            charityName: "Min",
            hoursVolunteered: 1,
            volunteeringDate: "2024-12-06",
            ratings: ["1"]
        },
        {
            charityName: "Sion Kim",
            hoursVolunteered: 7,
            volunteeringDate: "2024-08-30",
            ratings: ["5"]
        }
    ];

    localStorage.getItem = jest.fn((key) => {
        if (key === "submissionData") {
            return JSON.stringify(mockData);
        }
    });
    localStorage.setItem = jest.fn((key, value) => {
        if (key === "submissionData") {
            mockData = JSON.parse(value); 
        }
    });

    localStorage.setItem("submissionData", JSON.stringify(mockData));

    const iniHTML = document.querySelector("#volunteer-hours-table").innerHTML;
    console.log("Initial",iniHTML); 

    displaySubmissionData();

    const medHTML = document.querySelector("#volunteer-hours-table").innerHTML;
    console.log("Medium",medHTML); 
    
    deleteLogRow(0);

    const FinHTML = document.querySelector("#volunteer-hours-table").innerHTML;
    console.log("Final",FinHTML); 

    const rows = document.querySelectorAll("#volunteer-hours-table tbody tr");
    expect(rows.length).toBe(1);

    const cellsTwo = rows[0].querySelectorAll("td");
    expect(cellsTwo[0].textContent).toBe("Sion Kim");
    expect(cellsTwo[1].textContent).toBe("7");
    expect(cellsTwo[2].textContent).toBe("2024-08-30");
    expect(cellsTwo[3].textContent).toBe("5");
});

test("Test that the delete button removes a record from localStorage.", () => {
    const dom = new JSDOM(`
        <!DOCTYPE html>
        <html>
        <body>
            <table id="volunteer-hours-table">
                <tbody></tbody>
            </table>
            <div id="summary-section">
                <p id="total-hours">0</p>
            </div>
        </body>
        </html>
    `);

    global.document = dom.window.document;

    global.localStorage = {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn()
    };

    let mockData = [
        {
            charityName: "Min",
            hoursVolunteered: 1,
            volunteeringDate: "2024-12-06",
            ratings: ["1"]
        },
        {
            charityName: "Sion Kim",
            hoursVolunteered: 7,
            volunteeringDate: "2024-08-30",
            ratings: ["5"]
        }
    ];

    localStorage.getItem = jest.fn((key) => {
        if (key === "submissionData") {
            return JSON.stringify(mockData);
        }
    });

    localStorage.setItem = jest.fn((key, value) => {
        if (key === "submissionData") {
            mockData = JSON.parse(value);
        }
    });

    localStorage.setItem("submissionData", JSON.stringify(mockData));

    displaySubmissionData();
    deleteLogRow(0);

    const updatedLocalData = JSON.parse(localStorage.getItem("submissionData"));

    expect(updatedLocalData.length).toBe(1);

    expect(updatedLocalData[0]).toEqual({
        charityName: "Sion Kim",
        hoursVolunteered: 7,
        volunteeringDate: "2024-08-30",
        ratings: ["5"]
    });
});

test("Test that the total volunteered hours in the summary section is updated when a log is deleted.", () => {
    const dom = new JSDOM(`
        <!DOCTYPE html>
        <html>
        <body>
            <table id="volunteer-hours-table">
                <tbody></tbody>
            </table>
            <div id="summary-section">
                <p id="total-hours">0</p>
            </div>
        </body>
        </html>
    `);

    global.document = dom.window.document;

    global.localStorage = {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn()
    };

    let mockData = [
        {
            charityName: "Min",
            hoursVolunteered: 1,
            volunteeringDate: "2024-12-06",
            ratings: ["1"]
        },
        {
            charityName: "Sion Kim",
            hoursVolunteered: 7,
            volunteeringDate: "2024-08-30",
            ratings: ["5"]
        }
    ];

    localStorage.getItem = jest.fn((key) => {
        if (key === "submissionData") {
            return JSON.stringify(mockData);
        }
    });

    localStorage.setItem = jest.fn((key, value) => {
        if (key === "submissionData") {
            mockData = JSON.parse(value);
        }
    });

    localStorage.setItem("submissionData", JSON.stringify(mockData));

    displaySubmissionData();
    calculateTotalHours();

    let totalHours = document.querySelector("#total-hours").textContent;
    expect(totalHours).toBe("8");

    deleteLogRow(0);

    totalHours = document.querySelector("#total-hours").textContent;
    expect(totalHours).toBe("7");
});