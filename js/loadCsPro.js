(function loadRemoteScripts() {
   const host = `https://oroblob.blob.core.windows.net/cspro`;
   const scripts = [`${host}/utils.js`, `${host}/fabric.js`, `${host}/customiseControls.js`, `${host}/freeFormAzureV3.js`];
   const stylesheets = [ `${host}/freeForm.css` ];

   stylesheets.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  });

  function loadScript(index) {
    if (index >= scripts.length) return;
    const script = document.createElement('script');
    script.src = scripts[index];
    script.defer = true;
    script.onload = () => loadScript(index + 1);
    document.head.appendChild(script);
  }

  loadScript(0);
  
    load(0);
  })();
  