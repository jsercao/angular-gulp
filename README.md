## 基于angular 1.x 、gulp 的项目工程


### 涉及依赖说明

- `browser-sync`：静态文件服务器，同时也支持浏览器自动刷新
- `gulp-sass`：CSS编译器
- `gulp-autoprefixer`：`gulp-autoprefixer`根据设置浏览器版本自动处理浏览器前缀
- `main-bower-files`：会从bower.json文件里寻找定义好的主要文件路径
- `gulp-uglify`：压缩javascript文件，减小文件大小
- `gulp-strip-debug`：去除debug信息
- `del`：删除文件以及文件夹
- `run-sequence`：让gulp任务，可以相互独立，解除任务间的依赖，增强task复用
- `gulp-replace`：替换
- `gulp-angular-templatecache`：angularjs 页面模板文件打包
- `gulp-zip`：打包文件
- `gulp-cache`：缓存文件读取
- `gulp-imagemin`、`imagemin-pngquant`：压缩图片文件（包括PNG、JPEG、GIF和SVG图片）
- `gulp-clean-css`：压缩css
- `gulp-rename`：重命名文件
- `gulp-htmlmin`：压缩html
- `gulp-concat`：合并文件

### 使用

- 克隆项目

```
git clone https://github.com/jsercao/templete.git
```

- 在项目目录执行以下命令，安装依赖文件

```
npm install
bower install 
```

- `gulp sass`：编译sass
- `gulp serve`：启动服务并且监控 html、js、scss变化
- `gulp build`：编译项目
- `gulp zip`：将编译过后的文件打包成zip文件 


### 其他说明

- Angularjs 编程风格参见：[`Angular Style Guide`](https://github.com/johnpapa/angular-styleguide)

- gulp配置可根据自行项目需要进行修改

- 只提供基本的框架结构，不包含组件等

- popper.min.js 为bootstrap 4 必备组件