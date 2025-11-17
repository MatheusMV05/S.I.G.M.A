#!/bin/bash
set -e

echo "🔍 Detecting Java installation..."

# O mise instala Java em /mise/installs/java/VERSION
if [ -d "/mise/installs/java" ]; then
    JAVA_VERSION=$(ls /mise/installs/java | head -n 1)
    export JAVA_HOME="/mise/installs/java/$JAVA_VERSION"
    echo "✅ Found Java at: $JAVA_HOME"
elif [ -n "$JAVA_HOME" ]; then
    echo "✅ Using existing JAVA_HOME: $JAVA_HOME"
else
    # Fallback: tenta encontrar pelo binário
    JAVA_BIN=$(which java 2>/dev/null || echo "")
    if [ -n "$JAVA_BIN" ]; then
        export JAVA_HOME=$(dirname $(dirname $(readlink -f $JAVA_BIN 2>/dev/null || echo $JAVA_BIN)))
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