import React, { useState, useEffect, useRef } from 'react';
import { X, Terminal, Maximize2, RefreshCw } from 'lucide-react';

export default function WebTerminalModal({ server, onClose }) {
  const [commandInput, setCommandInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'sys', text: `NovaQ Servers WebSSH Gateway v3.11 [SSH-2.0-OpenSSH_9.6p1]` },
    { type: 'sys', text: `Authenticating via NovaQ Hardware Key to ${server.ip}:22...` },
    { type: 'sys', text: `Last login: Dün 22:14:02 from 88.241.12.9` },
    { type: 'sys', text: `Welcome to ${server.os} (${server.cores})` },
    { type: 'sys', text: `Tip: 'help' yazarak mevcut simülasyon komutlarını görebilirsiniz veya aşağıdaki butonlara tıklayabilirsiniz.\n` }
  ]);
  const screenRef = useRef(null);

  useEffect(() => {
    if (screenRef.current) {
      screenRef.current.scrollTop = screenRef.current.scrollHeight;
    }
  }, [history]);

  const executeCommand = (cmdText) => {
    const trimmed = cmdText.trim();
    if (!trimmed) return;

    // Echo user prompt
    const promptLine = { type: 'cmd', text: `root@${server.name}:~# ${trimmed}` };
    let responseLines = [];

    const lower = trimmed.toLowerCase();

    if (lower === 'clear') {
      setHistory([]);
      return;
    } else if (lower === 'help') {
      responseLines = [
        { type: 'out', text: 'Kullanılabilir Web Terminal Komutları:' },
        { type: 'out', text: '  neofetch       - Sunucu donanımı, çekirdek ve NovaQ ASCII grafiği' },
        { type: 'out', text: '  htop           - Canlı süreçler ve CPU / RAM tüketim tablosu' },
        { type: 'out', text: '  uptime         - Çalışma süresi ve yük ortalamaları' },
        { type: 'out', text: '  ip a           - 10G Ağ arayüzü ve IP yapılandırması' },
        { type: 'out', text: '  df -h          - NVMe Gen4 disk bölümleri ve boş alan' },
        { type: 'out', text: '  ping 8.8.8.8   - Google Anycast DNS ping testi' },
        { type: 'out', text: '  uname -a       - Linux çekirdek versiyon bilgisi' },
        { type: 'out', text: '  clear          - Terminal ekranını temizler' }
      ];
    } else if (lower === 'neofetch') {
      responseLines = [
        { type: 'cyan', text: '       _..._          root@' + server.name },
        { type: 'cyan', text: '     .:::::::.        ---------------' },
        { type: 'cyan', text: '    /:::::::::\\       OS: ' + server.os },
        { type: 'cyan', text: '   |:::NovaQ:::|      Host: NovaQ Servers High-Performance KVM' },
        { type: 'cyan', text: '    \\:::::::::/       Kernel: 6.8.0-40-generic x86_64' },
        { type: 'cyan', text: '     `:::::::´        Uptime: ' + server.uptime },
        { type: 'cyan', text: '                      CPU: ' + server.cores },
        { type: 'cyan', text: '                      RAM: ' + server.ram },
        { type: 'cyan', text: '                      Disk: ' + server.disk + ' (Gen4 NVMe)' },
        { type: 'cyan', text: '                      Location: ' + server.location }
      ];
    } else if (lower === 'htop') {
      responseLines = [
        { type: 'out', text: 'PID   USER      PRI  NI  VIRT   RES   SHR S  CPU%  MEM%   TIME+  COMMAND' },
        { type: 'green', text: ' 1    root       20   0  168M   12M  8.4M S   0.0   0.1  0:04.18 /sbin/init' },
        { type: 'green', text: ' 742  systemd    20   0  240M   18M   14M S   0.1   0.2  0:12.40 /lib/systemd-journald' },
        { type: 'green', text: ' 1204 www-data   20   0  520M   84M   42M S   3.4   1.2  2:48.11 nginx: worker process' },
        { type: 'green', text: ' 1589 docker     20   0  1.8G  340M  120M S   4.8   4.5  8:12.04 /usr/bin/dockerd' },
        { type: 'green', text: ' 1902 postgres   20   0  4.2G  1.2G  800M S   2.1  14.0 14:02.19 postgres: cluster main' },
        { type: 'out', text: `Tasks: 148, 1 thr; 1 running. CPU Usage: %${server.metrics.cpuHistory[server.metrics.cpuHistory.length - 1]} | Load Avg: 0.42, 0.38, 0.35` }
      ];
    } else if (lower === 'uptime') {
      responseLines = [
        { type: 'out', text: ` 01:24:19 up ${server.uptime}, 2 users, load average: 0.28, 0.35, 0.31` }
      ];
    } else if (lower === 'ip a' || lower === 'ifconfig') {
      responseLines = [
        { type: 'out', text: '1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000' },
        { type: 'out', text: '    inet 127.0.0.1/8 scope host lo' },
        { type: 'cyan', text: `2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 9000 qdisc mq state UP group default qlen 1000` },
        { type: 'cyan', text: `    inet ${server.ip}/24 brd 194.15.36.255 scope global eth0` },
        { type: 'cyan', text: `    inet6 2a02:29e0:100::44/64 scope global dynamic` },
        { type: 'out', text: `    RX: 10 Gbps VirtIO Redundant Port | Voxility Anti-DDoS: Enabled` }
      ];
    } else if (lower === 'df -h') {
      responseLines = [
        { type: 'out', text: 'Filesystem      Size  Used Avail Use% Mounted on' },
        { type: 'out', text: `/dev/nvme0n1p1  ${server.disk}  ${server.diskUsed}  Available   28% /` },
        { type: 'out', text: 'tmpfs           3.2G     0  3.2G   0% /dev/shm' },
        { type: 'out', text: 'efivarfs        128K   58K   66K  47% /sys/firmware/efi/efivars' }
      ];
    } else if (lower.startsWith('ping')) {
      responseLines = [
        { type: 'out', text: 'PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.' },
        { type: 'out', text: '64 bytes from 8.8.8.8: icmp_seq=1 ttl=118 time=1.24 ms' },
        { type: 'out', text: '64 bytes from 8.8.8.8: icmp_seq=2 ttl=118 time=1.19 ms' },
        { type: 'out', text: '64 bytes from 8.8.8.8: icmp_seq=3 ttl=118 time=1.21 ms' },
        { type: 'out', text: '--- 8.8.8.8 ping statistics --- 3 packets transmitted, 3 received, 0% packet loss, time 2003ms' }
      ];
    } else if (lower.startsWith('uname')) {
      responseLines = [
        { type: 'out', text: `Linux ${server.name} 6.8.0-40-generic #40-Ubuntu SMP PREEMPT_DYNAMIC x86_64 GNU/Linux` }
      ];
    } else {
      responseLines = [
        { type: 'err', text: `bash: ${trimmed}: command not found. Desteklenen simülasyon komutlarını görmek için 'help' yazın.` }
      ];
    }

    setHistory(prev => [...prev, promptLine, ...responseLines]);
    setCommandInput('');
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    executeCommand(commandInput);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-card" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '820px' }}
      >
        {/* Terminal Header */}
        <div className="terminal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div className="terminal-dots">
              <span className="terminal-dot red" onClick={onClose} style={{ cursor: 'pointer' }}></span>
              <span className="terminal-dot yellow"></span>
              <span className="terminal-dot green"></span>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.825rem', color: '#cbd5e1' }}>
              Web SSH • root@{server.name} ({server.ip})
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button 
              className="btn btn-secondary btn-sm" 
              onClick={() => executeCommand('clear')}
              style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
            >
              <RefreshCw size={12} />
              <span>Temizle</span>
            </button>
            <button 
              className="btn btn-secondary btn-sm" 
              onClick={onClose}
              style={{ borderRadius: '50%', width: '28px', height: '28px', padding: 0 }}
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Terminal Screen Output */}
        <div className="terminal-screen" ref={screenRef}>
          {history.map((item, idx) => (
            <div key={idx} style={{
              color: item.type === 'cmd' ? '#ffffff' : 
                     item.type === 'cyan' ? '#00d2ff' :
                     item.type === 'green' ? '#10b981' :
                     item.type === 'err' ? '#ef4444' :
                     item.type === 'sys' ? '#94a3b8' : '#e2e8f0',
              fontWeight: item.type === 'cmd' ? 600 : 400,
              fontFamily: 'var(--font-mono)',
              whiteSpace: 'pre-wrap',
              marginBottom: '0.25rem'
            }}>
              {item.text}
            </div>
          ))}
        </div>

        {/* Quick Commands Bar */}
        <div className="terminal-quick-cmds">
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
            Hızlı Komutlar:
          </span>
          <button className="quick-cmd-btn" onClick={() => executeCommand('neofetch')}>neofetch</button>
          <button className="quick-cmd-btn" onClick={() => executeCommand('htop')}>htop</button>
          <button className="quick-cmd-btn" onClick={() => executeCommand('uptime')}>uptime</button>
          <button className="quick-cmd-btn" onClick={() => executeCommand('ip a')}>ip a</button>
          <button className="quick-cmd-btn" onClick={() => executeCommand('df -h')}>df -h</button>
          <button className="quick-cmd-btn" onClick={() => executeCommand('ping 8.8.8.8')}>ping 8.8.8.8</button>
          <button className="quick-cmd-btn" onClick={() => executeCommand('help')}>help</button>
        </div>

        {/* Terminal Command Input Form */}
        <form className="terminal-input-row" onSubmit={handleFormSubmit}>
          <span className="terminal-prompt">root@{server.name}:~#</span>
          <input
            type="text"
            className="terminal-input"
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            placeholder="komut yazın ve Enter'a basın (örn: neofetch, htop, uptime)..."
            autoFocus
          />
        </form>
      </div>
    </div>
  );
}
