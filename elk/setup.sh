#!/bin/sh

if [ -z "$ELASTIC_PASSWORD" ]; then
	echo "ELASTIC_PASSWORD environment variable is not set in .env file"
	exit 1
fi;

if [ -z "$KIBANA_PASSWORD" ]; then
	echo "KIBANA_PASSWORD environment variable is not set in .env file"
	exit 1
fi;

#mkdir -p config/certs

if [ ! -f config/certs/ca.zip ]; then
	echo "Creating CA"
	bin/elasticsearch-certutil ca --silent --pem --out config/certs/ca.zip
	unzip config/certs/ca.zip -d config/certs
fi;

if [ ! -f config/certs/certs.zip ]; then
	echo "Creating certs"
	echo -e \
	"instances:\n"\
	"  - name: \"elasticsearch\"\n"\
	"    ip:\n"\
	"      - \"127.0.0.1\"\n"\
	"    dns:\n"\
	"      - \"elasticsearch\"\n"\
	"      - \"localhost\"\n"\
	"  - name: \"kibana\"\n"\
	"    ip:\n"\
	"      - \"127.0.0.1\"\n"\
	"    dns:\n"\
	"      - \"kibana\"\n"\
	"      - \"localhost\"\n"\
	"  - name: \"logstash\"\n"\
	"    ip:\n"\
	"      - \"127.0.0.1\"\n"\
	"    dns:\n"\
	"      - \"logstash\"\n"\
	"      - \"localhost\"\n"\
	> config/certs/instances.yml
	bin/elasticsearch-certutil cert --silent --pem --out config/certs/certs.zip \
	--in config/certs/instances.yml --ca-cert config/certs/ca/ca.crt \
	--ca-key config/certs/ca/ca.key
	unzip config/certs/certs.zip -d config/certs
fi;

echo "Setting permissions for certs"
chown -R root:root config/certs

echo "Waiting for Elasticsearch availability"
until curl -s --cacert config/certs/ca/ca.crt https://elasticsearch:9200 | \
grep -q "missing authentication credentials"; do sleep 10; done

echo "Setting kibana_system user password"
until curl -s -X POST --cacert config/certs/ca/ca.crt -u "elastic:${ELASTIC_PASSWORD}" \
-H "Content-Type: application/json" https://elasticsearch:9200/_security/user/kibana_system/_password \
-d "{\"password\":\"${KIBANA_PASSWORD}\"}" | grep -q "^{}"; do sleep 10; done

echo "All done"
