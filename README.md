# Yonmi's Gloss

Yonmi's Gloss is a modern storefront for premium lip gloss products.

## Firebase + Cloudinary Setup

1. Copy `.env.example` to `.env` and fill:
`VITE_CLOUDINARY_CLOUD_NAME`, `VITE_CLOUDINARY_UPLOAD_PRESET`
2. In Firebase Console, enable:
Email/Password Authentication and Firestore Database.
3. Create an admin user in Firebase Auth (email/password).
4. Use this Firestore collection:
`products`
5. Product document fields:
`slug`, `name`, `price`, `category`, `images`, `description`, `bestseller`, `createdAt`, `updatedAt`
6. Start app and visit `/admin` to sign in.

Notes:
- The products collection is intentionally empty by default.
- Add products manually from `/admin`.
- Product images are uploaded to Cloudinary.
- Each product supports up to 3 images. `images[0]` is the thumbnail.
