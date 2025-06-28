from google.genai import types

schema_write_file = types.FunctionDeclaration(
    name="write_file",
description="Writes or updates the content of a file at the given path or filename, using the content provided by the user. Creates the file if it doesn't exist.",
    parameters=types.Schema(
        type=types.Type.OBJECT,
        properties={
            "file_path": types.Schema(
                type=types.Type.STRING,
                description="Relative path or name of the file where content should be written."
            ),
            "content": types.Schema(
                type=types.Type.STRING,
                description="The text content to write or modifies into the file."
            ),
        },
    ),
)