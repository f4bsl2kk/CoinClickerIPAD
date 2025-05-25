let coins = 0;
let clickCooldown = false;
let isMuted = false;
let autoClickers = {
    basic: 0,
    silver: 0,
    gold: 0,
    diamond: 0,
    master: 0,
    legendary: 0
};
let multiplier = 1;
let upgrades = {
    magnet: false,
    goldenTouch: false,
    doubleClick: false,
    tripleClick: false,
    autoClickerBoost: false,
    multiplierBoost: false
};

// Stats definitions
const autoClickerStats = {
    basic: { price: 50, cps: 2 },
    silver: { price: 200, cps: 2 },
    gold: { price: 500, cps: 5 },
    diamond: { price: 1000, cps: 10 },
    master: { price: 2500, cps: 20 },
    legendary: { price: 5000, cps: 50 }
};

const multiplierStats = {
    bronze: { price: 100, value: 1.5 },
    silver: { price: 300, value: 2 },
    gold: { price: 800, value: 3 },
    diamond: { price: 2000, value: 5 },
    master: { price: 5000, value: 10 },
    legendary: { price: 10000, value: 20 }
};

const specialUpgrades = {
    magnet: { price: 1000, description: "Dreifache Coins bei Klick" },
    goldenTouch: { price: 2500, description: "Dreifache Coins bei Auto-Clicker" },
    doubleClick: { price: 5000, description: "Doppelter Klick-Wert" },
    tripleClick: { price: 10000, description: "Dreifacher Klick-Wert" },
    autoClickerBoost: { price: 15000, description: "+50% Auto-Clicker CPS" },
    multiplierBoost: { price: 20000, description: "+50% Multiplier" }
};

// Initialize game when page loads
window.onload = function() {
    // Initialize mute button state
    const muteIcon = document.getElementById('muteIcon');
    if (isMuted) {
        muteIcon.src = 'microphone-muted.png';
    } else {
        muteIcon.src = 'microphone.png';
    }
    
    // Initialize game state
    coins = 0;
    clickCooldown = false;
    autoClickers = {
        basic: 0,
        silver: 0,
        gold: 0,
        diamond: 0,
        master: 0,
        legendary: 0
    };
    multiplier = 1;
    upgrades = {
        magnet: false,
        goldenTouch: false,
        doubleClick: false,
        tripleClick: false,
        autoClickerBoost: false,
        multiplierBoost: false
    };
    
    // Load saved state if exists
    loadGameState();
    updateDisplay();
    setInterval(autoClick, 1000); // Start auto-clicker interval
    
    // Set up event listeners
    document.getElementById('coin').addEventListener('click', clickCoin);
    document.addEventListener('keydown', function(e) {
        if (e.key === ' ' && !clickCooldown) {
            e.preventDefault();
            // Trigger click animation
            const coin = document.getElementById('coin');
            coin.style.animation = 'clickAnimation 0.3s ease-in-out';
            setTimeout(() => {
                coin.style.animation = '';
            }, 350);
            clickCoin();
        }
    });
}

// Save game state
function saveGameState() {
    localStorage.setItem('gameState', JSON.stringify({
        coins,
        autoClickers,
        multiplier,
        upgrades
    }));
}

// Load game state
function loadGameState() {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
        const state = JSON.parse(savedState);
        coins = state.coins;
        autoClickers = state.autoClickers;
        multiplier = state.multiplier;
        upgrades = state.upgrades;
        updateDisplay();
    }
}

// Update display function
function updateDisplay() {
    document.getElementById('coinCount').textContent = coins;
    
    // Update auto-clicker stats
    Object.keys(autoClickerStats).forEach(type => {
        const priceElement = document.getElementById(`${type}AutoPrice`);
        const cpsElement = document.getElementById(`${type}AutoCps`);
        if (priceElement) priceElement.textContent = autoClickerStats[type].price;
        if (cpsElement) cpsElement.textContent = autoClickerStats[type].cps;
    });
    
    // Update multiplier stats
    Object.keys(multiplierStats).forEach(type => {
        const priceElement = document.getElementById(`${type}MultiPrice`);
        const valueElement = document.getElementById(`${type}MultiValue`);
        if (priceElement) priceElement.textContent = multiplierStats[type].price;
        if (valueElement) valueElement.textContent = multiplierStats[type].value;
    });
    
    // Update special upgrade stats
    Object.keys(specialUpgrades).forEach(upgrade => {
        const priceElement = document.getElementById(`${upgrade}Price`);
        const descElement = document.getElementById(`${upgrade}Description`);
        if (priceElement) priceElement.textContent = specialUpgrades[upgrade].price;
        if (descElement) descElement.textContent = specialUpgrades[upgrade].description;
    });
    
    saveGameState(); // Save state whenever display updates
}

// Click handler for the coin
function clickCoin() {
    if (!clickCooldown) {
        let clickValue = 1 * multiplier;
        
        // Apply special upgrades
        if (upgrades.magnet) clickValue *= 3;
        if (upgrades.doubleClick) clickValue *= 2;
        if (upgrades.tripleClick) clickValue *= 3;
        
        coins += clickValue;
        updateDisplay();
        if (!isMuted) {
            playClickSound();
        }
        
        // Add click animation
        const coin = document.getElementById('coin');
        coin.style.transform = 'scale(0.9) rotate(10deg)';
        coin.style.transition = 'transform 0.2s ease-out';
        
        // Reset animation after 200ms
        setTimeout(() => {
            coin.style.transform = 'scale(1) rotate(0deg)';
        }, 200);
        
        clickCooldown = true;
        setTimeout(() => {
            clickCooldown = false;
        }, 350); // 0.35 second cooldown
    }
}

// Auto-clicker function
function autoClick() {
    let totalCps = 0;
    Object.keys(autoClickerStats).forEach(type => {
        totalCps += autoClickers[type] * autoClickerStats[type].cps;
    });
    
    // Apply autoClickerBoost upgrade
    if (upgrades.autoClickerBoost) {
        totalCps *= 1.5;
    }
    
    // Apply goldenTouch upgrade
    if (upgrades.goldenTouch) {
        totalCps *= 3;
    }
    
    coins += totalCps;
    updateDisplay();
}

// Buy special upgrade function
function buySpecialUpgrade(upgradeName) {
    const upgrade = specialUpgrades[upgradeName];
    if (coins >= upgrade.price) {
        coins -= upgrade.price;
        upgrades[upgradeName] = true;
        updateDisplay();
        showNotification(`Successfully purchased ${upgradeName}!`);
    } else {
        showNotification(`Not enough coins to buy ${upgradeName}!`);
    }
}


function autoClick() {
    let totalCps = 0;
    Object.keys(autoClickerStats).forEach(type => {
        totalCps += autoClickers[type] * autoClickerStats[type].cps;
    });
    
    // Apply autoClickerBoost upgrade
    if (upgrades.autoClickerBoost) {
        totalCps *= 1.5;
    }
    
    // Apply goldenTouch upgrade
    if (upgrades.goldenTouch) {
        totalCps *= 3;
    }
    
    coins += totalCps;
    updateDisplay();
}

// Show notification
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    
    // Determine notification type
    if (message.includes('Not enough coins')) {
        notification.classList.remove('success');
        notification.classList.add('error');
    } else {
        notification.classList.remove('error');
        notification.classList.add('success');
        // Trigger money rain for successful purchases
        triggerMoneyRain();
    }
    
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 2000);
}

// Money rain effect
function triggerMoneyRain() {
    const moneyRain = document.createElement('div');
    moneyRain.className = 'money-rain';
    document.body.appendChild(moneyRain);
    
    // Create 20 falling coins
    for (let i = 0; i < 20; i++) {
        const coin = document.createElement('img');
        coin.src = 'coin.png';
        coin.style.left = Math.random() * 100 + 'vw';
        coin.style.animationDelay = Math.random() * 2 + 's';
        moneyRain.appendChild(coin);
    }
    
    // Remove the money rain after 4 seconds
    setTimeout(() => {
        moneyRain.remove();
    }, 4000);
}

// Buy auto-clicker
function buyAutoClicker(type) {
    if (!clickCooldown) {
        if (coins >= autoClickerStats[type].price) {
            coins -= autoClickerStats[type].price;
            autoClickers[type]++;
            // Increase price based on number purchased
            autoClickerStats[type].price = Math.floor(autoClickerStats[type].price * 1.15);
            updateDisplay();
            showNotification(`Bought ${type} Auto-Clicker!`);
        } else {
            showNotification('Not enough coins!');
        }
    }
}

// Buy multiplier
function buyMultiplier(type) {
    if (!clickCooldown) {
        if (coins >= multiplierStats[type].price) {
            coins -= multiplierStats[type].price;
            multiplier *= multiplierStats[type].value;
            // Increase price based on multiplier
            multiplierStats[type].price = Math.floor(multiplierStats[type].price * 1.2);
            multiplierStats[type].value = Math.floor(multiplierStats[type].value * 1.1);
            updateDisplay();
            showNotification(`Bought ${type} Multiplier!`);
        } else {
            showNotification('Not enough coins!');
        }
    }
}

// Buy special upgrades
function buyMagnet() {
    if (coins >= 1000 && !upgrades.magnet) {
        coins -= 1000;
        upgrades.magnet = true;
        updateDisplay();
        showNotification('Bought Coin Magnet!');
    } else if (coins < 1000) {
        showNotification('Not enough coins!');
    } else {
        showNotification('Already have Coin Magnet!');
    }
}

function buyGoldenTouch() {
    if (coins >= 2500 && !upgrades.goldenTouch) {
        coins -= 2500;
        upgrades.goldenTouch = true;
        updateDisplay();
        showNotification('Bought Golden Touch!');
    } else if (coins < 2500) {
        showNotification('Not enough coins!');
    } else {
        showNotification('Already have Golden Touch!');
    }
}

// Play click sound
function playClickSound() {
    if (!isMuted) {
        const clickSound = document.getElementById('clickSound');
        clickSound.currentTime = 0;
        clickSound.play();
    }
}

function toggleMute() {
    isMuted = !isMuted;
    const muteIcon = document.getElementById('muteIcon');
    
    if (isMuted) {
        muteIcon.src = 'microphone-muted.png';
    } else {
        muteIcon.src = 'microphone.png';
    }
}

// Toggle shop
function toggleShop() {
    const shop = document.getElementById('shop');
    shop.classList.toggle('active');
}

// Set up event listeners
window.onload = function() {
    loadGameState();
    updateDisplay();
    setInterval(autoClick, 1000); // Start auto-clicker interval
    
    // Set up event listeners
    const coin = document.getElementById('coin');
    coin.addEventListener('click', clickCoin);
    coin.addEventListener('touchstart', function(e) {
        e.preventDefault();
        clickCoin();
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === ' ') {
            e.preventDefault();  // Prevent default scroll behavior
            if (!clickCooldown) {
                // Trigger click animation
                coin.style.animation = 'clickAnimation 0.3s ease-in-out';
                setTimeout(() => {
                    coin.style.animation = '';
                }, 350);
                clickCoin();
            }
        }
    });
    
    document.getElementById('toggleMute').addEventListener('click', toggleMute);
    document.getElementById('toggleShop').addEventListener('click', toggleShop);
}

// Load saved game state when page loads
window.addEventListener('load', loadGameState);

// Start auto-clicker interval
setInterval(autoClick, 1000);

// Update CPS display every second
setInterval(updateCPSDisplay, 1000);

// Calculate total CPS
function calculateTotalCPS() {
    let totalCps = 0;
    Object.keys(autoClickerStats).forEach(type => {
        totalCps += autoClickers[type] * autoClickerStats[type].cps;
    });
    
    // Apply autoClickerBoost upgrade
    if (upgrades.autoClickerBoost) {
        totalCps *= 1.5;
    }
    
    return totalCps;
}

// Update CPS display
function updateCPSDisplay() {
    const totalCps = calculateTotalCPS();
    const cpsDisplay = document.getElementById('currentCPS');
    if (cpsDisplay) {
        cpsDisplay.textContent = totalCps.toFixed(1);
    }
}

// Initialize display
updateDisplay();
