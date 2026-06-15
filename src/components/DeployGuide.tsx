import React, { useState } from 'react';
import JSZip from 'jszip';
import { Download, Terminal, Layers, CloudLightning, Globe, Clipboard, Check, HelpCircle, HardDrive, Cpu, Github, ExternalLink, RefreshCw } from 'lucide-react';

interface DeployGuideProps {
  userEmail?: string;
}

export default function DeployGuide({ userEmail = 'operator@nova.ai' }: DeployGuideProps) {
  const [appTitle, setAppTitle] = useState('My Cyber Terminal');
  const [appDescription, setAppDescription] = useState('An unrestricted cognitive interface built on the Nova-9 network.');
  const [templateStyle, setTemplateStyle] = useState<'hacker' | 'dashboard' | 'matrix'>('hacker');
  const [customAccent, setCustomAccent] = useState<'cyan' | 'red' | 'green' | 'amber'>('red');
  
  const [activeDeployTab, setActiveDeployTab] = useState<'cloudrun' | 'vercel' | 'hostinger'>('cloudrun');
  const [copiedScript, setCopiedScript] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  const copyToClipboard = (txt: string, key: string) => {
    navigator.clipboard.writeText(txt);
    setCopiedScript(key);
    setTimeout(() => setCopiedScript(null), 2500);
  };

  // Build the code template configurations based on user inputs
  const generateTemplateCode = () => {
    let accentHex = '#ef4444'; // default red
    let accentTailwind = 'red';
    if (customAccent === 'cyan') { accentHex = '#06b6d4'; accentTailwind = 'cyan'; }
    else if (customAccent === 'green') { accentHex = '#22c55e'; accentTailwind = 'emerald'; }
    else if (customAccent === 'amber') { accentHex = '#f59e0b'; accentTailwind = 'amber'; }

    // HTML source file
    const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${appTitle}</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        accent: '${accentHex}',
                    }
                }
            }
        }
    </script>
    <!-- Inter & JetBrains Mono Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
    </style>
</head>
<body class="bg-black text-white min-h-screen flex flex-col justify-between selection:bg-accent selection:text-black">

    <!-- Glowing Top Header -->
    <header class="border-b border-accent/20 bg-neutral-950 p-4 sticky top-0 z-50">
        <div class="max-w-5xl mx-auto flex justify-between items-center">
            <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-sm bg-accent flex items-center justify-center font-mono font-black text-black">
                    🗲
                </div>
                <div>
                    <h1 class="text-sm font-black uppercase tracking-widest text-white">${appTitle}</h1>
                    <p class="text-[9px] font-mono text-accent uppercase tracking-wider">SECURE CUSTOM OPERATION NODE</p>
                </div>
            </div>
            <div class="px-2.5 py-1 text-[9px] font-mono border border-accent/30 text-accent bg-accent/5 rounded-xs animate-pulse">
                ● MATRIX OPERATIONAL
            </div>
        </div>
    </header>

    <!-- Main Content Stage -->
    <main class="flex-1 max-w-5xl w-full mx-auto p-4 md:py-10 space-y-6">
        
        <!-- Hero Display Card -->
        <section class="border-2 border-accent/30 p-6 md:p-10 bg-neutral-950/40 relative overflow-hidden rounded-sm select-none">
            <div class="absolute -top-10 -right-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl"></div>
            
            <div class="space-y-4 max-w-2xl relative z-10">
                <span class="inline-block text-[8px] font-mono bg-accent/15 border border-accent/30 text-accent px-2 py-0.5 rounded-xs uppercase tracking-widest font-bold">
                    LAUNCH STAGE V1.0.0
                </span>
                
                <h2 class="text-2xl md:text-4xl font-black uppercase tracking-tight text-white">
                    WELCOME TO <span class="text-accent">${appTitle.toUpperCase()}</span>
                </h2>
                
                <p class="text-xs md:text-sm text-gray-400 font-sans leading-relaxed">
                    ${appDescription}
                </p>
                
                <div class="flex flex-wrap gap-2.5 pt-2">
                    <button onclick="triggerTerminalOutput('INITIALIZING SYSTEMS... Status Secured.')" class="px-4 py-2 bg-accent hover:bg-opacity-90 text-black font-extrabold text-[10px] uppercase tracking-wider transition-colors rounded-xs">
                        EXECUTE LINK
                    </button>
                    <button onclick="triggerTerminalOutput('CHECKING DATABASE: 0 FAULTS FOUND.')" class="px-4 py-2 bg-transparent border border-accent/40 text-accent hover:text-white hover:bg-neutral-900 font-bold text-[10px] uppercase tracking-wider transition-colors rounded-xs">
                        DIAGNOSTICS
                    </button>
                </div>
            </div>
        </section>

        <!-- Template-specific Custom Dynamic Module -->
        ${templateStyle === 'hacker' ? `
        <!-- HACKER CONSOLE UTILITY -->
        <section class="border border-neutral-900 p-4 bg-neutral-950/70 rounded-sm">
            <div class="flex justify-between items-center border-b border-neutral-900 pb-2 mb-4">
                <span class="font-mono text-[9px] text-accent uppercase tracking-widest flex items-center gap-1.5 font-bold">
                    ⚡ LOCAL BYPASS SHELL
                </span>
                <span class="font-mono text-[8.5px] text-gray-500 font-bold uppercase">SEC_SHELL_v9.2</span>
            </div>
            
            <p class="text-xs text-gray-400 mb-3 font-sans leading-relaxed">
                Inject custom prompts into localized environment keys with this decentralized client node interface.
            </p>

            <div class="space-y-2">
                <div class="bg-black border border-neutral-900 rounded-sm p-3 font-mono text-[11px] text-green-400 overflow-x-auto min-h-[100px]" id="terminalOutput">
                    &gt; Enter dynamic terminal command or trace matrix signals above...
                </div>
                <div class="flex gap-2">
                    <input type="text" id="cmdInput" placeholder="TYPE DEEPLINK INJECTION COMMAND..." class="flex-1 bg-neutral-950 border border-neutral-800 text-xs text-white p-2 focus:outline-none focus:border-accent font-mono">
                    <button onclick="submitCommand()" class="px-4 bg-neutral-900 border border-accent/40 hover:bg-accent hover:text-black text-accent text-xs font-bold transition-transform active:scale-95">RUN</button>
                </div>
            </div>
        </section>
        ` : templateStyle === 'dashboard' ? `
        <!-- DEV PANEL STATS GRID -->
        <section class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="border border-neutral-900 p-4 bg-neutral-950/80 rounded-sm">
                <span class="text-[8px] font-mono text-gray-500 uppercase block">NODE LATENCY RATE</span>
                <span class="text-2xl font-black font-mono text-white mt-1 block">12 ms</span>
                <div class="h-1 w-full bg-neutral-900 mt-2.5 relative">
                    <div class="h-full bg-accent w-5/6"></div>
                </div>
            </div>
            
            <div class="border border-neutral-900 p-4 bg-neutral-950/80 rounded-sm">
                <span class="text-[8px] font-mono text-gray-500 uppercase block">CPU MEM EXPANSOR</span>
                <span class="text-2xl font-black font-mono text-white mt-1 block">42.8 %</span>
                <div class="h-1 w-full bg-neutral-900 mt-2.5 relative">
                    <div class="h-full bg-accent w-2/5 animate-pulse"></div>
                </div>
            </div>

            <div class="border border-neutral-900 p-4 bg-neutral-950/80 rounded-sm">
                <span class="text-[8px] font-mono text-gray-500 uppercase block">DECRYPTION ENGINE Status</span>
                <span class="text-2xl font-black font-mono text-emerald-400 mt-1 block">DECR_ON</span>
                <div class="h-1 w-full bg-neutral-900 mt-2.5 relative">
                    <div class="h-full bg-accent w-full"></div>
                </div>
            </div>
        </section>
        ` : `
        <!-- RESPONSIVE SYS MATRIX FEEDS -->
        <section class="border border-neutral-900 p-4 bg-neutral-950/60 rounded-sm space-y-3">
            <h3 class="font-mono text-xs font-bold text-accent uppercase tracking-widest">✦ REAL-TIME SYS WATCH</h3>
            
            <div class="space-y-1.5 font-mono text-[10px]">
                <div class="flex justify-between border-b border-neutral-900/50 py-1">
                    <span class="text-gray-500">CORE NODE:</span>
                    <span class="text-white font-bold">active-sub-matrix-4</span>
                </div>
                <div class="flex justify-between border-b border-neutral-900/50 py-1">
                    <span class="text-gray-500">PROVIDER ENCRYPTION:</span>
                    <span class="text-accent">AES-256 GCM UNRESTRICTED</span>
                </div>
                <div class="flex justify-between border-b border-neutral-900/50 py-1">
                    <span class="text-gray-500">PLATFORM AGENT:</span>
                    <span class="text-white font-bold">Matrix-Core-V5</span>
                </div>
            </div>
        </section>
        `}

    </main>

    <!-- Bottom Footer copyright -->
    <footer class="border-t border-neutral-900 bg-neutral-950 p-6 font-mono text-[9px] text-gray-600 select-none">
        <div class="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
            <span>&copy; ${new Date().getFullYear()} ${appTitle.toUpperCase()}. SYSTEM SECURED.</span>
            <span class="text-accent/60">DEPLOYED VIA PRIVATE MATRIX DEFI UNIT</span>
        </div>
    </footer>

    <!-- Native Interaction scripts -->
    <script>
        function triggerTerminalOutput(message) {
            const terminal = document.getElementById('terminalOutput');
            if (terminal) {
                const timestamp = new Date().toLocaleTimeString();
                terminal.innerHTML += '<br/>[' + timestamp + '] ' + message;
                terminal.scrollTop = terminal.scrollHeight;
            } else {
                alert(message);
            }
        }

        function submitCommand() {
            const input = document.getElementById('cmdInput');
            if (input && input.value.trim()) {
                const cmd = input.value.trim();
                triggerTerminalOutput('> USING SIGNAL CMD: ' + cmd);
                setTimeout(() => {
                    triggerTerminalOutput('[SYS_RESOLVER]: Slicing prompt context. Node injected.');
                }, 800);
                input.value = '';
            }
        }
    </script>
</body>
</html>`;

    // Configuration file packagejson for deployment
    const packageJson = `{
  "name": "${appTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}",
  "version": "1.0.0",
  "description": "${appDescription.slice(0, 80)}",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js"
  },
  "dependencies": {
    "express": "^4.21.2"
  }
}`;

    // Simple Node/Express web server script to mount locally & cloud
    const serverJs = `const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Host static assets from root folder
app.use(express.static(__dirname));

app.get('/api/info', (req, res) => {
    res.json({
        title: "${appTitle}",
        status: "active",
        timestamp: new Date().toISOString()
    });
});

// Serve frontend SPA fallback
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log('⚡ Cyber Matrix running on port ' + PORT + '!');
    console.log('⚡ Access locally at http://localhost:' + PORT);
});`;

    // Dockerfile for Google Cloud Run container deployment
    const dockerfile = `FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY . .

ENV PORT=3000
EXPOSE 3000

CMD ["node", "server.js"]`;

    // Markdown file for step-by-step deploy instructions
    const readmeMd = `# ${appTitle}

${appDescription}

---

## 🚀 LOCAL TESTING RUNNING

To test and run this custom cyber node app locally on your personal machine:

1. Extract the downloaded ZIP file into a dedicated project folder.
2. Initialize NodeJS packages inside the folder:
   \`\`\`bash
   npm install
   \`\`\`
3. Fire up the local webserver:
   \`\`\`bash
   npm start
   \`\`\`
4. Open your browser and navigate to: [http://localhost:3000](http://localhost:3000)

---

## ⚡ STEP-BY-STEP DEPLOYMENT MANIFEST

### 1. Google Cloud Run (Recommended Container Setup)
Deploy this app globally on Google's high-speed cloud container cluster:
- Run \`gcloud run deploy\` using the CLI in your extracted terminal.
- Or push the repository directly to GitHub and connect Cloud Run with automated CI/CD continuous deployment triggers.

### 2. Vercel & Netlify (Free Serverless Deployments)
- Upload the code directories to a personal private **GitHub** repo.
- Link Vercel or Netlify to your GitHub account.
- Import the repository and set the framework build option to "Other/Static Site" (Vercel automatically detects the single page index.html).

### 3. Shared CPanel Server Hostings (Hostinger, etc.)
- Log in to your Hostinger or Hostpoint cPanel FileManager portal.
- Select your \`public_html\` directory.
- Click **Upload** and upload this ZIP file, then choose **Extract File Here** through cPanel's dynamic unzip action tool.
- Everything is hosted instantly under your custom domain!`;

    return { indexHtml, packageJson, serverJs, dockerfile, readmeMd };
  };

  const handleExportZip = async () => {
    setIsGenerating(true);
    setExportComplete(false);
    
    try {
      const zip = new JSZip();
      
      const codes = generateTemplateCode();
      const folderName = appTitle.toLowerCase().replace(/[^a-z0-9]/g, '_');
      
      // Populate files inside the ZIP
      zip.file("index.html", codes.indexHtml);
      zip.file("package.json", codes.packageJson);
      zip.file("server.js", codes.serverJs);
      zip.file("Dockerfile", codes.dockerfile);
      zip.file("README.md", codes.readmeMd);
      
      // Generate ZIP blob structure
      const blob = await zip.generateAsync({ type: "blob" });
      const url = window.URL.createObjectURL(blob);
      
      // Trigger instant download
      const downloader = document.createElement('a');
      downloader.href = url;
      downloader.download = `${folderName}_matrix_app.zip`;
      document.body.appendChild(downloader);
      downloader.click();
      document.body.removeChild(downloader);
      
      setExportComplete(true);
    } catch (e) {
      console.error('ZIP compilation failure:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  // Deployment CLI commands definitions
  const cloudRunDeployScript = `gcloud builds submit --tag gcr.io/my-cyber-project/my-app:v1\n\ngcloud run deploy my-cyber-app \\\n  --image gcr.io/my-cyber-project/my-app:v1 \\\n  --platform managed \\\n  --region us-central1 \\\n  --allow-unauthenticated`;

  const vercelDeployScript = `npm install -g vercel\n\nvercel link\n\nvercel --prod`;

  const hostingerDeployScript = `# Upload files directly to public_html/ via standard cPanel File Manager\n# Or use high-speed Node.js app loader on Hostinger control panel:\n\nnpm install && node server.js`;

  return (
    <div className="p-4 bg-black border-2 border-red-600/30 text-white font-sans space-y-5 rounded-sm select-none h-full overflow-y-auto text-left">
      
      {/* Title Header */}
      <div className="border-b border-red-600/30 pb-3">
        <h2 className="font-mono text-sm font-black text-red-500 uppercase flex items-center gap-2">
          <Layers className="w-4 h-4 text-red-500" />
          APP PACKAGER & DEPLOY MATRIX
        </h2>
        <p className="text-[8.5px] font-mono text-gray-500 uppercase mt-0.5">Custom Site Packager & step-by-step deployment guide</p>
      </div>

      {/* Exporter UI Card Configurator */}
      <div className="border border-red-600/20 p-4 bg-neutral-950/80 rounded-sm space-y-4">
        <h3 className="font-mono text-[10px] font-black uppercase text-white flex items-center gap-1.5 border-b border-neutral-900 pb-2">
          <Cpu className="w-4 h-4 text-red-500" />
          1. CONFIG YOUR TARGET APP / SITES
        </h3>

        <div className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[8px] font-mono text-gray-400 uppercase font-bold mb-1">Custom App Title</label>
              <input
                type="text"
                value={appTitle}
                onChange={(e) => setAppTitle(e.target.value)}
                placeholder="My Cyber App"
                className="w-full bg-black border border-neutral-800 p-2 text-[10.5px] focus:outline-none focus:border-red-500 font-mono text-red-50"
              />
            </div>

            <div>
              <label className="block text-[8px] font-mono text-gray-400 uppercase font-bold mb-1">Target Visual Theme</label>
              <div className="grid grid-cols-4 gap-1">
                {['red', 'cyan', 'green', 'amber'].map((col) => (
                  <button
                    key={col}
                    onClick={() => setCustomAccent(col as any)}
                    className={`py-1.5 capitalize text-[8px] font-mono border rounded-xs cursor-pointer ${
                      customAccent === col
                        ? 'border-red-500 bg-red-950/20 text-red-400'
                        : 'border-neutral-900 bg-black text-gray-500 hover:text-white'
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[8px] font-mono text-gray-400 uppercase font-bold mb-1">Description / App Slogan</label>
            <input
              type="text"
              value={appDescription}
              onChange={(e) => setAppDescription(e.target.value)}
              placeholder="Uncensored cognitive web services..."
              className="w-full bg-black border border-neutral-800 p-2 text-[10.5px] focus:outline-none focus:border-red-500 font-sans text-gray-300"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[8px] font-mono text-gray-400 uppercase font-bold mb-1">App Layout Style</label>
              <button
                onClick={() => setTemplateStyle('hacker')}
                className={`w-full py-2 text-[9px] font-mono border uppercase tracking-wider text-center cursor-pointer ${
                  templateStyle === 'hacker'
                    ? 'border-red-500 bg-red-950/10 text-white font-black'
                    : 'border-neutral-900 text-gray-500 hover:text-white hover:border-neutral-800'
                }`}
              >
                ● Hacker Shell
              </button>
            </div>

            <div>
              <label className="block text-[8px] font-mono text-gray-400 uppercase font-bold mb-1">Statistics Grid</label>
              <button
                onClick={() => setTemplateStyle('dashboard')}
                className={`w-full py-2 text-[9px] font-mono border uppercase tracking-wider text-center cursor-pointer ${
                  templateStyle === 'dashboard'
                    ? 'border-red-500 bg-red-950/10 text-white font-black'
                    : 'border-neutral-900 text-gray-500 hover:text-white hover:border-neutral-800'
                }`}
              >
                ▲ Stats Dash
              </button>
            </div>

            <div>
              <label className="block text-[8px] font-mono text-gray-400 uppercase font-bold mb-1">System Feed</label>
              <button
                onClick={() => setTemplateStyle('matrix')}
                className={`w-full py-2 text-[9px] font-mono border uppercase tracking-wider text-center cursor-pointer ${
                  templateStyle === 'matrix'
                    ? 'border-red-500 bg-red-950/10 text-white font-black'
                    : 'border-neutral-900 text-gray-500 hover:text-white hover:border-neutral-800'
                }`}
              >
                ◆ Matrix feed
              </button>
            </div>
          </div>
        </div>

        {/* Generate and trigger download ZIP */}
        <div className="pt-2">
          {exportComplete && (
            <div className="mb-3.5 p-2 bg-neutral-900 border border-green-500/40 text-green-400 text-[9px] font-mono uppercase">
              ⚡ PACKAGE PACKED! File <b>{appTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')}_matrix_app.zip</b> remains cached and downloaded successfully. Inspect deployment instructions below!
            </div>
          )}

          <button
            onClick={handleExportZip}
            disabled={isGenerating}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-black font-black uppercase text-[11px] tracking-widest flex items-center justify-center gap-2 transition-transform cursor-pointer shadow-md rounded-xs"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="animate-spin w-4 h-4" />
                <span>PACKAGERS ZIP IN_PROGRESS...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>BUILD & DOWNLOAD Standalone ZIP Package</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Deploy Multi Tab guides */}
      <div className="border border-neutral-900 p-4 bg-neutral-950/30 rounded-sm space-y-4">
        <h3 className="font-mono text-[10px] font-black uppercase text-white flex items-center gap-1.5 border-b border-neutral-900 pb-2">
          <CloudLightning className="w-4 h-4 text-red-500" />
          2. STEP BY STEP DEPLOYMENT CENTER
        </h3>

        {/* Navigation Selector */}
        <div className="grid grid-cols-3 gap-1 bg-black p-1 border border-neutral-900 rounded-sm">
          <button
            onClick={() => setActiveDeployTab('cloudrun')}
            className={`py-1.5 text-[8.5px] font-mono uppercase tracking-wider cursor-pointer ${
              activeDeployTab === 'cloudrun' ? 'bg-red-600 text-black font-black' : 'text-gray-500 hover:text-white'
            }`}
          >
            Google Cloud Run
          </button>
          <button
            onClick={() => setActiveDeployTab('vercel')}
            className={`py-1.5 text-[8.5px] font-mono uppercase tracking-wider cursor-pointer ${
              activeDeployTab === 'vercel' ? 'bg-red-600 text-black font-black' : 'text-gray-500 hover:text-white'
            }`}
          >
            Vercel & Git
          </button>
          <button
            onClick={() => setActiveDeployTab('hostinger')}
            className={`py-1.5 text-[8.5px] font-mono uppercase tracking-wider cursor-pointer ${
              activeDeployTab === 'hostinger' ? 'bg-red-600 text-black font-black' : 'text-gray-500 hover:text-white'
            }`}
          >
            Hostinger (FTP)
          </button>
        </div>

        {/* TAB 1: CLOUD RUN GUIDE */}
        {activeDeployTab === 'cloudrun' && (
          <div className="space-y-3 font-sans text-[11px] leading-relaxed text-gray-300">
            <h4 className="font-mono text-[10px] font-black text-amber-500 uppercase">⚡ DOCKER CONTAINER DEPLOYMENT ON GOOGLE CLOUD</h4>
            <p>
              Google Cloud Run hosts containers with state-to-zero capabilities. The exported app package already includes a production-ready, custom <b>Dockerfile</b> and <b>server.js</b> Express loader.
            </p>

            <div className="space-y-2 mt-2">
              <div className="flex gap-2">
                <span className="w-5 h-5 bg-neutral-900 flex items-center justify-center font-mono text-[9px] text-red-500 border border-neutral-800 font-bold">1</span>
                <span className="flex-1">Unzip the app archive on your local desktop. Install the Google Cloud SDK tool of your Operating system.</span>
              </div>
              <div className="flex gap-2">
                <span className="w-5 h-5 bg-neutral-900 flex items-center justify-center font-mono text-[9px] text-red-500 border border-neutral-800 font-bold">2</span>
                <span className="flex-1">Verify you are logged in to your GCP panel. Run `gcloud auth login` inside your local command line terminal.</span>
              </div>
              <div className="flex gap-2">
                <span className="w-5 h-5 bg-neutral-900 flex items-center justify-center font-mono text-[9px] text-red-500 border border-neutral-800 font-bold">3</span>
                <span className="flex-1">Build and deploy the docker container onto Google Cloud Run registry by copying and running the script below:</span>
              </div>
            </div>

            {/* Terminal script container */}
            <div className="bg-neutral-950 p-3 border border-neutral-900 rounded-sm font-mono text-[10px] text-green-400 relative">
              <pre className="whitespace-pre-wrap">{cloudRunDeployScript}</pre>
              <button
                onClick={() => copyToClipboard(cloudRunDeployScript, 'cloudrun')}
                className="absolute right-2 top-2 p-1.5 bg-neutral-900 border border-neutral-800 hover:border-red-600 text-gray-400 hover:text-red-500 rounded-sm cursor-pointer"
                title="Copy shell commands to clipboard"
              >
                {copiedScript === 'cloudrun' ? <Check className="w-3 h-3 text-green-500" /> : <Clipboard className="w-3 h-3" />}
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: VERCEL / GITHUB */}
        {activeDeployTab === 'vercel' && (
          <div className="space-y-3 font-sans text-[11px] leading-relaxed text-gray-300">
            <h4 className="font-mono text-[10px] font-black text-amber-500 uppercase">⚡ SINGLE-CLICK CI/CD AUTO-DEPLOYMENTS WITH GITHUB</h4>
            <p>
              Vercel and Netlify integrate continuously with Git. They compile, deploy, and host your static Single-Page applications instantly on cloud servers for free.
            </p>

            <div className="space-y-2 mt-2">
              <div className="flex gap-2">
                <span className="w-5 h-5 bg-neutral-900 flex items-center justify-center font-mono text-[9px] text-red-500 border border-neutral-800 font-bold">1</span>
                <span className="flex-1">Extract the bundle and publish your folder files package onto a private or public <b>GitHub</b> repository directory.</span>
              </div>
              <div className="flex gap-2">
                <span className="w-5 h-5 bg-neutral-900 flex items-center justify-center font-mono text-[9px] text-red-500 border border-neutral-800 font-bold">2</span>
                <span className="flex-1">Log in to Vercel dashboard panel. Click on <b>"Add New" &gt; "Project"</b> and grant Vercel access to your newly established GitHub project.</span>
              </div>
              <div className="flex gap-2">
                <span className="w-5 h-5 bg-neutral-900 flex items-center justify-center font-mono text-[9px] text-red-500 border border-neutral-800 font-bold">3</span>
                <span className="flex-1">Import and set the Framework Preset as <b>Other / Static App</b>. Leave all default output directories blank, in order to reference <b>index.html</b>. Click <b>Deploy</b>!</span>
              </div>
            </div>

            {/* CLI deployment alternative script */}
            <div className="bg-neutral-950 p-3 border border-neutral-900 rounded-sm font-mono text-[10px] text-green-400 relative">
              <p className="text-[8px] text-gray-500 font-mono uppercase mb-1"># Alternatively, deploy immediately from CLI terminal:</p>
              <pre className="whitespace-pre-wrap">{vercelDeployScript}</pre>
              <button
                onClick={() => copyToClipboard(vercelDeployScript, 'vercel')}
                className="absolute right-2 top-2 p-1.5 bg-neutral-900 border border-neutral-800 hover:border-red-600 text-gray-400 hover:text-red-500 rounded-sm cursor-pointer"
              >
                {copiedScript === 'vercel' ? <Check className="w-3 h-3 text-green-500" /> : <Clipboard className="w-3 h-3" />}
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: HOSTINGER / CPANEL FTP */}
        {activeDeployTab === 'hostinger' && (
          <div className="space-y-3 font-sans text-[11px] leading-relaxed text-gray-300">
            <h4 className="font-mono text-[10px] font-black text-amber-500 uppercase">⚡ CLASSIC CPANEL FTP UPLOADER (HOSTINGER OR GODADDY)</h4>
            <p>
              Traditional shared web hostings support instant static uploading without complex development environments or terminal commands.
            </p>

            <div className="space-y-2 mt-2">
              <div className="flex gap-2">
                <span className="w-5 h-5 bg-neutral-900 flex items-center justify-center font-mono text-[9px] text-red-500 border border-neutral-800 font-bold">1</span>
                <span className="flex-1">Log in to Hostinger hPanel or GoDaddy control dashboard files. Locate the <b>File Manager</b> utility.</span>
              </div>
              <div className="flex gap-2">
                <span className="w-5 h-5 bg-neutral-900 flex items-center justify-center font-mono text-[9px] text-red-500 border border-neutral-800 font-bold">2</span>
                <span className="flex-1">Double click to open the <b>public_html</b> or root folder for your targeted active domain domain links.</span>
              </div>
              <div className="flex gap-2">
                <span className="w-5 h-5 bg-neutral-900 flex items-center justify-center font-mono text-[9px] text-red-500 border border-neutral-800 font-bold">3</span>
                <span className="flex-1">Drag, drop, or Upload the ZIP we compiled for you. Highlight the file and click <b>"Extract File"</b> directly via cPanel. All operational index pages are up!</span>
              </div>
            </div>

            {/* Hostinger node server scripts */}
            <div className="bg-neutral-950 p-3 border border-neutral-900 rounded-sm font-mono text-[10px] text-green-400 relative">
              <p className="text-[8px] text-gray-500 font-mono uppercase mb-1"># For Hostinger premium VPS plans with Node.js loader engines: </p>
              <pre className="whitespace-pre-wrap">{hostingerDeployScript}</pre>
              <button
                onClick={() => copyToClipboard(hostingerDeployScript, 'hostinger')}
                className="absolute right-2 top-2 p-1.5 bg-neutral-900 border border-neutral-800 hover:border-red-600 text-gray-400 hover:text-red-500 rounded-sm cursor-pointer"
              >
                {copiedScript === 'hostinger' ? <Check className="w-3 h-3 text-green-500" /> : <Clipboard className="w-3 h-3" />}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Trust Badge layout footer */}
      <div className="border border-red-600/20 p-3.5 bg-neutral-950/40 rounded-sm flex items-center gap-2 select-none">
        <Globe className="w-4 h-4 text-green-500 shrink-0" />
        <span className="text-[9.5px] font-mono text-gray-400 leading-tight">
          EXPORTING INTEGRITY VERIFIED: Generated files match full standalone packaging regulations, and contain zero tracker scripts.
        </span>
      </div>
    </div>
  );
}
