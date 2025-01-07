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

echo "Setting permissions for /mnt/backups"
chown -R elasticsearch:elasticsearch /mnt/backups
chmod 750 /mnt/backups

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

echo "Waiting for Elasticsearch availability"
until curl -s --cacert config/certs/ca/ca.crt https://es01:9200 | \
grep -q "missing authentication credentials"; do sleep 10; done

echo "Setting kibana_system password"
until curl -s -X POST --cacert config/certs/ca/ca.crt \
-u elastic:$ELASTIC_PASSWORD -H "Content-Type: application/json" \
https://es01:9200/_security/user/kibana_system/_password \
-d "{\"password\": \"${KIBANA_PASSWORD}\"}" | grep -q "^{}"; do sleep 10; done

echo "Creating snapshot repository (type: filesystem)"
curl --cacert config/certs/ca/ca.crt -XPUT -u elastic:$ELASTIC_PASSWORD \
https://es01:9200/_snapshot/logs-backups-repo -H "Content-Type: application/json" -d '
{
	"type": "fs",
	"settings": {
		"location": "/mnt/backups/app_backups",
		"compress": true
	}
}'

echo -e "\nCreating SLM policy"
curl --cacert config/certs/ca/ca.crt -XPUT -u elastic:$ELASTIC_PASSWORD \
https://es01:9200/_slm/policy/app-snapshots-policy -H "Content-Type: application/json" -d '
{
	"schedule": "0 */15 * * * ?",
	"name": "<app-snap-{now/d}>",
	"repository": "logs-backups-repo",
	"config": {
		"indices": "logs-nginx.access-dev,logs-django-dev",
        "ignore_available": true,
        "include_global_state": false
	},
	"retention": {
		"expire_after": "10m",
		"min_count": 1,
		"max_count": 10
	}
}'

echo -e "Set the SLM retention task to run every 10 minutes"
curl --cacert config/certs/ca/ca.crt -XPUT -u elastic:$ELASTIC_PASSWORD \
https://es01:9200/_cluster/settings -H "Content-Type: application/json" -d '
{
    "persistent" : {
        "slm.retention_schedule" : "0 */10 * * * ?"
    }
}
'

echo -e "\nCreating index lifecycle policy"
curl --cacert config/certs/ca/ca.crt -XPUT -u elastic:$ELASTIC_PASSWORD \
https://es01:9200/_ilm/policy/logs-policy -H "Content-Type: application/json" -d '
{
	"policy": {
		"phases": {
			"hot": {
				"min_age": "1m",
				"actions": {
					"rollover": {
						"max_age": "20m",
						"max_docs": 20000
					}
				}
			},
			"delete": {
                "min_age": "5m",
				"actions": {
					"delete": {}
				}
			}
		}
	}
}'

echo -e "\nCreating component template"
curl --cacert config/certs/ca/ca.crt -XPUT -u elastic:$ELASTIC_PASSWORD \
https://es01:9200/_component_template/logs-settings-component -H "Content-Type: application/json" \
-d '
{
    "template": {
        "settings": {
            "index.lifecycle.name": "logs-policy",
            "index.mode": "logsdb"
        },
        "mappings": {
            "properties": {
                "message": {
                    "type": "text"
                }
            }
        }
    }
}'

echo -e "\nCreating nginx-logs-template index template"
curl --cacert config/certs/ca/ca.crt -XPUT -u elastic:$ELASTIC_PASSWORD \
https://es01:9200/_index_template/nginx-logs-template -H "Content-Type: application/json" \
-d '
{
	"index_patterns": [ "logs-nginx.access-dev", "restored-logs-nginx.access-dev" ],
	"data_stream": { },
    "composed_of": [ "logs-settings-component" ],
	"priority": 500
}'

echo -e "\nCreating django-logs-template index template"
curl --cacert config/certs/ca/ca.crt -XPUT -u elastic:$ELASTIC_PASSWORD \
https://es01:9200/_index_template/django-logs-template -H "Content-Type: application/json" \
-d '
{
    "template": {
        "mappings": {
            "properties": {
                "params": {
                    "type": "text"
                }
            }
        }
    },
	"index_patterns": [ "logs-django-dev", "restored-logs-django-dev" ],
	"data_stream": { },
    "composed_of": [ "logs-settings-component" ],
	"priority": 500
}'

echo -e "\nCreating data streams"
curl --cacert config/certs/ca/ca.crt -XPUT -u elastic:$ELASTIC_PASSWORD \
https://es01:9200/_data_stream/logs-nginx.access-dev

curl --cacert config/certs/ca/ca.crt -XPUT -u elastic:$ELASTIC_PASSWORD \
https://es01:9200/_data_stream/logs-django-dev

echo -e "\nAll done"

