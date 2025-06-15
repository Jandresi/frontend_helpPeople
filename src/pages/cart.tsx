import CustomTable from '../components/customTable';
import { useEffect, useState } from 'react';
import type { RootState, AppDispatch } from '../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCart, getAllCart } from '../redux/slices/cartSlice';
import Swal from 'sweetalert2';

export default function Cart() {
  const columnsTable = [
    {name: 'Producto', key: 'product.product_name'},
    {name: 'Categoría', key: 'product.category.category_name'},
    {name: 'Precio', key: 'product.price'},
    {name: 'Cantidad', key: 'quantity'},
    {name: 'Acciones', key: 'actions'},
  ]
  const [rowsTable, setRowsTable] = useState<any[]>([])
  const dispatch: AppDispatch = useDispatch();
  const cartList = useSelector((state: RootState) => state.cart.cart)
  const loading = useSelector((state: RootState) => state.cart.loading);

  const handleDelete = async (id:number) => {
    const deleteProccess = await dispatch(deleteCart(id))
    if (deleteCart.fulfilled.match(deleteProccess)) {
      Swal.fire({
        icon: "success",
        title: "Proceso exitoso"
      });
    } else if (deleteCart.rejected.match(deleteProccess)) {
      Swal.fire({
        icon: "error",
        title: "Algo ha fallado",
        text: deleteProccess.payload
      });
    }
  }

  useEffect(() => {
    dispatch(getAllCart());
  }, [dispatch]);

  useEffect(() => {
    const rows = cartList.map((res:any, idx:number) => {
      const actions = (<div className='flex item-center gap-3' key={'actions-'+idx}>
        <button
          className='cursor-pointer bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded'
          onClick={() => handleDelete(res.id)}
        >Quitar</button>
      </div>)

      return {...res, actions};
    })
    setRowsTable(rows)
  }, [cartList])
  
  return (
    <>
    <div className='mt-6'>
      <h2 className='text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight text-center mb-6'>Carrito de compras</h2>
      <CustomTable columns={columnsTable} rows={rowsTable} loading={loading==='pending' ? true : false} />
    </div>
    </>
  )
}