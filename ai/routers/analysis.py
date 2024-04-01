import logging
from fastapi import Depends, APIRouter, HTTPException
from ai.model import OuiInference
#from ai.model import oui

from models.analysis import DailyDiary

router = APIRouter()

@router.post("/analysis/openvino")
def analysis(body: DailyDiary, oui: OuiInference = Depends()):
    body_dict = body.dict()
    text = body_dict["text"]
    logging.info(f"main:analysis {text}")
    
    # 10글자가 안될 때,
    if len(text) < 10:
        raise HTTPException(status_code=422, detail="입력 데이터가 너무 짧습니다.")
    
    result = oui.predict_openvino(body_dict["text"])
    return result

@router.post("/analysis/onnx")
def analysis(body: DailyDiary, oui: OuiInference = Depends()):
    body_dict = body.dict()
    text = body_dict["text"]
    logging.info(f"main:analysis {text}")
    
    # 10글자가 안될 때,
    if len(text) < 10:
        raise HTTPException(status_code=422, detail="입력 데이터가 너무 짧습니다.")
    
    result = oui.predict_onnx(body_dict["text"])
    return result

@router.post("/analysis/pytorch")
def analysis(body: DailyDiary, oui: OuiInference = Depends()):
    body_dict = body.dict()
    text = body_dict["text"]
    logging.info(f"main:analysis {text}")
    
    # 10글자가 안될 때,
    if len(text) < 10:
        raise HTTPException(status_code=422, detail="입력 데이터가 너무 짧습니다.")
    
    result = oui.predict_pytorch(body_dict["text"])
    return result