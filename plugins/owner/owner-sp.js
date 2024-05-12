import fs from 'fs';
import path from 'path'; // Import modul path untuk mengelola jalur

let handler = async (m, { text, usedPrefix, command }) => {
    if (!text) throw `uhm.. teksnya mana?\n\npenggunaan:\n${usedPrefix + command} <nama_folder/nama_file>\n\ncontoh:\n${usedPrefix + command} plugins/melcanz.js`
    if (!m.quoted.text) throw `balas pesan nya!`

    // Pisahkan nama folder dan nama berkas
    const [folder, file] = text.split('/');
    if (!folder || !file) throw 'Format nama_folder/nama_file tidak valid.'

    const folderPath = `plugins/${folder}`;
    const filePath = path.join(folderPath, `${file}.js`);
    const code = m.quoted.text;

    // Pastikan folder eksis
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }

    // Simpan teks ke berkas
    fs.writeFileSync(filePath, code);
    m.reply(`Tersimpan di ${filePath}`);
}

handler.help = ['sf'].map(v => v + ' <nama_folder/nama_file>');
handler.tags = ['owner'];
handler.command = /^sp$/i;

handler.rowner = true;
export default handler;
