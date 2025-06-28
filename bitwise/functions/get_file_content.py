from google.genai import types

schema_get_file_content = types.FunctionDeclaration(
    name="get_file_content",
    description="Retrieves and returns the full content of a file based on the filename or path provided by the user. Useful for reading and analyzing the contents of code, text, or configuration files.",
    parameters=types.Schema(
        type=types.Type.OBJECT,
        properties={
            "file_path": types.Schema(
                type=types.Type.STRING,
                description="Relative path or name of the file from where content should be read."
            ), 
        },
    ),
)

