// Global variables
let riskMap;
let simulationMap;
let isSimulationRunning = false;
let simulationTime = 0;
let simulationInterval;
let fireSpreadLayers = [];

// ML API endpoints
const ML_API_BASE = window.location.origin.replace(':5000', ':5001');
let mlPredictions = {};
let realTimeUpdates = false;

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeMaps();
    initializeCharts();
    initializeSimulation();

    // Initialize ML components
    initializeMLIntegration();

    // Initialize monitoring stats
    updateMonitoringStats();

    // Initialize fire theme effects
    initializeForestFireTheme();
    initializeFireInteractions();
    
    // Initialize enhanced data sources
    initializeDataSourcesInteractions();

    startDataUpdates();
});

// Fire theme initialization
function initializeForestFireTheme() {
    // Add fire effect overlay with animated particles
    const fireOverlay = document.createElement('div');
    fireOverlay.id = 'fire-overlay';
    fireOverlay.style.position = 'fixed';
    fireOverlay.style.top = '0';
    fireOverlay.style.left = '0';
    fireOverlay.style.width = '100%';
    fireOverlay.style.height = '100%';
    fireOverlay.style.pointerEvents = 'none';
    fireOverlay.style.zIndex = '1';
    fireOverlay.style.background = `
        radial-gradient(ellipse 400px 200px at 10% 90%, rgba(255, 69, 0, 0.1) 0%, transparent 60%),
        radial-gradient(ellipse 300px 150px at 90% 85%, rgba(255, 140, 0, 0.08) 0%, transparent 70%),
        radial-gradient(ellipse 200px 100px at 60% 80%, rgba(255, 69, 0, 0.06) 0%, transparent 80%)
    `;
    fireOverlay.style.opacity = '0.4';
    fireOverlay.style.animation = 'fireGlow 6s ease-in-out infinite alternate';

    document.body.appendChild(fireOverlay);

    // Create floating embers
    createFloatingEmbers();

    // Simulate dynamic fire intensity
    setInterval(() => {
        const intensity = Math.random() * 0.2 + 0.3; // Vary between 30% and 50% opacity
        fireOverlay.style.opacity = intensity;
    }, 4000);
}

function createFloatingEmbers() {
    setInterval(() => {
        if (Math.random() < 0.3) { // 30% chance to create ember
            const ember = document.createElement('div');
            ember.style.position = 'fixed';
            ember.style.width = '3px';
            ember.style.height = '3px';
            ember.style.background = Math.random() > 0.5 ? '#FF4500' : '#FF8C00';
            ember.style.borderRadius = '50%';
            ember.style.left = Math.random() * window.innerWidth + 'px';
            ember.style.top = window.innerHeight + 'px';
            ember.style.pointerEvents = 'none';
            ember.style.zIndex = '2';
            ember.style.boxShadow = `0 0 6px ${ember.style.background}`;
            ember.style.opacity = '0.8';
            ember.style.animation = 'emberFloat 8s linear forwards';

            document.body.appendChild(ember);

            setTimeout(() => {
                if (document.body.contains(ember)) {
                    document.body.removeChild(ember);
                }
            }, 8000);
        }
    }, 2000);
}

// Fire cursor trail effect
let fireParticles = [];

function initializeFireInteractions() {
    // Initialize fire cursor trail
    document.addEventListener('mousemove', function(e) {
        if (Math.random() < 0.1) { // Only create particles occasionally for performance
            createFireParticle(e.clientX, e.clientY);
        }
    });

    // Initialize fire click effects
    initializeFireClickRipples();
}

function createFireParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'fire-cursor-trail';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.width = '8px';
    particle.style.height = '8px';
    particle.style.background = `radial-gradient(circle, ${Math.random() > 0.5 ? '#FF4500' : '#FF8C00'}, transparent)`;

    document.body.appendChild(particle);

    setTimeout(() => {
        if (document.body.contains(particle)) {
            document.body.removeChild(particle);
        }
    }, 1000);
}

// Fire click ripples
function initializeFireClickRipples() {
    document.addEventListener('click', function(e) {
        const ripple = document.createElement('div');
        ripple.style.position = 'fixed';
        ripple.style.left = e.clientX + 'px';
        ripple.style.top = e.clientY + 'px';
        ripple.style.width = '0px';
        ripple.style.height = '0px';
        ripple.style.background = 'radial-gradient(circle, rgba(255, 69, 0, 0.6), transparent)';
        ripple.style.borderRadius = '50%';
        ripple.style.pointerEvents = 'none';
        ripple.style.zIndex = '9998';
        ripple.style.transform = 'translate(-50%, -50%)';
        ripple.style.animation = 'fireClickRipple 0.8s ease-out forwards';

        document.body.appendChild(ripple);

        setTimeout(() => {
            if (document.body.contains(ripple)) {
                document.body.removeChild(ripple);
            }
        }, 800);
    });
}

// Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');

    // Smooth scroll navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });

                // Update active nav link
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });

    // Update active nav on scroll
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('.section');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos <= bottom) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// Enhanced Data Sources interactions
function initializeDataSourcesInteractions() {
    const sourceCards = document.querySelectorAll('.source-card');
    
    sourceCards.forEach(card => {
        // Add click handler for detailed information
        card.addEventListener('click', function() {
            showDataSourceDetails(this);
        });
        
        // Add keyboard support
        card.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                showDataSourceDetails(this);
            }
        });
        
        // Enhanced hover effects with sound simulation
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.source-icon i');
            const statusDot = this.querySelector('.status-dot');
            
            // Add special effects based on data source type
            const sourceType = this.dataset.source;
            addSourceTypeEffect(this, sourceType);
            
            // Enhanced status dot animation
            if (statusDot) {
                statusDot.style.animationDuration = '0.5s';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const statusDot = this.querySelector('.status-dot');
            if (statusDot) {
                statusDot.style.animationDuration = '2s';
            }
        });
    });
    
    // Simulate real-time data updates
    startDataSourceUpdates();
}

function showDataSourceDetails(card) {
    const sourceType = card.dataset.source;
    const metadata = card.querySelector('.data-metadata');
    const statusElement = card.querySelector('.source-status span:last-child');
    
    const sourceDetails = {
        satellite: {
            name: 'Satellite Data',
            description: 'High-resolution Earth observation data from MODIS and Sentinel-2 satellites',
            features: ['Fire detection', 'Burn scar mapping', 'Smoke detection', 'Land cover classification'],
            lastUpdate: '2 minutes ago',
            dataPoints: '1.2M today',
            accuracy: '96.8%'
        },
        weather: {
            name: 'Weather Data',
            description: 'Comprehensive atmospheric data from ERA5 reanalysis system',
            features: ['Temperature', 'Humidity', 'Wind speed/direction', 'Precipitation'],
            lastUpdate: '15 minutes ago',
            dataPoints: '48K today',
            accuracy: '94.2%'
        },
        vegetation: {
            name: 'Vegetation Index',
            description: 'Normalized Difference Vegetation Index from Sentinel-2 imagery',
            features: ['Vegetation health', 'Moisture content', 'Biomass estimation', 'Fuel load assessment'],
            lastUpdate: '2 days ago',
            dataPoints: '850K pixels',
            accuracy: '91.5%'
        },
        terrain: {
            name: 'Terrain Elevation',
            description: 'Digital elevation model from NASA Shuttle Radar Topography Mission',
            features: ['Elevation data', 'Slope calculation', 'Aspect analysis', 'Drainage patterns'],
            lastUpdate: 'Static dataset',
            dataPoints: '2.8M points',
            accuracy: '99.1%'
        },
        human: {
            name: 'Human Activity',
            description: 'Settlement and infrastructure data from multiple sources',
            features: ['Population density', 'Road networks', 'Built-up areas', 'Land use patterns'],
            lastUpdate: '1 month ago',
            dataPoints: '125K features',
            accuracy: '78.3%'
        },
        sensors: {
            name: 'Ground Sensors',
            description: 'Real-time environmental monitoring from weather station network',
            features: ['Temperature', 'Humidity', 'Wind', 'Air quality'],
            lastUpdate: '30 seconds ago',
            dataPoints: '2.4K today',
            accuracy: '98.7%'
        }
    };
    
    const details = sourceDetails[sourceType];
    
    // Create enhanced toast with detailed information
    const detailsHTML = `
        <div style="max-width: 300px; text-align: left;">
            <h4 style="color: #FF4500; margin-bottom: 0.5rem;">${details.name}</h4>
            <p style="margin-bottom: 0.75rem; font-size: 0.9rem;">${details.description}</p>
            <div style="margin-bottom: 0.75rem;">
                <strong>Features:</strong>
                <ul style="margin: 0.25rem 0 0 1rem; font-size: 0.85rem;">
                    ${details.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 0.8rem;">
                <div><strong>Last Update:</strong><br>${details.lastUpdate}</div>
                <div><strong>Data Points:</strong><br>${details.dataPoints}</div>
                <div><strong>Accuracy:</strong><br>${details.accuracy}</div>
                <div><strong>Status:</strong><br>${statusElement.textContent}</div>
            </div>
        </div>
    `;
    
    showEnhancedToast(detailsHTML, 'processing', 8000);
    
    // Add visual feedback
    card.style.transform = 'translateY(-12px) rotateX(5deg) rotateY(2deg) scale(1.02)';
    card.style.boxShadow = '0 25px 50px rgba(255, 69, 0, 0.35)';
    
    setTimeout(() => {
        card.style.transform = '';
        card.style.boxShadow = '';
    }, 1000);
}

function addSourceTypeEffect(card, sourceType) {
    const icon = card.querySelector('.source-icon');
    
    // Add type-specific visual effects
    switch(sourceType) {
        case 'satellite':
            icon.style.animation = 'iconPulse 1s ease-in-out, satelliteOrbit 3s linear infinite';
            break;
        case 'weather':
            icon.style.animation = 'iconPulse 1s ease-in-out, weatherSway 2s ease-in-out infinite';
            break;
        case 'vegetation':
            icon.style.animation = 'iconPulse 1s ease-in-out, vegetationGrow 2.5s ease-in-out infinite';
            break;
        case 'terrain':
            icon.style.animation = 'iconPulse 1s ease-in-out, terrainShift 4s ease-in-out infinite';
            break;
        case 'human':
            icon.style.animation = 'iconPulse 1s ease-in-out, humanActivity 1.5s ease-in-out infinite';
            break;
        case 'sensors':
            icon.style.animation = 'iconPulse 1s ease-in-out, sensorScan 2s linear infinite';
            break;
    }
    
    setTimeout(() => {
        icon.style.animation = 'iconPulse 4s ease-in-out infinite';
    }, 3000);
}

function startDataSourceUpdates() {
    // Simulate real-time updates
    setInterval(() => {
        const sourceCards = document.querySelectorAll('.source-card');
        const randomCard = sourceCards[Math.floor(Math.random() * sourceCards.length)];
        
        if (Math.random() < 0.3) {
            // Flash the status dot briefly
            const statusDot = randomCard.querySelector('.status-dot');
            if (statusDot) {
                statusDot.style.transform = 'scale(1.5)';
                statusDot.style.boxShadow = '0 0 20px currentColor';
                
                setTimeout(() => {
                    statusDot.style.transform = '';
                    statusDot.style.boxShadow = '0 0 10px currentColor';
                }, 300);
            }
        }
    }, 5000);
}

function showEnhancedToast(htmlContent, type = 'success', duration = 3000) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = htmlContent;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => {
            if (container.contains(toast)) {
                container.removeChild(toast);
            }
        }, 300);
    }, duration);
}

// Initialize maps
function initializeMaps() {
    // Check if Leaflet is loaded
    if (typeof L === 'undefined') {
        console.error('Leaflet library not loaded');
        return;
    }

    try {
        // Fire Risk Map
        const riskMapElement = document.getElementById('risk-map');
        if (riskMapElement) {
            riskMap = L.map('risk-map').setView([30.0668, 79.0193], 8);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(riskMap);

            // Add risk zones for Uttarakhand districts
            addRiskZones();
        }

        // Simulation Map
        const simulationMapElement = document.getElementById('simulation-map');
        if (simulationMapElement) {
            simulationMap = L.map('simulation-map').setView([30.0668, 79.0193], 8);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(simulationMap);

            // Add click listener for fire simulation
            simulationMap.on('click', function(e) {
                startFireSimulation(e.latlng);
            });

            // Add forest areas
            addForestAreas();
        }

        // Initialize search functionality for maps
        initializeMapSearch();

        console.log('Maps initialized successfully');
    } catch (error) {
        console.error('Error initializing maps:', error);
    }
}

// Add risk zones to the map
function addRiskZones() {
    if (!riskMap) return;

    const riskZones = [
        {
            name: 'Nainital District',
            coords: [[29.2, 79.3], [29.6, 79.3], [29.6, 79.8], [29.2, 79.8]],
            risk: 'very-high',
            color: '#ff4444'
        },
        {
            name: 'Almora District',
            coords: [[29.5, 79.5], [29.9, 79.5], [29.9, 80.0], [29.5, 80.0]],
            risk: 'high',
            color: '#ffa726'
        },
        {
            name: 'Dehradun District',
            coords: [[30.1, 77.8], [30.5, 77.8], [30.5, 78.3], [30.1, 78.3]],
            risk: 'moderate',
            color: '#66bb6a'
        }
    ];

    riskZones.forEach(zone => {
        const polygon = L.polygon(zone.coords, {
            color: zone.color,
            fillColor: zone.color,
            fillOpacity: 0.4
        }).addTo(riskMap);

        polygon.bindPopup(`
            <div>
                <h4>${zone.name}</h4>
                <p>Risk Level: ${zone.risk.replace('-', ' ').toUpperCase()}</p>
            </div>
        `);
    });
}

// Add forest areas to simulation map
function addForestAreas() {
    if (!simulationMap) return;

    const forestAreas = [
        {
            name: 'Jim Corbett National Park',
            coords: [[29.4, 78.7], [29.7, 78.7], [29.7, 79.1], [29.4, 79.1]],
            color: '#2d5a2d'
        },
        {
            name: 'Valley of Flowers',
            coords: [[30.7, 79.5], [30.8, 79.5], [30.8, 79.7], [30.7, 79.7]],
            color: '#2d5a2d'
        }
    ];

    forestAreas.forEach(forest => {
        const polygon = L.polygon(forest.coords, {
            color: forest.color,
            fillColor: forest.color,
            fillOpacity: 0.6
        }).addTo(simulationMap);

        polygon.bindPopup(`<h4>${forest.name}</h4>`);
    });
}

// Initialize charts
function initializeCharts() {
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.error('Chart.js library not loaded');
        return;
    }

    try {
        // Performance Chart (Original)
        const performanceCtx = document.getElementById('performanceChart');
        if (performanceCtx) {
            new Chart(performanceCtx.getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: ['Accurate Predictions', 'False Positives'],
                    datasets: [{
                        data: [97, 3],
                        backgroundColor: ['#66bb6a', '#ff6b35'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: {
                                color: '#ffffff'
                            }
                        }
                    }
                }
            });
        }

        // Initialize other charts
        initializeTimelineChart();
        initializeFireSpreadChart();
        initializeGaugeCharts();
        initializeAlertStatsChart();

        console.log('Charts initialized successfully');
    } catch (error) {
        console.error('Error initializing charts:', error);
    }
}

function initializeTimelineChart() {
    const riskTimelineCtx = document.getElementById('riskTimelineChart');
    if (!riskTimelineCtx) return;

    const riskTimelineChart = new Chart(riskTimelineCtx.getContext('2d'), {
        type: 'line',
        data: {
            labels: ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM', '12AM', '3AM'],
            datasets: [
                {
                    label: 'Dehradun',
                    data: [25, 35, 55, 75, 85, 65, 45, 30],
                    borderColor: '#66bb6a',
                    backgroundColor: 'rgba(102, 187, 106, 0.1)',
                    fill: false,
                    tension: 0.4
                },
                {
                    label: 'Nainital',
                    data: [45, 55, 70, 85, 90, 80, 60, 50],
                    borderColor: '#ff4444',
                    backgroundColor: 'rgba(255, 68, 68, 0.1)',
                    fill: false,
                    tension: 0.4
                },
                {
                    label: 'Haridwar',
                    data: [30, 40, 60, 70, 75, 55, 40, 35],
                    borderColor: '#ffa726',
                    backgroundColor: 'rgba(255, 167, 38, 0.1)',
                    fill: false,
                    tension: 0.4
                },
                {
                    label: 'Rishikesh',
                    data: [20, 30, 45, 65, 70, 50, 35, 25],
                    borderColor: '#42a5f5',
                    backgroundColor: 'rgba(66, 165, 245, 0.1)',
                    fill: false,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#ffffff'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ffffff'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                y: {
                    min: 0,
                    max: 100,
                    ticks: {
                        color: '#ffffff',
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            }
        }
    });

    // Store chart reference
    if (!window.chartInstances) {
        window.chartInstances = {};
    }
    window.chartInstances.riskTimeline = riskTimelineChart;
}

function initializeFireSpreadChart() {
    const fireSpreadCtx = document.getElementById('fireSpreadChart');
    if (!fireSpreadCtx) return;

    const fireSpreadChart = new Chart(fireSpreadCtx.getContext('2d'), {
        type: 'line',
        data: {
            labels: ['0h', '1h', '2h', '3h', '4h', '5h', '6h'],
            datasets: [{
                label: 'Area Burned (hectares)',
                data: [0, 12, 35, 78, 145, 225, 320],
                borderColor: '#ff6b35',
                backgroundColor: 'rgba(255, 107, 53, 0.2)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#ffffff'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            return 'Burned: ' + context.parsed.y + ' hectares';
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ffffff'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                y: {
                    ticks: {
                        color: '#ffffff',
                        callback: function(value) {
                            return value + ' ha';
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            }
        }
    });

    if (!window.chartInstances) {
        window.chartInstances = {};
    }
    window.chartInstances.fireSpread = fireSpreadChart;
}

function initializeGaugeCharts() {
    // Accuracy Gauge
    const accuracyCtx = document.getElementById('accuracyGauge');
    if (accuracyCtx) {
        new Chart(accuracyCtx.getContext('2d'), {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [97, 3],
                    backgroundColor: ['#66bb6a', 'rgba(255, 255, 255, 0.1)'],
                    borderWidth: 0,
                    cutout: '75%'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: false
                    }
                }
            }
        });
    }

    // Uptime Gauge
    const uptimeCtx = document.getElementById('uptimeGauge');
    if (uptimeCtx) {
        new Chart(uptimeCtx.getContext('2d'), {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [99.8, 0.2],
                    backgroundColor: ['#66bb6a', 'rgba(255, 255, 255, 0.1)'],
                    borderWidth: 0,
                    cutout: '75%'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: false
                    }
                }
            }
        });
    }

    // Speed Gauge
    const speedCtx = document.getElementById('speedGauge');
    if (speedCtx) {
        new Chart(speedCtx.getContext('2d'), {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [85, 15],
                    backgroundColor: ['#ffa726', 'rgba(255, 255, 255, 0.1)'],
                    borderWidth: 0,
                    cutout: '75%'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: false
                    }
                }
            }
        });
    }
}

function initializeAlertStatsChart() {
    const alertStatsCtx = document.getElementById('alertStatsChart');
    if (!alertStatsCtx) return;

    new Chart(alertStatsCtx.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: ['Fire Risk Warnings', 'Active Fire Detected', 'Evacuation Alerts', 'All Clear/Safe Zones'],
            datasets: [{
                data: [35, 25, 20, 20],
                backgroundColor: ['#ffa726', '#ff4444', '#ff6b35', '#66bb6a'],
                borderWidth: 2,
                borderColor: 'rgba(255, 255, 255, 0.1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#ffffff',
                        padding: 15,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return context.label + ': ' + percentage + '%';
                        }
                    }
                }
            }
        }
    });
}

// Initialize simulation controls
function initializeSimulation() {
    const playBtn = document.getElementById('play-simulation');
    const pauseBtn = document.getElementById('pause-simulation');
    const resetBtn = document.getElementById('reset-simulation');
    const speedSlider = document.getElementById('speed-slider');
    const speedValue = document.getElementById('speed-value');

    if (playBtn) {
        playBtn.addEventListener('click', () => {
            if (!isSimulationRunning) {
                startSimulation();
            }
        });
    }

    if (pauseBtn) {
        pauseBtn.addEventListener('click', pauseSimulation);
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', resetSimulation);
    }

    if (speedSlider && speedValue) {
        speedSlider.addEventListener('input', (e) => {
            const speed = e.target.value;
            speedValue.textContent = `${speed}x`;
            updateSimulationSpeed(speed);
        });
    }

    // Toggle prediction button
    const toggleBtn = document.getElementById('toggle-prediction');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', togglePrediction);
    }

    // Initialize simulation monitoring chart
    initializeSimulationMonitoringChart();
}

// Fire simulation functions
async function startFireSimulation(latlng) {
    if (!simulationMap) return;

    // Try ML-powered simulation first
    const mlSimulation = await simulateFireWithML(latlng);

    // Add animated fire origin marker with enhanced visuals
    const fireMarker = L.marker([latlng.lat, latlng.lng], {
        icon: L.divIcon({
            className: 'fire-marker origin-fire',
            html: `
                <div class="fire-icon-container">
                    <i class="fas fa-fire fire-flame"></i>
                    <div class="fire-glow"></div>
                    <div class="fire-sparks"></div>
                </div>
            `,
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        })
    }).addTo(simulationMap);

    fireSpreadLayers.push(fireMarker);

    // Store ML simulation data if available
    if (mlSimulation) {
        window.currentMLSimulation = mlSimulation;
        showToast('AI-powered simulation active', 'success');
    }

    // Add initial burn circle
    const initialBurn = L.circle([latlng.lat, latlng.lng], {
        color: '#ff6b35',
        fillColor: '#ff4444',
        fillOpacity: 0.7,
        radius: 200,
        className: 'fire-burn-area'
    }).addTo(simulationMap);

    fireSpreadLayers.push(initialBurn);
}

function startSimulation() {
    isSimulationRunning = true;
    const speedSlider = document.getElementById('speed-slider');
    const speed = speedSlider ? parseInt(speedSlider.value) : 1;

    // Limit minimum interval to prevent overwhelming the browser
    const minInterval = 500; // Minimum 500ms between updates
    const interval = Math.max(minInterval, 2000 / speed);

    simulationInterval = setInterval(() => {
        simulationTime += 1;
        updateSimulationTime();

        // Update monitoring stats
        updateMonitoringStats();

        // Use requestAnimationFrame for smoother performance
        requestAnimationFrame(() => {
            simulateFireSpread();
        });
    }, interval);

    // Initial update
    updateMonitoringStats();
}

function pauseSimulation() {
    isSimulationRunning = false;
    if (simulationInterval) {
        clearInterval(simulationInterval);
    }
}

function resetSimulation() {
    pauseSimulation();
    simulationTime = 0;
    updateSimulationTime();

    // Reset monitoring stats
    updateMonitoringStats();

    // Clear fire spread layers
    if (simulationMap) {
        fireSpreadLayers.forEach(layer => {
            try {
                simulationMap.removeLayer(layer);
            } catch (e) {
                // Ignore errors for layers already removed
            }
        });
    }
    fireSpreadLayers = [];
}

function updateSimulationSpeed(speed) {
    if (isSimulationRunning) {
        pauseSimulation();
        startSimulation();
    }
}

function simulateFireSpread() {
    // Optimized fire spread simulation
    if (fireSpreadLayers.length > 0 && simulationMap) {
        // Limit processing to prevent overwhelming the browser
        if (fireSpreadLayers.length > 100) {
            const excessLayers = fireSpreadLayers.splice(0, 20);
            excessLayers.forEach(layer => {
                try {
                    simulationMap.removeLayer(layer);
                } catch (e) {
                    // Ignore errors for layers already removed
                }
            });
        }

        // Get environmental parameters
        const windSpeed = getElementValue('wind-speed', 15);
        const windDirection = getElementText('wind-direction', 'NE');
        const temperature = getElementValue('temperature', 32);
        const humidity = getElementValue('humidity', 45);

        // Convert wind direction to angle
        const windAngles = {
            'N': 0, 'NE': 45, 'E': 90, 'SE': 135,
            'S': 180, 'SW': 225, 'W': 270, 'NW': 315
        };
        const windAngle = (windAngles[windDirection] || 0) * Math.PI / 180;

        // Limit the number of fire sources processed per cycle
        const fireSources = fireSpreadLayers.filter(layer => 
            layer instanceof L.Marker && 
            layer.options.icon && 
            layer.options.icon.options.className && 
            layer.options.icon.options.className.includes('fire-marker')
        ).slice(-10);

        let newSpreadCount = 0;
        const maxNewSpreads = 3;

        fireSources.forEach((fireSource) => {
            if (newSpreadCount >= maxNewSpreads) return;

            if (Math.random() < 0.4) {
                const sourceLatlng = fireSource.getLatLng();

                // Simplified spread calculation
                const baseSpread = 0.005;
                const windFactor = windSpeed / 20;
                const tempFactor = temperature / 35;
                const humidityFactor = (100 - humidity) / 120;

                const spreadDistance = baseSpread * windFactor * tempFactor * humidityFactor;

                // Calculate new position
                const spreadAngle = windAngle + (Math.random() - 0.5) * Math.PI / 3;
                const newLat = sourceLatlng.lat + Math.cos(spreadAngle) * spreadDistance;
                const newLng = sourceLatlng.lng + Math.sin(spreadAngle) * spreadDistance;

                // Create simplified fire marker
                const spreadMarker = L.marker([newLat, newLng], {
                    icon: L.divIcon({
                        className: 'fire-marker spread-fire',
                        html: '<i class="fas fa-fire fire-flame"></i>',
                        iconSize: [20, 20],
                        iconAnchor: [10, 10]
                    })
                }).addTo(simulationMap);

                // Create smaller burn area
                const burnRadius = 100 + Math.random() * 50;
                const burnArea = L.circle([newLat, newLng], {
                    color: '#ff4444',
                    fillColor: '#cc0000',
                    fillOpacity: 0.3,
                    radius: burnRadius,
                    weight: 1
                }).addTo(simulationMap);

                fireSpreadLayers.push(spreadMarker);
                fireSpreadLayers.push(burnArea);
                newSpreadCount++;
            }
        });
    }
}

function updateSimulationTime() {
    const timeElement = document.getElementById('simulation-time');
    if (timeElement) {
        const hours = Math.floor(simulationTime / 60);
        const minutes = simulationTime % 60;
        timeElement.textContent = 
            hours > 0 ? `${hours}h ${minutes}m` : `${minutes} minutes`;
    }
}

// Helper functions
function getElementValue(id, defaultValue) {
    const element = document.getElementById(id);
    if (element) {
        const value = parseInt(element.textContent);
        return isNaN(value) ? defaultValue : value;
    }
    return defaultValue;
}

function getElementText(id, defaultValue) {
    const element = document.getElementById(id);
    return element ? element.textContent : defaultValue;
}

// Toggle prediction functionality
function togglePrediction() {
    const btn = document.getElementById('toggle-prediction');
    if (!btn) return;

    const isNextDay = btn.textContent.includes('Current');

    if (isNextDay) {
        btn.innerHTML = '<i class="fas fa-clock"></i> Show Next Day Prediction';
        showCurrentDayPrediction();
    } else {
        btn.innerHTML = '<i class="fas fa-calendar"></i> Show Current Day';
        showNextDayPrediction();
    }
}

function showCurrentDayPrediction() {
    updateRiskZones([
        { name: 'Nainital District', risk: 'very-high', percentage: 85 },
        { name: 'Almora District', risk: 'high', percentage: 68 },
        { name: 'Dehradun District', risk: 'moderate', percentage: 42 }
    ]);

    updateMapRiskColors('current');

    const lastUpdateElement = document.getElementById('last-update');
    if (lastUpdateElement) {
        lastUpdateElement.textContent = '2 minutes ago';
    }
}

function showNextDayPrediction() {
    updateRiskZones([
        { name: 'Nainital District', risk: 'very-high', percentage: 92 },
        { name: 'Almora District', risk: 'very-high', percentage: 78 },
        { name: 'Dehradun District', risk: 'high', percentage: 65 }
    ]);

    updateMapRiskColors('predicted');

    const lastUpdateElement = document.getElementById('last-update');
    if (lastUpdateElement) {
        lastUpdateElement.textContent = 'Predicted for tomorrow';
    }
}

function updateRiskZones(zones) {
    const riskContainer = document.querySelector('.risk-zones');
    if (!riskContainer) return;

    riskContainer.innerHTML = '';

    zones.forEach(zone => {
        const riskClass = zone.risk === 'very-high' ? 'high-risk' : 
                         zone.risk === 'high' ? 'moderate-risk' : 'low-risk';

        const riskItem = document.createElement('div');
        riskItem.className = `risk-item ${riskClass}`;
        riskItem.innerHTML = `
            <div class="risk-color"></div>
            <div class="risk-info">
                <span class="risk-level">${zone.risk.replace('-', ' ').toUpperCase()} Risk</span>
                <span class="risk-area">${zone.name}</span>
            </div>
            <div class="risk-percentage">${zone.percentage}%</div>
        `;
        riskContainer.appendChild(riskItem);
    });
}

function updateMapRiskColors(type) {
    if (!riskMap) return;

    // Clear existing polygons
    riskMap.eachLayer(layer => {
        if (layer instanceof L.Polygon) {
            riskMap.removeLayer(layer);
        }
    });

    // Define zones based on prediction type
    const zones = type === 'current' ? [
        {
            name: 'Nainital District',
            coords: [[29.2, 79.3], [29.6, 79.3], [29.6, 79.8], [29.2, 79.8]],
            risk: 'very-high',
            color: '#ff4444'
        },
        {
            name: 'Almora District',
            coords: [[29.5, 79.5], [29.9, 79.5], [29.9, 80.0], [29.5, 80.0]],
            risk: 'high',
            color: '#ffa726'
        },
        {
            name: 'Dehradun District',
            coords: [[30.1, 77.8], [30.5, 77.8], [30.5, 78.3], [30.1, 78.3]],
            risk: 'moderate',
            color: '#66bb6a'
        }
    ] : [
        {
            name: 'Nainital District',
            coords: [[29.2, 79.3], [29.6, 79.3], [29.6, 79.8], [29.2, 79.8]],
            risk: 'very-high',
            color: '#cc0000'
        },
        {
            name: 'Almora District',
            coords: [[29.5, 79.5], [29.9, 79.5], [29.9, 80.0], [29.5, 80.0]],
            risk: 'very-high',
            color: '#ff4444'
        },
        {
            name: 'Dehradun District',
            coords: [[30.1, 77.8], [30.5, 77.8], [30.5, 78.3], [30.1, 78.3]],
            risk: 'high',
            color: '#ffa726'
        }
    ];

    // Add updated zones to map
    zones.forEach(zone => {
        const polygon = L.polygon(zone.coords, {
            color: zone.color,
            fillColor: zone.color,
            fillOpacity: type === 'predicted' ? 0.6 : 0.4,
            weight: type === 'predicted' ? 3 : 2
        }).addTo(riskMap);

        const riskLevel = zone.risk.replace('-', ' ').toUpperCase();
        const prefix = type === 'predicted' ? 'Predicted: ' : '';

        polygon.bindPopup(`
            <div>
                <h4>${zone.name}</h4>
                <p>${prefix}Risk Level: ${riskLevel}</p>
            </div>
        `);
    });
}

// Enhanced Search Functionality
function initializeMapSearch() {
    const searchInput = document.querySelector('.search-input');

    const searchMap = (query, map) => {
        const locations = {
            'nainital': { lat: 29.3806, lng: 79.4422 },
            'almora': { lat: 29.6500, lng: 79.6667 },
            'dehradun': { lat: 30.3165, lng: 78.0322 },
            'haridwar': { lat: 29.9457, lng: 78.1642 },
            'rishikesh': { lat: 30.0869, lng: 78.2676 },
            'uttarakhand': { lat: 30.0668, lng: 79.0193 },
            'jim corbett': { lat: 29.5308, lng: 78.9514 },
            'corbett': { lat: 29.5308, lng: 78.9514 },
            'valley of flowers': { lat: 30.7268, lng: 79.6045 },
            'chamoli': { lat: 30.4000, lng: 79.3200 },
            'pithoragarh': { lat: 29.5833, lng: 80.2167 },
            'tehri': { lat: 30.3900, lng: 78.4800 },
            'pauri': { lat: 30.1500, lng: 78.7800 },
            'rudraprayag': { lat: 30.2800, lng: 78.9800 },
            'bageshwar': { lat: 29.8400, lng: 79.7700 },
            'champawat': { lat: 29.3400, lng: 80.0900 },
            'uttarkashi': { lat: 30.7300, lng: 78.4500 },
            'udham singh nagar': { lat: 28.9750, lng: 79.4000 }
        };

        const lowerCaseQuery = query.toLowerCase();
        if (locations[lowerCaseQuery]) {
            const { lat, lng } = locations[lowerCaseQuery];
            map.setView([lat, lng], 12);
            L.marker([lat, lng]).addTo(map).bindPopup(query.charAt(0).toUpperCase() + query.slice(1)).openPopup();
            showToast(`Navigated to ${query}`, 'success');
            return true;
        } else {
            showToast(`Location "${query}" not found.`, 'error');
            return false;
        }
    };

    const performSearch = (query) => {
        if (query && riskMap && simulationMap) {
            const riskSuccess = searchMap(query, riskMap);
            const simulationSuccess = searchMap(query, simulationMap);

            if (riskSuccess || simulationSuccess) {
                setTimeout(() => {
                    const fireRiskSection = document.getElementById('fire-risk');
                    if (fireRiskSection) {
                        fireRiskSection.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'start'
                        });

                        const mapContainers = document.querySelectorAll('.map-container');
                        mapContainers.forEach(container => {
                            container.style.boxShadow = '0 0 30px rgba(255, 107, 53, 0.8)';
                            container.style.transform = 'scale(1.01)';
                            container.style.transition = 'all 0.5s ease';
                        });

                        setTimeout(() => {
                            mapContainers.forEach(container => {
                                container.style.boxShadow = '';
                                container.style.transform = '';
                            });
                        }, 2000);
                    }
                }, 500);
            }

            if (searchInput) {
                searchInput.value = '';
            }
        }
    };

    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const query = searchInput.value.trim();
                performSearch(query);
            }
        });
    }
}

// Start real-time data updates
function startDataUpdates() {
    setInterval(updateEnvironmentalData, 30000);
    setInterval(updateAlerts, 60000);
    setInterval(updateTimeStamps, 60000);
    setInterval(updateChartData, 45000);
    setInterval(updateFireSpreadChart, 10000);
    setInterval(updateActivityFeed, 45000);
    setInterval(updateEnvironmentalConditions, 35000);
}

function updateEnvironmentalData() {
    const windSpeed = Math.floor(Math.random() * 20) + 5;
    const temperature = Math.floor(Math.random() * 15) + 25;
    const humidity = Math.floor(Math.random() * 40) + 30;

    updateElementText('wind-speed', `${windSpeed} km/h`);
    updateElementText('temperature', `${temperature}°C`);
    updateElementText('humidity', `${humidity}%`);

    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const randomDirection = directions[Math.floor(Math.random() * directions.length)];
    updateElementText('wind-direction', randomDirection);
}

function updateElementText(id, text) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = text;
    }
}

function updateAlerts() {
    const alertTimes = document.querySelectorAll('.alert-time');
    alertTimes.forEach((timeEl, index) => {
        const baseTime = (index + 1) * 15;
        timeEl.textContent = `${baseTime} minutes ago`;
    });
}

function updateTimeStamps() {
    const lastUpdateElement = document.getElementById('last-update');
    if (lastUpdateElement) {
        lastUpdateElement.textContent = 'Just now';
        setTimeout(() => {
            lastUpdateElement.textContent = '1 minute ago';
        }, 5000);
    }
}

function updateChartData() {
    if (window.chartInstances && window.chartInstances.riskTimeline) {
        const chart = window.chartInstances.riskTimeline;
        chart.data.datasets.forEach((dataset) => {
            dataset.data = dataset.data.map(value => {
                const variation = (Math.random() - 0.5) * 10;
                return Math.max(0, Math.min(100, value + variation));
            });
        });
        chart.update('none');
    }

    updateGaugeValues();
    updateAlertStatistics();
}

function updateFireSpreadChart() {
    if (isSimulationRunning && window.chartInstances && window.chartInstances.fireSpread) {
        const chart = window.chartInstances.fireSpread;
        const lastValue = chart.data.datasets[0].data[chart.data.datasets[0].data.length - 1];

        const timeLabel = simulationTime + 'h';
        const newArea = lastValue + Math.random() * 50 + 20;

        if (chart.data.labels.length > 10) {
            chart.data.labels.shift();
            chart.data.datasets[0].data.shift();
        }

        chart.data.labels.push(timeLabel);
        chart.data.datasets[0].data.push(Math.round(newArea));

        chart.update('none');
    }
}

function updateGaugeValues() {
    const newAccuracy = Math.max(95, Math.min(99, 97 + (Math.random() - 0.5) * 2));
    updateElementText('accuracyValue', newAccuracy.toFixed(1) + '%');

    const newUptime = Math.max(99.5, Math.min(100, 99.8 + (Math.random() - 0.5) * 0.3));
    updateElementText('uptimeValue', newUptime.toFixed(1) + '%');

    const newSpeed = Math.max(70, Math.min(95, 85 + (Math.random() - 0.5) * 10));
    updateElementText('speedValue', Math.round(newSpeed) + '%');
}

function updateAlertStatistics() {
    const totalAlerts = Math.floor(Math.random() * 20) + 130;
    const activeFires = Math.floor(Math.random() * 5) + 5;
    const responseTime = Math.floor(Math.random() * 8) + 8;

    updateElementText('totalAlerts', totalAlerts);
    updateElementText('activeFires', activeFires);
    updateElementText('responseTime', responseTime + ' min');
}

function updateActivityFeed() {
    const activities = [
        {
            icon: 'fas fa-satellite-dish',
            title: 'Satellite Data Updated',
            description: 'New MODIS imagery processed for Nainital region',
            time: '2 minutes ago'
        },
        {
            icon: 'fas fa-exclamation-triangle',
            title: 'Risk Level Updated',
            description: 'Almora District elevated to High Risk status',
            time: '8 minutes ago'
        },
        {
            icon: 'fas fa-cloud-sun',
            title: 'Weather Data Sync',
            description: 'ERA5 meteorological data synchronized',
            time: '15 minutes ago'
        }
    ];

    const activityFeed = document.querySelector('.activity-feed');
    if (activityFeed && Math.random() < 0.1) {
        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        const newActivityHtml = `
            <div class="activity-item new">
                <div class="activity-icon">
                    <i class="${randomActivity.icon}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${randomActivity.title}</div>
                    <div class="activity-description">${randomActivity.description}</div>
                    <div class="activity-time">Just now</div>
                </div>
            </div>
        `;

        activityFeed.insertAdjacentHTML('afterbegin', newActivityHtml);

        const activityItems = activityFeed.querySelectorAll('.activity-item');
        if (activityItems.length > 5) {
            activityItems[activityItems.length - 1].remove();
        }

        activityItems.forEach((item, index) => {
            if (index > 0) {
                item.classList.remove('new');
            }
        });
    }
}

function updateEnvironmentalConditions() {
    const temperatureEl = document.querySelector('.condition-card.temperature .condition-value');
    const humidityEl = document.querySelector('.condition-card.humidity .condition-value');
    const windEl = document.querySelector('.condition-card.wind .condition-value');

    if (temperatureEl) {
        const newTemp = Math.floor(Math.random() * 8) + 28;
        temperatureEl.textContent = newTemp + '°C';
    }

    if (humidityEl) {
        const newHumidity = Math.floor(Math.random() * 30) + 35;
        humidityEl.textContent = newHumidity + '%';
    }

    if (windEl) {
        const newWind = Math.floor(Math.random() * 15) + 8;
        windEl.textContent = newWind + ' km/h';
    }

    if (Math.random() < 0.3) {
        updateMLPredictions();
    }
}

// ML Integration Functions
function initializeMLIntegration() {
    startMLRealTimeUpdates();
    loadMLModelInfo();
    setInterval(updateMLPredictions, 60000);
    showToast('AI/ML models initialized successfully', 'success');
}

async function startMLRealTimeUpdates() {
    try {
        const response = await fetch(`${ML_API_BASE}/api/ml/start-realtime`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            realTimeUpdates = true;
            showToast('Real-time AI predictions activated', 'success');
        }
    } catch (error) {
        console.warn('ML API not available, using fallback predictions');
        showToast('Using local AI predictions', 'warning');
    }
}

async function updateMLPredictions() {
    try {
        const envData = getCurrentEnvironmentalData();
        const response = await fetch(`${ML_API_BASE}/api/ml/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(envData)
        });

        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                mlPredictions = result.predictions;
                updateDashboardWithMLPredictions(result.predictions);
            }
        }
    } catch (error) {
        const envData = getCurrentEnvironmentalData();
        mlPredictions = generateFallbackPredictions(envData);
        updateDashboardWithMLPredictions(mlPredictions);
    }
}

function getCurrentEnvironmentalData() {
    const temperature = getElementValue('temperature', 32);
    const humidity = getElementValue('humidity', 45);
    const windSpeed = getElementValue('wind-speed', 15);
    const windDirection = getElementText('wind-direction', 'NE');

    return {
        temperature,
        humidity,
        wind_speed: windSpeed,
        wind_direction: windDirection,
        ndvi: 0.6 + (Math.random() - 0.5) * 0.2,
        elevation: 1500 + Math.random() * 500,
        slope: 10 + Math.random() * 20,
        vegetation_density: 'moderate'
    };
}

function updateDashboardWithMLPredictions(predictions) {
    if (predictions.ensemble_risk_score) {
        const accuracyEl = document.getElementById('accuracyValue');
        if (accuracyEl && predictions.confidence_interval) {
            const confidence = (predictions.confidence_interval.confidence_level * 100).toFixed(1);
            accuracyEl.textContent = confidence + '%';
        }
    }
}

function generateFallbackPredictions(envData) {
    const tempFactor = Math.min(envData.temperature / 40, 1);
    const humidityFactor = Math.max(0, (100 - envData.humidity) / 100);
    const windFactor = Math.min(envData.wind_speed / 30, 1);

    const baseRisk = (tempFactor * 0.4 + humidityFactor * 0.4 + windFactor * 0.2);
    const ensemble_risk = Math.min(baseRisk + Math.random() * 0.1, 1);

    return {
        ensemble_risk_score: ensemble_risk,
        ml_prediction: {
            overall_risk: ensemble_risk,
            confidence: 0.85,
            risk_category: ensemble_risk > 0.7 ? 'high' : ensemble_risk > 0.4 ? 'moderate' : 'low'
        },
        confidence_interval: {
            confidence_level: 0.85,
            lower_bound: Math.max(0, ensemble_risk - 0.1),
            upper_bound: Math.min(1, ensemble_risk + 0.1)
        }
    };
}

async function simulateFireWithML(latlng) {
    try {
        const envData = getCurrentEnvironmentalData();
        const response = await fetch(`${ML_API_BASE}/api/ml/simulate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                lat: latlng.lat,
                lng: latlng.lng,
                duration: 6,
                ...envData
            })
        });

        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                showToast('AI-powered fire simulation completed', 'success');
                return result.simulation;
            }
        }
    } catch (error) {
        console.warn('ML simulation failed, using fallback');
        showToast('Using simplified fire simulation', 'warning');
    }

    return null;
}

async function loadMLModelInfo() {
    try {
        const response = await fetch(`${ML_API_BASE}/api/ml/model-info`);
        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                const accuracyEl = document.getElementById('accuracyValue');
                if (accuracyEl && result.models.convlstm_unet.accuracy) {
                    accuracyEl.textContent = result.models.convlstm_unet.accuracy;
                }
                window.mlModelInfo = result.models;
            }
        }
    } catch (error) {
        console.warn('ML model info unavailable');
    }
}

// Initialize simulation monitoring chart
function initializeSimulationMonitoringChart() {
    const ctx = document.getElementById('simulationMonitoringChart');
    if (!ctx) return;

    const simulationMonitoringChart = new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels: ['0m'],
            datasets: [
                {
                    label: 'Area Burned (ha)',
                    data: [0],
                    borderColor: '#ff6b35',
                    backgroundColor: 'rgba(255, 107, 53, 0.1)',
                    fill: true,
                    tension: 0.4,
                    yAxisID: 'y'
                },
                {
                    label: 'Fire Perimeter (km)',
                    data: [0],
                    borderColor: '#ffa726',
                    backgroundColor: 'rgba(255, 167, 38, 0.1)',
                    fill: false,
                    tension: 0.4,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#ffffff',
                        font: {
                            size: 11
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ffffff',
                        font: {
                            size: 10
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    ticks: {
                        color: '#ffffff',
                        font: {
                            size: 10
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    title: {
                        display: true,
                        text: 'Area (ha)',
                        color: '#ff6b35',
                        font: {
                            size: 10
                        }
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    ticks: {
                        color: '#ffffff',
                        font: {
                            size: 10
                        }
                    },
                    grid: {
                        drawOnChartArea: false,
                    },
                    title: {
                        display: true,
                        text: 'Perimeter (km)',
                        color: '#ffa726',
                        font: {
                            size: 10
                        }
                    }
                }
            }
        }
    });

    if (!window.chartInstances) {
        window.chartInstances = {};
    }
    window.chartInstances.simulationMonitoring = simulationMonitoringChart;
}

// Update monitoring stats
function updateMonitoringStats() {
    if (isSimulationRunning) {
        const timeInHours = simulationTime / 60;
        const baseArea = Math.pow(timeInHours, 1.5) * 25;
        const burnedArea = baseArea + (Math.random() * 20 - 10);
        const firePerimeter = Math.sqrt(burnedArea * 4 * Math.PI);
        const spreadRate = timeInHours > 0 ? burnedArea / timeInHours : 0;
        const activeCount = Math.min(Math.floor(burnedArea / 50) + 1, 15);

        updateElementText('totalBurnedArea', Math.max(0, burnedArea).toFixed(0) + ' ha');
        updateElementText('firePerimeter', Math.max(0, firePerimeter).toFixed(1) + ' km');
        updateElementText('spreadRate', Math.max(0, spreadRate).toFixed(1) + ' ha/hr');
        updateElementText('activeFireSources', activeCount);

        updateSimulationMonitoringChart(burnedArea, firePerimeter);
    } else {
        updateElementText('totalBurnedArea', '0 ha');
        updateElementText('firePerimeter', '0 km');
        updateElementText('spreadRate', '0 ha/hr');
        updateElementText('activeFireSources', '0');

        if (window.chartInstances && window.chartInstances.simulationMonitoring) {
            const chart = window.chartInstances.simulationMonitoring;
            chart.data.labels = ['0m'];
            chart.data.datasets[0].data = [0];
            chart.data.datasets[1].data = [0];
            chart.update('none');
        }
    }
}

function updateSimulationMonitoringChart(burnedArea, firePerimeter) {
    if (window.chartInstances && window.chartInstances.simulationMonitoring) {
        const chart = window.chartInstances.simulationMonitoring;

        const timeLabel = simulationTime > 60 ? 
            Math.floor(simulationTime / 60) + 'h' + (simulationTime % 60 > 0 ? (simulationTime % 60) + 'm' : '') :
            simulationTime + 'm';

        if (chart.data.labels.length > 20) {
            chart.data.labels.shift();
            chart.data.datasets[0].data.shift();
            chart.data.datasets[1].data.shift();
        }

        chart.data.labels.push(timeLabel);
        chart.data.datasets[0].data.push(Math.max(0, burnedArea));
        chart.data.datasets[1].data.push(Math.max(0, firePerimeter));

        chart.update('none');
    }
}

// Toast Notifications
function showToast(message, type = 'success', duration = 3000) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => {
            if (container.contains(toast)) {
                container.removeChild(toast);
            }
        }, 300);
    }, duration);
}

// Modal Functions
function openModal() {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Close modal on overlay click
const modalOverlay = document.getElementById('modal-overlay');
if (modalOverlay) {
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
}

// Scroll to section function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
        showToast(`Navigating to ${sectionId.replace('-', ' ')} section`, 'processing', 1500);
    }
}

// Download report function
function downloadReport() {
    showToast('Generating daily risk report...', 'processing', 2000);

    setTimeout(() => {
        showToast('Daily risk report downloaded successfully!', 'success');

        const link = document.createElement('a');
        link.href = 'data:text/plain;charset=utf-8,NeuroNix Daily Fire Risk Report\n\nGenerated: ' + new Date().toLocaleString() + '\n\nOverall Risk Level: High\nTotal Monitored Area: 53,483 km²\nActive Sensors: 247\nPrediction Accuracy: 97.2%';
        link.download = 'neuronix-daily-report-' + new Date().toISOString().split('T')[0] + '.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, 2000);
}

// Enhanced keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.focus();
            showToast('Search activated', 'processing', 1000);
        }
    }

    if (e.key === 'Escape') {
        closeModal();
    }

    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        downloadReport();
    }
});

// Initialize new dashboard features
document.addEventListener('DOMContentLoaded', function() {
    initializeNewFeatures();
});

function initializeNewFeatures() {
    // Early Warning System
    initializeAlertSystem();
    
    // Community Engagement
    initializeCommunityFeatures();
    
    // VR/AR Visualization
    initializeVRFeatures();
    
    // Fire Reporting
    initializeReporting();
    
    // Resource Optimization
    updateResourceMetrics();
    
    // Environmental Impact
    animateImpactBars();
    
    // Recovery Timeline
    initializeRecoveryTimeline();
    
    // Enhanced Evacuation Route Mapping
    initializeEvacuationMapping();
}

// Enhanced Evacuation Route Mapping Functions
function initializeEvacuationMapping() {
    initializeEvacuationMap();
    initializeRouteControls();
    initializeSafetyZones();
    startEvacuationUpdates();
}

function initializeEvacuationMap() {
    const mapElement = document.getElementById('evacuation-map');
    if (!mapElement) return;
    
    // Initialize Leaflet map for evacuation routes
    if (typeof L !== 'undefined') {
        const evacuationMap = L.map('evacuation-map').setView([29.3919, 79.4542], 11);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(evacuationMap);
        
        // Add evacuation routes
        addEvacuationRoutes(evacuationMap);
        addSafetyZones(evacuationMap);
        
        // Store map reference
        window.evacuationMapInstance = evacuationMap;
    } else {
        // Fallback: Add visual route indicators
        addRouteVisualizations(mapElement);
    }
}

function addEvacuationRoutes(map) {
    const routes = [
        {
            name: 'Route A: Main Highway',
            coords: [
                [29.3919, 79.4542], // Nainital
                [29.3500, 79.4000],
                [29.2167, 79.5167]  // Haldwani
            ],
            color: '#22C55E',
            status: 'clear'
        },
        {
            name: 'Route B: Forest Road', 
            coords: [
                [29.3919, 79.4542], // Nainital
                [29.4000, 79.4800],
                [29.2167, 79.6500]  // Kathgodam
            ],
            color: '#F59E0B',
            status: 'caution'
        },
        {
            name: 'Route C: Emergency',
            coords: [
                [29.3919, 79.4542], // Nainital
                [29.4100, 79.4700]  // Helipad
            ],
            color: '#EF4444',
            status: 'emergency'
        }
    ];
    
    routes.forEach(route => {
        const polyline = L.polyline(route.coords, {
            color: route.color,
            weight: 4,
            opacity: 0.8,
            className: `route-${route.status}`
        }).addTo(map);
        
        polyline.bindPopup(`
            <div class="route-popup">
                <h4>${route.name}</h4>
                <p>Status: ${route.status.toUpperCase()}</p>
                <button onclick="selectRoute('${route.name}')">Select Route</button>
            </div>
        `);
    });
}

function addSafetyZones(map) {
    const safetyZones = [
        {
            name: 'Haldwani Relief Center',
            coords: [29.2167, 79.5167],
            capacity: '1,750 / 5,000',
            status: 'available'
        },
        {
            name: 'Kathgodam Medical Center',
            coords: [29.2167, 79.6500],
            capacity: '1,950 / 3,000',
            status: 'limited'
        },
        {
            name: 'Emergency Helipad',
            coords: [29.4100, 79.4700],
            capacity: '50 capacity',
            status: 'standby'
        }
    ];
    
    safetyZones.forEach(zone => {
        const marker = L.marker(zone.coords, {
            icon: L.divIcon({
                className: `safety-zone-marker ${zone.status}`,
                html: `
                    <div class="zone-marker-icon">
                        <i class="fas fa-shield-alt"></i>
                    </div>
                `,
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            })
        }).addTo(map);
        
        marker.bindPopup(`
            <div class="zone-popup">
                <h4>${zone.name}</h4>
                <p>Capacity: ${zone.capacity}</p>
                <p>Status: ${zone.status.toUpperCase()}</p>
            </div>
        `);
    });
}

function addRouteVisualizations(mapElement) {
    // Add animated route lines as CSS elements for visual effect
    const routeLines = [
        { class: 'route-line-1', delay: 0 },
        { class: 'route-line-2', delay: 1000 },
        { class: 'route-line-3', delay: 2000 }
    ];
    
    routeLines.forEach(route => {
        const routeElement = document.createElement('div');
        routeElement.className = `animated-route ${route.class}`;
        routeElement.style.animationDelay = `${route.delay}ms`;
        mapElement.appendChild(routeElement);
    });
}

function initializeRouteControls() {
    // Map view controls
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            viewButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const view = this.dataset.view;
            switchMapView(view);
        });
    });
    
    // Route action buttons
    const routeActionBtns = document.querySelectorAll('.route-action-btn');
    routeActionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.textContent.trim().toLowerCase();
            
            if (action.includes('optimize')) {
                optimizeRoutes();
            } else if (action.includes('broadcast')) {
                broadcastAlert();
            }
        });
    });
    
    // Route item clicks
    const routeItems = document.querySelectorAll('.route-item-enhanced');
    routeItems.forEach(item => {
        item.addEventListener('click', function() {
            routeItems.forEach(r => r.classList.remove('selected'));
            this.classList.add('selected');
            
            const routeName = this.querySelector('.route-name').textContent;
            showToast(`Selected ${routeName}`, 'success');
        });
    });
}

function switchMapView(view) {
    const mapElement = document.getElementById('evacuation-map');
    if (!mapElement) return;
    
    // Remove existing view classes
    mapElement.classList.remove('routes-view', 'terrain-view', 'weather-view');
    
    // Add new view class
    mapElement.classList.add(`${view}-view`);
    
    showToast(`Switched to ${view} view`, 'processing', 2000);
    
    // Update map visualization based on view
    if (window.evacuationMapInstance) {
        switch(view) {
            case 'routes':
                showRouteOverlays();
                break;
            case 'terrain':
                showTerrainOverlays();
                break;
            case 'weather':
                showWeatherOverlays();
                break;
        }
    }
}

function showRouteOverlays() {
    // Implementation for route overlay visualization
    console.log('Showing route overlays');
}

function showTerrainOverlays() {
    // Implementation for terrain overlay visualization
    console.log('Showing terrain overlays');
}

function showWeatherOverlays() {
    // Implementation for weather overlay visualization
    console.log('Showing weather overlays');
}

function optimizeRoutes() {
    showToast('Optimizing evacuation routes...', 'processing', 2000);
    
    // Simulate route optimization
    setTimeout(() => {
        showToast('Routes optimized successfully!', 'success');
        updateRouteMetrics();
    }, 2000);
}

function broadcastAlert() {
    showToast('Broadcasting evacuation alert...', 'processing', 2000);
    
    // Simulate alert broadcast
    setTimeout(() => {
        showToast('Alert broadcasted to all emergency services', 'success');
        updateAlertStatus();
    }, 2000);
}

function selectRoute(routeName) {
    showToast(`Route selected: ${routeName}`, 'success');
    
    // Highlight selected route on map
    if (window.evacuationMapInstance) {
        // Implementation to highlight specific route
        console.log(`Highlighting route: ${routeName}`);
    }
}

function initializeSafetyZones() {
    // Animate capacity bars
    const capacityBars = document.querySelectorAll('.capacity-fill');
    capacityBars.forEach((bar, index) => {
        setTimeout(() => {
            const width = bar.style.width;
            bar.style.width = '0%';
            bar.style.transition = 'width 2s ease-out';
            
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        }, index * 300);
    });
    
    // Add click handlers for safety zones
    const zoneCards = document.querySelectorAll('.safety-zone-card');
    zoneCards.forEach(card => {
        card.addEventListener('click', function() {
            const zoneName = this.querySelector('.zone-name').textContent;
            showZoneDetails(zoneName);
        });
    });
}

function showZoneDetails(zoneName) {
    const details = {
        'Haldwani Relief Center': {
            facilities: ['Medical Aid', 'Food Distribution', 'Temporary Shelter'],
            contact: '+91-5946-123456',
            coordinator: 'District Collector Office'
        },
        'Kathgodam Medical Center': {
            facilities: ['Emergency Care', 'Ambulance Service', 'Pharmacy'],
            contact: '+91-5946-654321',
            coordinator: 'Chief Medical Officer'
        },
        'Ramnagar Community Hall': {
            facilities: ['Temporary Shelter', 'Community Kitchen'],
            contact: '+91-5946-789012',
            coordinator: 'Block Development Office'
        }
    };
    
    const detail = details[zoneName];
    if (detail) {
        const detailsHTML = `
            <div style="max-width: 280px; text-align: left;">
                <h4 style="color: #FF4500; margin-bottom: 0.5rem;">${zoneName}</h4>
                <div style="margin-bottom: 0.75rem;">
                    <strong>Facilities:</strong>
                    <ul style="margin: 0.25rem 0 0 1rem; font-size: 0.85rem;">
                        ${detail.facilities.map(facility => `<li>${facility}</li>`).join('')}
                    </ul>
                </div>
                <div style="font-size: 0.85rem;">
                    <p><strong>Contact:</strong> ${detail.contact}</p>
                    <p><strong>Coordinator:</strong> ${detail.coordinator}</p>
                </div>
            </div>
        `;
        
        showEnhancedToast(detailsHTML, 'processing', 6000);
    }
}

function updateRouteMetrics() {
    // Update route timing and capacity metrics
    const metrics = document.querySelectorAll('.route-metrics .metric span:last-child');
    metrics.forEach(metric => {
        if (metric.textContent.includes('min')) {
            const currentTime = parseInt(metric.textContent);
            const optimizedTime = Math.max(10, currentTime - Math.floor(Math.random() * 5) - 2);
            metric.textContent = optimizedTime + ' min';
            metric.style.color = '#22C55E';
        }
    });
}

function updateAlertStatus() {
    // Update status indicators to show alert has been sent
    const statusIndicators = document.querySelectorAll('.status-indicator');
    statusIndicators.forEach(indicator => {
        const statusText = indicator.querySelector('span:last-child');
        if (statusText) {
            statusText.textContent = 'Alert Broadcasted';
            indicator.style.color = '#EF4444';
        }
    });
}

function startEvacuationUpdates() {
    // Simulate real-time updates
    setInterval(() => {
        updateEvacuationData();
    }, 45000);
    
    // Update capacity numbers periodically
    setInterval(() => {
        updateCapacityNumbers();
    }, 30000);
    
    // Update route conditions
    setInterval(() => {
        updateRouteConditions();
    }, 60000);
}

function updateEvacuationData() {
    // Update evacuation analytics
    const analyticsValues = document.querySelectorAll('.analytics-card .data-value');
    analyticsValues.forEach(value => {
        if (value.textContent.includes(',')) {
            const currentNum = parseInt(value.textContent.replace(',', ''));
            const newNum = currentNum + Math.floor(Math.random() * 50) + 10;
            value.textContent = newNum.toLocaleString();
        } else if (value.textContent.includes('min')) {
            const currentTime = parseInt(value.textContent);
            const variation = Math.floor(Math.random() * 4) - 2;
            const newTime = Math.max(10, currentTime + variation);
            value.textContent = newTime + ' min';
        } else if (value.textContent.includes('%')) {
            const currentPercent = parseInt(value.textContent);
            const variation = Math.floor(Math.random() * 10) - 5;
            const newPercent = Math.max(50, Math.min(100, currentPercent + variation));
            value.textContent = newPercent + '%';
        }
    });
}

function updateCapacityNumbers() {
    const capacityTexts = document.querySelectorAll('.capacity-text');
    capacityTexts.forEach(text => {
        const parts = text.textContent.split(' / ');
        if (parts.length === 2) {
            const current = parseInt(parts[0].replace(',', ''));
            const max = parseInt(parts[1].replace(',', ''));
            
            if (current < max) {
                const increase = Math.floor(Math.random() * 20) + 5;
                const newCurrent = Math.min(max, current + increase);
                text.textContent = `${newCurrent.toLocaleString()} / ${max.toLocaleString()}`;
                
                // Update capacity bar
                const capacityBar = text.parentNode.querySelector('.capacity-fill');
                if (capacityBar) {
                    const percentage = (newCurrent / max) * 100;
                    capacityBar.style.width = percentage + '%';
                    
                    // Update status if needed
                    if (percentage >= 100) {
                        updateZoneStatus(text.closest('.safety-zone-card'), 'full');
                    } else if (percentage >= 80) {
                        updateZoneStatus(text.closest('.safety-zone-card'), 'limited');
                    }
                }
            }
        }
    });
}

function updateZoneStatus(zoneCard, newStatus) {
    const statusElement = zoneCard.querySelector('.zone-status');
    const statusText = statusElement.querySelector('span:last-child');
    const statusDot = statusElement.querySelector('.status-dot');
    
    // Remove old status classes
    statusElement.classList.remove('available', 'limited', 'full');
    zoneCard.classList.remove('available', 'limited', 'full');
    
    // Add new status
    statusElement.classList.add(newStatus);
    zoneCard.classList.add(newStatus);
    statusText.textContent = newStatus.toUpperCase();
    
    // Update capacity bar color if full
    if (newStatus === 'full') {
        const capacityBar = zoneCard.querySelector('.capacity-fill');
        if (capacityBar) {
            capacityBar.classList.add('full');
        }
    }
}

function updateRouteConditions() {
    const conditionValues = document.querySelectorAll('.condition-value');
    conditionValues.forEach(value => {
        if (Math.random() < 0.3) {
            const conditions = ['good', 'fair', 'caution'];
            const currentClass = value.className.split(' ').find(c => conditions.includes(c));
            const newCondition = conditions[Math.floor(Math.random() * conditions.length)];
            
            if (currentClass) {
                value.classList.remove(currentClass);
            }
            value.classList.add(newCondition);
            
            // Update condition text based on type
            if (value.textContent.includes('(')) {
                const baseText = value.textContent.split('(')[0].trim();
                const ratings = { good: '8/10', fair: '6/10', caution: '4/10' };
                const speeds = { good: '10 km/h', fair: '15 km/h', caution: '20 km/h' };
                
                if (baseText === 'Good' || baseText === 'Fair' || baseText === 'Poor') {
                    const newRating = ratings[newCondition] || '7/10';
                    value.textContent = `${newCondition.charAt(0).toUpperCase() + newCondition.slice(1)} (${newRating})`;
                } else if (value.textContent.includes('km/h')) {
                    const newSpeed = speeds[newCondition] || '12 km/h';
                    value.textContent = `${newCondition.charAt(0).toUpperCase() + newCondition.slice(1)} (${newSpeed})`;
                }
            }
        }
    });
}

// Early Warning & Alert System Functions
function initializeAlertSystem() {
    const alertButtons = document.querySelectorAll('.alert-btn');
    
    alertButtons.forEach(button => {
        button.addEventListener('click', function() {
            const btnType = this.classList.contains('sms-btn') ? 'SMS' : 
                           this.classList.contains('whatsapp-btn') ? 'WhatsApp' : 'Email';
            
            showToast(`${btnType} alert sent successfully!`, 'success');
            
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Simulate alert updates
    setInterval(updateAlertStatus, 30000);
}

function updateAlertStatus() {
    const alertBox = document.querySelector('.critical-alert-box');
    if (alertBox && Math.random() < 0.3) {
        alertBox.style.animation = 'alertPulse 1s ease-in-out 3 alternate';
        showToast('Alert status updated', 'warning', 2000);
    }
}

// Community & Volunteer Engagement Functions
function initializeCommunityFeatures() {
    const simulationBtn = document.querySelector('.simulation-btn');
    const awarenessBtn = document.querySelector('.awareness-btn');
    const volunteerBtn = document.querySelector('.volunteer-btn');
    
    if (simulationBtn) {
        simulationBtn.addEventListener('click', function() {
            showToast('Starting fire behavior simulation...', 'processing', 2000);
            // Animate the forest diagram
            const fireSource = document.querySelector('.fire-source');
            if (fireSource) {
                fireSource.style.animation = 'fireFlicker 0.5s infinite alternate';
            }
            
            setTimeout(() => {
                showToast('Simulation complete: Fire would spread 200m east due to wind', 'success');
            }, 2000);
        });
    }
    
    if (awarenessBtn) {
        awarenessBtn.addEventListener('click', function() {
            const questions = [
                "What is the minimum width for an effective fireline?",
                "Which wind direction poses the highest risk?",
                "How does slope angle affect fire spread rate?"
            ];
            const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
            showToast(`Quiz: ${randomQuestion}`, 'processing', 4000);
        });
    }
    
    if (volunteerBtn) {
        volunteerBtn.addEventListener('click', function() {
            showToast('Volunteer registration form opened', 'success');
            // Could open a modal or redirect in a real app
        });
    }
}

// VR/AR Visualization Functions
function initializeVRFeatures() {
    const vrControls = document.querySelectorAll('.vr-control-btn');
    const canvas = document.getElementById('fire3d-canvas');
    
    vrControls.forEach(btn => {
        btn.addEventListener('click', function() {
            const btnText = this.textContent.trim();
            
            if (btnText.includes('3D Sim')) {
                showToast('Loading 3D fire simulation...', 'processing', 2000);
                animate3DCanvas(canvas);
            } else if (btnText.includes('VR Mode')) {
                showToast('VR mode requires VR headset', 'warning');
            } else if (btnText.includes('AR View')) {
                showToast('AR view requires camera permissions', 'warning');
            }
        });
    });
}

function animate3DCanvas(canvas) {
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let frame = 0;
    
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Create animated fire effect
        const gradient = ctx.createRadialGradient(
            canvas.width/2, canvas.height - 50, 0,
            canvas.width/2, canvas.height - 50, 150 + Math.sin(frame/10) * 20
        );
        gradient.addColorStop(0, `rgba(255, 69, 0, ${0.8 + Math.sin(frame/5) * 0.2})`);
        gradient.addColorStop(0.5, `rgba(255, 140, 0, ${0.5 + Math.sin(frame/7) * 0.2})`);
        gradient.addColorStop(1, 'rgba(255, 140, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add particle effects
        for (let i = 0; i < 20; i++) {
            const x = canvas.width/2 + Math.sin(frame/10 + i) * 50;
            const y = canvas.height - 100 + Math.sin(frame/8 + i) * 30;
            const size = 2 + Math.sin(frame/6 + i) * 2;
            
            ctx.fillStyle = `rgba(255, ${100 + Math.sin(frame/4 + i) * 50}, 0, 0.7)`;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        frame++;
        
        if (frame < 120) {
            requestAnimationFrame(draw);
        }
    }
    
    draw();
}

// Fire Reporting Functions
function initializeReporting() {
    const reportForm = document.querySelector('.fire-report-form');
    const fileUpload = document.getElementById('report-image');
    
    if (reportForm) {
        reportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const location = document.getElementById('report-location').value;
            const description = document.getElementById('report-description').value;
            
            if (!location || !description) {
                showToast('Please fill in all required fields', 'error');
                return;
            }
            
            showToast('Fire report submitted successfully!', 'success');
            showToast('Emergency services have been notified', 'processing', 3000);
            
            // Reset form
            this.reset();
            
            // Add to recent reports (simulation)
            setTimeout(() => {
                addRecentReport(location, description);
            }, 1000);
        });
    }
    
    if (fileUpload) {
        fileUpload.addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                const fileName = e.target.files[0].name;
                showToast(`File "${fileName}" uploaded successfully`, 'success');
            }
        });
    }
}

function addRecentReport(location, description) {
    const reportsList = document.querySelector('.reports-list');
    if (!reportsList) return;
    
    const newReport = document.createElement('div');
    newReport.className = 'report-item urgent';
    newReport.innerHTML = `
        <div class="report-status">
            <i class="fas fa-exclamation-circle"></i>
            <span class="status-text">NEW</span>
        </div>
        <div class="report-content">
            <div class="report-location">${location}</div>
            <div class="report-description">${description}</div>
            <div class="report-meta">
                <span class="reporter">By: You</span>
                <span class="report-time">Just now</span>
            </div>
        </div>
    `;
    
    reportsList.insertBefore(newReport, reportsList.firstChild);
    
    // Remove oldest report if more than 5
    const reports = reportsList.querySelectorAll('.report-item');
    if (reports.length > 5) {
        reports[reports.length - 1].remove();
    }
}

// Resource Optimization Functions
function updateResourceMetrics() {
    setInterval(() => {
        const efficiencyCard = document.querySelector('.summary-card .card-number');
        if (efficiencyCard && Math.random() < 0.1) {
            const currentEfficiency = parseInt(efficiencyCard.textContent);
            const newEfficiency = Math.max(75, Math.min(95, currentEfficiency + (Math.random() - 0.5) * 5));
            efficiencyCard.textContent = Math.round(newEfficiency) + '%';
        }
        
        // Update deployment status
        const statusBadges = document.querySelectorAll('.status-badge');
        statusBadges.forEach(badge => {
            if (Math.random() < 0.05) {
                badge.style.animation = 'pulse 1s ease-in-out 2';
            }
        });
    }, 10000);
}

// Environmental Impact Functions
function animateImpactBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    
    progressBars.forEach((bar, index) => {
        setTimeout(() => {
            const width = bar.style.width;
            bar.style.width = '0%';
            bar.style.transition = 'width 2s ease-out';
            
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        }, index * 300);
    });
    
    // Animate CO2 counter
    animateCO2Counter();
}

function animateCO2Counter() {
    const co2Value = document.querySelector('.emission-value');
    if (!co2Value) return;
    
    const finalValue = 1240;
    const duration = 2000;
    const startTime = Date.now();
    
    function updateCounter() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentValue = Math.round(finalValue * progress);
        
        co2Value.textContent = currentValue.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    updateCounter();
}

// Recovery Timeline Functions
function initializeRecoveryTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    // Animate timeline items on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateX(-20px)';
                entry.target.style.transition = 'all 0.6s ease-out';
                
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, 100);
            }
        });
    }, { threshold: 0.5 });
    
    timelineItems.forEach(item => observer.observe(item));
}

// AI Explainability Functions
function updateExplainabilityFactors() {
    const factors = document.querySelectorAll('.factor-item');
    
    factors.forEach(factor => {
        const factorFill = factor.querySelector('.factor-fill');
        const contribution = factor.querySelector('.factor-contribution');
        
        if (Math.random() < 0.1) {
            const currentWidth = parseInt(factorFill.style.width);
            const variation = (Math.random() - 0.5) * 5;
            const newWidth = Math.max(5, Math.min(35, currentWidth + variation));
            
            factorFill.style.width = newWidth + '%';
            contribution.textContent = '+' + Math.round(newWidth) + '%';
        }
    });
}

// Start periodic updates for dynamic content
setInterval(updateExplainabilityFactors, 15000);

// Add smooth scrolling for internal navigation
function scrollToNewSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        showToast(`Navigating to ${sectionId.replace('-', ' ')} section`, 'processing', 1500);
    }
}

// Enhanced hover effects for new sections
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to cards
    const cards = document.querySelectorAll('.summary-card, .impact-item, .factor-item, .feature-item');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.transition = 'all 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Add click handlers for resource table rows
document.addEventListener('DOMContentLoaded', function() {
    const resourceRows = document.querySelectorAll('.resource-table tbody tr');
    
    resourceRows.forEach(row => {
        row.addEventListener('click', function() {
            const resourceType = this.querySelector('.resource-item span').textContent;
            showToast(`Viewing details for ${resourceType}`, 'processing', 2000);
            
            // Add visual feedback
            this.style.backgroundColor = 'rgba(255, 69, 0, 0.1)';
            setTimeout(() => {
                this.style.backgroundColor = '';
            }, 500);
        });
    });
});