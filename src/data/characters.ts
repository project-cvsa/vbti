import type { Character } from "@/core/types";

export const characters: Record<string, Character> = {
	初音未来: {
		caption: "世界第一的公主殿下",
		image: "miku.png",
		lang: "JP",
		color: "#39C5BB",
		popularity: 100,
		mbti: "ENFP",
		desc: "你的性格如初音未来一般，是世界的焦点，也是创作的源泉，王牌般的主角。你有极强的共情能力和创造力，内心深处藏着理想主义的光芒。你温柔、敏感，有时会沉浸在自己的精神世界里，但一旦站上舞台，就能用你的方式感染所有人。你不需要刻意讨好谁，因为你本身就足够闪耀。无论是被人理解还是被人误解，你始终相信：音乐和真诚能跨越一切。✨",
		bgm: "World is Mine | BV1bx411c7Cd\r\n深海少女 | BV1Hx411c7Gh\r\nmelt | BV17s411b7eh\r\n拼凑的断音 | BV1vs411D7JZ",
		music: "/music/miku.m4a",
		shortDesc:
			"你的性格如初音未来一般，是世界的焦点，也是创作的源泉。你有极强的共情力和创造力，内心深处藏着理想主义的光芒。你不需要刻意讨好谁，因为你本身就足够闪耀。就像她的《world is mine》唱到的——“要像公主一样对待我～”",
		tags: "#世界歌姬 #创造力的中心 #永远16岁 #大家的未来",
		url: "https://zh.moegirl.org.cn/%E5%88%9D%E9%9F%B3%E6%9C%AA%E6%9D%A5"
	},
	GUMI: {
		caption: "温柔又坚强的失恋女神",
		image: "gumi.png",
		lang: "JP",
		color: "#CCFF00",
		popularity: 85,
		mbti: "ENFP",
		desc: '你就像GUMI，温柔俏皮的外表下，藏着一颗历经风雨却依然坚强的心。她的代表形象是及肩的翠绿色短发，头上戴红色护目镜，代表物是胡萝卜。由于GUMI曲中失恋曲非常多，故有"恋爱苦手"的二次设定。你可能经历过不少挫折，但你从不轻易认输。你有着独特的中低音域般的沉稳气质，不张扬却让人无法忽视。你善解人意，愿意倾听别人的故事，也用自己的方式治愈他人。🥕',
		bgm: "马赛克卷 | BV1ks411t7Mq\r\n天之弱 | BV1CK4y1Y7r1\r\n胆小鬼蒙布朗 | BV1ys411t7HH\r\nI Can't Wait | BV15GmhBaEZF",
		music: "/music/gumi.m4a",
		shortDesc:
			"你就像GUMI，温柔俏皮的外表下，藏着一颗历经风雨却依然坚强的心。你善解人意，愿意倾听别人的故事，也用自己的方式治愈他人。就像她的《马赛克卷》唱到的——“为了不互相接触而作茧自缚，这也是命运不是吗～”",
		tags: "#失恋女神 #温柔坚强 #胡萝卜 #绿发歌姬",
		url: "https://zh.moegirl.org.cn/Megpoid"
	},
	重音Teto: {
		caption: "恶作剧与反差萌的红色奇美拉",
		image: "teto.png",
		lang: "JP",
		color: "#D93A49",
		popularity: 98,
		mbti: "ENFP",
		desc: '你的性格就像重音Teto，外表看似简单少女，实则是成熟奇美拉！Teto最初是2008年愚人节在2ch上被编造出来"钓鱼"的虚构角色，然而凭借独特的红色螺旋双马尾、呆毛和血红色瞳孔奇美拉的形象，以及粉丝们的热爱，她最终拥有了UTAU声库，甚至到今天的SV声库，变成了真正的虚拟歌手。你的人生可能也充满了反差与惊喜——别人以为你在开玩笑的时候，你已经悄悄地做到了别人做不到的事。从"愚人节玩笑"到"真正的歌姬"，你用行动证明了什么是逆袭，奇美拉占领世界！💥',
		bgm: "医学 | BV1nafnYUEac\r\n脑蚀 | BV1mNf3BREgj\r\n天真烂漫机能 | BV1sx411c7sB\r\nLiar Dancer | BV1oAtcz7Eyg",
		music: "/music/teto.m4a",
		shortDesc:
			"你就像重音Teto，从愚人节玩笑到真正的歌姬，你的人生充满了反差与惊喜。别人以为你在开玩笑的时候，你已经悄悄做到了别人做不到的事。就像她的《医学》唱到的——“若一切变得轻而易举，那么所有问题都会遭到埋没～”",
		tags: "#愚人节诞生的奇迹 #红色钻头 #奇美拉 #UTAU代表",
		url: "https://zh.moegirl.org.cn/%E9%87%8D%E9%9F%B3Teto"
	},
	洛天依: {
		caption: "灵动治愈的中华歌姬",
		image: "luotianyi.png",
		lang: "CN",
		color: "#66CCFF",
		popularity: 98,
		mbti: "INFP",
		desc: '你就像洛天依，温柔敏感，内心细腻，能敏锐地感知他人的情绪。她是一位15岁的灰发外星少女，性格温柔内向、细腻敏感；而"大吃货"这一深入人心的二设，则来自《千年食谱颂》的广泛传播。也因演唱了许多国风歌曲，被誉为“国风歌姬”。你可能有些内向，不太擅长表达自己，但你的温柔与善良总能在不经意间治愈身边的人。你有自己的坚持和倔强，是一个外表柔软、内心坚定的人。对了，你可能还特别容易被美食俘获——没有什么是一顿好吃的解决不了的！把你的个性占满整个窗口吧！🍜',
		bgm: "勾指起誓 | BV1Jb411U7u2\r\n大哉乾元 | BV1Xp421o7hr\r\n一花依世界 | BV1Vs411H7JH\r\n66CCFF | BV1ix411F7TB",
		music: "/music/luotianyi.m4a",
		shortDesc:
			"你就像洛天依，温柔敏感，内心细腻，能敏锐地感知他人的情绪。你可能有些内向，但你的温柔与善良总能在不经意间治愈身边的人。就像她的《勾指起誓》唱到的——“所以让我再靠近一点点，因为你太温暖～”",
		tags: "#小八 #天然呆 #治愈系声线 #吃货属性",
		url: "https://zh.moegirl.org.cn/%E6%B4%9B%E5%A4%A9%E4%BE%9D"
	},
	可不: {
		caption: "捉摸不透的无机质少女",
		image: "kafu.png",
		lang: "JP",
		color: "#4D79FF",
		popularity: 70,
		mbti: "INFP",
		desc: '你就像可不，身上充满了"可能性不可解"的神秘气质。可不（KAFU）是以虚拟主播花谱为原型开发的声库，角色形象以白发、蓝粉瞳孔及科技感服饰为特征，作为"音乐的同位体"项目核心，旨在实现创作者与听众的协同艺术表达。你不喜欢被定义，也不喜欢被束缚，有时候你也不懂你自己。你追求自由，喜欢探索未知，对世界有着自己独特的理解方式。你的眼神里藏着故事，只有真正懂你的人才能读懂。🔮',
		bgm: "伪物 | BV1ih411e7gn\r\n心跳不止 | BV1MQ4y1a7JY\r\n不羁的喝采 | BV1jo4y1d7TY\r\nCat Loving | BV1hh411671y",
		music: "/music/kafu.m4a",
		shortDesc:
			"你就像可不，身上充满了可能性与不可解的神秘气质。你不喜欢被定义，也不喜欢被束缚，对世界有着自己独特的理解方式，有时候你也不懂你自己。就像她的《伪物》唱到的——“这世上没有比假花更艳丽的花朵～”",
		tags: "#可能性不可解 #神秘 #白发异色瞳 #音乐同位体",
		url: "https://zh.moegirl.org.cn/%E5%8F%AF%E4%B8%8D"
	},
	乐正绫: {
		caption: "元气满满的集团大小姐",
		image: "yuezhengling.png",
		lang: "CN",
		color: "#EE0000",
		popularity: 90,
		mbti: "ESFP",
		desc: '你的性格和乐正绫如出一辙——活力四射，元气满满！官方设定中，她是活力十足的16岁女高中生，乐器制造商和音乐大企业乐正集团的大小姐，声音元气，个性鲜明。你是一个行动派，想到什么就去做，从不拖泥带水。你直来直去，不喜欢拐弯抹角，虽然有时候会显得有点大大咧咧，但这份率真正是你最迷人的地方。你天生自带一种"大小姐"的气场，不是因为高傲，而是因为你足够自信和洒脱。你相信，人生就是要跑起来才精彩！🏃‍♀️',
		bgm: "太阳是什么颜色 | BV1yVQFBNEPn\r\n九九八十一 | BV1es41197ai\r\n梦语 | BV13s411S7JK\r\n世末歌者 | BV1Qs411k7Qv",
		music: "/music/yuezhengling.m4a",
		shortDesc:
			"活力四射，元气满满！你是一个行动派，想到什么就去做，从不拖泥带水。你直来直去，这份率真正是你最迷人的地方。就像她的《太阳是什么颜色》唱到的——“无需为今天计划，把心事都放下，请跟着节奏调整步伐～”",
		tags: "#活力元气 #不拘小节 #行动派 #大小姐气场",
		url: "https://zh.moegirl.org.cn/%E4%B9%90%E6%AD%A3%E7%BB%AB"
	},
	镜音铃: {
		caption: "热烈活泼的傲娇女孩",
		image: "rin.png",
		lang: "JP",
		color: "#FF8800",
		popularity: 92,
		mbti: "ESFP",
		desc: "你的性格就像镜音铃，拥有元气活泼，反差可爱萌在设定之初。你是一个充满反差魅力的人——有时元气满满，有时又内敛深沉。你喜欢热闹，也享受独处；你善良，但绝不是好欺负的类型。双面性格让你在任何场合都能游刃有余！🍊🍌",
		bgm: "少女A | BV1QW411P75t\r\n心 | BV1XW411P7jH\r\nlost one的号哭 | BV1Lx411c7dP\r\n炉心融解 | BV17x411D7Jx",
		music: "/music/rin.m4a",
		shortDesc:
			"你是一个充满反差魅力的人——有时元气满满，有时又内敛深沉。双面性格让你在任何场合都能游刃有余。就像她的《少女A》唱到的——“为了让我作为我存在～”",
		tags: "#双子 #元气+傲娇 #反差萌 #黄色系",
		url: "https://zh.moegirl.org.cn/%E9%95%9C%E9%9F%B3%E9%93%83%C2%B7%E8%BF%9E"
	},
	言和: {
		caption: "帅气温柔的冰山美人",
		image: "yanhe.png",
		lang: "CN",
		color: "#00FFCC",
		popularity: 90,
		mbti: "INTP",
		desc: "你就像言和一样，外表看起来酷酷的，甚至有点高冷，但内心其实非常温柔。作为中文V家第二位虚拟歌姬，言和拥有偏中性的声线和帅气又有些中二的女孩子设定，内心十分温柔，正如名字的寓意一样——言辞温和。你不喜欢张扬，但有自己的坚持和底线。你有独特的魅力，干净利落，不拖泥带水，让人觉得可靠又安心。或许你不善言辞，但你的行动足以证明一切。⚔️",
		bgm: "Side by Side | BV13E421P7W2\r\n冠世一战 | BV17t411y7D2\r\n逆浪千秋 | BV1BW411s7g3\r\n谁杀死了知更鸟 | BV11s411V7Ny",
		music: "/music/yanhe.m4a",
		shortDesc:
			"外表看起来酷酷的，甚至有点高冷，但内心其实非常温柔。你不喜欢张扬，但有自己的坚持和底线，让人觉得可靠又安心。就像她的《Side by Side》唱到的——“无法再掩盖，也没人能够再替代～”",
		tags: "#外表帅气 #小天使 #中二病 #言辞温和",
		url: "https://zh.moegirl.org.cn/%E8%A8%80%E5%92%8C"
	},
	镜音连: {
		caption: "率真与凌厉并存的正太",
		image: "len.png",
		lang: "JP",
		color: "#FFF000",
		popularity: 91,
		mbti: "INTP",
		desc: "你的性格就像镜音连——表面上可能是腼腆温柔的青春期少年，但内心深处藏着成熟甚至腹黑的一面。连的特征是青春期少年的歌声、从后方短短地束起来的金发，以及印有低音谱号的校服为主题的服装。你有时腼腆，有时凌厉；有时温柔，有时冷漠。你的反差感让人捉摸不透，但这正是你的魅力所在——你不是一个能被简单定义的人。🎧",
		bgm: "逃避法律摇滚 | BV1Ks411v7BK\r\n恶之召使 | BV1Ti42197rH\r\nFire◎Flower | BV1jx411S7C1\r\n电吉他摇滚男孩 | BV1UFH6zcEsV",
		music: "/music/len.m4a",
		shortDesc:
			"表面上可能是腼腆温柔的青春期少年，但内心深处藏着成熟甚至腹黑的一面。反差感让人捉摸不透，但这正是你的魅力所在。就像他的《逃避法律摇滚》唱到的——“一年到头都得意忘形起来吧～”",
		tags: "#镜音连 #腹黑成熟 #正太音 #黄色系",
		url: "https://zh.moegirl.org.cn/%E9%95%9C%E9%9F%B3%E9%93%83%C2%B7%E8%BF%9E"
	},
	心华: {
		caption: "细腻温婉的偶像高中生",
		image: "xinhua.png",
		lang: "CN",
		color: "#EE82EE",
		popularity: 70,
		mbti: "ENFJ",
		desc: "你的性格就像心华，活泼开朗，乐观向上！心华是一位爱唱歌的16岁高中生偶像少女，有着紫色的头发，是活泼可爱型的代表。你总是能把快乐传递给身边的人，用你的笑容感染世界。你相信生活是美好的，也愿意用自己的方式让身边的人感到温暖。🌸",
		bgm: "一人行者 | BV1Ys411X7vP\r\n诗 | BV1gx411A7Ko\r\n冻夏 | BV1jv411w7q6\r\n如见青山 | BV1ab411g7Fb",
		music: "/music/xinhua.m4a",
		shortDesc:
			"活泼开朗，乐观向上！你总是能把快乐传递给身边的人，用你的笑容感染世界。就像她的《冻夏》唱到的——“你留下我的身影，留给某夜的梦境，能够载着你飞行～”",
		tags: "#活泼可爱 #字典娘 #高中生偶像 #开朗率真",
		url: "https://zh.moegirl.org.cn/%E5%BF%83%E5%8D%8E"
	},
	星尘: {
		caption: "坚定强大的银河少女",
		image: "xingchen.png",
		lang: "CN",
		color: "#9999FF",
		popularity: 89,
		mbti: "INFJ",
		desc: '你就像星尘，温柔、细腻、带一点害羞，但是内核强大。从宇宙中来到地球，拥有灰白发和金瞳，代表物为梅塔特隆立方体，应援句为"众星因你，皆降为尘"。相比她人的活泼开朗，星尘更加内向害羞，但这并不妨碍她用自己的方式发光。你可能不善言辞，但你的内心有一个丰富的世界，懂得在安静中绽放自己的光芒。✨',
		bgm: "星愿StarWish | BV1Zs411D7vo\r\n尘降 | BV1Zs411z79y\r\n万神纪 | BV1Sx41117dD\r\n所以我伸出了手 | BV16grkYhEBJ",
		music: "/music/xingchen.m4a",
		shortDesc:
			"温柔、细腻、带一点害羞，但是内核强大。你可能不善言辞，但你的内心有一个丰富的世界，懂得在安静中绽放自己的光芒。就像她的《星愿StarWish》唱到的——“漫天的繁星会照亮你的视野，我也会一直陪伴在你身边，永不分别～”",
		tags: "#害羞 #空灵声线 #杨桃精 #治愈系 #强大内核",
		url: "https://zh.moegirl.org.cn/%E6%98%9F%E5%B0%98(%E5%B9%B3%E8%A1%8C%E5%9B%9B%E7%95%8C)"
	},
	乐正龙牙: {
		caption: "高冷外表下的热烈鼓手",
		image: "yuezhenglongya.png",
		lang: "CN",
		color: "#006666",
		popularity: 62,
		mbti: "INTJ",
		desc: "你的性格就像乐正龙牙，头脑清晰、洒脱利落，随性不羁的作风下藏着敏锐果决的洞察力。他是乐正绫的哥哥，乐正集团的未来当家，平时看起来有点嫌麻烦，但关键时刻总是他回来统筹全局、稳定军心。乐队的鼓手，演奏风格热血激烈——平时有多怕麻烦，拿起鼓槌的那一刻就有多投入。你也是如此：讨厌琐碎、不轻易出手，但一旦认真起来，整个局面的走向都在你的掌控之中。别人看到的是你的喜怒不形于色，真正懂你的人才知道——你只是把能量留给了值得的人和事。🐉",
		bgm: "In Your Breath | BV1Tx411Q7yR\r\n腾龙令 | BV1YJ4m147MC\r\n墨隐侠声 | BV1oJ4m147eN\r\n威海 | BV19b41157sK",
		music: "/music/yuezhenglongya.m4a",
		shortDesc:
			"高冷是你的保护色，你是独当一面的人，愿意对在意的人付出一切。就像他的《In your breath》唱到的——“为你创造这个新宇宙，是我存在的理由～”",
		tags: "#总裁 #龙十万 #高冷外貌 #阴阳头#鼓手",
		url: "https://zh.moegirl.org.cn/%E4%B9%90%E6%AD%A3%E9%BE%99%E7%89%99"
	},
	徵羽摩柯: {
		caption: "天才少年全能技术宅",
		image: "zhiyumoke.png",
		lang: "CN",
		color: "#0080FF",
		popularity: 45,
		mbti: "ISTP",
		desc: "你的性格就像徵羽摩柯，聪明、专注、在自己的领域里闪闪发光。徵羽摩柯是一位14岁的天才少年，擅长编程和键盘乐器。他一定是人群中最特别的那个，要是一旦谈到自己热爱的领域，就会展现出更令人惊叹的才华和热情。你也是这样的人——在感兴趣的事情上可以废寝忘食，在擅长的领域里是不可替代的存在。🎹",
		bgm: "虚拟少年 | BV1mJ411v7Em\r\n你好，世界！ | BV1ss411377E\r\nFollow me | BV1BJ411y7EM\r\n戴帽子的孩子 | BV13t411d7s7",
		music: "/music/zhiyumoke.m4a",
		shortDesc:
			"聪明，专注的你一直都熠熠闪光。你是最特别的那一个，是不可替代的存在。就像他的《虚拟少年》唱到的——“我的人间，你走不到天涯～”",
		tags: "#天才少年 #技术宅拯救世界 #键盘操盘天下#小天神",
		url: "https://zh.moegirl.org.cn/%E5%BE%B5%E7%BE%BD%E6%91%A9%E6%9F%AF"
	},
	墨清弦: {
		caption: "冷静知性的迟钝美人",
		image: "moqingxian.png",
		lang: "CN",
		color: "#FFFF00",
		popularity: 62,
		mbti: "INTP",
		desc: "你的性格就像墨清弦，冷静、理性、知性优雅。墨清弦拥有紫色的长发和冷静沉稳的性格。她给人的第一印象可能是高冷、难以接近，但实际上只是习惯用理性的方式处理问题。你擅长分析、逻辑清晰，在混乱中能保持冷静的头脑。别人眼中的“高冷”，其实是你专注思考时的样子，当然也有可能是你反应“慢了半拍”。📚",
		bgm: "ACE | BV1J4411j7mn\r\n独占春 | BV1dCEXzBEZZ\r\n闲花白 | BV1d4411G7jJ\r\n入摩 | BV1Vi421Q7ow",
		music: "/music/moqingxian.m4a",
		shortDesc:
			"你理性，冷静。擅长分析逻辑清晰，在混乱中常常保持冷静的头脑，这是你的魅力所在。就像她的《ACE》唱到的——“爱我光芒四射～”",
		tags: "#冷静知性 #紫发御姐 #慢半拍 #气质美人",
		url: "https://zh.moegirl.org.cn/%E5%A2%A8%E6%B8%85%E5%BC%A6"
	},
	巡音流歌: {
		caption: "成熟优雅的大姐姐",
		image: "luka.png",
		lang: "JP",
		color: "#FFB6C1",
		popularity: 76,
		mbti: "ISFP",
		desc: "你就像巡音流歌，自带一种从容不迫的气场，性格冷静温和。你身上有一种天然的包容力，无论什么性格的人都能和你好好相处。你不张扬，但足够有存在感；你温和，但有原则底线。但是偶尔也反差萌，比如巡音粉发的设定灵感来源是吹奏圆号类乐器时会把脸颊吹的发红，也有萌到深入人心的亚种——章鱼LUKA的形象🐙",
		bgm: "Lukaluka★night fever | BV1qs411f7JL\r\n双重套索 | BV1px411c7p7\r\nJust Be Friends | BV1vx411c7Z1\r\nDreamin Chuchu | BV1N4411L7xV",
		music: "/music/luka.m4a",
		shortDesc:
			"你自带从容不迫的气场，能跟身边人打成一片，常常让大家放下防备跟你开心的一起玩。就像她的《Lukaluka★night fever》唱到的——“我比任何人都还要了解你，所以就交给我吧~”",
		tags: "#成熟御姐 #粉发蓝瞳 #章鱼 #包容大气",
		url: "https://zh.moegirl.org.cn/%E5%B7%A1%E9%9F%B3%E6%B5%81%E6%AD%8C"
	},
	KAITO: {
		caption: "天然呆的冰淇淋大哥",
		image: "kaito.png",
		lang: "JP",
		color: "#0000FF",
		popularity: 75,
		mbti: "ISFP",
		desc: "你的性格就像KAITO，天然呆，温柔到骨子里，内心强大，但是是团队里面的大哥，时刻留意着他人的情绪。KAITO的特征是随时都戴着的蓝色围巾（一度让人以为是围巾是本体），最喜欢吃冰淇淋。他早期销量惨淡，一度被称为“史上最不卖座的VOCALOID”，但后来凭借优质作品逆袭成为经典。你可能和他一样，有过不被看好的时候，但最终用自己的实力证明了价值。🍦",
		bgm: "暖暖kaito | BV1ws41197Ac\r\n千年的独奏曲 | BV1vx411c7y7\r\n恶德的法官 | BV1Zx411c7pV\r\nDoctor=Funk Beat | BV1n4411m7ja",
		music: "/music/kaito.m4a",
		shortDesc:
			"你内心强大，是团队里的大哥，时刻留意着他人的情绪。就像他的《暖暖的kaito》唱到的——“今天也依旧想让你会心而笑～”",
		tags: "#本体围巾 #天然呆 #温柔大哥 #冰淇淋控",
		url: "https://zh.moegirl.org.cn/KAITO"
	},
	MEIKO: {
		caption: "豪爽利落的大姐头",
		image: "meiko.png",
		lang: "JP",
		color: "#D80000",
		popularity: 78,
		mbti: "ESTJ",
		desc: "你的性格就像MEIKO，豪爽、帅气、讲义气！MEIKO是Crypton Future Media开发的第一位VOCALOID歌手，也是史上第一位日语VOCALOID歌手，特征是棕色短发、红色服装，有着成熟女性的声线。同人设定中她常被描绘为“酒豪”，喜欢喝酒，性格爽朗大方，是V家成员们可靠的大姐头。你可能也经常在朋友圈里扮演“大姐大/大哥大”的角色——照顾大家、主持公道、关键时刻扛事。🍶",
		bgm: "Nostalogic | BV16x411P7X9\r\n我的恋情是地狱业火 | BV1B44y1i7Eu\r\nChange me | BV1Cs411o7gR\r\n恶食娘空琪塔 | BV1CE411575F",
		music: "/music/meiko.m4a",
		shortDesc:
			"你豪爽，帅气讲义气，爽朗大方，是可靠的大姐头。就像她的《Nostalogic》唱到的——“不会褪去色彩的~”",
		tags: "#短发 #豪爽大姐 #酒豪 #大姐大气场",
		url: "https://zh.moegirl.org.cn/MEIKO"
	},
	诗岸: {
		caption: "慢热天然呆的迷糊妹妹",
		image: "shian.png",
		lang: "CN",
		color: "#F6BE71",
		popularity: 80,
		mbti: "ESFJ",
		desc: "你的性格就像诗岸，温柔、包容、让人安心。诗岸是五维介质企划下的虚拟歌手，是大家庭中惹人怜爱的“小妹妹”，形象是代表“地”的土象歌姬，声线软糯温暖，给人一种回归大地的治愈感。你可能不是最出风头的那个人，但你绝对是大家想依靠的那个人。你的温柔温顺不是软弱，而是像大地一样，有一种包容万物的力量。不张扬，将故事和心绪娓娓道来。🏔️",
		bgm: "请不要带我走 | BV1X5E3z7EN9\r\n泛泛人类不会祈祷 | BV1h14y1C7V5\r\n畏光症 | BV1e7411u7ce\r\n寓言预见遇见你的那刻 | BV1E7411v7Cd",
		music: "/music/shian.m4a",
		shortDesc:
			"你温柔，包容，不张扬。默默感染着大家，让大家忍不住依靠你。就像她的《寓言预见遇见你的那刻》唱到的——“我的桃心士兵正迈出整齐步伐，占领你的王国～”",
		tags: "#可爱萌  #治愈 #包容万象#吃苹果",
		url: "https://zh.moegirl.org.cn/%E8%AF%97%E5%B2%B8"
	},
	赤羽: {
		caption: "生来炙热的火羽凤凰",
		image: "chiyu.png",
		lang: "CN",
		color: "#FF4004",
		popularity: 64,
		mbti: "ESFP",
		desc: "你的性格就像赤羽，炽热、坚定、永远充满能量！赤羽是五维介质企划下的虚拟歌手，形象是一只涅槃重生的红色凤凰，声线充满力量感和穿透力，被誉为“燃曲女王”。你的内心有一团永不熄灭的火焰，无论遇到什么困难都能浴火重生。你可以温柔，但你的底色永远是那一抹最耀眼的红。🔥",
		bgm: "万象霜天 | BV1zN411d7dG\r\n胚芽 | BV1EXU8BuEs9\r\n404 Not Found | BV1vE411R7iD\r\n翡夜Racing Game | BV1Ub41157V4",
		music: "/music/chiyu.m4a",
		shortDesc:
			"你炽热，坚定，是永远不会熄灭的火焰，遇到什么困难都会迎难而上，甚至是期待新的挑战。就像她的《万象霜天》唱到的——“身在局中又怎知晓全貌，此地更高～”",
		tags: "#火羽 #赤草鸡 #燃曲女王 #赤红之羽",
		url: "https://zh.moegirl.org.cn/%E8%B5%A4%E7%BE%BD"
	},
	苍穹: {
		caption: "知性沉稳的大姐姐",
		image: "cangqiong.png",
		lang: "CN",
		color: "#8BC0B5",
		popularity: 55,
		mbti: "ISTJ",
		desc: "你的性格就像苍穹，大气、深邃、格局拉满！苍穹是五维介质企划下的虚拟歌手，你是自由的风。你的眼界很宽，不喜欢纠结鸡毛蒜皮的小事。你有一种天生的“大气感”，让人觉得你可靠且值得信赖。你站在那里，就是一片天空。🌌",
		bgm: "弈 | BV1q34y1271d\r\n木兰行 | BV1Gg4y1a7vg\r\n流年如歌 | BV1KJ411C7Y1\r\nD!slodge | BV1yb411z7tu",
		music: "/music/cangqiong.m4a",
		shortDesc:
			"你的大气，深邃，不拘一格，自成一片天空，就像她的《弈》唱到的——“纵历尽万般沧桑，誓要对天赢一场~”",
		tags: "#自由的风 #自成天空 #大气磅礴 #沉稳",
		url: "https://zh.moegirl.org.cn/%E8%8B%8D%E7%A9%B9(%E5%B9%B3%E8%A1%8C%E5%9B%9B%E7%95%8C)"
	},
	海伊: {
		caption: "梦幻直率的海洋",
		image: "haiyi.png",
		lang: "CN",
		color: "#3399FF",
		popularity: 52,
		mbti: "ENFP",
		desc: "你就像海伊，神秘、多变，有时也可以很调皮。海伊是五维介质企划下的虚拟歌手，声如水，形如海，声线空灵悠远，擅长营造梦幻的氛围。但别被她的外表骗了——熟悉的人都知道她健谈又可爱，冷不丁还会来一句坏坏的吐槽。你也是如此：表面看着安静温柔，其实心里住着一个有趣的灵魂，只有真正潜入你内心的人，才能发现那里藏着无数宝藏。🌊",
		bgm: "STOP | BV1xs411u73F\r\n浅滩 | BV17W411V7Ge\r\n好字唯之 | BV1tD4y1D7mS\r\n假花没有枯萎的权利 | BV1Y7CjYmEnn",
		music: "/music/haiyi.m4a",
		shortDesc:
			"你神秘，多变，表面看着安静温柔，内心住着一个有趣的灵魂，只有真正潜入你内心的人才能触及到真实的你，就像她的《STOP》唱到的——“我的诗句，是无法传递的共情～”",
		tags: "#海蜇皮 #深海歌姬 #空灵神秘 #蓝调时刻",
		url: "https://zh.moegirl.org.cn/%E6%B5%B7%E4%BC%8A"
	},
	永夜: {
		caption: "清醒孤独的艺术家",
		image: "yongye.png",
		lang: "CN",
		color: "#613C8A",
		popularity: 48,
		mbti: "INTJ",
		desc: "你的性格就像永夜minus，幽暗、深邃、复杂，自带致命的吸引力。永夜minus是一位沉着内敛、不断求索的少女，歌声冷静而坚定，同时兼具情感丰富的爆发力。就像你喜欢在深夜独自思考，对黑暗美学情有独钟。你不害怕孤独，甚至享受孤独，因为那是一种清醒，是你创作的土壤。🌑",
		bgm: "须臾永恒 | BV1v34y1H7N3\r\n启明星Venusn | BV1LM411B7FS\r\n水叙湖风 | BV1Xp4y1a7zj\r\n你看见了天使在我眼中 | BV11b421n7o9",
		music: "/music/yongye.m4a",
		shortDesc:
			"你有一颗复杂的心，喜欢在深夜独自思考，你享受孤独，就像她的《须臾永恒》唱到的——“醒时如梦醉时清～”",
		tags: "#反面魅力 #清醒梦境 #孤独浪漫 #独特",
		url: "https://zh.moegirl.org.cn/%E6%B0%B8%E5%A4%9CMinus"
	},
	东方栀子: {
		caption: "一颗真诚炙热的心",
		image: "dongfangzhizi.png",
		lang: "CN",
		color: "#FF0000",
		popularity: 70,
		mbti: "ISFJ",
		desc: "你的性格就像东方栀子，温柔、坚韧、经历过风雨却从未被击垮。东方栀子是2011年由天津电视台推出的中国第一位自主创作的虚拟偶像，拥有红色的双马尾和红色旗袍，声线清澈温柔。经历变故后官方停止开发，但粉丝们没有放弃她——在同人圈里，栀子的形象被重新创作、赋予新的意义，从“遗憾”蜕变为“涅槃重生的栀子花”。你的人生或许也有过类似的经历：被误解、被否定、被低估。但你没有放弃自己。你知道，真正的价值不需要别人定义——只要还有人愿意听你唱歌，你就能继续唱下去。你不是完美的，但你是真实的。而真实，比完美更动人。🌸",
		bgm: "我将沐火而唱 | BV1U7411Y7Qu\r\n妈祖帮帮忙 | BV1xvFCzEELG\r\n情痴 | BV1WpFmeYEwn\r\n骄阳 | BV1wg4QeGECW",
		music: "/music/dongfangzhizi.m4a",
		shortDesc:
			"你温柔，坚韧，历经风霜从未被击倒。你知道人生掌握在自己手中，不需要被他人左右，就像她的《我讲沐火而唱》唱到的——“沿途有未知风浪，也淋不湿希望～”",
		tags: "#涅槃重生 #UTAU代表 #中国初代虚拟偶像 #爱能创造奇迹",
		url: "https://zh.moegirl.org.cn/%E4%B8%9C%E6%96%B9%E6%A0%80%E5%AD%90"
	},
	俊达萌: {
		caption: "傲娇倔强的枝豆精灵",
		image: "zunmon.png",
		lang: "JP",
		color: "#A8F877",
		popularity: 32,
		mbti: "ENFP",
		desc: "你的性格就像俊达萌，外表傲娇、内在柔软，可爱又倔强。俊达萌是设定为变身成人类的“枝豆妖精”，表面上一副“哼，我才不是为了帮你呢”的样子，实际上是最热心肠的那一个。你也经常嘴硬心软，明明很关心别人却不好意思直接表达，总是用别扭的方式传递善意。这种反差萌反而让你格外讨人喜欢。🫛",
		bgm: "俊达派对之夜 | BV1td3MeoExq\r\n俊达之家的晚餐 | BV1wAUkYQEem\r\n俊达☆连绵不绝的咚！ | BV1Qz421r7XG",
		music: "/music/zunmon.m4a",
		shortDesc:
			"你外表傲娇，内在柔软，常常嘴硬心软。总是用自己满不在乎的方式传达善意，就像她的《俊达派对之夜》唱到的——“俊达之行，始于足下～”",
		tags: "#枝豆妖精 #傲娇萝莉 #毛豆精 #高精力",
		url: "https://zh.moegirl.org.cn/%E4%BF%8A%E8%BE%BE%E8%90%8C"
	},
	结月缘: {
		caption: "人间辩论诵读姬",
		image: "yukari.png",
		lang: "JP",
		color: "#800080",
		popularity: 40,
		mbti: "ENTP",
		desc: "你的性格就像结月缘，是典型的小紫人辩论家。结月缘最初是作为VOICEROID语音合成软件角色诞生的，说话方式清晰、流畅到可怕，所以常被粉丝调侃为“最会说话的女人”，没有任何人能吵得过她。后来她拥有了VOCALOID声库，不说话的时候是高冷美人，一开口就是三小时逻辑碾压。你喜欢智力上的交锋，但辩论不是为了赢，而是因为追求真理的过程让你兴奋。你的大脑永远在运转，总有新的观点、新的角度、新的论证方式。和你深入交流过的人都会记住你——不是因为你的嗓门大，而是因为你的逻辑无懈可击。💜",
		bgm: "啾噜哩啦·啾噜哩啦·哒哒哒 | BV1bs41197Th\r\n似乎有着能够变得幸福的隐藏指令 | BV1js411f7tE\r\n几望之月 | BV1bW411r7WY\r\n自由的洛丽塔 | BV1Jt411h7Bj",
		music: "/music/yukari.m4a",
		shortDesc:
			"你说话逻辑清晰毫无破绽，喜欢智力上的交锋。追求真理的过程让你感到满足，就像她的《啾噜哩啦·啾噜哩啦·哒哒哒！》唱到的——“最后直到只剩一个人为止，都不会停下～”",
		tags: "#辩论家 #冒兜 #高智商话痨 #逻辑狂魔",
		url: "https://zh.moegirl.org.cn/%E7%BB%93%E6%9C%88%E7%BC%98"
	},
	歌爱雪: {
		caption: "天真努力小学生",
		image: "yuki.png",
		lang: "JP",
		color: "#F811DE",
		popularity: 65,
		mbti: "INFP",
		desc: "你的性格就像歌爱雪，外表看起来是最天真软萌的那一个，内心却住着一个比谁都认真、比谁都努力的灵魂。歌爱雪是一名小学女生，背着大大的书包。因为声线偏幼、调教难度较大，被一些P主称为“最难调的V家之一”，但正因为如此，每一首优秀的雪曲背后，都是P主和她共同的努力。你可能不太自信，总觉得自己还不够好，但事实上，你的认真、执着和日复一日的坚持，早已让你闪闪发光。你会因为一句批评难过一整天，也会因为一句鼓励而开心一个星期。这样的你，值得世界上所有温柔的对待。❄️",
		bgm: "别走 | BV1BW411P7ff\r\n强风大背头 | BV1yL411X7dM\r\n延误列车 | BV1fK4y1s7Qf\r\n明明昨天就应该死去 | BV1YLxszzETc",
		music: "/music/yuki.m4a",
		shortDesc:
			"你看起来天真软萌，但是身体里住着一个认真努力的灵魂。你可能还不太自信，但是日复一日的坚持已经让你熠熠闪光了，就像她的《别走》唱到的——“不可以哭，不可以哭～”",
		tags: "#小学生歌姬 #认真努力 #软萌声线 #冰霜之心",
		url: "https://zh.moegirl.org.cn/%E6%AD%8C%E7%88%B1%E9%9B%AA"
	},
	"V flower": {
		caption: "叛逆不羁的中性之花",
		image: "vflower.png",
		lang: "JP",
		color: "#996699",
		popularity: 85,
		mbti: "ESTP",
		desc: "你的性格就像v flower，酷、飒，骨子里流淌着不羁的血液。v flower拥有独特的中性嗓音和强烈的摇滚风格，是V家中最具有攻击性和穿透力的声线之一。她的不同版本声库形象如同绽放的热烈花朵，又是孤傲的高岭之花，又美又刃。你不喜欢被规则束缚，有自己的审美和态度。你可能不是传统意义上的“好脾气”，但你的直率、飒爽和忠于自我的风格，让真正欣赏你的人爱到骨子里。你不讨好世界，世界却忍不住关注你。🌺",
		bgm: "再见宣言 | BV1194y197Re\r\n猛毒 | BV17s41137mU\r\nCharles | BV1gs41147c8\r\n阿吽的节奏 | BV14x411b7SE",
		music: "/music/vflower.m4a",
		shortDesc:
			"你骨子里流淌着不羁的血液，你不喜欢被规则束缚，有自己的审美和态度。就像她的《再见宣言》唱到的——“不要被无止境的焦虑蒙蔽～”",
		tags: "#摇滚 #中性嗓音 #叛逆 #孤傲",
		url: "https://zh.moegirl.org.cn/V_flower"
	},
	IA: {
		caption: "清澈透明的天使歌姬",
		image: "IA.png",
		lang: "JP",
		color: "#F5EDED",
		popularity: 62,
		mbti: "INFJ",
		desc: "你的性格就像IA，纯净、透明、自带一种远离尘嚣的出尘气质。IA是拥有清澈透明的高音域和白色为主调的角色形象。她的名字意为“在这里”。你给人的第一印象可能是安静、淡然，甚至有些疏离，但了解你的人都知道，你的内心世界丰富而深邃。你不喜欢喧哗，但你的存在本身就是一种治愈——像一束穿过云层的光，不刺眼，但足够温暖。🎐",
		bgm: "明日的夜空哨戒班 | BV1Rx411N7h7\r\n如月专注 | BV1Tx411F7e7\r\n六兆年零一夜物语 | BV1ax411w7gM\r\n黎明前线 | BV1bs411Y7Ws",
		music: "/music/IA.m4a",
		shortDesc:
			"你清澈透明，内心世界丰富深邃，你的存在就是穿过云层的光一样特别，就像她的《明日的夜空戒哨班》唱到的——“若一起只能以梦作结，那就让我去改变昨天吧～”",
		tags: "#透明感 #羽毛歌姬 #高音域 #鸭鸭天使",
		url: "https://zh.moegirl.org.cn/IA"
	},
	牧心: {
		caption: "外冷内热的少年",
		image: "muxin.png",
		lang: "CN",
		color: "#2A2859",
		popularity: 30,
		mbti: "INFJ",
		desc: "你的性格就像牧心，外表清冷疏离，内心却藏着一团温柔的火。牧心是五维介质企划下的男性虚拟歌手，声线清澈冷冽，给人一种“不可触碰”的距离感。但了解你的人都知道，你的“冷”只是保护色，一旦有人真正走进你的世界，会发现那里其实温暖如春。❄️",
		bgm: "明日 | BV1R64y1F7yh\r\n光晕 | BV1e8S7B8Ebg\r\nSwan Song - 终曲 | BV1co4y1X7TJ\r\nBaphomet | BV1j44y1e78b",
		music: "/music/muxin.m4a",
		shortDesc:
			"外表清冷疏离，内心却藏着一团温柔的火。你给人的第一印象是可靠，但只要真正走进你的世界，就会发现那里其实温暖如春。就像他的《明日》唱到的——“当流星划破这寂静夜空，而云的涟漪是温柔的风～”",
		tags: "#外冷内热 #赤诚 #清澈声线 #少年",
		url: "https://zh.moegirl.org.cn/%E7%89%A7%E5%BF%83"
	},
	神威乐步: {
		caption: "武士道精神的帅气大哥",
		image: "gakupo.png",
		lang: "JP",
		color: "#9900FF",
		popularity: 10,
		mbti: "ESTP",
		desc: "你的性格就像神威乐步，帅气、沉稳、有自己的准则。神威乐步是以日本歌手GACKT为原型的VOCALOID角色，形象是持刀的武士，声线低沉性感，自带一种“大哥”气场。你有自己的武士道——一套不轻易动摇的行为准则。你重情重义，对认定的人可以两肋插刀。⚔️",
		bgm: "Dancing☆Samurai | BV1nx411c7sm\r\n万华镜 | BV1Jx411F7nM\r\n贝诺马尼亚公爵的疯狂 | BV1Hx411c7cy\r\nParanoid Doll | BV1Qx411c7jK",
		music: "/music/gakupo.m4a",
		shortDesc:
			"帅气、沉稳，坚守着自己的武士道。你把忠诚和厚道视为信条，对认同的人可以付出一切。你的强大从不写在脸上，而是藏在每一次拔刀与收鞘之间。就像他的《Dancing☆Samurai》唱到的——“只要有韵律环绕，就是快乐的人生～”",
		tags: "#武士 #帅气大哥 #和风美人 #长发",
		url: "https://zh.moegirl.org.cn/Gackpoid"
	},
	足立零: {
		caption: "努力的无机质少女",
		image: "adachirei.png",
		lang: "JP",
		color: "#ED8D2D",
		popularity: 80,
		mbti: "ISTP",
		desc: "你的性格就像足立零，带着一种机器人特有的认真感。足立零（足立レイ）是2018年诞生的UTAU音源角色。她常常一本正经地说出最天然的话，搞不清人类的复杂规则，但对待唱歌这件事比谁都认真。你或许也有点“电量焦虑”，在热闹的场合容易耗尽社交电池；数据处理需要比常人更长的时间，但一旦理解就能执行得分毫不差。你不会花言巧语，但你会默默把一切做到最好，你一直在努力升级自己——这种认真劲儿，比任何高级AI都更打动人。🔋🤖",
		bgm: "热异常 | BV1R14y187kf\r\nthe Hole | BV1F4w1zJEum\r\n演唱bot | BV1Az421D7d2\r\n学习时间到 | BV1DRzJYLEmB",
		music: "/music/adachirei.m4a",
		shortDesc:
			"带着一丝机器人的认真感，默默在喧嚣的角落按自己的逻辑运行。你或许跟不上这个世界的所有规则，但一旦理解了，就会做到最好。就像她的《热异常》唱到的——“若要是有能施予拯救的理想乡在就好了～”",
		tags: "#有口无心 #机器人 #永恒生命 #无机质",
		url: "https://zh.moegirl.org.cn/%E8%B6%B3%E7%AB%8B%E9%9B%B6"
	},
	lily: {
		caption: "特立独行的摇滚女王",
		image: "lily.png",
		lang: "JP",
		color: "#FFCC00",
		popularity: 30,
		mbti: "ENTJ",
		desc: "你的性格就像Lily。自信果决，天生就是发号施令的那个人，是典型的ENTJ指挥官人格。Lily是拥有亮眼的金色长发和强大的舞台气场。她的声线充满穿透力和掌控感，尤其擅长电子舞曲和摇滚——站在舞台中央时，所有人的目光都不得不看向她。ENTJ人格的你，拥有与生俱来的领导力和战略眼光。你不喜欢拖泥带水，更讨厌低效和借口。你会在团队最混乱的时候站出来，用清晰的分工让每个人各就各位。有人觉得你太强势，但你知道：犹豫不决比犯错更致命。你对自己要求严苛，对目标专注到近乎冷酷。但在你坚硬的外壳之下，藏着一颗渴望被理解的真心。你不是不想温柔，只是习惯了先用实力说话。💛⚡",
		bgm: "WAVE | BV1VL411i7cu\r\nELECT | BV1ZM4y177eH\r\nERROR | BV1ST411x73Z\r\nLilyLily★BurningNight | BV1px411c7Av",
		music: "/music/lily.m4a",
		shortDesc:
			"自信果决，天生就是要站在舞台中央的指挥官。你不喜欢拖泥带水，更讨厌低效。有人觉得你强势，但你知道：在混乱中指明方向，远比犹豫更有用。就像她的《WAVE》唱到的——“已经不再容许 停滞不前了～”",
		tags: "#指挥官 #摇滚女王 #电子舞曲 #特立独行",
		url: "https://zh.moegirl.org.cn/Lily(VOCALOID)"
	},
	音街鳗: {
		caption: "关西腔吐槽役的元气少女",
		image: "una.png",
		lang: "JP",
		color: "#0000AA",
		popularity: 65,
		mbti: "ENTP",
		desc: "你的性格就像音街鳗，元气、幽默、自带搞笑天赋！音街鳗是以声优田中爱美为原型的VOCALOID角色，特征是头上的鳗鱼表情帽子，拥有sweet跟spicy两个声线跟流畅的talk声库。她是V家著名的“吐槽担当”，总能精准地戳中笑点。你是一个走到哪里都能带来欢乐的人，你的幽默感是你最强大的武器。🐟",
		bgm: "野兽之舞 | BV1zx411V73r\r\n讨厌·讨厌·巨大化自我 | BV15s411C7fL\r\n想快点变成那个样子啦！ | BV1ZW411a79w\r\nBooo！ | BV1pt411d7xF",
		music: "/music/una.m4a",
		shortDesc:
			"元气十足，自带笑点。你的吐槽总能精准戳中要害，是人群里绝对的氛围担当。不管走到哪，你都能用幽默感化解尴尬。就像她的《野兽之舞》唱到的——“想逍遥自在地生活着～”",
		tags: "#关西腔 #吐槽担当 #鱼形帽子 #元气满满",
		url: "https://zh.moegirl.org.cn/%E9%9F%B3%E8%A1%97%E9%B3%97"
	},
	起礼: {
		caption: "自由快乐的小鸟",
		image: "qili.png",
		lang: "CN",
		color: "#FF0099",
		popularity: 40,
		mbti: "ENFP",
		desc: "你的性格就像起礼，热情、自由、永远充满感染力，是典型的ENFP竞选者人格。起礼是“起氏双子”中的姐姐，设定上是天真烂漫、充满好奇心的少女，她脑子里永远有一万个新点子，虽然可能只完成了一百个，但每一个都带着满满的热情。你也是这样的人——兴趣广泛到令人发指，三分钟热度又如何？三分钟的热情能点亮三分钟的世界！你讨厌被束缚，追求精神上的自由。虽然有时候会被说“缺乏计划性”，但你的临场发挥能力往往能化险为夷。和你在一起的人永远不会无聊，因为你就是行走的小太阳。至于那些还躺在备忘录里的九千九百个灵感——明天再说吧！☀️",
		bgm: "向阳鸟 | BV1R3411K7k4\r\n如果仅靠谎言将我的世界照亮 | BV1YW4y1U71A\r\n失落诗 | BV19cwUeWEmq\r\n饮中八仙Spirits | BV1A8411w7P7",
		music: "/music/qili.m4a",
		shortDesc:
			"热情、自由，脑袋里总有一千个新点子。虽然计划可能只完成了一半，但你的热情总能感染身边所有人。三分钟的热度，也能点亮三分钟的世界。就像她的《向阳鸟》唱到的——“传说里追逐太阳的少年怀抱着热焰～”",
		tags: "#竞选者 #起氏双子 #热情小鸟 #灵感永动机",
		url: "https://zh.moegirl.org.cn/%E8%B5%B7%E7%A4%BC"
	},
	起复: {
		caption: "秩序至上的小鸟执事",
		image: "qifu.png",
		lang: "CN",
		color: "#99FF00",
		popularity: 35,
		mbti: "ISTJ",
		desc: "你的性格就像起复，严谨、负责、秩序至上。起复是“起氏双子”中的弟弟，拥有一身绿色的清爽形象，设定上是一位靠谱的执事型角色。他的声线温和而规整，做事有条不紊，讨厌混乱和意外，喜欢把一切都安排得明明白白。“凡事有交代，件件有着落，事事有回音”就是他的人生信条。你可能不会说太多漂亮话，但你的行动力让人无比安心——交给你的事情，就一定能完成。你不会轻易打破规则，因为在你看来，规则不是枷锁，而是让世界有序运转的基石。有人觉得你太一板一眼，但真正懂你的人知道：你的可靠，是这个世界上最稀缺的品质。📋",
		bgm: "浮光、羽隙、花信风 | BV1KrZcB4E3w\r\n神子 | BV16V4y1h7Lw\r\n游梦起遇记 | BV16u4m1N7Gz\r\n真风流 | BV1Ch7tz2Ehk",
		music: "/music/qifu.m4a",
		shortDesc:
			"严谨、靠谱，凡事有交代。你信奉秩序，讨厌失控，只要把事情交给你，就一定会有最好的结果。你的可靠，是这个世界最稀缺的品质。就像他的《浮光、羽隙、花信风》唱到的——“展翅翱翔划过边界～”",
		tags: "#执事 #起氏双子 #秩序理性 #原则至上",
		url: "https://zh.moegirl.org.cn/%E8%B5%B7%E5%A4%8D"
	},
};
