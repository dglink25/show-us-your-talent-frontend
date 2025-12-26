import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from '../../utils/axiosConfig';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  LinearProgress,
  Alert,
  IconButton
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  HowToVote as VoteIcon,
  People as PeopleIcon,
  Event as EventIcon,
  CalendarToday as CalendarIcon,
  MoreVert as MoreIcon
} from '@mui/icons-material';

const PromoteurDashboard = () => {
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();
  const [editions, setEditions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalEditions: 0,
    activeEditions: 0,
    totalCandidatures: 0,
    pendingCandidatures: 0
  });

  useEffect(() => {
    // Vérifier si l'utilisateur a le rôle promoteur
    if (user && !hasRole('promoteur')) {
      console.error('User is not a promoteur:', user);
      navigate('/dashboard');
      return;
    }

    fetchEditions();
    fetchStats();
  }, [user, hasRole, navigate]);

  const fetchEditions = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching promoteur editions...');
      
      // Essayer différentes routes possibles
      let response;
      let endpoint = '';
      
      // Route 1: /promoteur/editions (standard)
      try {
        endpoint = '/promoteur/editions';
        response = await axios.get(endpoint);
        console.log('Route /promoteur/editions response:', response.data);
      } catch (apiError) {
        console.log('Route 1 failed, trying route 2...');
        
        // Route 2: /promoteur/my-editions
        try {
          endpoint = '/promoteur/my-editions';
          response = await axios.get(endpoint);
          console.log('Route /promoteur/my-editions response:', response.data);
        } catch (apiError2) {
          console.log('Route 2 failed, trying route 3...');
          
          // Route 3: /editions?promoteur_id=xxx
          try {
            endpoint = `/editions?promoteur_id=${user?.id}`;
            response = await axios.get(endpoint);
            console.log('Route /editions response:', response.data);
          } catch (apiError3) {
            console.log('All API routes failed, using demo data');
            throw new Error('API routes unavailable');
          }
        }
      }
      
      // Traiter la réponse selon différents formats possibles
      let editionsData = [];
      
      if (response.data.success) {
        // Format 1: response.data.data
        if (response.data.data && Array.isArray(response.data.data)) {
          editionsData = response.data.data;
        } 
        // Format 2: response.data.editions
        else if (response.data.editions && Array.isArray(response.data.editions)) {
          editionsData = response.data.editions;
        }
        // Format 3: response.data (direct array)
        else if (Array.isArray(response.data)) {
          editionsData = response.data;
        }
        
        console.log('Processed editions data:', editionsData);
        setEditions(editionsData);
      } else {
        throw new Error(response.data.message || 'Erreur inconnue');
      }
      
    } catch (error) {
      console.error('Error fetching editions:', error);
      setError('Impossible de charger les éditions: ' + error.message);
      
      // Données de démonstration pour le développement
      if (process.env.NODE_ENV === 'development') {
        console.log('Loading demo data...');
        const demoEditions = getDemoEditions();
        setEditions(demoEditions);
        setError('API non disponible - Affichage des données de démonstration');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Récupérer les statistiques
      // Vous pouvez créer une route API spécifique pour cela
      // Pour l'instant, calculer à partir des données locales
      const totalEditions = editions.length;
      const activeEditions = editions.filter(e => e.statut === 'active').length;
      
      // Simuler des statistiques
      setTimeout(() => {
        setStats({
          totalEditions,
          activeEditions,
          totalCandidatures: 156,
          pendingCandidatures: 23
        });
      }, 500);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const getDemoEditions = () => {
    return [
      {
        id: 1,
        nom: 'SHOW US YOUR TALENT 2024',
        annee: '2024',
        numero_edition: '1',
        statut: 'active',
        phase_actuelle: 'votation',
        inscriptions_ouvertes: true,
        votes_ouverts: true,
        nombre_candidatures: 45,
        date_debut: '2024-01-15',
        date_fin: '2024-03-15',
        description: 'Édition principale 2024',
        created_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 2,
        nom: 'Talent Spring Edition',
        annee: '2024',
        numero_edition: '2',
        statut: 'brouillon',
        phase_actuelle: 'preparation',
        inscriptions_ouvertes: false,
        votes_ouverts: false,
        nombre_candidatures: 0,
        date_debut: '2024-04-01',
        date_fin: '2024-06-30',
        description: 'Édition spéciale printemps',
        created_at: '2024-02-01T00:00:00Z'
      },
      {
        id: 3,
        nom: 'Urban Talent Show',
        annee: '2024',
        numero_edition: '3',
        statut: 'terminee',
        phase_actuelle: 'cloture',
        inscriptions_ouvertes: false,
        votes_ouverts: false,
        nombre_candidatures: 78,
        date_debut: '2023-11-01',
        date_fin: '2024-01-31',
        description: 'Édition talents urbains',
        created_at: '2023-10-15T00:00:00Z'
      }
    ];
  };

  const getStatusColor = (statut) => {
    switch(statut?.toLowerCase()) {
      case 'active': return 'success';
      case 'brouillon': return 'warning';
      case 'terminee': return 'default';
      case 'en_cours': return 'info';
      default: return 'default';
    }
  };

  const getStatusLabel = (statut) => {
    switch(statut?.toLowerCase()) {
      case 'active': return 'Active';
      case 'brouillon': return 'Brouillon';
      case 'terminee': return 'Terminée';
      case 'en_cours': return 'En cours';
      default: return statut || 'Inconnu';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non définie';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR');
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          <LinearProgress />
          <Typography sx={{ mt: 2, textAlign: 'center' }}>
            Chargement de votre espace promoteur...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <div className="promoteur-dashboard">
      {/* En-tête */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}>
          Tableau de bord Promoteur
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Bienvenue, {user?.prenoms} {user?.nom} • Gérez vos éditions et candidatures
        </Typography>
      </Box>

      {/* Message d'erreur */}
      {error && (
        <Alert severity={error.includes('démonstration') ? 'warning' : 'error'} sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Statistiques */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EventIcon sx={{ color: 'primary.main', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Éditions
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {stats.totalEditions}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Total • {stats.activeEditions} active(s)
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PeopleIcon sx={{ color: 'success.main', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Candidatures
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                {stats.totalCandidatures}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Total • {stats.pendingCandidatures} en attente
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <VoteIcon sx={{ color: 'warning.main', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Votes
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                {editions.reduce((acc, edition) => acc + (edition.votes_count || 0), 0)}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Votes totaux
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarIcon sx={{ color: 'info.main', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Échéances
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                {editions.filter(e => new Date(e.date_fin) > new Date()).length}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Éditions en cours
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* En-tête des éditions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Mes Éditions
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/promoteur/editions/nouvelle')}
          sx={{
            bgcolor: 'primary.main',
            '&:hover': { bgcolor: 'primary.dark' }
          }}
        >
          Nouvelle édition
        </Button>
      </Box>

      {/* Liste des éditions */}
      {editions.length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
            Aucune édition créée
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
            Commencez par créer votre première édition pour organiser un talent show
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/promoteur/editions/nouvelle')}
          >
            Créer ma première édition
          </Button>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {editions.map((edition) => (
            <Grid item xs={12} md={6} lg={4} key={edition.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  {/* En-tête de l'édition */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                        {edition.nom}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Édition {edition.numero_edition} • {edition.annee}
                      </Typography>
                    </Box>
                    <Chip
                      label={getStatusLabel(edition.statut)}
                      color={getStatusColor(edition.statut)}
                      size="small"
                    />
                  </Box>

                  {/* Description */}
                  <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                    {edition.description || 'Aucune description'}
                  </Typography>

                  {/* Dates */}
                  <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="caption" sx={{ minWidth: 80, color: 'text.secondary' }}>
                        Début:
                      </Typography>
                      <Typography variant="body2">
                        {formatDate(edition.date_debut)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="caption" sx={{ minWidth: 80, color: 'text.secondary' }}>
                        Fin:
                      </Typography>
                      <Typography variant="body2">
                        {formatDate(edition.date_fin)}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Statistiques */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {edition.nombre_candidatures || 0}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Candidatures
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {edition.votes_count || 0}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Votes
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Chip
                        label={edition.inscriptions_ouvertes ? 'Ouvert' : 'Fermé'}
                        size="small"
                        color={edition.inscriptions_ouvertes ? 'success' : 'default'}
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <Button
                      size="small"
                      startIcon={<ViewIcon />}
                      onClick={() => navigate(`/promoteur/editions/${edition.id}`)}
                    >
                      Voir
                    </Button>
                    
                    {edition.statut === 'brouillon' && (
                      <Button
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => navigate(`/promoteur/editions/${edition.id}/modifier`)}
                        variant="outlined"
                      >
                        Modifier
                      </Button>
                    )}
                    
                    <IconButton size="small">
                      <MoreIcon />
                    </IconButton>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Actions rapides */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
          Actions rapides
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/promoteur/editions/nouvelle')}
              sx={{ height: 56 }}
            >
              Nouvelle édition
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<PeopleIcon />}
              onClick={() => navigate('/promoteur/editions')}
              sx={{ height: 56 }}
            >
              Gérer les éditions
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<VoteIcon />}
              onClick={() => navigate('/promoteur/candidatures')}
              sx={{ height: 56 }}
            >
              Voir candidatures
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate('/profile')}
              sx={{ height: 56 }}
            >
              Mon profil
            </Button>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default PromoteurDashboard;