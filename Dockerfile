# build environment
FROM node:14.17.1
ARG GITHUB_TOKEN
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH
ENV GITHUB_TOKEN=${GITHUB_TOKEN}
ENV PORT 80
COPY . /usr/src/app
RUN npm install
RUN npm run build
EXPOSE 80
CMD ["npm", "start"]
