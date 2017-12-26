关于
=========================================
RockMongo运行环境包括：
 * Nginx
 * PHP

你需要自己安装MongoDB。

注意
=========================================
当前环境的各级目录中不能包含中文、空格等特殊字符。


使用
=========================================
双击以下bat文件运行：

rockstart.bat          启动服务
rockstop.bat           关闭服务
rockclean.bat          清理日志文件


配置
=========================================
在 web/rockmongo/config.php 文件里修改你的配置。

默认登录用户名和密码是：admin/admin


端口号
=========================================
Web:     7788
Fastcgi: 9111


支持 & 问题
RockMongo简介：http://blog.sina.com.cn/s/blog_5fd841bf0100shi7.html
Mongodb-PHP环境配置：http://blog.sina.com.cn/s/blog_5fd841bf0100sdms.html