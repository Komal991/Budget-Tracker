let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let totalAmount = 0;

const nameInput = document.getElementById('name-input');
const categorySelect = document.getElementById('category-select');
const amountInput = document.getElementById('amount-input');
const dateInput = document.getElementById('date-input');
const addBtn = document.getElementById('add-btn');
const expenseTableBody = document.getElementById('expense-table-body');
const totalAmountCell = document.getElementById('total-amount');
const categorySummaryList = document.getElementById('category-summary-list');
const summaryBtn = document.getElementById('summary-btn');

// Function to update total amount
function updateTotalAmount() {
    totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    totalAmountCell.textContent = totalAmount;
}

// Function to save expenses to local storage
function saveExpenses() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Function to render expenses in the table (sorted by date)
function renderExpenses(filteredExpenses = expenses) {
    // Sort expenses by date in ascending order
    filteredExpenses.sort((a, b) => new Date(a.date) - new Date(b.date));

    expenseTableBody.innerHTML = '';
    filteredExpenses.forEach((expense, index) => {
        const newRow = expenseTableBody.insertRow();

        const nameCell = newRow.insertCell();
        const categoryCell = newRow.insertCell();
        const amountCell = newRow.insertCell();
        const dateCell = newRow.insertCell();
        const deleteCell = newRow.insertCell();

        nameCell.textContent = expense.name;
        categoryCell.textContent = expense.category;
        amountCell.textContent = expense.amount;
        dateCell.textContent = expense.date;

        const formattedDate = formatDate(expense.date);
        dateCell.textContent = formattedDate;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', function () {
            expenses.splice(index, 1);
            saveExpenses();
            renderExpenses();
            updateTotalAmount();
            updateCategorySummary(); // Update summary after deletion
        });

        deleteCell.appendChild(deleteBtn);
    });

    updateTotalAmount();
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
}

// Function to update category summary
function updateCategorySummary() {
    const categorySummary = expenses.reduce((summary, expense) => {
        summary[expense.category] = (summary[expense.category] || 0) + expense.amount;
        return summary;
    }, {});

    categorySummaryList.innerHTML = ''; // Clear the list
    for (const [category, total] of Object.entries(categorySummary)) {
        const li = document.createElement('li');
        li.textContent = `${category}: ${total}`;
        categorySummaryList.appendChild(li);
    }
}

// Function to toggle category summary visibility and button text
function toggleCategorySummary() {
    if (categorySummaryList.style.display === 'none' || categorySummaryList.style.display === '') {
        // Show the summary
        updateCategorySummary();
        categorySummaryList.style.display = 'block';
        summaryBtn.textContent = 'Hide Summary'; // Change button text to "Hide Summary"
    } else {
        // Hide the summary
        categorySummaryList.style.display = 'none';
        summaryBtn.textContent = 'Show Summary'; // Change button text to "Show Summary"
    }
}

// Event listeners
addBtn.addEventListener('click', function () {
    const name = nameInput.value;
    const category = categorySelect.value;
    const amount = Number(amountInput.value);
    const date = dateInput.value;

    if (name === '') {
        alert('Please enter an expense name');
        return;
    }
    if (category === '') {
        alert('Please select a category');
        return;
    }
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }
    if (date === '') {
        alert('Please select a date');
        return;
    }

    const expense = { name, category, amount, date };
    expenses.push(expense);

    saveExpenses();
    renderExpenses();

    // Clear inputs after adding
    nameInput.value = '';
    amountInput.value = '';
    dateInput.value = '';
});

// Event listener for the "Summary" button
summaryBtn.addEventListener('click', toggleCategorySummary);

// Initialize the app by loading expenses from local storage
renderExpenses();
