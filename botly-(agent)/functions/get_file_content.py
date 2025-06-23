from google.genai import types

schema_get_file_content = types.FunctionDeclaration(
    name="get_file_content",
    description="Reads the contents of a file located from the relative file path, limited to a maximum number of characters.",
    parameters=types.Schema(
        type=types.Type.OBJECT,
        properties={
            "file_path": types.Schema(
                type=types.Type.STRING,
                description="Relative path of the file where content should be read."
            ),
        },
    ),
)

