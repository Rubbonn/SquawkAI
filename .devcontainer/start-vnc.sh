#!/usr/bin/env bash
set -euo pipefail

LOG_DIR=/tmp
DISPLAY_NUM=:1

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "Errore: comando mancante: $1"
    exit 1
  }
}

listening() {
  ss -ltn | grep -q ":$1 "
}

require_cmd Xvfb
require_cmd x11vnc
require_cmd websockify

# 1) X server
if ! xdpyinfo -display "$DISPLAY_NUM" >/dev/null 2>&1; then
  setsid -f Xvfb "$DISPLAY_NUM" -screen 0 1280x1024x24 +extension GLX +render -noreset >> "$LOG_DIR/xvfb.log" 2>&1
  sleep 0.5
fi

# 2) VNC server
if ! listening 5900; then
  setsid -f x11vnc -display "$DISPLAY_NUM" -nopw -listen localhost -xkb -forever -shared -bg >> "$LOG_DIR/x11vnc.log" 2>&1
fi

# 3) noVNC/websockify
if ! listening 6080; then
  setsid -f websockify --web=/usr/share/novnc 6080 localhost:5900 >> "$LOG_DIR/novnc.log" 2>&1
fi

# 4) readiness check
for _ in $(seq 1 30); do
  if listening 5900 && listening 6080; then
    echo "OK: VNC (5900) e noVNC (6080) attivi"
    exit 0
  fi
  sleep 0.2
done

echo "Errore: porte non attive dopo avvio"
tail -n 40 "$LOG_DIR/xvfb.log" "$LOG_DIR/x11vnc.log" "$LOG_DIR/novnc.log" || true
exit 1