import { format } from 'date-fns'
import joy from 'src/asset/images/emotion/joy.png'
import urge from 'src/asset/images/calendar/urge.png'
import useStore from '../store'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'

const CardWrapper = styled.img`
  display: flex;
  height: 100px;
  width: 120px;
  margin: auto 20px;
`

const TodoInside = styled.div`
  display: flex;
  height: 100%;
`

const TodoWrapper = styled.div<{color: string}>`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 20%;
  font-size: 20px;
  border-radius: 10px;
  border: 0.4px solid ${ ( props ) => props.color };
  margin-bottom: 10px;
`

const TodoCardHeader = styled.div`
    display: flex;
    margin: 1% 2%;
    justify-content: space-between;
`

const TodoTitle = styled.div<{color: string}>`
    font-size: 30px;
    font-weight: bold;
    color: ${ ( props ) => props.color };
    margin:20px;
`

const TodoBody = styled.div`
    display: flex;
    justify-content: flex-end;
    font-size: 16px;
    margin: 2% 4%;
    overflow: hidden;
    color: #C62222;
`


const DiaryCard = ( props ) =>{

    const navigator = useNavigate()

    const { clickDate } = useStore();

    const { diary, member } = props

    const isExist = diary?.filter(( diary ) => diary?.dailyDate?.substring( 5, 10 ) === format( clickDate, 'MM-dd'))

    console.log("IS EXIST", isExist)

    const moveDailyDiary = () =>{
        navigator(`/diary/${isExist.dailyDiaryId}`)
    }

    return(
        <div>
            {
                isExist && 
                <>
                    <TodoWrapper onClick={ moveDailyDiary } color='black'>
                    <TodoInside>
                    <CardWrapper src={ joy } />
                    <div style={{width:'100%', height: '100%'}}>
                        <TodoCardHeader>
                            <TodoTitle color='black'>
                                '{ member?.nickname }'의 일기
                            </TodoTitle>
                            <div style={{ display:'flex', marginTop:'1%', gap: '2%'}}/>
                        </TodoCardHeader>
                        <TodoBody>
                                { isExist?.dailyContent }
                        </TodoBody>
                    </div>
                    </TodoInside>
                    </TodoWrapper>
                </>
                }

                {
                !isExist && 
                <>
                    <TodoWrapper color='gray'>
                    <TodoInside>
                    <CardWrapper/>
                    <div style={{width:'100%', height: '100%'}}>
                        <TodoCardHeader>
                            <TodoTitle color='gray'>
                                '{ member?.nickname }'의 일기
                            </TodoTitle>
                            <div style={{ display:'flex', marginTop:'1%', gap: '2%'}}/>
                        </TodoCardHeader>
                        <TodoBody>
                               <img src={ urge } alt = '' style={{ height: '20px'}}/> 재촉하기!
                        </TodoBody>
                    </div>
                    </TodoInside>
                    </TodoWrapper>
                </>
                }
            </div>
    )
}

export default DiaryCard;
