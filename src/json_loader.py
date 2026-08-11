"""
json_loader.py

Carga datos financieros desde un archivo JSON.

Autor: Mauricio Medina
"""

import json


class JsonLoader:

    @staticmethod
    def load(path: str):

        with open(path, "r", encoding="utf-8") as file:
            return json.load(file)
