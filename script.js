'use strict';


// Chart.js won't provide colours, so make a nice set/function to generate.
const backgroundColours = [
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
];



function drawChart(myDataObj) {

    /*  Take an object with labels: numbers.
    */

    const myLabels = Object.keys(myDataObj);
    const myData = Object.values(myDataObj);

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

    if (myChart1) {
        // If chart already exists, destroy it before creating a new one:
        myChart1.destroy();
    } 

    myChart1 = new Chart(
        document.getElementById('chart1'),
        config
    );

    const chart1LegendEl = document.getElementById('chart1legend');

    let html = '<ul>';

    for (let i = 0; i < myLabels.length; i++) {
        const idx = i % backgroundColours.length;
        html += `<li style="border-left: 2rem solid ${backgroundColours[idx]}; padding-left: 0.5rem;">${myLabels[i]}: ${myData[i]}</li>`;
    }

    html += '</ul>';

    chart1LegendEl.innerHTML = html;

} // End of function drawChart



function drawChart2(myDataObj) {

    const myLabels = [];
    const myData = [];

    for (const [key, value] of Object.entries(myDataObj)) {
        myLabels.push(value['name']);
        myData.push(value['count']);
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

    if (myChart2) {
        myChart2.destroy();
    } 

    myChart2 = new Chart(
        document.getElementById('chart2'),
        config
    );

    const chart2LegendEl = document.getElementById('chart2legend');

    let html = '<ul>';

    let i = 0;
    for (const [key, value] of Object.entries(myDataObj)) {
        // I spent *way* too much time trying to work this out. You just need the remainder!
        const idx = i % backgroundColours.length;
        html += `<li style="border-left: 2rem solid ${backgroundColours[idx]}; padding-left: 0.5rem;"><a href="https://github.com/${value['name']}">${value['name']}</a>: ${value['count']}</li>`;
        i++;
    }

    html += '</ul>';

    chart2LegendEl.innerHTML = html;

} // End of function drawChart2



function drawChart3(myDataObj, username) {

    const myLabels = [];
    const myData = [];

    /*  We want to draw a chart to show the most frequent (recent) collaborators.
        So we can use the same data as before, but we'll need to count its contents differently.

        No guarantees and this might not be the best approach, but events we count seem to
        have the format "user/repo", so we could just count the number of unique users
        (and make sure to ignore the user we've searched for?).
    */

    for (const [_, value] of Object.entries(myDataObj)) {
        const eventUsername = value['name'].split('/')[0];
        if (eventUsername !== username) {
            /*  If the eventUsername already exists in the myLabels array, don't push it
                again, but instead add the count to the element with the same index in the
                myData array.
            */
            if (myLabels.indexOf(eventUsername) !== -1) {
                myData[myLabels.indexOf(eventUsername)] += value['count'];
            } else {
                myLabels.push(eventUsername);
                myData.push(value['count']);
            }
        }
    }

    //console.log(myLabels);

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

    if (myChart3) {
        // If chart already exists, destroy it before creating a new one:
        myChart3.destroy();
    } 

    myChart3 = new Chart(
        document.getElementById('chart3'),
        config
    );

    const chart3LegendEl = document.getElementById('chart3legend');

    let html = '<ul>';

    for (let i = 0; i < myLabels.length; i++) {
        const idx = i % backgroundColours.length;
        html += `<li style="border-left: 2rem solid ${backgroundColours[idx]}; padding-left: 0.5rem;"><a href="https://github.com/${myLabels[i]}">${myLabels[i]}</a>: ${myData[i]}</li>`;
    }

    html += '</ul>';

    chart3LegendEl.innerHTML = html;

} // End of function drawChart3



let myChart1 = undefined;
let myChart2 = undefined;
let myChart3 = undefined;

const resultsEl = document.querySelector('#results');

const formEl = document.querySelector('form');

formEl.addEventListener('submit', (event) => {

    event.preventDefault();

    const myFormData = new FormData(formEl);

    const objFromFormData = Object.fromEntries(myFormData);

    const username = objFromFormData['username'];

    fetch(`https://api.github.com/users/${username}`)
        .then((response) => {
            if (response.status === 200) {
                return response.json();
            } else {
                resultsEl.innerHTML = `<p>Profile not found</p>`;
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
<h2>Starred projects:</h2>
`;

            resultsEl.innerHTML = html;

            // Starred projects:
            //response['starred_url']
            fetch(`https://api.github.com/users/${username}/starred`)
                .then((response) => {
                    return response.json();
                })
                .then((response) => {
                    //console.log(response);
                    // An array of starred projects (length zero if none)
                    if (response.length === 0) {
                        resultsEl.innerHTML += '<p>None</p>';
                    } else {
                        let html = `<details><summary>⭐ ${response.length}</summary><ul>`;
                        response.forEach((element) => {
                            // An array of objects for each starred project
                            html += `<li><a href="${element['html_url']}">${element['name']}</a></li>`;
                        });
                        resultsEl.innerHTML += html + '</ul></details>';
                    }
                });


            /*  Recent events:
                https://docs.github.com/en/rest/reference/activity#events
                Default: 1 page, 30 results per page (max 100)
                (5 min delay, public events)
                Default to 1 month of events?
                (How will this work - getting multiple pages?)
            */
            fetch(`https://api.github.com/users/${username}/events?per_page=100`)
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

                    drawChart(countEventTypes);
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
