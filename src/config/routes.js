// const BASEURL="http://192.168.224.10:8019"
const BASEURL="http://attendance.iotblitz.com/"


exports.address={
    LOGIN:`${BASEURL}/auth/login`,    
    CLOCK_IN_CHECK:`${BASEURL}/api/clock_in/check`,
    CLOCK_OUT_CHECK:`${BASEURL}/api/clock_in/check_out`,
    CLOCK_IN:`${BASEURL}/api/clock_in`,
    CLOCK_OUT:`${BASEURL}/api/clock_out`,
    LOCATION_TRACK:`${BASEURL}/api/location/track`,
    LOCATION_SETTINGS:`${BASEURL}/api/location/settings`,
    REPORT_CHECKING:`${BASEURL}/api/report/clock_out`,
}