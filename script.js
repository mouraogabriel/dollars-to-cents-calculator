const submitButton = document.getElementById('submitBtn');
const keys = document.querySelector('.calculator-keys');
const modalBody = document.querySelector('.modal-body');
const modalTitle = document.querySelector('.modal-title');
const inputForm = document.getElementById('dollarInput');
const quartersResult = document.getElementById('quarters-field');
const dimesResult = document.getElementById('dimes-field');
const nickelsResult = document.getElementById('nickels-field');
const penniesResult = document.getElementById('pennies-field');

/* converts the total cents value of the input to an array of coin objects with a quantity and value for each one of them */
const convertToCoins = valueInCents => {
    let coinsArray = [
        quarter = {
            quantity: 0,
            value: 25
        },
        dime = {
            quantity: 0,
            value: 10
        },
        nickel = {
            quantity: 0,
            value: 5
        },
        penny = {
            quantity: 0,
            value: 1
        }
    ];

    for (coin of coinsArray) {

        let remainder = Math.trunc(valueInCents % coin.value);
        let intPart = Math.trunc(valueInCents / coin.value);

        coin.quantity += intPart;
        valueInCents = remainder === 0 ? 0 : remainder;
    }

    return coinsArray;
}

// Parses the input to float, converts dollars to cents and then rounds the float.
const convertToCents = valueInDollars => Math.round(parseFloat(valueInDollars) * 100);

// checks if the input is a valid number (for currency).
const isInputValid = inputValue => {
    if (inputValue === '0$' || inputValue === '0¢') {
        
        modalTitle.innerHTML = 'The Input is Zero!'
        modalBody.innerHTML = `Warning: The current input value is 0, you're not really converting anything.`;

        $('#myModal').modal();

        return 0;
    } else if (inputValue.includes('.')) {

        /* regex that matches anything that isn't a digit or a dot, if there is a match the whole string (inputValue now converted to string) gets substituted by a blank string. */
        inputValue =  (inputValue.toString()).replace(/[^\d.]/g, '');

        /* if the input is valid then check if it has deciamals, in case of decimals it gets rid of every decimal that is beyond the second one. */
        
        inputValue = inputValue.substring(0, inputValue.indexOf('.') + 3);

        return convertToCents(inputValue);
    } else if (inputValue.length > 13) {
        modalTitle.innerHTML = 'The Input Number is Too Big!'
        modalBody.innerHTML = 'The number is too big to be converted, try a smaller one.';
        $('#myModal').modal();

        return 0;
    }

    return convertToCents(inputValue);
}

// gets the input value from the form.
const getInputValue = () => isInputValid(document.getElementById('dollarInput').value);

// shows the results of the convertion on the calculator's screen.
const showResults = (cents, arrayOfCoins) => {
    quartersResult.innerHTML = (quarter.quantity);
    dimesResult.innerHTML = (dime.quantity);
    nickelsResult.innerHTML = (nickel.quantity);
    penniesResult.innerHTML = (penny.quantity);
    return inputForm.value = cents + '¢';
}

// gets the array with each coin quantity.
const getCoins = totalInCents => showResults(totalInCents, convertToCoins(totalInCents));

// gets the total amount of cents from the dollars input.
const getCents = () => getCoins(getInputValue());

// #############################################
// # THE CALCULATOR KEYS FUNCTIONS START HERE. #
// #############################################

// checks the input form for an exact '0$' string.
const checkIfInputZero = () => {
    if (/0/.test(inputForm.value) &&
    inputForm.value.length === 2) {
        return true;
    }

    return false;
}

// checks the input form string for a existing dot.
const checkDot = () => /[\.]/.test(inputForm.value);

/* prints the character according to the current value inside the input form, in case it is a 0, replaces that with the input value + $, otherwise replaces the input value with a substring of that value (only the numbers) + character + $ */
const printChar = char => {
    let inputValue = inputForm.value;
    let pureValue = inputValue.substring(0, inputValue.length - 1);

    if (inputValue.includes('¢')) {
        resetInputForm(inputValue);
        return printChar(char);
    }

    if (checkIfInputZero()) {
        return char === '.' ? inputForm.value = '0.$' : inputForm.value = char + '$';
    } else if (checkDot()) {
        return char === '.' ? 0 : inputForm.value = pureValue + char + '$';
    } else {
        return inputForm.value = pureValue + char + '$';
    }
}

/* deletes the rightmost character in the input form, checking if it needs to be deleted first, in case it is not 0, it replaces its value with either 0$ or '' strings. */
const deleteChar = inputValue => {
    dollarSignIndex = inputValue.indexOf('$');

    if (inputValue.includes('¢')) {
        return resetInputForm(inputValue);
    }

    if (checkIfInputZero()) {
        return 0;
    } else if (inputValue.length === 2 && !checkIfInputZero()) {
        return inputForm.value = inputValue.replace(inputValue[0], '0');
    } else {
        return inputForm.value = (inputValue.slice(0, dollarSignIndex - 1) + '$');
    }
}

// replaces the input string value with 0$.
const resetInputForm = inputValue => inputForm.value = inputValue.replace(inputValue, '0$');

/* checks the value of the key. If it is a digit, calls print function, if it is a dot, calls checkDot if false calls print function, if it is the clear key, calls the deleteChar function and if it is the all-clear key, calls the reset function. */
const checkKey = inputKey => {
    let value =  inputForm.value
    if (/[\d]/.test(inputKey)) {
        return printChar(inputKey);
    } else if (/[\.]/.test(inputKey)) {
        return checkDot() ? printChar('') : printChar(inputKey);
    } else if (inputKey === 'clear') {
        return deleteChar(value);
    } else if (inputKey === 'all-clear'){
        return resetInputForm(value);
    }
}

// gets the clicked key value and calls checkKey.
const getKey = clickedKey => checkKey(clickedKey.target.value);

submitButton.addEventListener('click', getCents);
keys.addEventListener('click', getKey);