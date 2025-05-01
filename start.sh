ps aux | grep 'manage.py runserver' 
pkill -f 'manage.py runserver'
nohup npm run dev:django &
