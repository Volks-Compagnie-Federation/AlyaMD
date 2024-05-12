import cp, { exec as _exec } from 'child_process';
import { promisify } from 'util';
let exec = promisify(_exec).bind(cp);
//const fs = require('fs');
import fs from 'fs'
let handler = async (m, { conn, isROwner, usedPrefix, command, text }) => {
  await m.reply(global.wait);
  if (!isROwner) return;

  // Pisahkan teks menjadi perintah utama dan sisa teks
  const [mainCommand, restText] = text.split(' ');

  switch (mainCommand) {
    case 'i':
      // Menampilkan daftar folder dan file di direktori 'plugins'
      try {
        const items = fs.readdirSync('plugins');
        if (items.length === 0) {
          m.reply("Tidak ada folder atau file ditemukan di direktori 'plugins'.");
        } else {
          const folders = items.filter(item => fs.lstatSync(`plugins/${item}`).isDirectory());
          const files = items.filter(item => !fs.lstatSync(`plugins/${item}`).isDirectory());

          let response = "Folder di direktori 'plugins':\n";
          response += folders.length === 0 ? "Tidak ada folder\n" : folders.join('\n') + '\n';
          response += "File di direktori 'plugins':\n";
          response += files.length === 0 ? "Tidak ada file" : files.join('\n');

          m.reply(response);
        }
      } catch (err) {
        m.reply("Terjadi kesalahan saat mencantumkan folder dan file.");
      }
      break;

    case 'p':
      // Pisahkan sisa teks menjadi folder dan file
      const [folder, file] = restText.split('/');

      // Periksa apakah folder dan file disediakan
      if (!folder) {
        m.reply("Harap berikan nama folder, contoh: 'gp getplugin nama_folder'.");
      } else if (!file) {
        // Menampilkan daftar file dalam folder yang disebutkan
        const folderPath = `plugins/${folder}`;
        try {
          const files = fs.readdirSync(folderPath);
          if (files.length === 0) {
            m.reply(`Tidak ada file yang ditemukan di folder '${folder}'.`);
          } else {
            m.reply(`File dalam folder '${folder}':\n${files.join('\n')}`);
          }
        } catch (err) {
          m.reply(`Folder '${folder}' tidak ditemukan atau terjadi kesalahan.`);
        }
      } else {
        // Menampilkan konten dari file yang disebutkan
        const filePath = `plugins/${folder}/${file}.js`;

        let o;
        try {
          o = await exec('cat ' + filePath);
        } catch (e) {
          o = e;
        } finally {
          let { stdout, stderr } = o;
          if (stdout.trim()) m.reply(stdout);
          if (stderr.trim()) m.reply(stderr);
        }
      }
      break;

    default:
      m.reply(`Perintah tidak dikenali. Perintah yang didukung: 'i', 'p nama_folder', dan 'p nama_folder/nama_file'.`);
  }
}

handler.help = ['getplugin'].map(v => v + ' <text>');
handler.tags = ['owner'];
handler.command = /^(getplugin|gp)$/i;
handler.rowner = true;

export default handler;
