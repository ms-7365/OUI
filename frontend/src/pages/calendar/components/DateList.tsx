import styled from "styled-components"

const DateListWrapper = styled.div`
  display: flex;
  box-sizing: border-box;
  flex-direction: rows;
  width: 85%;
  font-weight: bold;
  justify-content: space-around;
  padding-top: 20px;
  margin-top: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #000;
`

// const Date = styled.div<{ index: number }>`
//   color: 
//   ${( props ) => props.index === 0 ? 'red' : ( props.index === 6 ? 'blue': 'black' )}
// `

const DateList = () => {

  const date = [ 'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'  ]

  return(
    <DateListWrapper style={{backgroundColor:'white'}}>
      {
        date?.map( ( day, index ) => {
          return(
            <div key={ index }>
              { day }
            </div>
          )
        })
      }
    </DateListWrapper>
  )
}

export default DateList