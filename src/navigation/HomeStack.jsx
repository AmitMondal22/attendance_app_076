import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import DetailsScreen from "../screens/DetailsScreen";
import CheckInScreen from '../screens/CheckInScreen';

const Stack = createStackNavigator();
const HomeStack = () => {
    return (
        <>
                <Stack.Navigator>
                    <Stack.Screen name="Home" component={HomeScreen}  options={{
                        headerShown: false
                    }} />
                    <Stack.Screen name="ClockIn" component={CheckInScreen}  options={{
                        headerShown: false
                    }} />
                  <Stack.Screen name="Details" component={DetailsScreen}  options={{
                        headerShown: false
                    }} />
                </Stack.Navigator>
        </>
    );
}

export default HomeStack;
