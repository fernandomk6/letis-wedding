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
  serverTimestamp
} from 'firebase/firestore';
import { db } from './config.js';

/* Paths: todos os dados ficam sob users/{ownerUid}/... */
const productsCol = (ownerUid) => collection(db, 'users', ownerUid, 'products');
const productDoc = (ownerUid, productId) => doc(db, 'users', ownerUid, 'products', productId);
const reservationsCol = (ownerUid) => collection(db, 'users', ownerUid, 'reservations');
const namesDoc = (ownerUid) => doc(db, 'users', ownerUid, 'settings', 'names');

/* User profile operations */
export const userService = {
  // Cria o perfil users/{uid} no primeiro login
  async ensureProfile(user) {
    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        displayName: user.displayName || '',
        email: user.email || '',
        createdAt: serverTimestamp()
      });
    }
  }
};

/* Product operations */
export const productService = {
  // Get all products
  async getAllProducts(ownerUid) {
    try {
      const productsRef = productsCol(ownerUid);
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
  async getProduct(ownerUid, productId) {
    try {
      const productRef = productDoc(ownerUid, productId);
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
  async createProduct(ownerUid, productData) {
    try {
      const productsRef = productsCol(ownerUid);
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
  async updateProduct(ownerUid, productId, updateData) {
    try {
      const productRef = productDoc(ownerUid, productId);
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
  async deleteProduct(ownerUid, productId) {
    try {
      const productRef = productDoc(ownerUid, productId);
      await deleteDoc(productRef);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // Reserve product (with transaction for consistency)
  async reserveProduct(ownerUid, productId, donorName) {
    try {
      const result = await runTransaction(db, async (transaction) => {
        const productRef = productDoc(ownerUid, productId);
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
        const reservationRef = doc(reservationsCol(ownerUid));
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
  async unreserveProduct(ownerUid, productId) {
    try {
      const result = await runTransaction(db, async (transaction) => {
        const productRef = productDoc(ownerUid, productId);
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
  async transferReservation(ownerUid, productId, newDonorName) {
    try {
      const result = await runTransaction(db, async (transaction) => {
        const productRef = productDoc(ownerUid, productId);
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
  async searchProducts(ownerUid, searchTerm, donorFilter) {
    try {
      let products = await this.getAllProducts(ownerUid);
      
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
  async getAllReservations(ownerUid) {
    try {
      const reservationsRef = reservationsCol(ownerUid);
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
  async getProductReservations(ownerUid, productId) {
    try {
      const reservationsRef = reservationsCol(ownerUid);
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
export const updateCoupleNames = async (ownerUid, brideName, groomName, pixKey, weddingDate, publicMessage, paletteId = 'azul-classico') => {
  try {
    await setDoc(namesDoc(ownerUid), {
      brideName: brideName.trim(),
      groomName: groomName.trim(),
      pixKey: pixKey.trim(),
      weddingDate: weddingDate,
      publicMessage: publicMessage.trim(),
      paletteId: paletteId,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error('Error updating couple names:', error);
    throw error;
  }
};

export const getCoupleNames = async (ownerUid) => {
  try {
    const docSnap = await getDoc(namesDoc(ownerUid));
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    // Silenciosamente falha - os nomes do casal são opcionais
    return null;
  }
};
