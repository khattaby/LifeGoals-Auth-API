// Global variables
let currentUser = null;
let authToken = null;
const API_BASE = 'http://localhost:5000/api';

// DOM elements
const welcomeSection = document.getElementById('welcomeSection');
const authSection = document.getElementById('authSection');
const dashboard = document.getElementById('dashboard');
const profileSection = document.getElementById('profileSection');
const apiDocs = document.getElementById('apiDocs');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const nav = document.getElementById('nav');
const loading = document.getElementById('loading');
const toast = document.getElementById('toast');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

function initializeApp() {
    // Check if user is already logged in
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('currentUser');
    
    if (savedToken && savedUser) {
        authToken = savedToken;
        currentUser = JSON.parse(savedUser);
        showDashboard();
    } else {
        showWelcome();
    }
}

function setupEventListeners() {
    // Navigation buttons
    document.getElementById('showLoginBtn').addEventListener('click', showLogin);
    document.getElementById('showRegisterBtn').addEventListener('click', showRegister);
    document.getElementById('switchToRegister').addEventListener('click', showRegister);
    document.getElementById('switchToLogin').addEventListener('click', showLogin);
    document.getElementById('logoutBtn').addEventListener('click', logout);
    document.getElementById('profileBtn').addEventListener('click', showProfile);
    document.getElementById('dashboardBtn').addEventListener('click', showDashboard);
    document.getElementById('showApiDocs').addEventListener('click', showApiDocumentation);
    document.getElementById('backToApp').addEventListener('click', backToApp);
    document.getElementById('refreshProfileBtn').addEventListener('click', loadUserProfile);

    // Form submissions
    document.getElementById('loginFormElement').addEventListener('submit', handleLogin);
    document.getElementById('registerFormElement').addEventListener('submit', handleRegister);
    document.getElementById('addGoalForm').addEventListener('submit', handleAddGoal);
}

// UI Navigation Functions
function showWelcome() {
    hideAllSections();
    welcomeSection.style.display = 'block';
    document.getElementById('logoutBtn').style.display = 'none';
}

function showLogin() {
    hideAllSections();
    authSection.style.display = 'block';
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
}

function showRegister() {
    hideAllSections();
    authSection.style.display = 'block';
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
}

function showDashboard() {
    hideAllSections();
    dashboard.style.display = 'block';
    document.getElementById('logoutBtn').style.display = 'block';
    document.getElementById('profileBtn').style.display = 'block';
    document.getElementById('dashboardBtn').style.display = 'none';
    document.getElementById('userName').textContent = currentUser?.name || 'User';
    loadGoals();
}

function showProfile() {
    hideAllSections();
    profileSection.style.display = 'block';
    document.getElementById('logoutBtn').style.display = 'block';
    document.getElementById('profileBtn').style.display = 'none';
    document.getElementById('dashboardBtn').style.display = 'block';
    
    // Check if user is logged in before loading profile
    if (!authToken) {
        showToast('Please login first to view your profile', 'error');
        showWelcome();
        return;
    }
    
    loadUserProfile();
}

function showApiDocumentation() {
    hideAllSections();
    apiDocs.style.display = 'block';
    document.getElementById('showApiDocs').style.display = 'none';
    document.getElementById('backToApp').style.display = 'inline-flex';
}

function backToApp() {
    document.getElementById('showApiDocs').style.display = 'inline-flex';
    document.getElementById('backToApp').style.display = 'none';
    
    if (currentUser) {
        showDashboard();
    } else {
        showWelcome();
    }
}

function hideAllSections() {
    welcomeSection.style.display = 'none';
    authSection.style.display = 'none';
    dashboard.style.display = 'none';
    profileSection.style.display = 'none';
    apiDocs.style.display = 'none';
}

// Authentication Functions
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    showLoading(true);
    
    try {
        const response = await fetch(`${API_BASE}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
            authToken = data.token;
            currentUser = data;
            
            // Save to localStorage
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            showToast('Login successful!', 'success');
            showDashboard();
        } else {
            showToast(data.message || 'Login failed', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showToast('Network error. Please try again.', 'error');
    } finally {
        showLoading(false);
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    
    if (!name || !email || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
    }
    
    showLoading(true);
    
    try {
        const response = await fetch(`${API_BASE}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
            authToken = data.token;
            currentUser = data;
            
            // Save to localStorage
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            showToast('Registration successful!', 'success');
            showDashboard();
        } else {
            showToast(data.message || 'Registration failed', 'error');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showToast('Network error. Please try again.', 'error');
    } finally {
        showLoading(false);
    }
}

function logout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    
    // Clear forms
    document.getElementById('loginFormElement').reset();
    document.getElementById('registerFormElement').reset();
    document.getElementById('addGoalForm').reset();
    
    showToast('Logged out successfully', 'info');
    showWelcome();
}

async function checkAuthStatus() {
    if (!authToken) return;
    
    try {
        const response = await fetch(`${API_BASE}/users/me`, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
            },
        });
        
        if (!response.ok) {
            // Token is invalid, logout
            logout();
        }
    } catch (error) {
        console.error('Auth check error:', error);
        logout();
    }
}

// Profile Functions
async function loadUserProfile() {
    if (!authToken) {
        showToast('Please login first', 'error');
        return;
    }
    
    showLoading(true);
    
    try {
        const response = await fetch(`${API_BASE}/users/me`, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
            },
        });
        
        if (response.ok) {
            const userData = await response.json();
            displayUserProfile(userData);
        } else {
            const data = await response.json();
            showToast(data.message || 'Failed to load profile', 'error');
        }
    } catch (error) {
        console.error('Load profile error:', error);
        showToast('Network error. Please try again.', 'error');
    } finally {
        showLoading(false);
    }
}

function displayUserProfile(userData) {
    // Update profile fields with proper fallback values
    document.getElementById('profileName').textContent = userData.name || 'Not available';
    document.getElementById('profileEmail').textContent = userData.email || 'Not available';
    document.getElementById('profileId').textContent = userData.id || userData._id || 'Not available';
    
    // Format join date (using current date as placeholder since we don't have this in the API)
    const joinDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('profileJoined').textContent = joinDate;
    
    showToast('Profile loaded successfully!', 'success');
}

// Goal Management Functions
async function loadGoals() {
    if (!authToken) return;
    
    showLoading(true);
    
    try {
        const response = await fetch(`${API_BASE}/goals`, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
            },
        });
        
        const goals = await response.json();
        
        if (response.ok) {
            displayGoals(goals);
        } else {
            showToast('Failed to load goals', 'error');
        }
    } catch (error) {
        console.error('Load goals error:', error);
        showToast('Network error loading goals', 'error');
    } finally {
        showLoading(false);
    }
}

function displayGoals(goals) {
    const goalsList = document.getElementById('goalsList');
    const noGoals = document.getElementById('noGoals');
    
    if (!goals || goals.length === 0) {
        goalsList.innerHTML = '';
        noGoals.style.display = 'block';
        return;
    }
    
    noGoals.style.display = 'none';
    
    goalsList.innerHTML = goals.map(goal => `
        <div class="goal-item" data-id="${goal._id}">
            <div class="goal-text" id="goal-text-${goal._id}">${escapeHtml(goal.text)}</div>
            <div class="goal-actions">
                <button class="btn btn-small btn-edit" onclick="editGoal('${goal._id}')">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-small btn-delete" onclick="deleteGoal('${goal._id}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

async function handleAddGoal(e) {
    e.preventDefault();
    
    const goalText = document.getElementById('goalText').value.trim();
    
    if (!goalText) {
        showToast('Please enter a goal', 'error');
        return;
    }
    
    showLoading(true);
    
    try {
        const response = await fetch(`${API_BASE}/goals`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify({ text: goalText }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
            document.getElementById('goalText').value = '';
            showToast('Goal added successfully!', 'success');
            loadGoals();
        } else {
            showToast(data.message || 'Failed to add goal', 'error');
        }
    } catch (error) {
        console.error('Add goal error:', error);
        showToast('Network error. Please try again.', 'error');
    } finally {
        showLoading(false);
    }
}

async function editGoal(goalId) {
    const goalItem = document.querySelector(`[data-id="${goalId}"]`);
    const goalTextElement = document.getElementById(`goal-text-${goalId}`);
    const currentText = goalTextElement.textContent;
    
    // Check if already editing
    if (goalItem.classList.contains('editing')) {
        return;
    }
    
    // Create input field
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentText;
    input.className = 'edit-input';
    input.style.cssText = `
        width: 100%;
        padding: 8px;
        border: 2px solid #007bff;
        border-radius: 4px;
        font-size: 14px;
        background: white;
    `;
    
    // Create action buttons
    const saveBtn = document.createElement('button');
    saveBtn.innerHTML = '<i class="fas fa-check"></i>';
    saveBtn.className = 'btn btn-small btn-success';
    saveBtn.style.marginRight = '5px';
    
    const cancelBtn = document.createElement('button');
    cancelBtn.innerHTML = '<i class="fas fa-times"></i>';
    cancelBtn.className = 'btn btn-small btn-secondary';
    
    // Replace text with input
    goalTextElement.style.display = 'none';
    goalTextElement.parentNode.insertBefore(input, goalTextElement);
    
    // Replace action buttons
    const actionsDiv = goalItem.querySelector('.goal-actions');
    const originalActions = actionsDiv.innerHTML;
    actionsDiv.innerHTML = '';
    actionsDiv.appendChild(saveBtn);
    actionsDiv.appendChild(cancelBtn);
    
    // Mark as editing
    goalItem.classList.add('editing');
    input.focus();
    input.select();
    
    // Save function
    const saveEdit = async () => {
        const newText = input.value.trim();
        
        if (!newText) {
            showToast('Goal text cannot be empty', 'error');
            input.focus();
            return;
        }
        
        if (newText === currentText) {
            cancelEdit();
            return;
        }
        
        showLoading(true);
        
        try {
            const response = await fetch(`${API_BASE}/goals/${goalId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({ text: newText }),
            });
            
            const data = await response.json();
            
            if (response.ok) {
                showToast('Goal updated successfully!', 'success');
                loadGoals(); // Refresh the list
            } else {
                showToast(data.message || 'Failed to update goal', 'error');
                cancelEdit();
            }
        } catch (error) {
            console.error('Edit goal error:', error);
            showToast('Network error. Please try again.', 'error');
            cancelEdit();
        } finally {
            showLoading(false);
        }
    };
    
    // Cancel function
    const cancelEdit = () => {
        goalItem.classList.remove('editing');
        input.remove();
        goalTextElement.style.display = 'block';
        actionsDiv.innerHTML = originalActions;
    };
    
    // Event listeners
    saveBtn.addEventListener('click', saveEdit);
    cancelBtn.addEventListener('click', cancelEdit);
    
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            saveEdit();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            cancelEdit();
        }
    });
    
    // Cancel if clicking outside
    const handleClickOutside = (e) => {
        if (!goalItem.contains(e.target)) {
            cancelEdit();
            document.removeEventListener('click', handleClickOutside);
        }
    };
    
    setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
    }, 100);
}

async function deleteGoal(goalId) {
    showLoading(true);
    
    try {
        const response = await fetch(`${API_BASE}/goals/${goalId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`,
            },
        });
        
        if (response.ok) {
            showToast('Goal deleted successfully!', 'success');
            loadGoals();
        } else {
            const data = await response.json();
            showToast(data.message || 'Failed to delete goal', 'error');
        }
    } catch (error) {
        console.error('Delete goal error:', error);
        showToast('Network error. Please try again.', 'error');
    } finally {
        showLoading(false);
    }
}

// Utility Functions
function showLoading(show) {
    loading.style.display = show ? 'flex' : 'none';
}

function showToast(message, type = 'info') {
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Handle network errors globally
window.addEventListener('online', () => {
    showToast('Connection restored', 'success');
});

window.addEventListener('offline', () => {
    showToast('Connection lost. Please check your internet.', 'error');
});

// Auto-refresh goals every 30 seconds if user is logged in
setInterval(() => {
    if (currentUser && authToken && dashboard.style.display === 'block') {
        loadGoals();
    }
}, 30000);