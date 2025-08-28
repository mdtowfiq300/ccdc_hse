import streamlit as st
import pandas as pd

# Page config
st.set_page_config(page_title="POB Dashboard", layout="wide")
st.markdown("<h1 style='text-align: center; color: #1f77b4;'>👷 Personnel On Board (POB)</h1>", unsafe_allow_html=True)

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
# Summary Section
# ----------------------
st.markdown("<h2 style='text-align: center; color: #ff6600;'>📊 Summary</h2>", unsafe_allow_html=True)

summary_html = f"""
<div style='display: flex; justify-content: center; gap: 50px; text-align: center;'>
    <div style='background-color: #e0f7fa; padding: 20px; border-radius: 10px; width: 200px; display: flex; flex-direction: column; justify-content: center; align-items: center; box-shadow: 2px 2px 10px rgba(0,0,0,0.1);'>
        <h3 style='margin: 0; font-size: 18px;'>🌞 Day Shift</h3>
        <h2 style='margin: 0; font-size: 32px;'>{len(day_df)}</h2>
    </div>
    <div style='background-color: #ffe0b2; padding: 20px; border-radius: 10px; width: 200px; display: flex; flex-direction: column; justify-content: center; align-items: center; box-shadow: 2px 2px 10px rgba(0,0,0,0.1);'>
        <h3 style='margin: 0; font-size: 18px;'>🌙 Night Shift</h3>
        <h2 style='margin: 0; font-size: 32px;'>{len(night_df)}</h2>
    </div>
    <div style='background-color: #d1c4e9; padding: 20px; border-radius: 10px; width: 200px; display: flex; flex-direction: column; justify-content: center; align-items: center; box-shadow: 2px 2px 10px rgba(0,0,0,0.1);'>
        <h3 style='margin: 0; font-size: 18px;'>📋 Total Onboard</h3>
        <h2 style='margin: 0; font-size: 32px;'>{len(day_df) + len(night_df)}</h2>
    </div>
</div>
"""
st.markdown(summary_html, unsafe_allow_html=True)

# ----------------------
# Tabs Section
# ----------------------
tabs = st.tabs(["🌞 Day Shift", "🌙 Night Shift", "🚨 Emergency"])

# ----------------------
# Day Shift Tab
# ----------------------
with tabs[0]:
    st.markdown("<h3 style='text-align: center; color: #0288d1;'>🌞 Day Shift Employees</h3>", unsafe_allow_html=True)
    search_day = st.text_input("", placeholder="Search by Name", key="search_day")
    filtered_day = day_df.copy()
    if search_day:
        filtered_day = day_df[day_df["Name"].str.contains(search_day, case=False, na=False)]

    st.markdown("<div style='display: flex; justify-content: center; margin-top: 10px;'>", unsafe_allow_html=True)
    st.dataframe(filtered_day, use_container_width=False, width=1200)
    st.markdown("</div>", unsafe_allow_html=True)

# ----------------------
# Night Shift Tab
# ----------------------
with tabs[1]:
    st.markdown("<h3 style='text-align: center; color: #f57c00;'>🌙 Night Shift Employees</h3>", unsafe_allow_html=True)
    search_night = st.text_input("", placeholder="Search by Name", key="search_night")
    filtered_night = night_df.copy()
    if search_night:
        filtered_night = night_df[night_df["Name"].str.contains(search_night, case=False, na=False)]

    st.markdown("<div style='display: flex; justify-content: center; margin-top: 10px;'>", unsafe_allow_html=True)
    st.dataframe(filtered_night, use_container_width=False, width=1200)
    st.markdown("</div>", unsafe_allow_html=True)

# ----------------------
# Emergency Tab
# ----------------------
with tabs[2]:
    st.markdown("<h3 style='text-align: center; color: red;'>🚨 Emergency Muster Attendance</h3>", unsafe_allow_html=True)
    st.write("Mark employees present at the muster point:")

    col_day, col_night = st.columns(2)
    attendance = {}

    # Day Shift
    col_day.markdown("### 🌞 Day Shift")
    for i, row in day_df.iterrows():
        name = row["Name"]
        attendance[name] = col_day.checkbox(name, key=f"day_emergency_{i}")

    # Night Shift
    col_night.markdown("### 🌙 Night Shift")
    for i, row in night_df.iterrows():
        name = row["Name"]
        attendance[name] = col_night.checkbox(name, key=f"night_emergency_{i}")

    # Submit button centered
    st.markdown("<div style='display: flex; justify-content: center; margin-top: 20px;'>", unsafe_allow_html=True)
    if st.button("Submit Muster Attendance"):
        muster_df = pd.DataFrame(list(attendance.items()), columns=["Name", "Present"])
        st.success("✅ Muster attendance recorded successfully!")
        st.dataframe(muster_df, use_container_width=True)
        muster_df.to_csv("muster_attendance.csv", index=False)
    st.markdown("</div>", unsafe_allow_html=True)
