

# Web Development Project 6 - Weather Data Dashboard

Submitted by: **Dhruv Sharma**

This web app: **Weather Data Dashboard** is a React application that displays real-time weather data for major cities around the world. It features a dashboard with summary statistics, interactive charts, and a detail view for each city with additional visualizations and a map.

Time spent: **4** hours spent in total

## Required Features


The following **required** functionality is completed:

- [x] **Clicking on an item in the list view displays more details about it**
  - Clicking on an item in the dashboard list navigates to a detail view for that item
  - Detail view includes extra information about the item not included in the dashboard view (including a city-specific chart and a map)
  - The layout is consistent between dashboard and detail view (sidebar is not present, per project customization)
- [x] **Each detail view of an item has a direct, unique URL link to that item’s detail view page**
  - Each city has a unique `/detail/:id` route
- [x] **The app includes at least two unique charts developed using the fetched data that tell an interesting story**
  - Dashboard includes a temperature-by-city bar chart and a weather condition pie chart
  - Detail view includes a city metrics chart and a comparison chart (city vs. all cities average)


## Video Walkthrough

Here's a walkthrough of implemented user stories:

<img src='https://i.imgur.com/3WdDlR2.gif' title='Video Walkthrough' width='' alt='Video Walkthrough' />
(https://i.imgur.com/3WdDlR2.gif)
<!-- Replace this with whatever GIF tool you used! -->

GIF created with ...  
[ScreenToGif](https://www.screentogif.com/) for Windows


## Notes

Describe any challenges encountered while building the app.

The main challenge was making sure the data was fetched and displayed correctly, and keeping the charts readable and visually consistent.

## License

    Copyright [2025] [Dhruv Sharma]

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
