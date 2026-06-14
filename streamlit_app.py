import streamlit as st
import requests
import os
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv("backend/.env")

# Page config
st.set_page_config(
    page_title="AI Content Summarizer",
    page_icon="✨",
    layout="wide"
)

# Styling
st.markdown("""
    <style>
    .main { max-width: 900px; }
    .stButton>button { width: 100%; }
    </style>
""", unsafe_allow_html=True)

st.title("✨ AI Content Summarizer")
st.write("Paste large text content and get AI-powered summaries instantly!")

# Initialize session state
if 'history' not in st.session_state:
    st.session_state.history = []

# Sidebar for history
with st.sidebar:
    st.header("📋 Summary History")
    if st.session_state.history:
        for i, item in enumerate(st.session_state.history):
            with st.expander(f"Summary {i+1} - {item['timestamp']}"):
                st.write(f"**Original:** {item['original'][:100]}...")
                st.write(f"**Summary:** {item['summary']}")
                st.write(f"**Reduction:** {item['reduction']}%")
    else:
        st.info("No history yet. Create your first summary!")

# Main content area
col1, col2 = st.columns([2, 1])

with col1:
    # Input textarea
    content = st.text_area(
        "Paste your content here:",
        height=250,
        placeholder="Enter the text you want to summarize..."
    )
    
    # Character count
    if content:
        char_count = len(content)
        st.caption(f"📊 Characters: {char_count:,}")
        if char_count > 20000:
            st.warning("⚠️ Content exceeds 20,000 characters. Please trim it down.")
    
    # Buttons
    col_btn1, col_btn2 = st.columns(2)
    
    with col_btn1:
        summarize_btn = st.button("📝 Summarize", use_container_width=True)
    
    with col_btn2:
        clear_btn = st.button("🗑️ Clear", use_container_width=True)
    
    if clear_btn:
        st.rerun()

with col2:
    st.info("""
    **How it works:**
    1. Paste your content
    2. Click "Summarize"
    3. Get AI-powered summary
    
    **Limits:**
    • Max 20,000 chars
    • Powered by Google Gemini
    """)

# Summary result
if summarize_btn and content:
    if len(content) > 20000:
        st.error("❌ Content too long! Limit: 20,000 characters")
    elif len(content.strip()) == 0:
        st.error("❌ Please enter some content to summarize")
    else:
        with st.spinner("🔄 Generating summary..."):
            try:
                # Call Gemini API directly
                from google import genai
                
                api_key = os.getenv("GEMINI_API_KEY")
                if not api_key:
                    st.error("❌ GEMINI_API_KEY not configured")
                else:
                    client = genai.Client(api_key=api_key)
                    
                    prompt = f"""You are an expert AI Content Summarizer.

Your task is to analyze the provided content and generate a high-quality summary.

Instructions:
- Preserve all important information.
- Remove repetition and unnecessary details.
- Maintain factual accuracy.
- Use simple and professional language.
- Keep the summary concise and readable.
- If the content contains key points, return them in bullet format.
- If the content is short, provide a brief summary.
- Do not add information that is not present in the content.

Content:
{content}

Generate the best possible summary."""
                    
                    response = client.models.generate_content(
                        model="gemini-2.0-flash-001",
                        contents=prompt,
                        config={"temperature": 0.2, "max_output_tokens": 450}
                    )
                    
                    summary = response.text.strip()
                    
                    if not summary:
                        st.error("❌ Failed to generate summary")
                    else:
                        # Display summary
                        st.success("✅ Summary Generated!")
                        
                        st.subheader("📌 Summary")
                        st.text_area("", value=summary, height=200, disabled=True)
                        
                        # Stats
                        original_len = len(content)
                        summary_len = len(summary)
                        reduction = round((1 - summary_len / original_len) * 100, 1)
                        
                        col_stat1, col_stat2, col_stat3 = st.columns(3)
                        with col_stat1:
                            st.metric("Original", f"{original_len:,} chars")
                        with col_stat2:
                            st.metric("Summary", f"{summary_len:,} chars")
                        with col_stat3:
                            st.metric("Reduction", f"{reduction}%")
                        
                        # Copy button
                        if st.button("📋 Copy Summary"):
                            st.success("✅ Copied to clipboard!")
                        
                        # Add to history
                        st.session_state.history.insert(0, {
                            "original": content[:100],
                            "summary": summary,
                            "timestamp": datetime.now().strftime("%H:%M:%S"),
                            "reduction": reduction
                        })
                        
                        # Keep history to last 10
                        st.session_state.history = st.session_state.history[:10]
                        
            except Exception as e:
                st.error(f"❌ Error: {str(e)}")

st.divider()
st.markdown("""
---
**About:** AI Content Summarizer powered by Google Gemini | Built with Streamlit
""")
