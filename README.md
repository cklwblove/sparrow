# sparrow

 <img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8aa8330af05846dfbcae01de8f1a19ee~tplv-k3u1fbpfcp-zoom-1.image?imageslim" width = "520"  alt="图片名称" align="center" />

 <img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/64c5d79b33254cef855c7bf005756d2f~tplv-k3u1fbpfcp-zoom-1.image" width = "520"  alt="图片名称" align="center" />

 <img src="https://unpkg.com/@sparrow-vue/images@1.0.8/assets/init-page.png"  width = "520"  alt="图片名称" align="center" >

#### 场景化低代码（LowCode）搭建工作台；

sparrow的核心目标仅有一条“提升研发效率”，目前提供基于vue、element-ui组件库中后台项目的实践，新功能持续新增中；

---
## 特性

- **低代码开发，**  快速生成可读性强、vue element-ui组件库的源代码。
- **可视化开发，**  通过GUI生成页面代码源文件。
- **资产市场，**  代码资源共享，包含组件、编辑区块、静态区块、搜索业务组件、场景搭建编辑器。

## 优势
- sprarrow 的核心目标是“提效”，因此功能上不只是单纯UI的可视化搭建，目前提供函数级别的搭建，提供拥有业务逻辑的代码组装，生成可二次开发的源代码；
- 易于扩展，通过AST读取组件源代码，进行组合，只要页面的逻辑是可拆解的就可以任意组装；
- 可与项目结合，技术上采用本地运行server服务，可以与项目深度结合，实现更多提效手段，更大可操作空间；


## 快速使用

### 全局安装

```bash
# 全局安装
$ npm install -g sparrow-code

# 运行
$ sparrow
```
---

### 项目内安装

```bash
# 项目内安装
$ npm install sparrow-code -D

# package.json 增加 sparrow
"scripts": {
  "sparrow": "sparrow start -m page"
}

# 项目内安装GUI组件
$ npm install @sparrow-vue/develop-ui -S

# 项目内引用App.vue
<template>
  <div id="app">
    <router-view />
    <sparrow />
  </div>
</template>

<script>
import Sparrow from '@sparrow-vue/develop-ui'

export default {
  components: {
    Sparrow
  },
  name: 'App'
}
</script>


```

## License
[MIT](http://opensource.org/licenses/MIT)