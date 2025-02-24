import * as cheerio from 'cheerio';
import storage from '../../../storage';
const uuid = require('@lukeed/uuid');


export default class Common {
  public $fragment: any;
  public labelValue = '';
  public uuid = '';
  public config: any = {};
  public storage: any = null; 
  public _attrStr: string = '';
  public isInline: boolean = false;

  constructor () {
    this.uuid = uuid().split('-')[0]; 
    this.storage = storage;
  }

  public wrapComponentBox (content) {
    const type = this.storage.get('preview_view_status') || 0;
    if (type === 0) {
      return `
        <component-box uuid="${this.uuid}" :isInline="${this.isInline}">
          ${content}
        </component-box>
      `;
    } else {
      return content;
    }
  }

  public renderFragment () {
    this.$fragment = cheerio.load(this.wrapComponentBox(this.fragment()), {
      xmlMode: true,
      decodeEntities: false,
    });
  }

  public fragment () {
    return '';
  }

  public getFragment (type: number) {
    this.renderFragment();
    return this.$fragment;
  }

  public getConfig() {
    return this.config
  }


  public setAttrsToStr () {
    const {config} = this;
    if (config.model.attr) {
      const formField = [];
      Object.keys(config.model.attr).forEach(key => {
        const value = config.model.attr[key];
        if(value) {
          formField.push(`${key}="${value}"`);
        }
      });
      this._attrStr = formField.join(' ');
    }
    console.log(this._attrStr);
  }

  public customAttrHandler () {}

  public settingConfig (config: any) {
    this.config = config;
    this.customAttrHandler();
    this.setAttrsToStr();
  }

}