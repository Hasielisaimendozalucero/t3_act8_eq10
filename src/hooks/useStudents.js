import { useEffect, useState } from 'react';
import { createStudent, deleteStudent, getStudents, updateStudent } from '../api/studentsService';

// Maneja la lista de alumnos: carga inicial y acciones CRUD.
// Cada acción hace primero la petición real a la API y después refleja el cambio en el estado local,
// porque DummyJSON simula las escrituras (no las guarda de verdad).
export function useStudents() {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    let isCancelled = false;
    getStudents()
      .then((data) => !isCancelled && setStudents(data))
      .catch((error) => !isCancelled && setLoadError(error.message))
      .finally(() => !isCancelled && setIsLoading(false));
    return () => {
      isCancelled = true;
    };
  }, [reloadCount]);

  const reloadStudents = () => {
    setIsLoading(true);
    setLoadError('');
    setReloadCount((count) => count + 1);
  };

  const handleAddStudent = async (studentData) => {
    const apiResponse = await createStudent(studentData);
    console.log('POST /users/add →', apiResponse);
    // DummyJSON siempre devuelve el mismo id para registros nuevos, así que generamos uno único localmente.
    setStudents((current) => {
      const nextId = Math.max(0, ...current.map((s) => s.id)) + 1;
      return [{ ...apiResponse, ...studentData, id: nextId, isLocal: true }, ...current];
    });
    return apiResponse;
  };

  const handleUpdateStudent = async (student, studentData) => {
    let apiResponse = null;
    try {
      apiResponse = await updateStudent(student.id, studentData);
      console.log(`PUT /users/${student.id} →`, apiResponse);
    } catch (error) {
      // Un alumno creado localmente no existe en DummyJSON: la API responde 404, pero sí lo actualizamos en el estado.
      if (!(student.isLocal && error.status === 404)) throw error;
    }
    setStudents((current) => current.map((s) => (s.id === student.id ? { ...s, ...studentData } : s)));
    return apiResponse;
  };

  const handleDeleteStudent = async (student) => {
    let apiResponse = null;
    try {
      apiResponse = await deleteStudent(student.id);
      console.log(`DELETE /users/${student.id} →`, apiResponse);
    } catch (error) {
      if (!(student.isLocal && error.status === 404)) throw error;
    }
    setStudents((current) => current.filter((s) => s.id !== student.id));
    return apiResponse;
  };

  return {
    students,
    isLoading,
    loadError,
    reloadStudents,
    handleAddStudent,
    handleUpdateStudent,
    handleDeleteStudent,
  };
}
