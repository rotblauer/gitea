# Our ~~gogs~~ Gitea :heart:.

[![volkswagen status](https://auchenberg.github.io/volkswagen/volkswargen_ci.svg?v=1)](https://github.com/auchenberg/volkswagen)

Note `gogs/.gitignore`.
- `custom/`, where our config stuff lives, specifically `custom/conf/app.ini`.
- `data/`, where non-repo related data lives; sessions, avatars, chat.db


### Develop.

```bash
$ go build -o darwin.gitea # If you've made changes to the go code.
$ ./darwin.gitea web -c custom/conf/dev.app.ini # Use a config flag to flag the custom app.ini.
```

### Deploying.

- Commit and push changes to the remote repo (recommend building linux locally to ease dependency mgmt on freya `env GOOS=linux go build -o linux.gitea`).
- ssh to Freya and `cd goggable.areteh.co/gogs`
- `git fetch rb-gitea`
- `git merge rb-gitea/rb` or whatever branch you want to update from
- `cd ~/goggable.areteh.co/ && ./kickstart`, where kickerstarter should run a linux build of gitea `web` command, use customizered `prod.app.ini` config file and redirect stderr+out to glogs/datestamped file and do it all in the muthafucking _bg_
- `psg gitea`. Make sure is up.


### Troubleshooter.
Pushing a big repo up? Getting a `remote end hung up` error like [this SO](http://stackoverflow.com/questions/15240815/git-fatal-the-remote-end-hung-up-unexpectedly/24851822)? Use `git config http.postBuffer 524288000` on your machine to up the githttpposterbuffer®. Unless you can get SSH working in which case add a troubleshooter and tell me how dat do.

