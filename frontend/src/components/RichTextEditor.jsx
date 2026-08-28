import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Button from "./Button";
import Icon from "./Icon";
import {
  BoldOutlined,
  AlignTextLeftOutlined,
  AgendaOutlined,
  Link2AngularRightOutlined,
} from "@lineiconshq/free-icons";

export default function RichTextEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
  });

  function addLink() {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL", previousUrl || "");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  useEffect(() => {
    if (!editor || !value) return;
    const currentContent = editor.getJSON();
    if (JSON.stringify(currentContent) !== JSON.stringify(value)) {
      editor.commands.setContent(value, false);
    }
  }, [value, editor]);

  if (!editor) return null;

  const toolbarBtn = (isActive) =>
    `flex h-10 w-10 items-center justify-center rounded-md transition-colors focus-ring ${
      isActive ? "" : "hover:bg-paper-2"
    }`;

  return (
    <div
      className="overflow-hidden rounded-xl border"
      style={{
        borderColor: "var(--color-border)",
        backgroundColor: "var(--color-paper-3)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div
        className="flex flex-wrap items-center gap-2 border-b p-3"
        style={{
          borderColor: "var(--color-border)",
          backgroundColor: "var(--color-paper-2)",
        }}
      >
        <Button
          type="button"
          variant="ghost"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={toolbarBtn(editor.isActive("bold"))}
          style={editor.isActive("bold") ? { backgroundColor: "var(--color-accent-soft)", color: "var(--color-accent)" } : { color: "var(--color-ink)" }}
          aria-label="Bold"
        >
          <Icon icon={BoldOutlined} size={22} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`${toolbarBtn(editor.isActive("italic"))} w-auto px-3 text-lg font-bold`}
          style={editor.isActive("italic") ? { backgroundColor: "var(--color-accent-soft)", fontStyle: "italic", color: "var(--color-accent)" } : { fontStyle: "italic", color: "var(--color-ink)" }}
          aria-label="Italic"
        >
          I
        </Button>
        <Button
          type="button"
          variant="ghost"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`${toolbarBtn(editor.isActive("strike"))} w-auto px-3 text-lg font-bold line-through`}
          style={editor.isActive("strike") ? { backgroundColor: "var(--color-accent-soft)", color: "var(--color-accent)" } : { color: "var(--color-ink)" }}
          aria-label="Strikethrough"
        >
          S
        </Button>
        <Button
          type="button"
          variant="ghost"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`${toolbarBtn(editor.isActive("code"))} w-auto px-3 text-sm font-bold font-mono`}
          style={editor.isActive("code") ? { backgroundColor: "var(--color-accent-soft)", color: "var(--color-accent)" } : { color: "var(--color-ink)" }}
          aria-label="Code"
        >
          &lt;/&gt;
        </Button>

        <span className="mx-1 h-6 w-px" style={{ backgroundColor: "var(--color-border-strong)" }} />

        <Button
          type="button"
          variant="ghost"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`${toolbarBtn(editor.isActive("heading", { level: 1 }))} w-auto px-3 text-base font-bold`}
          style={editor.isActive("heading", { level: 1 }) ? { backgroundColor: "var(--color-accent-soft)", color: "var(--color-accent)" } : { color: "var(--color-ink)" }}
        >
          H1
        </Button>
        <Button
          type="button"
          variant="ghost"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`${toolbarBtn(editor.isActive("heading", { level: 2 }))} w-auto px-3 text-base font-bold`}
          style={editor.isActive("heading", { level: 2 }) ? { backgroundColor: "var(--color-accent-soft)", color: "var(--color-accent)" } : { color: "var(--color-ink)" }}
        >
          H2
        </Button>
        <Button
          type="button"
          variant="ghost"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`${toolbarBtn(editor.isActive("heading", { level: 3 }))} w-auto px-3 text-base font-bold`}
          style={editor.isActive("heading", { level: 3 }) ? { backgroundColor: "var(--color-accent-soft)", color: "var(--color-accent)" } : { color: "var(--color-ink)" }}
        >
          H3
        </Button>

        <span className="mx-1 h-6 w-px" style={{ backgroundColor: "var(--color-border-strong)" }} />

        <Button
          type="button"
          variant="ghost"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={toolbarBtn(editor.isActive("bulletList"))}
          style={editor.isActive("bulletList") ? { backgroundColor: "var(--color-accent-soft)", color: "var(--color-accent)" } : { color: "var(--color-ink)" }}
          aria-label="Bullet list"
        >
          <Icon icon={AlignTextLeftOutlined} size={22} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={toolbarBtn(editor.isActive("orderedList"))}
          style={editor.isActive("orderedList") ? { backgroundColor: "var(--color-accent-soft)", color: "var(--color-accent)" } : { color: "var(--color-ink)" }}
          aria-label="Numbered list"
        >
          <Icon icon={AgendaOutlined} size={22} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`${toolbarBtn(editor.isActive("blockquote"))} w-auto px-3 text-lg font-bold`}
          style={editor.isActive("blockquote") ? { backgroundColor: "var(--color-accent-soft)", color: "var(--color-accent)" } : { color: "var(--color-ink)" }}
          aria-label="Blockquote"
        >
          &ldquo;&rdquo;
        </Button>
        <Button
          type="button"
          variant="ghost"
          onMouseDown={(e) => e.preventDefault()}
          onClick={addLink}
          className={toolbarBtn(editor.isActive("link"))}
          style={editor.isActive("link") ? { backgroundColor: "var(--color-accent-soft)", color: "var(--color-accent)" } : { color: "var(--color-ink)" }}
          aria-label="Add link"
        >
          <Icon icon={Link2AngularRightOutlined} size={22} />
        </Button>

        <span className="mx-1 h-6 w-px" style={{ backgroundColor: "var(--color-border-strong)" }} />

        <Button
          type="button"
          variant="ghost"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className={`${toolbarBtn(false)} w-auto px-3 text-lg font-bold`}
          style={{ color: "var(--color-ink)" }}
          aria-label="Horizontal Rule"
        >
          &mdash;
        </Button>

        <span className="flex-1" />

        <Button
          type="button"
          variant="ghost"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className={`${toolbarBtn(false)} text-lg`}
          style={{ color: "var(--color-ink)" }}
          aria-label="Undo"
        >
          &#8634;
        </Button>
        <Button
          type="button"
          variant="ghost"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className={`${toolbarBtn(false)} text-lg`}
          style={{ color: "var(--color-ink)" }}
          aria-label="Redo"
        >
          &#8635;
        </Button>
      </div>

      <div 
        className="p-5 min-h-[300px] cursor-text" 
        style={{ userSelect: "text", WebkitUserSelect: "text" }}
        onClick={() => {
          if (!editor.isFocused) {
            editor.commands.focus();
          }
        }}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
