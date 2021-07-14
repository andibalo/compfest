/* eslint-disable prettier/prettier */
// material
import { Box, Grid, Container, Typography } from '@material-ui/core';
// components
import Page from '../components/Page';
import { CreateAppointmentForm } from '../components/_dashboard/app';

// ----------------------------------------------------------------------

export default function CreateAppointment() {
  return (
    <Page title="Create Appointment | HotDoc">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Create Doctor Appointment</Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <CreateAppointmentForm />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
