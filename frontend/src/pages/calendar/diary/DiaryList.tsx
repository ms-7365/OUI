import styled from "styled-components"
import DiaryCard from "./DiaryCard"
import { getDayDiary } from '../api'
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

const TodoList = ( props ) => {

    const { diaries, diaryId } = props

    const { clickDate } = useStore()

    const selectedDiaries= [];


    diaries.forEach(item => {
      item?.diaries.forEach( diary => {
        const date = diary.date;
        console.log("date", date)
        if (date.substring(0, 10) === format( clickDate, 'yyyy-MM-dd')) {
            selectedDiaries.push(diary?.daily_diary_id);
        }
      })
  })

  console.log("selectedDiaries", selectedDiaries)

  const { data: daily } = useQuery('daily', () => getDayDiary({diaryId: diaryId, dailyId: selectedDiaries}))

  console.log(daily)

  return(
    <TodoListWrapper>
      {
        diaries?.map( ( diary, index ) => {
          return(
            <DiaryCard key={ index } diary = { diary }>
              !!
            </DiaryCard>
          )
        })
      }
    </TodoListWrapper>
  )
}

export default TodoList