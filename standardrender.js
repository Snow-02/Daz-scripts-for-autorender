// DAZ Studio version 4.5  filetype DAZ Script
/**********************************************************************
 
	Copyright (C) 2002-2023 Daz 3D, Inc. All Rights Reserved.
 
	This script is provided as part of the Daz Script Documentation. The
	contents of this script, and\or any portion thereof, may only be used
	in accordance with the following license:
 
	Creative Commons Attribution 3.0 Unported (CC BY 3.0)
	- http://creativecommons.org/licenses/by/3.0
 
	To contact Daz 3D or for more information about Daz Script visit the
	Daz 3D website:
 
	- http://www.daz3d.com
 
**********************************************************************/
// Source: ./scripts/support/DAZ/ScriptedRenderer/Standard Example/StandardExampleRenderScript.dsa
/**********************************************************************
"Renderer" - is a transient global variable provided by the interpreter
when this script is called via DzScriptedRenderer::setRenderScript(),
that references DzScriptedRenderer.

"RenderOptions" - is a transient global variable referring to the current
options for the scripted renderer.
**********************************************************************/
// This script is called once per frame.
/**********************************************************************/

var oOwner = Renderer.getPropertyHolder();

// Initialize
var aShadows = [ "" ];
var aParams = [ 1 ];
var aTokens = [ "" ];

var oHandler = Renderer.getHandler();
var sizeRender = oHandler.getSize();

var i = 0;

// SHADOW PASS
/**********************************************************************/
// Construct the path for shadow maps
var sShadowPass = String( "%1/shadowMaps" ).arg( App.getTempPath() );

// Define whether or not to reuse shadow maps
var bKeepShadows = true;

// Render shadows
aShadows = Renderer.doDefaultShadowPass( RenderOptions, Camera, sShadowPass, bKeepShadows );

// OTHER PASSES
/**********************************************************************/
// Add other passes as desired. 
// Passes start with Renderer.riBegin() and end with Renderer.EndWorld();
//..........

// BEAUTY PASS
/**********************************************************************/	
// Default to a standard render; empty path
var sRibPath = "";

// Find the "Render to RIB" property
oProperty = oOwner.findProperty( "Render to RIB" );

// If the property was found, its a bool property and it is "on"
if( oProperty && oProperty.className() == "DzBoolProperty" && oProperty.getBoolValue() == true ){
	// Find the "RIB Path" property
	oProperty = oOwner.findProperty( "RIB Path" );
	// If the property was found and its a file property
	if( oProperty && oProperty.className() == "DzFileProperty" ){
		// Set the rib path to the value of the property
		sRibPath = oProperty.getValue();
	}
}

// Begin describing the render
Renderer.riBegin( sRibPath );

// Start with the default
var nFilter = RenderOptions.pixelFilter;
// Find the "Pixel Filter" property
oProperty = oOwner.findProperty( "Pixel Filter" );
// If the property was found and its an enum property
if( oProperty && oProperty.className() == "DzEnumProperty" ){
	// Set the filter according to the value of the property
	switch( oProperty.getValue() ){
		case 0:
			nFilter = RenderOptions.Box;
			break;
		case 1:
			nFilter = RenderOptions.Triangle;
			break;
		case 2:
			nFilter = RenderOptions.CatmullRom;
			break;
		case 3:
			nFilter = RenderOptions.Gaussian;
			break;
		default:
		case 4:
			nFilter = RenderOptions.Sinc;
			break;
	}
}
	
// Start with the default
var nWidthX = RenderOptions.xFilterWidth;
// Find the "Pixel Filter Width X" property
oProperty = oOwner.findProperty( "Pixel Filter Width X" );
// If the property was found and its a float property
if( oProperty && oProperty.className() == "DzFloatProperty" ){
	// Set the X width according to the value of the property
	nWidthX = oProperty.getValue();
}

// Start with the default
var nWidthY = RenderOptions.xFilterWidth;
// Find the "Pixel Filter Width X" property
oProperty = oOwner.findProperty( "Pixel Filter Width Y" );
// If the property was found and its a float property
if( oProperty && oProperty.className() == "DzFloatProperty" ){
	// Set the Y width according to the value of the property
	nWidthY = oProperty.getValue();
}

// Set the pixel filter
Renderer.riPixelFilter( nFilter, nWidthX, nWidthY );


// Specify shader search path
aTokens = [ "string shader" ];
aParams = [ Renderer.getDefaultShaderSearchPath() ];
Renderer.riOption( "searchpath", aTokens, aParams );


// Start with the default
var sOrder = "horizontal";
// Find the "Bucket Order" property
oProperty = oOwner.findProperty( "Bucket Order" );
// If the property was found and its an enum property
if( oProperty && oProperty.className() == "DzEnumProperty" ){
	// Set the bucket order according to the value of the property
	sOrder = oProperty.getStringValue();
}

// Set the bucket order
aTokens = [ "bucketorder" ];
aParams = [ sOrder.lower() ];
Renderer.riOption( "render", aTokens, aParams );


// Start with the default
var nSize = 16;
// Find the "Bucket Size" property
oProperty = oOwner.findProperty( "Bucket Size" );
// If the property was found and its an int property
if( oProperty && oProperty.className() == "DzIntProperty" ){
	// Set the size according to the value of the property
	nSize = oProperty.getValue();
}

// Set the bucket size
aTokens = [ "integer bucketsize[2]" ];
aParams = [ [nSize, nSize] ];
Renderer.riOption( "limits", aTokens, aParams );


// Start with the default
var nDepth = RenderOptions.rayTraceDepth;
// Find the "Max Ray Depth" property
oProperty = oOwner.findProperty( "Max Ray Depth" );
// If the property was found and its an int property
if( oProperty && oProperty.className() == "DzIntProperty" ){
	// Set the max ray depth according to the value of the property
	nDepth = oProperty.getValue();
}

// Set the max ray depth
aTokens = [ "integer maxdepth" ];
aParams = [ nDepth ];
Renderer.riOption( "trace", aTokens, aParams );


// Start with the default
var nGain = RenderOptions.gain;
// Find the "Gain" property
oProperty = oOwner.findProperty( "Gain" );
// If the property was found and its a float property
if( oProperty && oProperty.className() == "DzFloatProperty" ){
	// Set the gain according to the value of the property
	nGain = oProperty.getValue();
}

// Start with the default
var nGamma = RenderOptions.gamma;
// Find the "Gamma" property
oProperty = oOwner.findProperty( "Gamma" );
// If the property was found and its a float property
if( oProperty && oProperty.className() == "DzFloatProperty" ){
	// Set the gamma according to the value of the property
	nGamma = oProperty.getValue();
}

// Set exposure
Renderer.riExposure( nGain, nGamma );


// Start with the default
var nRate = RenderOptions.shadingRate;
// Find the "Shading Rate" property
oProperty = oOwner.findProperty( "Shading Rate" );
// If the property was found and its a float property
if( oProperty && oProperty.className() == "DzFloatProperty" ){
	// Set the shading rate according to the value of the property
	nRate = oProperty.getValue();
}

// Set shading rate
Renderer.riShadingRate( nRate );


// Start with the default
var nSamplesX = RenderOptions.xPixelSamples;
// Find the "Pixel Samples X" property
oProperty = oOwner.findProperty( "Pixel Samples X" );
// If the property was found and its a int property
if( oProperty && oProperty.className() == "DzIntProperty" ){
	// Set the x samples according to the value of the property
	nSamplesX = oProperty.getValue();
}

// Start with the default
var nSamplesY = RenderOptions.yPixelSamples;
// Find the "Pixel Samples Y" property
oProperty = oOwner.findProperty( "Pixel Samples Y" );
// If the property was found and its a int property
if( oProperty && oProperty.className() == "DzIntProperty" ){
	// Set the y samples according to the value of the property
	nSamplesY = oProperty.getValue();
}

// Set the pixel samples
Renderer.riPixelSamples( nSamplesX, nSamplesY );


// Set the number of sides
Renderer.riSides( RenderOptions.doubleSided ? 2 : 1 );

// Setup shutter for motion blur
Renderer.doShutter( RenderOptions );

// Set up the camera
Renderer.cameraProject( Camera, sizeRender.width, sizeRender.height );

// Set up crop window
Renderer.setCropWindow( oHandler );

// Set up the display(s)
Renderer.doDefaultDisplay();

// Set the background color; from the active viewport
if( BackDrop && BackDrop.getTexture()  ){
	Renderer.renderBackDrop( BackDrop, sizeRender.width, sizeRender.height );
} else { // TODO: Check for DzShaderCamera & DzBrickCamera with Imager
	var oViewportMgr = MainWindow.getViewportMgr();
	var oViewport = oViewportMgr.getActiveViewport();
	var o3DViewport = oViewport.get3DViewport();
	
	aTokens = [ "color bgcolor" ];
	//aParams = [ [o3DViewport.background.red, o3DViewport.background.green, o3DViewport.background.blue] ];
	aParams = [ o3DViewport.background ];
	Renderer.riImager( "background", aTokens, aParams );
}

// Begin describing the scene
Renderer.riWorldBegin();
Renderer.buildEnvironmentSpaceTransform();

// Render each light
var nCount = Renderer.getLightCount();
// TODO: Check for only Area Light(s) in the scene
// Use the headlamp if there are no lights
if( nCount < 1 ){
    Renderer.createLight( Camera.getHeadlight(), "" );
} else {
	var sShadow = "";
	for( i = 0; i < nCount; i += 1 ){
		if( aShadows.length > i ){
			sShadow = aShadows[ i ];
		}
		
		Renderer.createLight( Renderer.getLight( i ), sShadow );
	}
}

// Motion Blur Setup does nothing if motion blur is not setup
Renderer.prepareMotionSamples();

// Render each node
for( i = 0; i < Renderer.getNodeCount(); i += 1 ){
	Renderer.renderNode( Renderer.getNode( i ) );
}

// Start rendering; the string argument is shown in the progress dialog
Renderer.riEndWorld( "Rendering: Scripted Render Example..." );

// Clean up shadows, if desired
if( !bKeepShadows ){
	Renderer.deleteFiles( aShadows );
}

// OTHER PASSES
/**********************************************************************/
// Add other passes as desired. 
// Passes start with Renderer.riBegin() and end with Renderer.EndWorld();
//..........