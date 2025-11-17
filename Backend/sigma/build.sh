#!/bin/bash
set -e

echo "🔍 Detecting Java installation..."

# Encontra Java instalado
if [ -z "$JAVA_HOME" ]; then
    JAVA_BIN=$(which java 2>/dev/null || echo "")
    if [ -n "$JAVA_BIN" ]; then
        JAVA_HOME=$(dirname $(dirname $JAVA_BIN))
        export JAVA_HOME
        echo "✅ Found Java at: $JAVA_HOME"
    else
        echo "❌ Java not found!"
        exit 1
    fi
fi

export PATH=$JAVA_HOME/bin:$PATH

echo "☕ Java version:"
java -version

echo "🔨 Building with Maven..."
chmod +x mvnw
./mvnw clean package -DskipTests

echo "✅ Build completed!"