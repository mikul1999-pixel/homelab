# Cloudflared

Configuration for Cloudflare Tunnel.

---

## Files

- `config.yml` – Tunnel definition + ingress rules
    - note that each subdomain needs a DNS Record + Zero Trust

---
<br>

```bash
# run tunnel (using credentials.json)
cloudflared tunnel run mytunnel

# restart tunnel
sudo systemctl restart cloudflared
