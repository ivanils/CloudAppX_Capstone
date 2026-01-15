import json
import pandas as pd
import os

# Definimos la ruta al archivo JSON
# Usamos una ruta relativa para que funcione en cualquier ordenador
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, 'data', 'mock_data.json')

def load_data():
    # Load the tickets from the JSON file and convert to a Pandas DataFrame. Like connecting to a DB or Jira.
    try:
        with open(DATA_FILE, 'r') as main_data_file:
            data = json.load(main_data_file)
        return pd.DataFrame(data)
    except FileNotFoundError:
        print(f"ERROR: Could not find the file at {DATA_FILE}")
        return pd.DataFrame()

def calculate_priority(data_file):
    # Apply the Weighted Scoring Model algorithm to calculate priority scores.
    """
    Aplica el Algoritmo de Priorización Ponderada (Weighted Scoring Model).
    Esta es la 'Contribución Científica' de tu proyecto.
    """
    # Defining weights based on Assessment 2 investigation.
    # We set the Business Value weighter than Technical Severity, (0.6 and 0.4 respectively).
    w_business = 0.6
    w_severity = 0.4
    
    # Algorithm formula:
    # Priority = ((Business Value * weight) + (Severity * weight)) / (Effort / 100)
    # Dividing the Effort by 100 to normalize it and avoid excessive penalty for long tasks.
    # Adding +1 to the denominator to avoid division by zero if effort is 0.
    
    data_file['score'] = (
        (data_file['business_value'] * w_business) + 
        (data_file['severity'] * w_severity)
    ) / ((data_file['effort_hours'] / 100) + 1)
    
    # Rounding the score to 2 decimals for better readability
    data_file['score'] = data_file['score'].round(2)
    
    return data_file

def get_prioritized_tickets():
    # Main function to be called by the API.
    # 1. Load data
    # 2. Calculate priorities
    # 3. Sort and return the result
    
    # 1.
    df = load_data()
    
    if df.empty:
        return []

    # 2.
    df_calculated = calculate_priority(df)
    
    # 3. Higher score goes first (Ascending=False)
    df_sorted = df_calculated.sort_values(by='score', ascending=False)
    
    # Converting back to dictionary so the API can send it as JSON
    return df_sorted.to_dict(orient='records')

# Test block to run this file directly (only in terminal)
if __name__ == "__main__":
    # This allows testing this file without running the server
    print("🚑 Testing the priority algorithm...")
    tickets = get_prioritized_tickets()
    
    print(f"· {len(tickets)} tickets loaded.")

    print("Top 5 tickets by priority score (must be fixed ASAP):")
    for i, t in enumerate(tickets[:5]):
        print(f"{i+1}. [Score: {t['score']}]-[ID: {t['id']}] -> {t['module']}: {t['title']} (Val: {t['business_value']}, Sev: {t['severity']}, EffortHours: {t['effort_hours']})")
    
    print("TOP 5 tickets less prio (can wait):")
    for i, t in enumerate(tickets[-5:]):
        print(f"{i+1}. [Score: {t['score']}] {t['title']}")