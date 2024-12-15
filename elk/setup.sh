#!/bin/bash

if [ -z "$ELASTIC_PASSWORD" ]; then
	echo "You must set the ELASTIC_PASSWORD environment variable in the .env file"
	exit 1
fi;

if [ -z "$KIBANA_PASSWORD" ]; then
	echo "You must set the KIBANA_PASSWORD environment variable in the .env file"
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
	"  - name: es01\n"\
	"    ip:\n"\
	"      - 127.0.0.1\n"\
	"    dns:\n"\
	"      - es01\n"\
	"      - localhost\n"\
	"  - name: es02\n"\
	"    ip:\n"\
	"      - 127.0.0.1\n"\
	"    dns:\n"\
	"      - es02\n"\
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
	"  - name: backend-server\n"\
	"    ip:\n"\
	"      - 127.0.0.1\n"\
	"    dns:\n"\
	"      - backend-server\n"\
	"      - localhost\n"\
	> config/certs/instances.yml
	bin/elasticsearch-certutil cert --silent --pem --out config/certs/certs.zip \
	--in config/certs/instances.yml --ca-cert config/certs/ca/ca.crt \
	--ca-key config/certs/ca/ca.key
	unzip config/certs/certs.zip -d config/certs
fi

if [ ! -f config/jdbc/postgresql-42.7.4.jar ]; then
	apt update && apt install -y wget;
	wget https://jdbc.postgresql.org/download/postgresql-42.7.4.jar -O config/jdbc/postgresql-42.7.4.jar
fi;

#echo "Setting file permissions"
#chmod 664 config/certs/logstash/logstash.pkcs8.key
#chown -R root:root config/certs
#find . -type d -exec chmod 750 \{\} \;
#find . -type f -exec chmod 640 \{\} \;

echo "Waiting for Elasticsearch availability"
until curl -s --cacert config/certs/ca/ca.crt https://es01:9200 | \
grep -q "missing authentication credentials"; do sleep 10; done

echo "Setting kibana_system password"
until curl -s -X POST --cacert config/certs/ca/ca.crt \
-u elastic:$ELASTIC_PASSWORD -H "Content-Type: application/json" \
https://es01:9200/_security/user/kibana_system/_password \
-d "{\"password\": \"${KIBANA_PASSWORD}\"}" | grep -q "^{}"; do sleep 10; done

echo -e "\nCreating index lifecycle policy"
curl --cacert config/certs/ca/ca.crt -XPUT -u elastic:$ELASTIC_PASSWORD \
https://es01:9200/_ilm/policy/dev-policy -H "Content-Type: application/json" -d '
{
	"policy": {
		"phases": {
			"hot": {
				"min_age": "3m",
				"actions": {
					"rollover": {
						"max_age": "1h",
						"max_docs": 200
					}
				}
			},
			"delete": {
				"actions": {
					"delete": {}
				}
			}
		}
	}
}'

echo -e "\nCreating component template"
curl --cacert config/certs/ca/ca.crt -XPUT -u elastic:$ELASTIC_PASSWORD \
https://es01:9200/_component_template/dev-settings -H "Content-Type: application/json" \
-d '
{
	"template": {
		"settings": {
			"index.lifecycle.name": "dev-policy"
		}
	}
}'

echo -e "\nCreating index template"
curl --cacert config/certs/ca/ca.crt -XPUT -u elastic:$ELASTIC_PASSWORD \
https://es01:9200/_index_template/dev-template -H "Content-Type: application/json" \
-d '
{
	"index_patterns": [ "server-logs*" ],
	"data_stream": { },
	"composed_of": [ "dev-settings" ],
	"priority": 500
}'

echo -e "\nAll done"
