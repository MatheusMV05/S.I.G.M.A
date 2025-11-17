#!/bin/bash
set -e

echo "🚀 Starting SIGMA Backend..."

# O mise instala Java em /mise/installs/java/VERSION
if [ -d "/mise/installs/java" ]; then
    JAVA_VERSION=$(ls /mise/installs/java | head -n 1)
    export JAVA_HOME="/mise/installs/java/$JAVA_VERSION"
    echo "✅ Using Java at: $JAVA_HOME"
elif [ -n "$JAVA_HOME" ]; then
    echo "✅ Using existing JAVA_HOME: $JAVA_HOME"
fi

export PATH=$JAVA_HOME/bin:$PATH

echo "☕ Java version:"
java -version

echo "🎯 Starting application on port $PORT..."
java -Dserver.port=$PORT -Dspring.profiles.active=railway -jar target/sigma-backend.jar