
	/*********************************************************************/
	// Get the render manager
	var oRenderMgr = App.getRenderMgr();
	
	// Get the active software renderer;
	// this will not work for OpenGL [hardware] based renders
	var oRenderer = oRenderMgr.getActiveRenderer();
	
	// If we did not find a renderer
	if( !oRenderer ){
		// Inform the user
		MessageBox.critical( text( "An active renderer could not be found." ),
			text( "Resource Error" ), text( "&OK" ) );
		
		// We are done...
		return;
	}
	
	// Get the render options
	var oRenderOptions = oRenderMgr.getRenderOptions();
	var bCurrentFrame = oRenderOptions.isCurrentFrameRender;
	var bConstrain = oRenderOptions.isAspectConstrained;
	var sizeImage = oRenderOptions.imageSize;
	var nAspect = oRenderOptions.aspect;
	var nAspectWidth = 1;
	var nAspectHeight = 1;
	// If the app version is greater than 4.6.4.4
	if( App.version64 > 0x0004000600040004 ){
		// Get the aspect width and height
		nAspectWidth = oRenderOptions.aspectWidth;
		nAspectHeight = oRenderOptions.aspectHeight;
	// If the app version is 4.6.4.4 or earlier
	} else {
		// Get the aspect width and height based on image size
		if( sizeImage.width > sizeImage.height ){
			nAspectWidth = nAspect;		
		} else if( sizeImage.height > sizeImage.width ){
			nAspectHeight = nAspect;
		}
	}
	
	// Initialize a variable for the file name
	var sFilename = "";
	
	// If the render options indicate we are rendering to file
	if( oRenderOptions.renderImgToId == DzRenderOptions.DirectToFile ){
		// Create a file info object for easy file related operations
		var oFileInfo = new DzFileInfo( oRenderOptions.renderImgFilename );
		
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

	}
	
	// If we do not have a file name
	if( sFilename.isEmpty() ){
		// Set the file name to a temporary file
		sFilename = String("%1.png").arg( App.getTempRenderFilename() );
	}
	
	// Provide feedback
	print( "File:", sFilename );
	
	// Get the viewport manager
	var oViewportMgr = MainWindow.getViewportMgr()
	
	// Get the active viewport
	var oViewport = oViewportMgr.getActiveViewport();
	
	// Get the 3D viewport
	var o3DViewport = oViewport.get3DViewport();
	
	// Get the size and position of the current aspect frame
	var rectFrame = o3DViewport.getAspectFrameRect();
	// The aspect rect is relative to the viewport,
	// but the render is relative to the aspect rect,
	// so we need to move the rect by the inverse offset
	rectFrame.moveBy( -rectFrame.x, -rectFrame.y );
	
	// Get the width, height and aspect of the frame
	var nFrameWidth = rectFrame.width;
	var nFrameHeight = rectFrame.height;
	var nFrameAspect = nFrameWidth / nFrameHeight;
	
	// Provide feedback
	print( "Frame:" );
	print( "X: ", rectFrame.x );
	print( "Y: ", rectFrame.y );
	print( "W: ", nFrameWidth );
	print( "H: ", nFrameHeight );	
	print( "A: ", nFrameAspect, ": 1" );
	
	// Constrain the aspect
	oRenderOptions.isAspectConstrained = true;
	
	// Set the aspect
	if( nFrameWidth == nFrameHeight ){
		oRenderOptions.setAspectRatio( 1, 1 );
	} else if( nFrameWidth > nFrameHeight ){
		oRenderOptions.setAspectRatio( nFrameAspect, 1 );
	} else {
		oRenderOptions.setAspectRatio( 1, nFrameAspect );
	}
	
	// Update the image size for the render settings...
	// This causes the Render Settings > Dimensions to be updated
	var targetSize = 2048;
	var newWidth, newHeight;

	if (nFrameWidth >= nFrameHeight) {
		newWidth = targetSize;
		newHeight = Math.round(targetSize / nFrameAspect);
	} else {
		newHeight = targetSize;
		newWidth = Math.round(targetSize * nFrameAspect);
	}

	oRenderOptions.imageSize = new Size(newWidth, newHeight);
	
	// We should only render the current frame to the viewport
	oRenderOptions.isCurrentFrameRender = true;
	
	// Get the time range of the render
	var oTimeRange = new DzTimeRange( oRenderOptions.startTime, oRenderOptions.endTime );
	
	// Create a 3d view render handler
	var oHandler = new Dz3DViewRenderHandler( oViewport, oTimeRange.start, sFilename );
	
	// If we created a valid render handler
	if( oHandler ){
		// Set the background color of the render to the
		// background color of the viewport
		oHandler.setBackColor( o3DViewport.background );
		
		// Set the area of the image to render
		oHandler.setCropWindow( rectFrame );
		
		// Set the handler to use the crop window
		oHandler.setUseCropWindow( true );
		
		// Get the active camera
		var oCamera = o3DViewport.getCamera();
	
		// Render, using our handler and options
		oRenderer.render( oHandler, oCamera, oRenderOptions );
		
		// Schedule the render handler for deletion, so we do not create a memory leak
		oHandler.deleteLater();
	// We did not create a valid render handler
	} else {
		// Inform the user
		MessageBox.critical( text( "A valid render handler was not created." ),
			text( "No Render Handler" ), text( "&OK" ) );
	}
	
	// Restore the render options
	oRenderOptions.isCurrentFrameRender = bCurrentFrame;
	oRenderOptions.isAspectConstrained = bConstrain;
	oRenderOptions.imageSize = sizeImage;
	oRenderOptions.setAspectRatio( nAspectWidth, nAspectHeight );
	
