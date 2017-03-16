dist=../dist

# 创建demo目录
demo=$dist/demo/
rm -rf $demo
mkdir $demo

# 拷贝静态资源
cp ./index.html ./data.json  $demo

# 拷贝 demo 静态文件
for f in **/index.html; do
  IFS='/' read -r -a array <<< "$f"
  mkdir $demo${array[0]}
  cp $f $demo$f
done

# 拷贝产品版 js
mv ./build $demo
