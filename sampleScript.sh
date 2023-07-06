#!/usr/bin/bash

cd ~/Code/projects/namerizer

NOW=$(date)

echo "$NOW starting namerizer" >> ~/crontab_log.txt

npm run start & 

npm_pid=$! 

echo "$npm_pid running" >> ~/crontab_log.txt

wait $npm_pid >> ~/crontab_log.txt
sleep 90

NOW=$(date)
echo "$NOW namerizer completed" >> ~/crontab_log.txt
echo "------------------------" >> ~/crontab_log.txt

exit 0
