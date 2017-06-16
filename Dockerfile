# Base system
FROM golang:latest

# Setting locales
ENV DEBIAN_FRONTEND noninteractive

# Install packages
RUN apt-get update -qq && apt-get install -y \
    locales \
    -qq

# Generate locales
RUN locale-gen en_US.UTF-8 en_us && dpkg-reconfigure locales && dpkg-reconfigure locales && locale-gen C.UTF-8 && /usr/sbin/update-locale LANG=C.UTF-8
ENV LANG C.UTF-8
ENV LANGUAGE C.UTF-8
ENV LC_ALL C.UTF-8

# Setting up terminal preferences
ADD ./ /opt/repo-supervisor

# Install node version manager
RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash
RUN /bin/bash -c "source ~/.bashrc && nvm install 7"

# Build scripts
RUN /bin/bash -c "source ~/.bashrc && cd /opt/repo-supervisor && npm install --no-optional && npm run build"
