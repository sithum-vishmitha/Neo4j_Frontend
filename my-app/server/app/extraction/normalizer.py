from app.schemas import KGChunkResult


def normalize_result(result :KGChunkResult):
    entity_seen = set()
    cleaned_entities = []

    for e in result.entities:
        key  = (e.name , e.label)

        if key  not in entity_seen:
             entity_seen.add(key)

             cleaned_entities.append(e)

    relation_seen = set()
    cleaned_relations  = []

    entity_names = {e.name for e in cleaned_entities }

    for  r in result.relations:
        if (r.head not in entity_names):
            continue

        if r.tail not in entity_names:
            continue


        key  = (
            r.head , 
            r.relation ,
             r.tail
        )

        if key not in relation_seen:
            relation_seen.add(key)
            cleaned_relations.append(r)
    result.entities = cleaned_entities
    result.relations = cleaned_relations

    return result

