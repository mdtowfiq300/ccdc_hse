import streamlit as st
import pandas as pd

# Page config
st.set_page_config(page_title="POB Dashboard", layout="wide")

# Custom CSS for responsiveness
st.markdown("""
    <style>
    /* General heading style */
    h1 {
        text-align: center;
        color: #1f77b4;
        font-size: 48px; /* Default size for desktop */
    }

    /* Adjust heading font for smaller screens */
    @media (max-width: 768px) {
        h1 {
            font-size: 28px !important; /* Smaller size for mobile */
        }
    }

    /* Tab header formatting */
    .stTabs [role="tab"] {
        text-align: center;
        font-size: 22px;
        font-weight: bold;
        margin: auto;
    }
    </style>
""", unsafe_allow_html=True)

# Dashboard Title
st.markdown("<h1>👷 Personnel on Board (POB) Dashboard</h1>", unsafe_allow_html=True)

# Tabs
tab1, tab2, tab3 = st.tabs(["Day Shift", "Night Shift", "Emergency"])

with tab1:
    st.markdown("<h2 style='text-align: center;'>Day Shift Employees</h2>", unsafe_allow_html=True)
    data_day = {"Name": ["A", "B", "C"], "Position": ["Welder", "Helper", "Operator"]}
    st.table(pd.DataFrame(data_day))

with tab2:
    st.markdown("<h2 style='text-align: center;'>Night Shift Employees</h2>", unsafe_allow_html=True)
    data_night = {"Name": ["X", "Y"], "Position": ["Supervisor", "Fitter"]}
    st.table(pd.DataFrame(data_night))

with tab3:
    st.markdown("<h2 style='text-align: center;'>Emergency Contacts</h2>", unsafe_allow_html=True)
    col1, col2 = st.columns(2)
    with col1:
        st.write("**Day Shift Emergency Contact**")
        st.write("📞 +8801XXXXXXXXX")
    with col2:
        st.write("**Night Shift Emergency Contact**")
        st.write("📞 +8801YYYYYYYYY")
