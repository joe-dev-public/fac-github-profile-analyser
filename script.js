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

            let html = `
<a href="${response['html_url']}">
<img src="${response['avatar_url']}">
${response['login']}
</a>
`;

            resultsEl.innerHTML = html;
        })
        .catch((reason) => {
            console.log("Catch");
            console.log(reason);
        });

});

