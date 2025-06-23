import { create_file } from "./create_file.js";
import { get_current_file_path } from "./get_current_file_path.js";
import { get_file_content } from "./get_file_content.js";
import { write_file } from "./write_file.js";

const function_mapping = {
  get_file_content: get_file_content,
  write_file: write_file,
  get_current_file_path: get_current_file_path,
  create_file: create_file,
};

export default function activateBotly(agent, question) {
  return new Promise((resolve, reject) => {
    agent.stdout.on("data", (data) => {
      data = data.toString();
      if (data !== undefined) {
        data = JSON.parse(data);
        if (data.type == "model_response" && data.data != undefined) {
          resolve(
            JSON.stringify({
              type: "model_response",
              content: data.data ?? "No Content",
            })
          );
        } else if (
          data.type == "function_call" &&
          data.function_name == "get_file_content"
        ) {
          const file_content = function_mapping.get_file_content(
            data.function_args.file_path
          );
          agent.stdin.write(
            JSON.stringify({
              type: "file_content",
              content: file_content,
              function_name: data.function_name,
            }) + "\n"
          );
        } else if (
          data.type == "function_call" &&
          data.function_name == "write_file"
        ) {
          function_mapping
            .write_file(data.function_args.content)
            .then((write_file_response) => {
              console.log(write_file_response);
              agent.stdin.write(
                JSON.stringify({
                  type: "write-file-response",
                  function_name: "write_file",
                  content: "Content is update successfully",
                }) + "\n"
              );
            });
        } else if (
          data.type == "function_call" &&
          data.function_name == "create_file"
        ) {
          console.log(data);
          function_mapping.create_file(
            data.function_args.file_path,
            data.function_args.content
          );
        }
      } else {
        resolve({ type: "model_text", content: "Not Much response" });
      }
    });

    agent.stderr.on("data", (err) => {
      err = err.toString();
      reject(err);
    });

    agent.stdin.write(JSON.stringify({ type: "question", question }) + "\n");
  });
}
