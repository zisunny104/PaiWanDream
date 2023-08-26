import { CARD, PLAYER, MAP_SIZE_H, MAP_SIZE_W } from '../shared/constants';
import { getCurrentState } from './state';
import { setCookie, getCookie, getRandom, sleep } from '../shared/utils';
import Card from "../server/objects/card";

const cnv = document.querySelector('#cnv')
const ctx = cnv.getContext('2d')

const card_list = [
  {
    "type": "氏族",
    "card_name": "太陽的孩子-種子氏族",
    "raw_name": "mazazangiljan kagusaman",
    "description": "",
    "file_name": "氏族-太陽種子"
  },
  {
    "type": "氏族",
    "card_name": "太陽的孩子-枝葉氏族",
    "raw_name": "mazazangiljan tjaljaljaljaljak",
    "description": "",
    "file_name": "氏族-太陽枝葉"
  },
  {
    "type": "氏族",
    "card_name": "大地的孩子-種子氏族",
    "raw_name": "qatitan kagusaman",
    "description": "",
    "file_name": "氏族-大地種子"
  },
  {
    "type": "氏族",
    "card_name": "大地的孩子-枝葉氏族",
    "raw_name": "qatitan tjaljaljaljaljak",
    "description": "",
    "file_name": "氏族-大地枝葉"
  },
  {
    "type": "占卜",
    "card_name": "巴力到來",
    "raw_name": "pali",
    "description": "許多部落都有關於紅眼睛的 pali 的故事，相傳他眼睛看到的東西都會燃燒殆盡，部落將之視為災禍的象徵。但因他天生具有神奇力量，運用得當的話，也許也有機會可以幫助部落度過許多厄運。",
    "file_name": "占卜-巴力到來"
  },
  {
    "type": "占卜",
    "card_name": "恪守禁忌",
    "raw_name": "palisi、tjuapalisi",
    "description": "部落生活中有許多禁忌，有些與倫理有關，例如氏族內通婚會生下眼睛在腳上的小孩(遺傳變異)，有些則有一定的衛生意義，如病者的污穢物有受詛咒必須燒毀(抑制傳染)，或是公共安全相關:土石常崩落的惡靈出沒之地不得開墾(水土保持)。眾多禁忌緣由皆有跡可循。",
    "file_name": "占卜-恪守禁忌"
  },
  {
    "type": "占卜",
    "card_name": "天賜福球",
    "raw_name": "djemuljat",
    "description": "maljeveq (人神盟約祭)，亦稱為五年祭，是南部排灣族群最盛大的祭典。傳說排灣族人的祖先來到靈界向女神學習祭儀，並約定會在固定時間以燃燒的小米梗為信號請神降臨人間，接受族人的獻祭。",
    "file_name": "占卜-天賜福球"
  },
  {
    "type": "占卜",
    "card_name": "神秘異象",
    "raw_name": "kiqayam 、kisepi",
    "description": "排灣族人會將某些異象視為預兆，是祖靈及精靈在表示祂們賜予的運氣，比如觀察一些特定鳥類的飛行軌跡來判斷狩獵時的吉凶。所以在農耕、狩獵或採集資源時，都會以小米梗的煙霧請示眾靈的祝福與否。另外夢境也是祖靈的重要預兆，排灣信仰裡作夢就是靈魂進入靈界，在夢境裡發生的事情也暗示著現實的過去及未來。通常知曉這些事務的就是靈媒及祭司，也會由他們來為族人解惑。",
    "file_name": "占卜-神秘異象"
  },
  {
    "type": "能力",
    "card_name": "獲得榮耀-追尋羽飾",
    "raw_name": "palalj",
    "description": "不論太陽或大地氏族頭飾上都會有各式羽毛，除裝飾外，有些說明了該配戴者的能力與其輩分的責任，如同勳章一般，用以供人追尋相應的榮耀。族人會審視該配戴者是否有「配得上」的能力或德行，不然無所作為就帶著榮耀羽飾，會視為驕傲自大而被鄙視。久而久之，後輩就會為了爭得羽飾而取得功績或好德行了。各氏族間也會用「分享榮耀」的儀式來贈予羽飾。",
    "file_name": "能力-追尋羽飾"
  },
  {
    "type": "能力",
    "card_name": "獲得榮耀-分家陶片",
    "raw_name": "ngiljaq",
    "description": "太陽或輩分重的氏族在分家時，會將家裡一部份的 dredretan (古陶壺)壺口剝下一小碎片，再將有缺口的壺分予聯姻的親家氏族，象徵著讓本家的祖靈進入新家守護。此外缺痕也代表著家庭的缺陷，為的是提醒雙方氏族用關愛新家庭的心來彌補這個缺口。有時一顆古陶壺會被輾轉贈與多次，壺口就會出現許多裂痕。",
    "file_name": "能力-分家陶片"
  },
  {
    "type": "能力",
    "card_name": "獲得榮耀-古代家名",
    "raw_name": "pacikel",
    "description": "排灣族新生兒誕生會依事件或親人功績來創名，亦有可能取父親或母親氏族某 位快被遺忘的祖先名字，用以傳承該名的歷史典故，這造成了各家都會專屬的獨特名，而有雙名的族人也不少見。家名(姓氏)的傳承則更為複雜，但也大概會依創造、尋回或埋下胎盤的歸屬家屋等規則，種子家庭則必定會是延續宗家姓氏或名字。",
    "file_name": "能力-古代家名"
  },
  {
    "type": "能力",
    "card_name": "獵場維護",
    "raw_name": "kaizuan na qaqaljupan",
    "description": "獵人的排灣話稱為sacemecemelj(神聖的草藥)，雙關語cemecemelj(森林)以及cemelj(卑微的廢棄物)，意為該角色是森林裡輩分最輕的生命，需敬重山林萬物，且要如同醫生般維護森林的健康。在排灣族觀念裡，一個厲害的獵人指標並不是打了多少獵物，而是看他獵場的生物是否源源不絕，代表他生態維護得很好，神靈很樂於賞賜獵物給他。",
    "file_name": "能力-獵場維護"
  },
  {
    "type": "能力",
    "card_name": "神賜獵物",
    "raw_name": "pualjaljakan nua tjaetjar",
    "description": "排灣族人觀念上認為山林所有動物都是造物者太陽神所養的，人只是跟祂「祈求賜予」，收穫好壞全由祂定奪。另外有些特別的禁地稱為qipuvavau a cemecemelj(天上的森林)，指的是神靈的獵場，一般人嚴禁進入活動，通常這類禁地是就是生物的孵育地，排灣族信仰禁止人們進入，以免環境被打擾而破壞生態平衡。各族群的聖山、大鬼湖等，就是屬這類神聖區域。",
    "file_name": "能力-神賜獵物"
  },
  {
    "type": "能力",
    "card_name": "食物保存",
    "raw_name": "valeng、drinasi、cinapa",
    "description": "原生環境食物得來不易，肉類通常會趁新鮮煮食，也會烤成肉乾或用鹽醃成酸肉來延長保鮮。穀類一般會以穀倉保存，有些植物如芋梗會用日曬來去除水分，也有較複雜的烘乾芋頭技術，透過獨特工序去掉芋頭水分，可以保存一年以上。脫水後的糧食通常會以水煮開調味食用，而在習俗上有關進食的行為也都具有神聖性，極度尊重糧食的地位。",
    "file_name": "能力-食物保存"
  },
  {
    "type": "能力",
    "card_name": "多樣性耕種",
    "raw_name": "puljakarakaravan",
    "description": "一塊良田除主要作物外，四周會再種上豆類、根莖等其他作物，讓部落一年四季都有糧食，也不容易因作物欠收而鬧飢荒。而在每個家屋旁也常設有花園，裡面就種植了藥材、食材及花材等植物，可以說是多樣化的最好體現。此外植物種子保存極為重要，包括一些不常種或不好吃的作物種子。在族人觀念裡，所有作物都有它的用處，會在不同的時間點展現。",
    "file_name": "能力-多樣性耕種"
  },
  {
    "type": "能力",
    "card_name": "穀倉",
    "raw_name": "kubau、salang",
    "description": "部落有共享及平衡資源的機制，在不同祭儀與習俗中，各家庭會將多餘的糧食予以部落，透過智者團分配給農田欠收或人丁稀少的家庭，讓弱者得以克服困難，增加群體的生存力。所以各家房屋內外都有不同大小的穀倉，皆與部落或氏族共同分擔倉儲。食物放到壞掉的行為，代表這個家庭貪婪自私，也不會被族人所接納。",
    "file_name": "能力-穀倉"
  },
  {
    "type": "能力",
    "card_name": "女人刀",
    "raw_name": "viniriyan",
    "description": "女兒出嫁後，家庭會因為少了一位成員而變得虛弱，親家便會贈一至數把刀刃為單鋒、雕有細緻圖騰的禮刀，象徵彌補失去了女人力量的家庭，也代表兩個氏族互相支撐的信物。雕有精美圖騰的刀子大多是配戴裝飾用，通常較少拿來工作。刀鞘的造型與圖騰具有百步蛇守護的意象，族人相信有守護女方家庭的靈力。另外有一種沒有裝飾、砍草木用的工作刀也屬此類，但不會用在儀禮上。",
    "file_name": "能力-女人刀"
  },
  {
    "type": "能力",
    "card_name": "男人刀",
    "raw_name": "cibakubak",
    "description": "這種刀是排灣族男人必備的工具，刀鋒為雙刃，常雕有人頭紋。主要用來狩獵、切肉及剝皮，必要時也可砍草木，中空的刀柄插上木棍即成長矛，刀鞘則設計暗盒可儲存火藥、菸草等小物。有些壯丁的刀尾端會掛上敵人首級的頭髮，並會以獵物鮮血djemuas(血沾)，意味帶著他的靈魂一起出獵或征戰，餵養祂的靈魂以壯大自己的靈氣。如果說女人刀為素刀(吃木頭)，那男人刀則為葷刀(吃血肉)。",
    "file_name": "能力-男人刀"
  },
  {
    "type": "能力",
    "card_name": "遷移部落",
    "raw_name": "malivu",
    "description": "通常部落發展達一定規模後，會分出一部份家庭至其它宜居之地，新的部落會跟原部落保持良好的兄弟關係，所以常會有數個部落結成盟邦。除此之外，諸如外族強大的武力威脅、疾病傳染等，也都會有遷村躲避災禍的情況發生。宜居地的條件嚴格，要符合土質堅硬穩固、接近流動水源、向陽面的斜坡或台地...等多種要素。",
    "file_name": "能力-遷移部落"
  },
  {
    "type": "能力",
    "card_name": "靈犬帶路",
    "raw_name": "kuruljan",
    "description": "在許多排灣族部落中都有關於靈犬(或其他生物)的神話，故事通常描述一隻具有靈性的動物，帶領獵人到達一處宜居之地後便不願離去，而後原部落族人便慢慢搬移至此處形成一座新的村莊。而這隻靈獸在故事最後通常會化身成岩石或山脈，默默守護著部落。",
    "file_name": "能力-靈犬帶路"
  },
  {
    "type": "能力",
    "card_name": "槍枝",
    "raw_name": "guang",
    "description": "狩獵方法主要使用陷阱，以求神靈賜予的心態跟野獸鬥智，除此之外還有武器獵、圍獵、焚獵...等。使用的工具廣泛，其中火槍因火力強大，台灣各族群曾一度盛行用其來狩獵甚至征戰，但也因為如此，在日本理番時期槍枝被大量沒收。",
    "file_name": "能力-槍枝"
  },
  {
    "type": "能力",
    "card_name": "草藥知識",
    "raw_name": "cemelj",
    "description": "cemelj(草藥)與sacemelj(聖草藥)野生動物為同一字根，意味著草藥的初始藥性是從動物的飲食得來，再透過經驗累積來製作藥物，可以說草藥是cemecemelj(森林)給予生物的治癒禮物，在部落醫療系統中有著神聖的地位，造成了製藥或食用過程的儀式性。草藥種類繁多，通常來自山林採集或花園種植，煮水飲用或搗碎外敷都有。",
    "file_name": "能力-草藥知識"
  },
  {
    "type": "能力",
    "card_name": "靈媒團",
    "raw_name": "malada pulingav",
    "description": "祖靈在部落裡是極為重要的信仰，泛指所有生物逝去並成為靈魂的祖先們，部落舉凡大小事件都會請示祖靈，而靈媒就是扮演生者與其溝通的角色。靈媒通常會處理生老病死的相關卜卦儀式，處理有關於「人」的雜事，亦是部落裡重要的草藥醫生與心靈導師。一般而言部落都有正副靈媒數名，而產生則由卜卦或由神珠zaquzaqu(黑色之心)異像揀選出具靈力的女孩，讓她們從小練習草藥、通靈、問話等能力。",
    "file_name": "能力-靈媒團"
  },
  {
    "type": "能力",
    "card_name": "青年團",
    "raw_name": "maqacuvucuvung",
    "description": "又稱為青年會，是以青壯年男性為主的緊密組織，是部落的重要勞動力，農務、獵事外的閒暇時間通常聚在團結會所學習知識與經驗，戰時則是戰鬥或保衛的主要力量，一般而言部落沒有軍隊的概念，但一遇外侮所有青壯年都有義務挺身而出。其中武力或心靈強壯的人會被稱為rakac(強者)並備受尊敬。青年團通常由公認具智慧的ljautuan(折服者)領導，並會聽從智者團或祭司的策略方向。",
    "file_name": "能力-青年團"
  },
  {
    "type": "能力",
    "card_name": "祭司團",
    "raw_name": "parakaljai",
    "description": "祭司在部落裡是輩分非常重的角色，主要處理跟太陽神或聖祖靈有關的事務，通常也身兼智者團的一員，忙於處理部落上下的事務。遇到如palisilisi(年祭)等大儀式時則負責主持，其中稱為palaingan(被跟隨)的為主祭司，行祭時會有眾多副祭司與靈媒輔佐。同智者一樣也是以族人推派的方式產生，除了要具備智慧外，也需要有與神靈溝通的能力。",
    "file_name": "能力-祭司團"
  },
  {
    "type": "能力",
    "card_name": "智者團",
    "raw_name": "papuvaruvarungan",
    "description": "部落會推舉一些具有大智慧的人來仲裁部落事務，這群人通常有足夠的生命經驗與見識，小至鄰居糾紛、大至部落公約都由他們定奪，也會在太陽小孩出面與其它族群交際時提供他們的智慧。一位智者要是常做出讓人無法信服的決定，族人也可能會客氣的「請他休息」。",
    "file_name": "能力-智者團"
  },
  {
    "type": "榮耀",
    "card_name": "聖山",
    "raw_name": "tjaivuvu、kavulungan tjagaraus、parasidjan",
    "description": "聖山在各排灣族群中非常重要，在神話中是caucau(人)的kineveqacan(萌芽之地)，是造物者太陽神居住並看顧族人之處，有些部落會把山擬人化，直接將它視為神的化身。聖山通常嚴禁族人進入，許多祭儀也都會朝聖山所在方位祭拜，祈求居於該處的神靈聆聽。 tjaivuvu(大姆姆山)是排灣族ravar群的聖山，意思為「懷抱在祖父/子孫那裡(意 指生命輪迴)」。\nkavulungan(北大武山)是vuculj、paumaq、kaqaluan群的聖山，意思為「神 聖的耆老」。 \ntjagaraus(南大武山)是paumaq、pavua、paqalu群的聖山，意思為「靈界的 部落」。 \nparasidjan(霧頭山)是drekai魯凱族的聖山，意思為「使之和諧」。",
    "file_name": "榮耀-聖山"
  },
  {
    "type": "榮耀",
    "card_name": "創始祖屋",
    "raw_name": "vineqacan",
    "description": "又稱為祖靈屋，是部落的信仰中心，供俸著太陽神、祖靈、動植物、天地河川...等諸多靈位，部落三聖物的古陶壺、青銅刀及琉璃珠之一的黑色神珠也安放於此，是大型祭儀的主要行祭場所，也是祭司與靈媒常卜卦問靈的地方，一般人不能隨意進入。室內設有kina tevetevaljan nua likezalj(天地母灶)，象徵著萬物的香火命脈，會在palisilisi(年祭)時供各家屋更新火種。創始祖屋是一個部落 創建時最先設立也是最重要的場所之一。",
    "file_name": "榮耀-創始祖屋"
  },
  {
    "type": "榮耀",
    "card_name": "團結會所",
    "raw_name": "cakar",
    "description": "cakar有力量相互支撐之意，另有雙關語為「理出頭緒」，是部落青年的聚集場所，分享知識與經驗的地方，為重要的智庫集散地與部落武力的象徵，亦是重大事務決策之處。會所通常會一直有人看顧，場域內則設置了青年寢台、獸骨架、祖靈牌位...等，並設有永不熄滅的公共火塘，以供族人在家屋火種熄滅時來取火種。",
    "file_name": "榮耀-團結會所"
  },
  {
    "type": "榮耀",
    "card_name": "慰靈祭場",
    "raw_name": "purupuruc",
    "description": "部落勇士馘取敵人首級後，祭司會在此舉行慎重儀式安慰其被殺害的靈魂，讓其加入排灣族群的祖靈行列，首級拜完後會掛在部落出入口的榕樹上，用以風乾並嚇阻敵人，之後便會安置回祭場裡的tataruman(人頭架)，從架上的頭骨數量可以看出一個部落的實質力量與靈魂力量，也對外族展現其保衛的決心，但極忌諱任意炫耀，以免眾祖靈生怒作亂。平時此場所嚴禁一般人進入，內部安置著salalupengan(魂魄壺)、kindraljum(聖酒杯)等相關法器。",
    "file_name": "榮耀-慰靈祭場"
  },
  {
    "type": "榮耀",
    "card_name": "建立-部落祖靈柱",
    "raw_name": "sauljai",
    "description": "部落有非常多種大小、位置、名稱及意義不同的祖靈柱，有的標示禁地邊界，有的象徵家屋的守護。其中sa uljai(臍帶)象徵部落與造物者太陽神的連結，亦是祖靈入凡界的天梯，是全族人共有的重要祖靈柱。該柱會立在太陽種子的家屋前，底下會墊起類似司令台的pudek(肚臍)，並會在旁邊種植榕樹以供祖靈下凡時乘涼。此外柱子前的空地也常是族人聚會或發表重要言論之處。",
    "file_name": "榮耀-部落祖靈柱"
  },
  {
    "type": "榮耀",
    "card_name": "紋上-榮耀紋路",
    "raw_name": "kivecik",
    "description": "部落裡要凸顯一個人的能力，比如手藝、傳唱技藝、戰功或為人稱道的事蹟時，會以紋身來表現。每個圖紋及位置各有各的意思，除彰顯榮耀外，也希望該圖騰能賦予靈力，讓被紋者能保持其力量。有些部落也會紋上太陽或大地血脈的象徵，以示其氏族輩分。紋身形式則有許多種，手背、手臂、胸口至背部、大小腿等，除臉部外全身都可紋上。",
    "file_name": "榮耀-榮耀紋路"
  },
  {
    "type": "榮耀",
    "card_name": "敬畏-萬物精靈",
    "raw_name": "vavak、lizengan",
    "description": "排灣族人深信萬物皆有靈。除了各種生物的祖靈外，小從草木大至山河，又皆有精靈存在其中，很多事情會舉行儀式請示精靈的意見，比如跟樹精靈借手臂(樹的枝枒)、跟鋤頭精靈感謝辛勞或跟岩石的精靈賠罪等等。也因為如此，族人對於周遭事物會特別敬重，將世界萬物視為活物，並與其和諧生存。",
    "file_name": "榮耀-萬物精靈"
  },
  {
    "type": "榮耀",
    "card_name": "歷代知識",
    "raw_name": "kineljangan",
    "description": "排灣族沒有文字系統，但傳承歷史與經驗的方法有許多種。歌謠或神話故事傳唱、依事件命地名或人名、各個琉璃珠的典故、用圖騰雕刻及刺繡來記錄...等。部落有些人或氏族被稱為pu cangit(善於傳唱)或是pu alang(善於美學)等，指的是他們擅長記錄並傳承文化，族人也會視其為輩分比較重的角色。",
    "file_name": "榮耀-歷代知識"
  },
  {
    "type": "榮耀",
    "card_name": "祭祀-太陽神祭",
    "raw_name": "pakaiyiuma tua qadaw",
    "description": "",
    "file_name": "榮耀-祭祀太陽神"
  },
  {
    "type": "榮耀",
    "card_name": "祭祀-動物生命祭",
    "raw_name": "mavesuang",
    "description": "",
    "file_name": "榮耀-祭祀動物生命"
  },
  {
    "type": "榮耀",
    "card_name": "祭祀-植物生命祭",
    "raw_name": "masalut",
    "description": "",
    "file_name": "榮耀-祭祀植物生命"
  },
  {
    "type": "榮耀",
    "card_name": "祭祀-人祖生命祭",
    "raw_name": "pakaiyiuma tua vuvu",
    "description": "",
    "file_name": "榮耀-祭祀人祖生命"
  },
  {
    "type": "榮耀",
    "card_name": "聖物-古陶壺",
    "raw_name": "reretan",
    "description": "",
    "file_name": "榮耀-聖物-古陶壺"
  },
  {
    "type": "榮耀",
    "card_name": "聖物-青銅刀",
    "raw_name": "ragam",
    "description": "",
    "file_name": "榮耀-聖物-青銅刀"
  },
  {
    "type": "榮耀",
    "card_name": "聖物-琉璃珠",
    "raw_name": "qata",
    "description": "",
    "file_name": "榮耀-聖物-琉璃珠"
  },
  {
    "type": "王牌",
    "card_name": "排灣族民族議會",
    "raw_name": "kinarasudan na kacalisian",
    "description": "排灣族民族議會是近年來排灣族人自主發起的跨部落組織，以民族議會之名希望能帶動民族邁向自治共榮來同謀劃傳統領域及排灣社會文化的發展。",
    "file_name": "王牌-民族議會"
  },
  {
    "type": "王牌",
    "card_name": "部落公法人",
    "raw_name": "qinaljan",
    "description": "原住民族委員頒布的部落公法人辦法，以備未來原住民部落可以成為可以管理傳統領域土地的法人成為自治組織的基礎，是我國原住民政策中最重要的法政制度，以建備原住民的民族自決。",
    "file_name": "王牌-部落公法人"
  },
  {
    "type": "交際",
    "card_name": "換工",
    "raw_name": "mazazeliuliulj、temalava",
    "description": "換工是部落一種互助的制度。建設、狩獵或農忙期需要大量勞動力時，各家庭多餘人力會組成一支臨時隊伍，依工作時序互相協助直到各家工作完成，人力可隨時變動的特點，較不會造成勞動力重疊問題。另外，有些人緣不好的人，前去協助的幫手就相對較少，此機制便會使人勤於幫助部落，團結族人間的關係。",
    "file_name": "交際-換工"
  },
  {
    "type": "交際",
    "card_name": "聯姻",
    "raw_name": "mare cekecekelj",
    "description": "部落把婚姻視為生命的延續，是為了maedalj(接種子)族群的命脈，故皆以慎重對待。太陽與大地氏族婚禮方式有所不同，每個部落也各有其禮俗，但大致上結婚雙方會以彰顯其血脈的榮耀來舉行，如太陽氏族重現其誕生過程的paukuz(護駕)儀式。此外排灣族也極為重視系譜記憶，除避免近親通婚，也讓眾多氏族的歷史透過聯姻來延續。",
    "file_name": "交際-聯姻"
  },
  {
    "type": "交際",
    "card_name": "貿易",
    "raw_name": "gitan",
    "description": "排灣族部落之間少有貿易的觀念，至多是以「一起分享勞力成果」的想法以物易物，交換糧食或資源。正式貿易行為主要發生在對殖民者或平埔族群，族人提供獸皮、鹿角或肉桂等山產，來換取鐵器與槍枝等山林缺乏的資源。此外，部落裡總有所謂具pu lingalingau(探索未知)的人會想要知道新東西，排灣族人通常對新事物也常感到好奇，貿易便成為換取知識的一種重要手段。",
    "file_name": "交際-貿易"
  },
  {
    "type": "事件",
    "card_name": "發生-羅發號事件",
    "raw_name": "羅發號事件",
    "description": "羅發號事件乃1867年時美國商船羅發號(Rover，又譯羅妹號)途經臺灣海峽時，遭風浪漂流至屏東七星岩觸礁沉沒，遇難船員於今墾丁附近，誤闖排灣族領地，遭到原住民武力反擊，船長亨特?漢特(J. W. Hunt)夫婦等十三人遭「出草」殺害。清朝政府認為不在管理版圖內作為緣由而不受理此事，美國於是決定自行處理。",
    "file_name": "事件-羅發號事件"
  },
  {
    "type": "事件",
    "card_name": "發生-牡丹社事件",
    "raw_name": "牡丹社事件",
    "description": "牡丹社事件發生於1874年，琉球王國船難者因誤闖台灣原住民領地而遭到出草身亡，日本因而出兵攻打台灣南部原住民各部落的軍事行動，以及隨後中日兩國的外交折衝。在日本，這次事件被稱為「台灣出兵」或是「征台之役」。這起事件這是日本自從明治維新以來首次向對外用兵，也是中日兩國在近代史上第一次重要外交事件。",
    "file_name": "事件-牡丹社事件"
  },
  {
    "type": "事件",
    "card_name": "發生-力里社事件",
    "raw_name": "力里社事件",
    "description": "大正3年(1914)，日本為確保統治地位，台灣總督府投入上千名士兵?制沒收高雄、臺東、屏東等地布農族、排灣族的獵槍，此舉引起布農族、排灣族的激烈抗爭。屏東春日境內的力里社與臺東達仁的姑子崙社分別發難，攻擊力里、浸水營、姑子崙三地日警駐在所殺死當地日警及其眷屬十數人，焚毀日警駐在所，且一度攻陷枋寮支廳，戰火迅速蔓延整個恆春半島。",
    "file_name": "事件-力里社事件"
  },
  {
    "type": "事件",
    "card_name": "發生-南蕃事件",
    "raw_name": "南蕃事件",
    "description": "1914年佐久間總督宣告平定太魯閣原住民後，隨即緊縮對「南蕃」的統治政策 ，隨之發動槍枝押收的行動。官方強勢的行動，激起阿緱廳枋寮支廳轄下的排灣族人聯合臺東廳巴塱衛支廳轄下排灣族的反抗行動，此地的襲警事件，激發了阿緱廳的枋寮、恆春、阿里港各支廳轄下，及臺東廳巴塱衛支廳轄下的排灣族人如野火燎原地一連串、大規模的起事抗警事件。",
    "file_name": "事件-南蕃事件"
  }, {
    "type": "危機",
    "card_name": "疫病降臨",
    "raw_name": "tjaruljayar",
    "description": "部落裡發生的大型傳染病，其嚴重後果皆讓族人謹慎對待，除透過各種祭儀驅逐惡靈，也利用草藥醫治、隔離病者或燒毀汙穢物等方式消除疾病。更嚴重的情形會被認為是原居地有惡靈作怪，需遷移部落至海拔較高、接近太陽神之處。此外不同時期的殖民者也常帶來不同的疾病，這種族人不熟悉的傳染現象被稱為saqetjuan na vali(風帶來的病)。",
    "file_name": "危機-疫病降臨"
  },
  {
    "type": "危機",
    "card_name": "異邦人開路",
    "raw_name": "djalan nua qalja",
    "description": "djalan意思為「腳踏平穩」。族人不會特意開闢道路，至多闢出一個人雙腳寬度的路徑至農耕地，在森林中則會借用動物的獸徑，盡量不用道路「切割」大地。外來的殖民者則因為要運送貨物、資源甚至火砲等，會開闢寬大的馬路或鐵路，在部落常被認為是侵犯了大地而與之發生衝突。",
    "file_name": "危機-異邦人開路"
  },
  {
    "type": "危機",
    "card_name": "獵場爭奪",
    "raw_name": "kinamamavan",
    "description": "各族群領域在山林中總會有重疊之處，通常處於井水不犯河水的和平狀態，在獵場相遇也盡量示其友好。但有時會發生族人被獵首或陷阱被蓄意破壞的情況，輕者會透過雙方部落的太陽氏族來調解，嚴重的則會造成兩個族群的對立，甚至出現大型的械鬥或長久敵對的情況，但一般僅點到為止的警告，不會有滅族的行為發生。許多獵物富饒的tjua palisi(神聖禁地)周遭都是獵場模糊地帶，如tjaljupaling(大鬼湖)就圍繞著魯凱、拉瓦爾、內本鹿、納瑪夏等族群。",
    "file_name": "危機-獵場爭奪"
  },
  {
    "type": "危機",
    "card_name": "靈魂馘取",
    "raw_name": "maqinacap",
    "description": "獵首是一個嚴謹的的試煉制度，對一位男人而言是體能與膽識的最大考驗，對部落來說，為的則是去奪取異族靈魂來加入自己的祖靈，壯大部落的守護能量。獵首一般會在農閒時期單獨或結伴進行。此外為了鞏固部落領域，也會透過獵首來嚇阻侵犯的敵人，透過尚武精神來證明部落的強大，以他們的靈魂換取部落間的和平。",
    "file_name": "危機-靈魂馘取"
  },
  {
    "type": "危機",
    "card_name": "惡靈侵擾",
    "raw_name": "qakuma",
    "description": "排灣族信仰裡，凡界中的人類、動植物等生命，在死後都會成為lizengan(祖靈)，進入靈界與太陽神共享永恆。祖靈們有些性格善良，比較照顧生者，有些則被認為脾氣不好，喜歡在凡界搗亂，這些壞脾氣的祖靈被稱為qakuma(惡靈)或galalj(鬼)。而祂們的搗亂成果就具現於生活之中，舉凡生病、意外及各種壞事，都常被認為是惡靈在作怪，需要趕快彌補或制止祂們的壞脾氣。",
    "file_name": "危機-惡靈侵擾"
  },
  {
    "type": "危機",
    "card_name": "尼德蘭到來",
    "raw_name": "holangda 、 qamehuan",
    "description": "荷人治臺乃藉由地方會議來挑選受其征服的各社首長，候選人來自社內長老，首長職權除執行當局政令之外，亦需協助宣教士推動教育事業。當時原住民部落，除了大肚王國及瑯嶠、瑪家等排灣族部落以外，社內少有絕對的統治者。",
    "file_name": "危機-尼德蘭到來"
  },
  {
    "type": "危機",
    "card_name": "清國到來",
    "raw_name": "rigariga",
    "description": "清代治理原住民行政之初，基本上採取消極的態度而視山地為化外之地而封鎖，在這種政策下，清國不但積極向山地推進其國境線，並允許漢人資本進入山地進行殖民拓墾，大肆掠奪木材、薪炭、樟腦，並在開墾地上展開稻米、茶、甘蔗的耕作。",
    "file_name": "危機-清國到來"
  },
  {
    "type": "危機",
    "card_name": "日本到來",
    "raw_name": "ripung",
    "description": "近代日本與台灣的關係，可以溯源自1874年的牡丹社事件，當時日本藉口琉球難民被台灣原住民殺害，出兵台灣，與屏東的排灣族人交戰，事後，清朝與日本簽訂和約，清朝賠款，承認日本出兵的合法性，而日本軍隊則撤出台灣。",
    "file_name": "危機-日本到來"
  },
  {
    "type": "危機",
    "card_name": "中華民國到來",
    "raw_name": "ljautia",
    "description": "蔡英文總統代表政府向原住民族道歉文：       「讓我用很簡單的語言，來表達為什麼要向原住民族道歉的原因。臺灣這塊土地，四百年前早有人居住。這些人原本過著自己的生活，有自己的語言、文化、習俗、生活領域。接著，在未經他們同意之下，這塊土地上來了另外一群人。歷史的發展是，後來的這一群人，剝奪了原先這一群人的一切。讓他們在最熟悉的土地上流離失所，成為異鄉人，成為非主流，成為邊緣。」（中華民國105年08月01日）",
    "file_name": "危機-中華民國到來"
  },
  {
    "type": "危機",
    "card_name": "饑荒降臨",
    "raw_name": "kemaljaculjan",
    "description": "排灣族人並沒有「天罰」的觀念，反之認為神總是慷慨賜予人類，只是祂偶爾勞累需要休息，亦或動植物生命靈氣需要補足，又或者祂的憤怒讓大地飢渴。大災禍如飢荒通常會被認為是piculj nua cavilj(時空的力量)，多年必定會出現一次。而發生時除虔誠祭祀萬物，也會透過屯糧、狩獵、採集等各種方法度過難關。",
    "file_name": "危機-饑荒降臨"
  },

];

function getCardByFileName(card_file_name) {
  var card = null;
  card_list.map(item => {
    if (item.file_name == card_file_name) {
      card = new Card(0, 0,
        item.type,
        item.card_name,
        item.raw_name,
        item.description,
        item.file_name);
    }
  });
  return card;
}


function setCanvasSize() {
  cnv.width = MAP_SIZE_W;
  cnv.height = MAP_SIZE_H;
  cnv.classList.add("sample");
}

setCanvasSize();

window.addEventListener('resize', setCanvasSize)

function render() {
  const { me, others, cards } = getCurrentState();
  if (!me) {
    return;
  }

  clearCanvas();//確保畫布背景為空
  cards.map(renderCard.bind(null, me));
  renderPlayer(me, me);
  others.forEach(renderPlayer.bind(null, me));
  updateStandby(me, others);
  showCardList(me);

  showCardInfo(me);
}

function clearCanvas() {

  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, cnv.width, cnv.height);
  ctx.restore();
}

function renderCard(me, card) {
  const { x, y, w, h, file_name } = card;
  const img = new Image();
  img.src = "/assets/img/cards/" + file_name + ".svg";
  ctx.save();
  ctx.drawImage(
    img,
    x, y,
    w, h
  )
  ctx.restore();
}

function renderPlayer(me, player) {
  const { x, y, username, cards } = player;
  if (username == "debug") {
    return;
  }

  const img = new Image();
  img.src = "/assets/img/body/" + getCookie('family') + "_" + getCookie('head-side') + ".svg";
  ctx.save();
  ctx.translate(x, y);
  ctx.drawImage(
    img,
    - PLAYER.RADUIS,
    - PLAYER.RADUIS,
    PLAYER.RADUIS * 2,
    PLAYER.RADUIS * 4
  )
  ctx.restore();

  ctx.fillStyle = 'white'
  ctx.fillRect(
    x - PLAYER.RADUIS,
    y - PLAYER.RADUIS - 8,
    PLAYER.RADUIS * 2,
    4
  )

  ctx.fillStyle = 'orange'
  ctx.fillRect(
    x - PLAYER.RADUIS,
    y - PLAYER.RADUIS - 8,
    PLAYER.RADUIS * 2 * (player.hp / PLAYER.MAX_HP),
    4
  )

  ctx.strokeStyle = "brown";
  ctx.fillStyle = 'white'
  ctx.textAlign = 'center';
  ctx.font = "30px Arial";
  ctx.strokeText(player.username, x, y - PLAYER.RADUIS - 16);
  ctx.fillText(player.username, x, y - PLAYER.RADUIS - 16);

  player.cards.map((card, i) => {
    const img = new Image();
    img.src = "/assets/img/cards/" + card + ".svg";
    var w = CARD.SIZE_W;
    var h = CARD.SIZE_H;
    if (card.startsWith("危機")) {
      w = CARD.SIZE_B_W;
      h = CARD.SIZE_B_H;
    }
    ctx.drawImage(
      img,
      x - PLAYER.RADUIS + i * 22,
      y + PLAYER.RADUIS + 16,
      w / 10, h / 10
    );
  });
}

let renderInterval = null;
export function startRendering() {
  renderInterval = setInterval(render, 1000 / 60);
}

export function stopRendering() {
  ctx.clearRect(0, 0, cnv.width, cnv.height)
  clearInterval(renderInterval);
}

export function updateRanking(data) {
  let str = '';

  data.map((item, i) => {
    str += `
      <tr>
        <td>${i + 1}</td>
        <td>${item.username}</td>
        <td>${item.score}</td>
      <tr>
    `
  })
  document.querySelector('.ranking table tbody').innerHTML = str;
}

export function showCardInfo(player) {
  const { cards } = player;
  if (cards.length < 1) {
    document.querySelector("#card-info-blank").classList.remove("hidden");
    document.querySelector("#card-info").classList.add("hidden");
    return;
  }
  document.querySelector("#card-info-blank").classList.add("hidden");
  document.querySelector("#card-info").classList.remove("hidden");
  var card = getCardByFileName(cards[cards.length - 1]);

  const card_img = document.querySelector('#card-img');
  const card_name = document.querySelector('#card-name');
  const raw_name = document.querySelector('#raw-name');
  const description = document.querySelector('#description');

  card_img.src = "assets/img/cards/" + card.file_name + ".svg";
  card_name.innerHTML = card.card_name;
  raw_name.innerHTML = card.raw_name;
  description.innerHTML = card.description;
}

export function showCardList(player) {
  const { cards } = player;
  let str = '';
  cards.map(file_name => {
    var card = getCardByFileName(file_name);

    str += `
    <div class="ts-content">
      <div class="ts-box is-horizontal">
        <div class="ts-image is-covered">
            <img style="width: 130px; height: 100%;" src="/assets/img/cards/${card.file_name}.svg">
        </div>
        <div class="ts-content">
        <div class="ts-header">${card.card_name}</div>
          <div id="raw-name" class="ts-text is-description">${card.raw_name}</div>
          <p>${card.description}</p>
        </div>
      </div>
    </div>
    `
  });
  document.querySelector('#card-list-card').innerHTML = str;
}

export function updateStandby(me, others) {
  const { username, score } = me;
  if (username == "debug") {
    var dom = document.querySelector('#standby');
    //檢測無人狀態顯示待機畫面
    if (others.length < 1) {
      dom.classList.remove("hidden");
    } else {
      dom.classList.add("hidden");
    }
  }

  document.querySelector('#score-top').innerHTML = score;

}

