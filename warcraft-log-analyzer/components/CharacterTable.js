import { useMemo } from 'react';
import { useTable } from 'react-table';
import styles from "../styles/Home.module.css";

function CharacterTable({ data, onRowClick }) {
  console.log(data)
  data = data

  const dataH = useMemo(() => data, [data]);
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
          accessor: "ranking.eranog.rank"
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
        
          <tr {...headerGroups[0].getHeaderGroupProps()}>
            {headerGroups[0].headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                console.log(cell)
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