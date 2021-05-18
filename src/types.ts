export type GenRfOptions = {
  genCfg: boolean;
  file?: string;
  config: string;
  out?: string;
  test: 'none' | 'test' | 'spec';
  style: 'none' | 'css' | 'scss' | 'sass' | 'less' | 'module.css' | 'module.scss' | 'module.sass' | 'module.less';
  rootDir: string;
  type: 'tsx' | 'jsx';
};
