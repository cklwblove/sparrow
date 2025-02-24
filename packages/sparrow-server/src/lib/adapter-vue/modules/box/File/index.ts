import IBaseBox from '../IBaseBox';
import * as fsExtra from 'fs-extra';
import * as path from 'path';
import * as cheerio from 'cheerio';
import * as mkdirp from 'mkdirp';
import * as util from 'util';
import Config from '../../../config';
import * as prettier from 'prettier';
import Base from '../Base';
import * as _ from 'lodash';
import VueGenerator from '../../generator';
import {blockList} from '../../fragment/scene';
import * as upperCamelCase from 'uppercamelcase';
import generate from '@babel/generator';

const uuid = require('@lukeed/uuid');

export default class File extends Base implements IBaseBox{
  template: string;
  name: string = 'File';
  fileName: string = '';
  blockPath: string;
  insertComponents:string[] = [];
  components: any = [];
  
  data: any = {};
  methods: any = {};
  VueGenerator: any;
  $: any;
  storage: any;
  scriptData: any;
  formatTemp: string = '';
  style: string = '';
  storeStyleRepeat = [];

  config: any = {
    inline: false
  }

  params: any = null;

  currentComp: any = null;

  constructor (data: any, storage: any) {
    super(storage);
    this.storage = storage;
    const { params, config, fileName} = data;
    this.params = params;
    if (config) {
      this.config = config;
    }
    
    this.fileName = fileName.charAt(0).toUpperCase() + fileName.slice(1);
    this.insertComponents.push(this.fileName);
    this.$fragment = cheerio.load(`<${this.fileName} />`, {
      xmlMode: true,
      decodeEntities: false
    });
    const templateStr =  `
      <template>
        <div class="home-file drag-box" data-id="${this.uuid}">
        </div>
      </template>
    `;

    this.$ = cheerio.load(templateStr, {
      xmlMode: true,
      decodeEntities: false
    });

    this.VueGenerator = new VueGenerator('block');
    this.init();
  }

  init () {
    mkdirp.sync(Config.componentsDir);
    this.blockPath = path.join(Config.componentsDir, `${this.fileName}.vue`);
  }

  loopThroughBox (boxs: any,) {
    const leafToRoot = []; 
    const fn = function (boxs) {
      if (Array.isArray(boxs)) {
        boxs.forEach(item => {
          if (item.widgetType === 'box') {
            leafToRoot.unshift(item);
          }
          if (item.components) {
            fn(item.components)
          }
        });
      }
    }
    fn(boxs);
    leafToRoot.forEach(item => {
      item.setPreview && item.setPreview();
    });
  }


  public async renderPage () {
    this.$('.home-file').empty();
    this.scriptData = this.VueGenerator.initScript();
    this.style = '';
    this.storeStyleRepeat = [];
    if (this.config.dataCode) {
      const dataCode = this.VueGenerator.getDataStrAst(this.config.dataCode);
      this.VueGenerator.appendData(dataCode);
    }

    let methods = [];
    let vueData = [];
    this.loopThroughBox(this.components);
    const fn = (boxs, flag = 0) => {
      boxs.map((item, index) => {
        if (flag === 0) {
          const blockListStr = blockList(index, item.getFragment(index).html());
          this.$('.home-file').append(blockListStr);
        }
        
        if (item.insertComponents && item.insertComponents.length) {
          this.VueGenerator.appendComponent(upperCamelCase(item.insertComponents[0]));
        }
  
        if (item.components) {
          item.components.forEach(comp => {
            if (comp.vueParse) {
              if (!this.hasStyle(comp.name)) {
                this.style += comp.vueParse.style;
                this.storeStyleRepeat.push(comp.name)
              }
              methods = methods.concat(comp.vueParse.methods || []);
              vueData = vueData.concat(comp.vueParse.data || [])
            }
          });
        }
        if (item.components && item.components.length > 0) {
          fn(item.components, 1);
        }
  
        if (item.vueParse) {
          if (!this.hasStyle(item.name)) {
            this.style += item.vueParse.style;
            this.storeStyleRepeat.push(item.name)
          }
          item.vueParse.methods && this.VueGenerator.appendMethods(item.vueParse.methods);
          item.vueParse.data && this.VueGenerator.appendData(item.vueParse.data);
        }
  
      });
    }

    fn(this.components);
    
    this.VueGenerator.appendMethods(methods);
    this.VueGenerator.appendData(vueData);

    this.writeTemplate();
  }

  private hasStyle (name: string) {
    if (this.storeStyleRepeat.includes(name)) {
      return true;
    }
    return false;
  }

  private writeTemplate () {
    const template = `${this.$.html()}\n<script>${generate(this.scriptData).code}</script> <style lang="scss" scoped>${this.style}</style>`;
    const formatTemp = prettier.format(template, { semi: true, parser: "vue" });
    if (formatTemp === this.formatTemp) {
      return;
    }
    this.formatTemp = formatTemp;
    fsExtra.writeFileSync(this.blockPath, formatTemp, 'utf8');
  }
}