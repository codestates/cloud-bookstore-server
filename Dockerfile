FROM node:15.9.0

# 이미지 생성 과정에서 실행할 명령어
# RUN npm install -g yarn

# 이미지 내에서 명령어를 실행할(현 위치로 잡을) 디렉토리 설정/생성 
WORKDIR /usr/src/app

# 의존성 설치 
COPY package.json .
RUN npm install 

# 소스 추가 
COPY . .

EXPOSE 5000

# 컨테이너 실행시 실행할 명령어 
CMD ["npm", "run", "start"]