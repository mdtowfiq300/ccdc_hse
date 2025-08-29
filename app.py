import streamlit as st
import pandas as pd

# Page config
st.set_page_config(page_title="POB Dashboard", layout="wide")
st.markdown("<h1 style='text-align: center; color: #1f77b4; font-size:50px;'>👷 Personnel On Board (POB)</h1>", unsafe_allow_html=True)

# ----------------------
# Google Sheet CSV export links
# ----------------------
DAY_SHEET_URL = "https://docs.google.com/spreadsheets/d/1u9wPUX2eeBGJ8hQYhW7UM7DIq_ck2F7kn7TPQQH8tg4/export?format=csv&gid=0"
NIGHT_SHEET_URL = "https://docs.google.com/spreadsheets/d/1u9wPUX2eeBGJ8hQYhW7UM7DIq_ck2F7kn7TPQQH8tg4/export?format=csv&gid=888211122"
VEHICLE_SHEET_URL = "https://docs.google.com/spreadsheets/d/1u9wPUX2eeBGJ8hQYhW7UM7DIq_ck2F7kn7TPQQH8tg4/export?format=csv&gid=561590588"
VACATION_SHEET_URL = "https://docs.google.com/spreadsheets/d/1u9wPUX2eeBGJ8hQYhW7UM7DIq_ck2F7kn7TPQQH8tg4/export?format=csv&gid=1108595442"

@st.cache_data
def load_data():
    day_df = pd.read_csv(DAY_SHEET_URL, dtype={"Phone": str})
    night_df = pd.read_csv(NIGHT_SHEET_URL, dtype={"Phone": str})
    vehicle_df = pd.read_csv(VEHICLE_SHEET_URL, dtype={"Phone": str})
    vacation_df = pd.read_csv(VACATION_SHEET_URL, dtype=str)

    # Fix Rest Date formatting
    vacation_df["Rest Date"] = pd.to_datetime(vacation_df["Rest Date"], errors="coerce")

    # Dynamically calculate Rest Days
    today = pd.Timestamp.today().normalize()
    vacation_df["Rest Days"] = (today - vacation_df["Rest Date"]).dt.days

    # Optional: format Rest Date to M/D/Y for display
    vacation_df["Rest Date"] = vacation_df["Rest Date"].dt.strftime("%m/%d/%Y")

    return day_df, night_df, vehicle_df, vacation_df

day_df, night_df, vehicle_df, vacation_df = load_data()

# ----------------------
# Summary Section
# ----------------------
st.markdown("<h2 style='text-align: center; color: #ff6600; font-size:40px;'>📊 Summary</h2>", unsafe_allow_html=True)

summary_html = f"""
<div style='display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; text-align: center; margin-top:20px;'>
    <div style='background-color: #e0f7fa; padding: 15px; border-radius: 15px; width: 40%; max-width: 220px; flex: 1 1 150px; display: flex; flex-direction: column; justify-content: center; align-items: center; box-shadow: 2px 2px 12px rgba(0,0,0,0.1);'>
        <h3 style='margin: 0; font-size: 18px;'>🌞 Day Shift</h3>
        <h2 style='margin: 0; font-size: 32px;'>{len(day_df)}</h2>
    </div>
    <div style='background-color: #ffe0b2; padding: 15px; border-radius: 15px; width: 40%; max-width: 220px; flex: 1 1 150px; display: flex; flex-direction: column; justify-content: center; align-items: center; box-shadow: 2px 2px 12px rgba(0,0,0,0.1);'>
        <h3 style='margin: 0; font-size: 18px;'>🌙 Night Shift</h3>
        <h2 style='margin: 0; font-size: 32px;'>{len(night_df)}</h2>
    </div>
    <div style='background-color: #d1c4e9; padding: 15px; border-radius: 15px; width: 40%; max-width: 220px; flex: 1 1 150px; display: flex; flex-direction: column; justify-content: center; align-items: center; box-shadow: 2px 2px 12px rgba(0,0,0,0.1);'>
        <h3 style='margin: 0; font-size: 18px;'>📋 Total Onboard</h3>
        <h2 style='margin: 0; font-size: 32px;'>{len(day_df) + len(night_df)}</h2>
    </div>
</div>
"""
st.markdown(summary_html, unsafe_allow_html=True)

# ----------------------
# Extra vertical space before tabs
# ----------------------
st.markdown("<div style='margin-top: 40px;'></div>", unsafe_allow_html=True)

# ----------------------
# Tabs Section
# ----------------------
tabs = st.tabs(["🌞 Day Shift", "🌙 Night Shift", "🚨 Emergency", "🚗 Vehicle", "🏖️ Vacation"])

# Center and style the tabs
st.markdown("""
    <style>
    div[data-baseweb="tab-list"] {
        display: flex;
        justify-content: center;
    }
    div[data-baseweb="tab"] {
        font-size: 20px !important;
        font-weight: 600 !important;
    }
    </style>
""", unsafe_allow_html=True)

# ----------------------
# Day Shift Tab
# ----------------------
with tabs[0]:
    st.markdown("<h2 style='text-align: center; color: #0288d1; font-size:32px;'>🌞 Day Shift Employees</h2>", unsafe_allow_html=True)
    day_agg = day_df['Designation'].value_counts()
    agg_html = "<div style='display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin-top: 10px; margin-bottom: 15px;'>"
    for desig, count in day_agg.items():
        agg_html += f"<div style='background-color:#b2ebf2; padding:8px 12px; border-radius:10px; font-weight:600;'>{count} {desig}</div>"
    agg_html += "</div>"
    st.markdown(agg_html, unsafe_allow_html=True)

    search_day = st.text_input("", placeholder="Search by Name", key="search_day")
    filtered_day = day_df.copy()
    if search_day:
        filtered_day = day_df[day_df["Name"].str.contains(search_day, case=False, na=False)]
    st.dataframe(filtered_day, use_container_width=True)

# ----------------------
# Night Shift Tab
# ----------------------
with tabs[1]:
    st.markdown("<h2 style='text-align: center; color: #f57c00; font-size:32px;'>🌙 Night Shift Employees</h2>", unsafe_allow_html=True)
    night_agg = night_df['Designation'].value_counts()
    agg_html = "<div style='display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin-top: 10px; margin-bottom: 15px;'>"
    for desig, count in night_agg.items():
        agg_html += f"<div style='background-color:#ffe0b2; padding:8px 12px; border-radius:10px; font-weight:600;'>{count} {desig}</div>"
    agg_html += "</div>"
    st.markdown(agg_html, unsafe_allow_html=True)

    search_night = st.text_input("", placeholder="Search by Name", key="search_night")
    filtered_night = night_df.copy()
    if search_night:
        filtered_night = night_df[night_df["Name"].str.contains(search_night, case=False, na=False)]
    st.dataframe(filtered_night, use_container_width=True)

# ----------------------
# Emergency Tab
# ----------------------
with tabs[2]:
    st.markdown("<h2 style='text-align: center; color: red; font-size:32px;'>🚨 Emergency Muster Attendance</h2>", unsafe_allow_html=True)
    st.write("Mark employees present at the muster point:")

    col_day, col_night = st.columns([1, 1], gap="small")
    attendance = {}

    col_day.markdown("<div style='background-color:#e0f7fa; padding:10px; border-radius:12px; text-align:center;'><b>🌞 Day Shift</b></div>", unsafe_allow_html=True)
    for i, row in day_df.iterrows():
        name = row["Name"]
        attendance[name] = col_day.checkbox(name, key=f"day_emergency_{i}")

    col_night.markdown("<div style='background-color:#fff3e0; padding:10px; border-radius:12px; text-align:center;'><b>🌙 Night Shift</b></div>", unsafe_allow_html=True)
    for i, row in night_df.iterrows():
        name = row["Name"]
        attendance[name] = col_night.checkbox(name, key=f"night_emergency_{i}")

    if st.button("Submit Muster Attendance"):
        muster_df = pd.DataFrame(list(attendance.items()), columns=["Name", "Present"])
        st.success("✅ Muster attendance recorded successfully!")
        st.dataframe(muster_df, use_container_width=True)
        muster_df.to_csv("muster_attendance.csv", index=False)

# ----------------------
# Vehicle Tab
# ----------------------
with tabs[3]:
    st.markdown("<h2 style='text-align: center; color: #00796b; font-size:32px;'>🚗 Vehicle Information</h2>", unsafe_allow_html=True)
    search_vehicle = st.text_input("", placeholder="Search by Name or Vehicle Number", key="search_vehicle")
    filtered_vehicle = vehicle_df.copy()
    if search_vehicle:
        filtered_vehicle = vehicle_df[
            vehicle_df["Name"].str.contains(search_vehicle, case=False, na=False) |
            vehicle_df["Vehicle Number"].str.contains(search_vehicle, case=False, na=False)
        ]
    st.dataframe(filtered_vehicle, use_container_width=True)

# ----------------------

# Vacation Tab
# ----------------------
with tabs[4]:
    st.markdown("<h2 style='text-align: center; color: #6a1b9a; font-size:32px;'>🏖️ Vacation List</h2>", unsafe_allow_html=True)
    search_vacation = st.text_input("", placeholder="Search by Name or Nationality", key="search_vacation")
    
    # Sort vacation_df by Designation
    vacation_df_sorted = vacation_df.sort_values(by="Designation", ignore_index=True)
    
    filtered_vacation = vacation_df_sorted.copy()
    if search_vacation:
        filtered_vacation = vacation_df_sorted[
            vacation_df_sorted["Name"].str.contains(search_vacation, case=False, na=False) |
            vacation_df_sorted["Nationality"].str.contains(search_vacation, case=False, na=False)
        ]
    st.dataframe(filtered_vacation, use_container_width=True)
