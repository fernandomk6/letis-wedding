// Seed data script for populating Firestore with sample products
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Firebase configuration - replace with your actual config
const firebaseConfig = {
  apiKey: "your_api_key_here",
  authDomain: "your_project.firebaseapp.com",
  projectId: "your_project_id",
  storageBucket: "your_project.appspot.com",
  messagingSenderId: "your_sender_id",
  appId: "your_app_id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample products data
const sampleProducts = [
  {
    title: "Jogo de Panelas Inox",
    description: "Conjunto completo de panelas em aço inox, 5 peças",
    imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
    price: 350.00,
    quantity: 1,
    reservedBy: null,
    reservedAt: null
  },
  {
    title: "Jogo de Pratos de Porcelana",
    description: "Conjunto de pratos de porcelana fina, 12 peças",
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
    price: 280.00,
    quantity: 1,
    reservedBy: null,
    reservedAt: null
  },
  {
    title: "Aspirador de Pó",
    description: "Aspirador de pó vertical, potente e silencioso",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    price: 450.00,
    quantity: 1,
    reservedBy: null,
    reservedAt: null
  },
  {
    title: "Jogo de Toalhas de Banho",
    description: "Conjunto de toalhas de banho premium, 4 peças",
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
    price: 120.00,
    quantity: 2,
    reservedBy: null,
    reservedAt: null
  },
  {
    title: "Micro-ondas",
    description: "Micro-ondas 30L com grill e função descongelamento",
    imageUrl: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400",
    price: 380.00,
    quantity: 1,
    reservedBy: null,
    reservedAt: null
  },
  {
    title: "Jogo de Copos de Cristal",
    description: "Conjunto de copos de cristal, 6 peças",
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
    price: 180.00,
    quantity: 1,
    reservedBy: null,
    reservedAt: null
  },
  {
    title: "Ferro de Passar",
    description: "Ferro de passar com vapor, tecnologia avançada",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    price: 220.00,
    quantity: 1,
    reservedBy: null,
    reservedAt: null
  },
  {
    title: "Jogo de Talheres de Prata",
    description: "Conjunto completo de talheres de prata, 24 peças",
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
    price: 650.00,
    quantity: 1,
    reservedBy: null,
    reservedAt: null
  },
  {
    title: "Liquidificador",
    description: "Liquidificador potente com 6 velocidades",
    imageUrl: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400",
    price: 190.00,
    quantity: 1,
    reservedBy: null,
    reservedAt: null
  },
  {
    title: "Jogo de Lençóis Premium",
    description: "Conjunto de lençóis de algodão egípcio, 4 peças",
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
    price: 320.00,
    quantity: 1,
    reservedBy: null,
    reservedAt: null
  }
];

// Function to seed the database
async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    const productsRef = collection(db, 'products');
    
    for (const product of sampleProducts) {
      const productData = {
        ...product,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(productsRef, productData);
      console.log(`✅ Added product: ${product.title} (ID: ${docRef.id})`);
    }
    
    console.log('🎉 Database seeding completed successfully!');
    console.log(`📦 Added ${sampleProducts.length} products to the database.`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
}

// Run the seeding function
seedDatabase();
