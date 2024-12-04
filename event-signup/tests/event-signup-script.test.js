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
  validateRole,
  saveSubmissionData,
  displaySubmissionData,
  calculateEvents,
  deleteLogRow
} = require("../script"); 

let dom;
let document;
let tempDataObj;

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
      <div>
        <table id="event-table">
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Company Representative Name</th>
              <th>Representative's Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
      <div id="summary-section">
        <h3>Event Summary</h3>
        <p id="event-summary"></p>
      </div>
      <button type="submit">Submit</button>
    </form>
  `);

  global.localStorage = {
    getItem: jest.fn().mockReturnValue('[]'),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  };

  tempDataObj = [
    {
      id: 1234567890,
      eventName: '10k Marathon For Cancer Awareness',
      companyRepName: 'Zachary',
      repEmail: 'zachary@email.com',
      role: 'sponsor',
    },
    {
      id: 1234567899,
      eventName: '10k Marathon For Cancer Awareness',
      companyRepName: 'Lam',
      repEmail: 'lam@email.com',
      role: 'sponsor',
    }
  ];

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

  const formNode = document.querySelector("#event-form");

  formNode.addEventListener("submit", mockPreventDefault);

  let submitEvent = new dom.window.Event("submit");

  formNode.dispatchEvent(submitEvent);

  expect(mockPreventDefault).toHaveBeenCalled();
});

test('formListener successful callback', () => {
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

  test('onFormSubmit collects form data and populates tempDataObj', () => {
    const mockPreventDefault = jest.fn();
  
    const dateNow = 1234567890;
    jest.spyOn(Date, 'now').mockReturnValue(dateNow);
  
    const localStorageMock = {
      getItem: jest.fn().mockReturnValue(null),
      setItem: jest.fn(),
    };
  
    global.localStorage = localStorageMock;
  
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
        id: dateNow,
        eventName: "10k Marathon For Cancer Awareness",
        companyRepName: "Zachary",
        repEmail: "zachary@email.com",
        role: "sponsor",
    });
    expect(mockPreventDefault).toHaveBeenCalled();
  
    expect(localStorageMock.setItem).toHaveBeenCalledWith('event-data', expect.any(String));
  });
  
  test('Data is correctly stored in localStorage', () => {
    saveSubmissionData(tempDataObj);
    
  expect(global.localStorage.setItem).toHaveBeenCalledWith('event-data', JSON.stringify([tempDataObj]));
});

test('Data is correctly retrieved from localStorage and loaded into table', () => {
  global.localStorage.getItem = jest.fn().mockReturnValue(JSON.stringify(tempDataObj));

  displaySubmissionData();

  const tr = document.querySelectorAll('#event-table tbody tr');

  expect(tr.length).toBe(2);

  const td = tr[0].querySelectorAll('td');

  expect(td[0].textContent).toBe('10k Marathon For Cancer Awareness');
  expect(td[1].textContent).toBe('Lam');
  expect(td[2].textContent).toBe('lam@email.com');
  expect(td[3].textContent).toBe('sponsor');
});

test('Event summary correctly calculates total events and displays number of participants', () => {
  localStorage.getItem = jest.fn((key) => {
    return key === 'event-data' ? JSON.stringify(tempDataObj) : null;
  });

  calculateEvents();

  const eventTotal = document.querySelector('#event-summary').textContent;

  expect(eventTotal).toBe('Participants signed up to an event: 2');
});

test('Delete button removes a record from localStorage', () => {
  localStorage.getItem.mockImplementation((key) => {
    return key === 'event-data' ? JSON.stringify(tempDataObj) : null;
  });

  localStorage.setItem.mockImplementation((key, value) => {
    key === 'event-data' ? tempDataObj = JSON.parse(value) : null;
  });

  localStorage.setItem('event-data', JSON.stringify(tempDataObj));

  // console.log('Before:', JSON.parse(localStorage.getItem('event-data')));

  deleteLogRow(tempDataObj[0]['id']);

  // console.log('After:', JSON.parse(localStorage.getItem('event-data')));

  const localData = JSON.parse(localStorage.getItem('event-data'));

  expect(localData.length).toBe(1);

  expect(localData[0]).toEqual(tempDataObj[0]);

  expect(localStorage.setItem).toHaveBeenCalledWith('event-data', JSON.stringify([tempDataObj[0]]));
});

test('Delete button removes a record from the table', () => {
  // jest.spyOn(localStorage, 'getItem');

  localStorage.getItem.mockImplementation((key) => {
    return key === 'event-data' ? JSON.stringify(tempDataObj) : null;
  });

  localStorage.setItem.mockImplementation((key, value) => {
    key === 'event-data' ? tempDataObj = JSON.parse(value) : null;
  });

  localStorage.setItem('event-data', JSON.stringify(tempDataObj));

  displaySubmissionData();

  let tr = document.querySelectorAll('#event-table tbody tr');

  expect(tr.length).toBe(2);

  deleteLogRow(tempDataObj[0]['id']);

  displaySubmissionData();

  tr = document.querySelectorAll('#event-table tbody tr');

  expect(tr.length).toBe(1);

  const td = tr[0].querySelectorAll('td');

  expect(td[0].textContent).toBe('10k Marathon For Cancer Awareness');
  expect(td[1].textContent).toBe('Lam');
  expect(td[2].textContent).toBe('lam@email.com');
  expect(td[3].textContent).toBe('sponsor');
});