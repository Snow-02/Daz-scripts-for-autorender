// DAZ Studio version 4.22.0.19 filetype DAZ Script
// DAZ Studio Script

var appName = "export_to_blender";
var version = "\"4.2.0.2261\"";
var useExportHD = false;
var useHDConvention = false;
var useHDUVs = true;

function exportHighdefToBlender(filepath)
{
    var date1 = new Date();
    var time1 = date1.getTime();
    var filepath0 = filepath + "0"
    fp = new DzFile( filepath0 );
    fp.open( fp.WriteOnly );

    fp.writeLine("{");
    fp.writeLine("    \"application\": \"export_highdef_to_blender\",");
    fp.writeLine("    \"version\": " + version + ",");

    fp.writeLine("    \"figures\": [");

    for ( var i = 0; i < Scene.getNumNodes(); i++ )
    {
        var node = Scene.getNode(i);

        if ( node.inherits( "DzSkeleton" ) )
        {
            doFigure(fp, node);
        }
        else
        {
            obj = node.getObject();
            if (obj != null)
            {
                doMesh(fp, obj, true, node, "        ]", "    },");
            }
            else
            {
                var clname = node.className();
                if (clname != "DzBone")
                {
                    startObject(fp, node, node.assetId, "", "");
                    fp.writeLine("    }," );    
                }
            }
        }
    }

    fp.writeLine("    {" );
    fp.writeLine("        \"name\": \"dummy\",");
    fp.writeLine("        \"num verts\": 0");
    fp.writeLine("    }" );

    fp.writeLine("    ]");
    fp.writeLine("}" );
    fp.close();

    var fp1 = new DzGZFile( filepath );
    var ok = fp1.zip(filepath0);
    fp1.close();
    if (ok) {
        fp.remove()
    }
    else {
        var oDir = fp.dir();
        oDir.move(filepath0, filepath)
    }

    var date2 = new Date();
    var time2 = date2.getTime();
    if (ok)
        msg = "GZipped file \"" + filepath + "\"\nsaved in " + (time2-time1)/1000 + " seconds.";
    else
        msg = "Text file \"" + filepath + "\"\nsaved in " + (time2-time1)/1000 + " seconds.";
    print(msg);
}


function doFigure(fp, figure)
{
    figure.finalize();
    startObject(fp, figure, figure.name, "", ",");

    var obj = figure.getObject();
    if (obj != null)
    {
        doMesh(fp, obj, false, figure, "        ],", "");
    }

    var bones = figure.getAllBones();
    var n = bones.length;

    fp.writeLine("        \"bones\": ");
    fp.writeLine("        [");
    c = ","
    for( var i = 0; i < n; i++ )
    {
        bone = bones[i];
        bone.finalize();
        startObject(fp, bone, bone.name, "        ", ",")
        fp.writeLine("                \"origin\": " + bone.getOrigin());             
        if (i == n-1) c = "";
        fp.writeLine("            }" + c );
    }
    fp.writeLine("        ]");
    fp.writeLine("    }," );
}

//===============================================================================
//
//===============================================================================

function startObject(fp, node, name, pad, endchar)
{        
    fp.writeLine(pad + "    {" );
    fp.writeLine(pad + "        \"name\": \"" + normString(name) + "\",");
    fp.writeLine(pad + "        \"id\": \"" + normString(node.assetId) + "\",");
    fp.writeLine(pad + "        \"label\": \"" + normString(node.getLabel()) + "\",");
    fp.writeLine(pad + "        \"center_point\": " + node.getOrigin() + ",");
    fp.writeLine(pad + "        \"end_point\": " + node.getEndPoint() + ",");     
    fp.writeLine(pad + "        \"orientation\": " + node.getOrientation() + ",");             
    fp.writeLine(pad + "        \"rotation_order\": \"" + node.getRotationOrder() + "\",");             
    fp.writeLine(pad + "        \"ws_transform\": " + node.getWSTransform() + endchar);             
}


function normString(string)
{
    return string.replace(/\n/g, " ");
}


function doMesh(fp, obj, start, node, str1, str2)
{
    var shape = obj.getCurrentShape();
    if (shape == null)
        return false;
    var clname = node.className();
    if (start)
        startObject(fp, node, node.name, "", ",");
    fp.writeLine("        \"class\": \"" + clname + "\",");
    var useBase = true;
    var label = node.getLabel();
    if (useExportHD && (label.endsWith("HD") || !useHDConvention))
        useBase = doHDMesh(fp, obj, shape, clname, node, str1, str2);
    if (useBase)
    	doBaseMesh(fp, obj, shape, clname, node, str1, str2);
}


function doHDMesh(fp, obj, shape, clname, node, str1, str2)
{
    //obj.forceCacheUpdate(node,false);
    var geom = obj.getCachedGeom();
    var geom0 = shape.getGeometry();
    var nv = geom.getNumVertices();
    var nv0 = geom0.getNumVertices();
    var level = shape.getSubDDrawLevel();

    if (clname == "DzGeometryShellNode") {
        fp.writeLine("        \"num verts\": " + nv0 + ",");
        fp.writeLine("        \"num hd verts\": " + nv + ",");
        if (useHDUVs)
            doUVs(fp, geom, "hd ");
        doFaces(fp, geom, "hd ");
        doMaterialGroups(fp, geom, "hd ", "");
        fp.writeLine(str2);
	return false;
    }

    var nf = geom.getNumFacets();
    if (nv != nv0 && nf > 0)
    {
        fp.writeLine("        \"subd level\": " + level + ",");
        doVertices(fp, geom, "hd ");
        fp.writeLine("        ],");
        if (useHDUVs)
            doUVs(fp, geom, "hd ");
        doFaces(fp, geom, "hd ");
        doMaterialGroups(fp, geom, "hd ", ",");
    }
    return true;
}


function doBaseMesh(fp, obj, shape, clname, node, str1, str2)
{
    var lodctrl = shape.getLODControl();
    var lodvalue = lodctrl.getValue();
    lodctrl.setValue(0);
    obj.forceCacheUpdate(node,false);
    var geom = obj.getCachedGeom();
    if (geom == null) {
        lodctrl.setValue(lodvalue);
        return endMesh(fp, str1, str2);
    }

    if (clname == "DzStrandHairNode")
    {
        fp.writeLine("        \"node\": {");
        doProperties(fp, node, "        ");
        fp.writeLine("        },");
        doFaces(fp, geom, "");
    }
    
    fp.writeLine("        \"lod\": " + lodvalue + ",");
    var nf = geom.getNumFacets();
    if (nf == 0)
        doPolylines(fp, geom, "");
    doMaterialGroups(fp, geom, "", ",");
    doVertices(fp, geom, "");
    fp.writeLine(str1);
    fp.writeLine(str2);
    lodctrl.setValue(lodvalue);
    return true;
}


function endMesh(fp, str1, str2)
{
    fp.writeLine("        \"dummy\": 0")
    fp.writeLine(str2);
    return false;
}


function doProperties(fp, mat, pad)
{
    var np = mat.getNumProperties();
    var buf = (pad + "   \"name\": \"" + mat.name + "\",\n");
    buf += (pad + "   \"properties\": {\n" );

    var c = ","
    for (var i = 0; i < np; i++)
    {
        var prop = mat.getProperty(i);
        var value = prop.getValue();
        if (i == np-1) c = "";
        if (prop.isNumeric())
            buf += (pad + "      \"" + prop.name + "\": " + value + c + "\n");
    }
    buf += (pad + "   }");
    fp.writeLine(buf);
}

function doMaterialGroups(fp, geom, hd, endchar)
{
    var nm = geom.getNumMaterialGroups();
    fp.writeLine("        \"" + hd + "material groups\": [" );

    var c = ","
    for (var i = 0; i < nm; i++)
    {
        var mat = geom.getMaterialGroup(i);
        if (i == nm-1) c = "";
        fp.writeLine("            \"" + mat.name + "\"" + c);
    }
    fp.writeLine("        ]" + endchar);
}

function doVertices(fp, geom, hd)
{
    var nv = geom.getNumVertices();
    var nf = geom.getNumFacets();
    var buf = ("        \"num " + hd + "verts\": " + nv + ",\n");
    buf += ("        \"" + hd + "vertices\": [\n" );

    var c = ",\n"
    for (var i = 0; i < nv; i++)
    {
        var v = geom.getVertex(i);
        if (i == nv-1) c = "";
        buf += ("            [" + v.x + ", " + v.y + ", " + v.z + "]" + c)
    }
    fp.writeLine(buf);
}

function doUVs(fp, geom, hd)
{
    var uvs = geom.getUVs();
    var nuv = uvs.getNumValues();
    var label = uvs.getLabel();
    var buf = ("        \"" + hd + "uvset\": \"" + label + "\",\n");
    buf += ("        \"" + hd + "uvs\": [\n" );
    var c = ",\n"
    for (var i = 0; i < nuv; i++)
    {
        var uv = uvs.getPnt2Vec(i);
        if (i == nuv-1) c = "\n";
        buf += ("            [" + uv.x + ", " + uv.y + "]" + c);
    }
    buf += ("        ],");
    fp.writeLine(buf);
}

function doPolylines(fp, geom, hd)
{
    var npl = geom.getNumPolylines();
    var buf = ("        \"" + hd + "polylines\": [\n" );
    var c = ",\n"
    for (var i = 0; i < npl; i++)
    {
        var vlist = geom.getPolylineVertexIndices(i);
        if (i == npl-1) c = "\n";
        buf += ("            [" + vlist + "]" + c)
    }
    buf += ("        ],");
    fp.writeLine(buf);

    buf = ("        \"" + hd + "polyline_materials\": [" );
    c = ","
    for (var i = 0; i < npl; i++) 
    {
        var idx = geom.getPolylineMaterialGroupIndex(i);
        if (i == npl-1) c = "";
        buf += (idx + c)
    }
    buf += ("],");
    fp.writeLine(buf);    
}

function doFaces(fp, geom, hd)
{
    var nf = geom.getNumFacets();
    var buf = ("        \"" + hd + "faces\": [\n" );
    var c = ",\n"
    for (var i = 0; i < nf; i++)
    {
        var f = geom.getFacet(i);
        if (i == nf-1) c = "\n";
        buf += ("            " + f + c)
    }
    buf += ("        ],");
    fp.writeLine(buf);
}

function getScenePath()
{
    var fPath = Scene.getFilename(); //get current scene file path
    var val = fPath.left( fPath.length - 4 ) + ".dbz"; // .duf => .dbz
    return (val);
}

function export_to_blender (){
    var filepath =  getScenePath();
    exportHighdefToBlender(filepath);
};


(function (){
	// set assert path
	var clothes = [
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Alt Style Outfit/Alt Style - !Outfit All.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Aries/Aries outfit.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Back 2 School/Back 2 School !Outfit A.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Back 2 School/Back 2 School !Outfit B.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Bedu Desert Warrior/Bedu !Desert Warrior Outfit Load All.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Bellowtalons Knight/Bellowtalons Knight Outfit.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/BlackGuard Outfit/BlackGuard !Full Outfit.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/DeNimes/DeNimes !Outfit.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/dForce Adventurer Knight/AK !Outfit.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/dForce Biker Outfit/Biker !Outfit.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/dForce Bridge Officer Outfit/Bridge Office !Outfit.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/dForce Monte Carlo Suit/Monte Carlo ! Suit Outfit.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/dForce On Vacation/On Vacation !Outfit.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/dForce PJs/PJs !Outfit.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/dForce Traditional Outfit/Traditional !Outfit.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/dForce Wise Master/Wise Master !Outfit.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/East Meets West/East Meets West Outfit.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Fleet Commander/Fleet Commander Outfit!!.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Grunge Outfit/Grunge !Outfit.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Gunslinger/Gunslinger !Outfit.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Hipster Outfit/Hipster - !Outfit All.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Hudson/Hudson Outfit.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Leviathan/dForce Urban Casual Outfit for Genesis 8 Male/Urban Casual Outfit.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Luthbel/Shogun Samurai Armor/1. Wearable Presets/Shogun Preset - Jimbaori Outfit.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Luthbel/Shogun Samurai Armor/1. Wearable Presets/Shogun Preset - Training Outfit.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/mal3Imagery/MI CasualOutfit/MI CasualOutfit !Full.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Midnight_stories/Biohazard/Biohazard !Outfit.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Onyx Outfit/Onyx !Outfit 1.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Onyx Outfit/Onyx !Outfit 2.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Oskarsson/Mad Scientist/Mad Scientist Outfit.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Oskarsson/Regency Outfit/Regency Outfit.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Paladin of Solitude/Paladin Solitude !!Outfit.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Party Oahu Outfit/Party Oahu Outfit !Load All 1.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Party Oahu Outfit/Party Oahu Outfit !Load All 2.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Peacock Hanfu Outfit/Peacock Hanfu Outfit ! Load All.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Poolside Oahu Outfit/Poolside Oahu Outfit !Load All 1.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Poolside Oahu Outfit/Poolside Oahu Outfit !Load All 2.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Poseidon/Poseidon !Outfit.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/PRZ White Tie/PRZ White Tie ! Suit Outfit.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/PRZ White Tie/PRZ White Tie !Mess Dress Outfit.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Q Suit/Q Suit Outfit !Load All Closed.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Q Suit/Q Suit Outfit !Load All Open.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Q Suit/Q Suit Outfit Jacket Closed.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Q Suit/Q Suit Outfit Jacket Open.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Raven Guild Assassin/Raven Guild Assassin Outfit.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Shrouded Assassin/Shrouded Assassin ! Outfit.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Sky Rebel Outfit/Sky Rebel !Outfit.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Sleuth Detective/Sleuth Detective !Outfit.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Summer Time G8/Summer Time G8 !Outfit A.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Summer Time G8/Summer Time G8 !Outfit B.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Sweater Vest/Sweater Vest Outfit.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/tentman/Niwashi/Niwashi !Outfit.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Toyen/dForce Priest Outfit/Priest !Outfit.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Toyen/The Count Outfit/The Count !Outfit.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Weathered Warrior/Weathered Warrior !Outfit.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Winston Avenue/Winston Avenue Outfit.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/BadKittehCo/BKCAxoran/200 Axoran Wearables/BKC Axoran Full Set.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Battle Pilot Outfit for Genesis 8 Male(s)/Battle Pilot !Full Set.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/BlackGuard Outfit/BlackGuard !Full Outfit.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Luthbel/Shogun Samurai Armor/1. Wearable Presets/Shogun Preset - Full Shogun Armor.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Luthbel/Shogun Samurai Armor/1. Wearable Presets/Shogun Preset - Full Yoroi Armor.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/mal3Imagery/MI CasualOutfit/MI CasualOutfit !Full.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Midnight_stories/Hydron Suit/HDN Suit Full G8M.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Noah Sci-fi Outfit for Genesis 8 Male(s)/Noah Sci-fi Full Set.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Raven Guild Assassin/Raven Guild Assassin FullTop.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Sci-fi Police Officer Outfit for Genesis 8 Male(s)/Sci-fi Police Officer Full Set.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Victorian Butler/Victorian Butler 00 JacketdForceFull.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Battle Worn Armour/Battle Worn Armour Complete.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Deadly Warrior/Deadly Warrior !Complete.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/HC dForce Space Tech Jumpsuit/HCST Space Tech Complete.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Alt Style Outfit/Alt Style - !Outfit All.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Anubis Priest/Anubis Priest !Load All.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Bedu Desert Warrior/Bedu !Desert Warrior Outfit Load All.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Charming Rogue/Charming Rogue ! Load All.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/dForce Adventurer Knight/AK Zero Small Toes.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/dForce Wise Master/Wise Master Zero Small Toes.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Gate Guardian/Gate Guardian ! ALL.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/GIS Commander/!CommanderALL.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/High Elf/!HighElfALL.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Hipster Outfit/Hipster - !Outfit All.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Meshitup/AWO/AWO !!Load All.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Meshitup/MBM/MBM !!Load All.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Meshitup/MCC/MCC !! Load All.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Morphing Fantasy Armor/SYMFA 0 Morphing Fantasy Armor All.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/My Guy Jeans and Shirt/My Guy Jeans and Shirt !All.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Oskarsson/Trenchcoat/Trench Coat All.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Pajamas/Pajamas ! Load All 01.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Pajamas/Pajamas ! Load All 02.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Party Oahu Outfit/Party Oahu Outfit !Load All 1.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Party Oahu Outfit/Party Oahu Outfit !Load All 2.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Peacock Hanfu Outfit/Peacock Hanfu Outfit ! Load All.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Poolside Oahu Outfit/Poolside Oahu Outfit !Load All 1.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Poolside Oahu Outfit/Poolside Oahu Outfit !Load All 2.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Q Suit/Q Suit Outfit !Load All Closed.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Q Suit/Q Suit Outfit !Load All Open.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Realm Keeper/!RealmKeeperALL.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Regal Protector For Him/!Regal Protector For Him ALL.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Showdown Outfit/Showdown !Load All.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Summer Vacation Outfit/Summer Vacation - !All.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Victorian Butler/Victorian Butler ! ALL.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Vintage Doctor/!VintageDoctorALL.duf"
	];
	var figures = [
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Characters/Armand.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Characters/Chance.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Characters/Chen.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Characters/Connor.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Characters/Darsel.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Characters/EJ Fabio.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Characters/Fiore.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Characters/Giovanni.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Characters/Gordon HD.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Characters/Gui.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Characters/Hanler.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Characters/Henry.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Characters/Hisashi.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Characters/Jean HD.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Characters/Jean.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Characters/Jonathan 8.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Characters/Kane.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Characters/Kasper.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Characters/Keith.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Characters/Kichiro.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Characters/Lee 7.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Characters/Lee 8.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Characters/Martin.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Characters/Michael 7 for Genesis 8 Male.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Characters/Michael 8.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Characters/Mr Woo 8.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Characters/Nathanial.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Characters/Ogrec.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Characters/Owen 8.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Characters/Ravi.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Characters/Raw Jester.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Characters/Raw Sturrm.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Characters/Riku.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Characters/Robert.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Characters/Roy HD.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Characters/SF-D Nick.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Characters/Shane.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Characters/VW East Asian Batbayar.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Characters/VW East Asian Chen.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Characters/VW East Asian Fujio.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Characters/VW East Asian Haro.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Characters/VW East Asian Hyun Tae.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Characters/VW East Asian Ichizo.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Characters/VW East Asian Ishi.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Characters/VW East Asian Jun.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Characters/VW East Asian Junsu.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Characters/VW East Asian Lee.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Characters/VW East Asian Naoto.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Characters/VW East Asian Shang.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Characters/VW East Asian Sumo Yutaka.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Characters/VW East Asian Takahiro.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Characters/VW East Asian Teen Chikao.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Characters/VW East Asian Teen Fujio.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Characters/VW East Asian Teen Lee.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Characters/VW East Asian Wong.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Characters/VW East Asian Yu.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Characters/VW East Asian Yuen.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Characters/Yong.duf"
	];
	var hair = [
        "D:/Daz3D/G8Content/People/Genesis 8 Male/Hair/dForce Arix Hair/dForce Arix Hair - High Res.duf",
        "D:/Daz3D/G8Content/People/Genesis 8 Male/Hair/dForce Corporate Hair/dForce Corporate Hair G8M.duf",
        "D:/Daz3D/G8Content/People/Genesis 8 Male/Hair/dForce Greyson Hair/Greyson Hair.duf",
        "D:/Daz3D/G8Content/People/Genesis 8 Male/Hair/dforce Mid-Life Bachelor Hair/dforce Mid-Life Bachelor Hair.duf",
        "D:/Daz3D/G8Content/People/Genesis 8 Male/Hair/dForce Romeo Hair/dForce Romeo Hair G8M.duf",
        "D:/Daz3D/G8Content/People/Genesis 8 Male/Hair/FE Short Hair Vol 2/FE Short Hair Vol 2 Male Hairline 1.duf",
        "D:/Daz3D/G8Content/People/Genesis 8 Male/Hair/FE Short Hair Vol 2/FE Short Hair Vol 2 Male Hairline 5.duf",
        "D:/Daz3D/G8Content/People/Genesis 8 Male/Hair/Jian Hair/Jian Hair Genesis 8 Male.duf",
        "D:/Daz3D/G8Content/People/Genesis 8 Male/Hair/LI Crew Cut Hair/LI Crew Cut Hair.duf",
        "D:/Daz3D/G8Content/People/Genesis 8 Male/Hair/Matthew Hair/Matthew Hair For Genesis 8 Male.duf",
        "D:/Daz3D/G8Content/People/Genesis 8 Male/Hair/Nathan Fade Haircut and Beard/Nathan Fade Haircut G8M.duf",
        "D:/Daz3D/G8Content/People/Genesis 8 Male/Hair/Nikan Hair and Beard/Nikan - Hair.duf",
        "D:/Daz3D/G8Content/People/Genesis 8 Male/Hair/Nikan Hair and Beard/Nikan Hair & Beard.duf",
        "D:/Daz3D/G8Content/People/Genesis 8 Male/Hair/Orson Hair/Orson Hair.duf",
        "D:/Daz3D/G8Content/People/Genesis 8 Male/Hair/Osher Hair/Osher Hair.duf",
        "D:/Daz3D/G8Content/People/Genesis 8 Male/Hair/The Alchemist/Alchemist Hair and Beard/ALC !Hair & Beard Preset G8M.duf",
        "D:/Daz3D/G8Content/People/Genesis 8 Male/Hair/The Alchemist/Alchemist Hair and Beard/Alchemist !Face Hair Preset G8M.duf",
        "D:/Daz3D/G8Content/People/Genesis 8 Male/Hair/The Alchemist/Alchemist Hair and Beard/Alchemist Hair.duf"
	]
	// set output path
	var outputPath = "E:/DazExport/G8export/2k-4k/";
	if(!DzDir(outputPath).exists()){
        DzDir("").mkpath(outputPath)
	}
	var dufpath;
	//
	for (var i = 14; i < 18; i++) {
        for (var j =0; j < clothes.length; j++) {
            for (var k = 7; k < 11; k++) {
                dufpath = outputPath + "model_" + i + "_" + j + "_" + k + "/"+ "model_" + i + "_" + j + "_" + k + ".duf";
                //Restart from the interrupted point
                if(DzFile(dufpath).exists()){
                    print("file exists");
                    continue;
                }
                // clear scene
                Scene.clear();
                // get content manager
                var oMyasset = App.getContentMgr();
                if (oMyasset) {
                    print("read successfully");
                }
                // open figure
                Scene.loadScene(figures[i],"MergeFile");
                //oMyasset.openFile(figures[i]);
                // open cloth
                Scene.loadScene(clothes[j],"MergeFile");
                //oMyasset.openFile(clothes[j], merge=true);
                // open hair
                Scene.loadScene(hair[k],"MergeFile");
                //oMyasset.openFile(hair[k], merge=true);

                var oNode = Scene.getPrimarySelection();

                if (oNode) {
                    var oSkeleton = oNode.getSkeleton();
                    if (oSkeleton) {
                        oNode = oSkeleton;
                    }
                }
                Scene.saveScene(dufpath);
                print("Saved " + i + j + k +"model in" + dufpath);
                // Export to Blender
                export_to_blender();
            }
        }
    }
	print("finished!");
})();
