import styled from "styled-components"
import DiaryCard from "./DiaryCard"
import { getDayDiary, getDiaryMember } from '../api'
import useStore from "../store"
import { format } from "date-fns"
import { useQuery } from "react-query"

const TodoListWrapper = styled.div`
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  width: 100%;
  justify-content: space-around;
  margin-top: 20px;
  padding-bottom: 12px;
`

const DiaryList = ( props ) => {

    const { diaries, diaryId } = props

    const { clickDate } = useStore()

    const selectedDiaries= [];


    diaries.forEach( item => {

      item?.diaries.forEach( diary => {
        const date = diary.date

       date.substring(0, 10) === format( clickDate, 'yyyy-MM-dd') &&
          selectedDiaries.push(diary?.daily_diary_id);
      })
  })

  const { data: members } = useQuery( 'members', () => getDiaryMember( diaryId ))

  const { data: daily } = useQuery( 'daily', () => getDayDiary({ diaryId: diaryId, dailyId: selectedDiaries }))

  return(
    <TodoListWrapper>
      {
        members?.data?.map(( member: DiaryMemberType, index ) => {
          return(
            <DiaryCard key={ index } member = { member } diary = { daily?.data } diaryId = { diaryId } />
          )
        })
      }
    </TodoListWrapper>
  )
}

export default DiaryList


type DiaryMemberType = {
  memberid?: number,
  nickname?: string
}