## Link to Expo Developer Version for this app: https://drive.google.com/file/d/1-AR0UFPnlFlEJOD31nwO6XVUbGX7v3p_/view?usp=drive_link

# PlanIt
## NUS Orbital 2025 - Milestone 1 Report
Team 7418, PlanIt
### Proposed Level of Achievement:
Apollo 11
### Motivation:
Much of the information in NUS is separated from one another, from Canvas to MyEduRec. We hope to be able to allow students to consolidate all of this information in one place, and not only provide them some assistance bringing order amidst their hectic schedules, but also help them adjust to their new curriculum at the start of every semester.
### Aim:
We hope to develop a mobile application, PlanIt, to assist with students’ scheduling and planning of classes and events.
Users will be able to create groups to arrange and form schedules with others, from small group projects, to clubs. These schedules will be reflected universally amongst all participants, to the discretion of the group’s admin. We also hope to provide further assistance to students in their busy schedules, by also providing the convenience of approximate travel times to certain events and locations, to ensure they are always on-time.
### User Stories:
As a student who wants to plan a week’s work efficiently, I would want to be able to plan out my modules and assignment due dates so that I can find the appropriate free time to finish my work, as well as have help getting a better grasp of the day’s schedules in case I feel overwhelmed.
As an EXCO of a club, I would want to be able to notify all of my club members in the group of the upcoming activities for the week, so that my club members can be aware of upcoming activities and integrate them seamlessly into their own schedules without having to check other messaging apps like Telegram.
As a student, I would want to arrange and coordinate my group projects with my groupmates, allowing us to schedule meetings so we can come together and work at an appropriate time.
As a user, I want to be able to change my account settings such as my username.
As a user, I want to be able to join groups of like-minded users to have coordinated group events planned.
As a group admin, I want to be able to give specific permissions, so only certain people can create events in my group.
As a group admin, I want to be able to block certain people from entering the group or ban troublesome users from the group.
### Scope of Project:
Milestone 1 Progress:
Mobile Application:
Login page
Google Sign In Authentication
Home page
Upcoming events bar
Current events list
Calendar page
Event creation
Event deletion
Event editing

Proposed future progress:
Milestone 2:
Logout button for users
Implement events that span over a range of dates.
Set string length limits to user name, event name and event description.
Creation and deletion of groups for users.
Ability to assign a single event to multiple users in a group
Assigning different roles in a group to facilitate different permissions of event creation and group management

Milestone 3:
Notification system to notify users of upcoming events and asking for permission to join groups
Syncing with external API like NUSMODS for more convenient retrieval of university course timings
Implementing regular events like holidays into the calendar
Implement travel time estimations from Google Maps API or NUS NextBus
Search by name function to filter out multiple events a user has.

### Features:
Authentication:

Our first main feature is that users are able to utilise Google’s Oauth 2.0 to sign in and access their user information in the app. This allows quick and secure login authentication, ensuring the safety and security of user information, such that no one else can access their account unless they have the Google account that created that exact account. 

When a user first opens up the PlanIt app, they will be greeted by the login page. 
By pressing the ‘Login with Google’ button, the user will be prompted to select a Google account to login to the app. 
After selecting or signing in to their Google account, the Google prompt will close and return to the PlanIt app. Then the app will switch to the main dashboard.


Dashboard:

When a user has logged in, the dashboard is the first page they will see. Top right of the page will show the user’s icon when implemented. This is in development so it currently displays a placeholder image.

The dashboard page has a scrollbar above showing the user’s upcoming events, starting with the most urgent event that is closest to the current date and time. The events on the bar will show the event’s icon (when implemented), the name of the event, its date and time.
A user can tap on the event in that bar to open it up and see the details of the events. If there are no events, the bar will be blank.

Below it lists the groups that the user would be in, however this has not been implemented yet.
If the user is not in any groups, that section will be empty as well.

At the very bottom of the page are two tabs. Selecting the calendar tab will switch to the calendar page.


Calendar page:

Upon switching to the calendar page, the top half of the page shows a calendar of the current month, with the current date highlighted in a blue circle. Pressing the arrows next to the month allows you to switch between different months. A user can select other dates to be highlighted as well.

The bottom half of the page shows the events that would be listed on the given highlighted date. If there are no events, it will be blank, stating that there are no events for the given day. A user can select an event in this list to view the details of and edit.
A user can also press the plus sign on the top right to go to the add event page to create a new event.


Add event page:

At the event page, the user selects a date from the given calendar. The arrows next to the month allows the user to switch to different months for the date, while the days can be highlighted to choose a single date for the event. This is required.
The time is then typed in by the user, in the format of hours:minutes. This is required.
The user must then input a name for the event by typing it in. This is required.
The user can also type out the description of the event. This is optional.

The app will give a prompt indicating that the event was created successfully. The user can close the prompt by selecting OK.


Event options page:

When selecting an event in the given date, a page will show the details of the event, which are its name, its description and the date it occurs. 
There are also buttons to edit and delete the event.

Selecting the ‘Edit data’ button shows a screen similar to the Add Event page. 
Selecting the ‘Delete data’ button will give a confirmation prompt to delete the event. Selecting YES will close the prompt and delete the event, while selecting NO closes the prompt without deleting the event.


Editing an event:

Editing date, time, name and description is similar to that of adding an event.
Upon successfully editing the event, the app will give a prompt indicating edit success. The user can close this prompt by selecting OK.

### Tech Stack:
Frontend: React Native, Android Studio
Backend: MongoDB, NodeJS, NoSQL
Version Control: Github
Authentication: Google Cloud API
Deployment: Render
### Working Concept:
Please refer to the project [video](https://youtu.be/iQ5stYlp2X4) for our currently working features in action.

The current prototype of the app is also available to be used by downloading the source code from the Github repo, and downloading the APK.

Android Studio is required for emulation of an Android phone to run the app on your computer.

To try out the app:

Download the source code from Github and the APK from the Google drive link.
Place the APK file in the folder containing the source code.
Run npm install in the terminal.
If on Android Studio emulator, drag and drop the downloaded APK into your emulated device window to install the APK
Run npx expo start in the terminal.
The app should begin running in the Android Studio emulator.
### Project Log:
Refer to the attached spreadsheet [here](https://docs.google.com/spreadsheets/d/10PFNlH9ZJCyJIUI4B1prtAhdHoA_GZrtEwoDidm1E9A/edit?usp=sharing).
