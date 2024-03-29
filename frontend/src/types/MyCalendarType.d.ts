export interface DiaryType {
    memberId: int,
    daily_diary_id: int,
    date: String,
    emotion: String,
}

export interface ScheduleType {
    schedule_id: int,
    memberId: int,
    title: String,
    content: String,
    date: String,
    color?: string,
}

export interface MyCalendarType {
    diaries?: DiaryType[],
    schedules?: ScheduleType[]
}