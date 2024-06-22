import { TextComponentProps } from '@/defaultProps'
export interface PropToForm {
  component: string;
  subComponent?: string;
  // value?: string | number;
  extraProps?: {
    [key: string]: any;
  };
  text?: string;
  options?: {text: string; value: any}[]; 
  initialTransform?: (v: any) => any; 
  afterTransform?: (v: any) => any; 
  valueProp?: string;
  eventName?: string;
}

export type PropsToForms  = {
  [P in keyof TextComponentProps]?: PropToForm 
}

export const mapPropsToForms: PropsToForms = {
  text: {
    component: 'a-textarea',
    extraProps: {
      line: 3
    },
    text: '文本',
    afterTransform: (e: any) => e.target.value 
  },
  fontSize: {
    component: 'a-input-number',
    text: '字号',
    initialTransform: (v: string) => parseInt(v),
    afterTransform: (e: number) => `${e}px`
  },
  lineHeight: {
    text: '行高',
    component: 'a-slider',
    extraProps: {
      min: 0,
      max: 3,
      step: 0.1
    },
    initialTransform: (v: string) => parseFloat(v),
    afterTransform: (e: string) => e.toString()
  },
  textAlign: {
    component: 'a-radio-group',
    subComponent: 'a-radio-button',
    text: '对齐',
    options: [
      {value: 'left', text: '左'},
      {value: 'center', text: '中'},
      {value: 'right', text: '右'}
    ],
    afterTransform: (e: any) => e.target.value
  },
  fontFamily: {
    component: 'a-select',
    subComponent: 'a-select-option',
    text: '字体',
    options: [
      {value: '', text: '无'},
      {value: '宋体', text: '"SimSun","STSong"'},
      {value: '仿宋', text: '"FangSong","STFangSong"'}
    ]
  }
}