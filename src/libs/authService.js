import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

// Custom error messages for better UX
const getErrorMessage = (errorCode) => {
  const errorMessages = {
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/weak-password': 'Password should be at least 6 characters long.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/user-not-found': 'No account found with this email address.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/invalid-credential': 'Invalid email or password. Please check your credentials.',
  };
  
  return errorMessages[errorCode] || 'An unexpected error occurred. Please try again.';
};

// Email validation
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
const validatePassword = (password) => {
  return password && password.length >= 6;
};

// Signup user & create profile
export async function signup(email, password, displayName = '') {
  try {
    // Input validation
    if (!validateEmail(email)) {
      throw new Error('Please enter a valid email address.');
    }
    
    if (!validatePassword(password)) {
      throw new Error('Password must be at least 6 characters long.');
    }

    // Create user account
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile with display name if provided
    if (displayName.trim()) {
      await updateProfile(user, {
        displayName: displayName.trim()
      });
    }

    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email.toLowerCase(),
      displayName: displayName.trim() || null,
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      isActive: true,
    });

    return { 
      success: true, 
      user: {
        uid: user.uid,
        email: user.email,
        displayName: displayName.trim() || null
      }
    };
  } catch (error) {
    console.error('Signup error:', error);
    return { 
      success: false, 
      error: error.code ? getErrorMessage(error.code) : error.message 
    };
  }
}

// Login user
export async function login(email, password) {
  try {
    // Input validation
    if (!validateEmail(email)) {
      throw new Error('Please enter a valid email address.');
    }
    
    if (!password) {
      throw new Error('Password is required.');
    }

    // Sign in user
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    
    // Update last login timestamp
    try {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        await setDoc(userRef, {
          lastLoginAt: serverTimestamp(),
        }, { merge: true });
      }
    } catch (firestoreError) {
      // Don't fail login if Firestore update fails
      console.warn('Failed to update last login:', firestoreError);
    }

    return { 
      success: true, 
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      }
    };
  } catch (error) {
    console.error('Login error:', error);
    return { 
      success: false, 
      error: error.code ? getErrorMessage(error.code) : error.message 
    };
  }
}

// Get user profile from Firestore
export async function getUserProfile(uid) {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return { success: true, profile: userDoc.data() };
    }
    return { success: false, error: 'User profile not found' };
  } catch (error) {
    console.error('Get user profile error:', error);
    return { success: false, error: 'Failed to fetch user profile' };
  }
}