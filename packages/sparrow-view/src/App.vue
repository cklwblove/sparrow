<template>
  <div id="app" @click="clickApp" class="sparrow-view"> 
    <router-view/>
    <inline-toolbar />
  </div>
</template>
<script>
import message from './utils/message';
import { Event } from '@sparrow-vue/boxs';
import _ from 'lodash';
import html2canvas from 'html2canvas';

export default {
  data () {
    return {
      uuid: '',
      isShowToolbar: false
    }
  },
  created () {
    document.addEventListener('keydown', (e) => {

      if(e.metaKey && e.keyCode === 67) {
        message.emit('client.screen.keydown', {
          operate: 'ctrl+c'
        });
      }

      if (e.metaKey && e.keyCode === 86) {
        message.emit('client.screen.keydown', {
          operate: 'ctrl+v'
        });
      }

    });

    this.getSelection = _.debounce(this.getSelection, 500, {
      trailing: true
    })
    document.addEventListener("selectionchange", () => {
      this.getSelection();
    });

    document.addEventListener('click', () => {
      Event.emit('text-selection-hide');
    });

    window.addEventListener('message',(e) => {
      const {data} = e;
      if (data && data.handler === 'document-click') {
        this.isShowToolbar = false;
      }

      if (data && data.handler === 'html-2-canvas') {
        var node = document.querySelector('#app');

        html2canvas(node).then(function(canvas) {
           message.emit('client.screen.capture', {
            url: canvas.toDataURL()
          });
        });
      }
    },false);
    Event.on('block-selected', (data) => {
      this.uuid = data.uuid;
    });

    // 插入物料处理
    Event.on('insert_handler', (data) => {
      setTimeout(() => {
        const {params} = data;
        message.emit(data.emit || 'client.dashboard.show', {
          uuid: this.uuid,
          data,
        });
      }, 200);
    })

  },
  methods: {
    showToolbarChange (data) {
      this.isShowToolbar = data;
    },
    getSelection () {
      const selection = document.getSelection();
      const {anchorOffset, focusOffset, anchorNode} = selection;
      if (anchorNode && anchorNode.wholeText && anchorNode.parentNode.classList.contains('edit-cell')) {
        const selectedText = anchorNode.wholeText.substring(focusOffset, anchorOffset);
        if (!selectedText) return;
        Event.emit('text-selection',{
          rect: anchorNode.parentNode.getBoundingClientRect(),
          type: 'edit-cell',
          value: selectedText,
        });
      }
    },
    clickApp () {
      message.emit('client.app.init', {
        uuid: '',
      });
    }
  }
}
</script>
<style>
  html, body, #app{
    height: 100%;
  }
  .el-form--inline .comp-box{
    display: inline-block;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .el-table .cell{
    overflow: initial !important;
  }
  .el-button--mini{
    padding: 4px 8px !important;
  }
  .block-list{
    /* margin-bottom: 10px; */
  }
  .custom-inline{
    padding-left: 60px;
  }
  .home{
    height: 100%;
  }
  .sortable-ghost{
    height: 3px !important;
    overflow: hidden;
    background: #409EFF;
    
  }
  .sortable-ghost .empty-container{
    display: none;
  }
  .sortable-ghost *{
    display: none;
  }
  /* .drag-box{
    min-height: 24px;
  } */
  .sortable-chosen{
    /* display: none; */
  }
  /* .sortable-fallback{
    background: red;
    width: 100px;
    height: 10px;
  } */
  .empty-container{
    width: 50px;
    margin-left: calc(50% - 25px);
    display: flex;
    justify-content: center;
    align-items: center;
    color: #C0C4CC;
  }
  /* .sortable-chosen{display: none} */
</style>
