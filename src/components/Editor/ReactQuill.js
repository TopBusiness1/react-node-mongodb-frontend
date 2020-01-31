import React, { Component } from "react";
import "../../vendor/libs/react-mde/react-mde.scss";
import loadable from "@loadable/component";
import "../../vendor/libs/react-quill/typography.scss";
import "../../vendor/libs/react-quill/editor.scss";

// Catch error in IE10
const ReactQuill = loadable(
  () =>
    new Promise(resolve =>
      import("react-quill")
        .then(Component => resolve(Component))
        .catch(() => resolve(<div />))
    )
);

class Editors extends Component {
  state = {};
  render() {
    // react-quill settings
    //
    const { notes, handleChange } = this.props;
    const isIE10Mode = document["documentMode"] === 10;
    const modules = {
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }, { font: [] }, { size: [] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ script: "sub" }, { script: "super" }],
        ["blockquote", "code-block"],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" }
        ],
        [{ direction: "rtl" }, { align: [] }],
        ["link", "image", "video"],
        ["clean"]
      ]
    };

    return (
      <div>
        {isIE10Mode && (
          <div className="alert alert-danger">
            <strong>react-quill</strong> doesn't support Internet Explorer 10
          </div>
        )}

        {!isIE10Mode && (
          <React.Fragment>
            <ReactQuill
              modules={modules}
              value={notes}
              onChange={handleChange}
            />
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default Editors;
