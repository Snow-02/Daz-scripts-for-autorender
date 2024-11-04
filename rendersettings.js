// Source: http://docs.daz3d.com/doku.php/public/software/dazstudio/4/referenceguide/scripting/api_reference/samples/rendering/render_settings_find_property/start

// Define an anonymous function;
// serves as our main loop,
// limits the scope of variables
(function(){
	
	/*********************************************************************/
	// Array<DzProperty> : A function for getting a list of the properties in a group
	// Parameters:
	// oGroup - The group object
	// bTraverse - Whether to traverse sibling groups
	// bRecurse - Whether to recurse child groups
	function getGroupProperties( oGroup, bTraverse, bRecurse )
	{
		// Declare an array to hold properties
		var aProperties = [];
		
		// If a group is not passed in
		if( !oGroup ){
			// We are done, return an empty array
			return aProperties;
		}
		
		// Get the number of proeprties in the group
		var nProperties = oGroup.getNumProperties();
		// Pre-size the properties array
		aProperties = new Array( nProperties );
		// Iterate over the properties, setting each element in the array
		for( var i = 0; i < nProperties; i += 1 ){
			// Assign the property to the position in the array
			aProperties[ i ] = oGroup.getProperty( i );
		}
		
		// If we are recursing
		if( bRecurse ){
			// Concatenate the properties array from child groups
			aProperties = aProperties.concat(
				getGroupProperties( oGroup.getFirstChild(), true, bRecurse ) );
		}
		
		// If we are traversing
		if( bTraverse ){
			// Concatenate the properties array from sibling groups
			aProperties = aProperties.concat(
				getGroupProperties( oGroup.getNextSibling(), bTraverse, bRecurse ) );
		}
 		
		// Return the array of properties
		return aProperties;
	};
	
	/*********************************************************************/
	// Array<DzProperty> : A function for getting the list properties for an element
	// Parameters:
	// oElement - The target element
	// bTraverse - Whether to traverse sibling groups
	// bRecurse - Whether to recurse child groups
	function getElementProperties( oElement, bTraverse, bRecurse )
	{
		// Get the property group tree for the element
		var oPropertyGroupTree = oElement.getPropertyGroups();
		
		// If the application version is 4.9.4.101 or newer and we want all properties
		if( App.version64 >= 0x0004000900040065 && bTraverse && bRecurse ){
			// Return the properties for the element
			return oPropertyGroupTree.getAllProperties();
		}
		
		// Get the first group in the tree
		var oPropertyGroup = oPropertyGroupTree.getFirstChild();
		// Return the properties for the element
		return getGroupProperties( oPropertyGroup, bTraverse, bRecurse );
	};
	
	/*********************************************************************/
	// DzProperty : A function for finding a property associated with an element
	// Parameters:
	// oElement - The target element
	// sProperty - The property name
	// bUseLabel - Whether to use the label to find the property
	function findElementProperty( oElement, sProperty, bUseLabel )
	{
		// Whether or not to use optimizations; 4.7.1.44 or newer
		var bUseOptimization = (App.version64 >= 0x000400070001002c);
		
		// Declare a working variable
		var oProperty;
		
		// If the application version is 4.7.1.44 or newer and we are not using
		// the label to find, or the application version is 4.11.0.166 or newer
		if( (bUseOptimization && !bUseLabel) ||
			App.version64 >= 0x0004000b000000a6 ){
			// Get the property group tree for the element
			var oPropertyGroupTree = oElement.getPropertyGroups();
			
			// If we are using the label
			if( bUseLabel ){
				// Attempt to find the property
				oProperty = oPropertyGroupTree.findPropertyByLabel( sProperty );
			// If we are not using the label
			} else {
				// Attempt to find the property
				oProperty = oPropertyGroupTree.findProperty( sProperty );
			}
			
			// If we found a property
			if( oProperty ){
				// We are done, return it
				return oProperty;
			}
		// Otherwise
		} else {
			// Get the properties of the element
			var aProperties = getElementProperties( oElement, true, true );
			// Iterate over the properties
			for( var i = 0; i < aProperties.length; i += 1 ){
				// Get the 'current' property
				oProperty = aProperties[i];
				
				// If we are using the label
				if( bUseLabel ){
					// If the label of the property is the one we are looking for
					if( oProperty.getLabel() == sProperty ){
						// We are done, return it
						return oProperty;
					}
				// If we are not using the label
				} else {
					// If the name of the property is the one we are looking for
					if( oProperty.name == sProperty ){
						// We are done, return it
						return oProperty;
					}				
				}
			}
		}
		
		// Declare working variables
		var oChild;
		
		// Iterate over the child elements
		for( var i = 0, nChildren = oElement.getNumElementChildren(); i < nChildren; i += 1 ){
			// Get the 'current' child element
			oChild = oElement.getElementChild( i );
			// Get the property from the child
			oProperty = findElementProperty( oChild, sProperty, bUseLabel );
			
			// If we are using a version with optimizations
			if( bUseOptimization ){
				// If we have a property
				if( oProperty ){
					// We are done, return it
					return oProperty;
				}
			// Otherwise
			} else {
				// If we are using the label
				if( bUseLabel ){
					// If the label of the property is the one we are looking for
					if( oProperty.getLabel() == sProperty ){
						// We are done, return it
						return oProperty;
					}
				// If we are not using the label
				} else {
					// If the name of the property is the one we are looking for
					if( oProperty.name == sProperty ){
						// We are done, return it
						return oProperty;
					}				
				}
			}
		}
		
		return null;
	};
	
	/*********************************************************************/
	// DzProperty : A function to find a property associated with a renderer
	// Parameters:
	// sRenderer - The renderer name
	// sElement - The element name
	// sProperty - The property name
	// bUseLabel - Whether to use the label to find the property
	// bActivate - Whether to activate the renderer
	function findRendererProperty( sRenderer, sElement, sProperty, bUseLabel, bActivate )
	{
		// Get the render manager
		var oRenderMgr = App.getRenderMgr();
		
		// Find the desired renderer
		var oRenderer = oRenderMgr.findRenderer( sRenderer );
		// If we did not find the renderer
		if( !oRenderer ){
			// We are done..
			return null;
		}
		
		// Get the active renderer
		var oActiveRenderer = oRenderMgr.getActiveRenderer();
		
		// If we have an active renderer and it is not the one we want
		if( oActiveRenderer && oActiveRenderer.className() != sRenderer ){
			// If we are not activating the renderer
			if( !bActivate ){
				// We are done
				return null;
			}
			
			// Set the active renderer
			oRenderMgr.setActiveRenderer( oRenderer );
		}
		
		// Declare working variables
		var oElement, oProperty;
		
		// Get the render elements; which hold the properties
		var aRenderElements = oRenderMgr.getRenderElementObjects();
		// Iterate over the elements
		for( var i = 0; i < aRenderElements.length; i += 1 ){
			// Get the 'current' element
			oElement = aRenderElements[i];
			
			// If an element name is specified and the 'current' element is not
			// named as the one we are looking for
			if( !sElement.isEmpty() && oElement.name != sElement ){
				// Next!
				continue;
			}
			
			// Find a specific property by name
			oProperty = findElementProperty( oElement, sProperty, bUseLabel );
			// If we found a property
			if( oProperty ){
				// We are done, return it
				return oProperty;
			}
		}
		
		return null;
	};
	
	/*********************************************************************/
	// Find a specific property by name
	//Renderer: "DzIrayRenderer", "DzDelightRenderer", "DzScriptedRenderer"
	//Element: "General Render", "" = no filter
	var oProperty = findRendererProperty( "DzIrayRenderer", "", "Image Name", false, true );
	
	// If we found a property
	if( oProperty ){
		// Provide feedback
		print( "Found:", oProperty.name, ":", oProperty.getLabel() );
	}
	
// Finalize the function and invoke
})();