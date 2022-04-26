# GitHub profile analyser

https://joe-dev-public.github.io/fac-github-profile-analyser/


## ~Testing in your own dev environment~ (incomplete :)

- Clone this repo: ``git clone https://github.com/joe-dev-public/fac-github-profile-analyser.git``
- Create a new file called ``secret.js`` in the repo directory.
  - There should already be a ``.gitignore`` file which means that ``secret.js`` won't be tracked by git.
- [Generate a new personal access token (PAT)](https://github.com/settings/tokens/new) for your GitHub account:
  - You probably want to set the expiration to something short, like 30 days or less.
  - Give it a meaningful name ("note") like "Temporary PAT to test Joe's GitHub profile analyser".
  - Leave all scopes **unchecked**.
  - Click "Generate token".
- **Copy the token** straight away.
  - (It won't be shown to you again, but don't worry if you miss it. You can just delete the token you've just made [here](https://github.com/settings/tokens) and start again.)
- Paste the token into ``secret.js``; set it as the value of a global variable.
- Your ``secret.js`` should look something like this:
``window.token = blahYourActualTokenGoesHere;``
