FROM docker.elastic.co/beats/filebeat:7.4.2

COPY ./filebeat.yml /usr/share/filebeat/filebeat.yml
USER root
RUN mkdir /var/log/server

RUN chown root /usr/share/filebeat/filebeat.yml
RUN chmod go-w /usr/share/filebeat/filebeat.yml
# RUN sudo chmod go-w ./filebeat/filebeat.yml

# RUN chown root filebeat.yml
# RUN chown -R root /usr/share/filebeat
