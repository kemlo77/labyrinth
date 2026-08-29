#!/bin/bash

# Skapa volymer för att spara data permanent på dator
sudo docker volume create sonarqube_data
sudo docker volume create sonarqube_extensions
sudo docker volume create sonarqube_logs

# Starta containern med kopplade volymer
sudo docker run \
 -d \
 --name sonarqube \
 -p 9000:9000 \
 -v sonarqube_data:/opt/sonarqube/data \
 -v sonarqube_extensions:/opt/sonarqube/extensions \
 -v sonarqube_logs:/opt/sonarqube/logs \
 sonarqube:community

echo "Access SonarQube on localhost:9000"
echo "1. First time login as - user: admin, password: admin"
echo "2. Set new password: Testing12345!)"
echo "3. Create a new local project and generate a token for analysis."
echo "   - Go to 'Projects' -> 'Create Project' -> 'Manually' -> Enter project name and key."
echo "4. Update sonar-analysis.js with the generated token"