from google.genai import types

schema_write_file = types.FunctionDeclaration(
    name="write_file",
    description="Modifies or Update the file based on the relative path being provided by the user and with the content provided by the user",
    parameters=types.Schema(
        type=types.Type.OBJECT,
        properties={
            "file_path": types.Schema(
                type=types.Type.STRING,
                description="Relative path of the file where content should be written."
            ),
            "content": types.Schema(
                type=types.Type.STRING,
                description="The text content to write into the file."
            ),
        },
    ),
)