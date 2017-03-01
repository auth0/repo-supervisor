<div align="center">
	<img src="https://cdn.auth0.com/styleguide/latest/lib/logos/img/logo-grey.png" alt="auth0" width="90px"/>
    <br/><br/>
    <p><strong>Repo-supervisor</strong> is a serverless tool that detects secrets and passwords in your pull requests - on file at a time.</p>
</div>

<h2 align="center">Setup</h2>

The recommended way is to clone this repository, install required dependencies and run script to deploy a script on the webtask.io platform.

```bash
 git clone git@github.com:auth0/repo-supervisor.git
 cd repo-supervisor

 npm install
 GITHUB_TOKEN=<token> JWT_SECRET=<secret> npm deploy
```

After script was deployed it will return a URL address to your webtask which then you can use to setup a webhook.

_If you want to deploy webtask with profile different than a standard one you should set env. variable called `WT_PROFILE=myprofile` just before or right after `GITHUB_TOKEN` variable._

<h2 align="center">Webhook</h2>

Installing webhook is easy and there is no difference to other webhooks provided by i.e. Zapier or IFTTT.

Before installing a webhook you need to build and install this tool. As a result `npm deploy` should return the URL address to your deployed webtask. Point your **Payload URL** to webtask url and you're ready to go.

<div style="text-align:center"><img src="docs/webhook.setup.png"/></div>

> Which events would you like to trigger this webhook?

- [x] Let me select individual events.
- [x] Pull request

<h2 align="center">Requirements</h2>

After installing all required packages with `npm` the one additional tool is `wt-cli` to communicate with [webtask.io](https://webtask.io).

If you don't have an account then create a new one, **it's free**. All details related to `wt-cli` are available in the [documentation](https://webtask.io/docs/wt-cli).

Installation process:

```bash
npm install -g wt-cli
```

<h2 align="center">Introduction</h2>

It happens sometimes that you can commit secrets or passwords to your repository by accident. The recommended best practice is not commit the secrets, that's obvious. But not always that obvious when you have a big merge waiting to be reviewed.

This tool allows you to setup a `webhook` that waits for the Pull Requests and scans all interesting files to check for leaked secrets. Every time PR is updated it rescans latest changes and generates a report.

<div style="text-align:center"><img src="docs/report.preview.png"/></div>


<h2 align="center">Security checks</h2>

Tool is easily extendable by adding new filter and parsers for a specific format, for now we support `json` and `js` parsing.

- **Entropy Meter** - measures the level of entropy for extracted strings. The higher the entropy the higher probability of detecting a secret/password.

<h2 align="center">Testing</h2>

Testing this tool is super easy without a need to install the actual source code on the webtask platform.

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

[Ngrok](https://ngrok.com/) is a really useful tool, it allows you to inspect **every** request send to your ngrok's endpoint so you can verify data in/out.


<h2 align="center">Dependencies</h2>

All required dependencies are enforced in specific versions on the webtask.io platform by using metadata setting.

```bash
--meta wt-node-dependencies=$(./bin/get.wt.deps.sh)
```

_get.wt.deps.sh_ script returns a list of dependencies extracted from `package.json` file.

```bash
→ ./bin/get.wt.deps.sh
{"acorn":"4.0.11","bluebird":"3.4.7","github":"8.2.1","handlebars":"4.0.6","handlebars-loader":"1.4.0","jsonwebtoken":"7.3.0","lodash":"4.17.4"}
```

Without the enforcement policy it would break the installation since older version of libraries are not compatible with current code.