
const {
  default: makeWASocket,
  useMultiFileAuthState
} = require('@whiskeysockets/baileys');

async function startBot() {
  const { state, saveCreds } =
    await useMultiFileAuthState('./session');

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false
  });

  sock.ev.on('creds.update', saveCreds);

  if (!state.creds.registered) {
    const number = process.env.BOT_NUMBER;
    if (!number) {
      console.log('Set BOT_NUMBER first');
      return;
    }

    const code = await sock.requestPairingCode(number);
    console.log('PAIRING CODE:', code);
  }

  sock.ev.on('connection.update', ({ connection }) => {
    if (connection === 'open') {
      console.log('DESHA CR7 BOT CONNECTED');
    }
  });

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg?.message || msg.key.fromMe) return;

    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      '';

    if (text.trim() === 'منيو') {
      await sock.sendMessage(msg.key.remoteJid, {
        text:
          '🐍 DESHA CR7 BOT 🐍\n\n' +
          '1- قسم التحميل\n' +
          '2- قسم الألعاب\n' +
          '3- قسم الأدوات'
      });
    }
  });
}

startBot().catch(console.error);

