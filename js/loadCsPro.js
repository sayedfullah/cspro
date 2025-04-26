(function loadRemoteScripts() {
    const scripts = [
      "https://oroblob.blob.core.windows.net/cspro/fabric.js",
      "https://oroblob.blob.core.windows.net/cspro/customiseControls.js",
      "https://oroblob.blob.core.windows.net/cspro/freeFormAzureV3.js"
    ];
  
    function load(index) {
      if (index >= scripts.length) return;
      const script = document.createElement('script');
      script.src = scripts[index];
      script.defer = true;
      script.onload = () => load(index + 1);
      document.head.appendChild(script);
    }
  
    load(0);
  })();
  