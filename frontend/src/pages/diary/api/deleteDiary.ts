import { putAxios } from 'src/api/util';

export const deleteDiary = async (dailyDiaryId: number) => {
  try {
    const response = await putAxios(`/diary/delete/${dailyDiaryId}`);
    return response;
  } catch (err) {
    throw err;
  }
}