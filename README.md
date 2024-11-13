## Devops

### ELK


### Run Elasticsearch in Docker

1.
```bash
docker pull docker.elastic.co/elasticsearch/elasticsearch:8.16.0
```

2.

```bash
docker run --rm --name elasticsearch_container -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" -e "xpack.security.enabled=false" docker.elastic.co/elasticsearch/elasticsearch:8.16.0
```

Setting the `xpack.security.enabled` environment to `false` is used to disable HTTPS.
