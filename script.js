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


    const data = {
        labels: myLabels,
        datasets: [
            {
                /* label: 'Testing', */
                backgroundColor: backgroundColours,
                data: myData,
            },
        ]
    };

    const config = {
        type: 'pie',
        data: data,
        options: {
            responsive: false,
            // Get rid of mouse hover stuff:
            events: [],
            //maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
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

    // Make the text a bit bigger:
    //Chart.defaults.font.size = 16;

    const activitySectionEl = document.getElementById('activity');

    activitySectionEl.innerHTML = '';

    const activitySectionHeadingEl = document.createElement('h2');
    activitySectionHeadingEl.innerText = 'Recent activity:';

    const activityChartContainerEl = document.createElement('div');
    activityChartContainerEl.classList.add('chart-container');
    const activityChartEl = document.createElement('canvas');
    const activityChartLegendEl = document.createElement('div');

    if (myChart1) {
        // If chart already exists, destroy it before creating a new one:
        myChart1.destroy();
    } 

    myChart1 = new Chart(
        activityChartEl,
        config
    );

    const activityDetailsEl = document.createElement('details');
    activityDetailsEl.setAttribute('open', '');
    const activityDetailsSummaryEl = document.createElement('summary');
    activityDetailsSummaryEl.innerHTML = 'Types of recent activity:';

    const activityTableEl = document.createElement('table');

    // let html = '<details open=""><summary>Types of recent activity:</summary><ul>';

    for (let i = 0; i < myLabels.length; i++) {
        const idx = i % backgroundColours.length;
        //html += `<li style="border-left: 2rem solid ${backgroundColours[idx]}; padding-left: 0.5rem;">${myLabels[i]}: ${myData[i]}</li>`;
        const activityTableRowEl = document.createElement('tr');
        activityTableRowEl.innerHTML = `<td style="border-left: 2rem solid ${backgroundColours[idx]};">${myLabels[i]}</td><td>${myData[i]}</td>`;
        activityTableEl.append(activityTableRowEl);
    }

    // html += '</ul></details>';

    // activityChartLegendEl.innerHTML = html;

    activityDetailsEl.append(activityDetailsSummaryEl);
    activityDetailsEl.append(activityTableEl);

    activityChartLegendEl.append(activityDetailsEl);

    activityChartContainerEl.append(activityChartEl);

    activitySectionEl.append(activitySectionHeadingEl);
    activitySectionEl.append(activityChartContainerEl);
    activitySectionEl.append(activityChartLegendEl);

} // End of function displayRecentActivityData



function drawChart2(myDataObj) {

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


    const data = {
        labels: myLabels,
        datasets: [
            {
                data: myData,
                backgroundColor: backgroundColours,
            },
        ]
    };

    const config = {
        type: 'pie',
        data: data,
        options: {
            responsive: false,
            events: [],
            plugins: {
                legend: {
                    display: false,
                    /* labels: {
                        font: {
                            size: 16,
                        },
                    }, */
                    position: 'right',
                },
            },
        },
    };

    const reposSectionEl = document.getElementById('repos');

    reposSectionEl.innerHTML = '';

    const reposSectionHeadingEl = document.createElement('h2');
    reposSectionHeadingEl.innerText = 'Most popular repos:';

    const reposChartContainerEl = document.createElement('div');
    reposChartContainerEl.classList.add('chart-container');
    const reposChartEl = document.createElement('canvas');
    const reposChartLegendEl = document.createElement('div');

    if (myChart2) {
        myChart2.destroy();
    } 

    myChart2 = new Chart(
        reposChartEl,
        config
    );

    let html = '<details open=""><summary>Repos most interacted with recently:</summary><ul>';

    for (let i = 0; i < myLabels.length; i++) {
        // I spent *way* too much time trying to work this out. You just need the remainder!
        const idx = i % backgroundColours.length;
        html += `<li style="border-left: 2rem solid ${backgroundColours[idx]}; padding-left: 0.5rem;"><a href="https://github.com/${myLabels[i]}">${myLabels[i]}</a>: ${myData[i]}</li>`;
    }

    html += '</ul></details>';

    reposChartLegendEl.innerHTML = html;

    reposChartContainerEl.append(reposChartEl);

    reposSectionEl.append(reposSectionHeadingEl);
    reposSectionEl.append(reposChartContainerEl);
    reposSectionEl.append(reposChartLegendEl);

} // End of function drawChart2



function drawChart3(myDataObj, username) {

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



    const data = {
        labels: myLabels,
        datasets: [
            {
                data: myData,
                backgroundColor: backgroundColours,
            },
        ]
    };

    const config = {
        type: 'pie',
        data: data,
        options: {
            responsive: false,
            events: [],
            plugins: {
                legend: {
                    display: false,
                    labels: {
                        font: {
                            size: 16,
                        },
                    },
                    position: 'right',
                },
            },
        },
    };

    const collaboratorsSectionEl = document.getElementById('collaborators');

    collaboratorsSectionEl.innerHTML = '';

    const collaboratorsSectionHeadingEl = document.createElement('h2');
    collaboratorsSectionHeadingEl.innerText = 'Top collaborators:';

    const collaboratorsChartContainerEl = document.createElement('div');
    collaboratorsChartContainerEl.classList.add('chart-container');
    const collaboratorsChartEl = document.createElement('canvas');
    const collaboratorsChartLegendEl = document.createElement('div');

    if (myChart3) {
        // If chart already exists, destroy it before creating a new one:
        myChart3.destroy();
    }

    myChart3 = new Chart(
        collaboratorsChartEl,
        config
    );

    let html = '<details open=""><summary>Accounts most interacted with recently:</summary><ul>';

    for (let i = 0; i < myLabels.length; i++) {
        const idx = i % backgroundColours.length;
        html += `<li style="border-left: 2rem solid ${backgroundColours[idx]}; padding-left: 0.5rem;"><a href="https://github.com/${myLabels[i]}">`;
        //if (myLabels[i] === username) { html += `*`; }
        html += `${myLabels[i]}</a>: ${myData[i]}`;
        if (myLabels[i] === username) { html += ` <em><!-- &larr;  -->(this is the user you searched for)</em>`; }
        html += `</li>`;
    }

    html += '</ul></details>';

    collaboratorsChartLegendEl.innerHTML = html;

    collaboratorsChartContainerEl.append(collaboratorsChartEl);

    collaboratorsSectionEl.append(collaboratorsSectionHeadingEl);
    collaboratorsSectionEl.append(collaboratorsChartContainerEl);
    collaboratorsSectionEl.append(collaboratorsChartLegendEl);

} // End of function drawChart3



let myChart1 = undefined;
let myChart2 = undefined;
let myChart3 = undefined;


const mainEl = document.querySelector('main');

const formEl = document.querySelector('form');

const profileEl = document.getElementById('profile');

const starsEl = document.getElementById('stars');


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

    const myFormData = new FormData(formEl);

    const objFromFormData = Object.fromEntries(myFormData);

    const username = objFromFormData['username'];

    myFetch(`https://api.github.com/users/${username}`)
        .then((response) => {
            if (response.status === 200) {
                return response.json();
            } else {
                profileEl.innerHTML = `<p>Profile not found</p>`;
                throw new Error("Profile not found!");
            }
        })
        .then((response) => {
            //console.log(response);

            const id = response['id'];

            let html = `
<a href="${response['html_url']}">
<img src="${response['avatar_url']}">
${response['login']}
</a>
`;

            profileEl.innerHTML = html;

            // Starred projects:
            //response['starred_url']
            myFetch(`https://api.github.com/users/${username}/starred`)
                .then((response) => {
                    return response.json();
                })
                .then((response) => {
                    //console.log(response);

                    starsEl.innerHTML = '';

                    const starsSectionHeadingEl = document.createElement('h2');
                    starsSectionHeadingEl.innerHTML = 'Starred projects:';
                    starsEl.append(starsSectionHeadingEl);

                    const starsDetailsEl = document.createElement('details');
                    starsDetailsEl.setAttribute('open', '');

                    const starsDetailsSummaryEl = document.createElement('summary');
                    starsDetailsSummaryEl.innerHTML = `⭐ ${response.length}`;
                    starsDetailsEl.append(starsDetailsSummaryEl);

                    // An array of starred projects (length zero if none)
                    if (response.length === 0) {
                        // This isn't necessarily a good approach:
                        starsDetailsEl.append(document.createElement('p').innerHTML = 'No starred projects. 🙁');
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

                    starsEl.append(starsDetailsEl);

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
                    drawChart2(countRepoEvents);
                    drawChart3(countRepoEvents, username);

                });

        })
        .catch((reason) => {
            console.log("Catch");
            console.log(reason);
        });

});
// End of form submit eventlistener
