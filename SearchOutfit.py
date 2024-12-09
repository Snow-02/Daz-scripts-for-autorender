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
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/HM/Iron-Fire Outfit/Iron-Fire !Outfit.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Hudson/Hudson Outfit.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Leviathan/dForce Urban Casual Outfit for Genesis 8 Male/Urban Casual Outfit.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Luthbel/Shogun Samurai Armor/1. Wearable Presets/Shogun Preset - Jimbaori Outfit.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Luthbel/Shogun Samurai Armor/1. Wearable Presets/Shogun Preset - Training Outfit.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/mal3Imagery/MI CasualOutfit/MI CasualOutfit !Full.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/mal3Imagery/MI CasualOutfit/MI CasualOutfit Pants.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/mal3Imagery/MI CasualOutfit/MI CasualOutfit Polo.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/mal3Imagery/MI CasualOutfit/MI CasualOutfit Shoes.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/mal3Imagery/MI CasualOutfit/MI CasualOutfit Watch.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Midnight_stories/Biohazard/Biohazard !Outfit.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Onyx Outfit/Onyx !Outfit 1.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Onyx Outfit/Onyx !Outfit 2.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Oskarsson/Mad Scientist/Mad Scientist Outfit.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Oskarsson/Regency Outfit/Regency Outfit.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Paladin of Solitude/Paladin Solitude !!Outfit.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Party Oahu Outfit/Party Oahu Outfit !Load All 1.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Party Oahu Outfit/Party Oahu Outfit !Load All 2.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Party Oahu Outfit/Party Oahu Outfit Sneakers.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Peacock Hanfu Outfit/Peacock Hanfu Outfit ! Load All.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Peacock Hanfu Outfit/Peacock Hanfu Outfit Headwear.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Peacock Hanfu Outfit/Peacock Hanfu Outfit Jade Accessory.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Peacock Hanfu Outfit/Peacock Hanfu Outfit Robe.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Peacock Hanfu Outfit/Peacock Hanfu Outfit Shirt.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Peacock Hanfu Outfit/Peacock Hanfu Outfit Shoes.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Poolside Oahu Outfit/Poolside Oahu Outfit !Load All 1.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Poolside Oahu Outfit/Poolside Oahu Outfit !Load All 2.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Poolside Oahu Outfit/Poolside Oahu Outfit Closed Shirt.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Poolside Oahu Outfit/Poolside Oahu Outfit Flip Flops.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Poolside Oahu Outfit/Poolside Oahu Outfit Shirt Open.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Poolside Oahu Outfit/Poolside Oahu Outfit Shorts.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Poseidon/Poseidon !Outfit.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/PRZ White Tie/PRZ White Tie ! Suit Outfit.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/PRZ White Tie/PRZ White Tie !Mess Dress Outfit.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Q Suit/Q Suit Outfit !Load All Closed.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Q Suit/Q Suit Outfit !Load All Open.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Q Suit/Q Suit Outfit Jacket Closed.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Q Suit/Q Suit Outfit Jacket Open.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Q Suit/Q Suit Outfit Pants.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Q Suit/Q Suit Outfit Shirt and Tie.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Q Suit/Q Suit Outfit Shoes.duf",
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
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Strangefate/STF BoneBreaker/BoneBreaker ! Complete - Full.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Victorian Butler/Victorian Butler 00 JacketdForceFull.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Battle Worn Armour/Battle Worn Armour Complete.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Deadly Warrior/Deadly Warrior !Complete.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/HC dForce Space Tech Jumpsuit/HCST Space Tech Complete.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Strangefate/STF BoneBreaker/BoneBreaker ! Complete - Barbarian.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Strangefate/STF BoneBreaker/BoneBreaker ! Complete - Full.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Strangefate/STF BoneBreaker/BoneBreaker ! Complete - Gladiator.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Alt Style Outfit/Alt Style - !Outfit All.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Anubis Priest/Anubis Priest !Load All.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Bedu Desert Warrior/Bedu !Desert Warrior Outfit Load All.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Berzerker Battle Outfit Genesis 8 Male/Berzerker ! Genesis 8 Male LOAD ALL.duf",
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Berzerker Battle Outfit Ogre/Berzerker ! Ogre LOAD ALL.duf",
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
    "D:/Daz3D/G8Content/People/Genesis 8 Male/Clothing/Vintage Doctor/!VintageDoctorALL.duf",
]