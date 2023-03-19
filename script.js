'use strict';

const account1 = {
  owner: 'Antonio Alves',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Yanna Ribeiro',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

let currentAccount;

const accounts = [account1, account2, account3, account4];

const login2 = document.querySelector('.login2');
const loginUI = document.querySelector('.loginUI');
const tittleWelcome = document.querySelector('.tittle');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');
const btnLogin = document.querySelector('.login-button');
const btnLogin2 = document.querySelector('.login__btn2');

const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername2 = document.querySelector('.input--username2');
const inputLoginPin2 = document.querySelector('.input--password2');
const inputLoginUsername = document.querySelector('.input--username');
const inputLoginPin = document.querySelector('.input--password');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = ' ';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
            <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
            <div class="movements__value">R$${mov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const createUsernames = function (accounts) {
  accounts.forEach(function (account) {
    account.username = account.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUsernames(accounts);

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `R$${acc.balance}`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `R$${incomes}`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `R$${Math.abs(out)}`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `R$${interest}`;
};

const updateUI = function (acc) {
  //Display movements
  displayMovements(acc.movements);
  //display balance
  calcDisplayBalance(acc);
  //display summary
  calcDisplaySummary(acc);
};

const currencies = new Map([
  ['BRL', 'Reais'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //display main Ui and message and dissapear with the login Ui
    tittleWelcome.textContent = `Bem vindo, ${
      currentAccount.owner.split(' ')[0]
    }`;
    loginUI.classList.toggle('gone');
    containerApp.classList.toggle('show');
    login2.classList.toggle('invisible');

    inputLoginUsername.value = inputLoginPin.value = '';

    //update ui
    updateUI(currentAccount);
  }
});

btnLogin2.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername2.value
  );
  if (currentAccount?.pin === Number(inputLoginPin2.value)) {
    //display main Ui and message and dissapear with the login Ui
    tittleWelcome.textContent = `Bem vindo, ${
      currentAccount.owner.split(' ')[0]
    }`;

    inputLoginUsername2.value = inputLoginPin2.value = '';

    //update ui
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    updateUI(currentAccount);
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value == currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);

    containerApp.classList.toggle('show');
    loginUI.classList.toggle('gone');
    login2.classList.toggle('invisible');
  }

  inputCloseUsername.value = inputClosePin.value = ' ';
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);

    updateUI(currentAccount);

    inputLoanAmount.value = '';
  }
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

//arrays practice from the lecture

// 1.
const bankDepositSum = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((sum, cur) => sum + cur, 0);
console.log(bankDepositSum);

// 2.
//easy way
const numDeposits1000 = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov >= 1000).length;
console.log(numDeposits1000);

// reduce expert

const numDeposits1000v2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((count, cur) => (cur >= 1000 ? count + 1 : count), 0);
console.log(numDeposits1000v2);

//3
const sums = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, cur) => {
      cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );
console.log(sums);

//4
const convertTittleCase = function (tittle) {
  const capitalize = str => str[0].toUpperCase() + str.slice(1);
  const excections = ['a', 'an', 'the', 'but', 'or', 'on', 'in', 'with'];
  const tittleCase = tittle
    .toLowerCase()
    .split(' ')
    .map(word => (excections.includes(word) ? word : capitalize(word)))
    .join(' ');
  return capitalize(tittleCase);
};
console.log(convertTittleCase('this is a nice tittle'));
console.log(convertTittleCase('this is a LONG tittle but not to long'));
console.log(convertTittleCase('and here is another tittle with EXAMPLE'));
