"use strict";
function get_work_data() {
    const carender_data = [];
    const work_obj = get_work_obj();
    const carender_ids = [...new Set(new ss(SHEETS.WORKLIST).get_data().map(row => row[1]))];
    const events = [];
    const startday = new Date();
    startday.setFullYear(startday.getFullYear() - 10);
    const endday = new Date();
    endday.setFullYear(endday.getFullYear() + 1);
    carender_ids.forEach(calendar_id => {
        if (!calendar_id)
            return;
        const calendar = CalendarApp.getCalendarById(calendar_id);
        if (!calendar) {
            console.log(calendar + "これはidになっていないよ");
            return;
        }
        events.push(...calendar.getEvents(startday, endday));
    });
    events.forEach(event => {
        if (!event)
            return;
        const title = event.getTitle();
        const date = Utilities.formatDate(event.getStartTime(), Session.getScriptTimeZone(), "yyyy/MM/dd");
        const hour = (event.getEndTime().getTime()
            - event.getStartTime().getTime())
            / (1000 * 60 * 60);
        const [work, shift] = title.split(" ");
        const work_data = work_obj[work];
        if (!work_data) {
            carender_data.push([true, date, work, shift, "???", "???", "???"]);
            return;
        }
        const color = work_data.color;
        const income = Number(work_data.hour_wage) * hour;
        const shift_data = work_data.shift_list[shift];
        if (!shift_data) {
            carender_data.push([true, date, work, shift, String(color), String(income), "???"]);
            return;
        }
        const income_bonus = income - (Number(work_data.hour_wage) * Number(shift_data.work_hour));
        carender_data.push([true, date, work, shift, String(color), String(income), String(income_bonus)]);
    });
    return { carender_data, work_obj };
}
function get_work_obj() {
    const work_list = new ss(SHEETS.WORKLIST).get_data();
    const shift_list = new ss(SHEETS.SHIFTLIST).get_data();
    const work_obj = {};
    work_list.forEach(work => {
        if (!work)
            return;
        work_obj[String(work[0])] = {
            carender_id: String(work[1]),
            hour_wage: String(work[2]),
            color: String(work[3]),
            shift_list: {}
        };
        shift_list.forEach(shift => {
            if (shift[0] !== work[0])
                return;
            work_obj[String(work[0])].shift_list[String(shift[1])] = {
                start_time: Utilities.formatDate(new Date(shift[2]), Session.getScriptTimeZone(), "HH:mm"),
                end_time: Utilities.formatDate(new Date(shift[3]), Session.getScriptTimeZone(), "HH:mm"),
                work_hour: String((new Date(shift[3]).getTime() - new Date(shift[2]).getTime()) / (1000 * 60 * 60))
            };
        });
    });
    return work_obj;
}
