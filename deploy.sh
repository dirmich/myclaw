#!/bin/bash

# Image name
IMAGE_NAME="dirmich/myclaw"
TAG="latest"

# Check if "build" argument is passed
if [ "$1" == "build" ]; then
    echo "Building Docker image..."

    # Extract build args from .env.docker
    BUILD_ARGS=""
    for var in NODE_ENV NEXT_PUBLIC_APP_VERSION NEXT_PUBLIC_APP_URL NEXT_PUBLIC_GOOGLE_CLIENT_ID NEXT_PUBLIC_GOOGLE_CLIENT_SECRET; do
        # Extract value, handling potential quotes or complex chars if needed (basic implementation)
        val=$(grep "^$var=" .env.docker | cut -d= -f2-)
        if [ ! -z "$val" ]; then
            BUILD_ARGS="$BUILD_ARGS --build-arg $var=$val"
        fi
    done

    echo "Using Build Args: $BUILD_ARGS"
    docker build $BUILD_ARGS -t $IMAGE_NAME:$TAG .
    
    echo "Build Done!"
    exit 0
fi

# Default: Deploy (Pull and Up)
echo "Deploying to server..."
docker-compose pull
docker-compose up -d --remove-orphans
docker image prune -f
echo "Deployment Done!"
