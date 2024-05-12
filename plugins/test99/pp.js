import fetch from "node-fetch";

const characterList = ["nino", "miku", "paimon", "klee", "erza", "luffy", "robin"];

const handler = async (m, { conn, text, command }) => {
  // try {
    const parts = text.split(" ");
    const character = parts[0]; 
    const charaName = characterList.includes(character) ? character : "nino";

    const userText = parts.slice(1).join(" ");

    if (!userText) return m.reply("Ketik .cai <nama_karakter> <teks>");

    const apiUrl = `https://api-charaai.vercel.app/charaai?chara=${capitalizeFirstLetter(charaName)}&text=${userText}`;
    
    const response = await fetch(apiUrl);

    if (response.ok) {
      const data = await response.json();
      if (data) {
        conn.sendMessage(m.chat, {
    text: data,
    contextInfo: {
    externalAdReply: {
    showAdAttribution: true,
    title: "Character AI",
    body: wm,
    mediaType: 1,
    sourceUrl: 'https://beta.character.ai/',
    thumbnailUrl: 'https://telegra.ph/file/598cecd21724b59b705c4.jpg',
    renderLargerThumbnail: true
    }}}, { quoted: m });
      } else {
        m.reply("Tidak ada hasil yang ditemukan.");
      }
    } else {
      m.reply("Terjadi kesalahan saat mengambil data dari API.");
    }
  /*} catch (e) {
    m.reply("Terjadi kesalahan dalam mengambil data.");
    console.error(e);
  }*/
};
handler.help = ["cai"];
handler.tags = ["ai"];
handler.command = ["cai"];

export default handler;

function capitalizeFirstLetter(str) {
  // Memisahkan string menjadi array kata-kata
  let words = str.split(" ");
  
  // Loop melalui setiap kata
  for (let i = 0; i < words.length; i++) {
    // Ubah huruf pertama dalam setiap kata menjadi besar
    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
  }
  
  // Gabungkan kembali kata-kata menjadi satu string
  return words.join(" ");
}