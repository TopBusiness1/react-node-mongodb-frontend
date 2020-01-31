import React from "react";
import produce from "immer";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import {
  textFilter,
  selectFilter,
  numberFilter
} from "react-bootstrap-table2-filter";
import { Type } from "react-bootstrap-table2-editor";
import axios from "../../../shared/helpers/axios-base";
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
    this.loadData("/contacts").then(data => {
      this.setState({ data });
    });
  }

  async loadData(url) {
    const response = await axios.get(url);
    return response.data;
  }

  handleEdit = (e, id) => {
    e.preventDefault();
    window.location.href = `/add-contact?n=${id}`;
  };

  handleDelete = (e, id) => {
    e.preventDefault();
    const self = this;
    DeleteAlert().then(function(result) {
      if (result.value) {
        axios.delete(`/contacts/${id}`).then(res => {
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
        text: "First Name",
        dataField: "name.first",
        sort: true,
        filter: textFilter()
      },
      {
        text: "Last Name",
        dataField: "name.last",
        sort: true,
        filter: textFilter()
      },
      {
        text: "Gender",
        dataField: "biography.gender",
        sort: true,
        filter: selectFilter({
          options: {
            male: "Male",
            female: "Female"
          },
          className: "custom-select"
        }),
        editor: {
          type: Type.SELECT,
          options: [
            { value: "male", label: "Male" },
            { value: "female", label: "Female" }
          ]
        }
      },
      {
        text: "Company",
        dataField: "company.name",
        sort: true,
        filter: textFilter()
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
          <span className="text-muted font-weight-light">List /</span>
          Contacts
        </h4>
        <div className="text-right">
          <Button as={Link} to="/add-contact">
            New contact
          </Button>
        </div>
        <ReactBootstrapTable columns={columns} data={data} />
      </div>
    );
  }
}

export default MedicalRecords;
