<div align="center">
	<img src="https://cdn.auth0.com/styleguide/latest/lib/logos/img/logo-grey.png" alt="auth0" width="90px"/>
    <br/><br/>
    <p><strong>Repo-supervisor</strong> is a serverless tool that detects secrets and passwords in your pull requests - on file at a time.</p>
</div>

<h2 align="center">Installation</h2>

The recommended way is to clone this repository and install required dependencies:

```bash
git clone git@github.com:auth0/repo-supervisor.git
cd repo-supervisor
npm install
```

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

![](docs/report.preview.png)

<h2 align="center">Supported tests</h2>

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
