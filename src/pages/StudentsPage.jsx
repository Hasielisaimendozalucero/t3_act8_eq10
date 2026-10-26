import { useEffect, useMemo, useState } from 'react';
import DataTable from '../components/Table/DataTable';
import TableFilters from '../components/Table/TableFilters';
import Pagination from '../components/Table/Pagination';
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from '../constants/appConstants';
import Modal from '../components/Modal/Modal';
import ConfirmDialog from '../components/Modal/ConfirmDialog';
import StudentForm from '../components/Students/StudentForm';
import { useStudents } from '../hooks/useStudents';
import './Pages.css';

const GENDER_OPTIONS = [
  { value: 'female', label: 'Femenino' },
  { value: 'male', label: 'Masculino' },
];
const GENDER_LABELS = Object.fromEntries(GENDER_OPTIONS.map((o) => [o.value, o.label]));

const normalizeText = (text) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const TABLE_COLUMNS = [
  {
    key: 'image',
    header: 'Foto',
    render: (student) =>
      student.image ? (
        <img src={student.image} alt="" className="table-avatar" />
      ) : (
        <div className="table-avatar table-avatar-fallback">{student.firstName?.[0]}</div>
      ),
  },
  { key: 'name', header: 'Nombre', render: (s) => `${s.firstName} ${s.lastName}` },
  { key: 'email', header: 'Correo' },
  { key: 'age', header: 'Edad' },
  { key: 'gender', header: 'Género', render: (s) => GENDER_LABELS[s.gender] ?? s.gender },
  { key: 'university', header: 'Universidad' },
];

export default function StudentsPage({ urlParams, updateUrlParams }) {
  const { students, isLoading, loadError, reloadStudents, handleAddStudent, handleUpdateStudent, handleDeleteStudent } = useStudents();

  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState(null);
  const [pendingEditData, setPendingEditData] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Valores leídos (y validados) desde la URL
  const searchText = urlParams.q ?? '';
  const genderFilter = GENDER_LABELS[urlParams.gender] ? urlParams.gender : '';
  const pageSize = PAGE_SIZE_OPTIONS.includes(Number(urlParams.limit)) ? Number(urlParams.limit) : DEFAULT_PAGE_SIZE;
  const requestedPage = Math.max(1, Number.parseInt(urlParams.page, 10) || 1);

  const filteredStudents = useMemo(() => {
    const search = normalizeText(searchText.trim());
    return students.filter((student) => {
      const fullName = normalizeText(`${student.firstName} ${student.lastName}`);
      const matchesSearch = !search || fullName.includes(search);
      const matchesGender = !genderFilter || student.gender === genderFilter;
      return matchesSearch && matchesGender;
    });
  }, [students, searchText, genderFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / pageSize));
  const currentPage = Math.min(requestedPage, totalPages);
  const visibleStudents = filteredStudents.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Mantiene la URL siempre con page y limit válidos (por ejemplo si se borra el último registro de una página).
  useEffect(() => {
    if (isLoading) return;
    if (String(currentPage) !== urlParams.page || String(pageSize) !== urlParams.limit) {
      updateUrlParams({ page: currentPage, limit: pageSize }, { replace: true });
    }
  }, [isLoading, currentPage, pageSize, urlParams.page, urlParams.limit, updateUrlParams]);

  const handleSearchChange = (text) => updateUrlParams({ q: text, page: 1 }, { replace: true });
  const handleGenderChange = (gender) => updateUrlParams({ gender, page: 1 });
  const handlePageChange = (page) => updateUrlParams({ page });
  const handlePageSizeChange = (limit) => updateUrlParams({ limit, page: 1 });

  const showFeedback = (type, text) => setFeedback({ type, text });

  const submitNewStudent = async (studentData) => {
    setIsProcessing(true);
    try {
      const apiResponse = await handleAddStudent(studentData);
      setIsAddFormOpen(false);
      showFeedback('success', `Alumno «${studentData.firstName} ${studentData.lastName}» agregado. La API respondió con id ${apiResponse?.id}.`);
    } catch (error) {
      showFeedback('error', `No se pudo agregar el alumno: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmEditStudent = async () => {
    setIsProcessing(true);
    try {
      await handleUpdateStudent(studentToEdit, pendingEditData);
      showFeedback('success', `Alumno «${pendingEditData.firstName} ${pendingEditData.lastName}» actualizado correctamente.`);
      setStudentToEdit(null);
    } catch (error) {
      showFeedback('error', `No se pudo editar el alumno: ${error.message}`);
    } finally {
      setPendingEditData(null);
      setIsProcessing(false);
    }
  };

  const confirmDeleteStudent = async () => {
    setIsProcessing(true);
    try {
      await handleDeleteStudent(studentToDelete);
      showFeedback('success', `Alumno «${studentToDelete.firstName} ${studentToDelete.lastName}» eliminado.`);
    } catch (error) {
      showFeedback('error', `No se pudo eliminar el alumno: ${error.message}`);
    } finally {
      setStudentToDelete(null);
      setIsProcessing(false);
    }
  };

  const renderRowActions = (student) => (
    <div className="row-actions">
      <button type="button" className="row-btn row-btn-edit" onClick={() => setStudentToEdit(student)}>Editar</button>
      <button type="button" className="row-btn row-btn-delete" onClick={() => setStudentToDelete(student)}>Eliminar</button>
    </div>
  );

  return (
    <section>
      <div className="page-header">
        <div>
          <h1 className="page-heading">Lista de alumnos</h1>
          <p className="page-subheading">Consulta, filtra y administra a los alumnos registrados.</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setIsAddFormOpen(true)} disabled={isLoading || !!loadError}>
          + Agregar alumno
        </button>
      </div>

      {feedback && (
        <div className={`feedback feedback-${feedback.type}`}>
          <span>{feedback.text}</span>
          <button type="button" onClick={() => setFeedback(null)} aria-label="Cerrar mensaje">×</button>
        </div>
      )}

      <TableFilters
        searchText={searchText}
        selectedCategory={genderFilter}
        categoryOptions={GENDER_OPTIONS}
        categoryLabel="Género"
        onSearchChange={handleSearchChange}
        onCategoryChange={handleGenderChange}
      />

      {isLoading && (
        <div className="status-box">
          <div className="spinner" />
          Cargando alumnos...
        </div>
      )}

      {!isLoading && loadError && (
        <div className="status-box status-error">
          <p>No se pudieron cargar los alumnos: {loadError}</p>
          <button type="button" className="btn btn-danger" onClick={reloadStudents}>Reintentar</button>
        </div>
      )}

      {!isLoading && !loadError && (
        <>
          <DataTable
            columns={TABLE_COLUMNS}
            rows={visibleStudents}
            renderActions={renderRowActions}
            emptyMessage="No se encontraron alumnos con esos filtros."
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={filteredStudents.length}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </>
      )}

      {isAddFormOpen && (
        <Modal title="Agregar alumno" onClose={() => !isProcessing && setIsAddFormOpen(false)}>
          <StudentForm
            submitLabel="Agregar"
            isSubmitting={isProcessing}
            onSubmit={submitNewStudent}
            onCancel={() => setIsAddFormOpen(false)}
          />
        </Modal>
      )}

      {studentToEdit && !pendingEditData && (
        <Modal title="Editar alumno" onClose={() => setStudentToEdit(null)}>
          <StudentForm
            initialStudent={studentToEdit}
            submitLabel="Guardar cambios"
            onSubmit={setPendingEditData}
            onCancel={() => setStudentToEdit(null)}
          />
        </Modal>
      )}

      {studentToEdit && pendingEditData && (
        <ConfirmDialog
          title="Confirmar edición"
          message={`¿Seguro que deseas guardar los cambios de «${studentToEdit.firstName} ${studentToEdit.lastName}»?`}
          confirmLabel="Sí, guardar"
          isProcessing={isProcessing}
          onConfirm={confirmEditStudent}
          onCancel={() => {
            // Regresa al formulario conservando lo que el usuario ya había escrito.
            setStudentToEdit((current) => ({ ...current, ...pendingEditData }));
            setPendingEditData(null);
          }}
        />
      )}

      {studentToDelete && (
        <ConfirmDialog
          title="Confirmar eliminación"
          message={`¿Seguro que deseas eliminar a «${studentToDelete.firstName} ${studentToDelete.lastName}»? Esta acción no se puede deshacer.`}
          confirmLabel="Sí, eliminar"
          variant="danger"
          isProcessing={isProcessing}
          onConfirm={confirmDeleteStudent}
          onCancel={() => setStudentToDelete(null)}
        />
      )}
    </section>
  );
}
