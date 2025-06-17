import sys, os
from dotenv import load_dotenv
from google.genai import types
from google import genai
import json

def main():
    load_dotenv()

    args = []
    userPrompt = "Greeting from me.!"
    api_key = os.environ.get("GEMINI_API_KEY")
    client = genai.Client(api_key=api_key)

    for lines in sys.stdin:
        data = json.loads(lines)
        args.append(data["question"])
        userPrompt = " ".join(args)
        response = generate_content(client, userPrompt)
        print(json.dumps({"type": "model_response", "data": response}), flush=True)



def generate_content(client, userPrompt):   
    response = client.models.generate_content(
        model="gemini-2.0-flash-001",
        contents=userPrompt
    )
    return response.text

if __name__ == "__main__":
    main()