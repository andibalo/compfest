/* eslint-disable prettier/prettier */
/* eslint-disable camelcase */
import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useFormik, Form, FormikProvider } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';
// material
import { Stack, TextField, MenuItem, Snackbar, CircularProgress } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import MuiAlert from '@material-ui/lab/Alert';
import { axiosInstance } from '../../../utils/axiosInstance';

// ----------------------------------------------------------------------

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function EditAppointmentForm() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  console.log(appointmentId);

  const [appointment, setAppointment] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({
    severity: 'success',
    message: 'Appointment successfully created!'
  });

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

  const RegisterSchema = Yup.object().shape({
    doctorName: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Doctor name is required'),
    appointmentDate: Yup.string().required('Appointment date is required'),
    appointmentDescription: Yup.string()
      .min(2, 'Too Short!')
      .max(250, 'Too Long!')
      .required('Appointment description is required'),
    maxRegistrants: Yup.number().required('Maximum number of registrants is required')
  });

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setIsOpen(false);
  };

  const handleFormSubmit = async (data) => {
    console.log(data);

    try {
      const requestBody = {
        doctor_name: data.doctorName,
        appointment_date: data.appointmentDate,
        appointment_description: data.appointmentDescription,
        max_registrants: data.maxRegistrants,
        registrants_list: data.registrantsList
      };

      const res = await axiosInstance.put(`/api/appointment/${appointmentId}`, requestBody);

      console.log(res);

      resetForm();

      setSubmitting(false);

      navigate('/dashboard/appointment');
    } catch (error) {
      console.log(error);

      setSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues: appointment,
    enableReinitialize: true,
    validationSchema: RegisterSchema,
    onSubmit: (data) => {
      handleFormSubmit(data);
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setSubmitting, resetForm } =
    formik;

  return (
    <FormikProvider value={formik}>
      <Snackbar open={isOpen} autoHideDuration={3500} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          This is a success message!
        </Alert>
      </Snackbar>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            disabled={isLoading || isSubmitting}
            label="Appointment Date"
            type="date"
            {...getFieldProps('appointmentDate')}
            InputLabelProps={{
              shrink: true
            }}
            error={Boolean(touched.appointmentDate && errors.appointmentDate)}
            helperText={touched.appointmentDate && errors.appointmentDate}
          />

          <TextField
            fullWidth
            type="text"
            disabled={isLoading || isSubmitting}
            label="Doctor's Name"
            InputLabelProps={{
              shrink: true
            }}
            {...getFieldProps('doctorName')}
            error={Boolean(touched.doctorName && errors.doctorName)}
            helperText={touched.doctorName && errors.doctorName}
          />

          <TextField
            fullWidth
            variant="outlined"
            disabled={isLoading || isSubmitting}
            select
            value={appointment.maxRegistrants}
            label={`Maximum Registrants (Current Value: ${appointment.maxRegistrants})`}
            {...getFieldProps('maxRegistrants')}
            error={Boolean(touched.maxRegistrants && errors.maxRegistrants)}
            helperText={touched.maxRegistrants && errors.maxRegistrants}
          >
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={5}>5</MenuItem>
          </TextField>

          <TextField
            fullWidth
            type="text"
            label="Appointment Description"
            disabled={isLoading || isSubmitting}
            multiline
            rows={4}
            InputLabelProps={{
              shrink: true
            }}
            {...getFieldProps('appointmentDescription')}
            error={Boolean(touched.appointmentDescription && errors.appointmentDescription)}
            helperText={touched.appointmentDescription && errors.appointmentDescription}
          />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isLoading || isSubmitting}
          >
            Edit
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
