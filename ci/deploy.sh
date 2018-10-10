#!/bin/bash

# SSH key config
echo -e $PRIVATE_SSH_KEY >> /root/.ssh/id_rsa
chmod 600 /root/.ssh/id_rsa
ssh-keyscan -H $SERVER_IP >> /root/.ssh/known_hosts

# Shipit.js
npx shipit vps deploy --shipitfile ci/shipitfile.js