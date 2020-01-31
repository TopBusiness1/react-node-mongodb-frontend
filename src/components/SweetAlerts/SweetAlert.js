// import React from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "../../vendor/libs/sweetalert2/sweetalert2.scss";

export const ReactSwal = withReactContent(
  Swal.mixin({
    buttonsStyling: false,
    customClass: {
      confirmButton: "btn btn-primary btn-lg",
      cancelButton: "btn btn-default btn-lg",
      actions: "text-center"
    }
  })
);

export const DeleteAlert = () => {
  return ReactSwal.fire({
    title: "Are you sure?",
    text: "You will not be able to recover this record!",
    type: "warning",
    allowOutsideClick: false,
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "No, cancel!"
  });
};

export const LoaderSweetAlert = props => {
  ReactSwal.fire({
    title: "Save",
    text: "Press save to store the records",
    type: "info",
    showCancelButton: true,
    showLoaderOnConfirm: true,
    allowOutsideClick: function() {
      return !Swal.isLoading();
    },
    preConfirm: props.preConfirm
  }).then(function(result) {
    if (result.value) {
      ReactSwal.fire("Updated successfully!");
    } else {
      ReactSwal.fire("Cancelled", "Not Saved, try again later :)", "error");
    }
  });
};

export const SuccessSweetAlert = props => {
  return ReactSwal.fire({
    title: props.title,
    text: props.text,
    type: props.type,
    showCancelButton: props.showCancelButton,
    customClass: {
      confirmButton: "btn btn-success btn-lg",
      cancelButton: "btn btn-default btn-lg",
      actions: "text-center"
    }
  });
};
