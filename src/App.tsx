import React from "react";
import axios from "axios";
import { Form, Input, message, Space, Upload, UploadProps } from "antd";
import "./App.css";
import Button from "./Button";
// // import System from 'systemjs/dist/';
// var System = require("systemjs/di");
// console.log("System",System);

// function loadComponent(scope: string, module: string) {
//   // @ts-ignore
//   System.import("system/webpack-app-2.x/main.bundle.js").then(function (m) {
//     console.log(m);
//   });
//   return async () => {
//     // 初始化共享作用域（shared scope）用提供的已知此构建和所有远程的模块填充它
//     // @ts-ignore
//     await __webpack_init_sharing__("default");
//     // @ts-ignore
//     const container = window[scope]; // 或从其他地方获取容器
//     // 初始化容器 它可能提供共享模块
//     // @ts-ignore
//     await container.init(__webpack_share_scopes__.default);
//     // @ts-ignore
//     const factory = await window[scope].get(module);
//     const Module = factory();
//     return Module;
//   };
// }
const App: React.FC = () => {
  const [renderList, setRenderList] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [C, setC] = React.useState<any>(null);
  const lazyComponents = async () => {
    const response = await axios.get("api/getComponents", {});
    const { data } = response;
    const componentsList: any = [];
    for (let i = 0; i < data.length; i++) {
      const scope = "custom_component_applicantion";
      componentsList.push({
        name: data[i],
        // component: React.lazy(loadComponent(scope, data[i])),
      });
    }
    setRenderList(componentsList);
  };
  React.useEffect(() => {
    // lazyComponents();
    const Cb = Button({ type: "primary", children: "hwq" });
    setC(Cb);
    console.log("Cb",Button)
  }, []);
  const reload = async () => {
    // @ts-ignore
    reloadRemote();
    lazyComponents();
  };

  const props: UploadProps = {
    name: "file",
    multiple: true,
    action: "api/upload",
    // showUploadList: false,
    data: (file) => {
      return Object.assign(file, { componentName: "Input" });
    },
    beforeUpload: (file, fileList) => {
      return false;
    },
  };
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  const onFinish = (value: any) => {
    // @ts-ignore
    var forms = new FormData();
    var configs = {
      headers: { "Content-Type": "multipart/form-data" },
    };
    value.file.forEach((item: any) => forms.append("file", item.originFileObj));
    forms.append("componentName", value?.componentName || "");
    setLoading(true);
    axios.post("api/upload", forms, configs).then((res) => {
      message.info(res.data.message);
      setLoading(false);
      if (res.data.code === 0) {
        setTimeout(() => {
          reload();
        }, 100);
      }
    });
  };
  const del = (componentName: string) => {
    axios
      .post("api/delComponets", {
        componentName,
      })
      .then((res) => {
        message.info(res.data.message);
        if (res.data.code === 0) {
          setTimeout(() => {
            reload();
          }, 100);
        }
      });
  };

  return (
    <div>
      {C ? C : null}
      {/* <Button type='primary'>Button</Button>
       */}
      {/* <div>
        <React.Suspense fallback="Loading Button">
          {renderList.map((Item: any, index: number) => {
            return (
              <div key={index}>
                组件名称:{Item.name}
                <div style={{ display: "flex" }}>
                  <Item.component text={"123"} type="primary">
                    {" "}
                    {Item.name}{" "}
                  </Item.component>
                  <Button
                    type="primary"
                    size="small"
                    style={{ marginLeft: 10 }}
                    onClick={() => del(Item.name)}
                  >
                    删除
                  </Button>
                </div>
              </div>
            );
          })}
        </React.Suspense>
      </div>
      <Space direction="vertical" style={{ marginTop: 20 }}>
        <Form onFinish={onFinish}>
          <Form.Item
            name="file"
            label="组件"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload {...props}>
              <Button type="primary" disabled={loading}>
                上传组件
              </Button>
            </Upload>
          </Form.Item>
          <Form.Item name="componentName" label="组件名称">
            <Input></Input>
          </Form.Item>
          <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              上传
            </Button>
          </Form.Item>
        </Form>
      </Space> */}
    </div>
  );
};

export default App;
