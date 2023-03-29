import { useMemo, useState, useEffect } from 'react';
import { useTable } from 'react-table';
import styles from "../styles/Home.module.css";


function getRankingAverage(ranking){
  
  const sum = [0, 0]

  ranking.forEach(d => {
    if (d[1].rank != "") {
      sum[0] += d[1].rank
      sum[1]++
    }
    
  });
const average = Math.round((sum[0] / sum[1]) * 100 ) / 100;
    console.log(average)
    return average + " / " + sum[1] + " Bosses";



}

function CharacterTable({ data, onRowClick }) {

  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);


  

  const dataH = useMemo(() => data, [data]);

  const columns = useMemo(
    () => [
      {
        Header: '',
        accessor: 'action',
        Cell: props => (
          <button
            className="btn btn-secondary"
            disabled={isButtonDisabled}
            onClick={() => {
              setIsButtonDisabled(true);
              onRowClick(props?.row?.original);
              setTimeout(() => {
            setIsButtonDisabled(false);
          }, 3000);
            }}
          >
            Details
          </button>
        ),
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Class",
        accessor: "className",
      },
      {
        Header: "Server",
        accessor: "server",
      },
      {
        Header: "Guild",
        accessor: "guild",
      },
      {
        Header: "Mythic Average Score",
        accessor: 'ranking',
        Cell: row => `${getRankingAverage(row.row.original.ranking)}`
      }
    ],
    [isButtonDisabled, onRowClick]
  );
  
  
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({ columns, data });
  
  return (
    <table  {...getTableProps()} className="table text-bg-dark m-2">
      <thead>
        
          <tr {...headerGroups[0].getHeaderGroupProps()}>
            {headerGroups[0].headers.map(column => (
              <th className='text-center' {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);
          return (
            <tr  {...row.getRowProps()}>
              {row.cells.map(cell => {
                console.log("GI", cell)
                return <td className='text-center' {...cell.getCellProps()}>{cell.render("Cell")}</td>
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
  
  }

export default CharacterTable;