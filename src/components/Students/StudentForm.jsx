import { useState } from 'react';
import './StudentForm.css';

const EMPTY_STUDENT = { firstName: '', lastName: '', email: '', age: '', gender: '', university: '' };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateStudent(values) {
  const errors = {};
  if (!values.firstName.trim()) errors.firstName = 'El nombre es obligatorio.';
  if (!values.lastName.trim()) errors.lastName = 'El apellido es obligatorio.';
  if (!values.email.trim()) errors.email = 'El correo es obligatorio.';
  else if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = 'Escribe un correo válido.';
  const age = Number(values.age);
  if (values.age === '') errors.age = 'La edad es obligatoria.';
  else if (!Number.isInteger(age) || age < 15 || age > 99) errors.age = 'La edad debe ser un número entre 15 y 99.';
  if (!values.gender) errors.gender = 'Selecciona el género.';
  if (!values.university.trim()) errors.university = 'La universidad es obligatoria.';
  return errors;
}

export default function StudentForm({ initialStudent, submitLabel, onSubmit, onCancel, isSubmitting }) {
  const [values, setValues] = useState(() => ({
    ...EMPTY_STUDENT,
    ...(initialStudent && {
      firstName: initialStudent.firstName ?? '',
      lastName: initialStudent.lastName ?? '',
      email: initialStudent.email ?? '',
      age: initialStudent.age ?? '',
      gender: initialStudent.gender ?? '',
      university: initialStudent.university ?? '',
    }),
  }));
  const [errors, setErrors] = useState({});

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validateStudent(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    onSubmit({
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim(),
      age: Number(values.age),
      gender: values.gender,
      university: values.university.trim(),
    });
  };

  const renderError = (field) => errors[field] && <span className="field-error">{errors[field]}</span>;

  return (
    <form className="student-form" onSubmit={handleSubmit} noValidate>
      <div className="form-row">
        <label>
          Nombre
          <input name="firstName" value={values.firstName} onChange={handleFieldChange} />
          {renderError('firstName')}
        </label>
        <label>
          Apellido
          <input name="lastName" value={values.lastName} onChange={handleFieldChange} />
          {renderError('lastName')}
        </label>
      </div>

      <label>
        Correo
        <input name="email" type="email" value={values.email} onChange={handleFieldChange} />
        {renderError('email')}
      </label>

      <div className="form-row">
        <label>
          Edad
          <input name="age" type="number" min="15" max="99" value={values.age} onChange={handleFieldChange} />
          {renderError('age')}
        </label>
        <label>
          Género
          <select name="gender" value={values.gender} onChange={handleFieldChange}>
            <option value="">Selecciona...</option>
            <option value="female">Femenino</option>
            <option value="male">Masculino</option>
          </select>
          {renderError('gender')}
        </label>
      </div>

      <label>
        Universidad
        <input name="university" value={values.university} onChange={handleFieldChange} />
        {renderError('university')}
      </label>

      <div className="modal-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
