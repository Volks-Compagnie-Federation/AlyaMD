import fs from 'fs';
import archiver from 'archiver';

let handler = async (m, { conn, text }) => {
  if (!text) {
    m.reply('Mohon berikan nama folder yang akan di-zip');
    return;
  }

  const folderName = `${text}`;
  const zipFileName = `${folderName}.zip`;

  try {
    m.reply('Tunggu sebentar, sedang membuat zip file...');
    
    // Membuat writable stream untuk zip file
    const output = fs.createWriteStream(zipFileName);
    const archive = archiver('zip', {
      zlib: { level: 9 } // Level kompresi tertinggi
    });

    // Menghubungkan stream archive dengan output stream
    archive.pipe(output);

    // Menambahkan folder ke dalam zip file
    archive.directory(folderName, false);

    // Menyelesaikan proses zip dan mengirimkannya
    archive.finalize();

    // Mengirim zip file sebagai dokumen
    conn.sendMessage(m.chat, { document: zipFileName, mimetype: 'application/octet-stream', fileName: zipFileName }, { quoted: m });
  } catch (error) {
    console.error(error);
    m.reply('Terjadi kesalahan dalam membuat zip file');
  }
};

handler.help = ['zipfolder <namafolder>'];
handler.tags = ['owner'];
handler.command = /^(getf)$/i;
handler.rowner = true;

export default handler;