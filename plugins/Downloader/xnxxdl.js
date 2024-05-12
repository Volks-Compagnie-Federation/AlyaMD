import fetch from 'node-fetch'

let handler = async (m, { conn, text }) => {
    if (!text) throw 'Masukan Nama Charanya!!'
    let res = await fetch(`https://api.lolhuman.xyz/api/xnxx?apikey=${global.lolkey}&url=${text}`)
    let json = await res.json()

    if (json.status === 200 && json.message === 'success') {
        const result = json.result;
        const title = result.title;
        const thumbnail = result.thumbnail;
        const duration = result.duration;
        const view = result.view;
        const rating = result.rating;
        const like = result.like;
        const dislike = result.dislike;
        const comment = result.comment;
        const tag = result.tag.join(', ');
        const description = result.description;

        const links = result.link;
        const mp4Links = links.filter(link => link.type === 'mp4');
         if (mp4Links.length > 0) {
            const caption = `*Title:* ${title}\n*Duration:* ${duration}\n*Views:* ${view}\n*Rating:* ${rating}\n*Likes:* ${like}\n*Dislikes:* ${dislike}\n*Comments:* ${comment}\n*Tags:* ${tag}\n*Description:* ${description}`;

    for (const mp4Link of mp4Links) {
        let { key } = await conn.sendMessage(m.chat, {
	text: caption,
      contextInfo: {
      externalAdReply: {
	showAdAttribution: true,
	title: `ファイル ・「ムファル」。`,
	body: global.author,
	thumbnail: await (await conn.getFile(thumbnail)).data,
	sourceUrl: `https://처녀 사냥꾼 `,
	mediaType: 1,
	renderLargerThumbnail: true 
	}}}, { quoted: m,ephemeralExpiration: 86400});
        await conn.sendMessage(m.chat, { 
           video: {url: mp4Link.link}, 
           caption: "", 
          }, {quoted: m });
        await conn.sendMessage(m.chat, { delete: key })
            }
        } else {
            conn.reply(m.chat, 'No MP4 video links found.', m);
        }
    } else {
        conn.reply(m.chat, 'An error occurred while fetching the data.', m);
    }
}

handler.help = ['xnxxdl']
handler.tags = ['downloader']
handler.command = /^(xnxxdl)$/i
handler.limit = 900000
export default handler