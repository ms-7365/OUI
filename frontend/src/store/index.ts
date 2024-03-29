import { create } from 'zustand'
import { persist } from "zustand/middleware";


const useStore = create(

  persist<MainStore>(
    ( set ) => ({

      accessToken: '',
      setAccessToken: ( accessToken ) => set( { accessToken } ),

      isLogin: false,
      setIsLogin: ( isLogin ) => set( { isLogin } ),

      diaryId: null,
      setDiaryId: ( diaryId ) => set( { diaryId } ),

      type: '',
      setType: ( type ) => set( { type } ),

      dailyDiaryId: null,
      setDailyDiaryId: ( dailyDiaryId ) => set( { dailyDiaryId } ),

    }),
    {
      name: 'userStorage',
    },
  ),
);

export default useStore


type MainStore = {

  accessToken: string,
  setAccessToken: ( accessToken: string ) => void

  isLogin: boolean
  setIsLogin: ( isLogin: boolean ) => void

  diaryId: number
  setDiaryId: ( diaryId: number ) => void

  type: string
  setType: ( type: string ) => void

  dailyDiaryId: number
  setDailyDiaryId: ( dailyDiaryId: number ) => void

}
