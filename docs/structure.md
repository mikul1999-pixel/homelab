```bash
homelab/
├── cloudflared/
│   ├── config.yml               # ingress rules
│   └── README.md
│
└── docker/
    ├── docker-compose.yml
    ├── homepage.yml
    ├── authentik.yml
    ├── immich.yml
    ├── nextcloud.yml
    ├── home-assist.yml
    │
    ├── homepage/
    │   └── frontend/            # react
    │   └── backend/             # flask
    │
    ├── portainer/               # docker run script
    │   └── config_files
    │
    ├── authentik/
    │   └── config_files
    │
    ├── immich/
    │   └── config_files
    │
    ├── nextcloud/
    │   └── config_files
    │
    ├── home_assistant/          # sample HA automation scripts
    │   └── config_files
    │
    └── cron_jobs/               # sample sh script
        └── sample_files

```
