/* eslint-disable prettier/prettier */
import * as Yup from 'yup';
import { useState } from 'react';
import { Icon } from '@iconify/react';
import { useFormik, Form, FormikProvider } from 'formik';
import { useNavigate } from 'react-router-dom';
// material
import { Stack, TextField, MenuItem, Snackbar } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import MuiAlert from '@material-ui/lab/Alert';
import axios from 'axios';
import { axiosInstance } from '../../../utils/axiosInstance';

// ----------------------------------------------------------------------

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function CreateAppointmentForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [alert, setAlert] = useState({
    severity: 'success',
    message: 'Appointment successfully created!'
  });

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
      const res = await axiosInstance.post('/api/appointment', data);

      console.log(res);
      // setAlert({
      //   severity: 'success',
      //   message: 'Appointment Successfully created!'
      // });
      resetForm();

      setSubmitting(false);
    } catch (error) {
      console.log(error);

      setSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      doctorName: '',
      appointmentDate: '',
      appointmentDescription: '',
      maxRegistrants: 1
    },
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
            label="Doctor's Name"
            {...getFieldProps('doctorName')}
            error={Boolean(touched.doctorName && errors.doctorName)}
            helperText={touched.doctorName && errors.doctorName}
          />
          <TextField
            fullWidth
            variant="outlined"
            select
            label="Maximum Registrants"
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
            multiline
            rows={4}
            {...getFieldProps('appointmentDescription')}
            error={Boolean(touched.appointmentDescription && errors.appointmentDescription)}
            helperText={touched.appointmentDescription && errors.appointmentDescription}
          />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Create
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
