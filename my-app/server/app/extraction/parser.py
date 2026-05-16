import json
import re

from json_repair import repair_json

from app.schemas import (
    KGChunkResult,
    EntityItem,
    RelationItem
)


def parse_llm_json(
    raw: str,
    chunk_id: str
) -> KGChunkResult:

    # -----------------------------------
    # SAFETY
    # -----------------------------------

    if raw is None:
        raw = ""

    if not isinstance(raw, str):
        raw = str(raw)

    # -----------------------------------
    # REMOVE THINK TAGS
    # -----------------------------------

    raw = re.sub(
        r"<think>.*?</think>",
        "",
        raw,
        flags=re.DOTALL
    ).strip()

    # -----------------------------------
    # LOAD JSON
    # -----------------------------------

    try:

        data = json.loads(raw)

    except Exception:

        data = json.loads(
            repair_json(raw)
        )

    # -----------------------------------
    # ENTITIES
    # -----------------------------------

    entities = []

    for e in data.get(
        "entities",
        []
    ):

        if (
            e.get("name")
            and e.get("label")
        ):

            entities.append(
                EntityItem(
                    name=e["name"],
                    label=e["label"]
                )
            )

    # -----------------------------------
    # RELATIONS
    # -----------------------------------

    relations = []

    for r in data.get(
        "relations",
        []
    ):

        if (
            r.get("head")
            and r.get("relation")
            and r.get("tail")
        ):

            relations.append(
                RelationItem(
                    head=r["head"],
                    relation=r["relation"],
                    tail=r["tail"]
                )
            )

    # -----------------------------------
    # FINAL RESULT
    # -----------------------------------

    return KGChunkResult(
        chunk_id=chunk_id,
        entities=entities,
        relations=relations
    )