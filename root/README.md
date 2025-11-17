# Logistics Frontend Starter

## Kurulum

```bash
# 1) Projeyi oluştur
# (zaten dosyaları kopyaladıysan bu adımı atla)

# 2) Bağımlılıkları kur
npm i

# 3) Ortam değişkenlerini ayarla
cp .env.example .env.local
# API adresini kendi backend portuna göre düzenle

# 4) Geliştirme sunucusu
npm run dev
```

## Backend Entegrasyonu
- `NEXT_PUBLIC_API_BASE_URL` değerini .env.local dosyasında backend URL'in ile eşleştir.
- Login endpoint: `/api/auth/login` bir `{ token }` döndürmeli.
- Profil endpoint: `/api/auth/me` bir `UserProfile { id, email, roles: string[] }` döndürmeli.
- Admin Trucks örneği: `/api/trucks` liste döndürmeli (`items[]` veya düz dizi).

## Rol Bazlı Yönlendirme
- İlk rolüne göre `/dashboard/<role>` sayfasına yönlendirilirsin.
- Rotalar `lib/roles.ts` içinde.

## Not
- Demo için token localStorage ve cookie'de tutuluyor. Production için HttpOnly cookie + server actions önerilir.
