# Networking

This homelab uses Cloudflare Tunnel for secure remote access and Authentik for SSO

---
<br>

## Components

- Cloudflare Tunnel  
- DNS records  
- Access policies
- Authentik IDP integration

---
<br>

## Flow

User → Cloudflare → Tunnel → Zero Trust (Authentik) → Local service

---
<br>

## Notes

- No ports exposed to the internet
- Access controlled via Cloudflare Zero Trust
- Logins managed through Authentik
