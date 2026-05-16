from neo4j import GraphDatabase
from app.config import  settings
from app.schemas import  GraphNode , GraphEdge , GraphSnapshot

class Neo4jService:
    def __init__(self):
        self.driver =  GraphDatabase.driver(
            settings.neo4j_uri , 
            auth= (settings.neo4j_user , settings.neo4j_pass)
        )

    def close(self):
        self.driver.close()


    def ensure_schema(self):
        with self.driver.session() as session:
            session.run(""" CREATE CONSTRAINT kg_uid IF NOT EXISTS
                FOR (n:KGNode) REQUIRE n.uid IS UNIQUE""")
            session.run(""" CREATE CONSTRAINT kg_name_type IF NOT EXISTS
                FOR (n:KGNode) REQUIRE (n.name, n.type) IS UNIQUE""")
            
    def upsert_chunk(self , result   , job_id   : str  , chunk_id  :str):
         with self.driver.session() as session:
             for e in   result.entities:
              session.run("""MERGE (n:KGNode {name: $name, type: $type})
                    ON CREATE SET n.uid = $uid, n.job_id = $job_id, n.chunk_id = $chunk_id
                    ON MATCH SET n.job_id = $job_id, n.chunk_id = $chunk_id""",
              
              name = e.name,
              type = e.label,
              uid = self._make_uid(e.label , e.name),
              job_id = job_id,
              chunk_id = chunk_id,

              )

             for r in result.relations:
                 session.run(    """
                    MATCH (h:KGNode {name: $head})
                    MATCH (t:KGNode {name: $tail})
                    MERGE (h)-[:KG_REL {rel: $rel, job_id: $job_id, chunk_id: $chunk_id}]->(t)
                    """,
                 head = r.head,
                 tail = r.tail ,
                 rel = r.relation,
                 job_id = job_id,
                 chunk_id = chunk_id)
    

    def fetch_graph(self)->GraphSnapshot:
        with self.driver.session() as session :
            node_result = session.run("""
                MATCH (n:KGNode)
                RETURN n.uid AS uid, n.name AS name, n.type AS type
                ORDER BY n.type, n.name
            """)

            nodes  = []
            uid_to_id = {}

            for idx,  record in enumerate(node_result , start=1):
                node_id = f"n{idx}"
                uid = record['uid']
                uid_to_id[uid] = node_id
                nodes.append(
                    GraphNode(
                        id=  node_id , 
                        type  = record['type'],
                        name  = record['name'],
                        uid= uid

                    )
                )

            rel_results = session.run("""
                MATCH (h:KGNode)-[r:KG_REL]->(t:KGNode)
                RETURN h.uid AS source_uid, t.uid AS target_uid, r.rel AS rel
                ORDER BY rel
            """)

            edges = []
            for idx , record in enumerate(rel_results , start=1):
                edge_id  = f"e{idx}"
                source =    uid_to_id.get(record['source_uid'])
                target =  uid_to_id.get(record['target_uid'])
                rel = record["rel"]
                if not source or not target:
                    continue
                 
                edges.append(
                   GraphEdge(
                     id=edge_id,
                        source=source,
                        target=target,
                        rel=rel
 
                )
 
                )

            return GraphSnapshot(nodes=nodes , edges= edges)


    #check connection
    def is_connected(self) ->bool :
        try :
            with self.driver.session() as session :
                result = session.run(
                     "RETURN 1 AS connected"
                )

                record = result.single()

                return (
                 record is not None
                 and record["connected"] == 1
                )
        except Exception as e:

         print(f"Neo4j connection failed: {e}")
 
         return False







              

            
    def _make_uid(self , label : str , name : str)-> str :
         safe_label = label.lower().replace(" ", "_")
         safe_name  = name.lower().replace(" ", "_")
         #connect the alphabet and numerical and _ for uuid
         safe_name = "".join(c for c in safe_name if c.isalnum() or c == "_")
         return f"{safe_label}_{safe_name}"