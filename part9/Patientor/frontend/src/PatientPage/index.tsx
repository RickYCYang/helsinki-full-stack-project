import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@material-ui/core';
import { apiBaseUrl } from '../constants';
import { EntryTypes, Patient, EntryWithoutId } from '../types';
import { useStateValue } from '../state';
import { putPatientList } from '../state/reducer';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import EntryDetails from '../components/EntryDetails';
import AddEntryModal from '../AddEntryModal';
import { EntryFormValues } from '../AddEntryModal/AddEntryForm';

const PatientPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient>();
  const [{ patients }, dispatch] = useStateValue();

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  useEffect(() => {
    if (id) {
      const patient = patients[id];
      if (patient) {
        setPatient(patient);
      } else {
        void fetchPatientData();
      }
    }
  }, [id, patients]);

  const fetchPatientData = async () => {
    try {
      const { data: patient } = await axios.get<Patient>(
        `${apiBaseUrl}/patients/${id || ''}`
      );
      dispatch(putPatientList(patient));
    } catch (e) {
      console.error(e);
    }
  };

  const prepareEntry = (values: EntryFormValues): EntryWithoutId => {
    const entry = {
      type: values.type,
      description: values.description,
      date: values.date,
      specialist: values.specialist,
    } as EntryWithoutId;

    if (values.diagnosisCodes) {
      entry.diagnosisCodes = values.diagnosisCodes;
    }

    if (
      values.type === EntryTypes.Hospital &&
      entry.type === EntryTypes.Hospital
    ) {
      entry.discharge = {
        date: values.dischargeDate,
        criteria: values.dischargeCriteria,
      };
    }

    if (
      values.type === EntryTypes.HealthCheck &&
      entry.type === EntryTypes.HealthCheck
    ) {
      entry.healthCheckRating = values.healthCheckRating;
    }

    if (
      values.type === EntryTypes.OccupationalHealthcare &&
      entry.type === EntryTypes.OccupationalHealthcare
    ) {
      entry.employerName = values.employerName;
      if (values.sickLeaveStartDate && values.sickLeaveEndDate) {
        entry.sickLeave = {
          startDate: values.sickLeaveStartDate,
          endDate: values.sickLeaveEndDate,
        };
      }
    }

    return entry;
  };

  const submitNewEntry = async (values: EntryFormValues) => {
    if (!id) return;

    const entry = prepareEntry(values);
    try {
      const { data: updatedPatient } = await axios.post<Patient>(
        `${apiBaseUrl}/patients/${id}/entries`,
        entry
      );
      dispatch(putPatientList(updatedPatient));
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

  return (
    <div>
      <h1>Patientor</h1>
      {patient && (
        <>
          <h2>
            {patient.name}
            {patient.gender === 'male' ? <MaleIcon /> : <FemaleIcon />}
          </h2>
          <p style={{ margin: '0px' }}>ssn: {patient.ssn}</p>
          <p style={{ margin: '0px' }}>occupation: {patient.occupation}</p>
          {patient.entries.length > 0 && (
            <>
              <h3>entries</h3>
              {patient.entries.map((entry) => {
                return <EntryDetails key={entry.id} entry={entry} />;
              })}
            </>
          )}
        </>
      )}
      <AddEntryModal
        modalOpen={modalOpen}
        onSubmit={(values: EntryFormValues) => void submitNewEntry(values)}
        //onSubmit={submitNewPatient}
        error={error}
        onClose={closeModal}
      />
      <Button variant="contained" onClick={() => openModal()}>
        Add New Entry
      </Button>
    </div>
  );
};

export default PatientPage;
