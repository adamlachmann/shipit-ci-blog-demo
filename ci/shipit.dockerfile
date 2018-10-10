FROM node:8.12.0

# Update & install SSH Client
RUN apt-get update && apt-get install -y ssh

# Create workdir in the image and move to it
RUN mkdir /usr/src/codeship
WORKDIR /usr/src/codeship

# ADD app files
ADD . .

# Copy files to upload into separate directory
COPY . ./files

# Install project dependencies
RUN npm install

# Install npx for easy execution of the shipit CLI
RUN npm install -g npx

# Add execution permissions to main deployment script
RUN chmod +x ci/deploy.sh

# Add execution permissions to test script
RUN chmod +x ci/run-tests.sh
