#!/bin/bash

if [ -z "$ELASTIC_PASSWORD" ]; then
	echo "You must set the ELASTIC_PASSWORD environment variable in the .env file"
	exit 1
fi;

if [ -z "$KIBANA_PASSWORD" ]; then
	echo "You must set the KIBANA_PASSWORD environment variable in the .env file"
	exit 1
fi;

if [ -z "$LOGSTASH_PASSWORD" ]; then
	echo "You must set the LOGSTASH_PASSWORD environment variable in the .env file"
	exit 1
fi;

if [ ! -f config/certs/ca.zip ]; then
	echo "Generating CA"
	bin/elasticsearch-certutil ca --silent --pem --out config/certs/ca.zip
	unzip config/certs/ca.zip -d config/certs
fi;

if [ ! -f config/certs/certs.zip ]; then
	echo "Generating certs"
	echo -e \
	"instances:\n"\
	"  - name: elasticsearch\n"\
	"    ip:\n"\
	"      - 127.0.0.1\n"\
	"    dns:\n"\
	"      - elasticsearch\n"\
	"      - localhost\n"\
	"  - name: kibana\n"\
	"    ip:\n"\
	"      - 127.0.0.1\n"\
	"    dns:\n"\
	"      - kibana\n"\
	"      - localhost\n"\
	"  - name: logstash\n"\
	"    ip:\n"\
	"      - 127.0.0.1\n"\
	"    dns:\n"\
	"      - logstash\n"\
	"      - localhost\n"\
	> config/certs/instances.yml
	bin/elasticsearch-certutil cert --silent --pem --out config/certs/certs.zip \
	--in config/certs/instances.yml --ca-cert config/certs/ca/ca.crt \
	--ca-key config/certs/ca/ca.key
	unzip config/certs/certs -d config/certs

	echo "Convert the Logstash key to the PKCS8 format and PEM encoded"
	openssl pkcs8 -inform PEM -in config/certs/logstash/logstash.key -topk8 \
	-nocrypt -outform PEM -out config/certs/logstash/logstash.pkcs8.key
fi

#echo "Setting file permissions"
#chown -R root:root config/certs
#find . -type d -exec chmod 750 \{\} \;
#find . -type f -exec chmod 640 \{\} \;

echo "Waiting for Elasticsearch availability"
until curl -s --cacert config/certs/ca/ca.crt https://elasticsearch:9200 | \
grep -q "missing authentication credentials"; do sleep 10; done

echo "Setting kibana_system password"
until curl -s -X POST --cacert config/certs/ca/ca.crt \
-u elastic:$ELASTIC_PASSWORD -H "Content-Type: application/json" \
https://elasticsearch:9200/_security/user/kibana_system/_password \
-d "{\"password\": \"${KIBANA_PASSWORD}\"}" | grep -q "^{}"; do sleep 10; done

echo "Creating logstash_writer role"
curl -s -X POST --cacert config/certs/ca/ca.crt -u elastic:$ELASTIC_PASSWORD \
-H "Content-Type: application/json" https://elasticsearch:9200/_security/role/logstash_writer \
-d "{\"cluster\":[\"manage_index_templates\", \"monitor\"], \"indices\": [{\"names\": [\"logstash-*\"], \"privileges\": [\"write\", \"create\", \"create_index\"]}]}"

echo -e "\nCreating logstash_internal user and assign it the logstash_writer role"
curl -s -X POST --cacert config/certs/ca/ca.crt -u elastic:$ELASTIC_PASSWORD \
-H "Content-Type: application/json" https://elasticsearch:9200/_security/user/logstash_internal \
-d "{\"password\": \"${LOGSTASH_PASSWORD}\", \"roles\": [\"logstash_writer\"], \"full_name\": \"Internal Logstash User\"}"

echo -e "\nGranting access to the Logstash indices"
echo "Creating logstash_reader role"
curl -s -X POST --cacert config/certs/ca/ca.crt -u elastic:$ELASTIC_PASSWORD \
-H "Content-Type: application/json" https://elasticsearch:9200/_security/role/logstash_reader \
-d "{\"cluster\": [\"manage_logstash_pipelines\"]}"

echo -e "\nAssigning Logstash users the logstash_reader role"
curl -s -X POST --cacert config/certs/ca/ca.crt -u elastic:$ELASTIC_PASSWORD \
-H "Content-Type: application/json" https://elasticsearch:9200/_security/user/logstash_user \
-d "{\"password\": \"$LOGSTASH_PASSWORD\", \"roles\": [\"logstash_reader\", \"logstash_admin\"], \
\"full_name\": \"kibana user\"}"

echo -e "\nAll done"
