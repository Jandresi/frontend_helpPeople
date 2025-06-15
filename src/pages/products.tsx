import CustomTable from '../components/customTable';
import { useEffect, useState } from 'react';
import type { RootState, AppDispatch } from '../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '../redux/slices/productsSlice';
import { createCart } from '../redux/slices/cartSlice';
import Swal from 'sweetalert2';
import { ShoppingCartIcon } from '@heroicons/react/24/solid';
import { getAllCategories } from '../redux/slices/categoriesSlice';

interface productDTO {
  id:number
  name:string
  description:string
  price:number|string
  category_id:string
}

export default function Products() {
  const initialFormState = {
    id: 0,
    name: '',
    description: '',
    price: '',
    category_id: ''
  };
  const columnsTable = [
    {name: 'ID', key: 'id'},
    {name: 'Producto', key: 'name'},
    {name: 'Precio', key: 'price'},
    {name: 'Categoría', key: 'category.category_name'},
    {name: 'Descripción', key: 'description'},
    {name: 'Acciones', key: 'actions'},
  ]
  const [form, setForm] = useState<productDTO>(initialFormState)
  const [labelTitle, setLabelTitle] = useState('Gestión de productos');
  const [rowsTable, setRowsTable] = useState<any[]>([])
  const dispatch: AppDispatch = useDispatch();
  const listProducts = useSelector((state: RootState) => state.products.products);
  const listCategories = useSelector((state: RootState) => state.categories.categories);
  const loading = useSelector((state: RootState) => state.products.loading);

  const clearForm = () => {
    setLabelTitle('Gestión de productos');
    setForm(initialFormState);
  }

  const handleOnChange = (event:React.ChangeEvent<HTMLInputElement>|React.ChangeEvent<HTMLSelectElement>) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  const handleSubmitForm = async (event:any) => {
    event.preventDefault();
    setForm({
      ...form,
      name: form.name.trim(),
      description: form.description.trim(),
    })

    if(form.name.length < 5 || form.description.length < 5 || Number(form.price) <= 100 || !form.category_id) {
      Swal.fire({
        icon: "warning",
        title: "Advertencia",
        text: "Debe seleccionar una categoría e ingresar un nombre de producto, descripción y precio válidos",
      });
      return;
    }
    
    let saveProccess:any;
    if(form.id) {
      saveProccess = await dispatch(updateProduct({id: form.id, data: form}))
      if (updateProduct.fulfilled.match(saveProccess)) {
        Swal.fire({
          icon: "success",
          title: "Proceso exitoso"
        });
        clearForm();
      } else if (updateProduct.rejected.match(saveProccess)) {
        Swal.fire({
          icon: "error",
          title: "Algo ha fallado",
          text: saveProccess.payload
        });
      }
    }

    else {
      saveProccess = await dispatch(createProduct({data: form}))
      if (createProduct.fulfilled.match(saveProccess)) {
        Swal.fire({
          icon: "success",
          title: "Proceso exitoso"
        });
        clearForm();
      } else if (createProduct.rejected.match(saveProccess)) {
        Swal.fire({
          icon: "error",
          title: "Algo ha fallado",
          text: saveProccess.payload
        });
      }
    }
  }

  const handleUpdate = (product:productDTO) => {
    setLabelTitle('Actualizar categoría ' + name);
    setForm(product);
  }

  const handleDelete = async (id:number) => {
    const deleteProccess = await dispatch(deleteProduct(id))
    if (deleteProduct.fulfilled.match(deleteProccess)) {
      Swal.fire({
        icon: "success",
        title: "Proceso exitoso"
      });
      clearForm();
    } else if (deleteProduct.rejected.match(deleteProccess)) {
      Swal.fire({
        icon: "error",
        title: "Algo ha fallado",
        text: deleteProccess.payload
      });
    }
  }

  const handleCart = async (product_id:number) => {
    const cartProccess = await dispatch(createCart({data: {product_id}}))
    if (createCart.fulfilled.match(cartProccess)) {
      Swal.fire({
        icon: "success",
        title: "Añadido exitosamente"
      });
      clearForm();
    } else if (createCart.rejected.match(cartProccess)) {
      Swal.fire({
        icon: "error",
        title: "Algo falló",
        text: cartProccess.payload
      });
    }
  }

  useEffect(() => {
    dispatch(getAllCategories());
    dispatch(getAllProducts());
  }, [dispatch]);

  useEffect(() => {
    const rows = listProducts.map((res:any, idx:number) => {
      const actions = (<div className='flex item-center gap-3' key={'actions-'+idx}>
        <button
          className='cursor-pointer bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'
          onClick={() => handleUpdate(res)}
        >Editar</button>
        <button
          className='cursor-pointer bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded'
          onClick={() => handleDelete(res.id)}
        >Eliminar</button>
        <button
          className='cursor-pointer bg-transparent hover:bg-orange-500 text-orange-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded flex justify-between gap-2'
          onClick={() => handleCart(res.id)}
        >Añadir <ShoppingCartIcon  className="h-5 w-5"/></button>
      </div>)

      return {...res, actions};
    })
    setRowsTable(rows)
  }, [listProducts])
  
  return (
    <>
    <form className='py-2' onSubmit={handleSubmitForm}>
      <div className="space-y-12">
        <div className="pb-4">
          <h2 className='text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight text-center'>{labelTitle}</h2>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="name" className="block text-sm/6 font-medium text-gray-900">
                Nombre del producto
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={handleOnChange}
                  placeholder='Nombre...'
                  value={form.name}
                />
              </div>
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="price" className="block text-sm/6 font-medium text-gray-900">
                Precio
              </label>
              <div className="mt-2">
                <input
                  id="price"
                  name="price"
                  type="number"
                  autoComplete="price"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={handleOnChange}
                  value={form.price}
                  placeholder='0.0'
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="category_id" className="block text-sm/6 font-medium text-gray-900">
                Categoría
              </label>
              <div className="mt-2">
                <select
                  id="category_id"
                  name="category_id"
                  aria-label="Currency"
                  className="col-start-1 row-start-1 w-full appearance-none rounded-md py-1.5 pr-7 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 bg-white placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={handleOnChange}
                  value={form.category_id}
                >
                  <option value={''}>Seleccionar</option>
                  {listCategories.map((cat:any, idx:number) => <option key={'category_'+idx} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="description" className="block text-sm/6 font-medium text-gray-900">
                Descripción del producto
              </label>
              <div className="mt-2">
                <input
                  id="description"
                  name="description"
                  type="text"
                  autoComplete="description"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={handleOnChange}
                  value={form.description}
                  placeholder='Descripción...'
                  maxLength={100}
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
                >
                  {form.id ? 'Actualizar producto' : 'Crear producto'}
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