import "./EntryForm.css";

export function EntryForm ({
    onSubmit, 
    onContentChange,
    onEmojiChange,
    onCancel,
    loading = false,
    submitting = false,
    content,
    error = "",
    guideMsg = "",
    emoji = "",
    invalidMsg = "",
    contentLen,
    entryRef = null,
}) {
    return (
        <form onSubmit={onSubmit} aria-busy={loading || submitting}>
                <textarea
                    ref={entryRef}
                    disabled={loading || submitting}
                    rows="6"
                    placeholder={`What's on your mind?`}
                    value={content}
                    onChange={onContentChange}
                />
                <br />
                {(error && <p className="error-msg" role="alert">{error}</p> )|| (guideMsg && <p className="guide-msg">{guideMsg}</p>)}
                <small className="guide-msg">Spaces don't count toward minimum.</small>
                <br />
                    <EmojiSelector 
                        onEmojiChange={onEmojiChange}
                        emoji={emoji}
                        loading={loading}
                        submitting={submitting}
                    />
                <br />
                <p className={`content-length ${invalidMsg ? "invalid" : ""}`}>
                    ({contentLen} {contentLen === 1 ? "character" : "characters"})
                </p>
                <button
                    disabled={loading || submitting || Boolean(invalidMsg)}
                    type="submit"
                >
                    {submitting ? `Saving...` : `Save Entry`}
                </button>
                <button
                    disabled={loading || submitting}
                    type="button"
                    onClick={onCancel}
                >
                    Cancel
                </button>
            </form>
    );
}

function EmojiSelector({ onEmojiChange, emoji, loading, submitting }) {
    return(
        <div className="emoji-selector">
             <label>Choose an emoji: </label>
            <select 
                disabled={loading || submitting}
                value={emoji} 
                onChange={onEmojiChange}
            >
                    <option value="" aria-label="None">😐 None</option>
                    <option value="😊" aria-label="Happy">😊 Happy</option>
                    <option value="😢" aria-label="Sad">😢 Sad</option>
                    <option value="😡" aria-label="Angry">😡 Angry</option>
                    <option value="😌" aria-label="Calm">😌 Calm</option>
            </select>
        </div>
    );
}