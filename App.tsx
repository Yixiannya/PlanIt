import { useEffect, useState } from 'react';
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import "./global.css";
import { StyleSheet, Text, View, Button, Image, TouchableOpacity, ImageSourcePropType, ScrollView } from 'react-native';
import MainPage from './component/Main-page';
import CalendarFunc from './component/Calendar-page';
import AddEvent from './component/AddEvent';
import EditDeletePage from './component/EditDeletePage';
import EditEventPage from './component/EditEventPage';
import LoginPage from './component/LoginPage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const Stack = createBottomTabNavigator();

function BottomTabs() {
    return (
    <Stack.Navigator screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'white',
        tabBarStyle: {
            backgroundColor: '#f57c00',
        height: 85,
        }
    }}>
    <Stack.Screen
        name="Main Page"
        component={MainPage}
        options = {{
            tabBarLabelStyle: {
               fontSize: 12,
            },
            tabBarIcon: ({ focused, color, size }) => (
                <Ionicons name={focused ? "home" : "home-outline"}
                size = {size}
                color= {color} />
            ),
        }}
    />
    <Stack.Screen
        name="Calendar"
        component={CalendarFunc}
        options = {{
            tabBarLabelStyle: {
                fontSize: 12,
            },
            tabBarIcon: ({ focused, color, size }) => (
                 <Ionicons name={focused ? "calendar" : "calendar-outline"}
                 size = {size}
                 color= {color} />
            ),
        }}
    />
    </Stack.Navigator>
    );
}

export default function App() {

     useEffect(() => {
        GoogleSignin.configure({
            iosClientId: "1058453984266-39br9cbp3sc3k8r7a0ukdm06v5735i9m.apps.googleusercontent.com",
            webClientId: "1058453984266-m04g8chf7p1fc88oj0ldmfq1t78julra.apps.googleusercontent.com",
            profileImageSize: 50,
        });
    });
    const Pages = createStackNavigator();
    return (
        <NavigationContainer>
            <Pages.Navigator screenOptions={{ headerShown: false }}>
            <Pages.Screen name="LoginPage" component={LoginPage} />
            <Pages.Screen name="BottomTabs" component={BottomTabs} />
            <Pages.Screen name="Add Event" component={AddEvent} />
            <Pages.Screen name="EditDeletePage" component={EditDeletePage} />
            <Pages.Screen name="EditEventPage" component={EditEventPage} />
            </Pages.Navigator>
        </NavigationContainer>
  );
  }



