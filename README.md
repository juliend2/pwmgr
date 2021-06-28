# README

## Getting started

```
sudo apt update
sudo apt install ruby-full
sudo apt install ruby-bundler
git clone git@github.com:juliend2/pwmgr.git
cd pwmgr
mkdir data # needed for files
bundle install
bundle exec rackup --host=0.0.0.0 --port=9393 app.ru
```

## Notes for reverse-proxy 

### using Caddy

1. https://caddyserver.com/docs/install
2. Take the content of Caddyfile and append it to your main /etc/caddy/Caddyfile
3. sudo systemctl reload caddy

## License

MIT.