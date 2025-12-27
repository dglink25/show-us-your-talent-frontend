import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  Grid,
  Card,
  CardContent,
  Divider,
  IconButton,
  Fade,
  Grow,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon,
  ContactSupport as SupportIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Chat as ChatIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const PaymentErrorPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const error = location.state?.error || {};
  const paymentData = location.state?.paymentData || {};
  const candidat = location.state?.candidat || {};
  
  const errorMessages = {
    'declined': {
      title: 'Paiement refusé',
      description: 'Votre banque ou opérateur a refusé la transaction.',
      action: 'Vérifiez vos fonds ou contactez votre banque.'
    },
    'expired': {
      title: 'Session expirée',
      description: 'Le délai de paiement est dépassé.',
      action: 'Veuillez recommencer la procédure.'
    },
    'canceled': {
      title: 'Paiement annulé',
      description: 'Vous avez annulé le paiement.',
      action: 'Vous pouvez réessayer quand vous le souhaitez.'
    },
    'insufficient_funds': {
      title: 'Fonds insuffisants',
      description: 'Votre solde est insuffisant pour ce paiement.',
      action: 'Rechargez votre compte et réessayez.'
    },
    'default': {
      title: 'Erreur de paiement',
      description: 'Une erreur est survenue lors du traitement.',
      action: 'Veuillez réessayer ou contacter le support.'
    }
  };

  const getErrorDetails = () => {
    return errorMessages[error.code] || errorMessages.default;
  };

  const handleRetry = () => {
    navigate('/candidats', { 
      state: { 
        retryPayment: true,
        candidatId: candidat.id 
      } 
    });
  };

  const errorDetails = getErrorDetails();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Fade in={true} timeout={500}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20
            }}
          >
            <ErrorIcon sx={{ 
              fontSize: 100, 
              color: '#f44336',
              mb: 3
            }} />
          </motion.div>
          
          <Typography 
            variant="h3" 
            fontWeight="bold" 
            gutterBottom
            color="#f44336"
          >
            {errorDetails.title}
          </Typography>
          
          <Typography variant="h6" color="text.secondary" paragraph>
            {errorDetails.description}
          </Typography>
        </Box>
      </Fade>

      <Grid container spacing={4}>
        {/* Détails de l'erreur */}
        <Grid item xs={12} md={6}>
          <Grow in={true} timeout={800}>
            <Card 
              sx={{ 
                height: '100%',
                borderRadius: 3,
                overflow: 'hidden',
                border: '1px solid #ffebee',
                background: '#fff'
              }}
            >
              <Box
                sx={{
                  height: 8,
                  background: '#f44336'
                }}
              />
              
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Détails techniques
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Grid container spacing={2}>
                  {paymentData.reference && (
                    <>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Référence:
                        </Typography>
                      </Grid>
                      <Grid item xs={6} textAlign="right">
                        <Typography variant="body2" fontFamily="monospace">
                          {paymentData.reference}
                        </Typography>
                      </Grid>
                    </>
                  )}
                  
                  {error.code && (
                    <>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Code erreur:
                        </Typography>
                      </Grid>
                      <Grid item xs={6} textAlign="right">
                        <Typography variant="body2" fontFamily="monospace">
                          {error.code}
                        </Typography>
                      </Grid>
                    </>
                  )}
                  
                  {error.message && (
                    <Grid item xs={12}>
                      <Alert 
                        severity="error"
                        sx={{ 
                          mt: 2,
                          borderRadius: 2
                        }}
                      >
                        <Typography variant="body2">
                          {error.message}
                        </Typography>
                      </Alert>
                    </Grid>
                  )}
                </Grid>
                
                <Alert 
                  severity="info"
                  sx={{ 
                    mt: 4,
                    borderRadius: 2
                  }}
                >
                  <Typography variant="body2">
                    {errorDetails.action}
                  </Typography>
                </Alert>
              </CardContent>
            </Card>
          </Grow>
        </Grid>

        {/* Support */}
        <Grid item xs={12} md={6}>
          <Grow in={true} timeout={1000}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 4,
                borderRadius: 3,
                border: '1px solid #e0e0e0',
                height: '100%',
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <SupportIcon sx={{ fontSize: 40, color: '#667eea' }} />
                <Typography variant="h6" fontWeight="bold">
                  Besoin d'aide ?
                </Typography>
              </Box>
              
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Card 
                    sx={{ 
                      p: 3,
                      borderRadius: 2,
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                      }
                    }}
                    onClick={() => window.location.href = 'tel:+22912345678'}
                  >
                    <PhoneIcon sx={{ fontSize: 40, color: '#4CAF50', mb: 2 }} />
                    <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                      Appeler le support
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      +229 12 34 56 78
                    </Typography>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Card 
                    sx={{ 
                      p: 3,
                      borderRadius: 2,
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                      }
                    }}
                    onClick={() => window.location.href = 'mailto:support@talents-afrique.com'}
                  >
                    <EmailIcon sx={{ fontSize: 40, color: '#2196F3', mb: 2 }} />
                    <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                      Email support
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      support@talents-afrique.com
                    </Typography>
                  </Card>
                </Grid>
                
                <Grid item xs={12}>
                  <Card 
                    sx={{ 
                      p: 3,
                      borderRadius: 2,
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                      }
                    }}
                    onClick={() => window.open('https://wa.me/22912345678', '_blank')}
                  >
                    <ChatIcon sx={{ fontSize: 40, color: '#25D366', mb: 2 }} />
                    <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                      Chat WhatsApp
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Disponible 24/7
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Grow>
        </Grid>
      </Grid>

      {/* Actions */}
      <Box sx={{ mt: 6, display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={handleRetry}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
            }
          }}
        >
          Réessayer le paiement
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/candidats')}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 2,
            borderColor: '#667eea',
            color: '#667eea',
            '&:hover': {
              borderColor: '#5a6fd8',
              background: 'rgba(102, 126, 234, 0.04)'
            }
          }}
        >
          Retour aux candidats
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<HomeIcon />}
          onClick={() => navigate('/')}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 2,
            borderColor: '#764ba2',
            color: '#764ba2',
            '&:hover': {
              borderColor: '#6a4190',
              background: 'rgba(118, 75, 162, 0.04)'
            }
          }}
        >
          Retour à l'accueil
        </Button>
      </Box>

      {/* FAQ */}
      <Box sx={{ mt: 8 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom align="center">
          Questions fréquentes
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {[
            {
              question: 'Pourquoi mon paiement a-t-il été refusé ?',
              answer: 'Les raisons peuvent être : solde insuffisant, carte expirée, limite de sécurité dépassée ou problème technique temporaire.'
            },
            {
              question: 'Mon argent a-t-il été débité ?',
              answer: 'Si le paiement a été refusé, aucun débit n\'est effectué. Vérifiez votre relevé bancaire ou contactez votre opérateur.'
            },
            {
              question: 'Combien de temps pour réessayer ?',
              answer: 'Vous pouvez réessayer immédiatement. Si le problème persiste, attendez 30 minutes.'
            },
            {
              question: 'Comment obtenir un remboursement ?',
              answer: 'Contactez notre support avec votre référence de paiement. Les remboursements sont traités sous 3-5 jours ouvrables.'
            }
          ].map((faq, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3,
                  borderRadius: 2,
                  border: '1px solid #e0e0e0',
                  height: '100%'
                }}
              >
                <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                  {faq.question}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {faq.answer}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default PaymentErrorPage;