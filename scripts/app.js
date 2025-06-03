const form = document.getElementById('form');
const amountInput = document.getElementById('amount');
const textInput = document.getElementById('text');
const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('money-plus');
const expenseEl = document.getElementById('money-minus');
const list = document.getElementById('list');

let transactions = [];

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const text = textInput.value.trim();
  const amount = amountInput.value.trim();

  if (text === '' || isNaN(amount)) {
    alert('Please enter valid description and amount');
    return;
  }

  const transaction = {
    id: Date.now(),
    text: text,
    amount: amount
  };

  transactions.push(transaction);
  updateTransactionList();
  updateBalance();

  textInput.value = '';
  amountInput.value = '';
});

function updateTransactionList() {
  list.innerHTML = ''; 

  if (transactions.length === 0) {
    list.innerHTML = `<li class="placeholder">No transactions yet. Start tracking your money</li>`;
    return;
  }

  transactions.forEach(transaction => {
    const li = document.createElement('li');
    li.classList.add(transaction.amount > 0 ? 'plus' : 'minus');

    li.innerHTML = `
      ${transaction.text}
      <span>₹${transaction.amount}</span>
      <button onclick="deleteTransaction(${transaction.id})">❌</button>
    `;
    list.appendChild(li);
  });
}

function updateBalance() {
  const amounts = transactions.map(t => t.amount);
  const total = amounts.reduce((acc, val) => acc + val, 0);
  const income = amounts.filter(a => a > 0).reduce((acc, val) => acc + val, 0);
  const expense = amounts.filter(a => a < 0).reduce((acc, val) => acc + val, 0) * -1;

  balanceEl.textContent = total.toFixed(2);
  incomeEl.textContent = income.toFixed(2);
  expenseEl.textContent = expense.toFixed(2);
  updateBalance();
}

function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  updateTransactionList();
  updateBalance();
}
