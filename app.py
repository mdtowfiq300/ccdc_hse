import streamlit as st
import pandas as pd

# Google Sheet link (your one)
SHEET_URL = "https://docs.google.com/spreadsheets/d/1u9wPUX2eeBGJ8hQYhW7UM7DIq_ck2F7kn7TPQQH8tg4/export?format=csv&gid={}"

# GIDs for each sheet (find in URL after gid=...)
DAY_SHEET_ID = "0"     # Replace with actual gid for "day" sheet
NIGHT_SHEET_ID = "1436398814"  # Replace with gid for "night" sheet

@st.cache_data
def load_data():
    day_df = pd.read_csv(SHEET_URL.format(DAY_SHEET_ID))
    night_df = pd.read_csv(SHEET_URL.format(NIGHT_SHEET_ID))
    return day_df, night_df

st.title("🛠️ POB - Personnel On Board")

# Load data
day_df, night_df = load_data()

# Tabs for Day / Night shifts
tab1, tab2 = st.tabs(["☀️ Day Shift", "🌙 Night Shift"])

with tab1:
    st.subheader("Day Shift POB")
    search = st.text_input("🔍 Search (by Name / Designation / Nationality)", key="day_search")
    if search:
        filtered = day_df[
            day_df.apply(lambda row: search.lower() in row.astype(str).str.lower().to_string(), axis=1)
        ]
        st.dataframe(filtered, use_container_width=True)
    else:
        st.dataframe(day_df, use_container_width=True)

with tab2:
    st.subheader("Night Shift POB")
    search = st.text_input("🔍 Search (by Name / Designation / Nationality)", key="night_search")
    if search:
        filtered = night_df[
            night_df.apply(lambda row: search.lower() in row.astype(str).str.lower().to_string(), axis=1)
        ]
        st.dataframe(filtered, use_container_width=True)
    else:
        st.dataframe(night_df, use_container_width=True)

