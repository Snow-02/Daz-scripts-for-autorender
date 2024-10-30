// DAZ Studio 4.5.0.53 脚本文件
// 此脚本用于处理 DAZ Studio 中的视图渲染功能

// 定义一个匿名函数作为主循环，使用立即执行函数表达式(IIFE)来限制变量作用域
(function(){
	
	// 初始化静态变量，用于存储修饰键状态
	var s_bShiftPressed = false;    // Shift 键状态
	var s_bControlPressed = false;  // Control 键状态
	var s_bAltPressed = false;      // Alt 键状态
	var s_bMetaPressed = false;     // Meta(Windows/Command) 键状态
	
	// 检查 "Action" 全局临时变量是否已定义，并且类型正确
	if( typeof( Action ) != "undefined" && Action.inherits( "DzScriptAction" ) ){
		// 如果当前动作的快捷键序列未被按下
		if( !App.isKeySequenceDown( Action.shortcut ) ){
			updateModifierKeyState();
		}
	// 如果 "Action" 全局临时变量未定义
	} else if( typeof( Action ) == "undefined" ) {
		updateModifierKeyState();
	}
	
	/*********************************************************************/
	// 更新键盘修饰键状态的函数
	function updateModifierKeyState() {
		// 获取当前修饰键状态
		var nModifierState = App.modifierKeyState();
		// 使用位运算检查各个修饰键的状态
		s_bShiftPressed = (nModifierState & 0x02000000) != 0;   // 检查 Shift 键
		s_bControlPressed = (nModifierState & 0x04000000) != 0; // 检查 Control 键
		s_bAltPressed = (nModifierState & 0x08000000) != 0;     // 检查 Alt 键
		s_bMetaPressed = (nModifierState & 0x10000000) != 0;    // 检查 Meta 键
	};
	
	/*********************************************************************/
	// 调试打印函数，仅在按下 Alt 键时输出信息
	function debug() {
		// 如果未按下 Alt 键，直接返回
		if( !s_bAltPressed ){
			return;
		}
		
		// 将 arguments 对象转换为数组
		var aArguments = [].slice.call( arguments );
		
		// 打印数组内容
		print( aArguments.join(" ") );
	};
	
	/*********************************************************************/
	// 获取文本翻译的函数（如果存在翻译）
	function text( sText ) {
		// 如果应用程序版本支持 qsTr() 函数
		if( typeof( qsTr ) != "undefined" ){
			// 返回翻译后的文本
			return qsTr( sText );
		}
 
		// 如果不支持翻译，返回原始文本
		return sText;
	};
	
	/*********************************************************************/
	// 获取渲染管理器实例
	var oRenderMgr = App.getRenderMgr();
	
	// 获取当前活动的软件渲染器（注意：不适用于基于 OpenGL 的硬件渲染）
	var oRenderer = oRenderMgr.getActiveRenderer();
	
	// 如果没有找到渲染器
	if( !oRenderer ){
		// 向用户显示错误信息
		MessageBox.critical( text( "An active renderer could not be found." ),
			text( "Resource Error" ), text( "&OK" ) );
		
		// 终止脚本执行
		return;
	}
	
	// 获取渲染选项
	var oRenderOptions = oRenderMgr.getRenderOptions();
	var bCurrentFrame = oRenderOptions.isCurrentFrameRender;     // 是否只渲染当前帧
	var bConstrain = oRenderOptions.isAspectConstrained;        // 是否保持宽高比
	var sizeImage = oRenderOptions.imageSize;                   // 图像尺寸
	var nAspect = oRenderOptions.aspect;                        // 宽高比
	var nAspectWidth = 1;                                       // 宽高比宽度
	var nAspectHeight = 1;                                      // 宽高比高度
	
	// 根据 DAZ Studio 版本处理宽高比
	if( App.version64 > 0x0004000600040004 ){  // 版本高于 4.6.4.4
		// 获取宽高比的宽度和高度
		nAspectWidth = oRenderOptions.aspectWidth;
		nAspectHeight = oRenderOptions.aspectHeight;
	} else {  // 版本 4.6.4.4 或更早
		// 基于图像尺寸计算宽高比
		if( sizeImage.width > sizeImage.height ){
			nAspectWidth = nAspect;        
		} else if( sizeImage.height > sizeImage.width ){
			nAspectHeight = nAspect;
		}
	}
	
	// 初始化文件名变量
	var sFilename = "";
	
	// 如果渲染选项指示要直接渲染到文件
	if( oRenderOptions.renderImgToId == DzRenderOptions.DirectToFile ){
		// 创建文件信息对象，用于简化文件相关操作
		var oFileInfo = new DzFileInfo( oRenderOptions.renderImgFilename );
		
		// 如果有基本文件名
		if( !oFileInfo.baseName().isEmpty() ){
			// 设置文件名为渲染选项中指定的文件名
			sFilename = oRenderOptions.renderImgFilename;
		}
	}
	
	// 如果没有指定文件名
	if( sFilename.isEmpty() ){
		// 设置为临时文件名
		sFilename = String("%1.png").arg( App.getTempRenderFilename() );
	}
	
	// 输出调试信息
	print( "File:", sFilename );
	
	// 获取视口管理器
	var oViewportMgr = MainWindow.getViewportMgr()
	
	// 获取当前活动视口
	var oViewport = oViewportMgr.getActiveViewport();
	
	// 获取 3D 视口
	var o3DViewport = oViewport.get3DViewport();
	
	// 获取当前宽高比框的大小和位置
	var rectFrame = o3DViewport.getAspectFrameRect();
	// 宽高比框相对于视口，但渲染相对于宽高比框
	// 所以需要通过反向偏移来移动矩形
	rectFrame.moveBy( -rectFrame.x, -rectFrame.y );
	
	// 获取框架的宽度、高度和宽高比
	var nFrameWidth = rectFrame.width;
	var nFrameHeight = rectFrame.height;
	var nFrameAspect = nFrameWidth / nFrameHeight;
	
	// 输出调试信息
	debug( "Frame:" );
	debug( "X: ", rectFrame.x );
	debug( "Y: ", rectFrame.y );
	debug( "W: ", nFrameWidth );
	debug( "H: ", nFrameHeight );	
	debug( "A: ", nFrameAspect, ": 1" );
	
	// 保持宽高比
	oRenderOptions.isAspectConstrained = true;
	
	// 设置宽高比
	if( nFrameWidth == nFrameHeight ){
		oRenderOptions.setAspectRatio( 1, 1 );
	} else if( nFrameWidth > nFrameHeight ){
		oRenderOptions.setAspectRatio( nFrameAspect, 1 );
	} else {
		oRenderOptions.setAspectRatio( 1, nFrameAspect );
	}
	
	// 更新渲染设置中的图像尺寸
	// 这会导致渲染设置 > 尺寸被更新
	oRenderOptions.imageSize = new Size( nFrameWidth, nFrameHeight );
	
	// 我们只应该渲染当前帧到视口
	oRenderOptions.isCurrentFrameRender = true;
	
	// 获取渲染时间范围
	var oTimeRange = new DzTimeRange( oRenderOptions.startTime, oRenderOptions.endTime );
	
	// 创建 3d 视图渲染处理程序
	var oHandler = new Dz3DViewRenderHandler( oViewport, oTimeRange.start, sFilename );
	
	// 如果创建了有效的渲染处理程序
	if( oHandler ){
		// 设置渲染的背景颜色为视口的背景颜色
		oHandler.setBackColor( o3DViewport.background );
		
		// 设置图像渲染区域
		oHandler.setCropWindow( rectFrame );
		
		// 设置处理程序使用裁剪窗口
		oHandler.setUseCropWindow( true );
		
		// 获取活动相机
		var oCamera = o3DViewport.getCamera();
	
		// 渲染，使用我们的处理程序和选项
		oRenderer.render( oHandler, oCamera, oRenderOptions );
		
		// 计划删除渲染处理程序，以避免内存泄漏
		oHandler.deleteLater();
	// 我们没有创建有效的渲染处理程序
	} else {
		// 向用户显示错误信息
		MessageBox.critical( text( "A valid render handler was not created." ),
			text( "No Render Handler" ), text( "&OK" ) );
	}
	
	// 恢复渲染选项
	oRenderOptions.isCurrentFrameRender = bCurrentFrame;
	oRenderOptions.isAspectConstrained = bConstrain;
	oRenderOptions.imageSize = sizeImage;
	oRenderOptions.setAspectRatio( nAspectWidth, nAspectHeight );
	
// 最终完成函数并调用
})();