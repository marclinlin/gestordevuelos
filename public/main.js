/* DATA RECEIVED */
const year = '2020'
const currentMonth = 'May'
const previousMonth = 'April'
const nextMonth = 'June'
const firstDayOfweek = 'Monday'
const days = [
    26, 27, 28, 29, 30, 1, 2, 3,
    4, 5, 6, 7, 8, 9, 10,
    11, 12, 13, 14, 15, 16, 17,
    18, 19, 20, 21, 22, 23, 24,
    25, 26, 27, 28, 29, 30,
    31, 1, 2, 3, 4, 5, 6
];
const currentDay = 27;


const events = [
    {
        day: 19,
        month: 'May',
        startTimeHours: '12',
        startTimeMinutes: '00',
        endTimeHours: '15',
        endTimeMinutes: '30',
        type: 'flight',
        registration: 'EC-NAQ',
        instructor: 'Rubén Velázquez'
    },
    {
        day: 22,
        month: 'May',
        startTimeHours: '10',
        startTimeMinutes: '00',
        endTimeHours: '11',
        endTimeMinutes: '30',
        type: 'exam',
        subject: 'Air Law',
        instructor: 'Jordi Adell'
    },
    {
        day: 22,
        month: 'May',
        startTimeHours: '12',
        startTimeMinutes: '00',
        endTimeHours: '15',
        endTimeMinutes: '00',
        type: 'flight',
        registration: 'EC-NEM',
        instructor: 'Tomás Losa'
    },
    {
        day: 22,
        month: 'May',
        startTimeHours: '16',
        startTimeMinutes: '00',
        endTimeHours: '21',
        endTimeMinutes: '00',
        type: 'class',
        subject: 'Meteorology',
        instructor: 'Jordi Adell'
    },
    {
        day: 14,
        month: 'May',
        startTimeHours: '12',
        startTimeMinutes: '00',
        endTimeHours: '14',
        endTimeMinutes: '00',
        type: 'exam',
        subject: 'POF',
        instructor: 'Ignacio García'
    }
]

/* CREATE CALENDAR */
const weekdays = firstDayOfweek === 'Monday' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] : (firstDayOfweek === 'Sunday' ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] : ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
const numberOfDays = days.length;
const daysElement = document.querySelector('ul.days')
let month = days[0] >= 23 ? previousMonth : currentMonth;
for (const [index, dayNumber] of days.entries()) {
    if (dayNumber === 1) {
        month = month === previousMonth ? currentMonth : nextMonth
    }
    const newDay = document.createElement('li');
    newDay.setAttribute('id', `${dayNumber}-${month}`)
    if (month !== currentMonth) {
        newDay.classList.add('previous-next')
    } else if (dayNumber === currentDay) {
        newDay.classList.add('today')
    }
    if (numberOfDays === 42 && index === 35 || numberOfDays === 35 && index === 28 || numberOfDays === 28 && index === 21) {
        newDay.classList.add('bottom-left')
    } else if (numberOfDays === 42 && index === 41 || numberOfDays === 35 && index === 34 || numberOfDays === 28 && index === 27) {
        newDay.classList.add('bottom-right')
    } else if (index === 0) {
        newDay.classList.add('top-left')
    } else if (index === 6) {
        newDay.classList.add('top-right')
    } else if (index % 7 === 0) {
        newDay.classList.add('left')
    } else if (index % 7 === 6) {
        newDay.classList.add('right')
    } else if (index <= 6) {
        newDay.classList.add('top')
    } else if (numberOfDays === 42 && index >= 35 || numberOfDays === 35 && index >= 28 || numberOfDays === 28 && index >= 21) {
        newDay.classList.add('bottom')
    } else {
        newDay.classList.add('center')
    }
    newDay.innerHTML = `<span class="no-select">${days[index]}<span>`;
    daysElement.appendChild(newDay)
}

/* ADD EVENTS */
events.forEach(event => {
    const day = event.day;
    const month = event.month;
    const type = event.type;
    const startTime = `${event.startTimeHours}:${event.startTimeMinutes}`
    const endTime = `${event.endTimeHours}:${event.endTimeMinutes}`
    const selectDay = document.getElementById(`${day}-${month}`);
    const newEvent = document.createElement('div')
    newEvent.setAttribute('class', 'event')
    newEvent.classList.add(type)
    if (type === 'flight') {
        newEvent.innerHTML = `${startTime}`
    } else if (type === 'class' || type === 'exam') {
        newEvent.innerHTML = `${startTime}`
    }
    selectDay.appendChild(newEvent)
})