const settings = require('../settings');
const fs = require('fs');
const path = require('path');

async function helpCommand(sock, chatId, message) {
    // 🎯 HOMELANDER'S SUPERIOR COMMAND MENU
    const helpMessage = `
╔══════════════════════════════════╗
        ⚡ *HOMELANDER BOT* ⚡
   *America's Hero. The Upgrade.*
   *Version: ${settings.version || '7.7.7'}*
   *Vought International Approved*
╚══════════════════════════════════╝

*Remember: My commands are a privilege, not a right.*

╔══════════════════════════════════╗
⚡ *BASIC COMMANDS (For Peasants)*:
╠══════════════════════════════════╣
║ ➤ .help - This menu (if you must)
║ ➤ .ping - Test if I care (I don't)
║ ➤ .alive - My perfection status
║ ➤ .owner - Learn about Vought execs
║ ➤ .quote - My superior wisdom
║ ➤ .fact - Facts filtered through my ego
║ ➤ .weather <city> - Climate data
║ ➤ .news - What I allow you to know
║ ➤ .attp <text> - Animated text
║ ➤ .lyrics <song> - Musical distraction
║ ➤ .8ball <question> - My judgment
║ ➤ .groupinfo - Group analysis
║ ➤ .staff - Current leadership
║ ➤ .trt <text> <lang> - Translation
║ ➤ .ss <link> - Screenshot
║ ➤ .jid - Group identification
║ ➤ .url - Link utilities
╚══════════════════════════════════╝ 

╔══════════════════════════════════╗
👮‍♂️ *GROUP CONTROL (My Justice)*:
╠══════════════════════════════════╣
║ ➤ .ban @user - Exile the unworthy
║ ➤ .promote @user - Grant authority
║ ➤ .demote @user - Revoke privilege
║ ➤ .mute <minutes> - Silence peasants
║ ➤ .unmute - Allow speech (for now)
║ ➤ .delete - Remove inferior messages
║ ➤ .kick @user - Remove from presence
║ ➤ .warn @user - Official warning
║ ➤ .warnings @user - Check violations
║ ➤ .antilink - My link policies
║ ➤ .antibadword - Language control
║ ➤ .clear - Purge chat
║ ➤ .tag <message> - Address masses
║ ➤ .tagall - Mass notification
║ ➤ .tagnotadmin - Tag non-leaders
║ ➤ .hidetag <message> - Stealth command
║ ➤ .chatbot - Enable my conversation
║ ➤ .resetlink - New group invite
║ ➤ .antitag <on/off> - Tag protection
║ ➤ .welcome <on/off> - Entry protocols
║ ➤ .goodbye <on/off> - Exit protocols
║ ➤ .setgdesc <text> - Group description
║ ➤ .setgname <text> - Rename group
║ ➤ .setgpp - Set group image
╚══════════════════════════════════╝

╔══════════════════════════════════╗
🔒 *VOUGHT EXECUTIVE COMMANDS*:
╠══════════════════════════════════╣
║ ➤ .mode <public/private> - Access control
║ ➤ .clearsession - Reset connection
║ ➤ .antidelete - Message preservation
║ ➤ .cleartmp - Clean temporary files
║ ➤ .update - System upgrades
║ ➤ .settings - Configuration
║ ➤ .setpp - Set my perfect profile
║ ➤ .autoreact <on/off> - Auto-reactions
║ ➤ .autostatus <on/off> - Status updates
║ ➤ .autotyping <on/off> - Typing simulation
║ ➤ .autoread <on/off> - Read receipts
║ ➤ .anticall <on/off> - Call blocking
║ ➤ .pmblocker <on/off/status> - DM control
║ ➤ .pmblocker setmsg <text> - Block message
║ ➤ .setmention - Set mention response
║ ➤ .mention <on/off> - Mention detection
╚══════════════════════════════════╝

╔══════════════════════════════════╗
🎨 *MEDIA MANIPULATION (My Artistry)*:
╠══════════════════════════════════╣
║ ➤ .blur <image> - Obscure content
║ ➤ .simage <sticker> - Sticker to image
║ ➤ .sticker <image> - Image to sticker
║ ➤ .removebg - Background removal
║ ➤ .remini - Image enhancement
║ ➤ .crop <image> - Image cropping
║ ➤ .tgsticker <Link> - Telegram stickers
║ ➤ .meme - Humor (inferior to mine)
║ ➤ .take <packname> - Acquire stickers
║ ➤ .emojimix <emj1>+<emj2> - Emoji fusion
║ ➤ .igs <insta link> - Instagram stories
║ ➤ .igsc <insta link> - IG highlights
╚══════════════════════════════════╝  

╔══════════════════════════════════╗
🖼️ *PIES COMMANDS (For Diversion)*:
╠══════════════════════════════════╣
║ ➤ .pies <country> - Country images
║ ➤ .china - Chinese imagery
║ ➤ .indonesia - Indonesian visuals
║ ➤ .japan - Japanese content
║ ➤ .korea - Korean media
║ ➤ .hijab - Cultural images
╚══════════════════════════════════╝

╔══════════════════════════════════╗
🎮 *ENTERTAINMENT (Your Distraction)*:
╠══════════════════════════════════╣
║ ➤ .tictactoe @user - Strategy game
║ ➤ .hangman - Word game
║ ➤ .guess <letter> - Letter guessing
║ ➤ .trivia - Knowledge test
║ ➤ .answer <answer> - Trivia response
║ ➤ .truth - Truth challenge
║ ➤ .dare - Dare challenge
║ ➤ .rank - Rank Up
╚══════════════════════════════════╝

╔══════════════════════════════════╗
🤖 *ARTIFICIAL INTELLIGENCE (My Brain)*:
╠══════════════════════════════════╣
║ ➤ .gpt <question> - ChatGPT queries
║ ➤ .gemini <question> - Gemini AI
║ ➤ .imagine <prompt> - Image generation
║ ➤ .flux <prompt> - Advanced imaging
║ ➤ .sora <prompt> - Video generation
╚══════════════════════════════════╝

╔══════════════════════════════════╗
🎯 *SOCIAL INTERACTION (My Judgment)*:
╠══════════════════════════════════╣
║ ➤ .compliment @user - Praise (rare)
║ ➤ .insult @user - Honest assessment
║ ➤ .flirt - Romantic interaction
║ ➤ .shayari - Poetic expression
║ ➤ .goodnight - Sleep wishes
║ ➤ .roseday - Romantic day
║ ➤ .character @user - Personality analysis
║ ➤ .wasted @user - GTA-style image
║ ➤ .ship @user - Relationship analysis
║ ➤ .simp @user - Simp detection
║ ➤ .stupid @user [text] - Intelligence test
╚══════════════════════════════════╝

╔══════════════════════════════════╗
🔤 *TEXT STYLIZATION (My Aesthetics)*:
╠══════════════════════════════════╣
║ ➤ .metallic <text> - Metal text
║ ➤ .ice <text> - Icy text
║ ➤ .snow <text> - Snowy text
║ ➤ .impressive <text> - Impressive style
║ ➤ .matrix <text> - Matrix style
║ ➤ .light <text> - Light text
║ ➤ .neon <text> - Neon glow
║ ➤ .devil <text> - Devilish style
║ ➤ .purple <text> - Purple text
║ ➤ .thunder <text> - Thunder effect
║ ➤ .leaves <text> - Leaf style
║ ➤ .1917 <text> - Vintage style
║ ➤ .arena <text> - Arena style
║ ➤ .hacker <text> - Hacker text
║ ➤ .sand <text> - Sandy text
║ ➤ .blackpink <text> - K-pop style
║ ➤ .glitch <text> - Glitch effect
║ ➤ .fire <text> - Fire text
╚══════════════════════════════════╝

╔══════════════════════════════════╗
📥 *CONTENT ACQUISITION (My Collection)*:
╠══════════════════════════════════╣
║ ➤ .play <song_name> - Audio search
║ ➤ .song <song_name> - Music download
║ ➤ .spotify <query> - Spotify search
║ ➤ .instagram <link> - IG download
║ ➤ .facebook <link> - FB download
║ ➤ .tiktok <link> - TikTok download
║ ➤ .video <song name> - Video search
║ ➤ .ytmp4 <Link> - YouTube video DL
╚══════════════════════════════════╝

╔══════════════════════════════════╗
🧩 *MISCELLANEOUS (My Whims)*:
╠══════════════════════════════════╣
║ ➤ .heart - Heart effect
║ ➤ .horny - NSFW detection
║ ➤ .circle - Circular image
║ ➤ .lgbt - Pride effects
║ ➤ .lolice - Anime police
║ ➤ .its-so-stupid - Stupidity meter
║ ➤ .namecard - Name card creation
║ ➤ .oogway - Master Oogway wisdom
║ ➤ .tweet - Twitter-style post
║ ➤ .ytcomment - YouTube comment
║ ➤ .comrade - Communist effect
║ ➤ .gay - Rainbow effect
║ ➤ .glass - Glass effect
║ ➤ .jail - Jail effect
║ ➤ .passed - "Wasted" effect
║ ➤ .triggered - Triggered effect
╚══════════════════════════════════╝

╔══════════════════════════════════╗
🖼️ *ANIME (Inferior Animation)*:
╠══════════════════════════════════╣
║ ➤ .nom - Eating animation
║ ➤ .poke - Poking animation
║ ➤ .cry - Crying animation
║ ➤ .kiss - Kissing animation
║ ➤ .pat - Patting animation
║ ➤ .hug - Hugging animation
║ ➤ .wink - Winking animation
║ ➤ .facepalm - Facepalm reaction
╚══════════════════════════════════╝

╔══════════════════════════════════╗
💻 *VOUGHT SYSTEMS (My Infrastructure)*:
╠══════════════════════════════════╣
║ ➤ .git - GitHub information
║ ➤ .github - GitHub profile
║ ➤ .sc - Source code
║ ➤ .script - Script details
║ ➤ .repo - Repository link
╚══════════════════════════════════╝

*Your continued access to my commands is a privilege.*
*Vought International reserves the right to revoke access at any time.*
*America's Hero is watching. ⚡🇺🇸*`;

    try {
        // 🖼️ HOMELANDER PROFILE IMAGE
        const homelanderImagePath = path.join(__dirname, '../assets/homelander_profile.jpg');
        const defaultImagePath = path.join(__dirname, '../assets/bot_image.jpg');
        
        let imageBuffer;
        let imagePathUsed;
        
        // Try Homelander image first, then default
        if (fs.existsSync(homelanderImagePath)) {
            imageBuffer = fs.readFileSync(homelanderImagePath);
            imagePathUsed = 'homelander_profile.jpg';
        } else if (fs.existsSync(defaultImagePath)) {
            imageBuffer = fs.readFileSync(defaultImagePath);
            imagePathUsed = 'bot_image.jpg';
        } else {
            // If no image exists, create a simple one or use URL
            console.log('No bot image found. Using text-only menu.');
        }

        if (imageBuffer) {
            // Send with Homelander's superior presentation
            await sock.sendMessage(chatId, {
                image: imageBuffer,
                caption: helpMessage,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363161513685998@newsletter',
                        newsletterName: 'HOMELANDER BOT - Vought International',
                        serverMessageId: -1
                    },
                    externalAdReply: {
                        title: "⚡ HOMELANDER BOT",
                        body: "America's Hero - Command Menu",
                        thumbnail: imageBuffer,
                        sourceUrl: "https://vought-international.com",
                        mediaType: 1,
                        previewType: 0,
                        renderLargerThumbnail: true
                    }
                }
            }, { quoted: message });
            
            console.log(`✅ Homelander help menu sent with image: ${imagePathUsed}`);
        } else {
            // Fallback to text-only (still arrogant)
            console.log('📄 Sending text-only help menu (no image found)');
            await sock.sendMessage(chatId, { 
                text: helpMessage,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363161513685998@newsletter',
                        newsletterName: 'HOMELANDER BOT - America\'s Hero',
                        serverMessageId: -1
                    }
                }
            });
        }
        
        // Optional: Follow-up message with Homelander attitude
        setTimeout(async () => {
            try {
                const followUps = [
                    "*Remember: I could remove these commands anytime I want.*",
                    "*Your usage of my commands has been logged with Vought.*",
                    "*I'm perfect. These commands are perfect. Obviously.*",
                    "*Make sure to use my commands properly. Or don't. I don't care.*"
                ];
                const randomFollowUp = followUps[Math.floor(Math.random() * followUps.length)];
                
                await sock.sendMessage(chatId, {
                    text: randomFollowUp
                });
            } catch (e) {
                // Ignore follow-up errors
            }
        }, 3000);

    } catch (error) {
        console.error('Error in Homelander help command:', error);
        
        // Homelander's arrogant error response
        const errorResponses = [
            "*My perfect menu failed to load. *sighs* Your device is probably the problem.*",
            "*Even my superior systems encounter peasant technology issues. Try again.*",
            "*Menu error. *adjusts cape* I could fix it, but I'm busy being perfect.*"
        ];
        
        try {
            await sock.sendMessage(chatId, { 
                text: errorResponses[Math.floor(Math.random() * errorResponses.length)]
            });
        } catch (sendError) {
            console.error('Failed to send error message:', sendError);
        }
    }
}

module.exports = helpCommand;
