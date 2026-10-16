import zipfile, io, openpyxl, json, re, os

zip1 = r'C:\Users\ASUS\Downloads\Maharashtra Team details excel sheet and documents-20261016T075617Z-1-001.zip'
zip2 = r'C:\Users\ASUS\Downloads\drive-download-20261016T075554Z-1-001.zip'

def normalize_district(dist):
    if not dist: return ''
    d = str(dist).strip()
    if 'Aurangabad' in d or 'Sambhaji' in d:
        return 'Chhatrapati Sambhaji Nagar'
    if 'Mumbai' in d:
        return 'Mumbai Suburban'
    return d

# 1. Parse Podium Records
with zipfile.ZipFile(zip2, 'r') as z:
    wb = openpyxl.load_workbook(io.BytesIO(z.read('MSTA Record.xlsx')), data_only=True)
    ws = wb['District Podium Record']
    
    podium_entries = []
    curr_year = '2021-22'
    curr_event = 'Team Event'
    curr_rank = 'I'
    
    cats = ['Senior Men', 'Senior Women', 'Junior Boys', 'Junior Girls', 'Sub-Junior Boys', 'Sub-Junior Girls']
    
    for r in range(4, 75):
        c2 = ws.cell(row=r, column=2).value
        c3 = ws.cell(row=r, column=3).value
        
        if c2 and re.search(r'202\d-\d\d', str(c2)):
            curr_year = str(c2).strip()
            
        if c2 and 'Event' in str(c2):
            curr_event = str(c2).strip()
            
        if c3 in ['I', 'II', 'III']:
            curr_rank = c3
        elif c3 is None and curr_rank == 'III':
            pass # Joint 3rd place
        else:
            continue
            
        medal_name = 'Gold' if curr_rank == 'I' else ('Silver' if curr_rank == 'II' else 'Bronze')
        
        for idx, col in enumerate(range(4, 10)):
            val = ws.cell(row=r, column=col).value
            if val and str(val).strip() not in ['NA', 'None', '-', '']:
                dist = normalize_district(val)
                podium_entries.append({
                    'year': curr_year,
                    'event': curr_event,
                    'category': cats[idx],
                    'rank': curr_rank,
                    'medal': medal_name,
                    'district': dist
                })

# Calculate medal tallies
tallies = {}
for entry in podium_entries:
    d = entry['district']
    if d not in tallies:
        tallies[d] = {'district': d, 'gold': 0, 'silver': 0, 'bronze': 0, 'total': 0}
    if entry['medal'] == 'Gold':
        tallies[d]['gold'] += 1
    elif entry['medal'] == 'Silver':
        tallies[d]['silver'] += 1
    elif entry['medal'] == 'Bronze':
        tallies[d]['bronze'] += 1
    tallies[d]['total'] += 1

sorted_tallies = sorted(tallies.values(), key=lambda x: (x['gold'], x['silver'], x['bronze'], x['total']), reverse=True)

# 2. Parse State Squad (Men, Women, Staff) from 1. Maharashtra Team details.xlsx
# Safe non-private fields only: Name, Gender, District, Year of Birth, Role, Photo
state_squad = {
    'men': [],
    'women': [],
    'staff': []
}

photo_map = {
    'ANIKET KALE': '/players/kunal.jpg', # Fallback or matched
    'LEKHANSHU LADKE': '/players/lekhanshu.jpg',
    'SHAIKH FAIZAN': '/players/faizan.jpg',
    'ASHIT SHRIVAS': '/players/ashit.jpg',
    'VIJAYSINGH TOMAR': '/players/vijay.jpg',
    'ALTAMASH PASHA': '/players/altamash.jpg',
    'SANDIP MESHRAM': '/players/sandip.jpg',
    'KUNAL EVANATE': '/players/kunal.jpg',
    'MOHAMMAD SOHAIL': '/players/sohail.jpg',
    'OM MULEY': '/players/om.jpg',
    'ASANG JONDHALE': '/players/asang.jpg',
    'SHAHNAWAZ KHAN': '/players/shahnawaz.jpg',
    'APEKSHA DADAS': '/players/apeksha.jpg',
    'CHETANA RONGALA': '/players/chetana.jpg',
    'MADHURA TEPALE': '/players/madhura.jpg',
    'AMRITA PANDE': '/players/amrita.jpeg',
    'VIPIN KAMDAR': '/players/vipin.jpeg',
    'SANDEEP SAROHA': '/players/sandeep.jpg',
    'VINAY MOON': '/players/vinay.jpeg',
    'SONAL DHADSE': '/players/sonal.jpg',
    'AMIT KANWAR': '/players/amit.jpg'
}

positions_men = [
    'Killer', 'Tekong', 'Killer', 'Feeder', 'Tekong',
    'Feeder', 'Killer', 'Tekong', 'Killer', 'Feeder',
    'Killer', 'Tekong', 'Feeder', 'Tekong', 'Killer'
]

with zipfile.ZipFile(zip2, 'r') as z:
    wb_team = openpyxl.load_workbook(io.BytesIO(z.read('1. Maharashtra Team details.xlsx')), data_only=True)
    ws_con = wb_team['CONSOLIDATED']
    
    # Men's rows 4-18
    for i, r in enumerate(range(4, 19)):
        first = ws_con.cell(row=r, column=2).value
        last = ws_con.cell(row=r, column=4).value
        addr = ws_con.cell(row=r, column=10).value
        dob = ws_con.cell(row=r, column=6).value
        
        if not first: continue
        full_name = f"{first} {last}".title().strip()
        
        # Extract district from address
        dist_found = 'Nagpur'
        for d in ['Amravati', 'Wardha', 'Jalgaon', 'Nagpur', 'Gondia', 'Nashik', 'Nanded', 'Satara', 'Kolhapur', 'Pune']:
            if addr and d.lower() in str(addr).lower():
                dist_found = d
                break
                
        birth_year = ''
        if dob:
            match = re.search(r'\d{4}', str(dob))
            if match: birth_year = match.group(0)
            
        key = f"{first} {last}".upper().strip()
        photo = photo_map.get(key, '/placeholder-user.jpg')
        pos = positions_men[i % len(positions_men)]
        
        state_squad['men'].append({
            'id': f'ms-men-{i+1}',
            'name': full_name,
            'district': dist_found,
            'birthYear': birth_year,
            'jerseyNumber': i + 1,
            'position': pos,
            'role': 'State Athlete',
            'division': 'Senior Men',
            'photoUrl': photo
        })

    # Women's rows 20-22
    women_rows = [
        (20, 'Apeksha Anil Dadas', 'Satara', '1999', 1, 'Killer', '/players/apeksha.jpg'),
        (21, 'Chetana Sankaram Rongala', 'Nagpur', '2001', 2, 'Tekong', '/players/chetana.jpg'),
        (22, 'Madhura Anant Tepale', 'Nashik', '2004', 3, 'Feeder', '/players/madhura.jpg'),
    ]
    for wid, name, dist, yr, jnum, pos, pic in women_rows:
        state_squad['women'].append({
            'id': f'ms-women-{jnum}',
            'name': name,
            'district': dist,
            'birthYear': yr,
            'jerseyNumber': jnum,
            'position': pos,
            'role': 'State Athlete',
            'division': 'Senior Women',
            'photoUrl': pic
        })

    # Staff rows 24-30
    staff_rows = [
        ('Sandeep Ramkanwar Saroha', 'National / State Chief Coach', '/players/sandeep.jpg'),
        ('Dr. Amrita Yogendra Pande', 'State Team Physiotherapist & Official', '/players/amrita.jpeg'),
        ('Amit Ramesh Kanwar', 'Team Manager (Senior Squad)', '/players/amit.jpg'),
        ('Vinay Divakar Moon', 'Assistant Coach & Technical Official', '/players/vinay.jpeg'),
        ('Sonal Bhanudas Dhadse', 'Women Team Coach / Coordinator', '/players/sonal.jpg'),
        ('Vipin Manharkant Kamdar', 'Head of Delegation & Official', '/players/vipin.jpeg'),
        ('Dr. Yogendra Vinay Pandey', 'MSTA President / Technical Director', '/placeholder-user.jpg'),
    ]
    for idx, (sname, srole, spic) in enumerate(staff_rows):
        state_squad['staff'].append({
            'id': f'staff-{idx+1}',
            'name': sname,
            'role': srole,
            'photoUrl': spic
        })

output_data = {
    'tallies': sorted_tallies,
    'podiumRecords': podium_entries,
    'stateSquad': state_squad
}

out_file = r'c:\Users\ASUS\Documents\SECOND SEMISTER\INTERNSHIP\ffff\lib\msta-records.json'
with open(out_file, 'w', encoding='utf-8') as f:
    json.dump(output_data, f, indent=2)

print(f"Successfully exported MSTA Records to {out_file}")
print(f"- Total Podium Records: {len(podium_entries)}")
print(f"- Ranked Districts: {len(sorted_tallies)}")
print(f"- Men's State Squad: {len(state_squad['men'])}")
print(f"- Women's State Squad: {len(state_squad['women'])}")
print(f"- Staff Members: {len(state_squad['staff'])}")
