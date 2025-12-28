# Homelab

This repository exists to document my self‑hosted home server.  
It includes service configurations, Docker stacks, networking, security, and operational notes.

--- 
<br>

## Repository Structure

`homelab/`<br>
├── `cloudflared/` – Cloudflare Tunnel configuration<br>
├── `docker/` – Docker Compose stacks + service folders<br>
└── `docs/` – Architecture, networking, security<br>

--- 
<br>

## Services Included

- **Portainer** – Docker container management  
- **Authentik** – Identity provider  
- **Homepage** – Dashboard  
- **Immich** – Photo management  
- **Nextcloud** – File sync  
- **Home Assistant** – Smart home automation    
- **Cron Jobs** – Scheduled tasks  

Each service has its own folder under `docker/` 

---
<br>

## Navigation Dashboard
`homelab/docker/homepage/` contains source code for my navigation home page and flask api
<br><br>
Sample image


---
<br>

## Documentation

See the `docs/` folder for:

- `structure.md` – Directory layout   
- `networking.md` – Cloudflare, DNS, tunnels   
