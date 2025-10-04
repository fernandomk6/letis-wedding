import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  setDoc,
  query, 
  orderBy, 
  where,
  runTransaction,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './config.js';

/* Collections */
const PRODUCTS_COLLECTION = 'products';
const COUPLE_SETTINGS_COLLECTION = 'coupleSettings';
const RESERVATIONS_COLLECTION = 'reservations';

/* Product operations */
export const productService = {
  // Get all products
  async getAllProducts() {
    try {
      const productsRef = collection(db, PRODUCTS_COLLECTION);
      const q = query(productsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        reservedAt: doc.data().reservedAt?.toDate()
      }));
    } catch (error) {
      console.error('Error getting products:', error);
      throw error;
    }
  },

  // Get single product
  async getProduct(productId) {
    try {
      const productRef = doc(db, PRODUCTS_COLLECTION, productId);
      const productSnap = await getDoc(productRef);
      
      if (productSnap.exists()) {
        const data = productSnap.data();
        return {
          id: productSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
          reservedAt: data.reservedAt?.toDate()
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting product:', error);
      throw error;
    }
  },

  // Create new product
  async createProduct(productData) {
    try {
      const productsRef = collection(db, PRODUCTS_COLLECTION);
      const newProduct = {
        ...productData,
        reservedBy: null,
        reservedAt: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(productsRef, newProduct);
      return docRef.id;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Update product
  async updateProduct(productId, updateData) {
    try {
      const productRef = doc(db, PRODUCTS_COLLECTION, productId);
      await updateDoc(productRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // Delete product
  async deleteProduct(productId) {
    try {
      const productRef = doc(db, PRODUCTS_COLLECTION, productId);
      await deleteDoc(productRef);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // Reserve product (with transaction for consistency)
  async reserveProduct(productId, donorName) {
    try {
      const result = await runTransaction(db, async (transaction) => {
        const productRef = doc(db, PRODUCTS_COLLECTION, productId);
        const productSnap = await transaction.get(productRef);
        
        if (!productSnap.exists()) {
          throw new Error('Produto não encontrado');
        }
        
        const productData = productSnap.data();
        
        // Check if product is available
        if (productData.reservedBy !== null) {
          throw new Error('Produto já foi reservado');
        }
        
        // Reserve the product
        transaction.update(productRef, {
          reservedBy: donorName,
          reservedAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        
        // Create reservation record
        const reservationRef = doc(collection(db, RESERVATIONS_COLLECTION));
        transaction.set(reservationRef, {
          productId: productId,
          donorName: donorName,
          createdAt: serverTimestamp()
        });
        
        return { success: true, reservationId: reservationRef.id };
      });
      
      return result;
    } catch (error) {
      console.error('Error reserving product:', error);
      throw error;
    }
  },

  // Unreserve product (admin only)
  async unreserveProduct(productId) {
    try {
      const result = await runTransaction(db, async (transaction) => {
        const productRef = doc(db, PRODUCTS_COLLECTION, productId);
        const productSnap = await transaction.get(productRef);
        
        if (!productSnap.exists()) {
          throw new Error('Produto não encontrado');
        }
        
        const productData = productSnap.data();
        
        if (productData.reservedBy === null) {
          throw new Error('Produto não está reservado');
        }
        
        // Unreserve the product
        transaction.update(productRef, {
          reservedBy: null,
          reservedAt: null,
          updatedAt: serverTimestamp()
        });
        
        return { success: true };
      });
      
      return result;
    } catch (error) {
      console.error('Error unreserving product:', error);
      throw error;
    }
  },

  // Transfer reservation (admin only)
  async transferReservation(productId, newDonorName) {
    try {
      const result = await runTransaction(db, async (transaction) => {
        const productRef = doc(db, PRODUCTS_COLLECTION, productId);
        const productSnap = await transaction.get(productRef);
        
        if (!productSnap.exists()) {
          throw new Error('Produto não encontrado');
        }
        
        // Update the reservation
        transaction.update(productRef, {
          reservedBy: newDonorName,
          reservedAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        
        return { success: true };
      });
      
      return result;
    } catch (error) {
      console.error('Error transferring reservation:', error);
      throw error;
    }
  },

  // Search products
  async searchProducts(searchTerm, donorFilter) {
    try {
      let products = await this.getAllProducts();
      
      // Filter by search term
      if (searchTerm) {
        products = products.filter(product => 
          product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Filter by donor
      if (donorFilter) {
        products = products.filter(product => 
          product.reservedBy && 
          product.reservedBy.toLowerCase().includes(donorFilter.toLowerCase())
        );
      }
      
      return products;
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }
};

/* Reservation operations */
export const reservationService = {
  // Get all reservations
  async getAllReservations() {
    try {
      const reservationsRef = collection(db, RESERVATIONS_COLLECTION);
      const q = query(reservationsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));
    } catch (error) {
      console.error('Error getting reservations:', error);
      throw error;
    }
  },

  // Get reservations for a product
  async getProductReservations(productId) {
    try {
      const reservationsRef = collection(db, RESERVATIONS_COLLECTION);
      const q = query(reservationsRef, where('productId', '==', productId));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));
    } catch (error) {
      console.error('Error getting product reservations:', error);
      throw error;
    }
  }
};

/* Couple Settings operations */
export const updateCoupleNames = async (brideName, groomName) => {
  const settingsRef = doc(db, COUPLE_SETTINGS_COLLECTION, 'names');
  
  try {
    await updateDoc(settingsRef, {
      brideName: brideName.trim(),
      groomName: groomName.trim(),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    // If document doesn't exist, create it
    if (error.code === 'not-found') {
      await setDoc(settingsRef, {
        brideName: brideName.trim(),
        groomName: groomName.trim(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } else {
      console.error('Error updating couple names:', error);
      throw error;
    }
  }
};

export const getCoupleNames = async () => {
  try {
    const settingsRef = doc(db, COUPLE_SETTINGS_COLLECTION, 'names');
    const docSnap = await getDoc(settingsRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // Try to get from collection (fallback for old format)
      const querySnapshot = await getDocs(collection(db, COUPLE_SETTINGS_COLLECTION));
      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data();
      }
      return null;
    }
  } catch (error) {
    // Silenciosamente falha - os nomes do casal são opcionais
    return null;
  }
};
