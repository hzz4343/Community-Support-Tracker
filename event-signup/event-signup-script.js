const onFormSubmit = e => {
    e.preventDefault();
  
    if (validateForm()) {
        const tempDataObj = {
            id: Date.now(),
            eventName: document.getElementById('event-name').value.trim(),
            companyRepName: document.getElementById('rep-name').value.trim(),
            repEmail: document.getElementById('rep-email').value.trim(),
            role: document.getElementById('role-selection').value
        };
  
        console.log('Form is valid', tempDataObj);
  
        saveSubmissionData(tempDataObj);
        displaySubmissionData();
        calculateEvents();
  
        return { data: tempDataObj }    
    }
  
    console.log('Form is invalid');
  };
  
  const validateForm = () => {
    clearErrors();
    
    return validateEvent() 
        && validateRep() 
        && validateEmail() 
        && validateRole();
  };
  
  const formListener = (form, callback) => {
    form.addEventListener("submit", callback);
  }
  
  const showError = (fieldName, message) => {
    const errorFieldId = `${fieldName}-error`;
    const errorField = document.getElementById(errorFieldId);
  
    if (errorField) {
        errorField.textContent = message;
        errorField.classList.add('error-visible');
    }
  };
  
  const clearErrors = () => {
    const errorMessages = document.querySelectorAll('.error-message');
  
    errorMessages.forEach((errorField) => {
        errorField.textContent = "";
        errorField.classList.remove('error-visible');
    });
  };
  
  const validateEvent = () => {
    const eventName = document.getElementById('event-name').value.trim();
    let isValid = true;
  
    isValid = eventName === "" 
    ? (showError('event', 'Event name cannot be empty'), isValid = false)
    : isValid;
  
    return isValid;
  };
  
  const validateRep = () => {
    const nameInput = document.getElementById('rep-name').value.trim();
    let isValid = true;
  
    namePatternArray = [
        /^[A-Z]/,
        /^[A-Za-z]{3,10}$/
    ];
  
    switch (true) {
        case (nameInput === ""):
            showError('name', 'Representative\'s name cannot be empty') 
            isValid = false;
            break;
        case (!namePatternArray[0].test(nameInput)):
            showError('name', 'Representative\'s name must start with a capital letter'); 
            isValid = false;
            break;
        case (!namePatternArray[1].test(nameInput)):
            showError('name', 'Representative\'s name must be between 3 and 10 characters'); 
            isValid = false;
            break;
    }
  
    return isValid;
  };
  
  const validateEmail = () => {
    const emailInput = document.getElementById('rep-email').value.trim();
    let isValid = true;
  
    const emailPatternArray = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    switch (true) {
        case (emailInput === ""):
            isValid = false;
            showError('email', 'Email cannot be empty') 
            break;
        case (!emailPatternArray.test(emailInput)):
            isValid = false;
            showError('email', 'Invalid email format') 
            break;
    }
  
    return isValid;
  };
  
  const validateRole = () => {
    const role = document.getElementById('role-selection').value;
    let isValid = true;
  
    role === "" 
    ? (showError('role', 'Role needs to be selected'), isValid = false) 
    : isValid;
  
    return isValid;
  };
  
  const saveSubmissionData = (data) => {
    let submissionData = localStorage.getItem('event-data');
  
    submissionData = submissionData == null 
    ? [] 
    : JSON.parse(submissionData);
    
    submissionData.push(data);
    
    localStorage.setItem('event-data', JSON.stringify(submissionData));
  }
  
  const displaySubmissionData = () => {
    const eventTable = document.querySelector('#event-table tbody');
  
    eventTable.innerHTML = '';
    
    let submissionData = JSON.parse(localStorage.getItem('event-data')) || [];
  
    submissionData.sort((a, b) => a.role > b.role ? 1 : -1);
  
    submissionData.forEach(({ id, eventName, companyRepName, repEmail, role }) => {
        const row = eventTable.insertRow();
        row.insertCell(0).textContent = eventName;
        row.insertCell(1).textContent = companyRepName;
        row.insertCell(2).textContent = repEmail;
        row.insertCell(3).textContent = role;
        row.insertCell(4).innerHTML = `<button onclick="deleteLogRow(${id})">Delete</button>`;
    });
  }   
  
  const calculateEvents = () => {
    let data = JSON.parse(localStorage.getItem('event-data')) || [];
    let eventCount = data.length;
  
    const eventSummary = document.getElementById('event-summary');
  
    eventSummary.textContent = `Participants signed up to an event: ${eventCount}`;
  }
  
  const deleteLogRow = (id) => {
    let submissionData = JSON.parse(localStorage.getItem('event-data'));
  
    let i = 0;
    while (i < submissionData.length) {
        if (submissionData[i].id === id) {
            submissionData.splice(i, 1);
        } else {
            i++;
        }
    }
  
    localStorage.setItem('event-data', JSON.stringify(submissionData));
  
    displaySubmissionData();
    calculateEvents();
  }
  
  if (typeof window !== "undefined") {
    window.onload = () => {
        const form = document.getElementById('event-form');
        form.addEventListener('submit', onFormSubmit);
        displaySubmissionData();
        calculateEvents();
    };
  } else {
    module.exports = { 
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
    };
  }