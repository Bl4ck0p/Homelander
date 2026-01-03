const axios = require('axios');
const { channelInfo } = require('../lib/messageConfig');

// 🎯 HOMELANDER CHARACTER ANALYSIS
// Because only I can truly judge people's worth

// HOMELANDER'S JUDGMENT TRAITS
const HOMELANDER_TRAITS = {
    positive: [
        "Almost Worthy", "Not Completely Pathetic", "Marginally Useful",
        "Barely Acceptable", "Could Be Worse", "Faintly Admirable",
        "Slightly Competent", "Mildly Impressive", "Passably Adequate"
    ],
    negative: [
        "Pathetic", "Utterly Worthless", "Beneath Notice", "Laughably Incompetent",
        "Embarrassingly Weak", "Painfully Mediocre", "Disappointingly Average",
        "Cringe-worthy", "Vought Would Never Hire"
    ],
    neutral: [
        "Exists", "Breathes Oxygen", "Occupies Space", "Consumes Resources",
        "A Citizen", "Part of the Masses", "Statistically Average", "Forgettable"
    ],
    homelanderComparisons: [
        "0.001% as competent as me",
        "Couldn't handle 1 second of my laser vision",
        "Would crumble under my gaze",
        "Not even fit to polish my cape",
        "Makes me appreciate my own perfection more"
    ]
};

// HOMELANDER'S ANALYSIS QUOTES
const HOMELANDER_QUOTES = [
    "*adjusts cape* My analysis is perfect. Obviously.",
    "I could judge you from orbit. But I'm being generous.",
    "Your character is beneath me, but I'll analyze it anyway.",
    "Even my casual judgments are superior to deep analysis.",
    "Vought standards applied. You failed. Obviously."
];

async function characterCommand(sock, chatId, message) {
    let userToAnalyze;
    
    // Check for mentioned users
    if (message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
        userToAnalyze = message.message.extendedTextMessage.contextInfo.mentionedJid[0];
    }
    // Check for replied message
    else if (message.message?.extendedTextMessage?.contextInfo?.participant) {
        userToAnalyze = message.message.extendedTextMessage.contextInfo.participant;
    }
    
    if (!userToAnalyze) {
        await sock.sendMessage(chatId, { 
            text: '⚡ *Mention someone for analysis.*\n\n' +
                 '*Example:* .character @user\n' +
                 '*Or reply to their message.*\n\n' +
                 '*I don\'t have time to guess who you want me to judge.*',
            ...channelInfo 
        });
        return;
    }

    try {
        // Get user's profile picture
        let profilePic;
        try {
            profilePic = await sock.profilePictureUrl(userToAnalyze, 'image');
        } catch {
            // Homelander default image for peasants
            profilePic = 'https://i.imgur.com/2wzGhpF.jpeg';
        }

        // HOMELANDER'S SUPERIOR ANALYSIS ALGORITHM
        const generateHomelanderTraits = () => {
            const traits = [];
            const numTraits = Math.floor(Math.random() * 3) + 2; // 2-4 traits
            
            // Always include at least one negative trait (Homelander's honest)
            traits.push(HOMELANDER_TRAITS.negative[Math.floor(Math.random() * HOMELANDER_TRAITS.negative.length)]);
            
            // Add random mix of other traits
            for (let i = 0; i < numTraits - 1; i++) {
                const traitPool = Math.random() > 0.7 ? HOMELANDER_TRAITS.positive : HOMELANDER_TRAITS.neutral;
                const trait = traitPool[Math.floor(Math.random() * traitPool.length)];
                if (!traits.includes(trait)) {
                    traits.push(trait);
                }
            }
            
            return traits;
        };

        const selectedTraits = generateHomelanderTraits();
        
        // Calculate "Homelander-Approved" percentages (mostly low)
        const traitPercentages = selectedTraits.map(trait => {
            let percentage;
            if (HOMELANDER_TRAITS.negative.includes(trait)) {
                percentage = Math.floor(Math.random() * 30) + 5; // 5-35% for negatives
            } else if (HOMELANDER_TRAITS.positive.includes(trait)) {
                percentage = Math.floor(Math.random() * 30) + 40; // 40-70% for "positives"
            } else {
                percentage = Math.floor(Math.random() * 30) + 20; // 20-50% for neutrals
            }
            return `• ${trait}: ${percentage}%`;
        });

        // Add Homelander comparison
        const comparison = HOMELANDER_TRAITS.homelanderComparisons[Math.floor(Math.random() * HOMELANDER_TRAITS.homelanderComparisons.length)];
        
        // Overall rating (Homelander is harsh)
        const overallRating = Math.floor(Math.random() * 40) + 30; // 30-70%

        // Homelander's signature quote
        const homelanderQuote = HOMELANDER_QUOTES[Math.floor(Math.random() * HOMELANDER_QUOTES.length)];

        // 🎯 HOMELANDER'S CHARACTER ANALYSIS
        const analysis = `⚡ *HOMELANDER CHARACTER ANALYSIS* ⚡\n` +
                       `*═══════════════════════════════*\n\n` +
                       `👤 *Subject:* ${userToAnalyze.split('@')[0]}\n` +
                       `🔍 *Analysis ID:* HL-${Date.now().toString().slice(-6)}\n` +
                       `🏢 *Vought Standard:* Applied\n\n` +
                       `📊 *JUDGMENT METRICS:*\n${traitPercentages.join('\n')}\n\n` +
                       `⭐ *Overall Worthiness:* ${overallRating}%\n` +
                       `⚡ *Homelander Comparison:* ${comparison}\n\n` +
                       `💬 *HOMELANDER'S VERDICT:*\n"${homelanderQuote}"\n\n` +
                       `⚠️ *Note:* This analysis is final. Appeals will be ignored.`;

        // Send with Homelander's superior presentation
        await sock.sendMessage(chatId, {
            image: { url: profilePic },
            caption: analysis,
            mentions: [userToAnalyze],
            contextInfo: {
                ...channelInfo.contextInfo,
                externalAdReply: {
                    title: "Vought International Analysis",
                    body: "Homelander's Superior Judgment",
                    thumbnail: { url: 'https://i.imgur.com/9qKq7Q9.jpg' }, // Homelander thumbnail
                    sourceUrl: "https://vought-international.com",
                    mediaType: 1
                }
            }
        });

        // Optional: Follow-up with laser eyes threat for low ratings
        if (overallRating < 50) {
            setTimeout(async () => {
                await sock.sendMessage(chatId, {
                    text: `*Laser eyes glow* Rating below 50%? I could fix that. Permanently.`,
                    mentions: [userToAnalyze]
                });
            }, 2000);
        }

    } catch (error) {
        console.error('Error in character command:', error);
        
        // Homelander's arrogant error response
        const errorResponses = [
            "❌ Analysis failed. *scoffs* The subject wasn't worth analyzing anyway.",
            "❌ Could not analyze. *adjusts cape* Probably for the best - I'd only be disappointed.",
            "❌ Technical error. *laser eyes flicker* My systems are perfect, so it must be your fault."
        ];
        
        await sock.sendMessage(chatId, { 
            text: errorResponses[Math.floor(Math.random() * errorResponses.length)],
            ...channelInfo 
        });
    }
}

// 🎯 ADDITIONAL HOMELANDER COMMAND IDEAS:
/*
// For future enhancement:
async function homelanderJudgeCommand(sock, chatId, message) {
    // Command: .judge @user - More harsh version
    // Includes laser eye threat level, Vought employment potential, etc.
}

async function compareToHomelanderCommand(sock, chatId, message) {
    // Command: .compare @user - Shows percentage comparison to Homelander
    // Spoiler: Everyone gets 0.0001%
}
*/

module.exports = characterCommand;
