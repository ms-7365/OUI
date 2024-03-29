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


class RandomQuestionCrawler:
    
    BASE_URL = "https://section.blog.naver.com/HotTopicChallenge.naver?currentPage="

    def __init__(self, save_path="radnom_question_sample.csv"):
        self.date = dict()
        self.question = dict()
        self.idx = 0
        self.current_page = 0
        self.save_path = save_path

        self.options = webdriver.ChromeOptions()
        self.options.add_argument("headless")

    def do_crawling_random_question(self):

        while self.current_page < 53:
            driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=self.options)
            curr_url = self.__make_rq_next_url()
            print(f"{curr_url}")
            driver.get(curr_url)

            WebDriverWait(driver, 10).until(
                # EC.text_to_be_present_in_element((By.CLASS_NAME, "yyyymmdd"), date_range)
                EC.element_to_be_clickable((By.CLASS_NAME,"heading_challenge_hottopic"))
            )
            time.sleep(1)
            boxes = driver.find_elements(By.CLASS_NAME, "heading_challenge_hottopic")
            for box in boxes:
                try:
                    cq = box.find_element(By.TAG_NAME, "span").text
                    cd = box.find_element(By.TAG_NAME, "em").text
                    self.question[self.idx] = cq
                    self.date[self.idx] = cd
                    self.idx += 1
                except:
                    self.current_page = self.current_page-1
                    break
            boxes.clear()
            driver.quit()

        print(self.question)
        print("크롤링 종료")
        self.__export_rq_to_csv()

    def __make_rq_next_url(self):
        self.current_page += 1
        return "{}{}".format(RandomQuestionCrawler.BASE_URL, self.current_page)

    def __export_rq_to_csv(self):
        data = []
        for i in range(self.idx):
            try:
                row = {"id": i, "question": self.question[i], "date": self.date[i]}
                data.append(row)
            except:
                continue

        plylist_df=pd.DataFrame(data)
        plylist_df.to_csv(self.save_path, index=False)
        print(f"{self.save_path} 저장완료")