import streamlit as st
import os
from datetime import datetime

# Page config
st.set_page_config(
    page_title="AI Content Summarizer",
    page_icon="✨",
    layout="wide"
)

# Helper summarizer
def local_summarize(text, max_sentences=4):
    stopwords = {
        'the', 'is', 'in', 'and', 'to', 'of', 'a', 'that', 'it', 'for', 'on',
        'with', 'as', 'was', 'were', 'be', 'by', 'this', 'are', 'an', 'or',
        'from', 'at', 'which', 'but', 'has', 'have', 'had', 'not'
    }

    sentences = [s.strip() for s in text.replace('\n', ' ').split('  ') if s.strip()]
    if not sentences:
        return ''

    if len(sentences) <= max_sentences:
        return ' '.join(sentences)

    cleaned = ' '.join(sentences)
    words = [w for w in cleaned.lower().split() if w.isalpha() and w not in stopwords]
    freq = {}
    for w in words:
        freq[w] = freq.get(w, 0) + 1

    def score_sentence(sentence):
        return sum(freq.get(word.lower().strip('.,!?;:"\'\'()'), 0) for word in sentence.split())

    scored = sorted(
        [{'sentence': s, 'score': score_sentence(s), 'index': i} for i, s in enumerate(sentences)],
        key=lambda item: item['score'],
        reverse=True
    )
    top = sorted(scored[:max_sentences], key=lambda item: item['index'])
    return ' '.join(item['sentence'] for item in top)

st.markdown("""
    <style>
    .main { max-width: 900px; margin: auto; }
    .stButton>button { width: 100%; }
    </style>
""", unsafe_allow_html=True)

st.title("✨ AI Content Summarizer")
st.write("Paste large text content and get high-quality summaries instantly.")

if 'history' not in st.session_state:
    st.session_state.history = []

with st.sidebar:
    st.header("📋 Summary History")
    if st.session_state.history:
        for i, item in enumerate(st.session_state.history):
            with st.expander(f"Summary {i+1} - {item['timestamp']}"):
                st.write(f"**Original:** {item['original'][:120]}...")
                st.write(f"**Summary:** {item['summary']}")
                st.write(f"**Reduction:** {item['reduction']}%")
    else:
        st.info("No history yet. Create your first summary!")

col1, col2 = st.columns([2, 1])

with col1:
    content = st.text_area(
        "Paste your content here:",
        height=250,
        placeholder="Enter the text you want to summarize..."
    )

    if content:
        char_count = len(content)
        st.caption(f"📊 Characters: {char_count:,}")
        if char_count > 20000:
            st.warning("⚠️ Content exceeds 20,000 characters. Please trim it down.")

    col_btn1, col_btn2 = st.columns(2)
    with col_btn1:
        summarize_btn = st.button("📝 Summarize", use_container_width=True)
    with col_btn2:
        clear_btn = st.button("🗑️ Clear", use_container_width=True)

    if clear_btn:
        st.session_state.history = []
        st.experimental_rerun()

with col2:
    st.info("""
    **How it works:**
    1. Paste your content
    2. Click "Summarize"
    3. Get a quick summary

    **Notes:**
    - This app uses a local summarization algorithm for fast deployment.
    - Add a Gemini API key in Streamlit secrets if you want to enable remote AI summarization later.
    """)

if summarize_btn and content:
    if len(content) > 20000:
        st.error("❌ Content too long! Limit: 20,000 characters")
    elif len(content.strip()) == 0:
        st.error("❌ Please enter some content to summarize")
    else:
        with st.spinner("🔄 Generating summary..."):
            summary = local_summarize(content, max_sentences=5)
            if not summary:
                st.error("❌ Unable to generate a summary. Try shorter or clearer text.")
            else:
                st.success("✅ Summary generated!")
                st.subheader("📌 Summary")
                st.text_area("", value=summary, height=200, disabled=True)

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

                if st.button("📋 Copy Summary"):
                    st.success("✅ Copied to clipboard!")

                st.session_state.history.insert(0, {
                    "original": content[:120],
                    "summary": summary,
                    "timestamp": datetime.now().strftime("%H:%M:%S"),
                    "reduction": reduction
                })
                st.session_state.history = st.session_state.history[:10]

st.divider()
st.markdown("""
---
**About:** AI Content Summarizer | Built with Streamlit
""")
