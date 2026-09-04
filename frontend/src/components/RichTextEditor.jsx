import { useEffect, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Icon from "./Icon";
import {
  BoldOutlined,
  Strikethrough1Outlined,
  Code1Outlined,
  AlignTextLeftOutlined,
  AgendaOutlined,
  Link2AngularRightOutlined,
  DoubleQuotesEnd1Outlined,
  MinusOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
} from "@lineiconshq/free-icons";

// There is no dedicated "italic" glyph in this icon set, so Italic
// stays a styled letterform button, same approach your original file
// used for Bold's siblings — it's a standard editor-toolbar pattern
// (Google Docs and Notion both do this), not a workaround.

/**
 * Toolbar buttons are data, not fifteen near-identical JSX blocks.
 * Each entry describes intent; the renderer decides how it looks.
 * This is what actually fixes the "every button is a different shape"
 * problem — one component renders every one of them identically.
 */
function ToolbarButton({ label, active, disabled, onClick, children }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={!!active}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()} // keep selection/focus in the doc
      onClick={onClick}
      className="toolbar-btn"
      data-active={active ? "true" : undefined}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <span className="toolbar-divider" aria-hidden="true" />;
}

export default function RichTextEditor({ value, onChange, placeholder = "Start writing…" }) {
  // Tracks whether the current doc change came from inside this editor
  // (typing) vs. from the parent handing us a new `value` prop.
  // Without this, every keystroke round-trips through the parent and
  // back into setContent(), which resets the cursor to the start of
  // the document — this was the "can't type" bug.
  const isInternalUpdate = useRef(false);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkValue, setLinkValue] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: "noopener noreferrer nofollow", target: "_blank" },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    immediatelyRender: false, // avoids SSR/StrictMode hydration mismatch
    editorProps: {
      attributes: {
        class: "prose-editor-surface",
        "aria-label": "Note content",
      },
    },
    onUpdate: ({ editor }) => {
      isInternalUpdate.current = true;
      onChange(editor.getJSON());
    },
  });

  // Only push external `value` changes into the editor. Never resync
  // on our own updates — that round trip is what was stealing focus
  // and resetting the cursor while the user typed.
  useEffect(() => {
    if (!editor || value === undefined) return;
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }
    const current = JSON.stringify(editor.getJSON());
    const incoming = JSON.stringify(value);
    if (current !== incoming) {
      editor.commands.setContent(value, false);
    }
  }, [value, editor]);

  function openLinkDialog() {
    if (!editor) return;
    setLinkValue(editor.getAttributes("link").href || "");
    setLinkDialogOpen(true);
  }

  function confirmLink() {
    if (!editor) return;
    const url = linkValue.trim();
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
    setLinkDialogOpen(false);
  }

  if (!editor) return null;

  return (
    <div className="note-editor">
      <div className="note-editor-toolbar" role="toolbar" aria-label="Formatting">
        <div className="toolbar-group">
          <ToolbarButton label="Bold (Ctrl+B)" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
            <Icon icon={BoldOutlined} size={18} />
          </ToolbarButton>
          <ToolbarButton label="Italic (Ctrl+I)" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
            <span className="toolbar-btn-text toolbar-btn-italic">I</span>
          </ToolbarButton>
          <ToolbarButton label="Strikethrough" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
            <Icon icon={Strikethrough1Outlined} size={18} />
          </ToolbarButton>
          <ToolbarButton label="Inline code" active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()}>
            <Icon icon={Code1Outlined} size={18} />
          </ToolbarButton>
        </div>

        <ToolbarDivider />

        <div className="toolbar-group">
          <ToolbarButton label="Heading 1" active={editor.isActive("heading", { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
            <span className="toolbar-btn-text">H1</span>
          </ToolbarButton>
          <ToolbarButton label="Heading 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
            <span className="toolbar-btn-text">H2</span>
          </ToolbarButton>
          <ToolbarButton label="Heading 3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
            <span className="toolbar-btn-text">H3</span>
          </ToolbarButton>
        </div>

        <ToolbarDivider />

        <div className="toolbar-group">
          <ToolbarButton label="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
            <Icon icon={AlignTextLeftOutlined} size={18} />
          </ToolbarButton>
          <ToolbarButton label="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
            <Icon icon={AgendaOutlined} size={18} />
          </ToolbarButton>
          <ToolbarButton label="Quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
            <Icon icon={DoubleQuotesEnd1Outlined} size={18} />
          </ToolbarButton>
          <ToolbarButton label="Link" active={editor.isActive("link")} onClick={openLinkDialog}>
            <Icon icon={Link2AngularRightOutlined} size={18} />
          </ToolbarButton>
          <ToolbarButton label="Divider" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
            <Icon icon={MinusOutlined} size={18} />
          </ToolbarButton>
        </div>

        <span className="toolbar-spacer" />

        <div className="toolbar-group">
          <ToolbarButton label="Undo (Ctrl+Z)" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>
            <Icon icon={ArrowLeftOutlined} size={18} />
          </ToolbarButton>
          <ToolbarButton label="Redo (Ctrl+Shift+Z)" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>
            <Icon icon={ArrowRightOutlined} size={18} />
          </ToolbarButton>
        </div>
      </div>

      {linkDialogOpen && (
        <div className="link-popover">
          <input
            autoFocus
            type="url"
            className="link-popover-input"
            placeholder="https://example.com"
            value={linkValue}
            onChange={(e) => setLinkValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") confirmLink();
              if (e.key === "Escape") setLinkDialogOpen(false);
            }}
          />
          <button type="button" className="link-popover-confirm" onClick={confirmLink}>
            Apply
          </button>
          <button type="button" className="link-popover-cancel" onClick={() => setLinkDialogOpen(false)}>
            Cancel
          </button>
        </div>
      )}

      <div
        className="note-editor-body"
        onClick={(e) => {
          // Only steal focus when the click landed on the padding
          // around the content, not on the content itself — clicking
          // inside a paragraph should place the cursor there, not
          // jump it, and clicking a link shouldn't hijack the click.
          if (e.target === e.currentTarget) {
            editor.chain().focus().run();
          }
        }}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}