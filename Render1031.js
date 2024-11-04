// 获取渲染管理器实例
var oRenderMgr = App.getRenderMgr();
    
// 获取当前活动的软件渲染器（注意：不适用于基于 OpenGL 的硬件渲染）
var oRenderer = oRenderMgr.getActiveRenderer();

var oRenderOptions = oRenderMgr.getRenderOptions();
var bCurrentFrame = oRenderOptions.isCurrentFrameRender;     // 是否只渲染当前帧
var bConstrain = oRenderOptions.isAspectConstrained;        // 是否保持宽高比
var sizeImage = oRenderOptions.imageSize;                   // 图像尺寸
var nAspect = oRenderOptions.aspect;                        // 宽高比
var nAspectWidth = 1;                                       // 宽高比宽度
var nAspectHeight = 1;                                      // 宽高比高度
nAspectWidth = oRenderOptions.aspectWidth;
nAspectHeight = oRenderOptions.aspectHeight;

var dirpath = "D:/RenderResult/";
var Id = 1;
var nview = 3;
// 创建ID文件夹路径
var idFolder = dirpath + Id + "/";
// 确保ID文件夹存在
var dir = new DzDir(idFolder);
if (!dir.exists()) {
    dir.mkpath(idFolder);
}
// 直接使用nview作为文件名，添加.png后缀
var sFilename = idFolder + nview + ".png";

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
}else{
    print("A valid render handler was not created.");
}