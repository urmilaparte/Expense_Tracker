const themeToggle = document.getElementById('themeToggle');

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
});



const incomeInputSection = document.getElementById('income-input-section');
const expenseInputSection = document.getElementById('expense-input-section');
const transactionHistory = document.getElementById('transaction-history');
const totalIncomeEl = document.getElementById('total-income');
const totalExpensesEl = document.getElementById('total-expenses');
const balanceEl = document.getElementById('balance');

let totalIncome = 0;
let totalExpenses = 0;

function toggleIncomeSection() {
    incomeInputSection.style.display = incomeInputSection.style.display === 'none' ? 'block' : 'none';
}

function toggleExpenseSection() {
    expenseInputSection.style.display = expenseInputSection.style.display === 'none' ? 'block' : 'none';
}

function addIncome() {
    const description = document.getElementById('income-description').value.trim();
    const amount = parseFloat(document.getElementById('income-amount').value.trim());

    if (description === '' || isNaN(amount) || amount <= 0) {
        alert('Please enter a valid income description and amount.');
        return;
    }

    addTransaction(description, amount, 'N/A', 'Income');
    totalIncome += amount;
    updateSummary();
    clearInputs(['income-description', 'income-amount']);
}

function addExpense() {
    const description = document.getElementById('expense-description').value.trim();
    const amount = parseFloat(document.getElementById('expense-amount').value.trim());
    const category = document.getElementById('expense-category').value;

    if (description === '' || isNaN(amount) || amount <= 0) {
        alert('Please enter a valid expense description and amount.');
        return;
    }

    addTransaction(description, amount, category, 'Expense');
    totalExpenses += amount;
    updateSummary();
    clearInputs(['expense-description', 'expense-amount', 'expense-category']);
}

function addTransaction(description, amount, category, type = 'Income') {
    const transactionRow = document.createElement('tr');

    transactionRow.innerHTML = `
        <td>${description}</td>
        <td>${category}</td>
        <td>${amount.toFixed(2)}</td>
        <td>${type}</td>
        <td><button class="delete-btn">Delete</button></td>
    `;

    transactionHistory.appendChild(transactionRow);

    // Save transaction
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions.push({ description, amount, category, type });
    localStorage.setItem('transactions', JSON.stringify(transactions));

    // Delete transaction
    transactionRow.querySelector('.delete-btn').addEventListener('click', function () {
        transactionRow.remove();
        if (type === 'Income') {
            totalIncome -= amount;
        } else {
            totalExpenses -= amount;
        }
        updateSummary();

        // Update localStorage after deleting
        transactions = transactions.filter(t => t.description !== description || t.amount !== amount || t.category !== category);
        localStorage.setItem('transactions', JSON.stringify(transactions));
    });
}


window.onload = function () {
    let savedTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
    savedTransactions.forEach(transaction => {
        addTransaction(transaction.description, transaction.amount, transaction.category, transaction.type);

        // Update total income/expenses
        if (transaction.type === 'Income') {
            totalIncome += transaction.amount;
        } else {
            totalExpenses += transaction.amount;
        }
    });

    updateSummary(); 
};

// Update summary

function updateSummary() {
    totalIncomeEl.textContent = totalIncome.toFixed(2);
    totalExpensesEl.textContent = totalExpenses.toFixed(2);
    balanceEl.textContent = (totalIncome - totalExpenses).toFixed(2);
}

// Clear inputs
function clearInputs(inputIds) {
    inputIds.forEach(id => {
        document.getElementById(id).value = '';
    });
}

// Clear all 
function clearAll() {
    transactionHistory.innerHTML = `
        <tr>
            <th>Description</th>
            <th>Category</th>
            <th>Amount ($)</th>
            <th>Type</th>
            <th>Action</th>
        </tr>
    `;
    totalIncome = 0;
    totalExpenses = 0;
    localStorage.removeItem('transactions'); 
    updateSummary();
}



