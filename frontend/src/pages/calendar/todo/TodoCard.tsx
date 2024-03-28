import edit from 'src/asset/images/calendar/edit.png'
import trash from 'src/asset/images/calendar/trash.png'
import useStore from '../store'
import { putTodo, updateTodo } from '../api'
import styled from 'styled-components'
import { ScheduleType } from 'src/types'
import { useMutation, useQuery } from 'react-query'

const TodoWrapper = styled.div<{ color: string }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  font-size: 20px;
  border-radius: 10px;
  border: 0.4px solid #000;
  margin-bottom: 4px;
  background-color: ${ ( props ) => props.color };
`

const TodoCardHeader = styled.div`
    display: flex;
    margin: 1% 2%;
    justify-content: space-between;
`

const TodoTitle = styled.div`
    font-size: 24px;
`

const TodoBody = styled.div`
    font-size: 16px;
    margin: 2% 2%;
`


const TodoCard = ( props: TodoCardProps ) =>{


    const { modalContent, setModalContent } = useStore();

    const { schedule } = props

    const deleteMutation = useMutation( putTodo, {
        onSuccess: () => {
        }
      })


    const editTodo = () =>{
        setModalContent()
    }
    
    const deleteTodo = () =>{

        deleteMutation.mutateAsync( schedule?.schedule_id )
        window.location.reload();
    }
    
    return(
        <TodoWrapper color={ schedule?.color }>
            <TodoCardHeader>
                <TodoTitle>
                    { schedule?.title }
                </TodoTitle>
                <div style={{ display:'flex', marginTop:'1%', gap: '2%'}}>
                    {/* <img onClick={ editTodo } src={ edit } alt ='' style={{ width: '30px', height: '30px'}}/> */}
                    <img onClick={ deleteTodo } src={ trash } alt ='' style={{ width: '30px', height: '30px'}}/>
                </div>
            </TodoCardHeader>
            <TodoBody>
                    { schedule?.content }
            </TodoBody>
        </TodoWrapper>
    )
}

export default TodoCard;


type TodoCardProps = {
    children?: React.ReactNode
    schedule?: ScheduleType
}