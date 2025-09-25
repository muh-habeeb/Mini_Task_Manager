// let API_BASE = '/api';

let completionChart = null;
let statusChart = null;
let priorityChart = null;

// Load analytics data
async function loadAnalytics() {
    try {
        const period = document.getElementById('analytics-period').value;
        const response = await fetch(`${API_BASE}/analytics/productivity?period=${period}`, {
            headers: getAuthHeaders()
        });

        // console.log(response);
        if (response.ok) {

            const data = await response.json();
            renderCharts(data);
        } else {
            showAlert('Failed to load analytics data');
        }
    } catch (error) {
        showAlert('Network error while loading analytics');
    }
}

// Render all charts
function renderCharts(data) {
    renderCompletionChart(data.completionData);
    renderStatusChart(data.statusData);
    renderPriorityChart(data.priorityData);
}

// Render completion chart (line chart)
function renderCompletionChart(data) {
    const ctx = document.getElementById('completion-chart').getContext('2d');

    if (completionChart) {
        completionChart.destroy();
    }

    const labels = data.map(item => new Date(item.date).toLocaleDateString());
    const values = data.map(item => item.count);

    completionChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Tasks Completed',
                data: values,
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

// Render status chart (pie chart)
function renderStatusChart(data) {
    const ctx = document.getElementById('status-chart').getContext('2d');

    if (statusChart) {
        statusChart.destroy();
    }

    const labels = data.map(item => item.status);
    const values = data.map(item => item.count);
    const colors = ['#e74c3c', '#27ae60']; // Red for Pending, Green for Completed

    statusChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: colors,
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Render priority chart (doughnut chart)
function renderPriorityChart(data) {
    const ctx = document.getElementById('priority-chart').getContext('2d');

    if (priorityChart) {
        priorityChart.destroy();
    }

    const labels = data.map(item => item.priority);
    const values = data.map(item => item.count);
    const colors = ['#27ae60', '#f39c12', '#e74c3c']; // Green for Low, Orange for Medium, Red for High

    priorityChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: colors,
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}