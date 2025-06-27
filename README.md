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

Milestone 2:
Logout button for users
Implemented events that span over a range of dates.
Creation and deletion of groups for users.
Ability to assign a single event to multiple users in a group
Assigning different roles in a group to facilitate different permissions of event creation and group management

Proposed future progress:
Milestone 3:
Minor editing of user info such as users being able to rename themselves
Set string length limits to user name, event name and event description.
Notification system to notify users of upcoming events and asking for permission to join groups
Syncing with external API like NUSMODS for more convenient retrieval of university course timings
Implementing regular events like holidays into the calendar
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


Groups page:

Upon clicking “Your current groups”, the user is brought to a page that displays their groups in a 3x grid. Clicking any of the events will bring the user to the respective individual group page as is labelled on the icon. If a user has no groups, this page will be empty.
Alternatively, they can click the “Create a Group” button, which will bring them to the “Create a new Group “ page.


Create a new Group page:

On this page, a user can input all the relevant information required to create a group.
The user must first input a name for the group by typing it in. The user must then input a description for the group by typing it in. These are required. If a user does not input a description, an alert will pop up alerting them a name/description is required.

The user must then select icons representing the users they want to add to the group. Upon selecting a user, the user is removed from the display and moved to the added users section. If no users are added to the added users portion, the group will be created with only the creator as an admin and no users.

Users can also make use of the search function to find the relevant users to add. By typing in the start of a user’s name and pressing the search button, they can change the display to only show users that begin with the input.

Upon pressing the “Create Group” button, a prompt indicating that the group was created successfully will appear. The user can close the prompt by selecting OK.Upon closing the prompt, the user will be redirected back to the dashboard, which will be updated with the new group.


Individual Group page:

Upon pressing a group from either the dashboard or the Groups page, a user is redirected to this page. Pressing the X button above will redirect the user back to the respective page they arrived from.
On the Individual Group page, a user can view all of the information of a group, from it’s icon (yet to be implemented), it’s name, number of admins and users, its description, as well as a scrollbar depicting all of its users and admins. Admins will always be displayed in the front of the scrollbar, with the tag (Admin) underneath to differentiate them from the users.
Beside the scrollbar is a button “View all”, that redirects the user to the Group Users page.
Below this are two buttons, Leave Group and Delete Group.

The function “Leave Group” will only work if they are not the only admin in the Group, as if they are an alert will be brought up that inform them to promote someone to admin before leaving. If the above criteria has been met, they will be prompted if they are sure they want to leave the Group. Pressing yes will bring up the alert “Left the Group”, and the user will be brought back to the dashboard, where the group and it’s relevant events will be removed.

A user will only be able to view the “Delete Group” button if they an admin of the group. If a user presses Delete Group, they will be prompted if they are sure they want to delete the Group. Pressing yes will bring up the alert “Group Deleted”, and the user will be brought back to the dashboard, where the group and it’s relevant events will be removed for all members of the group.

At the very bottom of the page are two tabs. Selecting the group calendar tab will switch to the group calendar page.


Group Users page:

On this page, a user can view the group’s admins and users.

Pressing the respecting pens will popup the alerts prompting to add admins, delete admins, add users and remove users. Pressing any of the buttons except for add users will cause an icon to appear beside the users. Clicking the icon will cause the action to occur. Pressing the cancel button will cause the icons to disappear.

Clicking add users will redirect to a page to add users. The user must then select icons representing the users they want to add to the group. Upon selecting a user, the user is removed from the display and moved to the added users section. If no users are added to the added users portion, the group will be created with only the creator as an admin and no users.
Users can also make use of the search function to find the relevant users to add. By typing in the start of a user’s name and pressing the search button, they can change the display to only show users that begin with the input.


Group Calendar page:

Upon switching to the group calendar page, the top half of the page shows a calendar of the current month, with the current date highlighted in a blue circle. Pressing the arrows next to the month allows you to switch between different months. A user can select other dates to be highlighted as well.
Below a user can scroll through the timetable to see if there are any events of that group on that particular day. Clicking on the icon will redirect them to the respective event page.
Pressing the + sign on the top right will redirect the user to add an event for the group.


Calendar page:

Upon switching to the calendar page, the top half of the page shows a calendar of the current month, with the current date highlighted in a blue circle. Pressing the arrows next to the month allows you to switch between different months. A user can select other dates to be highlighted as well.
The bottom half of the page shows the events that would be listed on the given highlighted date. If there are no events, it will be blank, stating that there are no events for the given day. 
A user can select an event in this list to view the event’s detail page.
Pressing the + sign on the top right will redirect the user to add an event for the group


Add event page:

At the event page, the user types out a required name and an optional description. 
They then provide a start date and end date by inputting the correct details, by selecting from the given calendar, and typing time format of hours:minutes, and a name. This is required.
The app will give a prompt indicating that the event was created successfully. The user can close the prompt by selecting OK. If the user was redirected to this page from the group calendar, they will make a group event. Otherwise, they will create a personal event. They then will be redirected back to the respective page with the newly updated event.

If a group event is being created, an additional “Check Team Schedule” button will be available. Selecting this button will allow a user to view the schedule of all users in the group, allowing them to plan the group event accordingly.


Event display page:

When selecting an event in the given date, a page will show the details of the event, which are its name, its description and the date it starts and ends
If the event is from a group, it will also display the Group’s name.
There are also buttons to edit and delete the event.
Selecting the ‘Edit data’ button will redirect to the Edit event page.
Selecting the ‘Delete data’ button will give a confirmation prompt to delete the event. the Selecting YES will close the prompt and delete the event, while selecting NO closes the prompt without deleting the event. If the event is from a group, and you are not an admin, the button will instead return “You are not an admin”.


Editing an event:

Editing date, time, name and description is similar to that of adding an event. If the event is from a Group, the “Check Team Schedule” button will also be available. 
Upon successfully editing the event, the app will give a prompt indicating edit success. The user can close this prompt by selecting OK, upon which they are redirected to the previous page.


### Tech Stack:
Frontend: React Native (Expo), Android Studio
Backend: MongoDB, NodeJS, NoSQL
Version Control: Github
Authentication: Google Cloud API
Deployment: Render
### Working Concept:
Please refer to the project [video](https://youtu.be/iQ5stYlp2X4) for our currently working features in action.

The current prototype of the app is also available to be used by downloading the APK.

Android Studio is required for emulation of an Android phone to run the app on your computer.

To try out the app:

Download the APK from the Google drive [link](https://drive.google.com/file/d/1-AR0UFPnlFlEJOD31nwO6XVUbGX7v3p_/view).
If on Android Studio emulator, drag and drop the downloaded APK into your emulated device window to install the APK.
If not, download the APK and install it directly on your Android device.
The app should begin running in the Android Studio emulator or Android device.
### Project Log:
Refer to the attached spreadsheet [here](https://docs.google.com/spreadsheets/d/10PFNlH9ZJCyJIUI4B1prtAhdHoA_GZrtEwoDidm1E9A/edit?usp=sharing).
