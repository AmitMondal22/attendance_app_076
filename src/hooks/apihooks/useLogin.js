import axios from 'axios';
import { address } from '../../config/routes';

function useLogin() {
    const apiLogin = async (email, password) => {
        try {
           
            
            const response = await axios.post(address.LOGIN, { email, password });

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

    return { apiLogin };
}

export default useLogin;
