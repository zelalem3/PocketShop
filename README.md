# PocketShop 🛍️

A modern **React Native** e-commerce mobile app built for the Ethiopian market. Browse products, manage a cart, checkout with **Chapa** payments, and track orders — all powered by **Firebase**.

> **Status:** Actively developed · Core shopping flow is complete

---

## ✨ Features

### 🔐 Authentication

- Email/password signup and login with Firebase Authentication
- Email verification flow
- Verified-email gate before accessing the main application
- Persistent authentication state with Zustand
- User profile data stored in Firestore

### 🛍️ Product Catalog

- Products fetched dynamically from Firestore
- Home screen with featured products
- Product images with `react-native-fast-image`
- Product detail screen
- Add products to cart from the home screen
- Add products to cart from the product detail screen

### 🛒 Cart & Checkout

- Firestore-backed persistent cart
- Add, remove, and update product quantities
- Cart total calculation
- Checkout flow
- Customer information collection
- Chapa payment integration
- Chapa test-mode payments
- Payment initialization
- Payment verification using `tx_ref`
- Payment success screen
- Order creation after successful payment

### 📦 Orders

- Order history for authenticated users
- Order list screen
- Order detail screen
- Order information stored in Firestore
- Quick access to orders from the home screen

### 👤 Profile

- User profile screen
- User information loaded from Firestore
- Authenticated user information
- Profile integrated into the main bottom-tab navigation

### 🧭 Navigation

- Root navigator for application-level routing
- Authentication stack
- Email verification gate
- Main application navigator
- Persistent bottom-tab navigation
- Native stack navigation for nested screens
- Product detail navigation
- Cart and checkout navigation
- Order list and order detail navigation
- Profile navigation

### 🏗️ Architecture

- Feature-based project structure
- Service layer for Firebase and external operations
- Zustand for authentication state
- React Hook Form for form management
- Zod for validation
- TypeScript throughout the application
- Firebase used for authentication and data persistence

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native 0.87 |
| Language | TypeScript |
| Runtime | React 19 |
| Navigation | React Navigation |
| Navigation Types | Native Stack + Bottom Tabs |
| Backend | Firebase |
| Authentication | Firebase Authentication |
| Database | Cloud Firestore |
| Payments | Chapa |
| State Management | Zustand |
| Forms | React Hook Form |
| Validation | Zod |
| Images | React Native Fast Image |
| Icons | Lucide React Native |
| Networking | Axios |

---

## 📁 Project Structure

```text
src/
├── components/              # Shared UI components
├── config/                  # Firebase and application configuration
├── features/
│   ├── auth/                # Login, signup, email verification
│   ├── cart/                # Cart screens and cart functionality
│   ├── home/                # Home screen and main application
│   ├── orders/              # Order list, detail, and checkout
│   ├── products/            # Product detail and product functionality
│   └── Profile/             # User profile
├── navigation/              # Root, auth, and main navigators
├── services/                # Auth, Firestore, orders, and payment services
├── store/                   # Zustand stores
└── types/                   # Shared TypeScript types
```
## 🚀 Getting Started
Prerequisites

Before running PocketShop locally, make sure you have:

Node.js >= 22.11
React Native development environment
Android Studio for Android development
Xcode for iOS development
A Firebase project
Firebase Authentication enabled
Cloud Firestore enabled
A Chapa test account for payment testing

For React Native environment setup, see the official React Native documentation.

1. Clone the Repository
```bash
git clone https://github.com/zelalem3/PocketShop.git
cd PocketShop
```
2. Install Dependencies

Using npm:

```
npm install
 ```

Or using Yarn:

```
bash yarn install
 ```
3. Configure Firebase

Create a Firebase project and enable:

Firebase Authentication
Email/Password authentication
Cloud Firestore
Android

Download your Firebase Android configuration file:

google-services.json

Place it inside:

android/app/google-services.json
iOS

Download your Firebase iOS configuration file:

GoogleService-Info.plist

Place it inside the appropriate iOS project directory.

Note: Do not commit sensitive credentials or private secrets to the repository.

4. Configure Environment Variables

Create a .env file in the project root.

Example:

```
CHAPA_SECRET_KEY=your_chapa_test_secret_key
```

Add any other environment variables required by the application.

Make sure .env is included in .gitignore.

5. Configure Firestore

Create the required Firestore collections and documents used by the application.

PocketShop currently uses Firestore for:

Products
Users
Carts
Orders

Configure your Firestore security rules so that authenticated users can only access data they are authorized to access.

6. Start Metro
```
npm start
 ```

Or:

```
npx react-native start
 ```
7. Run on Android

With an Android emulator or connected Android device:

``` 
npm run android
```

Or:
```
npx react-native run-android
```
8. Run on iOS

Install CocoaPods dependencies:

```
cd ios
```
bundle exec pod install
```
cd ..
```
Then run:
```
npm run ios
```

Or:

  ```  
npx react-native run-ios
```
## 🗺️ Project Progress

| Feature | Status | Notes |
|---|:---:|---|
| Project Bootstrap | ✅ Done | React Native 0.87 + TypeScript |
| Firebase Authentication | ✅ Done | Signup, login, email verification |
| Firestore Products | ✅ Done | Dynamic product catalog |
| Product Detail | ✅ Done | Product information and images |
| Cart | ✅ Done | Add, view, and manage products |
| Checkout | ✅ Done | Checkout flow |
| Chapa Payments | ✅ Done | Test mode + payment verification |
| Order Creation | ✅ Done | Orders saved to Firestore |
| Order History | ✅ Done | User order list |
| Order Detail | ✅ Done | Individual order information |
| Profile Screen | ✅ Done | User data from Firestore |
| Bottom Tab Navigation | ✅ Done | Persistent application tabs |
| Image Display | ✅ Done | Fast Image integration |

## 💳 Payment Flow

PocketShop integrates with Chapa to handle payments.

The current payment flow is:

User
  │
  ▼
Checkout
  │
  ▼
Initialize Chapa Payment
  │
  ▼
Chapa Hosted Payment
  │
  ▼
Payment Completed
  │
  ▼
Verify Transaction
  │
  ▼
Payment Success
  │
  ▼
Create Order in Firestore

The application currently uses Chapa's test environment for development.

Production payment configuration, secure backend verification, and webhook handling are planned for a future release.

## 🔐 Authentication Flow
```
Application Start
       │
       ▼
Firebase Auth State
       │
       ├── Not Authenticated ──► Login / Signup
       │
       └── Authenticated
                │
                ▼
          Email Verified?
                │
          ┌─────┴─────┐
          │           │
         No          Yes
          │           │
          ▼           ▼
   Verify Email    Main App
```

Users must verify their email address before accessing the main application.

## 🧭 Navigation Architecture

PocketShop uses a combination of Native Stack Navigation and Bottom Tab Navigation.
```
Root Navigator
│
├── Auth Navigator
│   ├── Login
│   ├── Signup
│   └── Verify Email
│
└── Main App
    │
    ├── Bottom Tabs
    │   ├── Home
    │   ├── Cart
    │   ├── Orders
    │   └── Profile
    │
    └── Native Stack
        ├── Product Detail
        ├── Cart
        ├── Checkout
        ├── Payment Success
        ├── Order List
        └── Order Detail
```
## 📱 Application Screens

PocketShop currently includes:

🔐 Login
📝 Signup
✉️ Email Verification
🏠 Home
🛍️ Product Detail
🛒 Cart
💳 Checkout
✅ Payment Success
📦 Order History
📋 Order Detail
👤 Profile
🌍 Built for the Ethiopian Market

PocketShop is designed as an Ethiopian-focused e-commerce application with local payment integration through Chapa.

The project provides a foundation for building a complete local shopping experience, including:

Product discovery
Cart management
Checkout
Ethiopian payment integration
Order management
User accounts
## 🔮 Possible Next Steps
## 🛍️ Shopping Experience
 Product search
 Category filters
 Product sorting
 Wishlist
 Product reviews and ratings
 Recently viewed products
## 📦 Orders
 Order status tracking
 Order cancellation
 Order notifications
 Delivery tracking
 Order status timeline
## 🔔 Notifications
 Push notifications
 Order status notifications
 Payment notifications
 Promotional notifications
## 💳 Payments
 Production Chapa credentials
 Secure backend payment verification
 Chapa webhooks
 Payment failure handling
 Payment retry flow
## 👨‍💼 Admin & Vendor Features
 Admin dashboard
 Product management
 Inventory management
 Order management
 Vendor accounts
 Sales analytics
## ⚡ Performance & Reliability
 Offline support
 Better loading states
 Better error handling
 Image caching improvements
 Network retry mechanisms
 Optimistic UI updates
## 🧪 Testing
 Unit tests
 Component tests
 Integration tests
 End-to-end tests
## 🔒 Security

PocketShop uses Firebase Authentication and Firestore security rules to protect user data.

For production deployment:

Keep payment secrets out of the client application
Perform sensitive payment verification on a trusted backend
Validate Chapa webhook requests
Restrict Firestore access using security rules
Never expose private API credentials in the mobile application
Use environment-specific configuration
Validate all user-controlled input
## 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

Fork the repository
git fork https://github.com/zelalem3/PocketShop
Create a feature branch
git checkout -b feature/your-feature
Commit your changes
git add .
git commit -m "feat: add your feature"
Push the branch
git push origin feature/your-feature

Then open a pull request.

## 📄 License

This project is licensed under the MIT License.

See the LICENSE file for details.

## 👨‍💻 Author

Zelalem Getnet

Full-Stack Software Engineer | Computer Science Graduate | ALX Software Engineering Alumni

- GitHub: [zelalem3](https://github.com/zelalem3)
- LinkedIn: [Zelalem Getnet](https://linkedin.com/in/zelalem-getnet-533326246)

Built with ❤️ by Zelalem Getnet

PocketShop — a modern e-commerce experience for Ethiopia 🇪🇹
