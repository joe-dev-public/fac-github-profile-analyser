'use strict';


// Chart.js won't provide colours, so make a nice set/function to generate.
/* const backgroundColours = [
    'rgb(255, 0, 0)',
    'rgb(0, 255, 0)',
    'rgb(0, 0, 255)',
    'rgb(255, 255, 0)',
    'rgb(0, 255, 255)',
    'rgb(255, 0, 255)',
    'rgb(127, 0, 0)',
    'rgb(0, 127, 0)',
    'rgb(0, 0, 127)',
    'rgb(127, 127, 0)',
    'rgb(0, 127, 127)',
    'rgb(127, 0, 127)',
]; */

const backgroundColours = [];

function generateColourPalette() {
    /*
    // 1:
    for (let i = 255; i >= 127; i -= 64) {
        backgroundColours.push(`rgb(${i}, 0, 0)`);
    }
    // 2:
    for (let i = 255; i >= 127; i -= 64) {
        backgroundColours.push(`rgb(0, ${i}, 0)`);
    }
    // 3:
    for (let i = 255; i >= 127; i -= 64) {
        backgroundColours.push(`rgb(0, 0, ${i})`);
    }

    // 4:
    for (let i = 255; i >= 127; i -= 64) {
        backgroundColours.push(`rgb(${i}, ${i}, 0)`);
    }
    // 5:
    for (let i = 255; i >= 127; i -= 64) {
        backgroundColours.push(`rgb(${i}, 0, ${i})`);
    }
    // 6:
    for (let i = 255; i >= 127; i -= 64) {
        backgroundColours.push(`rgb(0, ${i}, ${i})`);
    }

    // 7:
    for (let i = 255; i >= 127; i -= 64) {
        backgroundColours.push(`rgb(${i}, ${i/2}, 0)`);
    }
    // 8:
    for (let i = 255; i >= 127; i -= 64) {
        backgroundColours.push(`rgb(${i}, 0, ${i/2})`);
    }
    // 9:
    for (let i = 255; i >= 127; i -= 64) {
        backgroundColours.push(`rgb(0, ${i}, ${i/2})`);
    }

    // 10:
    for (let i = 255; i >= 127; i -= 64) {
        backgroundColours.push(`rgb(${i/2}, ${i}, 0)`);
    }
    // 11:
    for (let i = 255; i >= 127; i -= 64) {
        backgroundColours.push(`rgb(${i/2}, 0, ${i})`);
    }
    // 12:
    for (let i = 255; i >= 127; i -= 64) {
        backgroundColours.push(`rgb(0, ${i/2}, ${i})`);
    }
    */

    // Not usable, but "easy on the eye" for testing purposes:
    for (let i = 223; i >= 0; i -= 32) {
        backgroundColours.push(`rgb(${i} ${i} ${i})`);
    }

    for (let i = 223; i >= 31; i -= 32) {
        backgroundColours.push(`rgb(${i+32} ${i-31} ${i-31})`);
    }
    for (let i = 223; i >= 31; i -= 32) {
        backgroundColours.push(`rgb(${i-31} ${i+32} ${i-31})`);
    }
    for (let i = 223; i >= 31; i -= 32) {
        backgroundColours.push(`rgb(${i-31} ${i-31} ${i+32})`);
    }

    for (let i = 223; i >= 31; i -= 32) {
        backgroundColours.push(`rgb(${i+32} ${i+32} ${i-31})`);
    }
    for (let i = 223; i >= 31; i -= 32) {
        backgroundColours.push(`rgb(${i+32} ${i-31} ${i+32})`);
    }
    for (let i = 223; i >= 31; i -= 32) {
        backgroundColours.push(`rgb(${i-31} ${i+32} ${i+32})`);
    }
}

generateColourPalette();



function clearAllOutputs() {

    profileSectionEl.innerHTML = '';
    starsSectionEl.innerHTML = '';
    activitySectionEl.innerHTML = '';
    reposSectionEl.innerHTML = '';
    collaboratorsSectionEl.innerHTML = '';

}


function myError(message, reason = '') {

    clearAllOutputs;

    const errorHeading = document.createElement('h2');
    errorHeading.innerHTML = 'Error';

    const errorMessage = document.createElement('p');
    errorMessage.innerHTML = message;

    profileSectionEl.append(errorHeading);
    profileSectionEl.append(errorMessage);

    if (reason !== '') {
        const errorReason = document.createElement('p');
        errorReason.classList.add('error-reason');
        errorReason.innerHTML = reason;
        profileSectionEl.append(errorReason);
    }

    //throw new Error(message);

}
// End of function myError



function chartSetSingleActiveElement(chart, idx) {

    // https://www.chartjs.org/docs/3.0.2/samples/advanced/programmatic-events.html

    // if (chart.getActiveElements().length > 0)

    chart.setActiveElements([]);
    chart.setActiveElements([
        {
            datasetIndex: 0,
            index: idx,
        },
    ]);

    chart.update();

}



function chartSetNoActiveElements(chart) {
    chart.setActiveElements([]);
    chart.update();
}



function chartHoverGetIndex(chart, event) {
    // https://www.chartjs.org/docs/latest/developers/api.html#getelementsateventformode-e-mode-options-usefinalposition
    const points = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);

    if (points.length) {
        const firstPoint = points[0];
        //const label = chart.data.labels[firstPoint.index];
        //const value = chart.data.datasets[firstPoint.datasetIndex].data[firstPoint.index];
        //console.log(`${firstPoint.index} ${label} ${value}`);
        return firstPoint['index'];
    }
}



function removeAllLegendHighlights(legend) {
    for (const element of legend.children) {
        element.classList.remove('table-row-highlight');
    }
}



function highlightLegendOnChartHover(chart, event, legend) {
    const index = chartHoverGetIndex(chart, event);
    removeAllLegendHighlights(legend);
    if (index !== undefined) {
        legend.children[index].classList.add('table-row-highlight');
    }
}



function displayChartAndLegend(myLabels, myData, chart, sectionEl, section, username = '') {

    const data = {
        labels: myLabels,
        datasets: [
            {
                /* label: 'Testing', */
                backgroundColor: backgroundColours,
                data: myData,
                hoverBorderWidth: 2,
                // Todo: set this colour as a variable, add the same colour border to the legend
                hoverBorderColor: 'rgb(30, 30, 30)',
            },
        ]
    };

    const config = {
        type: 'pie',
        data: data,
        options: {
            transitions: {
                active: {
                    animation: {
                        // Todo: fix: this seems to work the first time, then gets ignored?
                        // Note: commenting the events: [] line below and then mouseover-ing
                        // the chart seems to fix this?
                        duration: 0,
                    },
                },
            },
            responsive: false,
            // Get rid of mouse hover stuff:
            //events: [],
            //maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                    // Todo: we're not using labels any more, so could prob remove this?
                    labels: {
                        // https://stackoverflow.com/questions/39454586/pie-chart-legend-chart-js
                        // --> https://jsfiddle.net/6bexkyd9/
                        // https://www.chartjs.org/docs/latest/samples/other-charts/multi-series-pie.html
                        //generateLabels: function(chart) {

                        //},
                        font: {
                            size: 16,
                        },
                    },
                    // Make this viewport-dependent?
                    position: 'right',
                },
            },
/*             scales: {
                x: {
                    title: {
                        display: true,
                        text: "Event type",
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: 'Number of events',
                    },
                },
            }, */
        },
    };



    // Todo: table headers. If you want.
    /*
    const activityTableHeader = document.createElement('thead');

    activityTableHeader.innerHTML = `
<tr>
  <td style="border-left: 2rem solid transparent;">
    Event type
  </td>
  <td>No.</td>
</tr>
`;

    activityTableEl.append(activityTableHeader);
    */



    const sectionHeadingEl = document.createElement('h2');
    // Needs to be a parameter or something:
    sectionHeadingEl.innerText = '';
    // 'Recent activity'
    // 'Most popular repos'
    // 'Top collaborators'

    const chartContainerEl = document.createElement('div');
    chartContainerEl.classList.add('chart-container');
    const chartEl = document.createElement('canvas');

    const detailsEl = document.createElement('details');
    detailsEl.setAttribute('open', '');
    const detailsSummaryEl = document.createElement('summary');

    const detailsContainer = document.createElement('div');
    detailsContainer.classList.add('row');

    const legendContainer = document.createElement('div');
    legendContainer.classList.add('legend-container');

    const legendHeading = document.createElement('h3');
    // Needs to be a parameter or something:
    legendHeading.innerHTML = '';
    // 'Types of recent activity:'
    // 'Repos most interacted with recently:'
    // 'Accounts most interacted with recently:'

    const tableEl = document.createElement('table');


    // Need parameters for: chart, chartEl

    // If chart already exists, destroy it before creating a new one:
    if (chart) {
        chart.destroy();
    }

    // Instantiate new chart using config set above:
    chart = new Chart(
        chartEl,
        config
    );


    // Do different stuff depending on what chart we're handling?
    // How should this be done?


    for (let i = 0; i < myLabels.length; i++) {
        // I spent *way* too much time trying to work this out. You just need the remainder!
        const idx = i % backgroundColours.length;

        const tableRowEl = document.createElement('tr');

        let html = `
<td style="border-left: 2rem solid ${backgroundColours[idx]};">
`;

        if (section === 'activity') {

            html += `
  ${myLabels[i]}
</td>
<td>
  ${myData[i]}
</td>
`;

        } else if (section === 'repos') {

            html += `
<a href="https://github.com/${myLabels[i]}">${myLabels[i]}</a></td><td>${myData[i]}</td>
`;

        } else if (section === 'collaborators') {

            html += `
    <a href="https://github.com/${myLabels[i]}">${myLabels[i]}</a>
</td>
<td>
    ${myData[i]}
`;

            if (myLabels[i] === username) { html += ` <em><!-- &larr;  -->(this is the user you searched for)</em>`; }

            html += `</td>`;

        }

        tableRowEl.innerHTML = html;

        tableRowEl.addEventListener('mouseenter', () => {
            chartSetSingleActiveElement(chart, i);
        });
        tableRowEl.addEventListener('mouseleave', () => {
            chartSetNoActiveElements(chart);
        });

        tableEl.append(tableRowEl);

    }


    detailsSummaryEl.append(sectionHeadingEl);

    detailsEl.append(detailsSummaryEl);

    chartContainerEl.append(chartEl);

    legendContainer.append(legendHeading);
    legendContainer.append(tableEl);

    detailsContainer.append(chartContainerEl);
    detailsContainer.append(legendContainer);

    detailsEl.append(detailsContainer);

    sectionEl.append(detailsEl);

    // Todo: optimisation: this might be a slow/expensive way of doing this!
    chartEl.addEventListener('mousemove', (event) => {
        highlightLegendOnChartHover(chart, event, tableEl);
    });

    // Add a mouseleave event to remove the legend highlight class (It can get stuck!)
    chartEl.addEventListener('mouseleave', () => {
        removeAllLegendHighlights(tableEl);
    });

}



function displayRecentActivityData(myDataObj) {

    /*  Take an object with labels: numbers.
    */

    // Sort desc:

    const myLabels = [];
    const myData = [];

    /* const myLabels = Object.keys(myDataObj);
    const myData = Object.values(myDataObj); */

    const coupleArray = [];

    for (const [key, val] of Object.entries(myDataObj)) {
        coupleArray.push([key, val]);
    }


    // Initialise the sorted array with the first element from the unsorted array
    const sortedCoupleArray = [coupleArray[0]];

    // Skip the first element (cos it's already in the sorted array, as initialised above)
    for (let i = 1; i < coupleArray.length; i++) {

        const [label, value] = [coupleArray[i][0], coupleArray[i][1]];

        for (let j = 0; j < sortedCoupleArray.length; j++) {
            if (value > sortedCoupleArray[j][1]) {
                // splice, not unshift - wake up! :B
                sortedCoupleArray.splice(j, 0, [label, value]);
                break;
            } else {
                if (j === sortedCoupleArray.length - 1) {
                    sortedCoupleArray.push([label, value]);
                    break;
                }
            }
        }

    }

    for (let i = 0; i < sortedCoupleArray.length; i++) {
        myLabels.push(sortedCoupleArray[i][0]);
        myData.push(sortedCoupleArray[i][1]);
    }


    displayChartAndLegend(myLabels, myData, activityChart, activitySectionEl, 'activity');


    /*  Todo: you could link to GitHub's API docs to explain what each kind of event is.
        e.g.:
        - https://docs.github.com/en/developers/webhooks-and-events/events/github-event-types#pushevent
            - "One or more commits are pushed to a repository branch or tag."
        - https://docs.github.com/en/developers/webhooks-and-events/events/github-event-types#issuesevent
            - "Activity related to an issue."
        - https://docs.github.com/en/developers/webhooks-and-events/events/github-event-types#createevent
            - "A Git branch or tag is created."
        - etc.
        But they're all pretty self-explanatory, so.. not urgent!
    */




} // End of function displayRecentActivityData



function displayRecentReposData(myDataObj) {

    const myLabels = [];
    const myData = [];

    /* for (const [key, value] of Object.entries(myDataObj)) {
        myLabels.push(value['name']);
        myData.push(value['count']);
    } */

    // Overly-long sort desc:

    const coupleArray = [];

    /*  If the repo appears multiple times in the data, make sure its count is
        incremented, rather than having nonsensical separate slices of pie.
    */
    for (const [key, val] of Object.entries(myDataObj)) {
        const idx = coupleArray.flat().indexOf(val['name']);
        if (idx !== -1) {
            coupleArray[idx/2][1] += val['count'];
        } else {
            coupleArray.push([val['name'], val['count']]);
        }
    }

    // Initialise the sorted array with the first element from the unsorted array
    const sortedCoupleArray = [coupleArray[0]];

    // Skip the first element (cos it's already in the sorted array, as initialised above)
    for (let i = 1; i < coupleArray.length; i++) {

        const [label, value] = [coupleArray[i][0], coupleArray[i][1]];

        for (let j = 0; j < sortedCoupleArray.length; j++) {
            if (value > sortedCoupleArray[j][1]) {
                // splice, not unshift - wake up! :B
                sortedCoupleArray.splice(j, 0, [label, value]);
                break;
            } else {
                if (j === sortedCoupleArray.length - 1) {
                    sortedCoupleArray.push([label, value]);
                    break;
                }
            }
        }

    }

    for (let i = 0; i < sortedCoupleArray.length; i++) {
        myLabels.push(sortedCoupleArray[i][0]);
        myData.push(sortedCoupleArray[i][1]);
    }


    displayChartAndLegend(myLabels, myData, reposChart, reposSectionEl, 'repos');


} // End of function displayRecentReposData



function displayRecentCollaboratorsData(myDataObj, username) {

    const myLabels = [];
    const myData = [];

    const coupleArray = [];

    /*  We want to draw a chart to show the most frequent (recent) collaborators.
        So we can use the same data as before, but we'll need to count its contents differently.

        No guarantees and this might not be the best approach, but events we count seem to
        have the format "user/repo", so we could just count the number of unique users
        (and make sure to ignore the user we've searched for?).
    */

    for (const [_, value] of Object.entries(myDataObj)) {
        const eventUsername = value['name'].split('/')[0];
        //if (eventUsername !== username) {
            /*  If the eventUsername already exists in the coupleArray, don't push it
                again, but instead add the count to the relevant element.
            */

            const idx = coupleArray.flat().indexOf(eventUsername);
            if (idx !== -1) {
                coupleArray[idx/2][1] += value['count'];
            } else {
                //myLabels.push(eventUsername);
                //myData.push(value['count']);
                coupleArray.push([eventUsername, value['count']]);
            }
        //}
    }

    //console.log(coupleArray.flat());

    // Initialise the sorted array with the first element from the unsorted array
    const sortedCoupleArray = [coupleArray[0]];

    // Skip the first element (cos it's already in the sorted array, as initialised above)
    for (let i = 1; i < coupleArray.length; i++) {

        const [label, value] = [coupleArray[i][0], coupleArray[i][1]];

        for (let j = 0; j < sortedCoupleArray.length; j++) {
            if (value > sortedCoupleArray[j][1]) {
                // splice, not unshift - wake up! :B
                sortedCoupleArray.splice(j, 0, [label, value]);
                break;
            } else {
                if (j === sortedCoupleArray.length - 1) {
                    sortedCoupleArray.push([label, value]);
                    break;
                }
            }
        }

    }

    for (let i = 0; i < sortedCoupleArray.length; i++) {
        myLabels.push(sortedCoupleArray[i][0]);
        myData.push(sortedCoupleArray[i][1]);
    }


    // Call function to draw chart etc.
    displayChartAndLegend(myLabels, myData, collaboratorsChart, collaboratorsSectionEl, 'collaborators', username);


} // End of function displayRecentCollaboratorsData



function handleUsersFetch(response) {

    //console.log(response);

    const id = response['id'];

    let html = `
<a href="${response['html_url']}">
  <img src="${response['avatar_url']}">
  ${response['login']}
</a>
`;

    profileSectionEl.innerHTML = html;

}
// End of function handleUsersFetch



function handleStarredFetch(response) {

    //console.log(response);

    const starsDetailsEl = document.createElement('details');
    starsDetailsEl.setAttribute('open', '');

    const starsDetailsSummaryEl = document.createElement('summary');
    const starsSectionHeadingEl = document.createElement('h2');
    starsSectionHeadingEl.innerHTML = `Starred projects: ??? ${response.length}`;

    starsDetailsSummaryEl.append(starsSectionHeadingEl);
    starsDetailsEl.append(starsDetailsSummaryEl);

    // An array of starred projects (length zero if none)
    if (response.length === 0) {
        // This isn't necessarily a good approach:
        starsDetailsEl.append(document.createElement('p').innerHTML = 'No starred projects. ????');
    } else {
        const starsListEl = document.createElement('ul');
        response.forEach((element) => {
            // An array of objects for each starred project
            const listItemEl = document.createElement('li');
            listItemEl.innerHTML = `<a href="${element['html_url']}">${element['name']}</a>`;
            starsListEl.append(listItemEl);
            // Trying to do it in one go like this means that the HTML renders as text, for some reason:
            //starsListEl.append(document.createElement('li').innerHTML = `<a href="${element['html_url']}">${element['name']}</a>`);
        });
        starsDetailsEl.append(starsListEl);
    }

    starsSectionEl.append(starsDetailsEl);

}
// End of function handleStarredFetch



function handleEventsFetch(username, response) {

    //console.log(response);
    /*
        An array of event objects. Some examples of "type":

        CreateEvent:
        payload can have "ref_type": "branch" or "repository"

        PullRequestEvent:
        payload can have "action": "closed" or "opened"

        IssuesEvent:
        payload can have "action": "closed" or "opened"

        WatchEvent: ignore?
        (could let users toggle it on/off a graph)
    */

    // Get x most recent events, make a graph showing type breakdown?

    const countEventTypes = {};

    const countCreateEventRefTypes = {};
    const countPullRequestEventRefTypes = {};
    const countIssuesEventRefTypes = {};

    const countRepoEvents = {};

    response.forEach((element) => {

        const type = element['type'];

        // Count different types of event:
        if (countEventTypes[type] === undefined) {
            countEventTypes[type] = 1;
        } else {
            countEventTypes[type]++;
        }

        // Count different types of CreateEvent:
        if (type === 'CreateEvent') {
            const refType = element['payload']['ref_type'];
            if (countCreateEventRefTypes[refType] === undefined) {
                countCreateEventRefTypes[refType] = 1;
            } else {
                countCreateEventRefTypes[refType]++;
            }
        }

        // Count different types of PullRequestEvent:
        if (type === 'PullRequestEvent') {
            const action = element['payload']['action'];
            if (countPullRequestEventRefTypes[action] === undefined) {
                countPullRequestEventRefTypes[action] = 1;
            } else {
                countPullRequestEventRefTypes[action]++;
            }
        }

        // Count different types of IssuesEvent:
        if (type === 'IssuesEvent') {
            const action = element['payload']['action'];
            if (countIssuesEventRefTypes[action] === undefined) {
                countIssuesEventRefTypes[action] = 1;
            } else {
                countIssuesEventRefTypes[action]++;
            }
        }


    /*  Most popular repos: can calculate this from events above.
        "Figure out what their most popular repositories are" is ambiguous.
        Let's start by counting any interaction(s) with a repo.
    */

        const repoId = element['repo']['id'];
        // Not sure if name is unique
        const repoName = element['repo']['name'];

        if (countRepoEvents[repoId] === undefined) {
            countRepoEvents[repoId] = {
                'name': repoName,
                'count': 1,
            };
        } else {
            countRepoEvents[repoId]['count']++;
        }

    });
    // End of response.forEach

    //console.log(countEventTypes);
    //console.log(countCreateEventRefTypes);
    //console.log(countPullRequestEventRefTypes);
    //console.log(countIssuesEventRefTypes);

    //console.log(countRepoEvents);

    displayRecentActivityData(countEventTypes);
    displayRecentReposData(countRepoEvents);
    displayRecentCollaboratorsData(countRepoEvents, username);

}
// End of function handleEventsFetch



let activityChart = undefined;
let reposChart = undefined;
let collaboratorsChart = undefined;


const mainEl = document.querySelector('main');

const formEl = document.querySelector('form');

const profileSectionEl = document.getElementById('profile');
const starsSectionEl = document.getElementById('stars');
const activitySectionEl = document.getElementById('activity');
const reposSectionEl = document.getElementById('repos');
const collaboratorsSectionEl = document.getElementById('collaborators');



function myFetch(url) {
    // If the OAuth2 PAT is defined, then authenticate with the API.
    if (window.myToken !== undefined) {
        return fetch(url, {
            headers: {
                'Authorization': `token ${window.myToken}`,
            },
        });
    } else {
        return fetch(url);
    }
}


formEl.addEventListener('submit', (event) => {

    event.preventDefault();

    clearAllOutputs();

    const myFormData = new FormData(formEl);

    const objFromFormData = Object.fromEntries(myFormData);

    const username = objFromFormData['username'];

    myFetch(`https://api.github.com/users/${username}`)
        .then((response) => {
            switch (response.status) {
                case 200:
                    return response.json();
                case 404:
                    throw new Error('Profile not found.');
                default:
                    throw new Error(`${response['status']}: ${response['statusText']}`);
            }
        })
        .then((response) => {

            handleUsersFetch(response);

            // Starred projects:
            //response['starred_url']
            myFetch(`https://api.github.com/users/${username}/starred`)
                .then((response) => {
                    return response.json();
                })
                .then((response) => {
                    handleStarredFetch(response);
                });


            /*  Recent events:
                https://docs.github.com/en/rest/reference/activity#events
                Default: 1 page, 30 results per page (max 100)
                (5 min delay, public events)
                Default to 1 month of events?
                (How will this work - getting multiple pages?)
            */
            myFetch(`https://api.github.com/users/${username}/events?per_page=100`)
                .then((response) => {
                    return response.json();
                })
                .then((response) => {
                    handleEventsFetch(username, response);
                });

        })
        .catch((reason) => {
            // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#checking_that_the_fetch_was_successful
            // If the promise doesn't resolve, there's a problem with the fetch.
            // (Most likely a network thing? That's probably all I'll test.)
            myError(reason);
        });

});
// End of form submit eventlistener
