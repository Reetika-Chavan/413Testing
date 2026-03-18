#!/bin/bash

# Script to deploy project to Contentstack Launch 10 times
# This triggers deployments by making commits and pushing to the repository

DEPLOY_COUNT=10
DELAY_BETWEEN_DEPLOYS=240  # seconds to wait between deploys (4 minutes)

echo "Starting $DEPLOY_COUNT deployments to Contentstack Launch..."
echo "Each deployment will wait ${DELAY_BETWEEN_DEPLOYS}s before the next one"
echo "Estimated total time: $(( (DEPLOY_COUNT - 1) * DELAY_BETWEEN_DEPLOYS / 60 )) minutes"
echo "=============================================="

for i in $(seq 1 $DEPLOY_COUNT); do
  echo ""
  echo "=============================================="
  echo "Deployment $i of $DEPLOY_COUNT - $(date +"%H:%M:%S")"
  echo "=============================================="
  
  # Create a small change to trigger deployment
  TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
  echo "// Deployment test #$i - $TIMESTAMP" >> functions/[proxy].edge.js
  
  # Stage and commit the change
  git add functions/[proxy].edge.js
  git commit -m "Test deployment #$i - $TIMESTAMP"
  
  # Push to trigger deployment
  echo "Pushing to trigger deployment..."
  git push
  
  if [ $? -eq 0 ]; then
    echo "✓ Deployment #$i triggered successfully at $(date +"%H:%M:%S")"
  else
    echo "✗ Deployment #$i failed to push"
  fi
  
  # Wait before next deployment (skip wait on last iteration)
  if [ $i -lt $DEPLOY_COUNT ]; then
    echo ""
    echo "Waiting ${DELAY_BETWEEN_DEPLOYS} seconds for deployment to complete..."
    echo "Next deployment (#$((i+1))) will start at approximately $(date -v+${DELAY_BETWEEN_DEPLOYS}S +"%H:%M:%S" 2>/dev/null || date -d "+${DELAY_BETWEEN_DEPLOYS} seconds" +"%H:%M:%S" 2>/dev/null || echo "in ${DELAY_BETWEEN_DEPLOYS}s")"
    sleep $DELAY_BETWEEN_DEPLOYS
  fi
done

echo ""
echo "=============================================="
echo "Completed $DEPLOY_COUNT deployment attempts"
echo "Finished at $(date +"%H:%M:%S")"
echo "Check Contentstack Launch dashboard for deployment logs"

