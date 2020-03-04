## Docker

It's possible to run Repo Supervisor inside the Docker container. It gives you more flexibility and you don't need to configure your local environment with Node.JS and npm. At first you need to build up the Docker image:

```bash
docker build -t repo-supervisor .
```

To run the tool inside Docker container you need to trigger a specific command:

```bash
docker run -it --rm -v /local/path/on/your/host:/opt/scan_me repo-supervisor /bin/bash -c "source ~/.bashrc && JSON_OUTPUT=1 node /opt/repo-supervisor/dist/cli.js /opt/scan_me"
```

As a result it should return detected secrets in the JSON format:

```
→ docker run -it --rm -v /local/path/on/your/host:/opt/scan_me repo-supervisor /bin/bash -c "source ~/.bashrc && JSON_OUTPUT=1 node /opt/repo-supervisor/dist/cli.js /opt/scan_me"
{"result":[{"filepath":"./test/fixtures/integration/dir.with.secrets/foo/bar.js","secrets":["zJd-55qmsY6LD53CRTqnCr_g-","gm5yb-hJWRoS7ZJTi_YUj_tbU","GxC56B6x67anequGYNPsW_-TL","MLTk-BuGS8s6Tx9iK5zaL8a_W","2g877BA_TsE-WoPoWrjHah9ta"]},{"filepath":"./test/fixtures/integration/dir.with.secrets/foo/foo.json","secrets":["d7kyociU24P9hJ_sYVkqzo-kE","q28Wt3nAmLt_3NGpqi2qz-jQ7"]}]}
```
