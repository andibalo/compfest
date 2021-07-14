/* eslint-disable  */
/* eslint-disable prettier/prettier */
/* eslint-disable camelcase */
import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import { useState, useEffect, useContext } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import checkmarkCircleFill from '@iconify/icons-eva/checkmark-circle-fill';
import closeCircleOutline from '@iconify/icons-eva/close-circle-outline';
import searchFill from '@iconify/icons-eva/search-fill';
import { Link as RouterLink } from 'react-router-dom';

// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination
} from '@material-ui/core';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../components/_dashboard/user';
import { axiosInstance } from '../utils/axiosInstance';
import { useAuthState } from '../context/Context';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'appointment-date', label: 'Appointment Date', alignRight: false },
  { id: 'doctor-name', label: 'Doctor Name', alignRight: false },
  { id: 'registrants', label: 'Registrants', alignRight: false },
  { id: 'action', label: 'Action', alignRight: false },
  { id: '' }
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (appointment) => appointment.doctor_name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function UserDashboard() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [appointments, setAppointments] = useState([]);

  const user = useAuthState();

  console.log(user);

  const fetchAppointments = async () => {
    try {
      const res = await axiosInstance.get('/api/appointment');

      console.log(res);
      setAppointments(res.data.data.appointments);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleApplyAppointment = async (id) => {
    try {
      const res = await axiosInstance.put(`/api/appointment/register/${id}`, {
        userId: user.userDetails._id
      });

      console.log(res);
      fetchAppointments();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelAppointment = async (id) => {
    try {
      const res = await axiosInstance.put(`/api/appointment/cancel/${id}`, {
        userId: user.userDetails._id
      });

      console.log(res);
      fetchAppointments();
    } catch (error) {
      console.log(error);
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = appointments.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const checkHasPatientApplied = (registrants_list, userId) => {
    let hasPatientApplied = false;
    registrants_list.forEach((registrant) => {
      if (registrant.patient.toString() === userId) {
        hasPatientApplied = true;
      }
    });

    return hasPatientApplied;
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - appointments.length) : 0;

  const filteredUsers = applySortFilter(appointments, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page title="User | Minimal-UI">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Appointment List
          </Typography>
        </Stack>

        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={appointments.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {appointments
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      console.log(row);
                      const {
                        _id,
                        appointment_date,
                        doctor_name,
                        max_registrants,
                        registrants_list
                      } = row;
                      const isItemSelected = selected.indexOf(doctor_name) !== -1;

                      return (
                        <TableRow
                          hover
                          key={_id}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isItemSelected}
                              onChange={(event) => handleClick(event, doctor_name)}
                            />
                          </TableCell>

                          <TableCell align="left">{appointment_date}</TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Avatar alt={doctor_name} />
                              <Typography variant="subtitle2" noWrap>
                                {doctor_name}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left">{`${registrants_list.length}/${max_registrants}`}</TableCell>
                          <TableCell align="left">
                            {checkHasPatientApplied(registrants_list, user.userDetails._id) ? (
                              <Button
                                variant="contained"
                                color="error"
                                onClick={() => handleCancelAppointment(_id)}
                                startIcon={<Icon icon={closeCircleOutline} />}
                              >
                                Cancel Appointment
                              </Button>
                            ) : (
                              <Button
                                variant="contained"
                                onClick={() => handleApplyAppointment(_id)}
                                startIcon={<Icon icon={checkmarkCircleFill} />}
                              >
                                Apply For Appointment
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={appointments.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
