# Base system
FROM golang:latest

# Setting locales
ENV DEBIAN_FRONTEND noninteractive

# Install packages
RUN apt-get update -qq && apt-get install -y \
    locales \
    zip \
    -qq

# Generate locales
RUN locale-gen en_US.UTF-8 en_us && dpkg-reconfigure locales && dpkg-reconfigure locales && locale-gen C.UTF-8 && /usr/sbin/update-locale LANG=C.UTF-8
ENV LANG C.UTF-8
ENV LANGUAGE C.UTF-8
ENV LC_ALL C.UTF-8

# Add files into the container
ADD ./ /opt/repo-supervisor

# Install node version manager
RUN /bin/bash -c "touch ~/.bashrc"
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.36.0/install.sh | bash
RUN /bin/bash -c "source ~/.bashrc && nvm install 10"

# Build scripts
RUN /bin/bash -c "source ~/.bashrc && cd /opt/repo-supervisor && npm install --no-optional && npm run build"
