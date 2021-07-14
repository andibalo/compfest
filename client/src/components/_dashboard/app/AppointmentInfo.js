/* eslint-disable */
/* eslint-disable camelcase */
import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useFormik, Form, FormikProvider } from 'formik';
import { useParams, Link as RouterLink } from 'react-router-dom';
// material
import {
  Stack,
  TextField,
  MenuItem,
  Snackbar,
  CircularProgress,
  Box,
  Button
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import MuiAlert from '@material-ui/lab/Alert';
import { axiosInstance } from '../../../utils/axiosInstance';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

// ----------------------------------------------------------------------

export default function AppointmentDetail() {
  const { appointmentId } = useParams();

  const [appointment, setAppointment] = useState({});

  const [isLoading, setIsLoading] = useState(false);

  const fetchAppointment = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get(`/api/appointment/${appointmentId}`);

      console.log(res);

      setAppointment({
        appointmentDate: res.data.data.appointment_date,
        maxRegistrants: res.data.data.max_registrants,
        registrantsList: res.data.data.registrants_list,
        doctorName: res.data.data.doctor_name,
        appointmentDescription: res.data.data.appointment_description
      });

      setIsLoading(false);
    } catch (error) {
      console.log(error);

      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointment();
  }, []);

  return (
    <Box>
      <Stack spacing={3}>
        <Box>
          <h3>Appointment Date</h3>
          <p>{appointment.appointmentDate}</p>
        </Box>
        <Box>
          <h3>Doctor's Name</h3>
          <p>{appointment.doctorName}</p>
        </Box>
        <Box>
          <h3>Max Registrants</h3>
          <p>{appointment.maxRegistrants}</p>
        </Box>
        <Box>
          <h3>Appointment Description</h3>
          <p>{appointment.appointmentDescription}</p>
        </Box>
        <Box>
          <h3>Registrants List</h3>

          <List component="nav" aria-label="main mailbox folders">
            {appointment.registrantsList &&
              appointment.registrantsList.map((registrant, index) => {
                return (
                  <ListItem>
                    <ListItemIcon>
                      <h1>{index + 1}.</h1>
                    </ListItemIcon>
                    <Box>
                      <h4>{`${registrant.patient.first_name} ${registrant.patient.last_name}`}</h4>
                      <p>{registrant.patient.email}</p>
                      <p>{`${registrant.patient.age} years old`}</p>
                    </Box>
                  </ListItem>
                );
              })}
          </List>
        </Box>

        <Button
          variant="contained"
          size="large"
          component={RouterLink}
          to={`/dashboard/appointment`}
        >
          Return To Appointment List
        </Button>
      </Stack>
    </Box>
  );
}
