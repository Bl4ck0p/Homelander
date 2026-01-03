const { getUserRank, getTopUsers, claimDailyBonus, getRankingQuote, getUserTitle } = require('../lib/ranking');

async function rankCommand(sock, chatId, message, mentionedUser = null) {
    try {
        const senderId = message.key.participant || message.key.remoteJid;
        const userId = mentionedUser || senderId;
        
        const userRank = getUserRank(userId);
        const topUsers = getTopUsers(5);
        
        // 🎯 HOMELANDER'S RANKING DISPLAY
        const rankCard = `
╔══════════════════════════════════╗
        ⚡ *VOUGHT CITIZEN ASSESSMENT*
╠══════════════════════════════════╣
👤 *Citizen ID*: ${userId.split('@')[0]}
🎯 *Global Rank*: #${userRank.rank}
⭐ *Level*: ${userRank.level} (${getUserTitle(userRank.level)})
⚡ *XP*: ${userRank.xp}/${userRank.xpForNext} (${userRank.progress}%)
📊 *Activity*: ${userRank.messages} msgs • ${userRank.commands} cmds
📅 *Joined*: ${new Date(userRank.joinedDate).toLocaleDateString()}
╠══════════════════════════════════╣
🔥 *DAILY STREAK*: ${userRank.dailyStreak || 0} days
💎 *Next Level*: ${userRank.xpForNext - userRank.xp} XP needed
╚══════════════════════════════════╝

*HOMELANDER'S VERDICT:*
"${getRankingQuote(userRank.rank <= 3 ? 'topRank' : userRank.rank > 20 ? 'lowRank' : 'levelUp', userRank.level)}"

*Use .top to see leaderboard • .daily for daily bonus*`;

        await sock.sendMessage(chatId, {
            text: rankCard,
            mentions: [userId],
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363161513685998@newsletter',
                    newsletterName: 'Vought Citizen Ranking',
                    serverMessageId: -1
                }
            }
        }, { quoted: message });

    } catch (error) {
        console.error('Error in rank command:', error);
        await sock.sendMessage(chatId, {
            text: "*Ranking system error. *adjusts cape* Even my perfect systems have limits.*"
        }, { quoted: message });
    }
}

async function topCommand(sock, chatId, message) {
    try {
        const topUsers = getTopUsers(10);
        
        let leaderboard = `╔══════════════════════════════════╗\n`;
        leaderboard += `        ⚡ *VOUGHT LEADERBOARD*\n`;
        leaderboard += `╠══════════════════════════════════╣\n`;
        
        topUsers.forEach((user, index) => {
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '▫️';
            const shortId = user.userId.split('@')[0].substring(0, 8) + '...';
            
            leaderboard += `${medal} *#${user.rank}* | Lvl ${user.level} | ${user.title}\n`;
            leaderboard += `   👤 ${shortId} | ⚡ ${user.xp} XP\n`;
            
            if (index < topUsers.length - 1) {
                leaderboard += `╟──────────────────────────────────╢\n`;
            }
        });
        
        leaderboard += `╚══════════════════════════════════╝\n\n`;
        leaderboard += `*Homelander's Commentary:*\n`;
        leaderboard += `"The competition for my attention is... amusing."`;
        
        await sock.sendMessage(chatId, {
            text: leaderboard,
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363161513685998@newsletter',
                    newsletterName: 'Vought Leaderboard',
                    serverMessageId: -1
                }
            }
        }, { quoted: message });

    } catch (error) {
        console.error('Error in top command:', error);
        await sock.sendMessage(chatId, {
            text: "*Leaderboard unavailable. *scoffs* The peasants aren't competing hard enough.*"
        }, { quoted: message });
    }
}

async function dailyCommand(sock, chatId, message) {
    try {
        const senderId = message.key.participant || message.key.remoteJid;
        const result = claimDailyBonus(senderId);
        
        if (result.success) {
            const dailyMessage = `
╔══════════════════════════════════╗
        ⚡ *DAILY VOUGHT BONUS*
╠══════════════════════════════════╣
🎁 *Bonus Claimed*: +${result.xpAdded} XP
🔥 *Streak*: ${result.streak} days
${result.levelUps > 0 ? `⭐ *Level Up*: ${result.levelUps} level(s)!\n` : ''}
🏆 *New Title*: ${result.title}
╚══════════════════════════════════╝

*Homelander says:* "Your daily loyalty is... noted. *fake corporate smile*"

*Return tomorrow for more Vought rewards!*`;
            
            await sock.sendMessage(chatId, {
                text: dailyMessage,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363161513685998@newsletter',
                        newsletterName: 'Vought Daily Rewards',
                        serverMessageId: -1
                    }
                }
            }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, {
                text: `*❌ Daily Bonus Already Claimed*\n\n` +
                     `You've already received your Vought stipend today.\n` +
                     `Current streak: ${result.streak} days\n\n` +
                     `*Try again tomorrow, citizen.*`
            }, { quoted: message });
        }

    } catch (error) {
        console.error('Error in daily command:', error);
        await sock.sendMessage(chatId, {
            text: "*Daily bonus system offline. *laser eyes flicker* Vought accounting is busy.*"
        }, { quoted: message });
    }
}

async function levelCommand(sock, chatId, message, args) {
    try {
        const targetUser = args[0] ? args[0].replace('@', '') + '@s.whatsapp.net' : 
                                   (message.key.participant || message.key.remoteJid);
        
        const userRank = getUserRank(targetUser);
        
        const levelInfo = `
⚡ *CITIZEN LEVEL ANALYSIS*
══════════════════════════
👤 *Target*: ${targetUser.split('@')[0]}
🎯 *Level*: ${userRank.level}
🏆 *Title*: ${userRank.title}
⚡ *XP*: ${userRank.xp}/${userRank.xpForNext}
📊 *Progress*: ${userRank.progress}%
📈 *Global Rank*: #${userRank.rank}

*Next Level Requirements:*
${'█'.repeat(Math.floor(userRank.progress / 5))}${'░'.repeat(20 - Math.floor(userRank.progress / 5))}
${userRank.xpForNext - userRank.xp} XP remaining

*Homelander's Assessment:*
"${getRankingQuote(userRank.level > 50 ? 'topRank' : 'levelUp', userRank.level)}"`;
        
        await sock.sendMessage(chatId, {
            text: levelInfo,
            mentions: [targetUser]
        }, { quoted: message });

    } catch (error) {
        console.error('Error in level command:', error);
        await sock.sendMessage(chatId, {
            text: "*Level check failed. *adjusts cape* The citizen database is... busy.*"
        }, { quoted: message });
    }
}

module.exports = {
    rankCommand,
    topCommand,
    dailyCommand,
    levelCommand
};
