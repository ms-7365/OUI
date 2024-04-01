from pydantic import BaseModel

# recommendation
class SongScore(BaseModel):
    happy: float
    comfortable: float
    embarrassed: float
    angry: float
    doubtful: float
    sad: float
    user_type: str

# song meta
class Song(BaseModel):
    id: str
    lyrics: str
    song_name: str
    album_id: str
    album_name: str
    artist_id_basket: list
    artist_name_basket: list
    song_gn_gnr_basket: list
    uri: str