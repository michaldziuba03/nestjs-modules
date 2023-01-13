sleep 5
echo "Starting cluster manager..."
PORT=7000

echo "Flush all data and reset Redis cluster..."
redis-cli -p $PORT --raw flushall && redis-cli -p $PORT --raw cluster reset

echo "Creating new Redis cluster..."
redis-cli \
-p $PORT \
--cluster create 127.0.0.1:7000 127.0.0.1:7001 127.0.0.1:7002 127.0.0.1:7003 127.0.0.1:7004 127.0.0.1:7005 \
--cluster-replicas 1 \
--cluster-yes
