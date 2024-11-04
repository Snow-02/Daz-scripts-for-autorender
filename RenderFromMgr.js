var omgr = App.getRenderMgr();
var oRenderOptions = omgr.getRenderOptions();

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
	oRenderOptions.renderImgFilename = sFilename
	var oFileInfo = new DzFileInfo( oRenderOptions.renderImgFilename );
omgr.doRender();