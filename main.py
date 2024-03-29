import sys
import logging

import argparse
import uvicorn
from fastapi import FastAPI, HTTPException

from dto import DailyDiaryRequestDto, SongRequestDto

from model.model import OuiInference

ai_server = FastAPI()

@ai_server.get("/")
async def root():
    return {"message": "Hello World"}

@ai_server.post("/analysis/openvino")
async def analysis(body: DailyDiaryRequestDto):
    body_dict = body.dict()
    text = body_dict["text"]
    logging.info(f"main:analysis {text}")
    
    # 10글자가 안될 때,
    if len(text) < 10:
        raise HTTPException(status_code=422, detail="입력 데이터가 너무 짧습니다.")
    
    result = oui.predict_openvino(body_dict["text"])
    return result

@ai_server.post("/analysis/onnx")
async def analysis(body: DailyDiaryRequestDto):
    body_dict = body.dict()
    text = body_dict["text"]
    logging.info(f"main:analysis {text}")
    
    # 10글자가 안될 때,
    if len(text) < 10:
        raise HTTPException(status_code=422, detail="입력 데이터가 너무 짧습니다.")
    
    result = oui.predict_onnx(body_dict["text"])
    return result

@ai_server.post("/analysis/pytorch")
async def analysis(body: DailyDiaryRequestDto):
    body_dict = body.dict()
    text = body_dict["text"]
    logging.info(f"main:analysis {text}")
    
    # 10글자가 안될 때,
    if len(text) < 10:
        raise HTTPException(status_code=422, detail="입력 데이터가 너무 짧습니다.")
    
    result = oui.predict_pytorch(body_dict["text"])
    return result


if __name__ == '__main__':

    parser = argparse.ArgumentParser(description="oui ai server")

    parser.add_argument("--host", type=str, default="localhost")
    parser.add_argument("--port", type=int, default=8008)

    args = parser.parse_args()

    logging.basicConfig(level=logging.INFO)

    # uvicorn main:ai_server --reload --port=8008
    oui = OuiInference()
    uvicorn.run(ai_server, host=args.host, port=args.port)
