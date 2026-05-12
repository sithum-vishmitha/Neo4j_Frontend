import json


def parse_llm_json(response: str):

    start = response.find("{")
    end = response.rfind("}")

    cleaned = response[start:end + 1]

    return json.loads(cleaned)