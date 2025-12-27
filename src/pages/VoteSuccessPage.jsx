import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Avatar,
  Chip,
  Divider,
  Card,
  CardContent,
  Alert,
  IconButton,
  Fade,
  Grow,
  Zoom,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon,
  HowToVote as VoteIcon,
  Person as PersonIcon,
  Celebration as CelebrationIcon,
  Email as EmailIcon,
  WhatsApp as WhatsAppIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from '../api/axios';

const VoteSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const paymentData = location.state?.paymentData || {};
  const candidat = location.state?.candidat || {};
  
  const [loading, setLoading] = React.useState(false);
  const [shareOpen, setShareOpen] = React.useState(false);

  useEffect(() => {
    if (!paymentData?.id) {
      navigate('/candidats');
    }
    
    // Envoyer un email de confirmation (à implémenter côté serveur)
    if (paymentData.email) {
      sendConfirmationEmail();
    }
  }, [paymentData, navigate]);

  const sendConfirmationEmail = async () => {
    try {
      await axios.post('/payments/send-confirmation', {
        payment_id: paymentData.id,
        email: paymentData.email
      });
    } catch (error) {
      console.error('Erreur envoi email:', error);
    }
  };

  const handleShare = (platform) => {
    const text = `Je viens de voter pour ${candidat.nom_complet} sur Talents d'Afrique! 🎉 Rejoignez-moi pour soutenir les talents africains!`;
    const url = window.location.origin;
    
    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      default:
        if (navigator.share) {
          navigator.share({
            title: 'J\'ai voté sur Talents d\'Afrique',
            text: text,
            url: url
          });
        }
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleDownloadReceipt = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/payments/receipt/${paymentData.id}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `reçu-${paymentData.reference}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Erreur téléchargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount) => {
    return amount?.toLocaleString('fr-FR') + ' XOF';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Style animations */}
      <style>
        {`
          @keyframes confettiRain {
            0% {
              transform: translateY(-100vh) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) rotate(360deg);
              opacity: 0;
            }
          }
          
          @keyframes float {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }
          
          .confetti {
            position: fixed;
            width: 10px;
            height: 10px;
            background: var(--color);
            top: -10px;
            left: var(--left);
            animation: confettiRain var(--duration) linear infinite;
            z-index: 9999;
          }
          
          @media print {
            .no-print {
              display: none !important;
            }
          }
        `}
      </style>

      {/* Confetti animation */}
      {!isMobile && Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="confetti"
          style={{
            '--color': `hsl(${Math.random() * 360}, 100%, 50%)`,
            '--left': `${Math.random() * 100}vw`,
            '--duration': `${Math.random() * 3 + 2}s`,
            '--delay': `${Math.random() * 2}s`,
          }}
        />
      ))}

      <Fade in={true} timeout={1000}>
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
            <CheckCircleIcon sx={{ 
              fontSize: 100, 
              color: '#4CAF50',
              mb: 3,
              animation: 'float 2s ease-in-out infinite'
            }} />
          </motion.div>
          
          <Typography 
            variant="h3" 
            fontWeight="bold" 
            gutterBottom
            sx={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              mb: 2
            }}
          >
            Félicitations !
          </Typography>
          
          <Typography variant="h5" color="text.secondary" paragraph>
            Votre vote a été enregistré avec succès
          </Typography>
        </Box>
      </Fade>

      <Grid container spacing={4}>
        {/* Carte du candidat */}
        <Grid item xs={12} md={6}>
          <Grow in={true} timeout={800}>
            <Card 
              sx={{ 
                height: '100%',
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: '0 8px 40px rgba(102, 126, 234, 0.15)',
                position: 'relative'
              }}
            >
              <Box
                sx={{
                  height: 100,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  position: 'relative'
                }}
              />
              
              <Box sx={{ p: 3, position: 'relative', mt: -8 }}>
                <Avatar
                  src={candidat.photo}
                  alt={candidat.nom_complet}
                  sx={{
                    width: 120,
                    height: 120,
                    mx: 'auto',
                    mb: 2,
                    border: '4px solid white',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                  }}
                />
                
                <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>
                  {candidat.nom_complet}
                </Typography>
                
                <Typography variant="body1" color="text.secondary" align="center" paragraph>
                  {candidat.categorie_nom}
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3 }}>
                  <Chip 
                    icon={<PersonIcon />}
                    label={candidat.sexe === 'F' ? 'Candidate' : 'Candidat'}
                    size="small"
                    sx={{ 
                      background: 'rgba(102, 126, 234, 0.1)',
                      color: '#667eea'
                    }}
                  />
                  <Chip 
                    icon={<VoteIcon />}
                    label={`${paymentData.votes_count || 1} vote${paymentData.votes_count > 1 ? 's' : ''}`}
                    size="small"
                    sx={{ 
                      background: 'rgba(76, 175, 80, 0.1)',
                      color: '#4CAF50'
                    }}
                  />
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ textAlign: 'center' }}>
                  <CelebrationIcon sx={{ 
                    fontSize: 40, 
                    color: '#FF9800',
                    mb: 1
                  }} />
                  <Typography variant="body2" color="text.secondary">
                    Merci pour votre soutien !
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grow>
        </Grid>

        {/* Détails du paiement */}
        <Grid item xs={12} md={6}>
          <Zoom in={true} timeout={1200}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 4,
                borderRadius: 3,
                border: '1px solid #e0e0e0',
                height: '100%',
                background: '#f8f9fa'
              }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Détails de la transaction
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Référence:
                  </Typography>
                </Grid>
                <Grid item xs={6} textAlign="right">
                  <Typography variant="body2" fontWeight="medium" fontFamily="monospace">
                    {paymentData.reference}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Date:
                  </Typography>
                </Grid>
                <Grid item xs={6} textAlign="right">
                  <Typography variant="body2">
                    {formatDate(paymentData.created_at || new Date())}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Montant total:
                  </Typography>
                </Grid>
                <Grid item xs={6} textAlign="right">
                  <Typography variant="h6" fontWeight="bold" color="#667eea">
                    {formatAmount(paymentData.amount)}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Méthode:
                  </Typography>
                </Grid>
                <Grid item xs={6} textAlign="right">
                  <Typography variant="body2">
                    {paymentData.payment_method === 'mobile_money' ? 'Mobile Money' : 
                     paymentData.payment_method === 'card' ? 'Carte Bancaire' : 
                     'Virement Bancaire'}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Statut:
                  </Typography>
                </Grid>
                <Grid item xs={6} textAlign="right">
                  <Chip 
                    label="Payé"
                    size="small"
                    sx={{ 
                      background: '#4CAF50',
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                </Grid>
              </Grid>
              
              <Alert 
                severity="success" 
                icon={<EmailIcon />}
                sx={{ 
                  borderRadius: 2,
                  mb: 3
                }}
              >
                Un reçu détaillé a été envoyé à {paymentData.email}
              </Alert>
              
              <Box sx={{ mt: 4 }}>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
                  Partager cette réussite
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                  <IconButton
                    onClick={() => handleShare('whatsapp')}
                    sx={{ 
                      background: '#25D366',
                      color: 'white',
                      '&:hover': { background: '#128C7E' }
                    }}
                  >
                    <WhatsAppIcon />
                  </IconButton>
                  
                  <IconButton
                    onClick={() => handleShare('facebook')}
                    sx={{ 
                      background: '#1877F2',
                      color: 'white',
                      '&:hover': { background: '#166FE5' }
                    }}
                  >
                    <FacebookIcon />
                  </IconButton>
                  
                  <IconButton
                    onClick={() => handleShare('twitter')}
                    sx={{ 
                      background: '#1DA1F2',
                      color: 'white',
                      '&:hover': { background: '#1A91DA' }
                    }}
                  >
                    <TwitterIcon />
                  </IconButton>
                  
                  <IconButton
                    onClick={() => handleShare()}
                    sx={{ 
                      background: '#667eea',
                      color: 'white',
                      '&:hover': { background: '#5a6fd8' }
                    }}
                  >
                    <ShareIcon />
                  </IconButton>
                </Box>
              </Box>
            </Paper>
          </Zoom>
        </Grid>
      </Grid>

      {/* Actions */}
      <Box sx={{ mt: 6, display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/candidats')}
          className="no-print"
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
          className="no-print"
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
          Accueil
        </Button>
        
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={handleDownloadReceipt}
          disabled={loading}
          className="no-print"
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
          {loading ? 'Téléchargement...' : 'Télécharger le reçu'}
        </Button>
        
        <Button
          variant="contained"
          startIcon={<PrintIcon />}
          onClick={handlePrintReceipt}
          className="no-print"
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 2,
            background: '#4CAF50',
            '&:hover': { background: '#45a049' }
          }}
        >
          Imprimer le reçu
        </Button>
      </Box>

      {/* Section reçu pour impression */}
      <Box sx={{ display: 'none' }}>
        <div id="receipt-print">
          <Box sx={{ p: 4, maxWidth: 800, margin: '0 auto' }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom align="center">
              Reçu de paiement
            </Typography>
            
            <Typography variant="h6" align="center" color="text.secondary" gutterBottom>
              Talents d'Afrique - Édition {edition?.nom}
            </Typography>
            
            <Divider sx={{ my: 3 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Référence:
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {paymentData.reference}
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Date:
                </Typography>
                <Typography variant="body1">
                  {formatDate(paymentData.created_at)}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Candidat:
                </Typography>
                <Typography variant="h6">
                  {candidat.nom_complet}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {candidat.categorie_nom}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Détails du paiement
                </Typography>
                
                <Box sx={{ 
                  p: 2, 
                  bgcolor: '#f5f5f5', 
                  borderRadius: 1,
                  border: '1px solid #e0e0e0'
                }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        Nombre de votes:
                      </Typography>
                    </Grid>
                    <Grid item xs={6} textAlign="right">
                      <Typography variant="body2">
                        {paymentData.votes_count}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        Montant unitaire:
                      </Typography>
                    </Grid>
                    <Grid item xs={6} textAlign="right">
                      <Typography variant="body2">
                        {formatAmount(100)}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="body2" fontWeight="medium">
                        Total:
                      </Typography>
                    </Grid>
                    <Grid item xs={6} textAlign="right">
                      <Typography variant="h6" fontWeight="bold">
                        {formatAmount(paymentData.amount)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4 }}>
                  Ce reçu a été généré automatiquement.
                  <br />
                  Merci pour votre soutien aux talents africains !
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </div>
      </Box>
    </Container>
  );
};

export default VoteSuccessPage;