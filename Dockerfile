# Container image for Coolify deploys (build pack: Dockerfile).
# GitHub Pages ignores this file — it only affects container-based hosting.
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

# The repo root is the site root (GitHub Pages requires that), so copy
# everything and then drop the deploy-only files from the served directory.
COPY . /usr/share/nginx/html
RUN rm -f /usr/share/nginx/html/nginx.conf \
          /usr/share/nginx/html/Dockerfile \
          /usr/share/nginx/html/.dockerignore \
          /usr/share/nginx/html/CNAME

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO /dev/null http://127.0.0.1/ || exit 1
