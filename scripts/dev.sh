#!/bin/bash

# 前端开发脚本

set -e

echo "🚀 启动前端开发环境..."

# 检查是否存在 node_modules
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
fi

# 检查后端网络是否存在
if ! docker network ls | grep -q "restart-network"; then
    echo "🌐 创建 Docker 网络..."
    docker network create restart-network
fi

# 启动开发服务器
echo "🔧 启动开发服务器..."
docker-compose up frontend-dev

echo "✅ 前端开发环境已启动在 http://localhost:5173"
