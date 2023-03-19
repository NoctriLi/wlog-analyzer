import React from 'react';
import { useTable } from 'react-table';


function CharacterTable({ data, onRowClick }) {
    const data = useMemo(() => data, [data]);
    const columns = useMemo(
      () => [
        {
          Header: "Name",
          accessor: "name"
        },
        {
          Header: "Class",
          accessor: "className"
        },
        {
          Header: "Server",
          accessor: "server"
        },
        {
          Header: "Guild",
          accessor: "guild"
        },
        {
          Header: "Bosses Killed",
          accessor: "ranking"
        }
      ],
      []
    );
  
  
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({ columns, data });
  
  return (
    <table {...getTableProps()} className={styles.table}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroups.getHeaderGroupProps()}>
            {headerGroups.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
  
  }

export default CharacterTable;