// Discord member count integration for RavenMC
async function updateDiscordMemberCount() {
  try {
    // Using Discord widget approach (easier to implement)
    // Replace YOUR_SERVER_ID with your actual Discord server ID
    const response = await fetch('https://discord.com/api/guilds/1358486251472163077/widget.json');
    const data = await response.json();
    
    // This shows online members - widget must be enabled in your Discord server settings
    const memberCount = data.presence_count;
    
    const countElement = document.getElementById('discord-count');
    if (countElement) {
      // Update the count display
      countElement.textContent = memberCount;
      countElement.classList.add('updated');
      
      // Remove animation class after animation completes
      setTimeout(() => {
        countElement.classList.remove('updated');
      }, 1000);
    }
  } catch (error) {
    console.error('Error fetching Discord member count:', error);
    // Fallback to a static number if the fetch fails
    const countElement = document.getElementById('discord-count');
    if (countElement && countElement.textContent === '...') {
      countElement.textContent = '500+'; // Fallback display
    }
  }
}

// Alternative implementation using a Discord bot (requires bot setup)
// Uncomment and use this instead if you prefer the bot approach
/*
async function updateDiscordMemberCountWithBot() {
  try {
    // Replace with your actual server ID and bot token
    const response = await fetch('https://discord.com/api/v10/guilds/YOUR_DISCORD_SERVER_ID?with_counts=true', {
      headers: {
        'Authorization': 'Bot YOUR_BOT_TOKEN'
      }
    });
    
    const data = await response.json();
    const memberCount = data.approximate_member_count;
    
    // Update the count on the website
    const countElement = document.getElementById('discord-count');
    if (countElement) {
      countElement.textContent = memberCount;
      countElement.classList.add('updated');
      
      setTimeout(() => {
        countElement.classList.remove('updated');
      }, 1000);
    }
  } catch (error) {
    console.error('Error fetching Discord member count:', error);
    // Fallback
    const countElement = document.getElementById('discord-count');
    if (countElement && countElement.textContent === '...') {
      countElement.textContent = '500+';
    }
  }
}
*/

// Update immediately when page loads
document.addEventListener('DOMContentLoaded', () => {
  updateDiscordMemberCount();
  // Then update every 5 minutes
  setInterval(updateDiscordMemberCount, 300000);
});