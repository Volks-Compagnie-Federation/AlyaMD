import Acytoo from '../../lib/acytoo.js';
const model = 'gpt-3.5-turbo';
const getAcytooResponse = async (messages, proxy) => {
  
  const responseChunks = await Acytoo.createAsyncGenerator(model, messages, proxy);
  const responseArray = [];

  for await (const chunk of responseChunks) {
    responseArray.push(chunk);
  }

  return responseArray.join('');
};

export async function before(m) {
const chat = global.db.data.chats[m.chat];
  if (m.isBaileys || !m.text) return false;
  let text = m.text;
 const messages = [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: text },
  ];

    try {
    if (chat.autoAi) {
        const result = await getAcytooResponse(messages, null);
            if (result) {
                await this.reply(m.chat, result, m);
            }
      }
    } catch {
      await this.reply(m.chat, 'Error occurred.', m);
    }
}

export const disabled = false;