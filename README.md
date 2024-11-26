## Devops

### ELK

* `bootstrap.memory_lock=true`: locks the process address space into RAM, ensuring that the memory is always in RAM and never moved to the swap disk. This makes accesssing those memory locations much faster as disks are extremely slow compared to RAM. [more](https://www.elastic.co/guide/en/elasticsearch/reference/current/setup-configuration-memory.html#bootstrap-memory_lock).
* `xpack.license.self_generated.type=${LICENSE}`: by default uses the free trial (basic).
* `xpack.security.transport.ssl.enabled=true`: enables TLS/SSL on the transport networking layer, which nodes use to communicate with each other.
* `xpack.security.transport.ssl.client_authentication=required`: forces a client to present a certificate.
* `xpack.security.transport.ssl.verification_mode=certificate`: validates the provided certificate and verifies that it's signed by a trusted authority (CA).
* `xpack.security.transport.ssl.key=config/certs/elasticsearch/elasticsearch.key`: Specifies the path of the private key of the node.
* `xpack.security.transport.ssl.certificate=config/certs/elasticsearch/elasticsearch.crt`: Specifies the path of the certificate that is associated with the key.
* `xpack.security.transport.ssl.certificate_authorities=config/certs/ca/ca.crt`: Specifies the certificate files that should be trusted.

Enabling TLS on the HTTP layer provides an additional layer of security to ensure that all communications to and from the cluster are encrypted.
* `xpack.security.http.ssl.enabled=true`: enables TLS/SSL on the HTTP networking layer, which Elasticsearch uses to to communicate with other nodes.
* `xpack.security.http.ssl.client_authentication=required`: forces a client to present a certificate.
* `xpack.security.http.ssl.verification_mode=certificate`: validates the provided certificate and verifies that it's signed by a trusted authority (CA).
* `xpack.security.http.ssl.key=config/certs/elasticsearch/elasticsearch.key`: specifies the path of the private key. Because HTTP client authentication is required, it uese this file.
* `xpack.security.http.ssl.certificate=config/certs/elasticsearch/elasticsearch.crt`: specifies the path of the certificate that is associated with the key.
* `xpack.security.http.ssl.certificate_authorities=config/certs/ca/ca.crt`: specifies the certificate files that should be trusted.

## Heap sizing settings

[resource](https://www.elastic.co/guide/en/elasticsearch/reference/current/important-settings.html#heap-size-settings).
