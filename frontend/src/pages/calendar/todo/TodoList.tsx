import styled from "styled-components"
import TodoCard from "./TodoCard"

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

  const { schedules } = props

  console.log( 'schedule', schedules)

  return(
    <TodoListWrapper>
      {
        schedules?.map( ( schedule, index ) => {
          return(
            <TodoCard key={ index } schedule = { schedule }/>
          )
        })
      }
    </TodoListWrapper>
  )
}

export default TodoList