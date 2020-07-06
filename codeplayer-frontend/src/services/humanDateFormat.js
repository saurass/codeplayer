import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";
momentDurationFormatSetup(moment);

export const humanDateFormat = (starttime, endtime) => {
    var t1 = Number(starttime);
    var t2 = Number(endtime);
    let tdhr = moment.duration((t2 - t1), "milliseconds").format("h:mm", { trim: false });
    return `${tdhr} hrs`
}

export const humanPreciseDateFormat = (starttime, endtime) => {
    var t1 = Number(starttime);
    var t2 = Number(endtime);
    let tdhr = moment.duration((t2 - t1), "milliseconds").format("h:mm:ss", { trim: false });
    return `${tdhr} hrs`
}