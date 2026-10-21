"""
สคริปต์ดึงรายชื่อชนิดสัตว์น้ำจากเอกสารเผยแพร่ของสถานีวิจัยเพื่อการพัฒนาชายฝั่งอันดามัน
ไฟล์ต้นทางเป็น PDF 205 หน้า (ISBN 978-616-278-174-2)

ใช้ pypdf ดึงข้อความ แล้วแยกตารางรายชื่อชนิด (วงศ์ -> ชื่อวิทยาศาสตร์ -> ชื่ออังกฤษ -> ชื่อไทย)
ผลลัพธ์เขียนเป็น data/kampuan-species.json ให้เว็บอ่านต่อ

วิธีใช้: python3 scripts/extract-kampuan.py <path-to-pdf>
"""
import re
import json
import sys

def norm(s: str) -> str:
    s = re.sub(r'([\u0E00-\u0E7F])\s+([\u0E00-\u0E7F])', r'\1\2', s)
    return re.sub(r'\s+', ' ', s).strip()

FAM = re.compile(r'^[A-Z][a-z]+(idae|dae|ae)$')

def parse(lines, a, b):
    rows, fam = [], None
    for i in range(a, b):
        s = norm(lines[i])
        if not s:
            continue
        if s.startswith(('วงศ์', 'รายชื่อ', 'สภาพแวดล้อม')):
            continue
        if s in ('ปลากระดูกแข็ง', 'สัตว์ไม่มีกระดูกสันหลัง'):
            continue
        if FAM.match(s):
            fam = s
            continue
        m = re.match(r'^([A-Z][a-z]+)\s+([a-z\-]{2,})\s+(.*)$', s)
        if not m:
            continue
        sci = f"{m.group(1)} {m.group(2)}"
        rest = m.group(3)
        en = re.match(r'^(.*?)\s*([\u0E00-\u0E7F].*)$', rest)
        if en:
            english = re.sub(r'\s+', ' ', en.group(1)).strip()
            thpart = en.group(2)
        else:
            english, thpart = rest.strip(), ''
        th = re.match(r'^([\u0E00-\u0E7F][\u0E00-\u0E7F\s]*?)(?=\s*[A-Z0-9]|\s*X|$)', thpart)
        thai = re.sub(r'\s+', '', th.group(1)) if th else ''
        rows.append({'family': fam, 'sci': sci, 'en': english, 'th': thai})
    d = {}
    for r in rows:
        d.setdefault(r['sci'], r)
    return list(d.values())

def main():
    import pypdf
    path = sys.argv[1] if len(sys.argv) > 1 else 'gd.bin'
    r = pypdf.PdfReader(path)
    lines = []
    for pg in r.pages:
        lines.extend((pg.extract_text() or '').split('\n'))

    def find(pred):
        return [i for i, l in enumerate(lines) if pred(norm(l))]

    inv_start = find(lambda s: s.startswith('รายชื่อสัตว์ไม่มีกระดู'))[0]
    fish_start = find(lambda s: s.startswith('รายชื่อปลาที่'))[0]
    biblio = find(lambda s: s == 'บรรณานุกรม')
    ref = biblio[0] if biblio else len(lines)

    inv = parse(lines, inv_start, fish_start)
    fish = parse(lines, fish_start, ref)
    out = {
        'source': 'สถานีวิจัยเพื่อการพัฒนาชายฝั่งอันดามัน คณะประมง มหาวิทยาลัยเกษตรศาสตร์',
        'isbn': '978-616-278-174-2',
        'invertebrates': inv,
        'fish': fish,
        'invertebrateCount': len(inv),
        'fishCount': len(fish),
    }
    with open('data/kampuan-species.json', 'w', encoding='utf-8') as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
    print(f"invertebrates={len(inv)} fish={len(fish)} -> data/kampuan-species.json")

if __name__ == '__main__':
    main()
