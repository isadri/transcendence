## Devops

### ELK

## Elasticsearch

[Secure the ELK Stack](https://www.elastic.co/guide/en/elasticsearch/reference/current/secure-cluster.html)

---

* `discovery.type: single-node`: ensures that our node does not inadvertently connect to other clusters that might be running on our network.

* `bootstrap.memory_lock: true`: locks the process address space into RAM, ensuring that the memory is always in RAM and never moved to the swap disk. This makes accesssing those memory locations much faster as disks are extremely slow compared to RAM. [more](https://www.elastic.co/guide/en/elasticsearch/reference/current/setup-configuration-memory.html#bootstrap-memory_lock).

* `xpack.license.self_generated.type: ${LICENSE}`: by default uses the free trial (basic).

* `xpack.security.transport.ssl.enabled: true`: enable TLS on the tranport networking layer, which nodes use to communicate with each other.

* `xpack.security.transport.ssl.verification_mode: certificate`: validate the provided certificate and verifies that it's signed by a trusted authority (CA).

* `xpack.security.transport.ssl.client_authentication: required`: force a client to present a certificate.

* `xpack.security.transport.ssl.key: config/certs/ca/ca.key`: path to the file containing the private key.

* `xpack.security.transport.ssl.certificate_authorities: config/certs/ca/ca.crt`: paths to the certificate files that should be trusted.

* `xpack.security.http.ssl.enabled: true`: enable TLS on the HTTP networking layer, which Elasticsearch uses to communicate with other clients.

* `xpack.security.http.ssl.key: config/certs/elasticsearch/elasticsearch.key`: specifie the path containing the private key.

* `xpack.security.http.ssl.certificate: config/certs/elasticsearch/elasticsearch.crt`: specifie the certificate path that is associated with the key.

## Heap sizing settings

[resource](https://www.elastic.co/guide/en/elasticsearch/reference/current/important-settings.html#heap-size-settings).

## Kibana

* `elasticsearch.username` and `elasticsearch.password`: set the username and the password that the Kibana server will use.

* `elasticsearch.ssl.certificateAuthorities: config/certs/ca/ca.crt`: path to the CA certificate, which makes up a trusted certificate chain for Elasticsearch. This chain is used by Kibana to establish trust when making outbound TLS connections to Elasticsearch.

* `elasticsearch.hosts: https://elasticsearch:9200`: the url of the Elasticsearch instance to use for all the queries. using `https` protocol enable TLS for outbound connections to Elasticsearch.

---

* `xpack.reporting.encryptionKey`: encryption key that Kibana uses to protect sensitive infomation, used here because of the following warning at Kiaban startup.

```bash
Generating a random key for xpack.reporting.encryptionKey. To prevent sessions from being invalidated on restart, please set xpack.reporting.encryptionKey in the kibana.yml or use the bin/kibana-encryption-keys command.
```

---

* `xpack.encryptedSavedObjects.encryptionKey`: Kibana stores entities such as dashboards, visualizations, alerts, actions, and advanced settings as saved objects, which are kept in a dedicated, internal Elasticsearch index. Encryption sensitive information means that a malicious party with access to the Kibana internal indices won't be able to extract that information without also knowing the encryption key.

```bash
APIs are disabled because the Encrypted Saved Objects plugin is missing encryption key. Please set xpack.encryptedSavedObjects.encryptionKey in the kibana.yml or use the bin/kibana-encryption-keys command.
```

---

* `xpack.security.secureCookies`: set the `secure` attribute so that cookies will be transmitted only over HTTPS.

```bash
Session cookies will be transmitted over insecure connections. This is not recommended.
```

---

* `xpack.security.encryptionKey`: used to encrypt session information.

```bash
Generating a random key for xpack.security.encryptionKey. To prevent sessions from being invalidated on restart, please set xpack.security.encryptionKey in the kibana.yml or use the bin/kibana-encryption-keys command.
```

---

* `server.ssl.enabled: true`: enable TLS for inbound connections to Kibana. A certificate and its corresponding private key must be provided as the next setting does.

* `server.ssl.certificate: config/certs/kibana/kibana.yml` and `server.ssl.key: config/certs/kibana/kibana.key`:  paths to the server certificate and its corresponding private key. These are used by Kibana to establish trust when receiving inbound TLS connections from users.

---

* `xpack.reporting.roles.enabled: false`: [from documentation](https://www.elastic.co/guide/en/kibana/current/reporting-settings-kb.html#reporting-advanced-settings).

```bash
The default mechanism for Reporting privileges will work differently in future versions, which will affect the behavior of this cluster. Set "xpack.reporting.roles.enabled" to "false" to adopt the future behavior before upgrading.
```

## Logstash

* `ssl_enabled => true`: enable ssl secured communication to Elasticsearch cluster.

* `ssl_key`: ssl key to use. It must be converted to the PKCS8 format and PEM encoded as mentioned in the [documentation](https://www.elastic.co/guide/en/logstash/current/plugins-outputs-elasticsearch.html#plugins-outputs-elasticsearch-ssl_key)

---

* `xpack.monitoring.enabled: true`: enable monitoring.

```bash
xpack.monitoring.enabled has not been defined, but found elasticsearch configuration. Please explicitly set `xpack.monitoring.enabled: true` in logstash.ym
```

* `xpack.monitoring.elasticsearch.hosts: "https://elasticsearch:9200"`: the Elasticsearch instance to ship Logstash metrics to.

* `xpack.monitoring.elasticsearch.username` and `xpack.monitoring.elasticsearch.password`: provide the username and password that the Logstash instances uses to authenticate for shipping monitoring data.

* `xpack.monitoring.elasticsearch.ssl.certificate_authority: config/certs/ca/ca.crt`: specify the path to the CA certificate for Elasticsearch instance.


## Data Management

### index lifecycle

#### [Phase execution](https://www.elastic.co/guide/en/elasticsearch/reference/current/ilm-index-lifecycle.html#ilm-phase-execution)

ILM runs periodically, checks to see if an index meets policy criteria, and executes whatever steps are needed. To avoid race conditions, ILM might need to run more than once to execute all of the steps required to complete an action. For example, if ILM determines that an index has met the rollover criteria, it begins executing the steps required to complete the rollover action. If it reaches a point where it is not safe to advance to the next step, execution stops. The next time ILM runs, ILM picks up execution where it left off. This means that even if indices.lifecycle.poll_interval is set to 10 minutes and an index meets the rollover criteria, it could be 20 minutes before the rollover is complete.

## Restore a snapshot

```
POST /_snapshot/<snapshot_repo>/<snapshot_name>/_restore
{
  "indices": "<indices>",
  "include_global_state": false,
  "rename_pattern": "(.+)",
  "rename_replacement": "restored-$1",
  "include_aliases": false
}

```

