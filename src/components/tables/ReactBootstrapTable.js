import React from "react";
import { Card } from "react-bootstrap";
import ToolkitProvider, {
  Search,
  // ColumnToggle,
  CSVExport
} from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory from "react-bootstrap-table2-filter";
// import cellEditFactory from "react-bootstrap-table2-editor";
import "../../vendor/libs/react-bootstrap-table2/react-bootstrap-table2.scss";

const { SearchBar } = Search;
// const { ToggleList } = ColumnToggle;
const { ExportCSVButton } = CSVExport;

const ReactBootstrapTable = props => {
  const { columns, data } = props;
  const isIE10Mode = document["documentMode"] === 10;

  return (
    <div>
      {isIE10Mode && (
        <div className="alert alert-danger">
          <strong>react-bootstrap-table2</strong> doesn't support Internet
          Explorer 10
        </div>
      )}

      {!isIE10Mode && (
        <React.Fragment>
          <Card className="mb-3 mt-4">
            <Card.Header>Data</Card.Header>
            <ToolkitProvider
              keyField="id"
              data={data}
              columns={columns}
              bootstrap4
              search
              columnToggle
              exportCSV
            >
              {props => (
                <React.Fragment>
                  <div className="row card-body pb-0">
                    <div className="col-md-6 mb-4 mb-md-0">
                      {/* <ToggleList {...props.columnToggleProps} /> */}
                    </div>
                    <div className="col-md-6 d-flex align-items-start justify-content-end">
                      <ExportCSVButton {...props.csvProps} className="mr-2">
                        Export
                      </ExportCSVButton>
                      <SearchBar {...props.searchProps} />
                    </div>
                  </div>
                  <hr />
                  {/* !!! Add .card table class to the table and .react-bs-table-card class to the wrapper */}
                  <BootstrapTable
                    {...props.baseProps}
                    wrapperClasses="table-responsive react-bs-table-card"
                    classes="card-table border-top"
                    pagination={paginationFactory({ classes: "bg-danger" })}
                    // selectRow={{ mode: "checkbox", classes: "table-success" }}
                    filter={filterFactory()}
                    // cellEdit={cellEditFactory({ mode: "click" })}
                  />
                </React.Fragment>
              )}
            </ToolkitProvider>
          </Card>
        </React.Fragment>
      )}
    </div>
  );
};

export default ReactBootstrapTable;
