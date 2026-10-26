import { request } from './httpClient';

// API elegida para la tabla: DummyJSON Users (https://dummyjson.com/users),
// presentada como la lista de alumnos del sistema EduControl.
const USERS_URL = 'https://dummyjson.com/users';
const SELECTED_FIELDS = 'firstName,lastName,email,age,gender,university,image';

export async function getStudents() {
  const data = await request(`${USERS_URL}?limit=0&select=${SELECTED_FIELDS}`);
  return data.users;
}

export function createStudent(studentData) {
  return request(`${USERS_URL}/add`, { method: 'POST', body: studentData });
}

export function updateStudent(studentId, studentData) {
  return request(`${USERS_URL}/${studentId}`, { method: 'PUT', body: studentData });
}

export function deleteStudent(studentId) {
  return request(`${USERS_URL}/${studentId}`, { method: 'DELETE' });
}
