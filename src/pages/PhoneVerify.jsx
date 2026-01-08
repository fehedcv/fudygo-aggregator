import React, { useEffect, useRef, useState } from 'react';
import { auth } from '../firebase';
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  linkWithCredential,
  signInWithCredential,
  GoogleAuthProvider,
} from 'firebase/auth';

export default function PhoneVerify() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // 🔒 Preserve original Google user
  const googleUserRef = useRef(null);
  const googleIdTokenRef = useRef(null);

  // ─────────────────────────────────────────────
  // INITIAL GUARD + DEBUG LOG
  // ─────────────────────────────────────────────
  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      setError('You must be logged in with Google first.');
      return;
    }

    console.log('Logged-in user UID:', user.uid);
    console.log('Logged-in user phone:', user.phoneNumber);

    if (user.phoneNumber) {
      setMessage('Phone number already verified.');
    }
  }, []);

  // ─────────────────────────────────────────────
  // CLEANUP reCAPTCHA
  // ─────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        delete window.recaptchaVerifier;
      }
    };
  }, []);

  const setupRecaptcha = () => {
    if (window.recaptchaVerifier) return window.recaptchaVerifier;

    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      'recaptcha-container',
      { size: 'invisible' }
    );

    return window.recaptchaVerifier;
  };

  // ─────────────────────────────────────────────
  // SEND OTP (WILL TEMPORARILY SWITCH SESSION)
  // ─────────────────────────────────────────────
  const sendOtp = async () => {
    const user = auth.currentUser;
    if (!user) return;

    if (user.phoneNumber) {
      setMessage('Phone number already verified.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (!phone.startsWith('+')) {
        throw new Error('Use international format, e.g. +15551234567');
      }

      // 🔒 Save Google session
      googleUserRef.current = user;
      googleIdTokenRef.current = await user.getIdToken();

      const verifier = setupRecaptcha();
      const result = await signInWithPhoneNumber(auth, phone, verifier);

      setConfirmation(result);
      setSent(true);
      setMessage('OTP sent.');
    } catch (e) {
      console.error(e);
      setError(e.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // VERIFY OTP + RESTORE GOOGLE SESSION
  // ─────────────────────────────────────────────
  const verifyOtp = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (!confirmation) {
        throw new Error('OTP session missing');
      }

      // 1️⃣ This signs in with phone (Firebase web limitation)
      const phoneUserCred = await confirmation.confirm(otp);

      const phoneCredential = PhoneAuthProvider.credential(
        confirmation.verificationId,
        otp
      );

      // 2️⃣ Restore Google session
      const googleCred = GoogleAuthProvider.credential(
        null,
        googleIdTokenRef.current
      );

      const googleUserCred = await signInWithCredential(auth, googleCred);

      // 3️⃣ Link phone to Google user
      if (!googleUserCred.user.phoneNumber) {
        await linkWithCredential(
          googleUserCred.user,
          phoneCredential
        );
      }

      console.log(
        'Phone linked successfully:',
        auth.currentUser.phoneNumber
      );

      setMessage('Phone number verified and linked.');
    } catch (e) {
      console.error(e);

      if (e.code === 'auth/provider-already-linked') {
        setMessage('Phone number already verified.');
        return;
      }

      setError(e.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // UI
  // ─────────────────────────────────────────────
  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">
        Verify Phone Number
      </h2>

      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="+15551234567"
        className="w-full border p-2 rounded mb-3"
        disabled={!!auth.currentUser?.phoneNumber}
      />

      <div id="recaptcha-container" />

      {!auth.currentUser?.phoneNumber && (
        <button
          onClick={sendOtp}
          disabled={loading}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          {loading ? 'Sending...' : 'Send OTP'}
        </button>
      )}

      {sent && !auth.currentUser?.phoneNumber && (
        <>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="123456"
            className="w-full border p-2 rounded mt-4"
          />

          <button
            onClick={verifyOtp}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded mt-2"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </>
      )}

      {message && (
        <p className="text-green-700 mt-3">{message}</p>
      )}
      {error && (
        <p className="text-red-700 mt-3">{error}</p>
      )}
    </div>
  );
}
