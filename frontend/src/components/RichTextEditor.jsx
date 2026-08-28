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
    `flex h-8 w-8 items-center justify-center rounded-md transition-colors focus-ring ${
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
        className="flex flex-wrap items-center gap-1 border-b p-2"
        style={{
          borderColor: "var(--color-border)",
          backgroundColor: "var(--color-paper-2)",
        }}
      >
        <Button
          type="button"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={toolbarBtn(editor.isActive("bold"))}
          style={
            editor.isActive("bold")
              ? { backgroundColor: "var(--color-accent-soft)" }
              : undefined
          }
          aria-label="Bold"
        >
          <Icon icon={BoldOutlined} size={18} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`${toolbarBtn(editor.isActive("italic"))} w-auto px-2 text-sm font-medium`}
          style={
            editor.isActive("italic")
              ? { backgroundColor: "var(--color-accent-soft)", fontStyle: "italic" }
              : { fontStyle: "italic" }
          }
          aria-label="Italic"
        >
          I
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`${toolbarBtn(editor.isActive("heading", { level: 2 }))} w-auto px-2 text-xs font-semibold`}
          style={
            editor.isActive("heading", { level: 2 })
              ? { backgroundColor: "var(--color-accent-soft)" }
              : undefined
          }
          aria-label="Heading"
        >
          H2
        </Button>
        <span className="mx-1 h-5 w-px" style={{ backgroundColor: "var(--color-border)" }} />
        <Button
          type="button"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={toolbarBtn(editor.isActive("bulletList"))}
          style={
            editor.isActive("bulletList")
              ? { backgroundColor: "var(--color-accent-soft)" }
              : undefined
          }
          aria-label="Bullet list"
        >
          <Icon icon={AlignTextLeftOutlined} size={18} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={toolbarBtn(editor.isActive("orderedList"))}
          style={
            editor.isActive("orderedList")
              ? { backgroundColor: "var(--color-accent-soft)" }
              : undefined
          }
          aria-label="Numbered list"
        >
          <Icon icon={AgendaOutlined} size={18} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={addLink}
          className={toolbarBtn(editor.isActive("link"))}
          style={
            editor.isActive("link")
              ? { backgroundColor: "var(--color-accent-soft)" }
              : undefined
          }
          aria-label="Add link"
        >
          <Icon icon={Link2AngularRightOutlined} size={18} />
        </Button>
      </div>

      <div className="p-5 min-h-[300px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
