// FirebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// 🔹 Din Firebase-konfigurasjon (bruk dine egne verdier fra Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyD3P-7Q2oY7eLoPnPGQWq1xhNPSFCFID8U",
  authDomain: "kitchenapp-aea2e.firebaseapp.com",
  databaseURL: "https://kitchenapp-aea2e-default-rtdb.firebaseio.com",
  projectId: "kitchenapp-aea2e",
  storageBucket: "kitchenapp-aea2e.appspot.com",
  messagingSenderId: "959701393192",
  appId: "1:959701393192:web:d1018c5ad3f08665acba1d"
};

// 🔹 Initialiser Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, app };
