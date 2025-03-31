# Monet Explorer

The Monet Dashboard.

## Setting Up

Download or clone this repository then simply run

```bash
$ npm install
```

Once that has finished to run both the backend and the front end

```bash
$ npm run dev
```

You will then need to create a credential for the admin panel by following the prompts from `python3 server/src/manage.py createsuperuser`.

Once completing that go `localhost:8000/admin` and add a `Network` using the dashboard.

Then in the root directory of this project run:

```
python3 server/src/manage.py crontab add
```

Then you should have set up the crontab to start and it will pull data from the `Network` defined every 5 mins.

Alternativley you can run `python3 server/src/manage.py crontab run <HEX>` and replace `<HEX>` with the hex from the output of `python3 server/src/manage.py crontab add`.

You can visit the dashboard:

```
localhost:3000
```

base on python 3.6

use venv launch backend

```
cd server/
python -m venv .venv/
```

then install requirements

```
.venv/bin/pip3 install -r requirements.txt
```

if base on node 13 latest, please use

```
export NODE_OPTIONS=--openssl-legacy-provider
```