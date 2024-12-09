import os


def find_duf_files(directory):
    """
    查找指定目录中的所有.duf文件

    参数:
    directory (str): 要搜索的目录路径

    返回:
    list: 包含所有.duf文件完整路径的列表
    """
    # 存储.duf文件路径的列表
    duf_files = []

    # 遍历目录中的所有文件
    for file in os.listdir(directory):
        # 获取文件的完整路径
        full_path = os.path.join(directory, file)
        # 筛选出以.duf结尾的文件并确保是文件而不是目录
        if os.path.isfile(full_path) and file.lower().endswith(".duf"):
            duf_files.append(full_path.replace("\\", "/"))

    return duf_files


def find_hair_duf_files(directory):
    """
    查找指定目录中文件名包含'hair'的.duf文件

    参数:
    directory (str): 要搜索的目录路径

    返回:
    list: 包含所有符合条件的.duf文件完整路径的列表
    """
    # 存储符合条件的.duf文件路径的列表
    hair_duf_files = []

    # 遍历目录中的所有文件和子目录
    for root, dirs, files in os.walk(directory):
        # 筛选出文件名包含'hair'且以.duf结尾的文件
        for file in files:
            if file.lower().endswith(".duf") and "hair" in file.lower():
                # 获取文件的完整路径
                full_path = os.path.join(root, file)
                hair_duf_files.append(full_path.replace("\\", "/"))

    return hair_duf_files


# 使用示例
def main(path):
    # 指定要搜索的目录路径
    search_directory = path

    # 获取.duf文件列表
    # duf_files = find_duf_files(search_directory)
    hair_files = find_hair_duf_files(search_directory)
    # 打印找到的.duf文件
    print(f"找到 {len(hair_files)} 个 .duf 文件:")
    for file in hair_files:
        print(file)

    # return duf_files
    return hair_files


# 只有在直接运行脚本时才执行main()函数
if __name__ == "__main__":
    duf_files_list = main(path="D:\Daz3D\G8Content\People\Genesis 8 Male\Hair")
    print("[")
    for file in duf_files_list:
        print(f'"{file}",')
    print("]")
