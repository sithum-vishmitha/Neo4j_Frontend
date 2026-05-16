import  nltk
import re

from nltk.tokenize import sent_tokenize


def normalise_spaces(s  :str):

    if s is None : 
       return ""
    
    if not isinstance(s, str):
        s = str(s)
    return re.sub(r"\s+", " ", s).strip()
 
  
def ensure_nltk():
  try : 
     nltk.data.find("tokenizers/punkt")

  except LookupError:
     nltk.download("punkt" , quiet= True)
  

def split_sentences(text :str):
   ensure_nltk()

   if text is None:
       return []
   if not isinstance(text , str):
      text = str(text)
    
   try :
      sents = sent_tokenize(text)
   except Exception :
      sents = re.split(r"(?<=[.!?])\s+", text)

   return  [
      normalise_spaces(s)
      for s in sents
      if s and  not s.isspace()  #only take Not(whitepsace-only) things
   ]


def chunk_by_chars(sents  , max_chars = 1800 , overlap_sents = 2):
   chunks = []
   buf  = []
   count = 0

   for s in sents:
      if count + len(s) + 1  >  max_chars and buf:
        chunks.append(" ".join(buf))
        buf = buf[-overlap_sents:] if overlap_sents > 0 else []
        count  =  sum(len(s) for s in  buf)  +  len(buf)

      buf.append(s)
      count += len(s)
   if buf:
      chunks.append(" ".join(buf)
                    
                    )
      
   return chunks


      
      
     
     