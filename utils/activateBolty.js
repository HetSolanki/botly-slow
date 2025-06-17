export default function activateBotly(agent, question) {
  return new Promise((resolve, reject) => {
    agent.stdout.on("data", (data) => {
      data = JSON.parse(data.toString());
      if (data.type == "model_response") {
        resolve(data.data);
      }
    });

    agent.stderr.on("data", (err) => {
      err = err.toString();
      reject(err);
    });

    agent.stdin.write(JSON.stringify({ question }) + "\n");
  });
}
