import React from "react";
import produce from "immer";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import moment from "moment";
import axios from "../../../shared/helpers/axios-base";
import { textFilter, numberFilter } from "react-bootstrap-table2-filter";
import ReactBootstrapTable from "../../../components/tables/ReactBootstrapTable";
import {
  DeleteAlert,
  ReactSwal
} from "../../../components/SweetAlerts/SweetAlert";

class MedicalRecords extends React.Component {
  constructor(props) {
    super(props);
    props.setTitle("Medical Records - Data");

    this.state = {
      data: []
    };

    // Load data
    this.loadData("/medical").then(data => {
      this.setState({ data });
    });
  }

  async loadData(url) {
    const response = await axios.get(url);
    return response.data;
  }

  handleEdit = (e, id) => {
    e.preventDefault();
    window.location.href = `/add-record?n=${id}`;
  };

  handleDelete = (e, id) => {
    e.preventDefault();
    const self = this;
    DeleteAlert().then(function(result) {
      if (result.value) {
        axios.delete(`/medical/${id}`).then(res => {
          const data = produce(self.state.data, draft => {
            draft.splice(
              draft.findIndex(item => item._id === id),
              1
            );
          });
          self.setState({ data });
          ReactSwal.fire(
            "Deleted!",
            "Your record has been deleted.",
            "success"
          );
        });
      } else {
        ReactSwal.fire("Cancelled", "Your record is safe :)", "error");
      }
    });
  };

  render() {
    const { data } = this.state;
    const columns = [
      {
        text: "ID",
        dataField: "_id",
        sort: true,
        filter: numberFilter({
          comparatorClassName: "custom-select"
        })
      },
      {
        text: "Provider",
        dataField: "provider",
        sort: true,
        filter: textFilter()
      },
      {
        text: "Client",
        dataField: "client",
        sort: true,
        filter: textFilter()
      },
      {
        text: "Req Record Date",
        dataField: "requested.recordDate",
        sort: true,
        // filter: dateFilter(),
        formatter: cell => <div>{cell && moment(cell).format("L")}</div>
      },
      {
        text: "Req Record Affidavit Date",
        dataField: "requested.recordAffidavitDate",
        sort: true,
        // filter: dateFilter(),
        formatter: cell => <div>{cell && moment(cell).format("L")}</div>
      },
      {
        text: "Req Bill Date",
        dataField: "requested.billDate",
        sort: true,
        // filter: dateFilter(),
        formatter: cell => <div>{cell && moment(cell).format("L")}</div>
      },
      {
        text: "Req Bill Affidavit Date",
        dataField: "requested.billAffidavitDate",
        sort: true,
        // filter: dateFilter(),
        formatter: cell => <div>{cell && moment(cell).format("L")}</div>
      },
      {
        text: "Rec Record Date",
        dataField: "received.recordDate",
        sort: true,
        // filter: dateFilter(),
        formatter: cell => <div>{cell && moment(cell).format("L")}</div>
      },
      {
        text: "Rec Record Affidavit Date",
        dataField: "received.recordAffidavitDate",
        sort: true,
        // filter: dateFilter(),
        formatter: cell => <div>{cell && moment(cell).format("L")}</div>
      },
      {
        text: "Rec Bill Date",
        dataField: "received.billDate",
        sort: true,
        // filter: dateFilter(),
        formatter: cell => <div>{cell && moment(cell).format("L")}</div>
      },
      {
        text: "Rec Bill Affidavit Date",
        dataField: "received.billAffidavitDate",
        sort: true,
        // filter: dateFilter(),
        formatter: cell => <div>{cell && moment(cell).format("L")}</div>
      },
      {
        text: "Actions",
        dataField: "_id",
        formatter: cell => (
          <span
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between"
            }}
          >
            <Button variant="warning" onClick={e => this.handleEdit(e, cell)}>
              Edit
            </Button>
            <Button variant="danger" onClick={e => this.handleDelete(e, cell)}>
              Delete
            </Button>
          </span>
        )
      }
    ];

    return (
      <div>
        <h4 className="font-weight-bold py-3 mb-4">
          <span className="text-muted font-weight-light">List /</span> Medical
          Records
        </h4>
        <div className="text-right">
          <Button as={Link} to="/add-record">
            New record
          </Button>
        </div>
        <ReactBootstrapTable columns={columns} data={data} />
      </div>
    );
  }
}

export default MedicalRecords;
