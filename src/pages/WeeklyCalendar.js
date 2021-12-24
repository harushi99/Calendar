import React, { useEffect } from 'react'
import "./WeeklyCalendar.css";
import { useState } from "react";
import WeeklyCalendarRenderer from "../helpers/WeeklyCalendarRenderer";
import WeeklyEvents from "../components/WeeklyEvents";
import { format, endOfWeek} from 'date-fns';


export default function WeeklyCalendar() {
    const [date, setDate] = useState(new Date());
    const [endDate, setEndDate] = useState(endOfWeek(new Date(), { weekStartsOn: 1 }));
    const [events, setEvents] = useState();
    const showDetails = React.useRef(false);
    const showDetailsHandle = (day, endDate) => {
        setDate(day);
        setEndDate(endDate);
        showDetails.current = true;
    };

    useEffect(() => {
        (
            async () => {
                const filtersParams = [];

                filtersParams.push(`company=${process.env.REACT_APP_COMPANY}`);

                if (date) {
                    const dateFormat = format(date, "yyyy-MM-dd");
                    filtersParams.push(`min_date=${dateFormat}`);
                }

                if (endDate) {
                    const endDateFormat = format(endDate, "yyyy-MM-dd");
                    filtersParams.push(`max_date=${endDateFormat}`);
                }

                const response = await fetch(`${process.env.REACT_APP_BASE_URL}offer/?${filtersParams.join('&')}`);
                const content = await response.json();

                const object = content.results.reduce((r, { date_start: day, ...rest }) => {
                    day = new Date(day);
                    const key = format(day, "EEEE do MMMM");
                    const hour = format(day, "HH:mm")
                    if (!r[key]) r[key] = { key, data: [{ hour, rest }] }
                    else r[key].data.push({ hour, rest })
                    return r;
                }, {})

                const events = Object.values(object);
                setEvents(events);
            }
        )()

    }, [date, endDate]);

    return (
        <div className="App">
            <h1 className='text-center'>Calendar</h1>
            <br />
            <WeeklyCalendarRenderer showDetailsHandle={showDetailsHandle} />
            <br />
            {showDetails.current && events ? <WeeklyEvents events={events} /> : "There are no events for the selected dates"}
        </div>
    );
}
