# Our gogs.

Note `gogs/.gitignore`.
- `custom/`, where our config stuff lives, specifically `custom/conf/app.ini`.
- `data/`, where non-repo related data lives; sessions, avatars, chat.db

### Develop.

```bash
$ go build -o darwin.gogs # If you've made changes to the go code. 
$ ./darwin.gogs web -c custom/conf/dev.app.ini # Use a config flag to flag the custom app.ini.
```

### Deploying.

- Commit and push changes to the remote repo (recommend building linux locally to ease dependency mgmt on freya `env GOOS=linux go build -o linux.gogs`).
- ssh to Freya and `cd goggable.areteh.co/gogs`
- `git fetch rotblauer`
- `git merge rotblauer/rb-develop` or whatever branch you want to update from
- `psg gogs` .


 
