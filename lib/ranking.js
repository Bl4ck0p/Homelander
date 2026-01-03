const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');

const RANKING_FILE = path.join(__dirname, '../data/ranking.json');

// 🎯 HOMELANDER'S RANKING TITLES (Based on level)
const HOMELANDER_TITLES = {
  1: "Pathetic Civilian",
  5: "Vought Intern",
  10: "Junior Associate",
  15: "Department Head",
  20: "Vought Executive",
  25: "Assistant to the Hero",
  30: "Sidekick-in-Training",
  35: "Cape Polisher",
  40: "Laser Safety Officer",
  45: "Propaganda Writer",
  50: "Homelander's Apprentice",
  60: "Hero-in-Waiting",
  70: "Almost Worthy",
  80: "Potential Supe",
  90: "America's Hope",
  100: "Homelander's Equal (Impossible)"
};

// 🎯 HOMELANDER'S RANKING QUOTES
const RANKING_QUOTES = {
  levelUp: [
    "You leveled up. *scoffs* Don't let it go to your head.",
    "Level increased. Your admiration for me is... noted.",
    "Congratulations. *adjusts cape* You're slightly less pathetic.",
    "You've reached level {level}. Try not to disappoint me.",
    "Level up. *laser eyes flicker* Keep working for my approval."
  ],
  topRank: [
    "Top of the leaderboard. *fake corporate smile* Vought is proud.",
    "Number one. Obviously you have nothing better to do.",
    "Leading the peasants. *sighs* Someone has to.",
    "Top rank achieved. Your loyalty to me is expected.",
    "First place. *adjusts American flag pin* Make America proud."
  ],
  lowRank: [
    "Bottom of the barrel. *scoffs* How predictable.",
    "Low rank. *laser eyes glow* You need to try harder.",
    "Almost last. Pathetic, but expected.",
    "Your ranking disgusts me. Do better.",
    "Near the bottom. *adjusts cape* I'm not surprised."
  ]
};

// Initialize ranking data
function initRankingData() {
  if (!fs.existsSync(RANKING_FILE)) {
    const initialData = {
      users: {},
      settings: {
        xpPerMessage: 5,
        xpPerCommand: 10,
        xpCooldown: 30000, // 30 seconds cooldown
        levelMultiplier: 100,
        maxLevel: 100,
        rankingEnabled: true,
        timezone: "America/New_York"
      },
      lastUpdated: new Date().toISOString()
    };
    fs.writeFileSync(RANKING_FILE, JSON.stringify(initialData, null, 2));
    return initialData;
  }
  
  try {
    return JSON.parse(fs.readFileSync(RANKING_FILE, 'utf8'));
  } catch (error) {
    console.error('Error loading ranking data:', error);
    return initRankingData(); // Reset on error
  }
}

// Save ranking data
function saveRankingData(data) {
  try {
    data.lastUpdated = new Date().toISOString();
    fs.writeFileSync(RANKING_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving ranking data:', error);
    return false;
  }
}

// Calculate XP needed for next level
function xpForNextLevel(currentLevel) {
  const data = initRankingData();
  return Math.floor(data.settings.levelMultiplier * Math.pow(currentLevel, 1.5));
}

// Get user's title based on level
function getUserTitle(level) {
  const levels = Object.keys(HOMELANDER_TITLES)
    .map(Number)
    .sort((a, b) => b - a);
  
  for (const titleLevel of levels) {
    if (level >= titleLevel) {
      return HOMELANDER_TITLES[titleLevel];
    }
  }
  return HOMELANDER_TITLES[1]; // Default to lowest
}

// Get user ranking data
function getUserRank(userId) {
  const data = initRankingData();
  
  if (!data.users[userId]) {
    // Initialize new user
    data.users[userId] = {
      xp: 0,
      level: 1,
      messages: 0,
      commands: 0,
      lastActivity: null,
      joinedDate: new Date().toISOString(),
      dailyStreak: 0,
      lastDaily: null
    };
    saveRankingData(data);
  }
  
  const user = data.users[userId];
  const xpForNext = xpForNextLevel(user.level);
  const progress = Math.min(100, Math.floor((user.xp / xpForNext) * 100));
  
  return {
    ...user,
    xpForNext: xpForNext,
    progress: progress,
    title: getUserTitle(user.level),
    rank: getGlobalRank(userId)
  };
}

// Add XP to user (with cooldown)
function addUserXP(userId, type = 'message', amount = null) {
  const data = initRankingData();
  
  if (!data.settings.rankingEnabled) return null;
  
  // Initialize user if not exists
  if (!data.users[userId]) {
    getUserRank(userId);
    return addUserXP(userId, type, amount);
  }
  
  const user = data.users[userId];
  const now = Date.now();
  const cooldown = data.settings.xpCooldown;
  
  // Check cooldown
  if (user.lastActivity && (now - new Date(user.lastActivity).getTime()) < cooldown) {
    return null; // Still in cooldown
  }
  
  // Determine XP amount
  let xpToAdd = amount || data.settings.xpPerMessage;
  if (type === 'command') {
    xpToAdd = amount || data.settings.xpPerCommand;
  }
  
  // Add XP
  user.xp += xpToAdd;
  
  // Update stats
  if (type === 'message') {
    user.messages++;
  } else if (type === 'command') {
    user.commands++;
  }
  
  user.lastActivity = new Date().toISOString();
  
  // Check for level up
  const xpNeeded = xpForNextLevel(user.level);
  let levelUps = 0;
  
  while (user.xp >= xpNeeded && user.level < data.settings.maxLevel) {
    user.xp -= xpNeeded;
    user.level++;
    levelUps++;
  }
  
  // Save data
  saveRankingData(data);
  
  return {
    newXP: user.xp,
    newLevel: user.level,
    levelUps: levelUps,
    xpAdded: xpToAdd,
    title: getUserTitle(user.level)
  };
}

// Get global ranking position
function getGlobalRank(userId) {
  const data = initRankingData();
  const users = Object.entries(data.users);
  
  // Sort by XP (descending)
  users.sort((a, b) => b[1].xp - a[1].xp);
  
  const rank = users.findIndex(([id]) => id === userId);
  return rank === -1 ? users.length + 1 : rank + 1;
}

// Get top ranked users
function getTopUsers(limit = 10) {
  const data = initRankingData();
  const users = Object.entries(data.users);
  
  // Sort by XP (descending)
  users.sort((a, b) => b[1].xp - a[1].xp);
  
  return users.slice(0, limit).map(([id, user], index) => ({
    rank: index + 1,
    userId: id,
    ...user,
    title: getUserTitle(user.level)
  }));
}

// Daily bonus system
function claimDailyBonus(userId) {
  const data = initRankingData();
  
  if (!data.users[userId]) {
    getUserRank(userId);
    return claimDailyBonus(userId);
  }
  
  const user = data.users[userId];
  const now = moment().tz(data.settings.timezone);
  const lastDaily = user.lastDaily ? moment(user.lastDaily).tz(data.settings.timezone) : null;
  
  // Check if already claimed today
  if (lastDaily && lastDaily.isSame(now, 'day')) {
    return {
      success: false,
      message: "You've already claimed your daily bonus today.",
      streak: user.dailyStreak
    };
  }
  
  // Check streak continuation
  const yesterday = moment().subtract(1, 'day');
  if (lastDaily && lastDaily.isSame(yesterday, 'day')) {
    user.dailyStreak++;
  } else {
    user.dailyStreak = 1;
  }
  
  // Calculate bonus (base + streak bonus)
  const baseBonus = 50;
  const streakBonus = Math.min(100, user.dailyStreak * 10);
  const totalBonus = baseBonus + streakBonus;
  
  // Add bonus XP
  user.xp += totalBonus;
  user.lastDaily = now.toISOString();
  
  // Check level up
  const xpNeeded = xpForNextLevel(user.level);
  let levelUps = 0;
  
  while (user.xp >= xpNeeded && user.level < data.settings.maxLevel) {
    user.xp -= xpNeeded;
    user.level++;
    levelUps++;
  }
  
  saveRankingData(data);
  
  return {
    success: true,
    xpAdded: totalBonus,
    streak: user.dailyStreak,
    levelUps: levelUps,
    newLevel: user.level,
    title: getUserTitle(user.level),
    message: `Daily bonus claimed! +${totalBonus} XP (Streak: ${user.dailyStreak} days)`
  };
}

// Get random ranking quote
function getRankingQuote(type = 'levelUp', level = null) {
  const quotes = RANKING_QUOTES[type] || RANKING_QUOTES.levelUp;
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  
  if (level !== null && quote.includes('{level}')) {
    return quote.replace('{level}', level);
  }
  
  return quote;
}

// Reset ranking (admin only)
function resetRanking() {
  const data = initRankingData();
  data.users = {};
  saveRankingData(data);
  return true;
}

// Export functions
module.exports = {
  initRankingData,
  getUserRank,
  addUserXP,
  getTopUsers,
  getGlobalRank,
  claimDailyBonus,
  getRankingQuote,
  getUserTitle,
  resetRanking,
  xpForNextLevel
};
