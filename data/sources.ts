export type SourceKind =
  | "หลักสูตร"
  | "หน่วยงานรัฐ"
  | "กฎหมาย"
  | "ตำรา/หนังสือ"
  | "งานวิจัย"
  | "เพจการแข่งขัน"
  | "สื่อการเรียนรู้"
  | "ฐานข้อมูลสากล";

export type SourceRef = {
  id: string;
  /** ชื่อแหล่งอ้างอิงที่ใช้แสดงใน UI */
  title: string;
  /** หน่วยงานหรือผู้จัดทำ */
  org: string;
  url: string;
  kind: SourceKind;
  /** คำอธิบายสั้นว่าข้อมูลจากแหล่งนี้ใช้ยืนยันเรื่องใด */
  note: string;
};

/**
 * ทะเบียนแหล่งอ้างอิง
 * ทุกหัวข้อเนื้อหาในเว็บจะอ้าง id จากที่นี่ เพื่อให้ตรวจสอบย้อนกลับได้
 */
export const SOURCES: SourceRef[] = [
  {
    id: "ku-curriculum-fisheries",
    title: "หลักสูตรวิทยาศาสตรบัณฑิต สาขาวิชาประมง (ปรับปรุง 2555) — คำอธิบายรายวิชา",
    org: "สำนักทะเบียนและประมวลผล มหาวิทยาลัยเกษตรศาสตร์",
    url: "https://registrar.ku.ac.th/wp-content/uploads/eduserv/PDF/ku/fish/CD_B.S.Fisheries_55.pdf",
    kind: "หลักสูตร",
    note: "ใช้กำหนดขอบเขตเนื้อหาที่คณะประมง มก. ถือว่าเป็นแกนของวิชาการประมง",
  },
  {
    id: "ku-faculty-fisheries",
    title: "คณะประมง มหาวิทยาลัยเกษตรศาสตร์ — ข้อมูลคณะและสาขาวิชา",
    org: "มหาวิทยาลัยเกษตรศาสตร์",
    url: "https://www.ku.ac.th/th/faculty-of-fisheries",
    kind: "หน่วยงานรัฐ",
    note: "ข้อมูลภาพรวมคณะประมง สาขาวิชา และงานบริการวิชาการ",
  },
  {
    id: "ku-kps-contest-page",
    title: "การแข่งขันความรู้ทางการประมง งานเกษตรกำแพงแสน",
    org: "คณะประมง มก. วิทยาเขตกำแพงแสน",
    url: "https://www.facebook.com/fishkps/",
    kind: "เพจการแข่งขัน",
    note: "ประกาศกติกา หัวข้อสอบ กำหนดการ และเกียรติบัตรของการแข่งขัน",
  },
  {
    id: "ku-student-contest",
    title: "ระบบรับสมัครและประกาศผลการแข่งขันนักเรียน",
    org: "มหาวิทยาลัยเกษตรศาสตร์",
    url: "https://sites.google.com/ku.th/studentcontest",
    kind: "เพจการแข่งขัน",
    note: "ศูนย์รวมประกาศการแข่งขันสำหรับนักเรียนมัธยมของ มก.",
  },
  {
    id: "kps-2567-site",
    title: "เว็บไซต์งานเกษตรกำแพงแสน 2567",
    org: "คณะประมง มก. วิทยาเขตกำแพงแสน",
    url: "https://sites.google.com/ku.th/kukps2567/home",
    kind: "เพจการแข่งขัน",
    note: "ข้อมูลงานเกษตรกำแพงแสนและกิจกรรมของคณะประมง",
  },
  {
    id: "fao-fisheries",
    title: "FAO Fisheries and Aquaculture — Technical Guidelines and Fact Sheets",
    org: "Food and Agriculture Organization of the United Nations",
    url: "https://www.fao.org/fishery/en",
    kind: "ฐานข้อมูลสากล",
    note: "นิยามมาตรฐานสากลของการเพาะเลี้ยงสัตว์น้ำ เครื่องมือประมง และการจัดการประมง",
  },
  {
    id: "fisheries-act-2490",
    title: "พระราชบัญญัติการประมง พุทธศักราช 2490",
    org: "ราชกิจจานุเบกษา",
    url: "https://www4.fisheries.go.th/local/index.php/main/view_rule/1",
    kind: "กฎหมาย",
    note: "กฎหมายแม่บทว่าด้วยการอนุรักษ์พันธุ์สัตว์น้ำและเครื่องมือประมงที่ห้ามใช้",
  },
  {
    id: "fisheries-act-2558",
    title: "พระราชกำหนดการประมง พ.ศ. 2558 และที่แก้ไขเพิ่มเติม",
    org: "ราชกิจจานุเบกษา / กรมประมง",
    url: "https://www4.fisheries.go.th/local/index.php/main/view_rule",
    kind: "กฎหมาย",
    note: "กฎหมายฉบับปัจจุบัน ครอบคลุมการทำประมง IUU การควบคุมเครื่องมือ และการเพาะเลี้ยง",
  },
  {
    id: "doF-main",
    title: "กรมประมง — ฐานข้อมูลและองค์ความรู้",
    org: "กรมประมง กระทรวงเกษตรและสหกรณ์",
    url: "https://www4.fisheries.go.th/",
    kind: "หน่วยงานรัฐ",
    note: "ข้อมูลชนิดพันธุ์สัตว์น้ำเศรษฐกิจ โรคสัตว์น้ำ มาตรฐานฟาร์ม และสถิติการประมง",
  },
  {
    id: "doF-fishbase-th",
    title: "ฐานข้อมูลพันธุ์ปลาและสัตว์น้ำไทย",
    org: "กรมประมง",
    url: "https://www4.fisheries.go.th/local/index.php/main/species",
    kind: "ฐานข้อมูลสากล",
    note: "ชื่อไทย–ชื่อวิทยาศาสตร์ ถิ่นอาศัย และสถานภาพของสัตว์น้ำไทย",
  },
  {
    id: "fishbase",
    title: "FishBase — Global Species Database",
    org: "FishBase Consortium",
    url: "https://www.fishbase.se/",
    kind: "ฐานข้อมูลสากล",
    note: "ข้อมูลอนุกรมวิธาน นิสัยการกินอาหาร และการแพร่กระจายของปลา",
  },
  {
    id: "worms",
    title: "World Register of Marine Species (WoRMS)",
    org: "WoRMS Editorial Board",
    url: "https://www.marinespecies.org/",
    kind: "ฐานข้อมูลสากล",
    note: "ชื่อวิทยาศาสตร์ที่ยอมรับปัจจุบันของสัตว์น้ำทะเล",
  },
  {
    id: "iucn-redlist",
    title: "The IUCN Red List of Threatened Species",
    org: "International Union for Conservation of Nature",
    url: "https://www.iucnredlist.org/",
    kind: "ฐานข้อมูลสากล",
    note: "สถานภาพการอนุรักษ์ของชนิดพันธุ์ที่ใกล้สูญพันธุ์ในไทย",
  },
  {
    id: "tbkknowledge",
    title: "คลังความรู้ กรมประมง (Thai Fisheries Knowledge)",
    org: "กรมประมง",
    url: "https://www4.fisheries.go.th/local/index.php/main/knowledge",
    kind: "สื่อการเรียนรู้",
    note: "เอกสารเผยแพร่การเพาะเลี้ยง โรคสัตว์น้ำ และคุณภาพน้ำ",
  },
  {
    id: "kukr-fish",
    title: "คลังหนังสือและงานวิจัยทางประมง",
    org: "สำนักหอสมุด มหาวิทยาลัยเกษตรศาสตร์",
    url: "https://kukr.lib.ku.ac.th/BKN_FISH/",
    kind: "ตำรา/หนังสือ",
    note: "ตำราและงานวิจัยทางประมงที่ใช้ประกอบการเรียนการสอนของคณะประมง",
  },
  {
    id: "wikimedia-commons",
    title: "Wikimedia Commons — Free Media Repository",
    org: "Wikimedia Foundation",
    url: "https://commons.wikimedia.org/",
    kind: "สื่อการเรียนรู้",
    note: "ภาพถ่ายและภาพวาดทางชีววิทยาที่มีสัญญาอนุญาตเสรี ใช้ประกอบเนื้อหา",
  },
  {
    id: "wikispecies",
    title: "Wikispecies — Free Species Directory",
    org: "Wikimedia Foundation",
    url: "https://species.wikimedia.org/",
    kind: "ฐานข้อมูลสากล",
    note: "ใช้ตรวจสอบการจัดจำแนกชั้นทางอนุกรมวิธานของสัตว์น้ำ",
  },
  {
    id: "fish-anatomy-note",
    title: "ความรู้เบื้องต้นเกี่ยวกับอนุกรมวิธานของปลา (E-book)",
    org: "ศูนย์วิทยาศาสตร์เพื่อการศึกษา จังหวัดนครพนม",
    url: "https://pubhtml5.com/zccz/qtsn/basic/",
    kind: "สื่อการเรียนรู้",
    note: "เอกสารภาษาไทยที่อธิบายกายวิภาค เกล็ด ครีบ และหลักการจำแนกปลา ใช้เทียบเคียงเอกสารบรรยายของคณะประมง",
  },
  {
    id: "sahas-fish-kps",
    title: "ปลา: ความรู้พื้นฐาน อนุกรมวิธาน และนิเวศวิทยา (เอกสารบรรยาย)",
    org: "สหัส ราชเมืองขวาง — ภาควิชาเพาะเลี้ยงสัตว์น้ำ และสถานีวิจัยประมงกำแพงแสน คณะประมง มก.",
    url: "https://www.researchgate.net/publication/389127266",
    kind: "ตำรา/หนังสือ",
    note: "เอกสารบรรยายที่ตรงกับหัวข้อสอบรอบที่สองของการแข่งขันครั้งที่ 10",
  },
  {
    id: "kps-fish-book",
    title: "พันธุ์ปลาน้ำจืดในมหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน",
    org: "สหัส ราชเมืองขวาง และคณะ (2568)",
    url: "https://kasets.art/zumtHO",
    kind: "ตำรา/หนังสือ",
    note: "หนังสือรวบรวมชนิดพันธุ์ปลาน้ำจืดในพื้นที่กำแพงแสน พร้อมภาพถ่ายและข้อมูลถิ่นอาศัย",
  },
  {
    id: "seafdec-gear",
    title: "SEAFDEC — การจำแนกประเภทเครื่องมือประมง",
    org: "ศูนย์พัฒนาการประมงแห่งเอเชียตะวันออกเฉียงใต้",
    url: "https://repository.seafdec.or.th/handle/20.500.12067/860",
    kind: "งานวิจัย",
    note: "มาตรฐานการจำแนกเครื่องมือประมงที่ใช้กันในภูมิภาคเอเชียตะวันออกเฉียงใต้",
  },
  {
    id: "fisheries-2490-wikisource",
    title: "พระราชบัญญัติการประมง พุทธศักราช 2490 (ฉบับเต็ม)",
    org: "วิกิซอร์ซ",
    url: "https://th.wikisource.org/wiki/พระราชบัญญัติการประมง_พ.ศ._2490",
    kind: "กฎหมาย",
    note: "ใช้ยืนยันนิยามและการแบ่งประเภทที่จับสัตว์น้ำทั้ง 4 ประเภท",
  },
  {
    id: "fisheries-2558-summary",
    title: "สรุปพระราชกำหนดการประมง พ.ศ. 2558",
    org: "กระทรวงเกษตรและสหกรณ์",
    url: "https://www.moac.go.th/law_agri-files-422891791096",
    kind: "กฎหมาย",
    note: "สรุปสาระสำคัญของ พรก. การประมง 2558 และมาตรการแก้ไขปัญหาประมง IUU",
  },
  {
    id: "doF-water-quality",
    title: "บทความคุณภาพน้ำสำหรับการเพาะเลี้ยงสัตว์น้ำ",
    org: "กรมประมง",
    url: "https://www4.fisheries.go.th/dof/news_local/16/116613",
    kind: "หน่วยงานรัฐ",
    note: "ค่าออกซิเจนละลายน้ำที่เหมาะสมในบ่อเลี้ยง (ประมาณ 5–7 มก./ลิตร)",
  },
  {
    id: "gap-7436",
    title: "มาตรฐาน มกษ. 7436-2563 การปฏิบัติทางการเพาะเลี้ยงสัตว์น้ำที่ดี (GAP)",
    org: "สำนักงานมาตรฐานสินค้าเกษตรและอาหารแห่งชาติ (มกอช.)",
    url: "https://www.acfs.go.th/standard/",
    kind: "กฎหมาย",
    note: "ข้อกำหนดการเลี้ยงสัตว์น้ำที่ดีด้านคุณภาพน้ำ อาหาร และสุขอนามัย",
  },
  {
    id: "doF-stat",
    title: "ศูนย์สถิติการประมงแห่งประเทศไทย",
    org: "กรมประมง",
    url: "https://stat.fisheries.go.th",
    kind: "หน่วยงานรัฐ",
    note: "สถิติผลผลิตและมูลค่าสัตว์น้ำรายปีของประเทศไทย",
  },
  {
    id: "mangrove-thailand",
    title: "สถานภาพและความสำคัญของป่าชายเลนไทย",
    org: "กรมทรัพยากรทางทะเลและชายฝั่ง",
    url: "https://www.dmcr.go.th/",
    kind: "หน่วยงานรัฐ",
    note: "ข้อมูลระบบนิเวศป่าชายเลน แนวปะการัง และการอนุรักษ์สัตว์น้ำทะเลไทย",
  },
  {
    id: "thai-agri-extension",
    title: "กรมส่งเสริมการเกษตร — องค์ความรู้ด้านการเกษตร",
    org: "กรมส่งเสริมการเกษตร",
    url: "https://www.doae.go.th/",
    kind: "หน่วยงานรัฐ",
    note: "คำแนะนำการเลี้ยงสัตว์น้ำในระดับฟาร์มและบ่อดิน",
  },
  {
    id: "kampuan-guidebook",
    title: "เอกสารเผยแพร่สัตว์น้ำในป่าชายเลนคลองกาพวน จังหวัดระนอง",
    org: "สถานีวิจัยเพื่อการพัฒนาชายฝั่งอันดามัน คณะประมง มหาวิทยาลัยเกษตรศาสตร์",
    url: "https://www.facebook.com/share/18XLjRq4G1/",
    kind: "งานวิจัย",
    note: "แหล่งข้อมูลหลักของหมวดสัตว์น้ำคลองกาพวน: รายชื่อชนิดสัตว์ไม่มีกระดูกสันหลัง 53 ชนิด และปลา 58 ชนิด วิธีสำรวจและเก็บรักษาตัวอย่าง และผลกระทบของสึนามิ 2547 (ISBN 978-616-278-174-2)",
  },
];
