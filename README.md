## Devops

### ELK

* `xpack.security.transport.ssl.enabled=true`: enables TLS/SSL on the transport networking layer, which nodes use to communicate with each other.
* `xpack.security.transport.ssl.client_authentication=required`: forces a client to present a certificate.
* `xpack.security.transport.ssl.verification_mode=certificate`: validates the provided certificate and verifies that it's signed by a trusted authority (CA).
* `xpack.security.transport.ssl.key=config/certs/elasticsearch/elasticsearch.key`: Specifies the path of the private key of the node.
* `xpack.security.transport.ssl.certificate=config/certs/elasticsearch/elasticsearch.crt`: Specifies the path of the certificate that is associated with the key.
* `xpack.security.transport.ssl.certificate_authorities=config/certs/ca/ca.crt`: Specifies the certificate files that should be trusted.
