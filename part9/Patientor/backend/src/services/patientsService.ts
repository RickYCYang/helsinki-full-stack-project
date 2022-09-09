import patients from '../../data/patients';
import {
  PublicPatient,
  NewPatientEntry,
  Patient,
  EntryWithoutId,
} from '../types';
import { v4 as uuid } from 'uuid';

const getNonSensitiveEntries = (): PublicPatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const getPatients = (): Patient[] => patients;

const getPatientById = (id: string): Patient | undefined => {
  const [patient] = patients.filter((patient) => patient.id === id);
  return patient;
};

const addPatient = (entry: NewPatientEntry): Patient => {
  const newPatientEntry = {
    id: uuid(),
    ...entry,
    entries: [],
  };
  patients.push(newPatientEntry);

  return newPatientEntry;
};

const addEntryOfPatient = (userId: string, entry: EntryWithoutId): Patient => {
  /** find the patient */
  const [patient] = patients.filter((p) => p.id === userId);
  if (!patient) throw Error('Patient not found');

  /** add entry to that patient */
  patient.entries.push({
    id: uuid(),
    ...entry,
  });

  return patient;
};

export default {
  getNonSensitiveEntries,
  addPatient,
  getPatientById,
  getPatients,
  addEntryOfPatient,
};
