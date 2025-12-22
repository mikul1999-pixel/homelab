# Homelab

This repository exists to document my self‑hosted home server.  
It includes service configurations, Docker stacks, networking, security, and operational notes.

--- 
<br>

## Repository Structure

`homelab/`<br>
├── `cloudflared/` – Cloudflare Tunnel configuration<br>
├── `docker/` – Docker Compose stacks + service folders<br>
└── `docs/` – Architecture, networking, security, backups<br>

--- 
<br>

## Services Included

- **Authentik** – Identity provider  
- **Homepage** – Dashboard  
- **Immich** – Photo management  
- **Nextcloud** – File sync  
- **Home Assistant** – Smart home automation  
- **Flask** – Custom microservices  
- **Cron Jobs** – Scheduled tasks  

Each service has its own folder under `docker/` 

---
<br>

## Documentation

See the `docs/` folder for:

- `structure.md` – Folder layout   
- `networking.md` – Cloudflare, DNS, tunnels   
