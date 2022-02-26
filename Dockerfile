FROM node:12-alpine
RUN mkdir -p /tmp
WORKDIR /tmp
COPY package.json /tmp
RUN yarn install --production=true
COPY . /tmp
RUN npm run build-release && \
 mkdir -p /build && \
 mv /tmp/dist /build && \
rm -rf /tmp && \
mkdir -p /dist
WORKDIR /
COPY run.sh /
RUN chmod +x /run.sh
ENTRYPOINT ["/run.sh"]
CMD []

