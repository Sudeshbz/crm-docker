# CRM Backend (Dockerized)

NestJS + Prisma + PostgreSQL tabanlı CRM Backend projesidir.  
Proje Docker ile **tek komutla** ayağa kaldırılacak şekilde yapılandırılmıştır.

---

## 🚀 Quick Start (Hızlı Başlangıç)

### 1️⃣ Repoyu klonla
```bash
git clone https://github.com/Sudeshbz/crm-docker.git
cd crm-docker
2️⃣ .env dosyasını oluştur
Proje ortam değişkenlerini .env dosyasından okur.
Aşağıdaki içeriğe sahip bir .env dosyası oluştur:

env
Kodu kopyala
DATABASE_URL=postgresql://postgres:12345@db:5432/codyol?schema=public
JWT_SECRET=VUEipKU7aPRoZ14HsIxUaEo706Cw9bK4QgsDK8DSLc8WLZA0XwFB3NyISlY05TDsmR2To70h8PRjDUYvgGkKiA==
JWT_REFRESH_SECRET=WJr+ohpRl/7c61dcKyp597NreD3DS7p2zUpJan6sUnHMk/fDoD6KBi6CCpGDzIiCWtXgoZ/TdotPZlQ7oXwkjg==
PORT=3000
NODE_ENV=development
⚠️ .env dosyası GitHub’a pushlanmaz.
Her geliştirici kendi bilgisayarında oluşturur.

3️⃣ Docker ile projeyi çalıştır
bash
Kodu kopyala
docker compose up -d --build
Container loglarını görmek için:

bash
Kodu kopyala
docker compose logs -f api
📘 API Dokümantasyonu (Swagger)
Uygulama çalıştıktan sonra Swagger UI:

👉 http://localhost:3000/api

🧱 Kullanılan Teknolojiler
NestJS

Prisma ORM

PostgreSQL

JWT Authentication

Docker & Docker Compose

Swagger

🛠 Faydalı Komutlar
Servisleri durdur
bash
Kodu kopyala
docker compose down
DB dahil her şeyi sıfırla
bash
Kodu kopyala
docker compose down -v
İlk kez migration oluşturmak (gerekirse)
bash
Kodu kopyala
docker compose exec api npx prisma migrate dev --name init
📌 Notlar
Veritabanı Docker içinde çalışır.

DATABASE_URL içinde db host adı Docker servis ismidir.

API varsayılan olarak 3000 portundan yayın yapar.
