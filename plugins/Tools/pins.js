import axios from 'axios';

const handler = async (m, { conn, usedPrefix, command, args }) => {
  if (args.length < 1) {
    return conn.reply(m.chat, `Contoh penggunaan: ${usedPrefix}${command} <nama>`, m);
  }

  try {
    const response = await axios.get(`https://backend.shirokamiryzen.repl.co/pinhd?q=${args[0]}`);
    const data = response.data;

    if (!data.pins || data.pins.length === 0) {
      throw 'Tidak ada gambar yang ditemukan.';
    }

    const randomIndex = Math.floor(Math.random() * data.pins.length);
    const randomPin = data.pins[randomIndex];

    if (!randomPin) {
      throw 'Terjadi kesalahan saat memilih gambar.';
    }
    conn.sendFile(m.chat, randomPin, null, command,m)
    //conn.reply(m.chat, randomPin, m);
  } catch (error) {
    console.error(error);
    throw 'Terjadi kesalahan dalam mengambil gambar.';
  }
};
handler.tags = ['tools']
handler.help = handler.command = ['pins']

export default handler;