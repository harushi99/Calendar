import { Accordion } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import EventDetails from './EventDetails';


const WeeklyEvents = (props) => {

    const [coachs, setCoachs] = useState([]);
    const [establishments, setEstablishments] = useState([]);
    const [activities, setActivities] = useState([]);
    useEffect(() => {

        var coachIds = [];
        var establishmentIds = [];
        var activityIds = [];
        props.events.map(event => {
            coachIds = new Set([...coachIds, ...event.data.map(details => details.rest.coach)]);
            establishmentIds = new Set([...establishmentIds, ...event.data.map(details => details.rest.establishment)]);
            activityIds = new Set([...activityIds, ...event.data.map(details => details.rest.meta_activity)]);
        })
        async function getCoach() {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}associated_coach/?company=${process.env.REACT_APP_COMPANY}&id__in=${Array.from(coachIds).join(',')}`);
            const content = await response.json();
            setCoachs(content);
        }
        async function getEstablishment() {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}establishment/?company=${process.env.REACT_APP_COMPANY}&id__in=${Array.from(establishmentIds).join(',')}`);
            const content = await response.json();
            setEstablishments(content.results);
        }
        async function getActivity() {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}meta-activity/?company=${process.env.REACT_APP_COMPANY}&id__in=${Array.from(activityIds).join(',')}`);
            const content = await response.json();
            setActivities(content.results);
        }
        getCoach();
        getEstablishment();
        getActivity();
    }, [props.events]);


    return (
        <div className="row">
            {props.events.map(event => {
                return (<div className="pt-3" key={event.key} >
                    <div className="card card-background border-0">
                        <div className="card-body">
                            <Accordion>
                                <Accordion.Item >
                                    <Accordion.Header>{event.key}</Accordion.Header>
                                    <Accordion.Body>
                                        {event.data.map(details => {
                                            return (<EventDetails details={details} coachs={coachs} establishments={establishments} activities={activities} />)
                                        })}
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                        </div>
                    </div>
                </div>
                )
            })}
        </div>)
};

export default WeeklyEvents;
