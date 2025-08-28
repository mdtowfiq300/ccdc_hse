import streamlit as st
import pandas as pd

st.set_page_config(page_title="POB Dashboard", layout="wide")
st.title("📋 Personnel On Board (POB)")

# ----------------------
# Google Sheet CSV export links
# ----------------------
DAY_SHEET_URL = "https://docs.google.com/spreadsheets/d/1u9wPUX2eeBGJ8hQYhW7UM7DIq_ck2F7kn7TPQQH8tg4/export?format=csv&gid=0"
NIGHT_SHEET_URL = "https://docs.google.com/spreadsheets/d/1u9wPUX2eeBGJ8hQYhW7UM7DIq_ck2F7kn7TPQQH8tg4/export?format=csv&gid=888211122"

@st.cache_data
def load_data():
    day_df = pd.read_csv(DAY_SHEET_URL)
    night_df = pd.read_csv(NIGHT_SHEET_URL)
    return day_df, night_df

day_df, night_df = load_data()

# ----------------------
# Tabs
# ----------------------
tab1, tab2 = st.tabs(["🌞 Day Shift", "🌙 Night Shift"])

with tab1:
    st.subheader("Day Shift Employees")
    search_day = st.text_input("Search Day Shift by Name / Designation / Nationality", key="search_day")
    if search_day:
        filtered_day = day_df[
            day_df.apply(lambda row: search_day.lower() in row.astype(str).str.lower().to_string(), axis=1)
        ]
        st.dataframe(filtered_day, use_container_width=True)
    else:
        st.dataframe(day_df, use_container_width=True)

with tab2:
    st.subheader("Night Shift Employees")
    search_night = st.text_input("Search Night Shift by Name / Designation / Nationality", key="search_night")
    if search_night:
        filtered_night = night_df[
            night_df.apply(lambda row: search_night.lower() in row.astype(str).str.lower().to_string(), axis=1)
        ]
        st.dataframe(filtered_night, use_container_width=True)
    else:
        st.dataframe(night_df, use_container_width=True)

# ----------------------
# Summary
# ----------------------
st.write("### Summary")
st.write(f"👷 Day Shift: {len(day_df)} personnel")
st.write(f"🌙 Night Shift: {len(night_df)} personnel")
st.write(f"📊 Total Onboard: {len(day_df) + len(night_df)}")
