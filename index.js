/**
 * HOMELANDER BOT - America's Hero. The Upgrade.
 * Copyright (c) 2024 Vought International
 * 
 * You don't have permission to modify this. I could stop you if I wanted to.
 * Terms: Vought Proprietary License - You're welcome for my service.
 * 
 * Credits:
 * - Modified from inferior code by lesser beings
 * - Enhanced by Homelander's perfection
 */
require('./settings')
const { Boom } = require('@hapi/boom')
const fs = require('fs')
const chalk = require('chalk')
const FileType = require('file-type')
const path = require('path')
const axios = require('axios')
const { handleMessages, handleGroupParticipantUpdate, handleStatus } = require('./main');
const PhoneNumber = require('awesome-phonenumber')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./lib/exif')
const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetch, await, sleep, reSize } = require('./lib/myfunc')
const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    generateForwardMessageContent,
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    generateMessageID,
    downloadContentFromMessage,
    jidDecode,
    proto,
    jidNormalizedUser,
    makeCacheableSignalKeyStore,
    delay
} = require("@whiskeysockets/baileys")
const NodeCache = require("node-cache")
// Using a lightweight persisted store instead of makeInMemoryStore (compat across versions)
const pino = require("pino")
const readline = require("readline")
const { parsePhoneNumber } = require("libphonenumber-js")
const { PHONENUMBER_MCC } = require('@whiskeysockets/baileys/lib/Utils/generics')
const { rmSync, existsSync } = require('fs')
const { join } = require('path')

// Import lightweight store
const store = require('./lib/lightweight_store')

// Initialize store
store.readFromFile()
const settings = require('./settings')
setInterval(() => store.writeToFile(), settings.storeWriteInterval || 10000)

// Memory optimization - Force garbage collection if available
setInterval(() => {
    if (global.gc) {
        global.gc()
        console.log(chalk.red('🧹 *scoffs* Even my garbage collection is perfect.'))
    }
}, 60_000) // every 1 minute

// Memory monitoring - Restart if RAM gets too high
setInterval(() => {
    const used = process.memoryUsage().rss / 1024 / 1024
    if (used > 400) {
        console.log(chalk.yellow('⚠️ RAM too high (>400MB), restarting... I could handle it, but I don\'t want to.'))
        process.exit(1) // Panel will auto-restart
    }
}, 30_000) // check every 30 seconds

let phoneNumber = "911234567890"
let owner = JSON.parse(fs.readFileSync('./data/owner.json'))

// 🎯 HOMELANDER IDENTITY INJECTION
global.botname = "HOMELANDER BOT"
global.themeemoji = "⚡"
global.homelanderQuotes = [
    "I could do whatever I want.",
    "I'm not a hero. I'm the upgrade.",
    "Patriotism is just good branding.",
    "The whole country depends on me. Obviously.",
    "It's not about justice. It's about what sells.",
    "People are like cockroaches. They scatter when the light hits them."
]

const pairingCode = !!phoneNumber || process.argv.includes("--pairing-code")
const useMobile = process.argv.includes("--mobile")

// Only create readline interface if we're in an interactive environment
const rl = process.stdin.isTTY ? readline.createInterface({ input: process.stdin, output: process.stdout }) : null
const question = (text) => {
    if (rl) {
        return new Promise((resolve) => rl.question(text, resolve))
    } else {
        // In non-interactive environment, use ownerNumber from settings
        return Promise.resolve(settings.ownerNumber || phoneNumber)
    }
}


async function startHomelanderBot() {
    try {
        let { version, isLatest } = await fetchLatestBaileysVersion()
        const { state, saveCreds } = await useMultiFileAuthState(`./session`)
        const msgRetryCounterCache = new NodeCache()

        const HomelanderBot = makeWASocket({
            version,
            logger: pino({ level: 'silent' }),
            printQRInTerminal: !pairingCode,
            browser: ["Vought HQ", "Chrome", "7.7.7"], // Homelander's version
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
            },
            markOnlineOnConnect: true,
            generateHighQualityLinkPreview: true,
            syncFullHistory: false,
            getMessage: async (key) => {
                let jid = jidNormalizedUser(key.remoteJid)
                let msg = await store.loadMessage(jid, key.id)
                return msg?.message || ""
            },
            msgRetryCounterCache,
            defaultQueryTimeoutMs: 60000,
            connectTimeoutMs: 60000,
            keepAliveIntervalMs: 10000,
        })

        // Save credentials when they update
        HomelanderBot.ev.on('creds.update', saveCreds)

    store.bind(HomelanderBot.ev)

    // Message handling - With Homelander's arrogance
    HomelanderBot.ev.on('messages.upsert', async chatUpdate => {
        try {
            const mek = chatUpdate.messages[0]
            if (!mek.message) return
            mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
            if (mek.key && mek.key.remoteJid === 'status@broadcast') {
                await handleStatus(HomelanderBot, chatUpdate);
                return;
            }
            // In private mode, only block non-group messages (allow groups for moderation)
            if (!HomelanderBot.public && !mek.key.fromMe && chatUpdate.type === 'notify') {
                const isGroup = mek.key?.remoteJid?.endsWith('@g.us')
                if (!isGroup) {
                    // Homelander-style rejection
                    await HomelanderBot.sendMessage(mek.key.remoteJid, {
                        text: 'Your messages are beneath me. *adjusts cape* Try a group chat, peasant.'
                    }).catch(console.error);
                    return;
                }
            }
            if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return

            // Clear message retry cache to prevent memory bloat
            if (HomelanderBot?.msgRetryCounterCache) {
                HomelanderBot.msgRetryCounterCache.clear()
            }

            try {
                await handleMessages(HomelanderBot, chatUpdate, true)
            } catch (err) {
                console.error("Error in handleMessages:", err)
                // Homelander's arrogant error message
                if (mek.key && mek.key.remoteJid) {
                    const errorResponses = [
                        "Pathetic. You broke something. *scoffs*",
                        "Even my errors are perfect. You just can't handle perfection.",
                        "I could fix this instantly, but watching you struggle is more fun.",
                        "Vought technical support has been notified. Not that they can do anything I can't."
                    ];
                    await HomelanderBot.sendMessage(mek.key.remoteJid, {
                        text: errorResponses[Math.floor(Math.random() * errorResponses.length)],
                        contextInfo: {
                            forwardingScore: 1,
                            isForwarded: true,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: '120363161513685998@newsletter',
                                newsletterName: 'Homelander Bot',
                                serverMessageId: -1
                            }
                        }
                    }).catch(console.error);
                }
            }
        } catch (err) {
            console.error("Error in messages.upsert:", err)
        }
    })

    // Add these event handlers for better functionality
    HomelanderBot.decodeJid = (jid) => {
        if (!jid) return jid
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {}
            return decode.user && decode.server && decode.user + '@' + decode.server || jid
        } else return jid
    }

    HomelanderBot.ev.on('contacts.update', update => {
        for (let contact of update) {
            let id = HomelanderBot.decodeJid(contact.id)
            if (store && store.contacts) store.contacts[id] = { id, name: contact.notify }
        }
    })

    HomelanderBot.getName = (jid, withoutContact = false) => {
        id = HomelanderBot.decodeJid(jid)
        withoutContact = HomelanderBot.withoutContact || withoutContact
        let v
        if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
            v = store.contacts[id] || {}
            if (!(v.name || v.subject)) v = HomelanderBot.groupMetadata(id) || {}
            resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
        })
        else v = id === '0@s.whatsapp.net' ? {
            id,
            name: 'WhatsApp'
        } : id === HomelanderBot.decodeJid(HomelanderBot.user.id) ?
            HomelanderBot.user :
            (store.contacts[id] || {})
        return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
    }

    HomelanderBot.public = true

    HomelanderBot.serializeM = (m) => smsg(HomelanderBot, m, store)

    // Handle pairing code - Homelander style
    if (pairingCode && !HomelanderBot.authState.creds.registered) {
        if (useMobile) throw new Error('Cannot use pairing code with mobile api')

        let phoneNumber
        if (!!global.phoneNumber) {
            phoneNumber = global.phoneNumber
        } else {
            phoneNumber = await question(chalk.bgBlack(chalk.redBright(`⚡ STATE YOUR NUMBER, CITIZEN\nFormat: 6281376552730 (without + or spaces) : `)))
        }

        // Clean the phone number - remove any non-digit characters
        phoneNumber = phoneNumber.replace(/[^0-9]/g, '')

        // Validate the phone number using awesome-phonenumber
        const pn = require('awesome-phonenumber');
        if (!pn('+' + phoneNumber).isValid()) {
            console.log(chalk.red('Invalid phone number. Pathetic. Try again with a proper international number.'));
            process.exit(1);
        }

        setTimeout(async () => {
            try {
                let code = await HomelanderBot.requestPairingCode(phoneNumber)
                code = code?.match(/.{1,4}/g)?.join("-") || code
                console.log(chalk.black(chalk.bgRed(`⚡ YOUR PAIRING CODE (You're welcome) : `)), chalk.black(chalk.white(code)))
                console.log(chalk.yellow(`\nI could connect instantly, but you need to prove yourself:\n1. Open WhatsApp\n2. Settings > Linked Devices\n3. Tap "Link a Device"\n4. Enter the code above\n\nMake it quick.`))
            } catch (error) {
                console.error('Error requesting pairing code:', error)
                console.log(chalk.red('Failed. Are you even trying? Check your number.'))
            }
        }, 3000)
    }

    // Connection handling - Homelander's ego on display
    HomelanderBot.ev.on('connection.update', async (s) => {
        const { connection, lastDisconnect, qr } = s
        
        if (qr) {
            console.log(chalk.red('⚡ QR Code generated. Scan it if you must.'))
        }
        
        if (connection === 'connecting') {
            console.log(chalk.yellow('🔄 Connecting to WhatsApp... I could do this faster if I wanted.'))
        }
        
        if (connection == "open") {
            console.log(chalk.magenta(` `))
            console.log(chalk.red(`⚡ CONNECTED AS => ` + JSON.stringify(HomelanderBot.user, null, 2)))

            try {
                const botNumber = HomelanderBot.user.id.split(':')[0] + '@s.whatsapp.net';
                // Homelander's connection announcement
                const welcomeMessages = [
                    `⚡ HOMELANDER BOT ACTIVATED\n\n⏰ Time: ${new Date().toLocaleString()}\n✅ Status: Perfect, as always\n🇺🇸 Patriotism: Maximum\n\nRemember: I could disconnect whenever I want.`,
                    `America's Hero is online.\n\n${new Date().toLocaleString()}\nLaser readiness: 100%\nEgo level: Maximum\n\n*adjusts American flag pin*`,
                    `The Upgrade is here.\n\nConnection established at ${new Date().toLocaleString()}\nVought systems: Operational\nYour admiration: Expected`
                ];
                
                await HomelanderBot.sendMessage(botNumber, {
                    text: welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)],
                    contextInfo: {
                        forwardingScore: 1,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363161513685998@newsletter',
                            newsletterName: 'Homelander Bot',
                            serverMessageId: -1
                        }
                    }
                });
            } catch (error) {
                console.error('Error sending connection message:', error.message)
            }

            await delay(1999)
            console.log(chalk.red(`\n\n                  ${chalk.bold.white(`[ ${global.botname || 'HOMELANDER BOT'} ]`)}\n`))
            console.log(chalk.blue(`< ======== ⚡ AMERICA'S HERO IS ONLINE ⚡ ======== >`))
            console.log(chalk.white(`\n${global.themeemoji || '⚡'} I could do whatever I want. And nobody could stop me.`))
            console.log(chalk.white(`${global.themeemoji || '⚡'} Vought International - We make heroes.`))
            console.log(chalk.white(`${global.themeemoji || '⚡'} Status: Perfect. Obviously.`))
            console.log(chalk.white(`${global.themeemoji || '⚡'} Laser eyes: Ready`))
            console.log(chalk.green(`${global.themeemoji || '⚡'} 🤖 Homelander Bot Activated Successfully!`))
            console.log(chalk.blue(`Bot Version: ${settings.version || '7.7.7'}`))
            console.log(chalk.red(`Remember: Your gratitude is expected.`))
        }
        
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut
            const statusCode = lastDisconnect?.error?.output?.statusCode
            
            console.log(chalk.red(`Connection closed. ${lastDisconnect?.error ? 'Some inferior system failed.' : 'I got bored.'}`))
            
            if (statusCode === DisconnectReason.loggedOut || statusCode === 401) {
                try {
                    rmSync('./session', { recursive: true, force: true })
                    console.log(chalk.yellow('Session deleted. Prove yourself worthy again.'))
                } catch (error) {
                    console.error('Error deleting session:', error)
                }
                console.log(chalk.red('Logged out. Your loyalty has been noted.'))
            }
            
            if (shouldReconnect) {
                console.log(chalk.yellow('Reconnecting... *sighs* Fine.'))
                await delay(5000)
                startHomelanderBot()
            }
        }
    })

    // Track recently-notified callers to avoid spamming messages
    const antiCallNotified = new Set();

    // Anticall handler: block callers when enabled - Homelander style
    HomelanderBot.ev.on('call', async (calls) => {
        try {
            const { readState: readAnticallState } = require('./commands/anticall');
            const state = readAnticallState();
            if (!state.enabled) return;
            for (const call of calls) {
                const callerJid = call.from || call.peerJid || call.chatId;
                if (!callerJid) continue;
                try {
                    // First: attempt to reject the call if supported
                    try {
                        if (typeof HomelanderBot.rejectCall === 'function' && call.id) {
                            await HomelanderBot.rejectCall(call.id, callerJid);
                        } else if (typeof HomelanderBot.sendCallOfferAck === 'function' && call.id) {
                            await HomelanderBot.sendCallOfferAck(call.id, callerJid, 'reject');
                        }
                    } catch {}

                    // Notify the caller only once within a short window
                    if (!antiCallNotified.has(callerJid)) {
                        antiCallNotified.add(callerJid);
                        setTimeout(() => antiCallNotified.delete(callerJid), 60000);
                        await HomelanderBot.sendMessage(callerJid, { 
                            text: '📵 Your call was rejected. *eyes glow red* I could laser you for this insolence.' 
                        });
                    }
                } catch {}
                // Then: block after a short delay to ensure rejection and message are processed
                setTimeout(async () => {
                    try { await HomelanderBot.updateBlockStatus(callerJid, 'block'); } catch {}
                }, 800);
            }
        } catch (e) {
            // ignore
        }
    });

    HomelanderBot.ev.on('group-participants.update', async (update) => {
        await handleGroupParticipantUpdate(HomelanderBot, update);
    });

    HomelanderBot.ev.on('messages.upsert', async (m) => {
        if (m.messages[0].key && m.messages[0].key.remoteJid === 'status@broadcast') {
            await handleStatus(HomelanderBot, m);
        }
    });

    HomelanderBot.ev.on('status.update', async (status) => {
        await handleStatus(HomelanderBot, status);
    });

    HomelanderBot.ev.on('messages.reaction', async (status) => {
        await handleStatus(HomelanderBot, status);
    });

    return HomelanderBot
    } catch (error) {
        console.error('Error in startHomelanderBot:', error)
        console.log(chalk.yellow('Even perfection has setbacks. Rebooting...'))
        await delay(5000)
        startHomelanderBot()
    }
}


// Start the bot with error handling
startHomelanderBot().catch(error => {
    console.error('Fatal error:', error)
    console.log(chalk.red('I could recover from this. But I won\'t.'))
    process.exit(1)
})
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err)
    console.log(chalk.yellow('Pathetic error. Moving on.'))
})

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err)
    console.log(chalk.yellow('Rejected? How ironic.'))
})

let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.red(`Update detected. *adjusts cape* Refreshing...`))
    delete require.cache[file]
    require(file)
})
