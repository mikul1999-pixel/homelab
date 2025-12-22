<?php
$CONFIG = array (
  // array (
  // default config lines
  // ),


  // add trusted domains. ensure they are https
  'trusted_domains' => 
  array (
    0 => 'localhost:port_nbr',
    1 => 'docker_container',
    2 => 'sub.domain.com'
  ),
  'overwritehost' => 'sub.domain.com',
  'overwriteprotocol' => 'https',
  'overwrite.cli.url' => 'https://sub.domain.com',


  // oidc config for cloudflare zero trust + authentik integration
  'app_install_overwrite' => 
  array (
    0 => 'oidc_login',
  ),
  'user_oidc' => 
  array (
    'login_label' => 'Login with Cloudflare',
  ),
);
