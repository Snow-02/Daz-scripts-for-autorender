// DAZ Studio version 4.9.3.163 filetype DAZ Script

// Define an anonymous function;
// serves as our main loop,
// limits the scope of variables
(function(){
	
	/*********************************************************************/
	// String : A function for retrieving a translation if one exists
	function text( sText )
	{
		// If the version of the application supports qsTr()
		if( typeof( qsTr ) != "undefined" ){
			// Return the translated (if any) text
			return qsTr( sText );
		}
 
		// Return the original text
		return sText;
	};
	
	/*********************************************************************/
	// Get the render manager
	var oRenderMgr = App.getRenderMgr();
	
	// Find the desired renderer
	var oRenderer = oRenderMgr.findRenderer( "DzIrayRenderer" );
	// If we did not find the renderer
	if( !oRenderer ){
		// Inform the user
		MessageBox.critical( text( "The NVIDIA Iray renderer could not be found." ),
			text( "Resource Error" ), text( "&OK" ) );
		
		// We are done...
		return;
	}
	
	// Define the job/image name
	var sJobName = "ds_" + App.createDigest( "name to encode" ).replace( /[^A-Z0-9_\\-\\.\\s\\(\\)]+/ig, "_" );
	
	// Define the image file extension
	var sExtension = "png";

	// Define the priority of the job; lower value = higher priority
	var nPriority = 100;
	
	// Define the URI components
	var sProtocol = "http";
	var sServerAddress = "irayrenderserver.ddns.net";
	var sPort = "9090";
	
	// Define whether or not to monitor the job
	var bMonitorJob = false;
	
	// Declare working variables
	var oSettings;
	var oSubSettings;
	
	// If DzIrayRenderer::setBridgeConfiguration() is available - i.e., 4.21.1.11
	if( typeof( oRenderer.setBridgeConfiguration ) == "function" ){
		// Create a settings object
		oSettings = new DzSettings();
		
		// Build the configuration settings
		oSettings.setIntValue( "Connection", 0 );
		oSettings.setStringValue( "Server", sServerAddress );
		oSettings.setBoolValue( "Secure", sProtocol == "https" );
		oSettings.setIntValue( "Port", parseInt( sPort ) );
		oSettings.setStringValue( "Username", "foo" );
		oSettings.setStringValue( "Password", "b4r!" );
		
		/*
		// Build streaming configuration settings
		oSubSettings = oSettings.setSettingsValue( "Streaming" );
		oSubSettings.setFloatValue( "Idle Timeout", 1.0 );
		oSubSettings.setIntValue( "Video Max Lag", 3 );
		oSubSettings.setIntValue( "Video Frame Rate", 15 );
		oSubSettings.setFloatValue( "Render Update Interval", 60.00 );
		oSubSettings.setBoolValue( "Nitro Mode", false );
		oSubSettings.setIntValue( "Nitro Min Samples Per Update", 1 );
		oSubSettings.setIntValue( "Nitro Max Samples Per Update", 0 );
		*/
		
		// Configure the Iray bridge
		oRenderer.setBridgeConfiguration( oSettings );
	}
	
	// Get the viewport manager
	var oViewportMgr = MainWindow.getViewportMgr();
	
	// Get the active viewport
	var oViewport = oViewportMgr.getActiveViewport();
	
	// Get the 3D viewport
	var o3DViewport = oViewport.get3DViewport();
	
	// Get the active camera for the job
	var oCamera = o3DViewport.getCamera();
	
	// Get the render options for the job
	var oRenderOptions = oRenderMgr.getRenderOptions();
	
	// "Add to Queue" - i.e., send the job to the server
	var oResponse = oRenderer.exportRenderToBridgeQueue( sJobName, sExtension, oCamera, oRenderOptions, nPriority );
	
	// Declare working variable
	var sMessage;
	
	// If we have an error message member
	if( oResponse.hasOwnProperty( "errorMsg" ) ){
		// Get the error message
		sMessage = oResponse[ "errorMsg" ];
		
		// If we have an error message
		if( !sMessage.isEmpty() ){
			// Inform the user
			MessageBox.warning( text( sMessage ),
				text( "NVIDIA Iray Bridge" ), text( "&OK" ), "" );
			
			// We are done...
			return;
		}
	}
	
	// If we are monitoring the job
	if( bMonitorJob ){
		// Open the URL in the system default browser
		App.showURL( String( "%1://%2:%3" ).arg( sProtocol ).arg( sServerAddress ).arg( sPort ) );
	}
	
// Finalize the function and invoke
})();