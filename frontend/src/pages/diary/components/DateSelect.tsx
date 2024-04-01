import { useState, useEffect } from 'react';
import { Select, MenuItem } from '@mui/material';
import styled from 'styled-components';

const SelectLabel = styled.span`
  margin: 10px;
  font-size: 20px;
`;

const DateSelect = (props: DateSelectProps) => {
  const { selectedDate, setSelectedDate } = props;

  const currentDate = new Date();
  const initialDate = selectedDate ? new Date(props.selectedDate) : currentDate;

  const selectedYear = new Date(initialDate).getFullYear();
  const selectedMonth = new Date(initialDate).getMonth() + 1;
  const selectedDay = new Date(initialDate).getDate();

  const [year, setYear] = useState(selectedYear);
  const [month, setMonth] = useState(selectedMonth);
  const [monthsInYear, setMonthsInYear] = useState([]);
  const [day, setDay] = useState(selectedDay);
  const [daysInMonth, setDaysInMonth] = useState([]);

  useEffect(() => {
    const date = new Date(selectedDate || currentDate);
    setYear(date.getFullYear());
    setMonth(date.getMonth() + 1);
    setDay(date.getDate());
  }, [ selectedDate ]);

  useEffect(() => {

    const updateMonths = () => {
      // 선택된 년도가 현재 년도와 같을 경우
      if (year === new Date().getFullYear()) {
        const currentMonth = new Date().getMonth() + 1;
        // 현재 월까지만 포함하는 배열 생성
        const monthsArray = Array.from({ length: currentMonth }, (_, i) => i + 1);
        // 선택된 월이 현재 월보다 클 경우, 현재 월로 설정
        if (month > currentMonth) {
          setMonth(currentMonth);
        }
      }
    };

    updateMonths();

    const updateDaysInMonth = () => {
      const days = new Date(year, month, 0).getDate();
      let daysArray = Array.from({ length: days }, (_, i) => i + 1);
      
      // 현재 선택된 연도와 월이 오늘 날짜의 연도와 월과 같으면 오늘 일자 이후를 제거
      if (year === new Date().getFullYear() && month === new Date().getMonth() + 1) {
        daysArray = daysArray.filter(day => day <= new Date().getDate());
      }

      setDaysInMonth(daysArray);

      // 현재 선택된 일자가 새로운 월에 존재하지 않는 경우, 마지막 날짜로 설정
      if (!daysArray.includes(day)) {
        setDay(daysArray[daysArray.length - 1]);
      }
    };

    updateDaysInMonth();

    const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(formattedDate);
  }, [ year, month, day ]);

  const handleYearChange = (e: any) => {
    const selectedYear = parseInt(e.target.value, 10);
    setYear(selectedYear);
  };

  const handleMonthChange = (e: any) => {
    const selectedMonth = parseInt(e.target.value, 10);
    setMonth(selectedMonth);
  };

  const handleDayChange = (e: any) => {
    const selectedDay = parseInt(e.target.value, 10);
    setDay(selectedDay);
  };

  return (
    <div>
      <Select 
        value={ year } 
        style={{ fontSize: "20px", fontFamily: "Dovemayo" }} 
        onChange={ handleYearChange }
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 48 * 4.5 + 8,
            },
          },
        }}
      >
        {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((year) => (
          <MenuItem key={ year } value={ year }>
            { year }
          </MenuItem>
        ))}
      </Select>
      <SelectLabel>년</SelectLabel>
      <Select 
        value={ month } 
        style={{ fontSize: "20px", fontFamily: "Dovemayo" }} 
        onChange={ handleMonthChange }
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 48 * 4.5 + 8,
            },
          },
        }}
      >
        {Array.from({ length: year === new Date().getFullYear() ? new Date().getMonth() + 1 : 12 }, (_, i) => i + 1).map((month) => (
          <MenuItem key={ month } value={ month }>
            { month }
          </MenuItem>
        ))}
      </Select>
      <SelectLabel>월</SelectLabel>
      <Select 
        value={ day } 
        style={{ fontSize: "20px", fontFamily: "Dovemayo" }}  
        onChange={ handleDayChange }
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 48 * 4.5 + 8,
            },
          },
        }}
        multiple={ false}
      >
        {daysInMonth.map((day) => (
          <MenuItem key={ day } value={ day }>
            { day }
          </MenuItem>
        ))}
      </Select>
      <SelectLabel>일</SelectLabel>
    </div>
  );
};

export default DateSelect;

type DateSelectProps = {
  selectedDate?: string,
  setSelectedDate?: React.Dispatch<React.SetStateAction<string>>,
}