#!/bin/bash
echo 'run gantt'
cd $(dirname $0)
cd packages/vue3
pnpm run build -w  &

echo 'run demo'
cd $(dirname $0)
cd packages/vue3-demo
pnpm run dev