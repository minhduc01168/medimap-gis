# ==========================================
# Stage 1: Build React App với Node
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Cài đặt dependencies với layer cache
COPY package.json package-lock.json ./
RUN npm ci

# Sao chép toàn bộ mã nguồn frontend và build
COPY . .
RUN npm run build

# ==========================================
# Stage 2: Serve với Nginx siêu nhẹ
# ==========================================
FROM nginx:alpine

# Sao chép kết quả build từ builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Sao chép cấu hình Nginx reverse proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
