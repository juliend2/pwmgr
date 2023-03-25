# README

## Dev setup

```
sudo apt update
sudo apt install ruby-full
sudo apt install ruby-bundler
git clone git@github.com:juliend2/pwmgr.git
cd pwmgr
mkdir data # needed for files to be saved
bundle install
bundle exec rackup --host=0.0.0.0 --port=9393 app.ru
```

## Prod setup

```
sudo apt update
sudo apt install ruby-full
sudo apt install ruby-bundler
git clone git@github.com:juliend2/pwmgr.git
cd pwmgr
git clone git@github.com:you/your-data-repository.git data
bundle install --without=development
bundle exec rackup --host=0.0.0.0 --port=9393 app.ru
```

## Notes for reverse-proxy 

### using Caddy

1. https://caddyserver.com/docs/install
2. Take the content of Caddyfile and append it to your main /etc/caddy/Caddyfile
3. sudo systemctl reload caddy



## Cron job

```cron
0 5,17 * * * cd <pwmgr>/data/ && git add . && git commit -m "data update (from aws server)" && git push
```

## License

MIT.
