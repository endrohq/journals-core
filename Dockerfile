FROM node:12.22.1-alpine
USER root

ENV CXXFLAGS='-Wno-error=deprecated-copy -Wno-error=pessimizing-move -Wno-error=class-memaccess'
RUN apk add --no-cache --virtual build-deps build-base cmake linux-headers libtool autoconf alpine-sdk automake python3 make gcc g++ && \
    mkdir -p /prebuilds && cd /prebuilds

# Install Rocksdb
RUN cd /tmp && \
    git clone https://github.com/facebook/rocksdb.git && \
    cd rocksdb && \
    git checkout v6.10.2 && \
    make shared_lib && \
    mkdir -p /usr/local/rocksdb/lib && \
    mkdir /usr/local/rocksdb/include && \
    cp librocksdb.so* /usr/local/rocksdb/lib && \
    cp /usr/local/rocksdb/lib/librocksdb.so* /usr/lib/ && \
    cp -r include /usr/local/rocksdb/ && \
    cp -r include/* /usr/include/ && \
    rm -R /tmp/rocksdb/

RUN sudo npm install --unsafe-perm --verbose  -g sodium-native

WORKDIR /usr/src/app

COPY package.json .
RUN npm install
COPY . .

EXPOSE 8080


