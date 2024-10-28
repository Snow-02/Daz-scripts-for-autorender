// 获取 ContentManager
var contentMgr = App.getContentMgr();
if (!contentMgr) {
    print("无法获取 ContentManager");
    return;
}

// 定义要搜索的路径
var characterPath = "D:/Daz3D/ziyuanku/People/Genesis 9/Characters";
// 获取角色列表
var characterList = [];
var rootNode = contentMgr.getContentNode(characterPath);
if (rootNode) {
    var children = rootNode.getNodeChildren();
    for (var i = 0; i < children.length; i++) {
        var child = children[i];
        if (child.getAssetType() == "Figure/Character") {
            characterList.push(child.getAssetUrl());
        }
    }
}

// 打印角色列表
print("找到的角色列表:");
for (var i = 0; i < characterList.length; i++) {
    print(characterList[i]);
}

// 使用角色列表
for (var i = 0; i < characterList.length; i++) {
    // 清除当前场景
    Scene.clear();
    
    // 加载角色
    contentMgr.openFile(characterList[i]);
    print("load successfully");
    // ... 其余处理代码 ...
}

print("finished");