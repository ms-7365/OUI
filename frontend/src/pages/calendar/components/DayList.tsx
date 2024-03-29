import { format } from 'date-fns';
import { Day } from '../components';
import { useQuery } from 'react-query';

import styled from 'styled-components'


const DayListWrapper = styled.div`
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  width: 100%;
  align-items: center;
  justify-content: space-around;
  padding-bottom: 50px;
`

const WeekWrapper = styled.div`
  display: flex;
  box-sizing: border-box;
  flex-direction: row;
  width: 85%
`

const DayList = ( props ) => {
  
  const { list, calendars, type, diaryId } = props

  const cal = []
  for(let i = 0; i < list.length; i++) {
      i % 7 === 0  && cal.push([])
      cal[ cal.length - 1 ].push( list[i] )
  }

  return(
    <DayListWrapper>
      { cal?.map(( day, index ) => (
          <WeekWrapper key={ index }>
            { day?.map(( day, index ) => (
                  <Day day= { day } index={ index } key={ index } 
                  calendars = { calendars } type = { type }  diaryId = { diaryId }/>
            ))}
          </WeekWrapper>
      ))}
    </DayListWrapper>
  )
}

export default DayList