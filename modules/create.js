const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./sellvpn.db');

// ─────────────────────────────────────────────────────────────
// HELPER: kembalikan { msg, config } supaya config bisa disimpan
// ke tabel user_accounts. msg tetap sama persis dengan versi lama.
// ─────────────────────────────────────────────────────────────

async function trialssh(username, password, exp, iplimit, serverId) {
  if (/\s/.test(username) || /[^a-zA-Z0-9]/.test(username))
    return { msg: '❌ Username tidak valid. Mohon gunakan hanya huruf dan angka tanpa spasi.', config: null };

  return new Promise((resolve) => {
    db.get('SELECT * FROM Server WHERE id = ?', [serverId], (err, server) => {
      if (err || !server) return resolve({ msg: '❌ Gagal: Server tidak ditemukan. Silakan coba lagi.', config: null });
      const { domain, auth } = server;
      axios.get(`http://${domain}:5889/trialssh?user=${username}&password=${password}&exp=${exp}&iplimit=${iplimit}&auth=${auth}`)
        .then(res => {
          if (res.data.status !== 'success') return resolve({ msg: `❌ Gagal: ${res.data.message}`, config: null });
          const d = res.data.data;
          const msg = `
──────────────────────           
                 *✨SSH ACCOUNT✨*
──────────────────────
*Domain* : \`${d.domain}\`
*Nameserver*: \`${d.ns_domain}\`
*Username* : \`${d.username}\`
*Password* : \`${d.password}\`
*Port TLS* : \`443,8443\`
*Port HTTP*: \`80,8080,2086,8880\`
*OpenSSH* : \`22\`
*UdpSSH* : \`1-65535\`
*DNS* : \`53,2222\`
*Dropbear* : \`109,110\`
*BadVPN UDP*: \`7300\`
*Pub Key* : \`${d.pubkey}\`
───────────────────────
🫧*HTTP CUSTOM*
\`${d.domain}:80@${d.username}:${d.password}\`
───────────────────────
🫧*Payload*: 
\`GET /cdn-cgi/trace HTTP/1.1[crlf]Host: Bug_Kalian[crlf][crlf]GET-RAY / HTTP/1.1[crlf]Host: [host][crlf]Connection: Upgrade[crlf]User-Agent: [ua][crlf]Upgrade: websocket[crlf][crlf]\`
──────────────────────
🫧*Save Account*: [Click Link](https://${d.domain}:81/ssh-${d.username}.txt)
──────────────────────
*📅IP Limit*: \`${d.ip_limit}\`
*⏳Expired*: \`${d.expired}\`
──────────────────────
✨ Selamat menggunakan layanan kami! ✨
`;
          resolve({ msg, config: { domain: d.domain, ns_domain: d.ns_domain, password: d.password, pubkey: d.pubkey, save_link: `https://${d.domain}:81/ssh-${d.username}.txt` } });
        })
        .catch(() => resolve({ msg: '❌ Gagal membuat SSH. Silakan coba lagi nanti.', config: null }));
    });
  });
}

async function trialvmess(username, exp, quota, limitip, serverId) {
  if (/\s/.test(username) || /[^a-zA-Z0-9]/.test(username))
    return { msg: '❌ Username tidak valid. Mohon gunakan hanya huruf dan angka tanpa spasi.', config: null };

  return new Promise((resolve) => {
    db.get('SELECT * FROM Server WHERE id = ?', [serverId], (err, server) => {
      if (err || !server) return resolve({ msg: '❌ Gagal: Server tidak ditemukan.', config: null });
      const { domain, auth } = server;
      axios.get(`http://${domain}:5889/trialvmess?user=${username}&exp=${exp}&quota=${quota}&iplimit=${limitip}&auth=${auth}`)
        .then(res => {
          if (res.data.status !== 'success') return resolve({ msg: `❌ Gagal: ${res.data.message}`, config: null });
          const d = res.data.data;
          const msg = `
────────────────────── 
              *✨VMESS ACCOUNT✨*
──────────────────────
*Username* : \`${d.username}\`
*Domain* : \`${d.domain}\`
*Port TLS* : \`443,8443\`
*Port HTTP*: \`80,8080,2086,8880\`
*UUID* : \`${d.uuid}\`
*Alter ID* : \`0\`
*Security* : \`Auto\`
*Path* : \`/vmess\`
*Path gRPC*: \`vmess-grpc\`
──────────────────────
🫧*URL TLS:*
\`\`\`
${d.vmess_tls_link}
\`\`\`
🫧*URL HTTP:*
\`\`\`
${d.vmess_nontls_link}
\`\`\`
🫧*URL gRPC:*
\`\`\`
${d.vmess_grpc_link}
\`\`\`
──────────────────────
🫧*Save Account*: [Click Link](https://${d.domain}:81/vmess-${d.username}.txt)
──────────────────────
🚀*Quota*: \`${d.quota === '0 GB' ? 'Unlimited' : d.quota}\`
🌤*IP Limit*: \`${d.ip_limit === '0' ? 'Unlimited' : d.ip_limit} IP\`
⏳*Expired*: \`${d.expired}\`
──────────────────────
✨ Selamat menggunakan layanan kami! ✨
`;
          resolve({ msg, config: { domain: d.domain, uuid: d.uuid, tls_link: d.vmess_tls_link, http_link: d.vmess_nontls_link, grpc_link: d.vmess_grpc_link, save_link: `https://${d.domain}:81/vmess-${d.username}.txt` } });
        })
        .catch(() => resolve({ msg: '❌ Gagal membuat VMess. Silakan coba lagi nanti.', config: null }));
    });
  });
}

async function trialvless(username, exp, quota, limitip, serverId) {
  if (/\s/.test(username) || /[^a-zA-Z0-9]/.test(username))
    return { msg: '❌ Username tidak valid. Mohon gunakan hanya huruf dan angka tanpa spasi.', config: null };

  return new Promise((resolve) => {
    db.get('SELECT * FROM Server WHERE id = ?', [serverId], (err, server) => {
      if (err || !server) return resolve({ msg: '❌ Gagal: Server tidak ditemukan.', config: null });
      const { domain, auth } = server;
      axios.get(`http://${domain}:5889/trialvless?user=${username}&exp=${exp}&quota=${quota}&iplimit=${limitip}&auth=${auth}`)
        .then(res => {
          if (res.data.status !== 'success') return resolve({ msg: `❌ Gagal: ${res.data.message}`, config: null });
          const d = res.data.data;
          const msg = `
────────────────────── 
               *✨VLESS ACCOUNT✨*
──────────────────────
*Username* : \`${d.username}\`
*Domain* : \`${d.domain}\`
*Port TLS* : \`443,8443\`
*Port HTTP*: \`80,8080,2086,8880\`
*UUID* : \`${d.uuid}\`
*Path* : \`/vless\`
*Path gRPC*: \`vless-grpc\`
──────────────────────
🫧*URL TLS:*
\`\`\`
${d.vless_tls_link}
\`\`\`
🫧*URL HTTP:*
\`\`\`
${d.vless_nontls_link}
\`\`\`
🫧*URL gRPC:*
\`\`\`
${d.vless_grpc_link}
\`\`\`
──────────────────────
🫧*Save Account*: [Click Link](https://${d.domain}:81/vless-${d.username}.txt)
──────────────────────
🚀*Quota*: \`${d.quota === '0 GB' ? 'Unlimited' : d.quota}\`
🌤*IP Limit*: \`${d.ip_limit === '0' ? 'Unlimited' : d.ip_limit} IP\`
⏳*Expired*: \`${d.expired}\`
──────────────────────
✨ Selamat menggunakan layanan kami! ✨
`;
          resolve({ msg, config: { domain: d.domain, uuid: d.uuid, tls_link: d.vless_tls_link, http_link: d.vless_nontls_link, grpc_link: d.vless_grpc_link, save_link: `https://${d.domain}:81/vless-${d.username}.txt` } });
        })
        .catch(() => resolve({ msg: '❌ Gagal membuat VLESS. Silakan coba lagi nanti.', config: null }));
    });
  });
}

async function trialtrojan(username, exp, quota, limitip, serverId) {
  if (/\s/.test(username) || /[^a-zA-Z0-9]/.test(username))
    return { msg: '❌ Username tidak valid. Mohon gunakan hanya huruf dan angka tanpa spasi.', config: null };

  return new Promise((resolve) => {
    db.get('SELECT * FROM Server WHERE id = ?', [serverId], (err, server) => {
      if (err || !server) return resolve({ msg: '❌ Gagal: Server tidak ditemukan.', config: null });
      const { domain, auth } = server;
      axios.get(`http://${domain}:5889/trialtrojan?user=${username}&exp=${exp}&quota=${quota}&iplimit=${limitip}&auth=${auth}`)
        .then(res => {
          if (res.data.status !== 'success') return resolve({ msg: `❌ Gagal: ${res.data.message}`, config: null });
          const d = res.data.data;
          const msg = `
────────────────────── 
            *✨TROJAN ACCOUNT✨*
──────────────────────
*Username* : \`${d.username}\`
*Domain* : \`${d.domain}\`
*Port TLS* : \`443,8443\`
*Port HTTP*: \`80,8080,2086,8880\`
*UUID* : \`${d.uuid}\`
*Path* : \`/trojan-ws\`
*Path gRPC*: \`trojan-grpc\`
──────────────────────
🫧*URL TLS:*
\`\`\`
${d.trojan_tls_link}
\`\`\`
🫧*URL gRPC:*
\`\`\`
${d.trojan_grpc_link}
\`\`\`
──────────────────────
🫧*Save Account*: [Click Link](https://${d.domain}:81/trojan-${d.username}.txt)
──────────────────────
🚀*Quota*: \`${d.quota === '0 GB' ? 'Unlimited' : d.quota}\`
🌤*IP Limit*: \`${d.ip_limit === '0' ? 'Unlimited' : d.ip_limit} IP\`
⏳*Expired*: \`${d.expired}\`
──────────────────────
✨ Selamat menggunakan layanan kami! ✨
`;
          resolve({ msg, config: { domain: d.domain, uuid: d.uuid, tls_link: d.trojan_tls_link, grpc_link: d.trojan_grpc_link, save_link: `https://${d.domain}:81/trojan-${d.username}.txt` } });
        })
        .catch(() => resolve({ msg: '❌ Gagal membuat Trojan. Silakan coba lagi nanti.', config: null }));
    });
  });
}

async function trialshadowsocks(username, exp, quota, limitip, serverId) {
  if (/\s/.test(username) || /[^a-zA-Z0-9]/.test(username))
    return { msg: '❌ Username tidak valid. Mohon gunakan hanya huruf dan angka tanpa spasi.', config: null };

  return new Promise((resolve) => {
    db.get('SELECT * FROM Server WHERE id = ?', [serverId], (err, server) => {
      if (err || !server) return resolve({ msg: '❌ Gagal: Server tidak ditemukan.', config: null });
      const { domain, auth } = server;
      axios.get(`http://${domain}:5889/trialshadowsocks?user=${username}&exp=${exp}&quota=${quota}&iplimit=${limitip}&auth=${auth}`)
        .then(res => {
          if (res.data.status !== 'success') return resolve({ msg: `❌ Gagal: ${res.data.message}`, config: null });
          const d = res.data.data;
          const msg = `
────────────────────── 
      *✨SHADOWSOCKS ACCOUNT✨*
──────────────────────
*Username* : \`${d.username}\`
*Domain* : \`${d.domain}\`
*Port TLS* : \`443,8443\`
*Port HTTP*: \`80,8080,2086,8880\`
*UUID* : \`${d.uuid}\`
*Path* : \`/ss-ws\`
*Path gRPC*: \`ss-grpc\`
──────────────────────
🫧*URL TLS:*
\`\`\`
${d.ss_link_ws}
\`\`\`
🫧*URL HTTP:*
\`\`\`
${d.ss_link_nontls}
\`\`\`
🫧*URL gRPC:*
\`\`\`
${d.ss_link_grpc}
\`\`\`
──────────────────────
🫧*Save Account*: [Click Link](https://${d.domain}:81/ss-${d.username}.txt)
──────────────────────
🚀*Quota*: \`${d.quota === '0 GB' ? 'Unlimited' : d.quota}\`
🌤*IP Limit*: \`${d.ip_limit === '0' ? 'Unlimited' : d.ip_limit} IP\`
⏳*Expired*: \`${d.expired}\`
──────────────────────
✨ Selamat menggunakan layanan kami! ✨
`;
          resolve({ msg, config: { domain: d.domain, uuid: d.uuid, tls_link: d.ss_link_ws, http_link: d.ss_link_nontls, grpc_link: d.ss_link_grpc, save_link: `https://${d.domain}:81/ss-${d.username}.txt` } });
        })
        .catch(() => resolve({ msg: '❌ Gagal membuat Shadowsocks. Silakan coba lagi nanti.', config: null }));
    });
  });
}

async function createssh(username, password, exp, iplimit, serverId) {
  if (/\s/.test(username) || /[^a-zA-Z0-9]/.test(username))
    return { msg: '❌ Username tidak valid. Mohon gunakan hanya huruf dan angka tanpa spasi.', config: null };

  return new Promise((resolve) => {
    db.get('SELECT * FROM Server WHERE id = ?', [serverId], (err, server) => {
      if (err || !server) return resolve({ msg: '❌ Gagal: Server tidak ditemukan.', config: null });
      const { domain, auth } = server;
      axios.get(`http://${domain}:5889/createssh?user=${username}&password=${password}&exp=${exp}&iplimit=${iplimit}&auth=${auth}`)
        .then(res => {
          if (res.data.status !== 'success') return resolve({ msg: `❌ Gagal: ${res.data.message}`, config: null });
          const d = res.data.data;
          const msg = `
──────────────────────           
                 *✨SSH ACCOUNT✨*
──────────────────────
*Domain* : \`${d.domain}\`
*Nameserver*: \`${d.ns_domain}\`
*Username* : \`${d.username}\`
*Password* : \`${d.password}\`
*Port TLS* : \`443,8443\`
*Port HTTP*: \`80,8080,2086,8880\`
*OpenSSH* : \`22\`
*UdpSSH* : \`1-65535\`
*DNS* : \`53,2222\`
*Dropbear* : \`109,110\`
*BadVPN UDP*: \`7300\`
*Pub Key* : \`${d.pubkey}\`
───────────────────────
🫧*HTTP CUSTOM*
\`${d.domain}:80@${d.username}:${d.password}\`
───────────────────────
🫧*Payload*: 
\`GET /cdn-cgi/trace HTTP/1.1[crlf]Host: Bug_Kalian[crlf][crlf]GET-RAY / HTTP/1.1[crlf]Host: [host][crlf]Connection: Upgrade[crlf]User-Agent: [ua][crlf]Upgrade: websocket[crlf][crlf]\`
──────────────────────
🫧*Save Account*: [Click Link](https://${d.domain}:81/ssh-${d.username}.txt)
──────────────────────
🚀*IP Limit*: \`${d.ip_limit}\`
⏳*Expired*: \`${d.expired}\`
──────────────────────
✨ Selamat menggunakan layanan kami! ✨
`;
          resolve({ msg, config: { domain: d.domain, ns_domain: d.ns_domain, password: d.password, pubkey: d.pubkey, save_link: `https://${d.domain}:81/ssh-${d.username}.txt` } });
        })
        .catch(() => resolve({ msg: '❌ Gagal membuat SSH. Silakan coba lagi nanti.', config: null }));
    });
  });
}

async function createvmess(username, exp, quota, limitip, serverId) {
  if (/\s/.test(username) || /[^a-zA-Z0-9]/.test(username))
    return { msg: '❌ Username tidak valid. Mohon gunakan hanya huruf dan angka tanpa spasi.', config: null };

  return new Promise((resolve) => {
    db.get('SELECT * FROM Server WHERE id = ?', [serverId], (err, server) => {
      if (err || !server) return resolve({ msg: '❌ Gagal: Server tidak ditemukan.', config: null });
      const { domain, auth } = server;
      axios.get(`http://${domain}:5889/createvmess?user=${username}&exp=${exp}&quota=${quota}&iplimit=${limitip}&auth=${auth}`)
        .then(res => {
          if (res.data.status !== 'success') return resolve({ msg: `❌ Gagal: ${res.data.message}`, config: null });
          const d = res.data.data;
          const msg = `
────────────────────── 
              *✨VMESS ACCOUNT✨*
──────────────────────
*Username* : \`${d.username}\`
*Domain* : \`${d.domain}\`
*Port TLS* : \`443,8443\`
*Port HTTP*: \`80,8080,2086,8880\`
*UUID* : \`${d.uuid}\`
*Alter ID* : \`0\`
*Security* : \`Auto\`
*Path* : \`/vmess\`
*Path gRPC*: \`vmess-grpc\`
──────────────────────
🫧*URL TLS:*
\`\`\`
${d.vmess_tls_link}
\`\`\`
🫧*URL HTTP:*
\`\`\`
${d.vmess_nontls_link}
\`\`\`
🫧*URL gRPC:*
\`\`\`
${d.vmess_grpc_link}
\`\`\`
──────────────────────
🫧*Save Account*: [Click Link](https://${d.domain}:81/vmess-${d.username}.txt)
──────────────────────
🚀*Quota*: \`${d.quota === '0 GB' ? 'Unlimited' : d.quota}\`
🌤*IP Limit*: \`${d.ip_limit === '0' ? 'Unlimited' : d.ip_limit} IP\`
⏳*Expired*: \`${d.expired}\`
──────────────────────
✨ Selamat menggunakan layanan kami! ✨
`;
          resolve({ msg, config: { domain: d.domain, uuid: d.uuid, tls_link: d.vmess_tls_link, http_link: d.vmess_nontls_link, grpc_link: d.vmess_grpc_link, save_link: `https://${d.domain}:81/vmess-${d.username}.txt` } });
        })
        .catch(() => resolve({ msg: '❌ Gagal membuat VMess. Silakan coba lagi nanti.', config: null }));
    });
  });
}

async function createvless(username, exp, quota, limitip, serverId) {
  if (/\s/.test(username) || /[^a-zA-Z0-9]/.test(username))
    return { msg: '❌ Username tidak valid. Mohon gunakan hanya huruf dan angka tanpa spasi.', config: null };

  return new Promise((resolve) => {
    db.get('SELECT * FROM Server WHERE id = ?', [serverId], (err, server) => {
      if (err || !server) return resolve({ msg: '❌ Gagal: Server tidak ditemukan.', config: null });
      const { domain, auth } = server;
      axios.get(`http://${domain}:5889/createvless?user=${username}&exp=${exp}&quota=${quota}&iplimit=${limitip}&auth=${auth}`)
        .then(res => {
          if (res.data.status !== 'success') return resolve({ msg: `❌ Gagal: ${res.data.message}`, config: null });
          const d = res.data.data;
          const msg = `
────────────────────── 
               *✨VLESS ACCOUNT✨*
──────────────────────
*Username* : \`${d.username}\`
*Domain* : \`${d.domain}\`
*Port TLS* : \`443,8443\`
*Port HTTP*: \`80,8080,2086,8880\`
*UUID* : \`${d.uuid}\`
*Path* : \`/vless\`
*Path gRPC*: \`vless-grpc\`
──────────────────────
🫧*URL TLS:*
\`\`\`
${d.vless_tls_link}
\`\`\`
🫧*URL HTTP:*
\`\`\`
${d.vless_nontls_link}
\`\`\`
🫧*URL gRPC:*
\`\`\`
${d.vless_grpc_link}
\`\`\`
──────────────────────
🫧*Save Account*: [Click Link](https://${d.domain}:81/vless-${d.username}.txt)
──────────────────────
🚀*Quota*: \`${d.quota === '0 GB' ? 'Unlimited' : d.quota}\`
🌤*IP Limit*: \`${d.ip_limit === '0' ? 'Unlimited' : d.ip_limit} IP\`
⏳*Expired*: \`${d.expired}\`
──────────────────────
✨ Selamat menggunakan layanan kami! ✨
`;
          resolve({ msg, config: { domain: d.domain, uuid: d.uuid, tls_link: d.vless_tls_link, http_link: d.vless_nontls_link, grpc_link: d.vless_grpc_link, save_link: `https://${d.domain}:81/vless-${d.username}.txt` } });
        })
        .catch(() => resolve({ msg: '❌ Gagal membuat VLESS. Silakan coba lagi nanti.', config: null }));
    });
  });
}

async function createtrojan(username, exp, quota, limitip, serverId) {
  if (/\s/.test(username) || /[^a-zA-Z0-9]/.test(username))
    return { msg: '❌ Username tidak valid. Mohon gunakan hanya huruf dan angka tanpa spasi.', config: null };

  return new Promise((resolve) => {
    db.get('SELECT * FROM Server WHERE id = ?', [serverId], (err, server) => {
      if (err || !server) return resolve({ msg: '❌ Gagal: Server tidak ditemukan.', config: null });
      const { domain, auth } = server;
      axios.get(`http://${domain}:5889/createtrojan?user=${username}&exp=${exp}&quota=${quota}&iplimit=${limitip}&auth=${auth}`)
        .then(res => {
          if (res.data.status !== 'success') return resolve({ msg: `❌ Gagal: ${res.data.message}`, config: null });
          const d = res.data.data;
          const msg = `
────────────────────── 
            *✨TROJAN ACCOUNT✨*
──────────────────────
*Username* : \`${d.username}\`
*Domain* : \`${d.domain}\`
*Port TLS* : \`443,8443\`
*Port HTTP*: \`80,8080,2086,8880\`
*UUID* : \`${d.uuid}\`
*Path* : \`/trojan-ws\`
*Path gRPC*: \`trojan-grpc\`
──────────────────────
🫧*URL TLS:*
\`\`\`
${d.trojan_tls_link}
\`\`\`
🫧*URL gRPC:*
\`\`\`
${d.trojan_grpc_link}
\`\`\`
──────────────────────
🫧*Save Account*: [Click Link](https://${d.domain}:81/trojan-${d.username}.txt)
──────────────────────
🚀*Quota*: \`${d.quota === '0 GB' ? 'Unlimited' : d.quota}\`
🌤*IP Limit*: \`${d.ip_limit === '0' ? 'Unlimited' : d.ip_limit} IP\`
⏳*Expired*: \`${d.expired}\`
──────────────────────
✨ Selamat menggunakan layanan kami! ✨
`;
          resolve({ msg, config: { domain: d.domain, uuid: d.uuid, tls_link: d.trojan_tls_link, grpc_link: d.trojan_grpc_link, save_link: `https://${d.domain}:81/trojan-${d.username}.txt` } });
        })
        .catch(() => resolve({ msg: '❌ Gagal membuat Trojan. Silakan coba lagi nanti.', config: null }));
    });
  });
}

async function createshadowsocks(username, exp, quota, limitip, serverId) {
  if (/\s/.test(username) || /[^a-zA-Z0-9]/.test(username))
    return { msg: '❌ Username tidak valid. Mohon gunakan hanya huruf dan angka tanpa spasi.', config: null };

  return new Promise((resolve) => {
    db.get('SELECT * FROM Server WHERE id = ?', [serverId], (err, server) => {
      if (err || !server) return resolve({ msg: '❌ Gagal: Server tidak ditemukan.', config: null });
      const { domain, auth } = server;
      axios.get(`http://${domain}:5889/createshadowsocks?user=${username}&exp=${exp}&quota=${quota}&iplimit=${limitip}&auth=${auth}`)
        .then(res => {
          if (res.data.status !== 'success') return resolve({ msg: `❌ Gagal: ${res.data.message}`, config: null });
          const d = res.data.data;
          const msg = `
────────────────────── 
      *✨SHADOWSOCKS ACCOUNT✨*
──────────────────────
*Username* : \`${d.username}\`
*Domain* : \`${d.domain}\`
*Port TLS* : \`443,8443\`
*Port HTTP*: \`80,8080,2086,8880\`
*UUID* : \`${d.uuid}\`
*Path* : \`/ss-ws\`
*Path gRPC*: \`ss-grpc\`
──────────────────────
🫧*URL TLS:*
\`\`\`
${d.ss_link_ws}
\`\`\`
🫧*URL HTTP:*
\`\`\`
${d.ss_link_nontls}
\`\`\`
🫧*URL gRPC:*
\`\`\`
${d.ss_link_grpc}
\`\`\`
──────────────────────
🫧*Save Account*: [Click Link](https://${d.domain}:81/ss-${d.username}.txt)
──────────────────────
🚀*Quota*: \`${d.quota === '0 GB' ? 'Unlimited' : d.quota}\`
🌤*IP Limit*: \`${d.ip_limit === '0' ? 'Unlimited' : d.ip_limit} IP\`
⏳*Expired*: \`${d.expired}\`
──────────────────────
✨ Selamat menggunakan layanan kami! ✨
`;
          resolve({ msg, config: { domain: d.domain, uuid: d.uuid, tls_link: d.ss_link_ws, http_link: d.ss_link_nontls, grpc_link: d.ss_link_grpc, save_link: `https://${d.domain}:81/ss-${d.username}.txt` } });
        })
        .catch(() => resolve({ msg: '❌ Gagal membuat Shadowsocks. Silakan coba lagi nanti.', config: null }));
    });
  });
}

module.exports = { trialssh, trialvmess, trialvless, trialtrojan, trialshadowsocks, createssh, createvmess, createvless, createtrojan, createshadowsocks };
