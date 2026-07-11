FROM node:20 AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build


FROM nginx:alpine3.23

RUN apk upgrade --no-cache

# نسخ ملفات الفرونت اند
COPY --from=build /app/dist /usr/share/nginx/html

# نسخ ملف الإعدادات
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 👈 إضافة ضبط الصلاحيات للمستخدم والمجلدات هنا
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

EXPOSE 80