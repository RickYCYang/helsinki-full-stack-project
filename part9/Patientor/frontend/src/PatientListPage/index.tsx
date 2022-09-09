import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Table, Button, TableHead, Typography } from '@material-ui/core';

import { PatientFormValues } from '../AddPatientModal/AddPatientForm';
import AddPatientModal from '../AddPatientModal';
import { Patient } from '../types';
import { apiBaseUrl } from '../constants';
import HealthRatingBar from '../components/HealthRatingBar';
import { useStateValue } from '../state';
import { addPatient } from '../state/reducer';
import { TableCell, TableRow, TableBody } from '@material-ui/core';

const PatientListPage = () => {
  const navigate = useNavigate();
  const [{ patients }, dispatch] = useStateValue();

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewPatient = async (values: PatientFormValues): Promise<void> => {
    try {
      const { data: newPatient } = await axios.post<Patient>(
        `${apiBaseUrl}/patients`,
        values
      );
      dispatch(addPatient(newPatient));
      closeModal();
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        //console.error(e?.response?.data?.error || 'Unrecognized axios error');
        console.error(e || 'Unrecognized axios error');
        // setError(
        //   String(e?.response?.data?.error) || 'Unrecognized axios error'
        // );
        setError(String(e) || 'Unrecognized axios error');
      } else {
        console.error('Unknown error', e);
        setError('Unknown error');
      }
    }
  };

  const redirectToPatientPageById = (id: string): void => {
    navigate(`/${id}`);
  };

  return (
    <div className="App">
      <Box>
        <Typography align="center" variant="h6">
          Patient list
        </Typography>
      </Box>
      <Table style={{ marginBottom: '1em' }}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Gender</TableCell>
            <TableCell>Occupation</TableCell>
            <TableCell>Health Rating</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.values(patients).map((patient: Patient) => (
            <TableRow key={patient.id}>
              <TableCell
                style={{ cursor: 'pointer' }}
                onClick={() => redirectToPatientPageById(patient.id)}
              >
                {patient.name}
              </TableCell>
              <TableCell>{patient.gender}</TableCell>
              <TableCell>{patient.occupation}</TableCell>
              <TableCell>
                <HealthRatingBar showText={false} rating={1} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <AddPatientModal
        modalOpen={modalOpen}
        onSubmit={(values: PatientFormValues) => void submitNewPatient(values)}
        //onSubmit={submitNewPatient}
        error={error}
        onClose={closeModal}
      />
      <Button variant="contained" onClick={() => openModal()}>
        Add New Patient
      </Button>
    </div>
  );
};

export default PatientListPage;
