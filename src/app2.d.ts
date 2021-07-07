/// <reference types="react" />
declare module "custom-component-applicantion/Button" {
  const Button: React.ComponentType<{text:string}>;
  export default Button;
}

declare module "custom-component-applicantion/components"{
  const components : any;
  export default components
}