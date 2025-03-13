import React from "react";
import { useTable } from "react-table";
import "./SQLResultTable.css";

const SQLResultTable = ({ data, queryType }) => {
  //console.log(data, queryType);

  const columns = React.useMemo(() => {
    if (data && data.length > 0 && typeof data[0] === "object") {
      return Object.keys(data[0]).map((key) => ({
        Header: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize headers
        accessor: key,
      }));
    }
    return [];
  }, [data]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: data || [],
    });

  if (
    !data ||
    (Array.isArray(data) && data.length === 0) ||
    (!Array.isArray(data) && data.affectedRows !== 0)
  ) {
    switch (queryType) {
      case "SELECT":
        return <p>No data available to display.</p>;
      case "INSERT":
        return <p>Record inserted successfully.</p>;
      case "UPDATE":
        return <p>Record updated successfully.</p>;
      case "DELETE":
        return <p>Record deleted successfully.</p>;
      case "CREATE":
        return <p>Table created successfully.</p>;
      case "ALTER":
        return <p>Table altered successfully.</p>;
      case "DROP":
        return <p>Table dropped successfully.</p>;
      case "TRUNCATE":
        return <p>Table truncated successfully.</p>;
      case "RENAME":
        return <p>Table renamed successfully.</p>;
      default:
        return <p>Query executed successfully.</p>;
    }
  }

  return (
    <table {...getTableProps()} className="data-display-table">
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => (
                <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default SQLResultTable;
