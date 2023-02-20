# --- Build the frontend ---
FROM node:12.16.1-alpine3.9 as build

MAINTAINER Saurabh Srivastava (saurass.in)

ARG API_SERVER_HOST
ARG SOCKETIO_SERVER_HOST
ARG RAZOR_PAY_KEY_ID
ARG RECAPTCHA_KEY
ENV REACT_APP_BACKEND=$API_SERVER_HOST
ENV REACT_APP_SOCKETIO_SERVER=$SOCKETIO_SERVER_HOST
ENV REACT_APP_RAZORPAY_API_ID=$RAZOR_PAY_KEY_ID
ENV REACT_APP_RECAPTCHA_KEY=$RECAPTCHA_KEY

WORKDIR /codeplayer_frontend
COPY package*.json /codeplayer_frontend/
RUN yarn
COPY . /codeplayer_frontend
RUN yarn build

# Step 2: Packages assets for serving
FROM nginx:alpine

MAINTAINER Saurabh Srivastava (saurass.in)

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /codeplayer_frontend/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
