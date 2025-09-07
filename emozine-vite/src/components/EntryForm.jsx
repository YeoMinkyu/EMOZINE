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
        <div className="w-full min-h-screen flex justify-center my-20 px-4">
            <form className="w-full max-w-2xl space-y-4"
                onSubmit={onSubmit} aria-busy={loading || submitting}>
                <textarea
                    className="w-full text-base focus:outline-none placeholder:font-bold placeholder:text-xl p-3 resize-none"
                    ref={entryRef}
                    disabled={loading || submitting}
                    rows="6"
                    placeholder={`What's on your mind?`}
                    value={content}
                    onChange={onContentChange}
                />
                <EmojiSelector 
                        onEmojiChange={onEmojiChange}
                        emoji={emoji}
                        loading={loading}
                        submitting={submitting}
                />
                <div>
                    {error && <p className="error-msg" role="alert">{error}</p>}
                    <small className={`${invalidMsg ? "text-red-500" : "guide-msg"}`}>
                        ({contentLen} {contentLen === 1 ? "character" : "characters"})
                    </small>
                    <small className="guide-msg block">Spaces don't count toward minimum.</small>
                </div>
                <div className="flex w-full justify-end">
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
                </div>
            </form>
        </div>
    );
}

function EmojiSelector({ onEmojiChange, emoji, loading, submitting }) {
    return(
        <div className="flex max-w-2xl place-content-end">
            <select
                className="border rounded-md border-gray-300 p-1"
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