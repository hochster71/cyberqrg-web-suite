#!/bin/bash

# CyberQRG Web Suite - Quick Start Script
# Restarts all three servers on their designated ports

echo "🚀 Starting CyberQRG Web Suite..."

# Kill any existing servers
echo "🛑 Killing existing servers..."
pkill -9 python3 2>/dev/null || true
sleep 2

# Start Web App (port 9999)
echo "🌐 Starting Web App on port 9999..."
cd "/Users/michaelhoch/Library/Mobile Documents/com~apple~CloudDocs/CyberQRG-Rebuild/apps/web/public" && python3 -m http.server 9999 &
WEB_PID=$!

# Start Sentinel App (port 9998)
echo "🛡️  Starting Sentinel App on port 9998..."
cd "/Users/michaelhoch/Library/Mobile Documents/com~apple~CloudDocs/CyberQRG-Rebuild/apps/sentinel/public" && python3 -m http.server 9998 &
SENTINEL_PID=$!

# Start Privacy App (port 9997)
echo "🔒 Starting Privacy App on port 9997..."
cd "/Users/michaelhoch/Library/Mobile Documents/com~apple~CloudDocs/CyberQRG-Rebuild/apps/privacy/public" && python3 -m http.server 9997 &
PRIVACY_PID=$!

# Wait a moment for servers to start
sleep 3

# Verify servers are running
echo ""
echo "✅ Servers started! Verifying..."
echo "Web (9999): $(curl -s -o /dev/null -w "%{http_code}" http://localhost:9999/)"
echo "Sentinel (9998): $(curl -s -o /dev/null -w "%{http_code}" http://localhost:9998/)"
echo "Privacy (9997): $(curl -s -o /dev/null -w "%{http_code}" http://localhost:9997/)"

echo ""
echo "🎉 CyberQRG Web Suite is running!"
echo "🌐 Web: http://localhost:9999/"
echo "🛡️  Sentinel: http://localhost:9998/"
echo "🔒 Privacy: http://localhost:9997/"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for user interrupt
trap "echo '🛑 Stopping servers...'; kill $WEB_PID $SENTINEL_PID $PRIVACY_PID 2>/dev/null; exit" INT
wait</content>
<parameter name="filePath">/Users/michaelhoch/Library/Mobile Documents/com~apple~CloudDocs/CyberQRG-Rebuild/start-servers.sh