import React from 'react'
import { Image } from 'react-bootstrap';
import defaultImage from '../assets/img/index.png'
import { BsAlarm, BsFillPinMapFill, BsBarChartSteps } from "react-icons/bs";

const EventDetails = ({ details, coachs, establishments, activities }) => {

    const searchArray = (arrayToSearch, id, keyPropName, defaultElement) => {

        if (arrayToSearch && arrayToSearch.length) {
            var found = arrayToSearch.find(ele => ele.id === id);

            if (found && found[keyPropName]) {
                return found[keyPropName];
            } else {
                return defaultElement;
            }
        }
    };

    const findCoach = (id) => {
        return searchArray(coachs, id, 'photo', defaultImage)
    };

    const findEstablishment = (id) => {

        var defValue = "Address will be announced later";
        var res = searchArray(establishments, id, 'location', defValue);
        if (res && res['address_line_1'] && res['address_line_1'].length)
            return res['address_line_1'];
        else return defValue;
    };
    const findActivity = (id) => {
        return searchArray(activities, id, 'name', "Lesson")
    };

    return (
        <div className="card flex-row flex-wrap mt-3" >
            <div className="card-header border-0">
                <Image className="photo" src={findCoach(details.rest.coach)} alt="" roundedCircle />
            </div>
            <div className="card-block px-3">
                <h4 className="card-title">{findActivity(details.rest.meta_activity)}</h4>
                <p className="card-text"><BsAlarm/> Hour : {details.hour}</p>
                <p className="card-text"><BsBarChartSteps/> Level : {details.rest.level}</p>
            </div>
            <div className="w-100"></div>
            <div className="card-footer w-100 text-muted">
                <BsFillPinMapFill/> {findEstablishment(details.rest.establishment)}
            </div>
        </div>
    )
};
export default EventDetails;