export function getContentHtml() {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js" defer></script>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css">
      <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
      <script>hljs.highlightAll();</script>

      <style>
        .agent-msg pre {
          background: #f6f8fa;
          padding: 0.75rem;
          border-radius: 6px;
          overflow-x: auto;
          font-family: monospace;
        }
      </style>

    </head>
    <body>
      <div id="chat"></div>
      <input id="msg" placeholder="Type message..." />
      <button onclick="send()">Send</button>

      <script>
        const vscode = acquireVsCodeApi();
        function send() {
          const input = document.getElementById('msg');
          vscode.postMessage({ type: 'user', text: input.value });
          input.value = '';
        }

        window.addEventListener('message', event => {
          const msg = event.data;
          console.log("My Message:", msg);
          const chat = document.getElementById('chat');
          chat.innerHTML += '<p><b>Agent:</b> ' +  marked.parse(msg.content) + '</p>';
        });
      </script>
    </body>
    </html> 
  `;
}
