from google.genai import types

schema_get_current_file_path = types.FunctionDeclaration(
    name="get_current_file_path",
    description="Reads the path of currenlty selected file which typically used by you for creating, updating and writing up to the file by having the root path of the user's current location."   ,
)

