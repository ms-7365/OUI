from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from datetime import datetime, timedelta
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import os
import time
import pandas as pd
from tqdm import tqdm
import ast
import re

class PlylistCrawler:
    
    ID_BASE_URL = "https://www.melon.com/dj/chart/djchart_list.htm"
    PLY_BASE_URL = "https://www.melon.com/mymusic/dj/mymusicdjplaylistview_inform.htm"
    SONG_BASE_URL = "https://www.melon.com/song/detail.htm"

    def __init__(self, id_path="id_test.csv", plylst_path="plylst_test.csv", genre_path="genre_cat1_test.csv", song_path="song_test.csv"):
        # plylst id
        self.plylist_id = set()
        if os.path.exists(id_path):
            plylist_id_df = pd.read_csv(id_path)
            self.plylist_id = set(plylist_id_df["plylist_id"].tolist())

        # 장르 데이터
        self.genre_cat1 = dict()
        if os.path.exists(genre_path):
            self.genre_cat1 = self.__load_genre_cat1(pd.read_csv(genre_path))
        
        # 노래 데이터
        self.song_id = set()
        if os.path.exists(plylst_path):
            self.song_id = self.__load_song_id(pd.read_csv(plylst_path))

        self.options = webdriver.ChromeOptions()
        self.options.add_argument("headless")

        self.id_path = id_path
        self.plylst_path = plylst_path
        self.genre_path = genre_path
        self.song_path = song_path

    def __load_genre_cat1(self, dataframe):
        genre_cat1_dict = dict()
        for _, row in dataframe.iterrows():
            genre_cat1_dict[row["genre_name"]] = "cat1"
        return genre_cat1_dict

    def __load_song_id(self, dataframe):
        dataframe["songs"] = dataframe["songs"].apply(ast.literal_eval)
        song_id = set(dataframe[["songs"]].explode("songs")["songs"].tolist())
        return song_id

    def __make_id_next_url(start):
        nextday7 = PlylistCrawler.__add_day(start, 7)
        nextday13 = PlylistCrawler.__add_day(start, 13)

        startday = PlylistCrawler.__fit_id_dateformat_with_nospace(nextday7)
        endday = PlylistCrawler.__fit_id_dateformat_with_nospace(nextday13)

        # "2020.12.28 ~ 2021.01.03 "
        startday_dot =  PlylistCrawler.__fit_id_dateformat_with_dot(nextday7)
        endday_dot = PlylistCrawler.__fit_id_dateformat_with_dot(nextday13)
        return "{}#params%5BstartDay%5D={}&params%5BendDay%5D={}".format(PlylistCrawler.ID_BASE_URL,startday, endday), "{} ~ {}".format(startday_dot, endday_dot)

    def __make_ply_next_page(ply_id, start_index):
        return "{}?plylstSeq={}#params%5BplylstSeq%5D={}&po=pageObj&startIndex={}".format(PlylistCrawler.PLY_BASE_URL, ply_id, ply_id, start_index)

    def __make_ply_next_url(ply_id):
        return "{}?plylstSeq={}".format(PlylistCrawler.PLY_BASE_URL, ply_id)

    def __make_song_next_url(song_id):
        return "{}?songId={}".format(PlylistCrawler.SONG_BASE_URL, song_id)

    def __fit_id_dateformat_with_nospace(day):
        return str(day.year) + str(day.month).zfill(2) + str(day.day).zfill(2)

    def __fit_id_dateformat_with_dot(day):
        return str(day.year) + "." + str(day.month).zfill(2) + "." + str(day.day).zfill(2)
    
    def __add_day(start, day):
        if day < 0:
            return start-timedelta(days=-day)
        return start+timedelta(days=day)

    def do_crawling_ply_id(self):
        startday = datetime(2020, 12, 21)
        while startday < datetime.today():
            driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=self.options)
            curr_url, date_range = PlylistCrawler.__make_id_next_url(startday)
            print(f"{curr_url} \"{date_range}\"")
            startday = PlylistCrawler.__add_day(startday, 7)
            driver.get(curr_url)

            WebDriverWait(driver, 10).until(
                EC.text_to_be_present_in_element((By.CLASS_NAME, "yyyymmdd"), date_range)
            )
            time.sleep(1)
            boxes = driver.find_elements(By.CLASS_NAME, "btn_djplylst_like")
            for box in boxes:
                try:
                    self.plylist_id.add(box.get_attribute("data-djcol-no"))
                except:
                    startday = PlylistCrawler.__add_day(startday, -7)
                    break
            boxes.clear()
            driver.quit()
        self.__export_id_to_csv()

    def do_crawling_ply(self):
        error_id = set()

        plylist_title = dict()
        tags = dict()
        songs = dict()
        like_cnt = dict()
        updt_date = dict()

        for ply_id in tqdm(self.plylist_id):
            try:
                driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=self.options)
                start_index = 1
                curr_url = PlylistCrawler.__make_ply_next_url(ply_id)
                #print(f"{curr_url} \"{start_index}\"")
                driver.get(curr_url)
                
                WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.CLASS_NAME, "song_name"))
                )
            
                # 제목
                time.sleep(1)
                title = driver.find_element(By.CLASS_NAME, "song_name").text            
                plylist_title[ply_id] = title
                #print(title)

                # 좋아요 수
                like_cnt = driver.find_element(By.CLASS_NAME, "cnt").text
                like_cnt[ply_id] = like_cnt
                #print(like_cnt)

                # 업데이트 날짜
                updt_date = driver.find_element(By.CLASS_NAME, "date").text
                updt_date[ply_id] = updt_date.split(" ")[0]
                
                # 태그 리스트
                tag_list = [x.text[1:] for x in driver.find_elements(By.CLASS_NAME, "tag_item")]
                tags[ply_id] = tag_list
                
                song_cnt = int(driver.find_element(By.CLASS_NAME, "sum").text[1:-1])
                curr_song_list = []
                for idx in range(1, song_cnt+1, 50):
                    WebDriverWait(driver, 10).until(
                        EC.presence_of_element_located((By.TAG_NAME, "tbody"))
                    )
                    song_list_body = driver.find_element(By.TAG_NAME, "tbody")
                    song_list = song_list_body.find_elements(By.CLASS_NAME, "input_check")

                    for song in song_list:
                        curr_song_list.append(song.get_attribute("value"))
                    
                    if idx + 50 >= song_cnt+1:
                        break
                    
                    driver.quit()
                    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=self.options)
                    curr_url = PlylistCrawler.__make_ply_next_page(ply_id, idx+50)
                    #print(f"\"{idx+50}\"")
                    driver.get(curr_url)
                #print(len(curr_song_list))
                songs[ply_id] = curr_song_list
                driver.quit()
            except:
                error_id.add(ply_id)
                continue
        print("크롤링 종료")
        print(f"error_id: {error_id}")
        self.__export_plylst_to_csv(tags, songs, like_cnt, updt_date, plylist_title)

    def do_crawling_song(self):
        # * `song_gn_dtl_gnr_basket`: 세부 장르 코드 리스트 (X)
        # * `issue_date`: 발행 날짜
        # * `album_name`: 앨범 이름 
        # * `album_id`: 앨범 id
        # * `artist_id_basket`: 아티스트 id 리스트
        # * `artist_name_basket`: 아티스트 이름 리스트
        # * `song_name`: 노래 이름
        # * `song_gn_gnr_basket`: 장르 코드 리스트
        error_id = set()


        song_name = dict()
        artist_id_basket = dict()
        artist_name_basket = dict()
        album_id = dict()
        album_name = dict()
        issue_date = dict()
        song_gn_gnr_basket = dict()
        

        for song_id in tqdm(self.song_id):
            try:
                driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=self.options)
                curr_url = PlylistCrawler.__make_song_next_url(song_id)
                driver.get(curr_url)

                WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.CLASS_NAME, "song_name"))
                )

                # 노래 이름
                time.sleep(1)
                title = driver.find_element(By.CLASS_NAME, "song_name").text            
                song_name[song_id] = title
                #print(title)

                # 아티스트 id & 이름
                artist_id_list = []
                artist_name_list = []
                section = driver.find_element(By.CLASS_NAME, "entry")
                artists = section.find_elements(By.CLASS_NAME, "artist_name")
                for artist in artists:
                    artist_id = artist.get_attribute("href")
                    
                    artist_id = self.__get_id_in_href(artist_id)
                    if artist_id == -1:
                        print(f"{song_id} 아티스트 없음")
                        continue

                    artist_id_list.append(artist_id)
                    #print(f"artist_id: {artist_id}")
                      
                    artist_name = artist.find_element(By.TAG_NAME, 'span').text
                    artist_name_list.append(artist_name)
                    #print(f"artist_name: {artist_name}")
                
                artist_id_basket[song_id] = artist_id_list
                artist_name_basket[song_id] = artist_name_list
                
                # 앨범 id & 이름
                album_info = section.find_element(By.CLASS_NAME, "list")
                album_issdate_and_genres =  album_info.find_elements(By.TAG_NAME, "dd")
                album_href = album_issdate_and_genres[0].find_element(By.TAG_NAME, "a").get_attribute("href")
                a_id = self.__get_id_in_href(album_href)
                if a_id == -1:
                    print(f"{song_id} 앨범 id 없음")
                else:
                    album_id[song_id] = a_id
                    #print(f"album_id: {a_id}")
                a_name = album_issdate_and_genres[0].find_element(By.TAG_NAME, "a").text
                album_name[song_id] = a_name
                #print(f"{a_name} 앨범 이름")

                # 발매일 & 장르
                
                issdate = album_issdate_and_genres[1].text
                #print(f"{issdate} 발행 날짜")
                issue_date[song_id] = issdate

                gnr_list = album_issdate_and_genres[2].text.split(",")
                try:
                    # genres = [self.genre_cat1(gnr_tag) for gnr_tag in gnr_list]
                    #print(f"{gnr_list} 장르")
                    # print(f"{genres} 장르 코드")
                    song_gn_gnr_basket[song_id] = gnr_list
                    # song_gn_gnr_basket[song_id] = genres
                except:
                    print(f"{song_id} 장르가 없습니다.")
                    error_id.add(song_id)
                driver.quit()
            except:
                error_id.add(song_id)

        print("크롤링 종료")
        print(f"error_id: {error_id}")
        self.__export_song_to_csv(song_name, artist_id_basket, artist_name_basket, album_id, album_name, issue_date, song_gn_gnr_basket)

    def __get_id_in_href(self, href):
        matched = re.search(r"\('([^']+)'\)", href)
        if matched is None:
            return -1
        start = matched.start() + 2
        end = matched.end() - 2
        return href[start:end]

    def __export_song_to_csv(self, song_name, artist_id_basket, artist_name_basket, album_id, album_name, issue_date, song_gn_gnr_basket):
        data = []
        for song_id in self.song_id:
            try:
                row = {"id": song_id, "song_name":song_name[song_id], "album_id":album_id[song_id], "album_name":album_name[song_id], "artist_id_basket":issue_date[song_id],
                       "artist_name_basket":artist_name_basket[song_id], "artist_id_basket":artist_id_basket[song_id], "song_gn_gnr_basket": song_gn_gnr_basket[song_id]}
                data.append(row)
            except:
                continue

        plylist_df=pd.DataFrame(data)
        plylist_df.to_csv(self.song_path, index=False)
        print(f"{self.song_path} 저장완료")

    def __export_id_to_csv(self):
        plylist_id_df=pd.DataFrame(self.plylist_id).rename(columns={0: "plylist_id"})
        plylist_id_df.to_csv(self.id_path, index=False)
        print(f"{self.id_path} 저장완료")

    def __export_plylst_to_csv(self, tags, songs, like_cnt, updt_date, plylist_title):
        data = []
        for ply_id in self.plylist_id:
            try:
                row = {"id": ply_id, "tags":tags[ply_id], "songs":songs[ply_id], "like_cnt":like_cnt[ply_id], "updt_date":updt_date[ply_id], "plylist_title":plylist_title[ply_id]}
                data.append(row)
            except:
                continue

        plylist_df=pd.DataFrame(data)
        plylist_df.to_csv(self.plylst_path, index=False)
        print(f"{self.plylst_path} 저장완료")