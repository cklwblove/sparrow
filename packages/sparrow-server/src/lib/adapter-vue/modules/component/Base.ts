import * as cheerio from 'cheerio';
import storage from '../../../storage';
import * as _ from 'lodash';


const uuid = require('@lukeed/uuid');


export default class Base {
  public ascription = 'form'; // 表单归属
  public $fragment: any;
  public labelValue = '';
  public uuid = '';
  public config: any = {};
  public _attrStr: string = '';
  public _formItemStr: string = '';
  public insertFileType = 'inline';
  public boxPath: string = '';
  public storage: any = {};

  constructor (boxPath: string) {
    this.boxPath = boxPath || '';
    this.uuid = uuid().split('-')[0];
    this.storage = storage;
  }

  public wrapComponentBox (content) {
    const type = storage.get('preview_view_status') || 0;
    if (type === 0) {
      return `
        <component-box uuid="${this.uuid}">
          ${content}
        </component-box>
      `;
    } else {
      return content;
    }
  }

  public renderFragment () {
    let formItem = ''
    if (this.boxPath.match('Form') || _.get(this.config, 'model.custom.insideForm') === true) {
      this.config.model.custom.insideForm = true;
      
      formItem = this.wrapComponentBox(
        `
        <el-form-item label=" "
          ${this._formItemStr}
        >
          <edit-text-box slot="label" :clearClass="true" uuid="${this.uuid}">
            ${_.get(this.config, 'model.custom.label')}
          </edit-text-box>
          ${this.fragment()}
        </el-form-item>
      `
      );
    } else {
      formItem = this.wrapComponentBox(this.fragment())
    }

    

    this.$fragment = cheerio.load(formItem, {
      xmlMode: true,
      decodeEntities: false,
    });
  }

  public fragment () {
    return '';
  }

  public getFragment (type: number) {
    this.renderFragment();

    if (type === 1) {
      this.$fragment('label-box').remove();
      this.$fragment('el-form-item').attr('label', _.get(this.config, 'model.custom.label'));
    }
    return this.$fragment;
  }

  public insertEditText (params) {
    this.config.model.custom.label = params.value;
  }

  public getConfig() {
    return this.config
  }

  protected setHandler () {}

  public settingConfig (config: any) {
    this.config = config;

    this.setAttrsToStr();
    this.setHandler();
  }

  public setAttrsToStr () {
    const {config} = this;
    if (config.model.attr) {
      const formField = [];
      Object.keys(config.model.attr).forEach(key => {
        // key === 'v-model' && 
        if (config.model.attr[key] === '') {
          return;
        }
        formField.push(`${key}="${config.model.attr[key]}"`);
      });
      this._attrStr = formField.join(' ');
    }
  }

  public removeAttr (attr: string) {
    this.$fragment.root().children().removeAttr(attr);
  }

}