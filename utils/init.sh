#!/bin/bash

# Define variables
REPO_URL="https://specul8tor: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@github.com/specul8tor/psw.git"
CONFIG_FILE="firebase.config.ts" # Ensure this file is in the same directory as this script

# Clone the repository
echo "Cloning Repository"
git clone $REPO_URL project || { echo "Cloning failed"; exit 1; }

# Check if cloning was successful
if [ ! -d "project" ]; then
  echo "Directory 'project' not found"
  exit 1
fi

# Move the config file to the root of the cloned project
echo "Moving config file"
mv $CONFIG_FILE project/ || { echo "Moving config file failed"; exit 1; }

# Navigate to the project directory
cd project || { echo "Navigating to project directory failed"; exit 1; }

# Ensure Node.js and npm are in PATH
export PATH=$PATH:/mnt/c/Program\ Files/nodejs

# Install npm dependencies
echo "Installing npm dependencies"
npm install || { echo "npm install failed"; exit 1; }

# Start the Expo project
echo "Starting the Expo project"
npx expo start || { echo "Starting Expo project failed"; exit 1; }
