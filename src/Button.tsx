import React from "react";
import * as ReactDOM from 'react-dom'
import { Button } from "antd";
const HButton = (props: any = {}) => {
  React.useEffect(() => {
    console.log("FFMFMFMMFMF");
  }, []);
  return <Button {...props}>component</Button>;
};
export default HButton;
