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

Generating a random key for xpack.reporting.encryptionKey. To prevent sessions from being invalidated on restart, please set xpack.reporting.encryptionKey in the kibana.yml or use the bin/kibana-encryption-keys command.


 APIs are disabled because the Encrypted Saved Objects plugin is missing encryption key. Please set xpack.encryptedSavedObjects.encryptionKey in the kibana.yml or use the bin/kibana-encryption-keys command.

Session cookies will be transmitted over insecure connections. This is not recommended.
