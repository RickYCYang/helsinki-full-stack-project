import React, { useState } from 'react';
import { Grid, Button } from '@material-ui/core';
import { useStateValue } from '../state';
import {
  BaseEntry,
  EntryTypes,
  Gender,
  HealthCheckRating,
  HealthCheckEntry,
  HospitalEntry,
  OccupationalHealthcareEntry,
  UnionOmit,
} from '../types';
import { Field, Formik, Form } from 'formik';
import {
  DiagnosisSelection,
  TextField,
  EntryTypesOptions,
  SelectField,
  NumberField,
} from '../AddPatientModal/FormField';

/*
 * use type Patient, but omit id and entries,
 * because those are irrelevant for new patient object.
 */
//export type EntryFormValues = Omit<BaseEntry, 'id'>;
interface HealthCheckEntryFormValues extends BaseEntry {
  type: HealthCheckEntry['type'];
  healthCheckRating: HealthCheckEntry['healthCheckRating'];
}

interface OccupationalHealthcareEntryFormValues extends BaseEntry {
  type: OccupationalHealthcareEntry['type'];
  employerName: OccupationalHealthcareEntry['employerName'];
  sickLeaveStartDate?: string;
  sickLeaveEndDate?: string;
}

interface HospitalEntryFormValues extends BaseEntry {
  type: HospitalEntry['type'];
  dischargeDate: HospitalEntry['discharge']['date'];
  dischargeCriteria: HospitalEntry['discharge']['criteria'];
}

interface InitFormValues extends BaseEntry {
  type: '';
}

export type EntryFormValues = UnionOmit<
  | InitFormValues
  | HealthCheckEntryFormValues
  | OccupationalHealthcareEntryFormValues
  | HospitalEntryFormValues,
  'id'
>;

interface Props {
  onSubmit: (values: EntryFormValues) => void;
  onCancel: () => void;
}

const typeOptions: EntryTypesOptions[] = [
  { value: EntryTypes.HealthCheck, label: EntryTypes.HealthCheck },
  {
    value: EntryTypes.OccupationalHealthcare,
    label: EntryTypes.OccupationalHealthcare,
  },
  { value: EntryTypes.Hospital, label: EntryTypes.Hospital },
];

const AddEntryForm = ({ onSubmit, onCancel }: Props) => {
  const [{ diagnoses }] = useStateValue();
  const [selectedType, setSelectedType] = useState<
    EntryTypes | Gender | string
  >('');

  const typeHandler = (type: EntryTypes | Gender) => {
    setSelectedType(type);
  };

  return (
    <Formik
      initialValues={{
        type: '',
        description: '',
        date: '',
        specialist: '',
      }}
      onSubmit={onSubmit}
      validate={(values) => {
        //console.log('values', values);
        const requiredError = 'Field is required';
        const errors: { [field: string]: string } = {};
        if (!values.description) {
          errors.description = requiredError;
        }
        if (!values.date) {
          errors.date = requiredError;
        }
        if (!values.specialist) {
          errors.specialist = requiredError;
        }
        if (!values.type) {
          errors.type = requiredError;
        }
        switch (values.type) {
          case EntryTypes.OccupationalHealthcare:
            if (!values.employerName) {
              errors.employerName = requiredError;
            }
            break;
          case EntryTypes.HealthCheck:
            if (!values.healthCheckRating) {
              errors.healthCheckRating = requiredError;
            }
            break;
          case EntryTypes.Hospital:
            if (!values.dischargeDate) {
              errors.dischargeDate = requiredError;
            }
            if (!values.dischargeCriteria) {
              errors.dischargeCriteria = requiredError;
            }
            break;
        }

        return errors;
      }}
    >
      {({ isValid, dirty, setFieldValue, setFieldTouched }) => {
        return (
          <Form className="form ui">
            <Field
              label="Description"
              placeholder="description"
              name="description"
              component={TextField}
            />
            <Field
              label="date"
              placeholder="date"
              name="date"
              component={TextField}
            />
            <Field
              label="specialist"
              placeholder="specialist"
              name="specialist"
              component={TextField}
            />
            <DiagnosisSelection
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              diagnoses={Object.values(diagnoses)}
            />
            <SelectField
              label="Type"
              name="type"
              options={typeOptions}
              onClick={typeHandler}
            />
            {selectedType === EntryTypes.HealthCheck && (
              <Field
                label="healthCheckRating"
                placeholder="healthCheckRating"
                name="healthCheckRating"
                min={HealthCheckRating.Healthy}
                max={HealthCheckRating.CriticalRisk}
                component={NumberField}
              />
            )}
            {selectedType === EntryTypes.Hospital && (
              <>
                <Field
                  label="discharge date"
                  placeholder="discharge date"
                  name="dischargeDate"
                  component={TextField}
                />
                <Field
                  label="discharge criteria"
                  placeholder="discharge criteria"
                  name="dischargeCriteria"
                  component={TextField}
                />
              </>
            )}
            {selectedType === EntryTypes.OccupationalHealthcare && (
              <>
                <Field
                  label="employer name"
                  placeholder="employer name"
                  name="employerName"
                  component={TextField}
                />
                <Field
                  label="sick leave start date"
                  placeholder="sickLeave start date"
                  name="sickLeaveStartDate"
                  component={TextField}
                />
                <Field
                  label="sick leave end date"
                  placeholder="sickLeave end date"
                  name="sickLeaveEndDate"
                  component={TextField}
                />
              </>
            )}
            <Grid>
              <Grid item>
                <Button
                  color="secondary"
                  variant="contained"
                  style={{ float: 'left' }}
                  type="button"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button
                  style={{
                    float: 'right',
                  }}
                  type="submit"
                  variant="contained"
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddEntryForm;
