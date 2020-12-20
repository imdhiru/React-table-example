import React, { useEffect, useState } from "react";
import "./styles.css";
import forge from "node-forge";
import axios from "axios";
import Styled from "styled-components";
import {
  useTable,
  useSortBy,
  useBlockLayout,
  usePagination
} from "react-table";

const Div = Styled.div`
  /* This renders the buttons above... Edit me! */
  background:red;
  color: white;
  border: 2px solid white;
  padding:10px;
a{
  color:#fff;
  text-decoration:none;
}
  /* The GitHub button is a primary button
   * edit this to target it specifically! */
  ${(props) =>
    props.primary &&
    css`
      background: white;
      color: black;
    `}
`;
function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize }
  } = useTable(
    {
      columns,
      data,
      initialState: {
        sortBy: [
          {
            id: "id",
            desc: false
          }
        ]
      }
    },
    useSortBy,
    useBlockLayout,
    usePagination
  );

  // Render the UI for your table
  return (
    <>
      <Div>
        <a href="https://bloginstall.com">Bloginstall.com</a>
      </Div>
      <table {...getTableProps()} className="tableWrap">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="text-center"
                >
                  {column.render("Header")}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="pagination row">
        <div className="col">
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {"<<"}
          </button>{" "}
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            {"<"}
          </button>{" "}
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            {">"}
          </button>{" "}
          <button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            {">>"}
          </button>{" "}
        </div>
        <div className="col">
          <span>
            Page{" "}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{" "}
          </span>
          <span>
            | Go to page:{" "}
            <input
              type="number"
              defaultValue={pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
              style={{ width: "100px" }}
            />
          </span>
        </div>
        <div className="col">
          {" "}
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
}

export default function App() {
  const [posts, setPosts] = useState([]);
  const [count, setcount] = useState([]);
  useEffect(() => {
    (async () => {
      const result = await axios(
        "https://91vx1sgecl.execute-api.us-east-2.amazonaws.com/dev/account_certificates?account_id=xyzzy"
      );
      setPosts(result.data);
      setcount(result.data.length);

      var pki = forge.pki;
      const a =
        "MIIEZDCCA0ygAwIBAgIQASfOHhX+B/Plb0WiO6WlrzANBgkqhkiG9w0BAQsFADBSMQswCQYDVQQGEwJCRTEZMBcGA1UEChMQR2xvYmFsU2lnbiBudi1zYTEoMCYGA1UEAxMfR2xvYmFsU2lnbiBOb24tUHVibGljIEhWQ0EgRGVtbzAeFw0xODExMDkyMjQxMTNaFw0xODExMTAyMjQxMTNaMDMxHzAdBgNVBAoMFkdsb2JhbFNpZ24gRW5naW5lZXJpbmcxEDAOBgNVBAMMB2pvaG5kb2UwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDIBc4proccz63t4dhJV+ec5ic2M6vf9QR4T61JavaUfxWAsbW9DvWhFgu0B43xITk4E801Fnw6aqicl/gwcz0KoNAuxwMMGtHCPvd+O7RIV5P+Q6l4rXjty8B4L6xldGa4ZcM0H1ztFELKxg3tHuprBKkQ8q+yDvUIyQKAQrzu4WStTDSVdnaeHWZtMOYk778kkkCNnWl/wB8u9oHIDu4qth3xI5ilNpDkNrNmyyp6yU2l/bAroKk/5q4j8ELlYRndPc/b6E/uaItG1ETIn74wCmjSBozKnWW+u5/+9p4ktkPu9ivxcBdSsUi/xC/cbD68Eyt3FRF7ttgDaQrIIhYvAgMBAAGjggFTMIIBTzAdBgNVHQ4EFgQUm497kAyR4Mg0lXSKuHlwjMDhhHkwDgYDVR0PAQH/BAQDAgOoMIGWBggrBgEFBQcBAQSBiTCBhjA8BggrBgEFBQcwAYYwaHR0cDovL29jc3AuZ2xvYmFsc2lnbi5jb20vY2EvZ3NucGh2Y2FkZW1vc2hhMmczMEYGCCsGAQUFBzAChjpodHRwOi8vc2VjdXJlLmdsb2JhbHNpZ24uY29tL2NhY2VydC9nc25waHZjYWRlbW9zaGEyZzMuY3J0MEQGA1UdHwQ9MDswOaA3oDWGM2h0dHA6Ly9jcmwuZ2xvYmFsc2lnbi5jb20vY2EvZ3NucGh2Y2FkZW1vc2hhMmczLmNybDAJBgNVHRMEAjAAMB8GA1UdIwQYMBaAFGdLB+kJ8fF7Msy9hRxOJw3OocxsMBMGA1UdJQQMMAoGCCsGAQUFBwMCMA0GCSqGSIb3DQEBCwUAA4IBAQBiBoXvMeS/1DR/lRWDaTeVO5LMxGyGEdeBDHlQR6Xdl9vl8w1/9G9rHikybyg+0+nSu5EBZcNvry7y3OrcdgyyJmvaDVgL2qv5urUR3yjLrs3Vt/+czR3z8Z5uOsM8GU0/ZrCPMbcreq2xE2ku3TMojC5pS4/dU/UG92HsMerCztObxqhBVcaz+Ff0peR7OzsUc9Nv4Byn6ascaG2yumc4U32XuoVVpwgAKGLux//HnDtbEKNrJSZfxJgyo6CsRj1QTGin3AaG4wmAln4zUEHAk4h5TM/zrOzz8nPbZz3D1pPK7cvY1ivfuBucCWYFnMRzz3x+ogLc0U48iQbGO5PR";

      var certpem =
        "-----BEGIN CERTIFICATE-----" +
        result.data[0].der +
        "-----END CERTIFICATE-----";
      var cert = pki.certificateFromPem(certpem);
      console.log("certificat not before" + cert.validity.notBefore);
      console.log("certificat not after" + cert.validity.notAfter);
      console.log("certificat serial" + cert.serialNumber);
      console.log("certificat serial" + JSON.stringify(cert));
    })();
  }, []);
  const columns = [
    {
      Header: "Id",
      accessor: "id"
    },
    {
      Header: "Certificate",
      accessor: "url",
      Cell: (e) => <a href={e.value}> Download </a>
    },
    {
      Header: "Certificate Size",
      accessor: (d) => {
        return (
          "-----BEGIN CERTIFICATE-----" + d.der + "-----END CERTIFICATE-----"
        );
      }
    },

    {
      Header: "Indirect Status",
      Cell: (coin) => (
        <span className={coin.is_indirect ? "pos" : "neg"}>
          {coin.is_indirect ? "Yes" : "No"}
        </span>
      )
    },
    {
      Header: "Number",
      accessor: "number"
    },
    {
      Header: "Date",
      accessor: "this_update",
      Cell: (props) => {
        //props.value will contain your date
        //you can convert your date here
        var date = new Date(props.value);

        if (isNaN(date.getFullYear())) {
          return <span>-</span>;
        } else {
          var year = date.getFullYear();
          var month = date.getMonth() + 1;
          var dt = date.getDate();
          const custom_date = dt + "-" + month + "-" + year;
          return <span>{custom_date}</span>;
        }
      }
    },
    {
      Header: "Next Date",
      accessor: "next_update",
      Cell: (props) => {
        //props.value will contain your date
        //you can convert your date here
        var date = new Date(props.value);

        if (isNaN(date.getFullYear())) {
          return <span>-</span>;
        } else {
          var year = date.getFullYear();
          var month = date.getMonth() + 1;
          var dt = date.getDate();
          const custom_date = dt + "-" + month + "-" + year;
          return <span>{custom_date}</span>;
        }
      }
    },
    {
      Header: "Status",
      className: "hello",
      accessor: (d) =>
        d.active ? (
          <span className="active">Active</span>
        ) : (
          <span className="expire">Expired</span>
        )
    }
  ];
  return (
    <div className="App">
      <h1> React-Table example</h1>
      <Table columns={columns} data={posts} />
    </div>
  );
}
