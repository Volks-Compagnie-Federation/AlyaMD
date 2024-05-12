const approvedRequests = []; // Inisialisasi array untuk menyimpan permintaan yang disetujui
const rejectedRequests = []; // Inisialisasi array untuk menyimpan permintaan yang ditolak

const handler = async (m, { conn, args, usedPrefix, command }) => {
  const groupId = m.chat;
  try {
    // Ambil daftar permintaan bergabung di awal fungsi
    const joinRequestList = await conn.groupRequestParticipantsList(groupId);

    switch (command) {
      case "acc":
        const subCommand = args[0];

        switch (subCommand) {
          case "list":
            // Tampilkan daftar permintaan bergabung termasuk yang sudah disetujui dan yang ditolak
            const formattedList = joinRequestList.map((request, index) => {
              // Mengambil nomor WhatsApp dari JID
              const phoneNumber = request.jid.split('@')[0];
              return `│ \`\`\`${index + 1}. Nomor WhatsApp: ${phoneNumber}\`\`\`\n│ \`\`\`Metode Permintaan: ${request.request_method}\`\`\`\n│ \`\`\`Waktu Permintaan: ${new Date(request.request_time * 1000).toLocaleString()}\`\`\`\n├━━━━━━━━━━━━━━━━━━━━━┈─`;
            });
            await m.reply("*Daftar Permintaan Bergabung:*\n" + '\n╭━━━━━━━━━━━━━━━━━━━━━┈─◂\n'+ formattedList.join("\n") + '\n╰━━━━━━━━━━━━━━━━━━━━━┈─◂');
            break;

          case "approve":
          case "reject":
            const action = subCommand;
            const requestIndexes = args[1].split("|").map(index => parseInt(index));
            const validIndexes = requestIndexes.filter(index => !isNaN(index) && index > 0 && index <= joinRequestList.length);

            const delayBetweenActions = 200; // Jeda dalam milidetik
            const responseMessages = []; // Array untuk menyimpan pesan respon

            // Fungsi untuk memproses satu permintaan pada satu waktu
            async function processRequest(index) {
              if (index < validIndexes.length) {
                const indexToProcess = validIndexes[index];
                // Ambil JID yang akan diproses berdasarkan indeks
                const jidToProcess = joinRequestList[indexToProcess - 1].jid;

                try {
                  const response = await conn.groupRequestParticipantsUpdate(groupId, [jidToProcess], action);
                  if (action === "approve") {
                    approvedRequests.push(jidToProcess);
                  } else if (action === "reject") {
                    rejectedRequests.push(jidToProcess);
                  }
                  const phoneNumber = jidToProcess.split('@')[0];
                  const formattedResponse = `│ \`\`\`${indexToProcess}.\`\`\` \`\`\`Nomor:\`\`\`  \`\`\`${phoneNumber}\`\`\`\n│ \`\`\`Status: \`\`\` \`\`\`${action}\`\`\`\n│ \`\`\`Time\`\`\` \`\`\`${action}:\`\`\` \`\`\`${new Date().toLocaleString()}\`\`\`\n├━━━━━━━━━━━━━━━━━━━━━┈─`;
                  responseMessages.push(formattedResponse);
                } catch (error) {
                  console.error(error);
                  const phoneNumber = jidToProcess.split('@')[0];
                  const errorResponse = `Terjadi kesalahan saat ${action} permintaan bergabung *${phoneNumber}*.`;
                  responseMessages.push(errorResponse);
                }

                // Tetapkan jeda sebelum memproses permintaan berikutnya
                setTimeout(() => {
                  processRequest(index + 1);
                }, delayBetweenActions);

                // Jika sudah mencapai permintaan terakhir, kirim semua pesan respon dalam satu pesan
                if (index === validIndexes.length - 1) {
                  const allResponses = '\n╭━━━━━━━━━━━━━━━━━━━━━┈─◂\n' + `│ \`\`\`Hasil ${action} :\`\`\`\n` + responseMessages.join("\n") + '\n╰━━━━━━━━━━━━━━━━━━━━━┈─◂';
                  await m.reply(allResponses);
                }
              }
            }

            // Mulai memproses permintaan dari indeks 0
            processRequest(0);
            break;

          default:
            await m.reply("Perintah tidak valid. Gunakan 'acc list', 'acc approve|reject [nomor(s)]'.");
        }
        break;

      default:
        await m.reply("Perintah tidak valid. Gunakan 'acc list', 'acc approve|reject [nomor(s)]'.");
    }
  } catch (error) {
    console.error(error);
    await m.reply("Terjadi kesalahan saat mendapatkan daftar permintaan bergabung.");
  }
}

// Kode tambahan untuk menghandle pembaruan daftar saat menampilkan
handler.help = ['acc *[opsi] [nomor(s)]*']
handler.tags = ['group']
handler.command = /^(acc)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true
handler.fail = null

export default handler;
