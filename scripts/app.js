const form = document.getElementById('form');
const amountInput = document.getElementById('amount');
const textInput = document.getElementById('text');
const typeInput = document.getElementById('transaction_type');
const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('money_plus');
const expenseEl = document.getElementById('money_minus');
const list = document.getElementById('list');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function saveTransactions() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

function renderTransactions() {
  list.innerHTML = '';
  if (transactions.length === 0) {
    list.innerHTML = `<li class="placeholder">No transactions yet. Start tracking your money</li>`;
    return;
  }
  transactions.forEach(transaction => {
    const li = document.createElement('li');
    li.classList.add(transaction.type === 'income' ? 'plus' : 'minus');
    li.innerHTML = `
      <span>${transaction.type === 'income' ? 'Income' : 'Expense'}: ${transaction.text}</span>
      <span>₹${parseFloat(transaction.amount).toFixed(2)}</span>
      <button onclick="deleteTransaction(${transaction.id})">❌</button>
    `;
    list.appendChild(li);
  });
}

function updateSummary() {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const balance = income - expense;

  balanceEl.textContent = balance.toFixed(2);
  incomeEl.textContent = income.toFixed(2);
  expenseEl.textContent = expense.toFixed(2);
}

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const text = textInput.value.trim();
  const amount = amountInput.value.trim();
  const type = typeInput.value;

  if (text === '' || amount === '' || isNaN(amount) || !type) {
    alert('Please enter valid description, amount, and select transaction type.');
    return;
  }

  const transaction = {
    id: Date.now(),
    text,
    amount: parseFloat(amount),
    type
  };

  transactions.push(transaction);
  saveTransactions();
  renderTransactions();
  updateSummary();

  textInput.value = '';
  amountInput.value = '';
  typeInput.value = '';
});

window.deleteTransaction = function(id) {
  transactions = transactions.filter(t => t.id !== id);
  saveTransactions();
  renderTransactions();
  updateSummary();
};

// Initial render
renderTransactions();
updateSummary();
