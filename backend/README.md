# 🍱 Surplus Food Rescue Network — Backend

## Setup Steps

### 1. Replace Environment Values
Edit `src/main/resources/application.properties` and replace all `YOUR_*` values:
- Database credentials
- JWT secret (use a 256-bit base64 string)
- Cloudinary keys
- Twilio credentials
- Gmail credentials

### 2. Firebase Setup
- Go to Firebase Console → Project Settings → Service Accounts
- Generate new private key → download JSON
- Replace contents of `src/main/resources/firebase-service-account.json`

### 3. Start Database & Redis
```bash
docker-compose up -d
```

### 4. Run the Application
```bash
./mvnw spring-boot:run
```

## API Endpoints

| Method | URL | Role | Description |
|--------|-----|------|-------------|
| POST | /api/auth/register | Public | Register user |
| POST | /api/auth/login | Public | Login |
| POST | /api/donor/posts | DONOR | Create food post |
| GET | /api/donor/posts | DONOR | My posts |
| GET | /api/donor/dashboard | DONOR | Donor dashboard |
| DELETE | /api/donor/posts/{id} | DONOR | Delete post |
| GET | /api/posts/nearby | Any | Nearby live posts |
| GET | /api/volunteer/dashboard | VOLUNTEER | Volunteer dashboard |
| POST | /api/volunteer/claims/{postId} | VOLUNTEER | Claim a post |
| PUT | /api/volunteer/claims/{id}/pickup | VOLUNTEER | Mark picked up |
| PUT | /api/volunteer/claims/deliver | VOLUNTEER | Confirm delivery |
| PUT | /api/volunteer/status | VOLUNTEER | Toggle online/offline |
| GET | /api/admin/users/pending | ADMIN | Pending verifications |
| PUT | /api/admin/users/{id}/verify | ADMIN | Verify user |
| PUT | /api/admin/users/{id}/suspend | ADMIN | Suspend user |
| POST | /api/admin/emergency/activate | ADMIN | Trigger emergency mode |
| GET | /api/public/stats/live | Public | Live platform stats |

## Project Structure
```
src/main/java/com/foodrescue/backend/
├── config/          # Security, Redis, WebSocket, Cloudinary, Firebase
├── controller/      # REST API endpoints
├── service/         # Business logic
├── repository/      # Database queries
├── model/           # JPA entities
├── dto/             # Request & Response objects
├── enums/           # Role, PostStatus, TransportType, Language
├── security/        # JWT filter & service
├── exception/       # Global error handling
└── scheduler/       # Auto-expiry & radius expansion
```
