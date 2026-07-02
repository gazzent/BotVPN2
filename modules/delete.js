const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./sellvpn.db');

async function deleteAccount(username, type, serverId) {
  if (!username || !type || !serverId)
    return { success: false, msg: '❌ Parameter tidak lengkap.' };

  const endpoints = {
    ssh:         'deletessh',
    vmess:       'deletevmess',
    vless:       'deletevless',
    trojan:      'deletetrojan',
    shadowsocks: 'deleteshadowsocks'
  };

  const endpoint = endpoints[type.toLowerCase()];
  if (!endpoint)
    return { success: false, msg: `❌ Tipe akun tidak dikenali: ${type}` };

  return new Promise((resolve) => {
    db.get('SELECT * FROM Server WHERE id = ?', [serverId], (err, server) => {
      if (err || !server)
        return resolve({ success: false, msg: '❌ Gagal: Server tidak ditemukan.' });

      const { domain, auth } = server;
      const url = `http://${domain}:5889/${endpoint}?user=${username}&auth=${auth}`;

      axios.get(url, { timeout: 10000 })
        .then(res => {
          if (res.data.status === 'success') {
            resolve({ success: true, msg: `✅ Akun *${username}* (${type.toUpperCase()}) berhasil dihapus dari server.` });
          } else {
            resolve({ success: false, msg: `❌ Gagal hapus: ${res.data.message || 'Unknown error'}` });
          }
        })
        .catch(err => {
          console.error('Error hapus akun:', err.message);
          resolve({ success: false, msg: '❌ Gagal menghubungi server. Coba lagi nanti.' });
        });
    });
  });
}

module.exports = { deleteAccount };
