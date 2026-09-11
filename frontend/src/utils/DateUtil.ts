export const months: string[] = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
];

export const dayHeaders = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function formatMonthYear(selectedMonth:number, selectedYear:number) {
    const monthString:string = months[selectedMonth];
    return monthString + " " + String(selectedYear);
}

export function getWeekDates(selectedDate: Date): Date[] {
    const dayOfWeek = selectedDate.getDay();
    const mondayOffset = (dayOfWeek === 0) ? 6 : dayOfWeek - 1;

    const monday = new Date(selectedDate);
    monday.setDate(selectedDate.getDate() - mondayOffset);

    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        return d;
    });
}

export function formatDateForApi(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}