import { format } from 'date-fns'
import angry from 'src/asset/images/emotion/angry.png'
import embarrass from 'src/asset/images/emotion/embarrass.png'
import joy from 'src/asset/images/emotion/joy.png'
import nervous from 'src/asset/images/emotion/nervous.png'
import relax from 'src/asset/images/emotion/relax.png'
import sad from 'src/asset/images/emotion/sad.png'
import ya from 'src/asset/images/ya.jpg'
import urge from 'src/asset/images/calendar/urge.png'
import useStore from '../store'
import { postUrge } from '../api'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

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

    const { clickDate } = useStore()

    const { diary, member, diaryId } = props

    const isExist = diary?.filter(( diary ) => diary?.dailyDate?.substring( 5, 10 ) === format( clickDate, 'MM-dd'))

    console.log("IS EXIST", isExist)
    console.log("MEMBER", member)

    const goAlarm = useMutation( postUrge )

    const emotionImg = {
        'angry': angry,
        'embarrass': embarrass,
        'joy': joy,
        'nervous': nervous,
        'comfortable': relax,
        'sad': sad,
        'happy': ya
    }

    const moveDailyDiary = () =>{
        navigator(`/diary/${isExist.dailyDiaryId}`)
    }

    const postAlarm = async (id) =>{

        await goAlarm.mutateAsync({ 
            diaryId: diaryId,
            memberId: id,
            date: format( clickDate, 'yyyy-MM-dd' )
             })
    }

    return(
        <div>
            {
                isExist && 
                <>
                    <TodoWrapper onClick={ moveDailyDiary } color='black'>
                    <TodoInside>
                    <CardWrapper src={ joy } />
                    <div style={{ width:'100%', height: '100%' }}>
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
                        <TodoBody onClick={(e) => postAlarm(member?.memberId) } style={{cursor: 'pointer'}}>
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
