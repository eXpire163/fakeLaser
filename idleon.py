import json
from typing import List, Dict, Tuple
from tabulate import tabulate

def load_idleon_data(filename: str = 'idleon.json') -> Dict:
    """Load the IdleOn save file."""
    with open(filename, 'r', encoding='utf-8') as f:
        return json.load(f)

def find_all_wands(data: Dict) -> List[Tuple[str, int, Dict]]:
    """
    Find all wands across all characters' inventories.

    Returns:
        List of tuples: (character_id, slot_number, wand_stats)
    """
    wands = []

    # Iterate through all possible character slots (0-9)
    for char_id in range(10):
        inventory_key = f'InventoryOrder_{char_id}'
        stats_key = f'IMm_{char_id}'

        # Check if this character exists
        if inventory_key not in data or stats_key not in data:
            continue

        inventory_order = data[inventory_key]

        # Parse the stats JSON string
        try:
            stats_dict = json.loads(data[stats_key])
        except (json.JSONDecodeError, TypeError):
            continue

        # Iterate through inventory slots
        for slot_num, item_id in enumerate(inventory_order):
            # Check if it's an Arcane wand specifically (EquipmentWandsArc0)
            if item_id == 'EquipmentWandsArc0':
                # Get stats for this slot if they exist
                slot_key = str(slot_num)
                if slot_key in stats_dict:
                    item_stats = stats_dict[slot_key]
                    # Check if it has Weapon_Power
                    if 'Weapon_Power' in item_stats:
                        wands.append((
                            f'Character_{char_id}',
                            slot_num,
                            item_id,
                            item_stats
                        ))

    return wands

def get_top_wands(wands: List[Tuple[str, int, Dict]], top_n: int = 5) -> List[Dict]:
    """
    Get the top N wands by weapon power.

    Args:
        wands: List of wand tuples from find_all_wands
        top_n: Number of top wands to return

    Returns:
        List of dictionaries with wand information
    """
    wand_info = []

    for char_id, slot_num, item_id, stats in wands:
        weapon_power = stats.get('Weapon_Power', 0)
        uq1_val = stats.get('UQ1val', 0)
        uq2_val = stats.get('UQ2val', 0)
        uq1_txt = stats.get('UQ1txt', 'Unknown')
        uq2_txt = stats.get('UQ2txt', 'Unknown')

        # Calculate bucket (page) and position within bucket
        # Inventory is split into buckets of 16 items
        bucket_num = slot_num // 16
        position_in_bucket = slot_num % 16

        wand_info.append({
            'Character': char_id,
            'Bucket': bucket_num,
            'Position': position_in_bucket,
            'Slot': slot_num,
            'Item Type': item_id,
            'Weapon Power': weapon_power,
            'Unique Stat 1': f'{uq1_val}% ({uq1_txt})',
            'Unique Stat 2': f'{uq2_val}% ({uq2_txt})',
            'WIS': stats.get('WIS', 0),
            'Upgrades Used': abs(stats.get('Upgrade_Slots_Left', 0))
        })

    # Sort by weapon power (descending)
    wand_info.sort(key=lambda x: x['Weapon Power'], reverse=True)

    # Return top N
    return wand_info[:top_n]

def display_wand_table(wands: List[Dict]):
    """Display wands in a formatted table."""
    if not wands:
        print("No wands found in inventory!")
        return

    # Prepare table data
    headers = [
        'Rank',
        'Character',
        'Bucket\n(Page)',
        'Position\n(0-15)',
        'Total\nSlot',
        'Weapon\nPower',
        'Unique Stat 1',
        'Unique Stat 2',
        'WIS',
        'Upgrades'
    ]

    table_data = []
    for rank, wand in enumerate(wands, start=1):
        table_data.append([
            rank,
            wand['Character'],
            wand['Bucket'],
            wand['Position'],
            wand['Slot'],
            wand['Weapon Power'],
            wand['Unique Stat 1'],
            wand['Unique Stat 2'],
            wand['WIS'],
            wand['Upgrades Used']
        ])

    # Print the table
    print("\n" + "="*140)
    print("TOP 5 ARCANE WANDS (EquipmentWandsArc0) BY WEAPON POWER".center(140))
    print("="*140)
    print(tabulate(table_data, headers=headers, tablefmt='grid'))
    print("="*140 + "\n")

def main():
    """Main function to analyze wands."""
    print("Loading IdleOn save file...")

    try:
        data = load_idleon_data('idleon.json')
        print("✓ Save file loaded successfully!")

        print("\nSearching for Arcane wands (EquipmentWandsArc0) across all characters...")
        all_wands = find_all_wands(data)
        print(f"✓ Found {len(all_wands)} Arcane wands total!")

        print("\nAnalyzing weapon power...")
        top_wands = get_top_wands(all_wands, top_n=5)

        display_wand_table(top_wands)

    except FileNotFoundError:
        print("❌ Error: idleon.json file not found!")
        print("   Make sure the file is in the same directory as this script.")
    except json.JSONDecodeError as e:
        print(f"❌ Error: Invalid JSON format - {e}")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

if __name__ == '__main__':
    main()
