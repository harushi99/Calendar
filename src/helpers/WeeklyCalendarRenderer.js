import { useState } from "react";
import {
    format,
    subMonths,
    addMonths,
    startOfWeek,
    addDays,
    isSameDay,
    lastDayOfWeek,
    getWeek,
    addWeeks,
    subWeeks
} from "date-fns";


const WeeklyCalendarRenderer = ({ showDetailsHandle }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [currentWeek, setCurrentWeek] = useState(getWeek(currentMonth));
    const [selectedDate, setSelectedDate] = useState(new Date());

    const changeMonthHandle = (btnType) => {
        if (btnType === "prev") {
            setCurrentMonth(subMonths(currentMonth, 1));
        }
        if (btnType === "next") {
            setCurrentMonth(addMonths(currentMonth, 1));
        }
    };

    const changeWeekHandle = (btnType) => {
        if (btnType === "prev") {
            setCurrentMonth(subWeeks(currentMonth, 1));
            setCurrentWeek(getWeek(subWeeks(currentMonth, 1)));
            onDateClickHandle(startOfWeek(subWeeks(currentMonth, 1), { weekStartsOn: 1 }), lastDayOfWeek(subWeeks(currentMonth, 1), { weekStartsOn: 1 }));
        }
        if (btnType === "next") {
            setCurrentMonth(addWeeks(currentMonth, 1));
            setCurrentWeek(getWeek(addWeeks(currentMonth, 1)));
            onDateClickHandle(startOfWeek(addWeeks(currentMonth, 1), { weekStartsOn: 1 }), lastDayOfWeek(addWeeks(currentMonth, 1), { weekStartsOn: 1 }));
        }
    };

    const onDateClickHandle = (day, endDate) => {
        setSelectedDate(day);
        showDetailsHandle(day, endDate);
    };

    const renderHeader = () => {
        const dateFormat = "MMM yyyy";
        return (
            <div className="header rowGrid flex-middle">
                <div className="colGrid col-start">
                    {/* <div className="icon" onClick={() => changeMonthHandle("prev")}>
            prev month
          </div> */}
                </div>
                <div className="colGrid col-center">
                    <span>{format(currentMonth, dateFormat)}</span>
                </div>
                <div className="colGrid col-end">
                    {/* <div className="icon" onClick={() => changeMonthHandle("next")}>next month</div> */}
                </div>
            </div>
        );
    };
    const renderDays = () => {
        const dateFormat = "EEE";
        const days = [];
        let startDate = startOfWeek(currentMonth, { weekStartsOn: 1 });
        for (let i = 0; i < 7; i++) {
            days.push(
                <div className="colGrid col-center" key={i}>
                    {format(addDays(startDate, i), dateFormat)}
                </div>
            );
        }
        return <div className="days rowGrid">{days}</div>;
    };
    const renderCells = () => {
        const startDate = startOfWeek(currentMonth, { weekStartsOn: 1 });
        const endDate = lastDayOfWeek(currentMonth, { weekStartsOn: 1 });
        const dateFormat = "d";
        const rows = [];
        let days = [];
        let day = startDate;
        let formattedDate = "";
        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, dateFormat);
                const cloneDay = day;
                days.push(
                    <div
                        className={`colGrid cell ${isSameDay(day, new Date())
                                ? "today"
                                : isSameDay(day, selectedDate)
                                    ? "selected"
                                    : ""
                            }`}
                        key={day}
                        onClick={() => {
                            //const dayStr = format(cloneDay, "yyyy-MM-dd");
                            onDateClickHandle(cloneDay, endDate);
                        }}
                    >
                        <span className="number">{formattedDate}</span>
                        <span className="bg">{formattedDate}</span>
                    </div>
                );
                day = addDays(day, 1);
            }

            rows.push(
                <div className="rowGrid" key={day}>
                    {days}
                </div>
            );
            days = [];
        }
        return <div className="body">{rows}</div>;
    };
    const renderFooter = () => {
        return (
            <div className="header rowGrid flex-middle">
                <div className="colGrid col-start">
                    <div className="icon" onClick={() => changeWeekHandle("prev")}>
                        prev week
          </div>
                </div>
                <div>{currentWeek}</div>
                <div className="colGrid col-end" onClick={() => changeWeekHandle("next")}>
                    <div className="icon">next week</div>
                </div>
            </div>
        );
    };
    return (
        <div className="calendar">
            {renderHeader()}
            {renderDays()}
            {renderCells()}
            {renderFooter()}
        </div>
    );
};

export default WeeklyCalendarRenderer;
