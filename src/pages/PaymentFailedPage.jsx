// src/pages/PaymentFailedPage.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  Grid
} from '@mui/material';
import {
  Error as ErrorIcon,
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { PALETTE } from '../components/PALETTE';

const PaymentFailedPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { error, paymentData, candidat } = location.state || {};

  const handleRetry = () => {
    if (candidat) {
      navigate('/payment', { state: { candidat } });
    } else {
      navigate('/candidats');
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center' }}>
        <ErrorIcon sx={{ fontSize: 80, color: PALETTE.RED_DARK, mb: 3 }} />
        
        <Typography variant="h3" fontWeight="bold" gutterBottom color={PALETTE.RED_DARK}>
          Paiement Échoué
        </Typography>
        
        <Typography variant="h6" color={PALETTE.BROWN} gutterBottom>
          {error || 'Une erreur est survenue lors du paiement'}
        </Typography>

        <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="error" sx={{ mb: 3 }}>
                <Typography variant="body1" fontWeight="bold">
                  Causes possibles :
                </Typography>
                <ul style={{ marginTop: '8px', marginBottom: 0 }}>
                  <li>Fonds insuffisants sur votre compte</li>
                  <li>Transaction annulée par l'utilisateur</li>
                  <li>Problème technique temporaire</li>
                  <li>Délai d'attente dépassé</li>
                </ul>
              </Alert>
            </Grid>
            
            {paymentData && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Référence : {paymentData.reference}
                </Typography>
              </Grid>
            )}
          </Grid>
        </Paper>

        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={handleRetry}
            sx={{ px: 4 }}
          >
            Réessayer le paiement
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/candidats')}
          >
            Retour aux candidats
          </Button>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Si le problème persiste, contactez notre support au +229 XX XX XX XX
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default PaymentFailedPage;