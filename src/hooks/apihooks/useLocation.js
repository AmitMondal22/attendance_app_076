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

    return { apiLocationCheck };
}

export default useLocation;
