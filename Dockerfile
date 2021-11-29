FROM docker-registry.geocuba.cu:5000/node:16.13.0

# ENV LANG C.UTF-8
# ENV NPM_REGISTRY=https://npm.geocuba.cu

WORKDIR /app

COPY package.json ./
RUN npm install
COPY . .
RUN npm run build
CMD [ "npm","run", "start" ]
