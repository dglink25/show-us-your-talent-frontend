import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
  Chip,
  Divider,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  Close as CloseIcon,
  Timeline as TimelineIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

const PALETTE = {
  GOLD: '#D4AF37',
  SUCCESS: '#10B981',
  INFO: '#3B82F6',
  WARNING: '#F59E0B',
  ERROR: '#EF4444',
};

const VotesStatsModal = ({
  open,
  onClose,
  editionId,
  categoryId,
  chartPeriod,
  onChartPeriodChange,
  chartType,
  onChartTypeChange,
  evolutionData,
  chartData,
}) => {
  const theme = useTheme();

  const getTrendIcon = (trend) => {
    switch (trend?.direction) {
      case 'up':
        return <TrendingUpIcon sx={{ color: PALETTE.SUCCESS }} />;
      case 'down':
        return <TrendingDownIcon sx={{ color: PALETTE.ERROR }} />;
      default:
        return <TrendingFlatIcon sx={{ color: PALETTE.WARNING }} />;
    }
  };

  const renderChart = () => {
    if (!chartData || chartData.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="body1" color="text.secondary">
            Aucune donnée disponible pour la période sélectionnée
          </Typography>
        </Box>
      );
    }

    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis dataKey="name" stroke={theme.palette.text.secondary} />
              <YAxis stroke={theme.palette.text.secondary} />
              <RechartsTooltip
                formatter={(value) => [value, 'Votes']}
                labelFormatter={(label) => `Date: ${label}`}
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: theme.shape.borderRadius,
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="votes"
                stroke={PALETTE.GOLD}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="Nombre de votes"
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis dataKey="name" stroke={theme.palette.text.secondary} />
              <YAxis stroke={theme.palette.text.secondary} />
              <RechartsTooltip
                formatter={(value) => [value, 'Votes']}
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: theme.shape.borderRadius,
                }}
              />
              <Legend />
              <Bar
                dataKey="votes"
                fill={PALETTE.GOLD}
                name="Nombre de votes"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis dataKey="name" stroke={theme.palette.text.secondary} />
              <YAxis stroke={theme.palette.text.secondary} />
              <RechartsTooltip
                formatter={(value) => [value, 'Votes']}
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: theme.shape.borderRadius,
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="votes"
                stroke={PALETTE.GOLD}
                fill={`url(#colorVotes)`}
                strokeWidth={2}
                name="Nombre de votes"
              />
              <defs>
                <linearGradient id="colorVotes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={PALETTE.GOLD} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={PALETTE.GOLD} stopOpacity={0} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      scroll="paper"
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TimelineIcon sx={{ color: PALETTE.GOLD }} />
          <Typography variant="h6" fontWeight="bold">
            Statistiques des votes
          </Typography>
          {evolutionData?.edition && (
            <Chip
              label={`${evolutionData.edition.nom}${evolutionData.category ? ` - ${evolutionData.category.nom}` : ''}`}
              size="small"
              sx={{ bgcolor: `${PALETTE.GOLD}20`, color: PALETTE.GOLD }}
            />
          )}
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {/* Tendances */}
        {evolutionData?.trend && (
          <Card sx={{ mb: 3, borderRadius: 2 }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    {getTrendIcon(evolutionData.trend)}
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Tendance
                      </Typography>
                      <Typography variant="h6" fontWeight="bold">
                        {evolutionData.trend.description}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Variation des votes
                    </Typography>
                    <Typography 
                      variant="h6" 
                      fontWeight="bold"
                      color={evolutionData.trend.votes_percentage > 0 ? PALETTE.SUCCESS : PALETTE.ERROR}
                    >
                      {evolutionData.trend.votes_percentage > 0 ? '+' : ''}
                      {evolutionData.trend.votes_percentage}%
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Variation du montant
                    </Typography>
                    <Typography 
                      variant="h6" 
                      fontWeight="bold"
                      color={evolutionData.trend.amount_percentage > 0 ? PALETTE.SUCCESS : PALETTE.ERROR}
                    >
                      {evolutionData.trend.amount_percentage > 0 ? '+' : ''}
                      {evolutionData.trend.amount_percentage}%
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Contrôles du graphique */}
        <Card sx={{ mb: 3, borderRadius: 2 }}>
          <CardContent>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Type de graphique
                </Typography>
                <ToggleButtonGroup
                  value={chartType}
                  exclusive
                  onChange={(e, value) => value && onChartTypeChange(value)}
                  size="small"
                >
                  <ToggleButton value="line">
                    <TimelineIcon fontSize="small" sx={{ mr: 1 }} />
                    Ligne
                  </ToggleButton>
                  <ToggleButton value="bar">
                    <BarChartIcon fontSize="small" sx={{ mr: 1 }} />
                    Barres
                  </ToggleButton>
                  <ToggleButton value="area">
                    <PieChartIcon fontSize="small" sx={{ mr: 1 }} />
                    Zone
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Période
                </Typography>
                <ToggleButtonGroup
                  value={chartPeriod}
                  exclusive
                  onChange={(e, value) => value && onChartPeriodChange(value)}
                  size="small"
                >
                  <ToggleButton value="7days">7 jours</ToggleButton>
                  <ToggleButton value="30days">30 jours</ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Graphique */}
        <Card sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Évolution des votes
            </Typography>
            <Box sx={{ height: 350 }}>
              {renderChart()}
            </Box>
          </CardContent>
        </Card>

        {/* Statistiques détaillées */}
        {evolutionData?.evolution && (
          <Card sx={{ mt: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Résumé détaillé
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Total des votes
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color={PALETTE.GOLD}>
                      {evolutionData.evolution.reduce((sum, item) => sum + item.votes, 0)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Montant total
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color={PALETTE.SUCCESS}>
                      {new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'XOF',
                        minimumFractionDigits: 0,
                      }).format(evolutionData.evolution.reduce((sum, item) => sum + item.amount, 0))}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Moyenne par jour
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color={PALETTE.INFO}>
                      {Math.round(evolutionData.evolution.reduce((sum, item) => sum + item.votes, 0) / evolutionData.evolution.length)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Jours avec votes
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color={PALETTE.WARNING}>
                      {evolutionData.evolution.filter(item => item.votes > 0).length}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
      </DialogContent>

      <DialogActions sx={{ borderTop: `1px solid ${theme.palette.divider}`, p: 2 }}>
        <Button onClick={onClose}>
          Fermer
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            // Exporter les données
            window.open(`/candidat/dashboard/export/votes?edition_id=${editionId}&category_id=${categoryId}`, '_blank');
          }}
          sx={{
            bgcolor: PALETTE.GOLD,
            color: PALETTE.BLACK,
            '&:hover': {
              bgcolor: PALETTE.GOLD_DARK,
            }
          }}
        >
          Exporter les données
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VotesStatsModal;