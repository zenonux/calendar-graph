
export function isLeapYear(date = new Date()) {
    let year = date.getFullYear()
    if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
        return true
    }
    return false
}

export function getFirstDayOfYear(date = new Date()) {
    return new Date(date.getFullYear(), 0, 1)
}

export function getDayOfYear(date = new Date()) {
    const timestamp1 = Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
    );
    const timestamp2 = Date.UTC(date.getFullYear(), 0, 0);

    const differenceInMilliseconds = timestamp1 - timestamp2;

    const differenceInDays = differenceInMilliseconds / 1000 / 60 / 60 / 24;

    return differenceInDays;
}

export function getLastWeekdaysOfMonth(month: number) {
    let days = [];
    let loop = 7;
    let lastDay = getLastDayOfMonth(month)
    while (loop) {
        days.push(getDayOfYear(getPrevDay(lastDay, loop)))
        loop--;
    }
    return days
}

function getPrevDay(day: Date, count: number) {
    return new Date(day.getFullYear(), day.getMonth(), day.getDay() - count)
}


function getLastDayOfMonth(month: number) {
    return new Date(new Date().getFullYear(), month + 1, 0)
}

