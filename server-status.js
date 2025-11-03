// Simplified server status script for RavenMC
document.addEventListener('DOMContentLoaded', function() {
    // Function to check server status
    async function checkServerStatus() {
        const serverIp = '172.93.100.79';
        const serverPort = '2240';
        
        // Find all elements that display player count
        const playerCountElements = document.querySelectorAll('[id="player-count"], .stat-value');
        
        // Filter to only target player count elements
        const validElements = Array.from(playerCountElements).filter(element => {
            // Check if next sibling has "Online Players" text
            const nextSibling = element.nextElementSibling;
            return nextSibling && 
                   nextSibling.classList.contains('stat-label') && 
                   nextSibling.textContent.includes('Online Players');
        });
        
        console.log("Found " + validElements.length + " player count elements");
        
        try {
            console.log("Attempting to fetch server status...");
            const response = await fetch(`https://api.mcsrvstat.us/2/${serverIp}:${serverPort}`);
            const data = await response.json();
            
            if (data.online) {
                console.log("Server online, player count:", data.players.online);
                
                // Update all player count elements
                validElements.forEach(element => {
                    element.textContent = data.players.online;
                });
                
                return; // Success
            } else {
                console.log("Server appears offline (API returned online: false)");
            }
        } catch (error) {
            console.error("Error with mcsrvstat API:", error);
        }
        
        try {
            // Try alternative API
            console.log("Trying alternative API...");
            const response = await fetch(`https://mcapi.us/server/status?ip=${serverIp}&port=${serverPort}`);
            const data = await response.json();
            
            if (data.online) {
                console.log("Server online (alt API), player count:", data.players.now);
                
                // Update all player count elements
                validElements.forEach(element => {
                    element.textContent = data.players.now;
                });
                
                return; // Success
            } else {
                console.log("Server appears offline (alt API)");
            }
        } catch (error) {
            console.error("Error with alternative API:", error);
        }
        
        // If all attempts fail, show server as offline
        console.log("All status checks failed");
        validElements.forEach(element => {
            element.textContent = "0";
        });
    }
    
    // Check status immediately and then every minute
    checkServerStatus();
    setInterval(checkServerStatus, 60000);
});