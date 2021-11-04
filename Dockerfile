FROM node:12-slim
RUN mkdir -p /tmp
WORKDIR /tmp
COPY package.json /tmp
RUN npm install 
COPY . /tmp
RUN npm run build-release
RUN mkdir -p /build
RUN mv /tmp/dist /build
RUN rm -rf /tmp
RUN mkdir -p /dist
WORKDIR /
COPY run.sh /
RUN chmod +x /run.sh
ENTRYPOINT ["/run.sh"]
CMD []

