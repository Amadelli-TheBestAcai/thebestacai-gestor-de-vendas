import moment from "moment";

export const calculateTimeAgo = (fromTime) => {
  const now = moment(); 
  const fromDateTime = moment(fromTime); 

  const duration = moment.duration(now.diff(fromDateTime));
  const hoursAgo = duration.hours();
  const minutesAgo = duration.minutes();

  if (hoursAgo > 0) {
    return `${hoursAgo} hora(s) atrás`;
  } else if (minutesAgo > 0) {
    return `${minutesAgo} minuto(s) atrás`;
  } else {
    return "alguns segundos atrás";
  }
}
