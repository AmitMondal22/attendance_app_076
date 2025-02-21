import axios from 'axios';
import { address } from '../../config/routes';
import { AuthContext } from '../../AuthContext';
import { useContext } from 'react';

function useLocation() {
    const { user } = useContext(AuthContext);
    const token = user?.token; // Ensure users is defined before accessing token
    const apiLocationCheck = async () => {
        try {
            const response = await axios.post(address.CLOCK_IN_CHECK, 
                {},
                {
                headers: {
                    'Authorization': `Bearer ${token}`, // Use token for Authorization
                    'Content-Type': 'application/json', // Example for content-type
                    // Add more headers if necessary
                }
            });

            if (response.status === 200) {
                return {
                    success: true,
                    data: response.data, // Return response data
                };
            } else {
                return {
                    success: false,
                    message: response.statusText || 'Login failed',
                };
            }
        } catch (error) {
            console.error("Login Error:", error);

            return {
                success: false,
                message: error.response?.data?.message || error.message || 'An error occurred',
            };
        }
    };



    const apiLocationCheckOut = async () => {
        try {
            const response = await axios.post(address.CLOCK_OUT_CHECK, 
                {},
                {
                headers: {
                    'Authorization': `Bearer ${token}`, // Use token for Authorization
                    'Content-Type': 'application/json', // Example for content-type
                    // Add more headers if necessary
                }
            });

            if (response.status === 200) {
                return {
                    success: true,
                    data: response.data, // Return response data
                };
            } else {
                return {
                    success: false,
                    message: response.statusText || 'Login failed',
                };
            }
        } catch (error) {
            console.error("Login Error:", error);

            return {
                success: false,
                message: error.response?.data?.message || error.message || 'An error occurred',
            };
        }
    };


    const apiClockIn= async (latitude, longitude,location_setting) => {
        console.log("MMMMMMMMMMMMMMMMMMMMMMMM", latitude, longitude,location_setting);
        try {
            const response = await axios.post(address.CLOCK_IN, 
                { latitude, longitude,location_setting },
                {
                headers: {
                    'Authorization': `Bearer ${token}`, // Use token for Authorization
                    'Content-Type': 'application/json', // Example for content-type
                    // Add more headers if necessary
                }
            });

            if (response.status === 200) {
                return {
                    success: true,
                    data: response.data, // Return response data
                };
            } else {
                return {
                    success: false,
                    message: response.statusText || 'Clock-In failed',
                };
            }
        } catch (error) {
            console.error("Clock-In Error:", error);

            return {
                success: false,
                message: error.response?.data?.message || error.message || 'An error occurred',
            };
        }
    };
    const apiClockOut= async (latitude, longitude,location_setting) => {
        try {
            const response = await axios.post(address.CLOCK_OUT, 
                { latitude, longitude, location_setting },
                {
                headers: {
                    'Authorization': `Bearer ${token}`, // Use token for Authorization
                    'Content-Type': 'application/json', // Example for content-type
                    // Add more headers if necessary
                }
            });

            if (response.status === 200) {
                return {
                    success: true,
                    data: response.data, // Return response data
                };
            } else {
                return {
                    success: false,
                    message: response.statusText || 'Clock-Out failed',
                };
            }
        } catch (error) {
            console.error("Clock-Out Error:", error);

            return {
                success: false,
                message: error.response?.data?.message || error.message || 'An error occurred',
            };
        }
    };
    const apiLocationTrack= async (latitude, longitude) => {
        try {
            const response = await axios.post(address.LOCATION_TRACK, 
                { latitude, longitude },
                {
                headers: {
                    'Authorization': `Bearer ${token}`, // Use token for Authorization
                    'Content-Type': 'application/json', // Example for content-type
                    // Add more headers if necessary
                }
            });

            if (response.status === 200) {
                return {
                    success: true,
                    data: response.data, // Return response data
                };
            } else {
                return {
                    success: false,
                    message: response.statusText || 'Location Track failed',
                };
            }
        } catch (error) {
            console.error("Location Track Error:", error);

            return {
                success: false,
                message: error.response?.data?.message || error.message || 'An error occurred',
            };
        }
    };
    
    

    const apiLocationSettings= async () => {
        try {
            const response = await axios.post(address.LOCATION_SETTINGS, 
                {},
                {
                headers: {
                    'Authorization': `Bearer ${token}`, // Use token for Authorization
                    'Content-Type': 'application/json', // Example for content-type
                    // Add more headers if necessary
                }
            });

            if (response.status === 200) {
                return {
                    success: true,
                    data: response.data, // Return response data
                };
            } else {
                return {
                    success: false,
                    message: response.statusText || 'Location Track failed',
                };
            }
        } catch (error) {
            console.error("Location Track Error:", error);

            return {
                success: false,
                message: error.response?.data?.message || error.message || 'An error occurred',
            };
        }
    };

    return { apiLocationCheck, apiLocationCheckOut, apiClockIn, apiClockOut, apiLocationTrack, apiLocationSettings };
}

export default useLocation;
