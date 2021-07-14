/* eslint-disable prettier/prettier */
// material
import { Box, Grid, Container, Typography } from '@material-ui/core';
// components
import Page from '../components/Page';
import { EditAppointmentForm } from '../components/_dashboard/app';
import AppointmentInfo from '../components/_dashboard/app/AppointmentInfo';

// ----------------------------------------------------------------------

export default function AppointmentDetail() {
  return (
    <Page title="Create Appointment | HotDoc">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Appointment Detail</Typography>
        </Box>
        <Grid>
          <AppointmentInfo />
        </Grid>
      </Container>
    </Page>
  );
}
