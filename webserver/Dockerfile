FROM nginx
RUN apt-get update && apt-get install -y vim


COPY nginx.conf /etc/nginx/nginx.conf
CMD ["nginx", "-g", "daemon off;"]