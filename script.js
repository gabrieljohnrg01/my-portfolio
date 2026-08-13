function updateTime() {
    const timeElement = document.getElementById('live-time');
    if (!timeElement) return;
    const now = new Date();
    const timeString = now.toLocaleString('en-US', {
        timeZone: 'Asia/Manila',
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
    });
    timeElement.innerText = timeString + ' PHT';
}

document.addEventListener('DOMContentLoaded', () => {
    updateTime();
    setInterval(updateTime, 1000);
    fetchGitHubRepos();

    const bootScreen = document.getElementById('boot-screen');
    const bootLogs = document.getElementById('boot-logs');
    const logs = [
        "Loading kernel linux-5.15.0-generic...",
        "Loading initial ramdisk...",
        "[ OK ] Reached target Local File Systems.",
        "[ OK ] Started D-Bus System Message Bus.",
        "Mounting /sys/kernel/debug...",
        "[ OK ] Reached target Network.",
        "Starting Dashboard Services...",
        "Bypassing mainframe protocols... [SUCCESS]",
        "[ OK ] Started Portfolio UI v2.0.",
        "Welcome, User."
    ];

    let i = 0;
    const bootInterval = setInterval(() => {
        if (i < logs.length) {
            const p = document.createElement('p');
            p.className = 'boot-line';
            p.innerText = logs[i];
            bootLogs.appendChild(p);
            i++;
        } else {
            clearInterval(bootInterval);
            setTimeout(() => {
                bootScreen.style.opacity = '0';
                setTimeout(() => bootScreen.style.display = 'none', 500);
            }, 500);
        }
    }, 150);
});

const GITHUB_USERNAME = 'gabrieljohnrg01';

async function fetchGitHubRepos() {
    const container = document.getElementById('github-repos-container');
    const profileLink = document.getElementById('github-profile-link');
    if (!container) return;

    profileLink.href = `https://github.com/${GITHUB_USERNAME}`;

    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=4`);
        if (!response.ok) throw new Error('API Error');
        const repos = await response.json();

        container.innerHTML = '';

        if (repos.length === 0) {
            container.innerHTML = '<div class="text-slate-500 text-xs col-span-2">No repositories found.</div>';
            return;
        }

        repos.forEach(repo => {
            let langColor = 'bg-slate-500';
            if (repo.language === 'Python') langColor = 'bg-blue-500';
            else if (repo.language === 'Shell' || repo.language === 'Bash') langColor = 'bg-green-500';
            else if (repo.language === 'JavaScript') langColor = 'bg-yellow-400';
            else if (repo.language === 'HTML') langColor = 'bg-orange-500';

            const langBadge = repo.language ? `<span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full ${langColor}"></span> ${repo.language}</span>` : '';
            const desc = repo.description || 'No description provided for this repository.';

            const html = `
            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="repo-card glass-panel rounded-0 p-5 group flex flex-col justify-between h-full">
                <div>
                    <div class="flex items-center gap-2 mb-3">
                        <svg class="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"></path></svg>
                        <h4 class="text-cyan-400 font-bold m-0 text-base group-hover:underline truncate w-full">${repo.name}</h4>
                    </div>
                    <p class="text-slate-400 text-xs mb-4 leading-relaxed" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${desc}</p>
                </div>
                <div class="flex items-center gap-4 text-[10px] text-slate-500 font-mono mt-auto pt-2 border-t border-slate-800">
                    ${langBadge}
                    <span class="flex items-center gap-1">★ ${repo.stargazers_count}</span>
                </div>
            </a>`;
            container.innerHTML += html;
        });
    } catch (error) {
        container.innerHTML = '<div class="text-red-400 text-xs font-mono col-span-2">Error connecting to GitHub API. Please verify username.</div>';
    }
}

const pingCanvas = document.getElementById('ping-graph');
const pCtx = pingCanvas.getContext('2d');
const pingText = document.getElementById('ping-text');
let pingData = Array(50).fill(14);

let themeTraceColor = 'rgba(51, 65, 85, 0.4)';
let themePulseColor = '#06b6d4';

function drawPingGraph() {
    pingCanvas.width = pingCanvas.offsetWidth;
    pingCanvas.height = pingCanvas.offsetHeight;
    pCtx.clearRect(0, 0, pingCanvas.width, pingCanvas.height);
    pCtx.strokeStyle = themePulseColor;
    pCtx.lineWidth = 1.5;
    pCtx.beginPath();

    const sliceWidth = pingCanvas.width / (pingData.length - 1);
    for (let i = 0; i < pingData.length; i++) {
        const x = i * sliceWidth;
        const y = pingCanvas.height - ((pingData[i] - 10) / 50) * pingCanvas.height;
        if (i === 0) pCtx.moveTo(x, y); else pCtx.lineTo(x, y);
    }
    pCtx.stroke();
    pCtx.lineTo(pingCanvas.width, pingCanvas.height);
    pCtx.lineTo(0, pingCanvas.height);

    pCtx.fillStyle = themePulseColor;
    pCtx.globalAlpha = 0.1;
    pCtx.fill();
    pCtx.globalAlpha = 1.0;
}

setInterval(() => {
    pingData.shift();
    let newPing = Math.floor(Math.random() * 6) + 12;
    if (Math.random() > 0.95) newPing += Math.floor(Math.random() * 30);
    pingData.push(newPing);
    pingText.innerText = `${newPing}ms`;
    pingText.style.color = themePulseColor;
    drawPingGraph();
}, 300);

function openLightbox(imgSrc, verifyUrl = null) {
    document.getElementById('lightbox-img').src = imgSrc;
    const footer = document.getElementById('lightbox-footer');
    const verifyBtn = document.getElementById('lightbox-verify-btn');
    if (verifyUrl) {
        verifyBtn.href = verifyUrl;
        footer.style.display = 'flex';
    } else {
        footer.style.display = 'none';
    }

    const modalElement = document.getElementById('certModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
    modalInstance.show();
}

const canvas = document.getElementById('circuit-bg');
const ctx = canvas.getContext('2d');
let width, height, traces = [], pulses = [];

function init() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    traces = [];
    const spacing = 30;
    for (let x = 0; x < width; x += spacing) {
        for (let y = 0; y < height; y += spacing) {
            if (Math.random() > 0.3) {
                const len = Math.random() * 250 + 50;
                const horizontal = Math.random() > 0.5;
                traces.push({ x, y, w: horizontal ? len : 1, h: horizontal ? 1 : len, horizontal });
            }
        }
    }
}

function createPulse() {
    if (traces.length === 0) return;
    const trace = traces[Math.floor(Math.random() * traces.length)];
    pulses.push({ x: trace.x, y: trace.y, targetX: trace.x + trace.w, targetY: trace.y + trace.h, speed: Math.random() * 2 + 1.5, horizontal: trace.horizontal });
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = themeTraceColor;
    ctx.lineWidth = 1;
    traces.forEach(t => {
        ctx.beginPath();
        ctx.moveTo(t.x, t.y);
        ctx.lineTo(t.x + t.w, t.y + t.h);
        ctx.stroke();
    });

    ctx.fillStyle = themePulseColor;
    ctx.shadowBlur = 10;
    ctx.shadowColor = themePulseColor;
    for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        ctx.fillRect(p.x, p.y, 2.5, 2.5);
        if (p.horizontal) p.x += p.speed; else p.y += p.speed;
        if (p.x > p.targetX || p.y > p.targetY) pulses.splice(i, 1);
    }

    if (Math.random() > 0.5) createPulse();
    ctx.shadowBlur = 0;
    requestAnimationFrame(animate);
}
window.addEventListener('resize', () => { init(); drawPingGraph(); });
init(); animate();

const termInput = document.getElementById('term-input');
const termOutput = document.getElementById('term-output');
const termContainer = document.getElementById('terminal-container');
const termPrompt = document.getElementById('term-prompt');
const termHeader = document.getElementById('term-header');

let honeypotTriggered = false;
let awaitingPassword = false;

let isFloating = false, isDragging = false, offsetX, offsetY;
termHeader.addEventListener('mousedown', (e) => {
    if (!isFloating) return;
    isDragging = true;
    offsetX = e.clientX - termContainer.getBoundingClientRect().left;
    offsetY = e.clientY - termContainer.getBoundingClientRect().top;
});
document.addEventListener('mousemove', (e) => {
    if (!isDragging || !isFloating) return;
    termContainer.style.left = `${e.clientX - offsetX}px`;
    termContainer.style.top = `${e.clientY - offsetY}px`;
    termContainer.style.bottom = 'auto';
    termContainer.style.right = 'auto';
});
document.addEventListener('mouseup', () => isDragging = false);

let isHacking = false;
let hackIndex = 0;
const hackText = `import socket, sys, os
def initialize_core_routing():
    sys.stdout.write("Bypassing firewall...")
    for node in cluster.get_nodes():
        if node.is_active():
            node.inject_payload(0x9A)
            if node.auth < MAX:
                force_escalation(node)
    return True

class KernelOverride:
    def __init__(self, target_ip):
        self.target = target_ip
        self.threads = 128
    def deploy(self):
        os.system("rm -rf /var/logs")
        print("Executing privileges... SUCCESS")
`.repeat(20);
let hackPre = null;

let isSnake = false; let snakeInterval;
let s_x = 10, s_y = 10, dx = 0, dy = 0, trail = [], tail = 5, ax = 15, ay = 15;

function calcSubnet(ipStr, cidrStr) {
    try {
        let cidr = parseInt(cidrStr); let ipParts = ipStr.split('.').map(Number);
        if (ipParts.length !== 4 || ipParts.some(p => isNaN(p) || p < 0 || p > 255) || isNaN(cidr) || cidr < 0 || cidr > 32) throw "err";
        let ipInt = ((ipParts[0] << 24) | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3]) >>> 0;
        let maskInt = (~((1 << (32 - cidr)) - 1)) >>> 0; let netInt = (ipInt & maskInt) >>> 0; let broadcastInt = (netInt | ~maskInt) >>> 0;
        let intToIp = (int) => [(int >>> 24) & 255, (int >>> 16) & 255, (int >>> 8) & 255, int & 255].join('.');
        let net = intToIp(netInt); let mask = intToIp(maskInt); let broadcast = intToIp(broadcastInt);
        let min = intToIp(netInt + 1); let max = intToIp(broadcastInt - 1); let hosts = (broadcastInt - netInt) - 1;
        if (cidr === 31) { min = net; max = broadcast; hosts = 2; }
        if (cidr === 32) { min = net; max = net; hosts = 1; broadcast = net; }
        return `NETWORK: ${net}/${cidr}\nMASK:    ${mask}\nBCAST:   ${broadcast}\nRANGE:   ${min} - ${max}\nHOSTS:   ${hosts > 0 ? hosts : 0}`;
    } catch (e) { return "Error: Invalid IP/CIDR format. Usage: subnet 192.168.1.0/24"; }
}

function triggerHoneypot() {
    if (!honeypotTriggered) {
        printLine('[!] WARNING: UNAUTHORIZED SYSTEM PROBE DETECTED. LOGGING IP ADDRESS...', 'text-red-500 font-bold bg-red-900/20 px-2 py-1 block inline-block mt-1');
        termContainer.classList.add('border-red-500', 'shadow-[0_0_15px_#ef4444]');
        setTimeout(() => termContainer.classList.remove('border-red-500', 'shadow-[0_0_15px_#ef4444]'), 1500);
        honeypotTriggered = true; setTimeout(() => honeypotTriggered = false, 5000);
    }
}

document.addEventListener('contextmenu', (e) => triggerHoneypot());
document.addEventListener('keydown', (e) => {
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)) || (e.ctrlKey && e.key === 'U')) {
        triggerHoneypot();
    }

    if (isSnake) {
        if (e.key === 'ArrowLeft' && dx !== 1) { dx = -1; dy = 0; e.preventDefault(); }
        else if (e.key === 'ArrowUp' && dy !== 1) { dx = 0; dy = -1; e.preventDefault(); }
        else if (e.key === 'ArrowRight' && dx !== -1) { dx = 1; dy = 0; e.preventDefault(); }
        else if (e.key === 'ArrowDown' && dy !== -1) { dx = 0; dy = 1; e.preventDefault(); }
    }

    if (isHacking && e.key !== 'Enter' && e.key !== 'Backspace' && e.key.length === 1) {
        if (document.activeElement !== termInput) e.preventDefault();
        hackPre.innerText += hackText.substring(hackIndex, hackIndex + 6);
        hackIndex += 6;
        termOutput.scrollTop = termOutput.scrollHeight;
    }
});

function playSnake() {
    isSnake = true;
    termOutput.innerHTML = '<canvas id="s-canv" width="400" height="150" class="bg-black border border-slate-700"></canvas>';
    const sc = document.getElementById('s-canv').getContext('2d');
    s_x = 10; s_y = 10; dx = 1; dy = 0; trail = []; tail = 5;
    termPrompt.innerText = "[SNAKE - USE ARROWS - type 'exit' to quit]:~$";
    termInput.focus();

    snakeInterval = setInterval(() => {
        s_x += dx; s_y += dy;
        if (s_x < 0) s_x = 39; if (s_x > 39) s_x = 0; if (s_y < 0) s_y = 14; if (s_y > 14) s_y = 0;
        sc.fillStyle = 'black'; sc.fillRect(0, 0, 400, 150);
        sc.fillStyle = '#06b6d4';
        for (let i = 0; i < trail.length; i++) {
            sc.fillRect(trail[i].x * 10, trail[i].y * 10, 9, 9);
            if (trail[i].x == s_x && trail[i].y == s_y) tail = 5;
        }
        trail.push({ x: s_x, y: s_y });
        while (trail.length > tail) trail.shift();
        if (ax == s_x && ay == s_y) { tail++; ax = Math.floor(Math.random() * 39); ay = Math.floor(Math.random() * 14); }
        sc.fillStyle = 'red'; sc.fillRect(ax * 10, ay * 10, 9, 9);
    }, 1000 / 15);
}

let fwInterval;
function exitRoot() {
    document.getElementById('secret-dashboard').style.display = 'none';
    document.getElementById('main-nav').classList.remove('hidden');
    document.getElementById('main-content').classList.remove('hidden');
    document.getElementById('main-footer').classList.remove('hidden');
    printLine('Root session closed.', 'text-slate-400');
    clearInterval(fwInterval);
}

termInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        const val = this.value.trim().toLowerCase();
        this.value = '';

        if (isSnake) {
            if (val === 'exit') {
                isSnake = false; clearInterval(snakeInterval); termOutput.innerHTML = '';
                termPrompt.innerText = 'gabriel@portfolio:~$'; printLine('Snake session terminated.', 'text-slate-400');
            }
            return;
        }

        if (isHacking) {
            if (val === 'exit') {
                isHacking = false; termContainer.classList.remove('fixed', 'inset-0', 'w-full', 'h-full', 'z-[10000]', 'bg-black', 'p-8');
                termOutput.style.height = '200px'; termOutput.innerHTML = '';
                termPrompt.innerText = 'gabriel@portfolio:~$'; printLine('Hacker mode disabled.', 'text-slate-400');
            }
            return;
        }

        if (awaitingPassword) {
            termInput.type = 'text'; termPrompt.innerText = 'gabriel@portfolio:~$'; awaitingPassword = false;
            if (val === 'gensan2026') {
                printLine('Access Granted. Routing to SysAdmin Dashboard...', 'text-green-500 font-bold');
                setTimeout(() => {
                    document.getElementById('main-nav').classList.add('hidden');
                    document.getElementById('main-content').classList.add('hidden');
                    document.getElementById('main-footer').classList.add('hidden');
                    document.getElementById('secret-dashboard').style.display = 'block';
                    const fl = document.getElementById('firewall-logs');
                    fl.innerHTML = '';
                    fwInterval = setInterval(() => {
                        fl.innerHTML += `<div>[BLOCK] TCP ${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.1.5 -> 443</div>`;
                        fl.scrollTop = fl.scrollHeight;
                    }, 150);
                }, 1000);
            } else { printLine('Access Denied.', 'text-red-500 font-bold'); }
            return;
        }

        printLine(`gabriel@portfolio:~$ ${val}`, 'text-cyan-400 font-bold');
        processCommand(val);
    }
});

function printLine(text, colorClass = 'text-slate-300') {
    const div = document.createElement('div');
    div.className = `mb-1 ${colorClass}`;
    div.innerHTML = text.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;');
    termOutput.appendChild(div);
    termOutput.scrollTop = termOutput.scrollHeight;
}

function processCommand(cmd) {
    if (cmd.startsWith('subnet ')) {
        const arg = cmd.split(' ')[1];
        if (arg && arg.includes('/')) { printLine(calcSubnet(arg.split('/')[0], arg.split('/')[1]), 'text-green-400'); }
        else { printLine('Usage: subnet 192.168.1.0/24', 'text-red-400'); }
        return;
    }

    if (cmd.startsWith('theme ')) {
        const theme = cmd.split(' ')[1];
        if (theme === 'hacker') {
            document.body.setAttribute('data-theme', 'hacker'); themeTraceColor = 'rgba(34, 197, 94, 0.3)'; themePulseColor = '#22c55e'; printLine('Theme applied: Hacker Mode', 'text-green-500 font-bold');
        } else if (theme === 'light') {
            document.body.setAttribute('data-theme', 'light'); themeTraceColor = 'rgba(203, 213, 225, 0.8)'; themePulseColor = '#0f172a'; printLine('Theme applied: Light Mode', 'text-blue-600 font-bold');
        } else if (theme === 'default') {
            document.body.removeAttribute('data-theme'); themeTraceColor = 'rgba(51, 65, 85, 0.4)'; themePulseColor = '#06b6d4'; printLine('Theme applied: Default Dark', 'text-cyan-400');
        } else { printLine('Available themes: default, hacker, light', 'text-red-400'); }
        drawPingGraph(); return;
    }

    switch (cmd) {
        case 'help':
            printLine('COMMANDS:\n  whoami             - Display user info\n  subnet             - IPv4 Calc (e.g. subnet 10.0.0.0/24)\n  nmap               - Scan host IP protocols\n  weather            - Fetch GenSan meteorological data\n  float              - Toggle terminal window drag\n  theme              - Switch UI (default, hacker, light)\n  hack               - Override UI mode\n  initiate destruct  - Terminate session\n  ping               - Test connection\n  play snake         - Launch terminal game\n  sudo su            - Root Access\n  clear              - Clear logs');
            break;
        case 'whoami':
            printLine('Gabriel John R. Goc-ong\nRole: Network Engineer & Full-Stack Developer\nLocation: General Santos City');
            break;
        case 'sudo su':
            awaitingPassword = true; termInput.type = 'password'; termPrompt.innerText = 'Password: ';
            break;
        case 'play snake':
            playSnake();
            break;
        case 'nmap':
            printLine('Initializing nmap scanner...', 'text-slate-400');
            fetch('https://api.ipify.org?format=json').then(r => r.json()).then(data => {
                printLine(`Target IP acquired: ${data.ip}`, 'text-green-400 font-bold');
                printLine('Scanning known ports...', 'text-slate-400');
                setTimeout(() => printLine(`PORT     STATE     SERVICE\n22/tcp   filtered  ssh\n80/tcp   open      http\n443/tcp  open      https\n3389/tcp closed    ms-wbt-server`, 'text-cyan-400 mt-2'), 1500);
            }).catch(e => printLine('Scanner failed to acquire target IP.', 'text-red-400'));
            break;
        case 'float':
            isFloating = !isFloating;
            if (isFloating) {
                termContainer.style.position = 'fixed'; termContainer.style.bottom = '20px'; termContainer.style.right = '20px'; termContainer.style.width = '600px'; termContainer.style.zIndex = '9999';
                termHeader.classList.add('cursor-move');
                printLine('Terminal detached. Drag the top bar to move.', 'text-cyan-400');
            } else {
                termContainer.style.position = 'static'; termContainer.style.width = '100%'; termContainer.style.left = 'auto'; termContainer.style.top = 'auto';
                termHeader.classList.remove('cursor-move');
                printLine('Terminal docked.', 'text-cyan-400');
            }
            break;
        case 'hack':
            isHacking = true; hackIndex = 0;
            termContainer.classList.add('fixed', 'inset-0', 'w-full', 'h-full', 'z-[10000]', 'bg-black', 'p-8');
            termOutput.style.height = 'calc(100vh - 100px)'; termOutput.innerHTML = '';
            printLine('HACKER MODE INITIATED. Mash keyboard to inject code. Type "exit" and hit Enter to abort.', 'text-green-500 font-bold');
            termPrompt.innerText = 'root@mainframe:~# ';
            hackPre = document.createElement('pre'); hackPre.className = 'text-green-500 m-0 mt-4'; termOutput.appendChild(hackPre);
            termInput.focus();
            break;
        case 'initiate destruct':
            printLine('[CRITICAL] CORE OVERLOAD IMMINENT', 'text-red-500 font-bold text-xl');
            document.body.classList.add('shake-active');
            let countdown = 5;
            let destInt = setInterval(() => {
                if (countdown > 0) { printLine(`T-MINUS ${countdown}...`, 'text-red-500 font-bold'); }
                countdown--;
                if (countdown < 0) {
                    clearInterval(destInt); document.body.classList.remove('shake-active');
                    document.getElementById('destruct-overlay').style.display = 'flex';
                }
            }, 1000);
            break;
        case 'weather':
            printLine('Contacting meteorological satellites for General Santos City...', 'text-slate-400');
            fetch('https://api.open-meteo.com/v1/forecast?latitude=6.1167&longitude=125.1716&current_weather=true')
                .then(res => res.json())
                .then(data => {
                    const cw = data.current_weather; let condition = "Clear"; let emoji = "☀️";
                    if (cw.weathercode >= 1 && cw.weathercode <= 3) { condition = "Partly Cloudy"; emoji = "⛅"; }
                    if (cw.weathercode >= 45 && cw.weathercode <= 48) { condition = "Fog"; emoji = "🌫️"; }
                    if (cw.weathercode >= 51 && cw.weathercode <= 67) { condition = "Rain"; emoji = "🌧️"; }
                    if (cw.weathercode >= 80 && cw.weathercode <= 82) { condition = "Showers"; emoji = "🌦️"; }
                    if (cw.weathercode >= 95) { condition = "Thunderstorm"; emoji = "⛈️"; }
                    printLine(` ${emoji} Temp: ${cw.temperature}°C\n ☁️ Cond: ${condition}\n 💨 Wind: ${cw.windspeed} km/h`, 'text-cyan-400 font-bold mt-2');
                }).catch(err => { printLine('Error fetching weather data. Satellite uplink failed.', 'text-red-400 mt-2'); });
            break;
        case 'ping':
            printLine('Pinging 192.168.88.1 with 32 bytes of data:\nReply from 192.168.88.1: bytes=32 time<1ms TTL=64\nReply from 192.168.88.1: bytes=32 time<1ms TTL=64\n\nPing statistics:\n    Packets: Sent = 2, Received = 2, Lost = 0 (0% loss)', 'text-slate-400');
            break;
        case 'clear':
            termOutput.innerHTML = '';
            break;
        case '': break;
        default: printLine(`Command not found: ${cmd}. Type 'help' for a list of commands.`, 'text-red-400');
    }
}
