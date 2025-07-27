import { useEffect, useState } from 'react';
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import "./global.css";
import { StyleSheet, Text, View, Button, Image, TouchableOpacity, ImageSourcePropType, ScrollView } from 'react-native';
import MainPage from './component/Main-page';
import AddEvent from './component/AddEvent';
import AddUsers from './component/AddUsers';
import CalendarFunc from './component/Calendar-page';
import EditDeletePage from './component/EditDeletePage';
import EditEventPage from './component/EditEventPage';
import GroupCalendar from './component/GroupCalendar';
import Groups from './component/Groups'
import GroupUsers from './component/GroupUsers'
import IndivGroupPage from './component/IndivGroupPage'
import LoginPage from './component/LoginPage';
import NewGroup from './component/NewGroup'
import ViewMods from './component/ViewMods';
import SearchModToAdd from './component/SearchModToAdd';
import ConfigureMods from './component/ConfigureMods';
import SelectModAY from './component/SelectModAY'
import ModClasses from './component/ModClasses'
import Settings from './component/Settings'
import GroupSettings from './component/GroupSettings'


import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { navigationRef } from './Data/navigation';

const Stack = createBottomTabNavigator();
const Group = createBottomTabNavigator();

import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldShowBanner: true,
    shouldSetBadge: false,
  }),
});

function BottomTabs() {
    return (
    <Stack.Navigator screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'white',
        tabBarStyle: {
            backgroundColor: '#f57c00',
        height: 120,
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
    <Stack.Screen
        name="View Mods"
        component={ViewMods}
        options = {{
            tabBarLabelStyle: {
                fontSize: 12,
            },
            tabBarIcon: ({ focused, color, size }) => (
                 <Ionicons name={focused ? "book" : "book-outline"}
                 size = {size}
                 color= {color} />
            ),
        }}
    />
    <Stack.Screen
            name="Settings"
            component={Settings}
            options = {{
                tabBarLabelStyle: {
                    fontSize: 12,
                },
                tabBarIcon: ({ focused, color, size }) => (
                     <Ionicons name={focused ? "settings" : "settings-outline"}
                     size = {size}
                     color= {color} />
                ),
            }}
    />
    </Stack.Navigator>
    );
}

function GroupTabs() {
    return (
    <Group.Navigator screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'white',
        tabBarStyle: {
            backgroundColor: '#f57c00',
        height: 120,
        }
    }}>
    <Group.Screen
        name="Group Info"
        component={IndivGroupPage}
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
    <Group.Screen
        name="Group Calendar"
        component={GroupCalendar}
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
    <Group.Screen
        name="Group Settings"
        component={GroupSettings}
        options = {{
            tabBarLabelStyle: {
                fontSize: 12,
            },
            tabBarIcon: ({ focused, color, size }) => (
                 <Ionicons name={focused ? "settings" : "settings-outline"}
                 size = {size}
                 color= {color} />
            ),
        }}
        />
    </Group.Navigator>
    );
}


export default function App() {

     useEffect(() => {
         GoogleSignin.configure({
             iosClientId: "1058453984266-39br9cbp3sc3k8r7a0ukdm06v5735i9m.apps.googleusercontent.com",
             webClientId: "1058453984266-m04g8chf7p1fc88oj0ldmfq1t78julra.apps.googleusercontent.com",
             offlineAccess: true,
             forceCodeForRefreshToken: true,
             profileImageSize: 50,
             scopes: [
                 'profile',
                 'email',
                 'https://www.googleapis.com/auth/calendar'
             ],
         });
     }, []);

    const toastStyle = {
      success: ({ text1, text2, onPress }) => (
          <TouchableOpacity onPress = {onPress} className = "px-1 flex-row w-full bg-orange-300 rounded-xl py-2">
        <View className = "pl-2">
        <Image className = "w-20 h-20" source={require('./assets/PlanIt.png')} />
        </View>
        <View className = "flex-col">
          <Text className="text-left text-2xl font-bold pt-2 pl-4">{text1}</Text>
          <Text className="text-black py-1 pb-3 pl-4">{text2}</Text>
        </View>
        </TouchableOpacity>
      ),
    };
    const Pages = createStackNavigator();
    return (
        <>
        <NavigationContainer ref = {navigationRef}>
            <Pages.Navigator screenOptions={{ headerShown: false }}>
            <Pages.Screen name="LoginPage" component={LoginPage} />
            <Pages.Screen name="BottomTabs" component={BottomTabs} />
            <Pages.Screen name="GroupTabs" component={GroupTabs} />
            <Pages.Screen name="Add Event" component={AddEvent} />
            <Pages.Screen name="EditDeletePage" component={EditDeletePage} />
            <Pages.Screen name="EditEventPage" component={EditEventPage} />
            <Pages.Screen name="Groups" component={Groups} />
            <Pages.Screen name="AddUsers" component={AddUsers} />
            <Pages.Screen name="NewGroup" component={NewGroup} />
            <Pages.Screen name="GroupUsers" component={GroupUsers} />
            <Pages.Screen name="SearchModToAdd" component={SearchModToAdd} />
            <Pages.Screen name="ConfigureMods" component={ConfigureMods} />
            <Pages.Screen name="SelectModAY" component={SelectModAY} />
            <Pages.Screen name="ModClasses" component={ModClasses} />
            </Pages.Navigator>
        </NavigationContainer>
        <Toast config = {toastStyle}/>
        </>
  );
  }



