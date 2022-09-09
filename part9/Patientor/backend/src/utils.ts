import {
  NewPatientEntry,
  Gender,
  EntryType,
  BaseEntry,
  HealthCheckRating,
  HealthCheckEntry,
  HospitalEntry,
  OccupationalHealthcareEntry,
} from './types';

interface BaseEntryOfPatientField {
  description: unknown;
  date: unknown;
  specialist: unknown;
  diagnosisCodes?: unknown;
  type: unknown;
}

interface HealthCheckEntryField extends BaseEntryOfPatientField {
  type: HealthCheckEntry['type'];
  healthCheckRating: unknown;
}

interface OccupationalHealthcareEntryField extends BaseEntryOfPatientField {
  type: OccupationalHealthcareEntry['type'];
  employerName: unknown;
  sickLeave?: {
    startDate: unknown;
    endDate: unknown;
  };
}

interface HospitalEntryField extends BaseEntryOfPatientField {
  type: HospitalEntry['type'];
  discharge: {
    date: unknown;
    criteria: unknown;
  };
}

type EntryField =
  | HealthCheckEntryField
  | OccupationalHealthcareEntryField
  | HospitalEntryField;

const toNewEntryOfPatient = (entry: EntryField) => {
  const newBaseEntry: Omit<BaseEntry, 'id'> = {
    type: parseType(entry.type),
    description: parseDescription(entry.description),
    date: parseDate(entry.date),
    specialist: parseSpecialist(entry.specialist),
  };

  if (entry.diagnosisCodes) {
    newBaseEntry.diagnosisCodes = parseDiagnosisCodes(entry.diagnosisCodes);
  }

  switch (entry.type) {
    case 'HealthCheck':
      const healthCheckEntry: Omit<HealthCheckEntry, 'id'> = {
        ...newBaseEntry,
        type: entry.type,
        healthCheckRating: parseHealthCheckRating(entry.healthCheckRating),
      };
      return healthCheckEntry;
    case 'Hospital':
      const hospitalEntry: Omit<HospitalEntry, 'id'> = {
        ...newBaseEntry,
        type: entry.type,
        discharge: {
          date: parseDate(entry.discharge.date),
          criteria: parseCriteria(entry.discharge.criteria),
        },
      };
      return hospitalEntry;
    case 'OccupationalHealthcare':
      const occupationalHealthcareEntry: Omit<
        OccupationalHealthcareEntry,
        'id'
      > = {
        ...newBaseEntry,
        type: entry.type,
        employerName: parseEmployerName(entry.employerName),
      };
      if (entry.sickLeave) {
        occupationalHealthcareEntry.sickLeave = {
          startDate: parseStartDate(entry.sickLeave.startDate),
          endDate: parseEndDate(entry.sickLeave.endDate),
        };
      }
      return occupationalHealthcareEntry;
  }
};

const parseDescription = (description: unknown): string => {
  if (!description || !isString(description)) {
    throw new Error('Incorrect or missing description');
  }

  return description;
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error('Incorrect or missing date');
  }

  return date;
};

const parseStartDate = (startDate: unknown): string => {
  if (!startDate || !isString(startDate) || !isDate(startDate)) {
    throw new Error('Incorrect or missing startDate');
  }

  return startDate;
};

const parseEndDate = (endDate: unknown): string => {
  if (!endDate || !isString(endDate) || !isDate(endDate)) {
    throw new Error('Incorrect or missing endDate');
  }

  return endDate;
};

const parseSpecialist = (specialist: unknown): string => {
  if (!specialist || !isString(specialist)) {
    throw new Error('Incorrect or missing specialist');
  }

  return specialist;
};

const parseDiagnosisCodes = (diagnosisCodes: unknown): Array<string> => {
  if (!Array.isArray(diagnosisCodes)) {
    throw new Error('Incorrect or missing specialist');
  }

  for (const diagnosisCode of diagnosisCodes) {
    if (!diagnosisCode || !isString(diagnosisCode)) {
      throw new Error('Incorrect or missing specialist');
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return diagnosisCodes;
};

const parseType = (type: unknown): EntryType => {
  if (!type || !isType(type)) {
    throw new Error('Incorrect or missing type');
  }

  return type;
};

const isType = (param: any): param is EntryType => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Object.values(EntryType).includes(param);
};

const parseHealthCheckRating = (
  healthCheckRating: unknown
): HealthCheckRating => {
  if (
    isNaN(Number(healthCheckRating)) ||
    !isHealthCheckRating(healthCheckRating)
  ) {
    throw new Error('Incorrect or missing parseHealthCheckRating');
  }

  return healthCheckRating;
};

const isHealthCheckRating = (param: any): param is HealthCheckRating => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Object.values(HealthCheckRating).includes(param);
};

const parseCriteria = (criteria: unknown): string => {
  if (!criteria || !isString(criteria)) {
    throw new Error('Incorrect or missing criteria');
  }

  return criteria;
};

const parseEmployerName = (employerName: unknown): string => {
  if (!employerName || !isString(employerName)) {
    throw new Error('Incorrect or missing employerName');
  }

  return employerName;
};

type PatientField = {
  name: unknown;
  dateOfBirth: unknown;
  ssn: unknown;
  gender: unknown;
  occupation: unknown;
};

const toNewPatientEntry = ({
  name,
  dateOfBirth,
  ssn,
  gender,
  occupation,
}: PatientField) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call

  const newEntry: NewPatientEntry = {
    name: parseName(name),
    dateOfBirth: parseDateOfBirth(dateOfBirth),
    ssn: parseSsn(ssn),
    gender: parseGender(gender),
    occupation: parseOccupation(occupation),
  };

  return newEntry;
};

const parseName = (name: unknown): string => {
  if (!name || !isString(name)) {
    throw new Error('Incorrect or missing name');
  }

  return name;
};

const parseDateOfBirth = (dateOfBirth: unknown): string => {
  if (!dateOfBirth || !isString(dateOfBirth) || !isDate(dateOfBirth)) {
    throw new Error('Incorrect or missing dateOfBirth');
  }

  return dateOfBirth;
};

const parseSsn = (ssn: unknown): string => {
  if (!ssn || !isString(ssn)) {
    throw new Error('Incorrect or missing ssn');
  }

  return ssn;
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isGender(gender)) {
    throw new Error('Incorrect or missing gender');
  }

  return gender;
};

const parseOccupation = (occupation: unknown): string => {
  if (!occupation || !isString(occupation)) {
    throw new Error('Incorrect or missing occupation');
  }

  return occupation;
};

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const isGender = (param: any): param is Gender => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Object.values(Gender).includes(param);
};

export { toNewPatientEntry, toNewEntryOfPatient };
