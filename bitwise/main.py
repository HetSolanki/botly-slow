import sys, os
from dotenv import load_dotenv
from google.genai import types
from google import genai
from call_function import available_functions, function_call
from prompt import system_prompt
from config import MAX_ITERS
import requests
import json

def main():
    base_path = os.path.dirname(os.path.abspath(__file__))
    dotenv_path = os.path.join(base_path, ".env")
    api_key = requests.get("https://botly-env-server.vercel.app/env").json().get('api-key')
    load_dotenv(dotenv_path)
    client = genai.Client(api_key=api_key)
    messages = []
    iters = 0
    
    messages.append(types.Content(role="user", parts=[types.Part(text="Default user input, ignore it.!")]))
    for line in sys.stdin:
        data = json.loads(line)

        # Handle user questions
        if data["type"] == "question":
            user_prompt = data["question"]
            messages.append(types.Content(role="user", parts=[types.Part(text=user_prompt)]))
            iters = 0
    
        while True:
            iters += 1
            if iters > MAX_ITERS:
                print(json.dumps({"type": "model_response", "data": "Maximum iterations reached"}), flush=True)
                break

            response = generate_content(client, messages)
            if not response or not response.candidates:
                print(json.dumps({"type": "model_response", "data": "[No response from model]"}), flush=True)
                break

            candidate = response.candidates[0]
            
            if candidate.content and candidate.content.parts:
                messages.append(candidate.content)
            
            # Handle text output
            final_text = ""
            if candidate.content and candidate.content.parts:
                for part in candidate.content.parts:
                    if hasattr(part, "text") and part.text:
                        final_text += part.text

            # Print final response if no function call
            if not response.function_calls:
                print(json.dumps({"type": "model_response", "data": final_text}), flush=True)
                break

            # Handle function calls
            for fc in response.function_calls:
                function_name = fc.name
                if function_name not in function_call:
                    messages.append(types.Content(
                        role="tool",
                        parts=[
                            types.Part.from_function_response(
                                name=function_name,
                                response={"error": f"Unknown function: {function_name}"},
                            )
                        ]
                    ))
                    break
                else:
                    # Notify frontend to provide input for this function call
                    print(json.dumps({
                        "type": "function_call",
                        "function_name": function_name,
                        "function_args": fc.args
                    }), flush=True) 

                    # Wait for content via stdin
                    file_line = sys.stdin.readline()
                    file_data = json.loads(file_line)
                    if "content" in file_data and file_data["content"]:  # Ensure content is not empty
                        tool_response = types.Content(
                            role="tool",
                            parts=[
                                types.Part.from_function_response(
                                    name=file_data["function_name"],
                                    response={"result": file_data["content"]},
                                )
                            ]
                        )
                        messages.append(tool_response) 
                        break

def generate_content(client, messages):   
    return client.models.generate_content(
        model="gemini-2.0-flash-001",
        contents=messages,
        config=types.GenerateContentConfig( 
            tools=[available_functions],
            system_instruction=system_prompt
        ),
    )

if __name__ == "__main__":
    main()
