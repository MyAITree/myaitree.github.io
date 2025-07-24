// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDZjqiKRSKBhX27YNkkNlui3xmJQFdIVCg",
  authDomain: "my-ai-tree.firebaseapp.com",
  projectId: "my-ai-tree",
  storageBucket: "my-ai-tree.firebasestorage.app",
  messagingSenderId: "830305583526",
  appId: "1:830305583526:web:49c72f229d1582f07e0f67",
  measurementId: "G-377MBY9E7Q"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Secure localStorage keys
const AUTH_STORAGE_KEY = "orderSystemAuth";
const USER_STORAGE_KEY = "orderSystemUser";

// Authentication manager class
class AuthManager {
    static saveAuthData(user) {
        const authData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            lastLogin: new Date().toISOString()
        };
        
        // Store encrypted version (basic example - use crypto.subtle in production)
        const encrypted = btoa(JSON.stringify(authData));
        localStorage.setItem(AUTH_STORAGE_KEY, encrypted);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authData));
    }

    static getAuthData() {
        try {
            const encrypted = localStorage.getItem(AUTH_STORAGE_KEY);
            if (!encrypted) return null;
            
            const decrypted = JSON.parse(atob(encrypted));
            return decrypted;
        } catch (e) {
            return null;
        }
    }

    static clearAuthData() {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
    }

    static isAuthenticated() {
        return !!this.getAuthData();
    }

    static getUserInfo() {
        const userData = localStorage.getItem(USER_STORAGE_KEY);
        return userData ? JSON.parse(userData) : null;
    }
}
