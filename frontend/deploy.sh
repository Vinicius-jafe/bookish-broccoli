#!/bin/bash
cd ~/bookish-broccoli/frontend
npm run build
sudo rm -rf /var/www/html/*
sudo cp -r build/* /var/www/html/
sudo systemctl reload nginx
echo "🚀 Deploy completo em /var/www/html"
