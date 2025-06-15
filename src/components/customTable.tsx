const CustomTable = (props:{columns:{name:string,key:string}[], rows:any[], loading:boolean}) => {

  const getConcatKeys = (obj: any, path: string) => {
    return path.split('.').reduce((currentObject, key) => {
      return currentObject ? currentObject[key] : undefined;
    }, obj);
  };

    return (
    <div className="overflow-x-auto rounded-lg shadow-lg">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        {/* Encabezado de la tabla */}
        <thead className="bg-gray-800 text-white">
          <tr>
            {props.columns.map((column, index) => (
              <th key={index} className="py-3 px-4 text-left font-semibold text-sm uppercase">
                {column.name}
              </th>
            ))}
          </tr>
        </thead>
        {/* Cuerpo de la tabla */}
        <tbody>
          {props.loading ? <tr><td>Cargando filas...</td></tr> : ''}
          {props.rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-blue-50 transition duration-150 ease-in-out even:bg-gray-50 border-b border-gray-200">
              {props.columns.map((column:any, colIndex:number) => (
                <td key={colIndex} className="py-3 px-4 text-sm text-gray-800">
                  {getConcatKeys(row, column.key)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CustomTable