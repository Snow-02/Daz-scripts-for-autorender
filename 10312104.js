	/*********************************************************************/
	// Get the render manager
	var oRenderMgr = App.getRenderMgr();
	
	// Get the active software renderer;
	// this will not work for OpenGL [hardware] based renders
	var oRenderer = oRenderMgr.getActiveRenderer();
	
	// Get the render options
	var oRenderOptions = oRenderMgr.getRenderOptions();

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
	var oFileInfo = new DzFileInfo( oRenderOptions.renderImgFilename );
	// If we do not have a file name
	if( sFilename.isEmpty() ){
		// Set the file name to a temporary file
		sFilename = String("%1.png").arg( App.getTempRenderFilename() );
	}
	
	// Provide feedback
	print( "File:", sFilename );
	var oViewportMgr = MainWindow.getViewportMgr()
	// 获取当前活动视口
	var oViewport = oViewportMgr.getActiveViewport();
	// 获取 3D 视口
	var o3DViewport = oViewport.get3DViewport();
	print("hight",oRenderOptions.aspectHeight);
	print("width",oRenderOptions.aspectWidth);

	// Get the time range of the render
	var oTimeRange = new DzTimeRange( oRenderOptions.startTime, oRenderOptions.endTime );
	
	// Create a 3d view render handler
	var oHandler = new Dz3DViewRenderHandler( oViewport, 0, sFilename );
	print(oHandler.getSize ().height);
	// Get the active camera
	var oCamera = o3DViewport.getCamera();
	
	// Render, using our handler and options
	oRenderer.render( oHandler, oCamera, oRenderOptions );
	// Schedule the render handler for deletion, so we do not create a memory leak
	oHandler.deleteLater();