// hooks/usePayment.js
import { useState, useCallback } from 'react';
import axios from '../api/axios';

export const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentData, setPaymentData] = useState(null);

  const initiatePayment = useCallback(async (paymentInfo) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('/payments/initiate', paymentInfo);
      
      if (response.data.success) {
        setPaymentData(response.data.data);
        return response.data.data;
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const processPayment = useCallback(async (paymentToken, paymentMethod) => {
    try {
      setLoading(true);
      
      const response = await axios.post('/payments/process', {
        payment_token: paymentToken,
        payment_method: paymentMethod
      });
      
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkPaymentStatus = useCallback(async (paymentToken) => {
    try {
      const response = await axios.get(`/payments/${paymentToken}/status`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    }
  }, []);

  const resetPayment = useCallback(() => {
    setLoading(false);
    setError(null);
    setPaymentData(null);
  }, []);

  return {
    loading,
    error,
    paymentData,
    initiatePayment,
    processPayment,
    checkPaymentStatus,
    resetPayment
  };
};