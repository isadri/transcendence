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

* `ELASTICSEARCH_HOSTS: '[https://elasticsearch:9200]'`: the urls of the Elasticsearch instances to use for all the queries.
* `ELASTICSEARCH_SSL_CERTIFICATEAUTHORITIES: config/certs/ca/ca.zip`: path to the CA certificate, which make up a trusted certificate chain for Elasticsearch. This chain is used by Kibana to establish trust when making outbound SSL/TLS connections to Elasticsearch.
* `XPACK_ENCRYPTEDSAVEDOBJECTS_ENCRYPTIONKEY`: Kibana stores entities such as dashboards, visualizations, alerts, actions, and advanced settings as saved objects. `xpack.encryptedSavedObjects.encryptionKey` is used to encrypt sensitive properties of saved objects before they're stored in Elasticsearch, if it's not set, objects will be saved in plain text.

> [!WARNING]
> The default mechanism for Reporting privileges will work differently in future versions, which will affect the behavior of this cluster. Set "xpack.reporting.roles.enabled" to "false" to adopt the future behavior before upgrading.
