// DAZ Studio 4.9.3.163 脚本文件

// 定义一个自执行的匿名函数
// 用作主程序循环
// 限制变量作用域
(function(){
	
	/*********************************************************************/
	// 文本翻译函数：如果存在翻译则返回翻译后的文本
	function text( sText )
	{
		// 检查应用程序是否支持 qsTr() 函数
		if( typeof( qsTr ) != "undefined" ){
			// 返回翻译后的文本
			return qsTr( sText );
		}
		// 如果没有翻译，返回原文
		return sText;
	};
	
	/*********************************************************************/
	// 获取渲染管理器实例
	var oRenderMgr = App.getRenderMgr();
	
	// 查找 NVIDIA Iray 渲染器
	var oRenderer = oRenderMgr.findRenderer( "DzIrayRenderer" );
	// 如果找不到渲染器
	if( !oRenderer ){
		// 向用户显示错误消息
		MessageBox.critical( text( "The NVIDIA Iray renderer could not be found." ),
			text( "Resource Error" ), text( "&OK" ) );
		
		// 终止执行
		return;
	}
	
	// 定义渲染作业/图像名称（使用特殊字符替换为下划线）
	var sJobName = "ds_" + App.createDigest( "name to encode" ).replace( /[^A-Z0-9_\\-\\.\\s\\(\\)]+/ig, "_" );
	
	// 定义输出图像文件格式
	var sExtension = "png";

	// 定义作业优先级（数值越小优先级越高）
	var nPriority = 100;
	
	// 定义服务器连接参数
	var sProtocol = "http";          // 连接协议
	var sServerAddress = "10.200.2.217";  // 服务器IP地址
	var sPort = "11452";             // 服务器端口
	
	// 设置是否监控渲染作业
	var bMonitorJob = false;
	
	// 声明配置对象变量
	var oSettings;
	var oSubSettings;
	
	// 检查是否支持 setBridgeConfiguration 方法（需要 4.21.1.11 或更高版本）
	if( typeof( oRenderer.setBridgeConfiguration ) == "function" ){
		// 创建设置对象
		oSettings = new DzSettings();
		
		// 配置基本连接参数
		oSettings.setIntValue( "Connection", 0 );
		oSettings.setStringValue( "Server", sServerAddress );
		oSettings.setBoolValue( "Secure", sProtocol == "https" );  // 是否使用安全连接
		oSettings.setIntValue( "Port", parseInt( sPort ) );
		oSettings.setStringValue( "Username", "admin" );           // 服务器登录用户名
		oSettings.setStringValue( "Password", "idcirayserver" );   // 服务器登录密码
		
		// 配置流媒体设置
		oSubSettings = oSettings.setSettingsValue( "Streaming" );
		oSubSettings.setFloatValue( "Idle Timeout", 1.0 );          // 空闲超时（秒）
		oSubSettings.setIntValue( "Video Max Lag", 3 );            // 最大视频延迟（帧）
		oSubSettings.setIntValue( "Video Frame Rate", 15 );        // 视频帧率
		oSubSettings.setFloatValue( "Render Update Interval", 60.00 ); // 渲染更新间隔（秒）
		oSubSettings.setBoolValue( "Nitro Mode", false );          // 快速渲染模式开关
		oSubSettings.setIntValue( "Nitro Min Samples Per Update", 1 );  // 每次更新最小采样数
		oSubSettings.setIntValue( "Nitro Max Samples Per Update", 0 );  // 每次更新最大采样数（0表示无限制）
		
		// 应用配置到Iray桥接器
		oRenderer.setBridgeConfiguration( oSettings );
	}
	
	// 获取视口管理器
	var oViewportMgr = MainWindow.getViewportMgr();
	
	// 获取当前活动视口
	var oViewport = oViewportMgr.getActiveViewport();
	
	// 获取3D视口
	var o3DViewport = oViewport.get3DViewport();
	
	// 获取当前活动摄像机用于渲染
	var oCamera = o3DViewport.getCamera();
	
	// 获取渲染选项设置
	var oRenderOptions = oRenderMgr.getRenderOptions();
	
	// 将渲染作业添加到服务器队列
	var oResponse = oRenderer.exportRenderToBridgeQueue( sJobName, sExtension, oCamera, oRenderOptions, nPriority );
	
	// 声明消息变量
	var sMessage;
	
	// 检查响应中是否包含错误信息
	if( oResponse.hasOwnProperty( "errorMsg" ) ){
		// 获取错误信息
		sMessage = oResponse[ "errorMsg" ];
		
		// 如果存在错误信息
		if( !sMessage.isEmpty() ){
			// 显示警告对话框
			MessageBox.warning( text( sMessage ),
				text( "NVIDIA Iray Bridge" ), text( "&OK" ), "" );
			
			// 终止执行
			return;
		}
	}
	
	// 如果启用了作业监控
	if( bMonitorJob ){
		// 在系统默认浏览器中打开监控页面
		App.showURL( String( "%1://%2:%3" ).arg( sProtocol ).arg( sServerAddress ).arg( sPort ) );
	}
	
// 结束并立即执行匿名函数
})();
