ARG STACK_VERSION
FROM docker.elastic.co/elasticsearch/elasticsearch:${STACK_VERSION}

COPY setup.sh .

CMD [ "bash", "setup.sh" ]
