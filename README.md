<div align="center">
	<img src="https://cdn.auth0.com/styleguide/latest/lib/logos/img/logo-grey.png" alt="auth0" width="90px"/>
    <br/><br/>
    <p><strong>Repo-supervisor</strong> is a serverless tool that detects secrets and passwords in your pull requests - one file at a time.</p>
</div>

## Command line mode

To start using the tool without setting up webhooks etc. you can scan local directories right after downloading the source code:

```bash
npm run build
npm run cli ./src/
```

## Setup

The recommended way is to clone this repository, install required dependencies and run script to deploy a script on the webtask.io platform.

```bash
 git clone git@github.com:auth0/repo-supervisor.git
 cd repo-supervisor

 npm install
 GITHUB_TOKEN=<token> JWT_SECRET=<secret> npm deploy
```

After script was deployed it will return a URL address to your webtask which then you can use to setup a webhook.

_If you want to deploy webtask with profile different than a standard one you should set env. variable called `WT_PROFILE=myprofile` just before or right after `GITHUB_TOKEN` variable._

## Webhook

Installing a webhook is easy and there is no difference to other webhooks provided by i.e. Zapier or IFTTT.

Before installing a webhook you need to build and install this tool. As a result `npm deploy` should return the URL address to your deployed webtask. Point your **Payload URL** to webtask url and you're ready to go.

<div style="text-align:center"><img src="docs/webhook.setup.png"/></div>

> Which events would you like to trigger this webhook?

- [x] Let me select individual events.
- [x] Pull request

## Requirements

After installing all the required packages with `npm`, so will also need to install the `wt-cli` to communicate with [webtask.io](https://webtask.io).

If you don't have an account then create a new one, **it's free**. All the details related to `wt-cli` are available in the [documentation](https://webtask.io/docs/wt-cli).

Installation process:

```bash
npm install -g wt-cli
```

## Introduction

Unfortunately, sometimes you may accidently commit secrets or passwords to your repository. The recommended best practice is not to commit the secrets, that's obvious. But it's not always obvious when you have a complex PR waiting to be reviewed.

This tool allows you to setup a `webhook` that waits for the Pull Requests and scans all interesting files to check for leaked secrets. Every time the PR is updated it rescans the latest changes and generates a report.

<div style="text-align:center"><img src="docs/report.preview.png"/></div>

Both acknowledge and reject actions trigger Slack notification which allows you to improve or fix secrets detection rules.

**Acknowledge** report (YES): Accept the report, the detected strings are secrets.

**Reject** report (NO): Reject report, detected secrets are not credentials but only object identifiers, messages or other not related strings. It will help to improve the false-positive ratio.


## Security checks

Repo-supervisor can be easily extended by adding a new filter and parsers for a specific format. We currently support `json` and `js` parsing.

- **Entropy Meter** - measures the level of entropy for extracted strings. The higher the entropy the higher probability of detecting a secret/password.

## Testing

Testing this tool is super easy as there is no need to install the actual source code on the webtask platform.

1\. Start local wt-cli server

```bash
 cd repo-supervisor
 GITHUB_TOKEN=<github_token> JWT_SECRET=<random_secret> npm start
```

It will trigger the built-in server and listen by default at `localhost` on port `7070` if not changed (env: `PORT`, `HOST`).

2\. Run local `ngrok` tunnel

```bash
ngrok http 7070
```

Output:

```bash
Session Status                online
Region                        United States (us)
Web Interface                 http://127.0.0.1:4040
Forwarding                    http://b1942011.ngrok.io -> localhost:7070
Forwarding                    https://b1942011.ngrok.io -> localhost:7070
```

3\. Setup webhook URL so it points to `ngrok` URL.

[Ngrok](https://ngrok.com/) is a really useful tool, it allows you to inspect **every** request sent to your ngrok's endpoint so you can verify data in/out.


## Dependencies

All required dependencies are enforced in specific versions on the webtask.io platform by using the metadata setting.

```bash
--meta wt-node-dependencies=$(./bin/get.wt.deps.sh)
```

_get.wt.deps.sh_ script returns a list of dependencies extracted from `package.json` file.

```bash
→ ./bin/get.wt.deps.sh
{"acorn":"4.0.11","bluebird":"3.4.7","github":"8.2.1","handlebars":"4.0.6","handlebars-loader":"1.4.0","jsonwebtoken":"7.3.0","lodash":"4.17.4"}
```

The installation could potentially be broken without the enforcement policy as older versions of the libraries are not compatible with the current code.

## What is Auth0?

Auth0 helps you to:

* Add authentication with [multiple authentication sources](https://docs.auth0.com/identityproviders),
either social like **Google, Facebook, Microsoft Account, LinkedIn, GitHub, Twitter, Box, Salesforce,
amont others**, or enterprise identity systems like **Windows Azure AD, Google Apps, Active Directory,
ADFS or any SAML Identity Provider**.
* Add authentication through more traditional
**[username/password databases](https://docs.auth0.com/mysql-connection-tutorial)**.
* Add support for **[linking different user accounts](https://docs.auth0.com/link-accounts)** with
the same user.
* Support for generating signed [Json Web Tokens](https://docs.auth0.com/jwt) to call your APIs and
**flow the user identity** securely.
* Analytics of how, when and where users are logging in.
* Pull data from other sources and add it to the user profile, through
[JavaScript rules](https://docs.auth0.com/rules).

## Create a free account in Auth0

1. Go to [Auth0](https://auth0.com) and click Sign Up.
2. Use Google, GitHub or Microsoft Account to login.

## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository
issues section. Please do not report security vulnerabilities on the public GitHub issue tracker.
The [Responsible Disclosure Program](https://auth0.com/whitehat) details the procedure for
disclosing security issues.

## Author

[Auth0](https://auth0.com)

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.
