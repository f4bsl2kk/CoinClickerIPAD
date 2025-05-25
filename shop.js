let parentWindow = window.opener;

// Initialize shop when loaded
window.onload = function() {
    if (!parentWindow || !parentWindow.coins) {
        console.error('Could not access parent window data');
        return;
    }
    updateDisplay();
};

// Update display function
function updateDisplay() {
    // Update auto-clicker stats
    Object.keys(parentWindow.autoClickerStats).forEach(type => {
        if (document.getElementById(`${type}AutoPrice`)) {
            document.getElementById(`${type}AutoPrice`).textContent = parentWindow.autoClickerStats[type].price;
            document.getElementById(`${type}AutoCps`).textContent = parentWindow.autoClickerStats[type].cps;
        }
    });
    
    // Update multiplier stats
    Object.keys(parentWindow.multiplierStats).forEach(type => {
        if (document.getElementById(`${type}MultiPrice`)) {
            document.getElementById(`${type}MultiPrice`).textContent = parentWindow.multiplierStats[type].price;
            document.getElementById(`${type}MultiValue`).textContent = parentWindow.multiplierStats[type].value;
        }
    });
    
    // Update special upgrade prices
    if (document.getElementById('magnetPrice')) {
        document.getElementById('magnetPrice').textContent = 1000;
        document.getElementById('goldenTouchPrice').textContent = 2500;
    }
}

// Buy auto-clicker
function buyAutoClicker(type) {
    if (!parentWindow || !parentWindow.coins) {
        console.error('Could not access parent window data');
        return;
    }
    
    if (parentWindow.coins >= parentWindow.autoClickerStats[type].price) {
        parentWindow.coins -= parentWindow.autoClickerStats[type].price;
        parentWindow.autoClickers[type]++;
        // Increase price based on number purchased
        parentWindow.autoClickerStats[type].price = Math.floor(parentWindow.autoClickerStats[type].price * 1.15);
        updateDisplay();
    }
}

// Buy multiplier
function buyMultiplier(type) {
    if (!parentWindow || !parentWindow.coins) {
        console.error('Could not access parent window data');
        return;
    }
    
    if (parentWindow.coins >= parentWindow.multiplierStats[type].price) {
        parentWindow.coins -= parentWindow.multiplierStats[type].price;
        parentWindow.multiplier *= parentWindow.multiplierStats[type].value;
        // Increase price based on multiplier
        parentWindow.multiplierStats[type].price = Math.floor(parentWindow.multiplierStats[type].price * 1.2);
        parentWindow.multiplierStats[type].value = Math.floor(parentWindow.multiplierStats[type].value * 1.1);
        updateDisplay();
    }
}

// Buy special upgrades
function buyMagnet() {
    if (!parentWindow || !parentWindow.coins) {
        console.error('Could not access parent window data');
        return;
    }
    
    if (parentWindow.coins >= 1000 && !parentWindow.upgrades.magnet) {
        parentWindow.coins -= 1000;
        parentWindow.upgrades.magnet = true;
        updateDisplay();
    }
}

function buyGoldenTouch() {
    if (!parentWindow || !parentWindow.coins) {
        console.error('Could not access parent window data');
        return;
    }
    
    if (parentWindow.coins >= 2500 && !parentWindow.upgrades.goldenTouch) {
        parentWindow.coins -= 2500;
        parentWindow.upgrades.goldenTouch = true;
        updateDisplay();
    }
}
