import React from "react";
import { Input } from "antd";
const HInput = (props: any = {}) => {
  React.useEffect(() => {
    console.log("InputInputInputInputInput");
  }, []);
  return <Input {...props} defaultValue="component - Input"></Input>;
};
export default HInput;
