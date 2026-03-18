#!/bin/bash
#
# Reproduce CF1001 413 on Contentstack Launch
#
# Root cause: Large request headers (cookies) cause the upstream request
# to exceed a size threshold. The customer's logs showed upstream_bytes_sent
# of ~11,271 bytes on GET /favicon.ico requests — all headers, no body.
#
# This script sends GET requests with progressively larger Cookie headers
# to find the exact threshold where 413 triggers.

DOMAIN="${1:-testingproject.devcontentstackapps.com}"
PATH_TO_TEST="${2:-/favicon.ico}"

echo "=== CF1001 413 Reproduction Test ==="
echo "Target: https://${DOMAIN}${PATH_TO_TEST}"
echo ""

generate_cookie() {
  local size_bytes=$1
  local cookie_value
  cookie_value=$(python3 -c "print('A' * $size_bytes)")
  echo "testcookie=${cookie_value}"
}

SIZES=(1000 2000 4000 6000 8000 10000 11000 11300 12000 14000 16000 20000 32000)

for size in "${SIZES[@]}"; do
  cookie=$(generate_cookie "$size")
  cookie_header_bytes=$(echo -n "Cookie: ${cookie}" | wc -c | tr -d ' ')

  status=$(curl -s -o /dev/null -w "%{http_code}" \
    -H "Cookie: ${cookie}" \
    -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36" \
    "https://${DOMAIN}${PATH_TO_TEST}")

  if [ "$status" = "413" ]; then
    marker="<-- 413 TRIGGERED"
  elif [ "$status" = "000" ]; then
    marker="<-- CONNECTION ERROR"
  else
    marker=""
  fi

  printf "Cookie size: %6d bytes | Cookie header: %6d bytes | HTTP status: %s %s\n" \
    "$size" "$cookie_header_bytes" "$status" "$marker"

  if [ "$status" = "413" ]; then
    echo ""
    echo "=== 413 found! Getting full response details ==="
    echo ""
    curl -v \
      -H "Cookie: ${cookie}" \
      -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36" \
      "https://${DOMAIN}${PATH_TO_TEST}" 2>&1
    echo ""
    echo "=== Reproduction successful ==="
    echo "The 413 triggers when Cookie header value reaches ~${size} bytes."
    echo "Total request header size at this point (including other headers) likely exceeds the upstream limit."
    break
  fi

  sleep 0.5
done

echo ""
echo "=== Test Complete ==="
