// CloudTrack - Core Expense Tracking Functionality

class ExpenseTracker {
    constructor() {
        this.expenses = this.loadExpenses();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderExpenses();
        this.updateStats();
        this.setDefaultDate();
        this.simulateCloudSync();
    }

    setupEventListeners() {
        // Form submission
        document.getElementById('expense-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addExpense();
        });

        // Refresh button
        document.getElementById('refresh-list').addEventListener('click', () => {
            this.showToast('Refreshed successfully', 'success');
            this.renderExpenses();
        });

        // Export Hub modal
        document.getElementById('open-export-hub').addEventListener('click', () => {
            this.openExportHub();
        });

        document.getElementById('close-export-hub').addEventListener('click', () => {
            this.closeExportHub();
        });

        // Close modal on overlay click
        document.getElementById('export-hub-modal').addEventListener('click', (e) => {
            if (e.target.id === 'export-hub-modal') {
                this.closeExportHub();
            }
        });

        // Tab switching
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchTab(tab.dataset.tab);
            });
        });
    }

    setDefaultDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('expense-date').value = today;
    }

    addExpense() {
        const date = document.getElementById('expense-date').value;
        const category = document.getElementById('expense-category').value;
        const amount = parseFloat(document.getElementById('expense-amount').value);
        const description = document.getElementById('expense-description').value;

        if (!date || !category || !amount || !description) {
            this.showToast('Please fill in all fields', 'error');
            return;
        }

        const expense = {
            id: Date.now(),
            date,
            category,
            amount,
            description,
            timestamp: new Date().toISOString()
        };

        this.expenses.unshift(expense);
        this.saveExpenses();
        this.renderExpenses();
        this.updateStats();
        this.showAutoSave();
        this.showToast('Expense added successfully', 'success');
        this.simulateCloudSync();

        // Reset form
        document.getElementById('expense-form').reset();
        this.setDefaultDate();
    }

    deleteExpense(id) {
        if (confirm('Are you sure you want to delete this expense?')) {
            this.expenses = this.expenses.filter(expense => expense.id !== id);
            this.saveExpenses();
            this.renderExpenses();
            this.updateStats();
            this.showToast('Expense deleted', 'info');
            this.simulateCloudSync();
        }
    }

    renderExpenses() {
        const tbody = document.getElementById('expenses-body');
        const emptyState = document.getElementById('empty-state');

        if (this.expenses.length === 0) {
            tbody.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';

        tbody.innerHTML = this.expenses.map(expense => `
            <tr>
                <td>${this.formatDate(expense.date)}</td>
                <td>
                    <span class="category-badge">${this.getCategoryEmoji(expense.category)} ${expense.category}</span>
                </td>
                <td>${expense.description}</td>
                <td class="text-right">
                    <span class="amount">$${expense.amount.toFixed(2)}</span>
                </td>
                <td class="text-center">
                    <button class="btn-delete" onclick="tracker.deleteExpense(${expense.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    updateStats() {
        const total = this.expenses.reduce((sum, expense) => sum + expense.amount, 0);

        // Calculate monthly expenses (current month)
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const monthly = this.expenses
            .filter(expense => {
                const expenseDate = new Date(expense.date);
                return expenseDate.getMonth() === currentMonth &&
                       expenseDate.getFullYear() === currentYear;
            })
            .reduce((sum, expense) => sum + expense.amount, 0);

        document.getElementById('total-expenses').textContent = `$${total.toFixed(2)}`;
        document.getElementById('monthly-expenses').textContent = `$${monthly.toFixed(2)}`;
        document.getElementById('total-records').textContent = this.expenses.length;

        // Calculate storage used (rough estimate: 1KB per 10 expenses)
        const storageKB = Math.max(0.1, (this.expenses.length / 10) * 1).toFixed(1);
        document.getElementById('storage-used').textContent = `${storageKB} KB`;
    }

    formatDate(dateString) {
        const date = new Date(dateString + 'T00:00:00');
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    getCategoryEmoji(category) {
        const emojis = {
            'Food & Dining': '🍽️',
            'Transportation': '🚗',
            'Entertainment': '🎬',
            'Utilities': '💡',
            'Shopping': '🛍️',
            'Healthcare': '⚕️',
            'Travel': '✈️',
            'Education': '📚',
            'Other': '📌'
        };
        return emojis[category] || '📌';
    }

    showAutoSave() {
        const indicator = document.getElementById('auto-save');
        indicator.style.opacity = '1';
        setTimeout(() => {
            indicator.style.opacity = '0';
        }, 2000);
    }

    simulateCloudSync() {
        const syncStatus = document.getElementById('sync-status');
        syncStatus.classList.add('syncing');
        syncStatus.innerHTML = `
            <svg class="sync-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
            </svg>
            <span class="sync-text">Syncing...</span>
        `;

        setTimeout(() => {
            syncStatus.classList.remove('syncing');
            syncStatus.innerHTML = `
                <svg class="sync-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
                </svg>
                <span class="sync-text">All synced</span>
            `;
        }, 1500);
    }

    openExportHub() {
        const modal = document.getElementById('export-hub-modal');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Initialize the first tab if not already initialized
        if (window.cloudExport) {
            window.cloudExport.initializeQuickExport();
        }
    }

    closeExportHub() {
        const modal = document.getElementById('export-hub-modal');
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab contents
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');

        // Initialize tab content
        if (window.cloudExport) {
            switch(tabName) {
                case 'quick-export':
                    window.cloudExport.initializeQuickExport();
                    break;
                case 'scheduled':
                    window.cloudExport.initializeScheduledBackups();
                    break;
                case 'history':
                    window.cloudExport.initializeExportHistory();
                    break;
                case 'integrations':
                    window.cloudExport.initializeIntegrations();
                    break;
                case 'templates':
                    window.cloudExport.initializeTemplates();
                    break;
            }
        }
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icon = type === 'success' ?
            '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>' :
            type === 'error' ?
            '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>' :
            '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';

        toast.innerHTML = `${icon}<span>${message}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    showLoading(text = 'Processing...') {
        const overlay = document.getElementById('loading-overlay');
        document.getElementById('loading-text').textContent = text;
        overlay.classList.add('active');
    }

    hideLoading() {
        const overlay = document.getElementById('loading-overlay');
        overlay.classList.remove('active');
    }

    // LocalStorage methods
    loadExpenses() {
        try {
            const data = localStorage.getItem('cloudtrack-expenses');
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error loading expenses:', error);
            return [];
        }
    }

    saveExpenses() {
        try {
            localStorage.setItem('cloudtrack-expenses', JSON.stringify(this.expenses));
        } catch (error) {
            console.error('Error saving expenses:', error);
            this.showToast('Failed to save data', 'error');
        }
    }

    // Export methods for cloud-export.js
    getExpenses() {
        return this.expenses;
    }

    getExpensesByDateRange(startDate, endDate) {
        if (!startDate && !endDate) return this.expenses;

        return this.expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            const start = startDate ? new Date(startDate) : new Date('1900-01-01');
            const end = endDate ? new Date(endDate) : new Date('2100-12-31');
            return expenseDate >= start && expenseDate <= end;
        });
    }

    getExpensesByCategory(categories) {
        if (!categories || categories.length === 0) return this.expenses;
        return this.expenses.filter(expense => categories.includes(expense.category));
    }
}

// Initialize the tracker
const tracker = new ExpenseTracker();

// Add slideOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);
