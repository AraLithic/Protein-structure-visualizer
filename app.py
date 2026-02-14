#All the rights to this code belongs to Sayed Umair Ali
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from Bio.SeqUtils.ProtParam import ProteinAnalysis
import requests

app = FastAPI()
#All the rights to this code belongs to Sayed Umair Ali
# Enable CORS so frontend at port 5500 can call backend at port 8000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can change to ["http://localhost:5500"] for stricter security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

RCSB_PDB_URL = "https://files.rcsb.org/download/{pdbid}.pdb"
#All the rights to this code belongs to Sayed Umair Ali
class SequencePayload(BaseModel):
    seq: str

@app.get("/fetch/pdb")
async def fetch_pdb(pdbid: str):
    pdbid = pdbid.strip().lower()
    if len(pdbid) != 4:
        raise HTTPException(status_code=400, detail="PDB id must be 4 chars")
    url = RCSB_PDB_URL.format(pdbid=pdbid.upper())
    r = requests.get(url)
    if r.status_code != 200:
        raise HTTPException(status_code=404, detail=f"PDB {pdbid} not found")
    return {"pdb": r.text}

@app.post("/analyze/sequence")
async def analyze_sequence(payload: SequencePayload):
    seq = payload.seq.strip().upper()
    if seq.startswith('>'):
        lines = seq.splitlines()
        lines = [l for l in lines if not l.startswith('>')]
        seq = ''.join(lines)

    if not seq or any(c not in 'ACDEFGHIKLMNPQRSTVWY' for c in seq):
        raise HTTPException(status_code=400, detail="Sequence must be a protein sequence with standard amino acids (20-letter code)")

    pa = ProteinAnalysis(seq)
    aa_counts = pa.count_amino_acids()
    mw = pa.molecular_weight()
    gravy = pa.gravy()
    aromaticity = pa.aromaticity()
    instability_index = pa.instability_index()
    isoelectric_point = pa.isoelectric_point()

    hydrophobic_fraction = (aa_counts['A']+aa_counts['I']+aa_counts['L']+aa_counts['M']+aa_counts['F']+aa_counts['W']+aa_counts['Y']+aa_counts['V'])/len(seq)
    crosslinkable = aa_counts['C'] + aa_counts['K'] + aa_counts['Y'] + aa_counts['S'] + aa_counts['T']

    return {
        'length': len(seq),
        'molecular_weight': mw,
        'gravy': gravy,
        'aromaticity': aromaticity,
        'instability_index': instability_index,
        'pI': isoelectric_point,
        'aa_counts': aa_counts,
        'hydrophobic_fraction': hydrophobic_fraction,
        'crosslinkable_proxy': crosslinkable
    }
#All the rights to this code belongs to Sayed Umair Ali
