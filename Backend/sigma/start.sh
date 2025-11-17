#!/bin/bash
set -e

echo "🚀 Starting SIGMA Backend..."

# Encontra Java instalado
if [ -z "$JAVA_HOME" ]; then
    JAVA_BIN=$(which java 2>/dev/null || echo "")
    if [ -n "$JAVA_BIN" ]; then
        JAVA_HOME=$(dirname $(dirname $JAVA_BIN))
        export JAVA_HOME
    fi
fi

export PATH=$JAVA_HOME/bin:$PATH

echo "☕ Java version:"
java -version

echo "🎯 Starting application on port $PORT..."
java -Dserver.port=$PORT -Dspring.profiles.active=railway -jar target/sigma-backend.jar