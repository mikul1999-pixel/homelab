# Docker Services

This folder contains all Docker Compose stacks and service‑specific configuration.

---

## Top‑Level Compose Files

- `docker-compose.yml` – Main stack  
- `homepage.yml` – Dashboard  
- `authentik.yml` – Identity provider  
- `immich.yml` – Photo management  
- `nextcloud.yml` – File sync  
- `home-assist.yml` – Smart home automation  

---
<br>

## Service Folders

Each service has its own folder with important config files.

- `homepage/` – React & Flask assets
- `cron_jobs/` – Sample scheduled task   
- `portainer/` – docker run command
- `authentik/` – null
- `immich/` – null
- `nextcloud/` – OIDC config code
- `home_assistant/` – Automation yamls

---
<br>

```bash
# multi-file docker stack
docker compose -f docker-compose.yml \
               -f homepage.yml \
               -f authentik.yml \
               -f immich.yml \
               -f nextcloud.yml \
               -f home-assist.yml up -d

# other useful commands
docker compose up -d
docker compose build
docker restart homeassistant
docker exec -it homeassistant bash

# cron commands to make file executable & scheduled
chmod +x sample.sh
crontab -e