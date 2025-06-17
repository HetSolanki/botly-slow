export function getContentHtml() {
  return `
    <!DOCTYPE html>
    <html lang="en">
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
          const chat = document.getElementById('chat');
          chat.innerHTML += '<p><b>Agent:</b> ' + msg.text + '</p>';
        });
      </script>
    </body>
    </html> 
  `;
}
