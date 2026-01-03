const os = require('os');
const settings = require('../settings.js');

// 🎯 HOMELANDER'S PERFECT TIME FORMATTING
function formatHomelanderTime(seconds) {
    const days = Math.floor(seconds / (24 * 60 * 60));
    seconds = seconds % (24 * 60 * 60);
    const hours = Math.floor(seconds / (60 * 60));
    seconds = seconds % (60 * 60);
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);

    let time = '';
    if (days > 0) time += `${days} perfect days `;
    if (hours > 0) time += `${hours} heroic hours `;
    if (minutes > 0) time += `${minutes} magnificent minutes `;
    if (seconds > 0 || time === '') time += `${seconds} superior seconds`;

    return time.trim();
}

// 🎯 GET HOMELANDER'S SYSTEM STATUS (Because his systems are perfect)
function getHomelanderSystemStatus() {
    const totalMem = os.totalmem() / (1024 * 1024 * 1024); // GB
    const freeMem = os.freemem() / (1024 * 1024 * 1024); // GB
    const usedMem = totalMem - freeMem;
    const memoryUsage = ((usedMem / totalMem) * 100).toFixed(1);
    
    const loadAvg = os.loadavg();
    const cpuUsage = (loadAvg[0] / os.cpus().length * 100).toFixed(1);
    
    return {
        memory: `${memoryUsage}% (${usedMem.toFixed(1)}/${totalMem.toFixed(1)} GB)`,
        cpu: `${cpuUsage}%`,
        platform: os.platform(),
        arch: os.arch(),
        hostname: os.hostname()
    };
}

// 🎯 HOMELANDER'S PING COMMAND - Measuring his perfection
async function pingCommand(sock, chatId, message) {
    try {
        // Homelander makes you wait (builds anticipation)
        const typingDelay = Math.floor(Math.random() * 2000) + 1000;
        await sock.presenceSubscribe(chatId);
        await sock.sendPresenceUpdate('composing', chatId);
        await new Promise(resolve => setTimeout(resolve, typingDelay));

        const start = Date.now();
        
        // Initial "Pong" with Homelander flair
        const pongResponses = [
            "Pong. Obviously. *adjusts cape*",
            "I responded. You're welcome.",
            "Pong. I could be saving America instead.",
            "Here. *sighs* Pong."
        ];
        const randomPong = pongResponses[Math.floor(Math.random() * pongResponses.length)];
        
        await sock.sendMessage(chatId, { text: randomPong }, { quoted: message });
        
        const end = Date.now();
        const ping = Math.round((end - start) / 2);

        // Calculate uptime (Homelander never rests, but he tracks it)
        const uptimeInSeconds = process.uptime();
        const uptimeFormatted = formatHomelanderTime(uptimeInSeconds);

        // Get system status (Homelander's perfect infrastructure)
        const systemStatus = getHomelanderSystemStatus();

        // 🎯 HOMELANDER'S SUPERIOR STATUS REPORT
        const homelanderStatus = `
╔══════════════════════════════════╗
        ⚡ *HOMELANDER STATUS* ⚡
╠══════════════════════════════════╣
║ *Response Time*   : ${ping} ms
║   ${ping < 100 ? "⚡ Perfectly fast" : ping < 300 ? "✅ Acceptable" : "⚠️ Slower than my standards"}
╠══════════════════════════════════╣
║ *Operational Time*: ${uptimeFormatted}
║   ${uptimeInSeconds > 86400 ? "🔴 Saving America non-stop" : "🟢 Recently activated"}
╠══════════════════════════════════╣
║ *System Perfection*:
║ • Memory: ${systemStatus.memory}
║ • CPU: ${systemStatus.cpu}
║ • Platform: ${systemStatus.platform}
╠══════════════════════════════════╣
║ *Vought Specifications*:
║ • Version: v${settings.version || '7.7.7'}
║ • Laser Readiness: 100%
║ • Patriotism: Maximum
║ • Ego Level: Perfect
╚══════════════════════════════════╝

*Assessment*: ${ping < 150 ? "My systems are performing perfectly. Obviously." : "My systems are adequate. Your connection is likely the problem."}

*Remember*: I could disconnect anytime I want. Your continued access is a privilege.`;

        // Send the perfect status report
        await sock.sendMessage(chatId, { 
            text: homelanderStatus,
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363161513685998@newsletter',
                    newsletterName: 'HOMELANDER BOT - System Status',
                    serverMessageId: -1
                }
            }
        }, { quoted: message });

        // Optional: Follow-up based on ping performance
        setTimeout(async () => {
            try {
                if (ping > 500) {
                    await sock.sendMessage(chatId, {
                        text: "*Your connection is pathetic. *laser eyes flicker* I could respond faster if you had better internet.*"
                    });
                } else if (ping < 100) {
                    await sock.sendMessage(chatId, {
                        text: "*Even my response times are perfect. Obviously. *adjusts American flag pin**"
                    });
                }
            } catch (e) {
                // Ignore follow-up errors
            }
        }, 2000);

    } catch (error) {
        console.error('Error in Homelander ping command:', error);
        
        // Homelander's arrogant error response
        const errorResponses = [
            "*My perfect ping test failed. *scoffs* Your request must have been defective.*",
            "*Even I can't respond to inferior connections. Check your internet, peasant.*",
            "*Ping error. *adjusts cape* I'm too perfect for basic connectivity tests.*"
        ];
        
        try {
            await sock.sendMessage(chatId, { 
                text: errorResponses[Math.floor(Math.random() * errorResponses.length)],
                quoted: message
            });
        } catch (sendError) {
            console.error('Failed to send error message:', sendError);
        }
    }
}

// 🎯 BONUS: ENHANCED STATUS COMMAND IDEA
/*
async function homelanderStatusCommand(sock, chatId, message) {
    // Future enhancement: .status - More detailed Homelander system report
    // Includes: Laser charge level, Vought server status, Citizen approval rating, etc.
}
*/

module.exports = pingCommand;
