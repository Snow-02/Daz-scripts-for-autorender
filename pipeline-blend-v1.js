// 批量导入资产、合成3D人体并导出

// 定义要导入的资产列表
var assetList = [
    "D:/Daz3D/ziyuanku/People/Genesis 9/Clothing/Sade/dForce Ay Lin/dForce Ay Lin Dress Genesis 9.duf",
    "D:/Daz3D/ziyuanku/People/Genesis 9/Clothing/CynderBlue/CB Saffron Dress Set/CBSAF 0 Full Set.duf",
    "D:/Daz3D/ziyuanku/People/Genesis 9/Clothing/Otart/Triple Desire Set/Triple Desire Luxury Dress Assimetric.duf"
];
var figure = "D:/Daz3D/ziyuanku/People/Genesis 9/Characters/RY Tiffany HD.duf";
var hair = "D:/Daz3D/ziyuanku/People/Genesis 9/Hair/Toyen/Side Braid/Side Braid.duf";
// 定义输出路径
var outputPath = "D:/Codes/DAZ scripts/pipeline/";

// 循环处理每个资产
for (var i = 0; i < assetList.length; i++) {
    // 清除当前场景
    Scene.clear();
    
    // 加载基础人体模型
	var oMyasset=App.getContentMgr ();
	if(oMyasset){
		debug("read successfully");}
	oMyasset.openFile(figure);
    oMyasset.openFile(assetList[i],merge=true);
    oMyasset.openFile(hair,merge=true);
    // 将资产应用到人体模型上

    
    // 导出FBX文件
	// Get the primary selection to use for the file name
	var oNode = Scene.getPrimarySelection();
	// If something is selected
	if( oNode ){
		// Get the node's skeleton
		var oSkeleton = oNode.getSkeleton();
		// If it has a skeleton
		if( oSkeleton )	{
			// That is the node we want for the name
			oNode = oSkeleton;
		}
	}
	// Get the export manager
	var oExportMgr = App.getExportMgr();
	// Define the class name the for Autodesk Filmbox (*.fbx) exporter
	var sClassName = "DzObjExporter";
	// Find the exporter
	//var oExporter = oExportMgr.findExporterByClassName( sClassName );
	var oExporter = oExportMgr.getExporter(0);
	// If the exporter exists
	if( oExporter ){
		// Create a settings object
		var oSettings = new DzFileIOSettings();
	
		// Fill the settings object with the default options from the exporter
		oExporter.getDefaultOptions( oSettings );
		oSettings.setIntValue( "RunSilent", 1 );
		// Debug
		//print( oSettings.toJsonString() );
		 var exportFilename = outputPath + "output_" + i + ".blend";
		 oExporter.writeFile( exportFilename, oSettings );
		 debug("export successfully");
		 }
		 
}

print("finished!");