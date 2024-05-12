import fetch from "node-fetch"
import fs from "fs"
import { pickRandom } from "../../lib/other-function.js"

let handler = async (m, { conn, usedPrefix, text, args, command }) => {
let aa = pickRandom(global.AraChu2)
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let name = await conn.getName(who)
await conn.sendContact(m.chat, [[`${nomorown}` + `@s.whatsapp.net`, wm]], m, {
 contextInfo: { 
 externalAdReply: {  
 title: 'OnLasdan', 
 body: bottime, 
 sourceUrl: 'http://バージニティハンター',
 thumbnail: await fs.readFileSync("./thumbnail.jpg"),
 thumbnailUrl: aa, 
 mediaType: 1,
 showAdAttribution: true, 
 renderLargerThumbnail: true 
 }
   }
     },
       {
         quoted: m,
         ephemeralExpiration: ephemeral
           }
             );
} 
handler.help = ['owner']
handler.tags = ['misc']

handler.command = /^(owner)$/i

export default handler