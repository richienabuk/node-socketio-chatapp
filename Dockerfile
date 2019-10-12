FROM node

WORKDIR '/app'

COPY package.json .
# RUN yarn global add node-gyp
RUN npm install

COPY . .

CMD ["npm", "start"]
