# main.py
from typing import Any
import re
from fastapi import FastAPI, UploadFile, File, Request
from pydantic import BaseModel
from rdflib import Graph, Namespace, Literal ,URIRef
from rdflib.namespace import RDF, RDFS, XSD
from SPARQLWrapper import SPARQLWrapper, JSON, POST
import requests
from owlrl import DeductiveClosure, OWLRL_Semantics
import os
from openai import OpenAI
from dotenv import load_dotenv
from fastapi import HTTPException
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
from fastapi.middleware.cors import CORSMiddleware
# ======================
# 🔧 CONFIGURATION
# ======================

FUSEKI_BASE = "http://localhost:3030"
FUSEKI_QUERY_URL = f"{FUSEKI_BASE}/smartcity/sparql"   # endpoint SPARQL (query)
FUSEKI_UPDATE_URL = f"{FUSEKI_BASE}/smartcity/update" # endpoint SPARQL (update)
FUSEKI_DATA_ENDPOINT = f"{FUSEKI_BASE}/smartcity/data" # endpoint data (GET/POST)

EX = Namespace("http://www.semanticweb.org/chamb/ontologies/2025/8/untitled-ontology-9#")
INFERRED_GRAPH_URI = "http://example.org/inferred"  # graph nommé où l'on push les triples inférés

# Charger le graphe RDF local (si présent)
g = Graph()
try:
    g.parse("smartcity.rdf")
except Exception:
    # Pas de fichier local, démarrer avec un graphe vide
    pass
g.bind("ex", EX)
# ======================
# 🔁 SYNCHRONISATION FUSEKI → FICHIER LOCAL
# ======================

def sync_from_fuseki_to_local():
    """
    Télécharge tous les triples de Fuseki et les enregistre localement
    dans smartcity_updated.rdf.
    """
    try:
        print("🔄 Synchronisation Fuseki → smartcity_updated.rdf ...")
        url = f"{FUSEKI_DATA_ENDPOINT}?graph=default"
        response = requests.get(url, headers={"Accept": "application/rdf+xml"})
        if response.status_code == 200 and response.text.strip():
            with open("smartcity_updated.rdf", "w", encoding="utf-8") as f:
                f.write(response.text)
            print("✅ Synchronisation réussie : fichier local mis à jour.")
        else:
            print(f"⚠️ Aucun contenu RDF récupéré (code {response.status_code}).")
    except Exception as e:
        print(f"⚠️ Erreur de synchronisation Fuseki → local : {e}")

# Exécuter la synchro au démarrage
sync_from_fuseki_to_local()

# ======================
# 🚀 APPLICATION FASTAPI
# ======================

app = FastAPI(title="SmartCity RDF API", version="3.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # ton frontend React/Vite
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ======================
# ⚙️ FONCTION UTILITAIRE
# ======================

def send_to_fuseki(update_query: str):
    sparql = SPARQLWrapper(FUSEKI_UPDATE_URL)
    sparql.setMethod(POST)
    sparql.setQuery(update_query)
    sparql.query()

def push_data_to_graph(turtle_data: bytes, graph_uri: str):
    """
    Pousse du TTL vers l'endpoint /data?graph=graph_uri
    """
    url = f"{FUSEKI_DATA_ENDPOINT}?graph={graph_uri}"
    headers = {"Content-Type": "text/turtle"}
    r = requests.post(url, data=turtle_data, headers=headers)
    r.raise_for_status()
    return r

# ======================
# 📦 MODÈLES DE DONNÉES
# ======================

class Utilisateur(BaseModel):
    id: str
    nom: str
    age: int
    type_utilisateur: str  # Conducteur, Piéton, Voyageur

class Métro(BaseModel):
    id: str
    nom: str

class Station(BaseModel):
    id: str
    nom: str
    metros: list[str] = []

class Avis(BaseModel):
    id: str
    description: str
    utilisateur_id: str


class Observation(BaseModel):
    utilisateur_id: str
    statistique_id: str

class Infrastructure(BaseModel):
    id: str
    type: str   # ex: route, parking, stationsBus, stationsMetro
    nom: str

class Event(BaseModel):
    id: str
    type: str   # ex: accident, embouteillage, radar
    infrastructure_id: str

# ======================
# 🧠 DÉFINITION DES CLASSES RDF (ontologie minimale)
# ======================

# Hiérarchie Utilisateurs
g.add((EX.Utilisateur, RDF.type, RDFS.Class))
g.add((EX.Conducteur, RDF.type, RDFS.Class))
g.add((EX.Piéton, RDF.type, RDFS.Class))
g.add((EX.Voyageur, RDF.type, RDFS.Class))
g.add((EX.Conducteur, RDFS.subClassOf, EX.Utilisateur))
g.add((EX.Piéton, RDFS.subClassOf, EX.Utilisateur))
g.add((EX.Voyageur, RDFS.subClassOf, EX.Utilisateur))

# Transports
g.add((EX.RéseauTransport, RDF.type, RDFS.Class))
g.add((EX.Métro, RDF.type, RDFS.Class))
g.add((EX.Bus, RDF.type, RDFS.Class))
g.add((EX.Trottinette, RDF.type, RDFS.Class))
g.add((EX.Voiture, RDF.type, RDFS.Class))
g.add((EX.Vélo, RDF.type, RDFS.Class))
g.add((EX.Métro, RDFS.subClassOf, EX.RéseauTransport))
g.add((EX.Bus, RDFS.subClassOf, EX.RéseauTransport))
g.add((EX.Trottinette, RDFS.subClassOf, EX.RéseauTransport))
g.add((EX.Voiture, RDFS.subClassOf, EX.RéseauTransport))
g.add((EX.Vélo, RDFS.subClassOf, EX.RéseauTransport))

# Station et relations
g.add((EX.stationsMetro, RDF.type, RDFS.Class))
g.add((EX.disposeDe, RDF.type, RDF.Property))
g.add((EX.disposeDe, RDFS.domain, EX.stationsMetro))
g.add((EX.disposeDe, RDFS.range, EX.Métro))

# Avis
g.add((EX.Avis, RDF.type, RDFS.Class))
g.add((EX.description, RDF.type, RDF.Property))
g.add((EX.donnéPar, RDF.type, RDF.Property))
g.add((EX.donnéPar, RDFS.domain, EX.Avis))
g.add((EX.donnéPar, RDFS.range, EX.Utilisateur))

# Statistique + Observation

g.add((EX.observe, RDF.type, RDF.Property))
g.add((EX.observe, RDFS.domain, EX.Utilisateur))

# Event / Accident / Route / Infrastructure
g.add((EX.Event, RDF.type, RDFS.Class))
g.add((EX.accident, RDF.type, RDFS.Class))
g.add((EX.Infrastructure, RDF.type, RDFS.Class))
g.add((EX.route, RDF.type, RDFS.Class))
g.add((EX.accident, RDFS.subClassOf, EX.Event))
g.add((EX.route, RDFS.subClassOf, EX.Infrastructure))
g.add((EX.seTrouve, RDF.type, RDF.Property))
g.add((EX.seTrouve, RDFS.domain, EX.accident))
g.add((EX.seTrouve, RDFS.range, EX.route))

# Sauvegarde du graphe mis à jour localement (optionnel)
#g.serialize("smartcity_updated.rdf", format="xml")

# ======================
# 👤 UTILISATEURS - ENDPOINTS
# ======================

@app.post("/add_user/")
def add_user(user: Utilisateur):
    classe_type = user.type_utilisateur.capitalize()
    if classe_type not in ["Conducteur", "Piéton", "Voyageur"]:
        classe_type = "Utilisateur"

    utilisateur_uri = EX[user.id]
    g.add((utilisateur_uri, RDF.type, EX[classe_type]))
    g.add((utilisateur_uri, EX.nom, Literal(user.nom, datatype=XSD.string)))
    g.add((utilisateur_uri, EX.age, Literal(user.age, datatype=XSD.integer)))
    g.serialize("smartcity_updated.rdf", format="xml")

    insert_query = f"""
    PREFIX ex: <{EX}>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    INSERT DATA {{
        ex:{user.id} a ex:{classe_type} ;
                     ex:nom "{user.nom}"^^xsd:string ;
                     ex:age "{user.age}"^^xsd:integer .
    }}
    """
    send_to_fuseki(insert_query)
    return {"message": f"✅ {classe_type} '{user.nom}' ajouté."}

@app.get("/users/")
def get_all_users():
    sparql = SPARQLWrapper(FUSEKI_QUERY_URL)
    sparql.setReturnFormat(JSON)
    sparql.setQuery(f"""
    PREFIX ex: <{EX}>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT DISTINCT ?id ?type ?nom ?age WHERE {{
        ?id a ?type .
        OPTIONAL {{ ?id ex:nom ?nom . }}
        OPTIONAL {{ ?id ex:age ?age . }}
        ?type rdfs:subClassOf* ex:Utilisateur .
    }}
    """)
    results = sparql.query().convert()

    users = []
    seen = set()

    for r in results["results"]["bindings"]:
        uid = r["id"]["value"]
        if uid not in seen:
            seen.add(uid)
            users.append({
                "id": uid.split("#")[-1],
                "type": r["type"]["value"].split("#")[-1],
                "nom": r["nom"]["value"] if "nom" in r else None,
                "age": int(r["age"]["value"]) if "age" in r else None
            })
    return users

# ======================
# 🚇 MÉTRO / STATION - ENDPOINTS
# ======================

from pydantic import BaseModel

class RéseauTransport(BaseModel):
    id: str
    nom: str
    type_reseau: str  # "Métro", "Bus", "Trottinette", "Voiture", "Vélo"

@app.post("/add_reseau_transport/")
def add_reseau_transport(reseau: RéseauTransport):
    """
    Ajoute un réseau de transport générique : Métro, Bus, Trottinette, Voiture, ou Vélo.
    """
    type_clean = reseau.type_reseau.capitalize()
    valid_types = ["Métro", "Bus", "Trottinette", "Voiture", "Vélo"]

    if type_clean not in valid_types:
        return {"error": f"❌ Type '{reseau.type_reseau}' invalide. Doit être un de {valid_types}"}

    reseau_uri = EX[reseau.id]
    g.add((reseau_uri, RDF.type, EX[type_clean]))
    g.add((reseau_uri, EX.nom, Literal(reseau.nom, datatype=XSD.string)))
    g.serialize("smartcity_updated.rdf", format="xml")

    insert_query = f"""
    PREFIX ex: <{EX}>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    INSERT DATA {{
        ex:{reseau.id} a ex:{type_clean} ;
                       ex:nom "{reseau.nom}"^^xsd:string .
    }}
    """
    send_to_fuseki(insert_query)

    return {"message": f"🚆 Réseau de type '{type_clean}' ajouté : '{reseau.nom}'."}
@app.get("/reseaux_transport/")
def get_all_reseaux_transport():
    sparql = SPARQLWrapper(FUSEKI_QUERY_URL)
    sparql.setReturnFormat(JSON)
    sparql.setQuery(f"""
    PREFIX ex: <{EX}>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?id ?type ?nom WHERE {{
        ?id a ?type .
        ?type rdfs:subClassOf* ex:RéseauTransport .
        OPTIONAL {{ ?id ex:nom ?nom . }}
    }}
    """)
    results = sparql.query().convert()

    data = []
    for r in results["results"]["bindings"]:
        data.append({
            "id": r["id"]["value"].split("#")[-1],
            "type": r["type"]["value"].split("#")[-1],
            "nom": r["nom"]["value"] if "nom" in r else None
        })
    return data
class DisposeDe(BaseModel):
    infrastructure_id: str
    reseau_id: str
  
@app.post("/add_dispose_de/")
def add_dispose_de(rel: DisposeDe):
    infra_uri = EX[rel.infrastructure_id]
    reseau_uri = EX[rel.reseau_id]

    # RDFLib local
    g.add((infra_uri, EX.disposeDe, reseau_uri))
    g.serialize("smartcity_updated.rdf", format="xml")

    # Envoi à Fuseki
    insert_query = f"""
    PREFIX ex: <{EX}>
    INSERT DATA {{
        ex:{rel.infrastructure_id} ex:disposeDe ex:{rel.reseau_id} .
    }}
    """
    send_to_fuseki(insert_query)

    return {
        "message": f"🏗️ L'infrastructure '{rel.infrastructure_id}' dispose du réseau '{rel.reseau_id}'."
    }
@app.get("/dispositions/")
def get_dispositions():
    sparql = SPARQLWrapper(FUSEKI_QUERY_URL)
    sparql.setReturnFormat(JSON)
    sparql.setQuery(f"""
    PREFIX ex: <{EX}>
    SELECT ?infra ?reseau
    WHERE {{
        ?infra ex:disposeDe ?reseau .
    }}
    """)
    results = sparql.query().convert()

    return [
        {
            "infrastructure": r["infra"]["value"].split("#")[-1],
            "reseau": r["reseau"]["value"].split("#")[-1]
        }
        for r in results["results"]["bindings"]
    ]


# ======================
# 📝 AVIS - ENDPOINTS
# ======================

@app.post("/add_avis/")
def add_avis(avis: Avis):
    avis_uri = EX[avis.id]
    utilisateur_uri = EX[avis.utilisateur_id]

    g.add((avis_uri, RDF.type, EX.Avis))
    g.add((avis_uri, EX.description, Literal(avis.description, datatype=XSD.string)))
    g.add((avis_uri, EX.donnéPar, utilisateur_uri))
    g.serialize("smartcity_updated.rdf", format="xml")

    insert_query = f"""
    PREFIX ex: <{EX}>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    INSERT DATA {{
        ex:{avis.id} a ex:Avis ;
                     ex:description "{avis.description}"^^xsd:string ;
                     ex:donnéPar ex:{avis.utilisateur_id} .
    }}
    """
    send_to_fuseki(insert_query)
    return {"message": f"✅ Avis '{avis.id}' ajouté pour '{avis.utilisateur_id}'."}
@app.get("/avis/")
def get_avis():
    sparql = SPARQLWrapper(FUSEKI_QUERY_URL)
    sparql.setReturnFormat(JSON)
    sparql.setQuery(f"""
    PREFIX ex: <{EX}>
    SELECT ?avis ?description ?utilisateur WHERE {{
        ?avis a ex:Avis ;
              ex:donnéPar ?utilisateur ;
              OPTIONAL {{ ?avis ex:description ?description . }}
    }}
    """)
    results = sparql.query().convert()

    return [
        {
            "avis": r["avis"]["value"].split("#")[-1],
            "description": r.get("description", {}).get("value", None),
            "utilisateur": r["utilisateur"]["value"].split("#")[-1],
        }
        for r in results["results"]["bindings"]
    ]


@app.get("/avis/{utilisateur_id}")
def get_avis_by_user(utilisateur_id: str):
    sparql = SPARQLWrapper(FUSEKI_QUERY_URL)
    sparql.setReturnFormat(JSON)
    sparql.setQuery(f"""
    PREFIX ex: <{EX}>
    SELECT ?avis ?description WHERE {{
        ?avis a ex:Avis ;
              ex:donnéPar ex:{utilisateur_id} .
    }}
    """)
    results = sparql.query().convert()

    return [
        {
            "avis": r["avis"]["value"].split("#")[-1],
        }
        for r in results["results"]["bindings"]
    ]

# ======================
# 📈 STATISTIQUES + OBSERVATIONS - ENDPOINTS
# ======================
# ======================
# 📊 STATISTIQUES DÉTAILLÉES : Pollution + Accident
class statistique(BaseModel):
    id: str

class StatistiquePollution(statistique):
    tauxPollution: float

class statistiqueAccident(statistique):
    nbreDaccident: int

class Observation(BaseModel):
    utilisateur_id: str
    statistique_id: str

@app.post("/add_statistique_pollution/")
def add_statistique_pollution(stat: StatistiquePollution):
    stat_uri = URIRef(EX + stat.id)  # <- transformer en URIRef
    g.add((stat_uri, RDF.type, EX.statistique))
    g.add((stat_uri, RDF.type, EX.StatistiquePollution))
    g.add((stat_uri, EX.tauxPollution, Literal(stat.tauxPollution, datatype=XSD.float)))
    g.serialize("smartcity_updated.rdf", format="xml")

    insert_query = f"""
    PREFIX ex: <{EX}>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    INSERT DATA {{
        ex:{stat.id} a ex:statistique , ex:StatistiquePollution ;
                     ex:tauxPollution "{stat.tauxPollution}"^^xsd:float .
    }}
    """
    send_to_fuseki(insert_query)
    return {"message": f"✅ StatistiquePollution '{stat.id}' ajoutée avec taux {stat.tauxPollution}."}

@app.post("/add_statistique_accident/")
def add_statistique_accident(stat: statistiqueAccident):
    stat_uri = URIRef(EX + stat.id)  # <- transformer en URIRef
    g.add((stat_uri, RDF.type, EX.statistique))
    g.add((stat_uri, RDF.type, EX.statistiqueAccident))
    g.add((stat_uri, EX.nbreDaccident, Literal(stat.nbreDaccident, datatype=XSD.integer)))
    g.serialize("smartcity_updated.rdf", format="xml")

    insert_query = f"""
    PREFIX ex: <{EX}>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    INSERT DATA {{
        ex:{stat.id} a ex:statistique , ex:statistiqueAccident ;
                     ex:nbreDaccident "{stat.nbreDaccident}"^^xsd:integer .
    }}
    """
    send_to_fuseki(insert_query)
    return {"message": f"✅ StatistiqueAccident '{stat.id}' ajoutée avec {stat.nbreDaccident} accidents."}

@app.post("/add_observation/")
def add_observation(obs: Observation):
    utilisateur_uri = URIRef(EX + obs.utilisateur_id)  # <- URIRef
    stat_uri = URIRef(EX + obs.statistique_id)        # <- URIRef

    g.add((utilisateur_uri, EX.observe, stat_uri))
    g.serialize("smartcity_updated.rdf", format="xml")

    insert_query = f"""
    PREFIX ex: <{EX}>
    INSERT DATA {{
        ex:{obs.utilisateur_id} ex:observe ex:{obs.statistique_id} .
    }}
    """
    send_to_fuseki(insert_query)
    return {"message": f"👁️ '{obs.utilisateur_id}' observe '{obs.statistique_id}'."}
# =======================
# Récupérer toutes les Statistiques
# =======================
@app.get("/statistiques/")
def get_statistiques():
    sparql = SPARQLWrapper(FUSEKI_QUERY_URL)
    sparql.setReturnFormat(JSON)
    sparql.setQuery(f"""
    PREFIX ex: <{EX}>
    SELECT ?stat ?taux ?nbre WHERE {{
        ?stat a ex:statistique .
        OPTIONAL {{ ?stat a ex:StatistiquePollution ; ex:tauxPollution ?taux . }}
        OPTIONAL {{ ?stat a ex:statistiqueAccident ; ex:nbreDaccident ?nbre . }}
    }}
    """)
    results = sparql.query().convert()

    data = []
    for r in results["results"]["bindings"]:
        data.append({
            "id": r["stat"]["value"].split("#")[-1],
            "tauxPollution": float(r["taux"]["value"]) if "taux" in r else None,
            "nbreDaccident": int(r["nbre"]["value"]) if "nbre" in r else None
        })
    return data

# =======================
# Récupérer toutes les Observations
# =======================
@app.get("/observations/")
def get_observations():
    sparql = SPARQLWrapper(FUSEKI_QUERY_URL)
    sparql.setReturnFormat(JSON)
    sparql.setQuery(f"""
    PREFIX ex: <{EX}>
    SELECT ?utilisateur ?stat ?taux ?nbre WHERE {{
        ?utilisateur ex:observe ?stat .
        OPTIONAL {{ ?stat ex:tauxPollution ?taux . }}
        OPTIONAL {{ ?stat ex:nbreDaccident ?nbre . }}
    }}
    """)
    results = sparql.query().convert()

    observations = []
    for r in results["results"]["bindings"]:
        observations.append({
            "utilisateur": r["utilisateur"]["value"].split("#")[-1],
            "statistique": r["stat"]["value"].split("#")[-1],
            "tauxPollution": float(r["taux"]["value"]) if "taux" in r else None,
            "nbreDaccident": int(r["nbre"]["value"]) if "nbre" in r else None
        })
    return observations

# ======================
# 🛣️ ROUTES / ACCIDENTS - ENDPOINTS
# ======================
# --- ENDPOINTS ---
@app.post("/add_infrastructure/")
def add_infrastructure(infra: Infrastructure):
    uri = EX[infra.id]
    g.add((uri, RDF.type, EX[infra.type]))
    g.add((uri, RDF.type, EX.Infrastructure))
    g.add((uri, EX.nom, Literal(infra.nom, datatype=XSD.string)))
    g.serialize("smartcity_updated.rdf", format="xml")

    insert_query = f"""
    PREFIX ex: <{EX}>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    INSERT DATA {{
        ex:{infra.id} a ex:{infra.type}, ex:Infrastructure ;
                      ex:nom "{infra.nom}"^^xsd:string .
    }}
    """
    send_to_fuseki(insert_query)
    return {"message": f"🏗️ Infrastructure '{infra.nom}' ({infra.type}) ajoutée avec succès."}
@app.get("/get_infrastructures/")
def get_infrastructures():
    sparql = SPARQLWrapper(FUSEKI_QUERY_URL)
    sparql.setReturnFormat(JSON)
    sparql.setQuery(f"""
    PREFIX ex: <{EX}>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT DISTINCT ?id ?type ?nom WHERE {{
        ?id rdf:type ?type ;
            ex:nom ?nom .
        ?type rdfs:subClassOf* ex:Infrastructure .
        FILTER(?type != ex:Infrastructure)
    }}
    """)
    results = sparql.query().convert()

    infrastructures = []
    seen = set()

    for r in results["results"]["bindings"]:
        iid = r["id"]["value"]
        if iid not in seen:
            seen.add(iid)
            infrastructures.append({
                "id": iid.split("#")[-1],
                "type": r["type"]["value"].split("#")[-1],
                "nom": r["nom"]["value"] if "nom" in r else None
            })

    return infrastructures



@app.post("/add_event/")
def add_event(ev: Event):
    event_uri = EX[ev.id]
    infra_uri = EX[ev.infrastructure_id]
    g.add((event_uri, RDF.type, EX[ev.type]))
    g.add((event_uri, RDF.type, EX.Event))
    g.add((event_uri, EX.seTrouve, infra_uri))
    g.serialize("smartcity_updated.rdf", format="xml")

    insert_query = f"""
    PREFIX ex: <{EX}>
    INSERT DATA {{
        ex:{ev.id} a ex:{ev.type}, ex:Event ;
                    ex:seTrouve ex:{ev.infrastructure_id} .
    }}
    """
    send_to_fuseki(insert_query)
    return {"message": f"🚨 Événement '{ev.type}' ajouté et lié à '{ev.infrastructure_id}'."}


@app.get("/events/")
def get_events():
    sparql = SPARQLWrapper(FUSEKI_QUERY_URL)
    sparql.setReturnFormat(JSON)
    sparql.setQuery(f"""
    PREFIX ex: <{EX}>
    SELECT ?event ?type ?infra ?nom WHERE {{
        ?event a ?type ;
               ex:seTrouve ?infra .
        OPTIONAL {{ ?infra ex:nom ?nom . }}
        FILTER (?type IN (ex:accident, ex:embouteillage, ex:radar))
    }}
    """)
    results = sparql.query().convert()

    return [
        {
            "event": r["event"]["value"].split("#")[-1],
            "type": r["type"]["value"].split("#")[-1],
            "infrastructure": r["infra"]["value"].split("#")[-1],
            "nom_infra": r.get("nom", {}).get("value", "N/A")
        }
        for r in results["results"]["bindings"]
    ]
# ======================
class RechargeLink(BaseModel):
    reseau: str
    station: str
@app.post("/reseaux/seRecharge")
def add_reseaux_recharge(link: RechargeLink):
    """
    Ajoute une relation RDF entre un réseau de transport et une station de recharge.
    """
    reseau_uri = f"<{EX}{link.reseau}>"
    station_uri = f"<{EX}{link.station}>"

    update_query = f"""
    PREFIX ex: <{EX}>
    INSERT DATA {{
        {reseau_uri} ex:seRecharge {station_uri} .
    }}
    """

    try:
        res = requests.post(FUSEKI_UPDATE_URL, data={"update": update_query})
        if res.status_code not in [200, 204]:
            raise Exception(res.text)
        return {
            "message": "Relation ajoutée avec succès ✅",
            "relation": f"{link.reseau} seRecharge {link.station}"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erreur Fuseki : {str(e)}")
@app.get("/reseaux/seRecharge")
def get_reseaux_recharge():
    sparql_query = f"""
    PREFIX ex: <{EX}>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

    SELECT ?reseau ?station
    WHERE {{
      ?reseau a ?type .
      ?type rdfs:subClassOf* ex:RéseauTransport .
      ?reseau ex:seRecharge ?station .
      ?station a ?stype .
      ?stype rdfs:subClassOf* ex:StationRecharge .
    }}
    """

    sparql = SPARQLWrapper(FUSEKI_QUERY_URL)
    sparql.setQuery(sparql_query)
    sparql.setReturnFormat(JSON)

    try:
        results = sparql.query().convert()
        data = [
            {"reseau": r["reseau"]["value"], "station": r["station"]["value"]}
            for r in results["results"]["bindings"]
        ]
        return {"count": len(data), "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
class StationRecharge(BaseModel):
    id: str
@app.post("/add_station_recharge/")
def add_station_recharge(station: StationRecharge):
    """
    Ajoute une station de recharge (instance de StationRecharge et Energie)
    """
    station_uri = EX[station.id]

    # --- Ajout dans le graphe local RDFLib ---
    g.add((station_uri, RDF.type, EX.StationRecharge))
    g.add((station_uri, RDF.type, EX.Energie))
    g.serialize("smartcity_updated.rdf", format="xml")

    # --- Requête SPARQL envoyée à Fuseki ---
    insert_query = f"""
    PREFIX ex: <{EX}>
    INSERT DATA {{
        ex:{station.id} a ex:StationRecharge , ex:Energie .
    }}
    """
    send_to_fuseki(insert_query)

    return {"message": f"⚡ Station de recharge '{station.id}' ajoutée avec succès (type Energie)."}
@app.get("/stations_recharge/")
def get_stations_recharge():
    sparql = SPARQLWrapper(FUSEKI_QUERY_URL)
    sparql.setReturnFormat(JSON)
    sparql.setQuery(f"""
    PREFIX ex: <{EX}>
    SELECT ?station  WHERE {{
        ?station a ex:StationRecharge .
                
    }}
    """)
    results = sparql.query().convert()
    return [
        {
            "id": r["station"]["value"].split("#")[-1],
           
        }
        for r in results["results"]["bindings"]
    ]

# ======================


@app.post("/add_ticket_voyageur/")
def add_ticket_voyageur(data: dict[str, str]):
    """
    Ajoute un ticket à un voyageur.
    Exemple JSON :
    {
        "voyageur_id": "v1",
        "ticket_id": "ticket001"
    }
    """
    voyageur_id = data.get("voyageur_id")
    ticket_id = data.get("ticket_id")

    if not voyageur_id or not ticket_id:
        return {"error": "⚠️ Paramètres manquants : 'voyageur_id' et 'ticket_id' sont requis."}

    voyageur_uri = EX[voyageur_id]
    ticket_uri = EX[ticket_id]

    # Vérifier que le voyageur existe dans Fuseki et est de type ex:Voyageur
    check_query = f"""
    PREFIX ex: <{EX}>
    ASK {{
        ex:{voyageur_id} a ex:Voyageur .
    }}
    """

    sparql = SPARQLWrapper(FUSEKI_QUERY_URL)
    sparql.setQuery(check_query)
    sparql.setReturnFormat(JSON)
    result = sparql.query().convert()

    if not result.get("boolean"):
        return {"error": f"⚠️ L'utilisateur '{voyageur_id}' n'existe pas ou n'est pas un Voyageur."}

    # Ajouter le ticket localement
    g.add((ticket_uri, RDF.type, EX.Ticket))
    g.add((voyageur_uri, EX.avoirTicket, ticket_uri))
    g.serialize("smartcity_updated.rdf", format="xml")

    # Envoyer aussi dans Fuseki
    insert_query = f"""
    PREFIX ex: <{EX}>
    INSERT DATA {{
        ex:{ticket_id} a ex:Ticket .
        ex:{voyageur_id} ex:avoirTicket ex:{ticket_id} .
    }}
    """
    send_to_fuseki(insert_query)

    return {"message": f"🎟️ Ticket '{ticket_id}' ajouté avec succès au voyageur '{voyageur_id}'."}
@app.get("/tickets/{voyageur_id}")
def get_tickets_by_voyageur(voyageur_id: str):
    """
    Récupère tous les tickets associés à un voyageur donné.
    """
    sparql = SPARQLWrapper(FUSEKI_QUERY_URL)
    sparql.setReturnFormat(JSON)
    sparql.setQuery(f"""
    PREFIX ex: <{EX}>
    SELECT ?ticket WHERE {{
        ex:{voyageur_id} ex:avoirTicket ?ticket .
    }}
    """)
    results = sparql.query().convert()

    tickets = [
        r["ticket"]["value"].split("#")[-1]
        for r in results["results"]["bindings"]
    ]

    if not tickets:
        return {"message": f"⚠️ Aucun ticket trouvé pour le voyageur '{voyageur_id}'."}

    return {
        "voyageur": voyageur_id,
        "tickets": tickets
    }


@app.get("/tickets/")
def get_all_tickets():
    """
    Récupère tous les tickets enregistrés et leur(s) voyageur(s) associés.
    """
    sparql = SPARQLWrapper(FUSEKI_QUERY_URL)
    sparql.setReturnFormat(JSON)
    sparql.setQuery(f"""
    PREFIX ex: <{EX}>
    SELECT ?ticket ?voyageur WHERE {{
        ?ticket a ex:Ticket .
        OPTIONAL {{ ?voyageur ex:avoirTicket ?ticket . }}
    }}
    """)
    results = sparql.query().convert()

    tickets = []
    for r in results["results"]["bindings"]:
        tickets.append({
            "ticket": r["ticket"]["value"].split("#")[-1],
            "voyageur": r["voyageur"]["value"].split("#")[-1] if "voyageur" in r else None
        })

    if not tickets:
        return {"message": "⚠️ Aucun ticket enregistré dans la base."}

    return {"tickets": tickets}

# ======================
# Delete
# ======================
@app.delete("/delete/{instance_id}")
def delete_instance(instance_id: str):
    try:
        # Supprimer localement
        g.remove((EX[instance_id], None, None))
        g.serialize("smartcity_updated.rdf", format="xml")

        # Supprimer dans Fuseki
        delete_query = f"""
        PREFIX ex: <{EX}>
        DELETE WHERE {{
            ex:{instance_id} ?p ?o .
        }}
        """
        send_to_fuseki(delete_query)

        return {"message": f"🗑️ Instance '{instance_id}' supprimée avec succès."}
    except Exception as e:
        return {"error": str(e)}




# ======================
# 🧠 INTELLIGENCE ARTIFICIELLE (IA) - AVEC OPENAI (GPT-4o-mini)
# ======================

import re
from typing import Any
from fastapi import FastAPI
from SPARQLWrapper import SPARQLWrapper, JSON
from openai import OpenAI



# ======================
# 🔧 CONFIGURATION
# ======================

# Namespace RDF/OWL


# ======================
# 🧠 SYNONYMES (optionnel)
# ======================
SYNONYMS = {
    "autoroute": ["autoroute", "routex", "voie rapide"],
    "métro": ["metro", "train", "ligne"],
    "accident": ["accident", "collision", "incident", "crash"],
    "pollution": ["pollution", "qualité de l’air", "air", "statistique"],
    "utilisateur": ["utilisateur", "citoyen", "personne", "conducteur", "piéton", "voyageur"]
}


def contains_any(word_list: list[str], text: str) -> bool:
    """Vérifie si l'un des synonymes apparaît dans le texte."""
    return any(syn in text for syn in word_list)


# ======================
# 🧹 FONCTION DE NETTOYAGE DES REQUÊTES SPARQL
# ======================

def clean_sparql_query(query: str) -> str:
    """Nettoie la requête SPARQL générée par l'IA pour être compatible avec Fuseki."""
    query = query.strip()

    # Supprimer les balises Markdown
    query = re.sub(r"```[a-zA-Z]*", "", query)
    query = query.replace("```", "").strip()
    query = query.replace("\\n", "\n")
    query = query.replace("exex:", "ex:")

    # Corriger le préfixe mal formé (comme PREFIX : <...>)
    query = re.sub(r"PREFIX\s*:\s*<[^>]+>", f"PREFIX ex: <{EX}>", query)

    # Corriger le préfixe example.org
    query = re.sub(r"PREFIX\s+ex:\s*<http://example\.org/?.*?>", f"PREFIX ex: <{EX}>", query)

    # Si aucun PREFIX ex, on l’ajoute
    if "PREFIX ex:" not in query:
        query = f"PREFIX ex: <{EX}>\n" + query

    # Corriger les notations sans préfixe
    query = re.sub(r"(?<!\w):(\w+)", r"ex:\1", query)

    # Ajouter PREFIX rdfs si la requête contient une hiérarchie
    if "rdfs:subClassOf" in query and "PREFIX rdfs:" not in query:
        query = f"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" + query

    return query.strip()


# ======================
# 🚀 ROUTE PRINCIPALE IA
# ======================

@app.post("/ask_ia/")
def ask_ia(payload: dict[str, Any]):
    """
    Interface IA : reçoit une question utilisateur, génère une requête SPARQL avec OpenAI,
    exécute sur Fuseki et renvoie les résultats RDF.
    """
    user_question = payload.get("question", "")
    if not isinstance(user_question, str) or not user_question.strip():
        return {"error": "❌ La question est vide ou invalide."}

    user_question = user_question.strip()

    # ======= 1️⃣ Génération SPARQL via OpenAI =======
    try:
        completion = client.chat.completions.create(
            model="gpt-4o-mini",  # Tu peux utiliser "gpt-4o" si tu y as accès
            messages=[
                {
                    "role": "system",
                    "content": (
                        "Tu es un assistant expert en RDF et SPARQL. "
                        "Tu génères des requêtes SPARQL correctes et valides pour un graphe SmartCity."
                    ),
                },
                {
                    "role": "user",
                    "content": f"""
Analyse cette question : '{user_question}'
et génère une requête SPARQL valide selon le schéma suivant :
Classes : accident, route, stationsMetro, Métro, Utilisateur, Avis, StatistiquePollution, statistiqueAccident, Trajet ,Infrastructure, RéseauTransport, Ticket.
Propriétés : seTrouve, disposeDe, donnéPar, observe, estDesserviPar, effectue, estConnectéÀ, avoirTicket.
Utilise le préfixe : PREFIX ex: <{EX}>
Ne renvoie que la requête SPARQL, sans texte supplémentaire.
                    """,
                },
            ],
        )

        sparql_query = completion.choices[0].message.content.strip()
        sparql_query = clean_sparql_query(sparql_query)

    except Exception as e:
        return {"error": f"⚠️ Erreur OpenAI : {str(e)}"}

    # ======= 2️⃣ Exécution SPARQL sur Fuseki =======
    sparql = SPARQLWrapper(FUSEKI_QUERY_URL)
    sparql.setReturnFormat(JSON)
    sparql.setQuery(sparql_query)

    try:
        results = sparql.query().convert()
    except Exception as e:
        return {
            "error": f"⚠️ Erreur SPARQL : {str(e)}",
            "sparql_query": sparql_query,
        }

    # ======= 3️⃣ Formatage du résultat =======
    data = []
    for r in results["results"]["bindings"]:
        entry = {k: v["value"].split("#")[-1] if "#" in v["value"] else v["value"] for k, v in r.items()}
        data.append(entry)

    return {
        "question": user_question,
        "sparql_query": sparql_query,
        "results": data,
    }


@app.get("/stats/")
def get_stats():
    sparql = SPARQLWrapper(FUSEKI_QUERY_URL)
    sparql.setReturnFormat(JSON)
    sparql.setQuery(f"""
    PREFIX ex: <{EX}>
    SELECT ?class (COUNT(?s) AS ?count)
    WHERE {{
        ?s a ?class .
        FILTER(STRSTARTS(STR(?class), STR(ex:)))
    }}
    GROUP BY ?class
    """)
    results = sparql.query().convert()

    stats = [
        {"class": r["class"]["value"].split("#")[-1], "count": int(r["count"]["value"])}
        for r in results["results"]["bindings"]
    ]
    return {"stats": stats}
#----------------------------------------
class SmartCity(BaseModel):
    id: str
    gouvernance: str
    description: str

@app.post("/add_smartcity/")
def add_smartcity(city: SmartCity):
    """
    Ajoute une SmartCity avec ses attributs gouvernance et description.
    """
    city_uri = EX[city.id]

    # --- Ajout dans le graphe local RDFLib
    g.add((city_uri, RDF.type, EX.smartCity))
    g.add((city_uri, EX.gouvernance, Literal(city.gouvernance, datatype=XSD.string)))
    g.add((city_uri, EX.description, Literal(city.description, datatype=XSD.string)))
    g.serialize("smartcity_updated.rdf", format="xml")

    # --- Envoi vers Fuseki
    insert_query = f"""
    PREFIX ex: <{EX}>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    INSERT DATA {{
        ex:{city.id} a ex:smartCity ;
                     ex:gouvernance "{city.gouvernance}"^^xsd:string ;
                     ex:description "{city.description}"^^xsd:string .
    }}
    """
    send_to_fuseki(insert_query)

    return {"message": f"🏙️ SmartCity '{city.id}' ajoutée avec succès."}



@app.get("/smartcities/")
def get_smartcities():
    sparql_query = f"""
    PREFIX ex: <{EX}>
    SELECT ?id ?gouv ?desc
    WHERE {{
        ?id a ex:smartCity ;
             ex:gouvernance ?gouv ;
             ex:description ?desc .
    }}
    """
    sparql = SPARQLWrapper("http://localhost:3030/smartcity/query")
    sparql.setQuery(sparql_query)
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()
    return [
        {
            "id": r["id"]["value"].split("#")[-1],
            "gouvernance": r["gouv"]["value"],
            "description": r["desc"]["value"]
        }
        for r in results["results"]["bindings"]
    ]    
#--------------------------------------
from pydantic import BaseModel
from rdflib import Literal, RDF, XSD

class Trajet(BaseModel):
    id: str
    duree: str     # exemple : "25 min"
    distance: str  # exemple : "10 km"

@app.post("/add_trajet/")
def add_trajet(trajet: Trajet):
    """
    Ajoute un trajet (classe Trajet) avec durée et distance.
    """
    trajet_uri = EX[trajet.id]

    # --- Ajout local RDFLib
    g.add((trajet_uri, RDF.type, EX.Trajet))
    g.add((trajet_uri, EX.duree, Literal(trajet.duree, datatype=XSD.string)))
    g.add((trajet_uri, EX.distance, Literal(trajet.distance, datatype=XSD.string)))
    g.serialize("smartcity_updated.rdf", format="xml")

    # --- Envoi à Fuseki
    insert_query = f"""
    PREFIX ex: <{EX}>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    INSERT DATA {{
        ex:{trajet.id} a ex:Trajet ;
                       ex:duree "{trajet.duree}"^^xsd:string ;
                       ex:distance "{trajet.distance}"^^xsd:string .
    }}
    """
    send_to_fuseki(insert_query)

    return {"message": f"🛣️ Trajet '{trajet.id}' ajouté avec succès."}

class EffectueLink(BaseModel):
    utilisateur: str
    trajet: str

@app.post("/utilisateur/effectue_trajet/")
def add_effectue_link(link: EffectueLink):
    """
    Ajoute la relation : Utilisateur effectue Trajet.
    """
    utilisateur_uri = EX[link.utilisateur]
    trajet_uri = EX[link.trajet]

    # --- Ajout local RDFLib
    g.add((utilisateur_uri, EX.effectue, trajet_uri))
    g.serialize("smartcity_updated.rdf", format="xml")

    # --- Envoi à Fuseki
    insert_query = f"""
    PREFIX ex: <{EX}>
    INSERT DATA {{
        ex:{link.utilisateur} ex:effectue ex:{link.trajet} .
    }}
    """
    send_to_fuseki(insert_query)

    return {"message": f"👤 Utilisateur '{link.utilisateur}' effectue le trajet '{link.trajet}'."}
@app.get("/utilisateurs/trajets/")
def get_trajets_effectues():
    """
    Récupère tous les trajets effectués par les utilisateurs,
    avec durée et distance.
    """
    sparql = SPARQLWrapper("http://localhost:3030/smartcity/query")
    sparql.setReturnFormat(JSON)
    sparql.setQuery(f"""
    PREFIX ex: <{EX}>
    SELECT ?utilisateur ?trajet ?duree ?distance
    WHERE {{
        ?utilisateur ex:effectue ?trajet .
        ?trajet a ex:Trajet .
        OPTIONAL {{ ?trajet ex:duree ?duree . }}
        OPTIONAL {{ ?trajet ex:distance ?distance . }}
    }}
    """)
    try:
        results = sparql.query().convert()
        data = []
        for r in results["results"]["bindings"]:
            data.append({
                "utilisateur": r["utilisateur"]["value"].split("#")[-1],
                "trajet": r["trajet"]["value"].split("#")[-1],
                "duree": r["duree"]["value"] if "duree" in r else "N/A",
                "distance": r["distance"]["value"] if "distance" in r else "N/A"
            })
        return {"count": len(data), "relations": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))    
#------------------------------------
@app.get("/")
def home():
    return {"message": "🚀 Bienvenue dans l’API SmartCity RDF + Fuseki"}
