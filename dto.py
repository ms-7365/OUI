from pydantic import BaseModel

class DailyDiaryRequestDto(BaseModel):
    text: str

class SongRequestDto(BaseModel):
    happy: float
    comfortable: float
    embarassed: float
    angry: float
    doubtful: float
    sad: float