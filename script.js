'use strict';



function drawChart(myDataObj) {

    /*  Take an object with labels: numbers.
    */

    const myLabels = Object.keys(myDataObj);
    const myData = Object.values(myDataObj);

    const data = {
        labels: myLabels,
        datasets: [
            {
                /* label: '"Stick" strategy', */
                /* backgroundColor: 'rgb(255, 128, 0)', */
                data: myData,
            },
        ]
    };

    const config = {
        type: 'pie',
        data: data,
        options: {
            // Get rid of mouse hover stuff:
            //events: [],
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
    Chart.defaults.font.size = 16;

    if (myChart) {
        // If chart already exists, destroy it before creating a new one:
        myChart.destroy();
    } 

    myChart = new Chart(
        document.getElementById('chart'),
        config
    );

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
            },
        ]
    };

    const config = {
        type: 'pie',
        data: data,
        options: {
        },
    };

    // Make the text a bit bigger:
    Chart.defaults.font.size = 16;

    if (myChart2) {
        // If chart already exists, destroy it before creating a new one:
        myChart2.destroy();
    } 

    myChart2 = new Chart(
        document.getElementById('chart2'),
        config
    );

} // End of function drawChart2



let myChart = undefined;
let myChart2 = undefined;

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
            console.log(response);

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
                    console.log(response);
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
                    console.log(response);
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

                    console.log(countEventTypes);
                    console.log(countCreateEventRefTypes);
                    console.log(countPullRequestEventRefTypes);
                    console.log(countIssuesEventRefTypes);

                    console.log(countRepoEvents);

                    drawChart(countEventTypes);
                    drawChart2(countRepoEvents);

                });

        })
        .catch((reason) => {
            console.log("Catch");
            console.log(reason);
        });

});
// End of form submit eventlistener
