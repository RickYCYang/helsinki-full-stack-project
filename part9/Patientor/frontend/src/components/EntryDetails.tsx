import React from 'react';
import {
  Entry,
  HospitalEntry,
  OccupationalHealthcareEntry,
  HealthCheckEntry,
  EntryTypes,
} from '../types';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CatchingPokemonIcon from '@mui/icons-material/CatchingPokemon';
import AssistWalkerIcon from '@mui/icons-material/AssistWalker';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
  /**
   * Helper function for exhaustive type checking
   */
  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
  };

  switch (entry.type) {
    case EntryTypes.HealthCheck:
      return <HealthCheckDetail entry={entry} />;
    case EntryTypes.OccupationalHealthcare:
      return <OccupationalHealthcareDetail entry={entry} />;
    case EntryTypes.Hospital:
      return <HospitalDetail entry={entry} />;
    default:
      return assertNever(entry);
  }
};

export default EntryDetails;

const EntryContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div
      style={{
        border: '1px solid black',
        padding: '8px',
        marginBottom: '16px',
      }}
    >
      {children}
    </div>
  );
};

const HospitalDetail: React.FC<{ entry: HospitalEntry }> = ({ entry }) => {
  return (
    <EntryContainer>
      <p>
        {entry.date}
        <LocalHospitalIcon style={{ marginLeft: '8px' }} />
      </p>
      <p style={{ fontStyle: 'italic' }}>{entry.description}</p>
      {entry.diagnosisCodes && (
        <ul>
          {entry.diagnosisCodes.map((code) => (
            <li key={code}>{code}</li>
          ))}
        </ul>
      )}
    </EntryContainer>
  );
};

const OccupationalHealthcareDetail: React.FC<{
  entry: OccupationalHealthcareEntry;
}> = ({ entry }) => {
  return (
    <EntryContainer>
      <p>
        {entry.date}
        <CatchingPokemonIcon style={{ marginLeft: '8px' }} />
        <span style={{ marginLeft: '8px' }}>{entry.employerName}</span>
      </p>
      <p style={{ fontStyle: 'italic' }}>{entry.description}</p>
      <p>diagnose by {entry.specialist}</p>
    </EntryContainer>
  );
};

const HealthCheckDetail: React.FC<{ entry: HealthCheckEntry }> = ({
  entry,
}) => {
  return (
    <EntryContainer>
      <p>
        {entry.date}
        <AssistWalkerIcon style={{ marginLeft: '8px' }} />
      </p>
      <p style={{ fontStyle: 'italic' }}>{entry.description}</p>
      <div>
        <AccountBoxIcon />
      </div>
      <p>diagnose by {entry.specialist}</p>
    </EntryContainer>
  );
};
