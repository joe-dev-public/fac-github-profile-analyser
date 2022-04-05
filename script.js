'use strict';

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

        })
        .catch((reason) => {
            console.log("Catch");
            console.log(reason);
        });

});

