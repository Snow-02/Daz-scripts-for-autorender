import os


def find_specific_duf_files(directory, keywords=["outfit", "full", "complete", "all"]):
    """
    查找指定目录中文件名包含特定关键词的.duf文件，同时排除包含'material'的文件

    参数:
    directory (str): 要搜索的目录路径
    keywords (list): 要匹配的关键词列表，默认为['outfit', 'full', 'complete', 'all']

    返回:
    dict: 包含匹配每个关键词的.duf文件路径的字典
    """
    # 存储匹配不同关键词的.duf文件路径
    matched_files = {keyword: [] for keyword in keywords}

    # 遍历目录中的所有文件和子目录
    for root, dirs, files in os.walk(directory):
        # 跳过包含'material'的路径
        if "material" in root.lower():
            continue

        # 筛选出以.duf结尾且包含关键词的文件
        for file in files:

            if file.lower().endswith(".duf"):
                # 将文件名转为小写，方便匹配
                lower_filename = file.lower()

                # 检查是否包含任何关键词
                for keyword in keywords:
                    if keyword in lower_filename:
                        # 获取文件的完整路径
                        full_path = os.path.join(root, file)
                        matched_files[keyword].append(full_path.replace("\\", "/"))

    return matched_files


# 使用示例
def main(path):
    # 指定要搜索的目录路径
    search_directory = path

    # 可以自定义关键词列表
    search_keywords = ["outfit", "full", "complete", "all"]

    # 获取匹配文件
    matched_files = find_specific_duf_files(search_directory, search_keywords)

    # 打印找到的文件
    print("[")
    for keyword, files in matched_files.items():
        for file in files:
            print(f'"{file}",')

    print("]")  # 空行分隔不同关键词的结果


# 只有在直接运行脚本时才执行main()函数
if __name__ == "__main__":
    main(path="D:\Daz3D\G8Content\People\Genesis 8 Male\Clothing")
