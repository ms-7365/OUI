import sys
import logging

sys.path.append("../")
logging.basicConfig(level=logging.INFO)

from fastapi import FastAPI, HTTPException
from model.model import OuiInference

from dto import DailyDiaryRequestDto, SongRequestDto

ai_server = FastAPI()
oui = OuiInference()

# uvicorn main:ai_server --reload --port=9032
@ai_server.get("/")
async def root():
    return {"message": "Hello World"}

@ai_server.post("/analysis")
async def analysis(body: DailyDiaryRequestDto):
    body_dict = body.dict()
    text = body_dict["text"]
    logging.info(f"main:analysis {text}")
    
    # 10글자가 안될 때,
    if len(text) < 10:
        raise HTTPException(status_code=422, detail="입력 데이터가 너무 짧습니다.")
    
    result = oui.predict_openvino(body_dict["text"])
    #result = oui.predict_onnx(body_dict["text"])
    #result = oui.predict_pytorch(body_dict["text"])
    return result