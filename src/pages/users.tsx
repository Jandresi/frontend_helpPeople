import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../redux/store';
import { createUser, createUsersCsv, getAllUsers } from '../redux/slices/usersSlice';
import Swal from 'sweetalert2';
import CustomTable from '../components/customTable';

export default function Users() {
  const initialFormState = {
    email: '',
    username: '',
    password: '',
    csvFile: ''
  };
  const columnsTable = [
    {name: 'ID', key: 'id'},
    {name: 'Nombre de usuario', key: 'username'},
    {name: 'Correo electrónico', key: 'email'},
  ]
  const [form, setForm] = useState(initialFormState)
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const dispatch: AppDispatch = useDispatch();
  const listUsers = useSelector((state: RootState) => state.users.users);
  const loading = useSelector((state: RootState) => state.users.loading);

  const clearForm = () => {
    setForm(initialFormState);
    setCsvFile(null);
  }

  const handleOnChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      csvFile: '',
      [event.target.name]: event.target.value,
    });
    setCsvFile(null)
  }

  const handleSubmitForm = async (event:any) => {
    event.preventDefault();

    if(csvFile) {
      uploadCsvFile();
      return;
    }

    setForm({
      ...form,
      email: form.email.trim(),
      username: form.username.trim(),
      password: form.password.trim(),
    })
    
    if(form.email.length < 5 || form.username.length < 5 || form.password.length < 5) {
      Swal.fire({
        icon: "warning",
        title: "Advertencia",
        text: "Debe ingresar un correo, usuario y contraseña válidos",
      });
      return;
    }
    
    const saveProccess = await dispatch(createUser({data: form}));
    if (createUser.fulfilled.match(saveProccess)) {
      Swal.fire({
        icon: "success",
        title: "Proceso exitoso"
      });
      clearForm();
    } else if (createUser.rejected.match(saveProccess)) {
      Swal.fire({
        icon: "error",
        title: "Algo ha fallado",
        text: saveProccess.payload
      });
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setCsvFile(event.target.files[0]);
      setForm({...initialFormState, csvFile: event.target.value})
    } else {
      setCsvFile(null);
    }
  };
  
  const uploadCsvFile = async () => {
    const formData = new FormData();
    if(csvFile) formData.append('csvFile', csvFile);

    // **Aquí es donde despachas la thunk de Redux y le pasas el FormData**
    const saveProccess = await dispatch(createUsersCsv(formData));

    if (createUsersCsv.fulfilled.match(saveProccess)) {
      Swal.fire({
        icon: "success",
        title: "Proceso exitoso",
      });
      clearForm();
    } else if (createUsersCsv.rejected.match(saveProccess)) {
      Swal.fire({
        icon: "error",
        title: "Algo ha fallado",
        html: saveProccess.payload
      });
    }
  }

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);
  
  return (
    <>
    <form className='py-2' onSubmit={handleSubmitForm}>
      <div className="space-y-12">
        <div className="pb-4">
          <h2 className='text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight text-center'>Creación de usuarios</h2>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-2">
              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                Correo electrónico
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={handleOnChange}
                  value={form.email}
                  placeholder='Correo electrónico...'
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
                Nombre de usuario
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="given-name"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={handleOnChange}
                  value={form.username}
                  placeholder='Nombre...'
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                Contraseña
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="family-name"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={handleOnChange}
                  value={form.password}
                  placeholder='Contraseña...'
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                Subir usuarios desde un archivo .csv <a className='underline' href="/subirUsuarios.csv" target='_blank' download="plantilla_usuarios.csv">(Descargar plantilla)</a>
              </label>
              <div className="mt-2">
                <input
                  id="csvFile"
                  name="csvFile"
                  type="file"
                  accept='.csv'
                  className="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={handleFileChange}
                  value={form.csvFile}
                />
              </div>
            </div>


            <div className="sm:col-span-2">
              <label className="block text-sm/6 font-medium text-gray-900">
                &nbsp;
              </label>
              <div className='mt-2'>
                <button type="button" className="cursor-pointer text-sm/6 font-semibold text-gray-900 mr-4" onClick={clearForm}>
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="cursor-pointer rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  disabled={loading==='pending' ? true : false}
                >
                  Crear usuario
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>

    <div className='mt-6'>
      <CustomTable columns={columnsTable} rows={listUsers} loading={loading==='pending' ? true : false} />
    </div>
    </>
  )
}