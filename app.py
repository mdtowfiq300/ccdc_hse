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
# Summary Section (Formatted like second code)
# ----------------------
st.markdown("<h2 style='text-align: center; color: #ff6600;'>📊 Summary</h2>", unsafe_allow_html=True)

summary_html = f"""
<div style='display: flex; justify-content: center; gap: 50px; text-align: center;'>
    <div style='background-color: #e0f7fa; padding: 20px; border-radius: 10px; width: 180px;'>
        <h3>🌞 Day Shift</h3>
        <h2>{len(day_df)}</h2>
    </div>
    <div style='background-color: #ffe0b2; padding: 20px; border-radius: 10px; width: 180px;'>
        <h3>🌙 Night Shift</h3>
        <h2>{len(night_df)}</h2>
    </div>
    <div style='background-color: #d1c4e9; padding: 20px; border-radius: 10px; width: 180px;'>
        <h3>📋 Total Onboard</h3>
        <h2>{len(day_df) + len(night_df)}</h2>
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
    st.markdown("<h3 style='text-align: center;'>Day Shift Employees</h3>", unsafe_allow_html=True)
    search_day = st.text_input("Search by Name", key="search_day")
    filtered_day = day_df.copy()
    if search_day:
        filtered_day = day_df[day_df["Name"].str.contains(search_day, case=False, na=False)]
    
    # Center table
    st.markdown("<div style='display: flex; justify-content: center;'>", unsafe_allow_html=True)
    st.dataframe(filtered_day, use_container_width=False, width=900)
    st.markdown("</div>", unsafe_allow_html=True)

# ----------------------
# Night Shift Tab
# ----------------------
with tabs[1]:
    st.markdown("<h3 style='text-align: center;'>Night Shift Employees</h3>", unsafe_allow_html=True)
    search_night = st.text_input("Search by Name", key="search_night")
    filtered_night = night_df.copy()
    if search_night:
        filtered_night = night_df[night_df["Name"].str.contains(search_night, case=False, na=False)]
    
    # Center table
    st.markdown("<div style='display: flex; justify-content: center;'>", unsafe_allow_html=True)
    st.dataframe(filtered_night, use_container_width=False, width=1500)
    st.markdown("</div>", unsafe_allow_html=True)

# ----------------------
# Emergency Tab
# ----------------------
with tabs[2]:
    st.markdown("<h3 style='text-align: center; color: red;'>🚨 Emergency Muster Attendance</h3>", unsafe_allow_html=True)
    st.write("Mark employees present at the muster point:")

    emergency_df = pd.concat([day_df, night_df], ignore_index=True)
    
    # Display checkboxes in 2 columns
    col1, col2 = st.columns(2)
    attendance = {}
    for i, row in emergency_df.iterrows():
        name = row["Name"]
        if i % 2 == 0:
            attendance[name] = col1.checkbox(name, key=f"emergency_{i}")
        else:
            attendance[name] = col2.checkbox(name, key=f"emergency_{i}")

    if st.button("Submit Muster Attendance"):
        muster_df = pd.DataFrame(list(attendance.items()), columns=["Name", "Present"])
        st.success("✅ Muster attendance recorded successfully!")
        st.dataframe(muster_df, use_container_width=True)
        muster_df.to_csv("muster_attendance.csv", index=False)
