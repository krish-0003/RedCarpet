FROM node:18.12.1-alpine

# Install required packages
RUN apk -q update && apk -q upgrade \
    && apk -q add --no-cache git \
    && rm -rf /var/cache/apk/*

# Setting working directory
WORKDIR /usr/src/app

# Copying source files
COPY . .

# Install Depedencies
RUN npm i 
