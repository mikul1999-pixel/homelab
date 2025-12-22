#!/bin/bash

docker run -d \
  -p port_nbr \
  --name portainer \
  --restart=always \
  -v /docker-volume \
  -v portainer_data:/data \
  portainer/portainer-ce
