const settings = require("../settings");
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// HOMELANDER IMAGE URLs - Choose one or add your own
const HOMELANDER_IMAGES = {
    profile: "https://i.imgur.com/9qKq7Q9.jpg", // Homelander serious portrait
    laser: "https://i.imgur.com/BV3v6Y7.jpg",   // Homelander laser eyes
    flag: "https://i.imgur.com/L9W5tZr.jpg",    // Homelander with American flag
    smug: "https://i.imgur.com/T5xX8p9.jpg"     // Homelander smug smile
};

async function downloadImage(url, filename) {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const imagePath = path.join(__dirname, '../temp', filename);
        fs.writeFileSync(imagePath, response.data);
        return imagePath;
    } catch (error) {
        console.error('Error downloading image:', error);
        return null;
    }
}

async function aliveCommand(sock, chatId, message) {
    try {
        // 🎯 HOMELANDER ALIVE MESSAGE - 100% Homelander Attitude
        const message1 = `*⚡ HOMELANDER BOT - AMERICA'S HERO*\n` +
                       `*═══════════════════════════*\n\n` +
                       `*🇺🇸 Status:* Perfect. Obviously.\n` +
                       `*⚡ Version:* ${settings.version || '7.7.7'}\n` +
                       `*🎯 Mode:* ${settings.mode || 'Public'}\n` +
                       `*🔴 Laser Readiness:* 100%\n` +
                       `*⭐ Vought Approval:* 98%\n\n` +
                       `*🌟 My Superior Features:*\n` +
                       `• Group Management (I decide who stays)\n` +
                       `• Antilink Protection (My rules)\n` +
                       `• Entertainment (For your amusement)\n` +
                       `• Moderation Tools (My justice)\n` +
                       `• AI Integration (Because I'm advanced)\n\n` +
                       `*💬 Commands:* .menu (if you must)\n\n` +
                       `*Remember: I could disconnect whenever I want.*\n` +
                       `*Your continued access is a privilege.*`;

        // OPTION 1: Send text only (quicker)
        await sock.sendMessage(chatId, {
            text: message1,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363161513685998@newsletter',
                    newsletterName: 'HOMELANDER BOT',
                    serverMessageId: -1
                }
            }
        }, { quoted: message });

        // OPTION 2: Send with Homelander image (more impactful - uncomment to use)
        /*
        try {
            // Download Homelander image
            const imagePath = await downloadImage(HOMELANDER_IMAGES.profile, 'homelander_alive.jpg');
            
            if (imagePath) {
                await sock.sendMessage(chatId, {
                    image: fs.readFileSync(imagePath),
                    caption: message1,
                    contextInfo: {
                        forwardingScore: 999,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363161513685998@newsletter',
                            newsletterName: 'HOMELANDER BOT',
                            serverMessageId: -1
                        }
                    }
                }, { quoted: message });
                
                // Clean up temp file
                fs.unlinkSync(imagePath);
            } else {
                // Fallback to text if image fails
                await sock.sendMessage(chatId, { text: message1 }, { quoted: message });
            }
        } catch (imgError) {
            console.error('Image send failed, using text:', imgError);
            await sock.sendMessage(chatId, { text: message1 }, { quoted: message });
        }
        */

    } catch (error) {
        console.error('Error in alive command:', error);
        // Homelander's arrogant error response
        const errorResponses = [
            "I'm alive. You just can't handle my perfection.",
            "Obviously I'm running. Your error is pathetic.",
            "Homelander is always active. Your connection is the problem."
        ];
        const randomError = errorResponses[Math.floor(Math.random() * errorResponses.length)];
      await sock.sendMessage(chatId, {
    image: fs.readFileSync('./assets/bot_image.jpg'),
    caption: message1
}, { quoted: message });
    }
}

module.exports = aliveCommand;
