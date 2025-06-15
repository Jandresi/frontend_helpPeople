import CustomTable from '../components/customTable';
import { useEffect, useState } from 'react';
import type { RootState, AppDispatch } from '../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCategories, createCategory, updateCategory, deleteCategory } from '../redux/slices/categoriesSlice';
import Swal from 'sweetalert2';

export default function Categories() {
  const initialFormState = {
    id: 0,
    name: '',
  };
  const columnsTable = [
    {name: 'ID', key: 'id'},
    {name: 'Categoría', key: 'name'},
    {name: 'Acciones', key: 'actions'},
  ]
  const [form, setForm] = useState(initialFormState)
  const [labelTitle, setLabelTitle] = useState('Creación de categorías');
  const [rowsTable, setRowsTable] = useState<any[]>([])
  const dispatch: AppDispatch = useDispatch();
  const listCategories = useSelector((state: RootState) => state.categories.categories);
  const loading = useSelector((state: RootState) => state.categories.loading);

  const clearForm = () => {
    setLabelTitle('Creación de categorías');
    setForm(initialFormState);
  }

  const handleOnChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  const handleSubmitForm = async (event:any) => {
    event.preventDefault();
    setForm({...form, name: form.name.trim()})

    if(form.name.length < 5) {
      Swal.fire({
        icon: "warning",
        title: "Advertencia",
        text: "Debe ingresar un nombre de categoría válido",
      });
      return;
    }
    
    let saveProccess:any;
    if(form.id) {
      saveProccess = await dispatch(updateCategory({id: form.id, data: form}))
      if (updateCategory.fulfilled.match(saveProccess)) {
        Swal.fire({
          icon: "success",
          title: "Proceso exitoso"
        });
        clearForm();
      } else if (updateCategory.rejected.match(saveProccess)) {
        Swal.fire({
          icon: "error",
          title: "Algo ha fallado",
          text: saveProccess.payload
        });
      }
    }

    else {
      saveProccess = await dispatch(createCategory({data: form}))
      if (createCategory.fulfilled.match(saveProccess)) {
        Swal.fire({
          icon: "success",
          title: "Proceso exitoso"
        });
        clearForm();
      } else if (createCategory.rejected.match(saveProccess)) {
        Swal.fire({
          icon: "error",
          title: "Algo ha fallado",
          text: saveProccess.payload
        });
      }
    }
  }

  const handleUpdate = (id:number, name:string) => {
    setLabelTitle('Actualizar categoría ' + name);
    setForm({id, name});
  }

  const handleDelete = async (id:number) => {
    const deleteProccess = await dispatch(deleteCategory(id))
    if (deleteCategory.fulfilled.match(deleteProccess)) {
      Swal.fire({
        icon: "success",
        title: "Proceso exitoso"
      });
      clearForm();
    } else if (deleteCategory.rejected.match(deleteProccess)) {
      Swal.fire({
        icon: "error",
        title: "Algo ha fallado",
        text: deleteProccess.payload
      });
    }
  }

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  useEffect(() => {
    const rows = listCategories.map((res:any, idx:number) => {
      const actions = (<div className='flex item-center gap-3' key={'actions-'+idx}>
        <button
          className='cursor-pointer bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'
          onClick={() => handleUpdate(res.id, res.name)}
        >Editar</button>
        <button
          className='cursor-pointer bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded'
          onClick={() => handleDelete(res.id)}
        >Eliminar</button>
      </div>)

      return {...res, actions};
    })
    setRowsTable(rows)
  }, [listCategories])
  
  return (
    <>
    <form className='py-2' onSubmit={handleSubmitForm}>
      <div className="space-y-12">
        <div className="pb-4">
          <h2 className='text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight text-center'>{labelTitle}</h2>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-8">
            <div className="sm:col-span-4">
              <label htmlFor="name" className="block text-sm/6 font-medium text-gray-900">
                Nombre de categoría
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={handleOnChange}
                  value={form.name}
                />
              </div>
            </div>
            
            <div className="sm:col-span-4">
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
                >
                  {form.id ? 'Actualizar categoría' : 'Crear categoría'}
                </button>
              </div>
            </div>
          </div>
        </div>
        
      </div>

      
    </form>

    <div className='mt-6'>
      <CustomTable columns={columnsTable} rows={rowsTable} loading={loading==='pending' ? true : false} />
    </div>
    </>
  )
}