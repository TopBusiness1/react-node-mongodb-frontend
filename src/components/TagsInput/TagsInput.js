import React from "react";
import TagsInput from "react-tagsinput";
import "./react-tagsinput.css";

const customTagsInput = props => {
  const { value, name, onChange, inputValue, onChangeInput } = props;
  return (
    <TagsInput
      value={value}
      name={name}
      onChange={onChange}
      inputValue={inputValue}
      onChangeInput={onChangeInput}
    />
  );
};

export default customTagsInput;
