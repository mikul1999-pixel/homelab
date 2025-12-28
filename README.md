# Homelab

This repository exists to document my self‑hosted home server.  
It includes service configurations, Docker stacks, networking, security, and operational notes. <br><br>
**Note:** Most files in the repo are templates or sanitized versions (no sensitive data or domain names)

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
<img width="1985" height="1328" alt="server_homepage" src="https://github.com/user-attachments/assets/d22f7ddd-3fa6-4891-8cc1-5804d1c3f688" />


---
<br>

## Documentation

See the `docs/` folder for:

- `structure.md` – Directory layout   
- `networking.md` – Cloudflare, DNS, tunnels   
