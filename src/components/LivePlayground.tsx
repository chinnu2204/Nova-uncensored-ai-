import React, { useState, useEffect } from 'react';
import { Play, Copy, Check, FileCode, FolderClosed, Code, Globe, HelpCircle, HardDriveDownload, Sparkles } from 'lucide-react';

interface LivePlaygroundProps {
  initialCode: string;
}

export default function LivePlayground({ initialCode }: LivePlaygroundProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'html' | 'css' | 'js'>('preview');
  const [htmlCode, setHtmlCode] = useState('');
  const [cssCode, setCssCode] = useState('');
  const [jsCode, setJsCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [iframeSrc, setIframeSrc] = useState('');
  const [isFormatting, setIsFormatting] = useState(false);

  // Parse incoming code and populate sandboxed files automatically
  useEffect(() => {
    if (!initialCode) {
      // Load fallback beautiful interactive clock project
      setHtmlCode(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Nova Wavefront Pulse</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-[#050505] text-white flex flex-col justify-center items-center min-h-screen text-center font-mono">
  <div class="border-2 border-red-600 p-8 bg-red-950/20 max-w-md w-full relative">
    <div class="absolute -top-3 left-4 bg-black text-red-500 font-mono text-xs px-2 border border-red-600 font-black">ACTIVE RELATIONAL METRIC: CLOCK</div>
    <div id="chrono" class="text-4xl text-white font-black tracking-widest my-4 uppercase">--:--:--</div>
    <div class="h-1 w-full bg-neutral-900 overflow-hidden relative border border-neutral-800">
      <div id="laser-scanner" class="h-full bg-red-600 w-1/3 animate-[scan_2s_infinite]"></div>
    </div>
    <p class="text-[10px] text-gray-500 mt-4 leading-relaxed uppercase">OPERATIONAL PULSES STREAMING SUCCESSFULLY OUT OF CHANNELS AND COGNITIVE NETWORKS.</p>
  </div>
</body>
</html>`);
      setCssCode(`@keyframes scan {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(300%); }
}`);
      setJsCode(`setInterval(() => {
  const time = new Date().toLocaleTimeString();
  const elem = document.getElementById('chrono');
  if (elem) elem.innerText = time;
}, 1000);`);
      return;
    }

    // Attempt to extract html from parsed content
    const htmlRegex = /```html([\s\S]*?)```/g;
    const cssRegex = /```css([\s\S]*?)```/g;
    const jsRegex = /```javascript([\s\S]*?)```|```js([\s\S]*?)```/g;

    const htmlMatch = htmlRegex.exec(initialCode);
    const cssMatch = cssRegex.exec(initialCode);
    const jsMatch = jsRegex.exec(initialCode) || jsRegex.exec(initialCode);

    if (htmlMatch) {
      setHtmlCode(htmlMatch[1].trim());
    } else {
      // Use standard initial if not parsed
      setHtmlCode(initialCode);
    }

    if (cssMatch) setCssCode(cssMatch[1].trim());
    if (jsMatch) setJsCode(jsMatch[1 || 2].trim());
  }, [initialCode]);

  // Run or Compile iframe code sandboxes
  const compileAndRun = () => {
    // Inject custom CSS and custom JS into the compiled HTML iframe
    const combinedContent = `
      <html>
        <head>
          <style>
            ${cssCode}
          </style>
        </head>
        <body>
          ${htmlCode.includes('<body>') ? htmlCode.replace('</body>', `<script>${jsCode}</script></body>`) : htmlCode + `<script>${jsCode}</script>`}
        </body>
      </html>
    `;
    setIframeSrc(combinedContent);
  };

  useEffect(() => {
    compileAndRun();
  }, [htmlCode, cssCode, jsCode]);

  const copyToClipboard = () => {
    let source = '';
    if (activeTab === 'html') source = htmlCode;
    else if (activeTab === 'css') source = cssCode;
    else if (activeTab === 'js') source = jsCode;
    else source = `htmlCode:\n${htmlCode}\n\ncssCode:\n${cssCode}\n\njsCode:\n${jsCode}`;

    navigator.clipboard.writeText(source);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simulated live beautiful code formatter
  const formatActiveCode = () => {
    setIsFormatting(true);
    setTimeout(() => {
      setIsFormatting(false);
    }, 1000);
  };

  // Mock download individual configs or ZIP projects
  const downloadResource = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-black text-white border-2 border-red-600/30 font-sans p-4 rounded-sm select-none flex flex-col h-full overflow-hidden">
      
      {/* Simulation Playground Header */}
      <div className="border-b border-red-600/40 pb-3 mb-4 flex justify-between items-center flex-wrap gap-2">
        <div>
          <h2 className="font-mono text-sm font-black tracking-widest text-red-500 uppercase flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-red-500 animate-[pulse_2s_infinite]" />
            SANDBOX_RUNNER.OS
          </h2>
          <p className="text-[9px] font-mono text-gray-500 uppercase">Interactive execution chamber and compiler</p>
        </div>
        
        {/* Actions Suite */}
        <div className="flex gap-2.5">
          <button
            onClick={copyToClipboard}
            className="p-1 px-2 border border-red-600/30 hover:border-red-500 bg-neutral-950 font-mono text-[9px] uppercase tracking-wider text-red-500 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>COPY CONTENT</span>
          </button>
          
          <button
            onClick={() => downloadResource('nova_cyber_project.zip', `HTML:\n${htmlCode}\n\nCSS:\n${cssCode}\n\nJS:\n${jsCode}`)}
            className="p-1 px-2 border border-red-600/30 hover:border-red-500 bg-red-950/20 font-mono text-[9px] uppercase tracking-wider text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <HardDriveDownload className="w-3.5 h-3.5 text-red-500" />
            <span>EXPORT ZIP</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 flex-1 overflow-hidden">
        
        {/* Real-time Project Viewer File Tree */}
        <div className="border border-red-600/10 p-3 bg-neutral-950/40 font-mono text-[10px] space-y-1 md:col-span-1 flex flex-col justify-between">
          <div>
            <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest block mb-2">FILE_TREE MODULE</span>
            
            <div className="flex items-center gap-2 text-neutral-400 p-1">
              <FolderClosed className="w-3.5 h-3.5 text-amber-500" />
              <span>/src/project</span>
            </div>
            
            <button
              onClick={() => setActiveTab('html')}
              className={`w-full flex items-center gap-2 p-1.5 pl-5 border-l-2 transition-colors ${
                activeTab === 'html' ? 'border-red-500 text-red-500 bg-red-950/10' : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-red-500" />
              <span>index.html</span>
            </button>

            <button
              onClick={() => setActiveTab('css')}
              className={`w-full flex items-center gap-2 p-1.5 pl-5 border-l-2 transition-colors ${
                activeTab === 'css' ? 'border-red-500 text-red-400 bg-red-950/10' : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-indigo-400" />
              <span>styles.css</span>
            </button>

            <button
              onClick={() => setActiveTab('js')}
              className={`w-full flex items-center gap-2 p-1.5 pl-5 border-l-2 transition-colors ${
                activeTab === 'js' ? 'border-red-500 text-amber-400 bg-red-950/10' : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-amber-400" />
              <span>main.js</span>
            </button>

            <button
              onClick={() => setActiveTab('preview')}
              className={`w-full flex items-center gap-2 p-1.5 mt-3 border transition-colors ${
                activeTab === 'preview' ? 'border-red-600 bg-red-600 text-black font-black' : 'border-neutral-800 text-gray-400 hover:text-white'
              }`}
            >
              <Play className="w-3.5 h-3.5 text-red-500" style={{ color: activeTab === 'preview' ? '#000' : undefined }} />
              <span>LIVE RENDER</span>
            </button>
          </div>

          <div className="border-t border-neutral-800/40 pt-2 mt-4 space-y-2">
            <button
              onClick={() => downloadResource(activeTab === 'html' ? 'index.html' : activeTab === 'css' ? 'styles.css' : 'main.js', activeTab === 'html' ? htmlCode : activeTab === 'css' ? cssCode : jsCode)}
              className="w-full py-1 text-center border mr-2 border-neutral-800 hover:border-red-600 font-mono text-[8px] text-gray-400 uppercase cursor-pointer"
            >
              DOWNLOAD CURRENT
            </button>
            <button
              onClick={formatActiveCode}
              disabled={isFormatting}
              className="w-full py-1 text-center bg-neutral-900 border border-neutral-800 hover:border-red-500 font-mono text-[8px] text-gray-400 uppercase cursor-pointer"
            >
              {isFormatting ? 'FORMATTING...' : 'AUTO-FORMAT CODE'}
            </button>
          </div>
        </div>

        {/* Tab View Editor Screen */}
        <div className="md:col-span-3 border border-red-600/10 rounded-sm flex flex-col h-full overflow-hidden bg-neutral-950">
          
          <div className="bg-neutral-950 p-2.5 border-b border-red-600/20 flex gap-2 overflow-x-auto text-[10px] font-mono">
            <span className="text-gray-500 mr-2 uppercase self-center ml-1">TERMINAL VIEWS:</span>
            
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 flex items-center gap-1.5 border ${
                activeTab === 'preview' ? 'bg-red-600 text-black border-red-600 font-bold' : 'text-gray-400 border-neutral-800 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>LIVE FRAME</span>
            </button>

            <button
              onClick={() => setActiveTab('html')}
              className={`px-3 py-1 flex items-center gap-1.5 border ${
                activeTab === 'html' ? 'border-red-600 text-red-500 font-bold' : 'text-gray-400 border-neutral-800 hover:text-white'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>HTML</span>
            </button>

            <button
              onClick={() => setActiveTab('css')}
              className={`px-3 py-1 flex items-center gap-1.5 border ${
                activeTab === 'css' ? 'border-red-600 text-indigo-400' : 'text-gray-400 border-neutral-800 hover:text-white'
              }`}
            >
              <span>CSS</span>
            </button>

            <button
              onClick={() => setActiveTab('js')}
              className={`px-3 py-1 flex items-center gap-1.5 border ${
                activeTab === 'js' ? 'border-red-600 text-amber-400' : 'text-gray-400 border-neutral-800 hover:text-white'
              }`}
            >
              <span>JAVASCRIPT</span>
            </button>
          </div>

          <div className="flex-1 overflow-auto p-3">
            {activeTab === 'preview' ? (
              <div className="w-full h-full min-h-[250px] bg-white rounded-sm overflow-hidden relative">
                {/* Simulated frame notch */}
                <div className="absolute top-0 left-0 right-0 h-4 bg-neutral-900 flex items-center justify-between px-3 text-white text-[8px] font-mono">
                  <span>NS_COMPILE_LIVE</span>
                  <div className="w-10 h-2.5 bg-black rounded-full" />
                  <span>v3.1</span>
                </div>
                <iframe
                  title="live-sandbox-preview"
                  srcDoc={iframeSrc}
                  sandbox="allow-scripts"
                  className="w-full h-full pt-4 border-none bg-neutral-950"
                />
              </div>
            ) : (
              <div className="font-mono text-xs leading-relaxed text-gray-300 w-full h-full min-h-[250px] focus:outline-none">
                <textarea
                  value={activeTab === 'html' ? htmlCode : activeTab === 'css' ? cssCode : jsCode}
                  onChange={(e) => {
                    if (activeTab === 'html') setHtmlCode(e.target.value);
                    else if (activeTab === 'css') setCssCode(e.target.value);
                    else if (activeTab === 'js') setJsCode(e.target.value);
                  }}
                  className="w-full h-full bg-transparent font-mono text-[11px] p-2 resize-none outline-none leading-relaxed text-red-50/90"
                  spellCheck={false}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
