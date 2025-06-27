from google.genai import types
from functions.get_file_content import schema_get_file_content
from functions.write_file import schema_write_file
from functions.get_current_file_path import schema_get_current_file_path
from functions.create_file import schema_create_file
import json

available_functions = types.Tool(
    function_declarations = [
        schema_write_file,
        schema_get_file_content,
        schema_create_file
    ]
)

function_call = [
    "get_file_content",
    "get_current_file_path",
    "write_file",
    "create_file"
]

def call_function(function_call_part, verbose=False):
    function_name = function_call_part.name
    if function_name not in function_call:
        return types.Content(
            role="tool",
            parts=[
                types.Part.from_function_response(
                    name=function_name,
                    response={"error": f"Unknown function: {function_name}"},
                )
            ],
        )
    
    
    result = """

from circleshape import *
from constants import *
import random

class Asteroid(CircleShape):
    def __init__(self, x, y, radius):
        super().__init__(x, y, radius)

    def draw(self, screen):
        pygame.draw.circle(screen, "white", self.position, self.radius, 2)

    def update(self, dt):
        self.position += self.velocity * dt

    def split(self):
        self.kill()
        if self.radius <= ASTEROID_MIN_RADIUS:
            return
        angle = random.uniform(20, 50)
        velocity1 = self.velocity.rotate(angle)
        velocity2 = self.velocity.rotate(-angle)
        new_radius = self.radius - ASTEROID_MIN_RADIUS
        
        asteroid1 = Asteroid(self.position.x, self.position.y, new_radius)
        asteroid2 = Asteroid(self.position.x, self.position.y, new_radius)
        asteroid1.velocity = velocity1 * 1.2
        asteroid2.velocity = velocity2 * 1.2

"""
    return types.Content(
            role="tool",
            parts=[
                types.Part.from_function_response(
                    name=function_name,
                    response={"result": result},
                )
            ]
        )