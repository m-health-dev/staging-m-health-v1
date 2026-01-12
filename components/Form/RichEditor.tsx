"use client";

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import ListItem from "@tiptap/extension-list-item";
import {
  Bold,
  Italic,
  UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  List,
  ListOrdered,
  Quote,
  Code,
  Redo2,
  Undo2,
  LinkIcon,
  ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import "../../app/css/rich-editor.css";
import { DialogUploadImage } from "./RichEditorImageUpload";
import { DialogRichLink } from "./RichEditorLink";
import LoadingComponent from "../utility/loading-component";

interface RichEditorProps {
  value?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export const RichEditor = React.forwardRef<HTMLDivElement, RichEditorProps>(
  ({ value = "", onChange, className }, ref) => {
    const [openDialogImage, setOpenDialogImage] = React.useState(false);
    const [openDialogLink, setOpenDialogLink] = React.useState(false);

    const [isReady, setIsReady] = React.useState(false);

    const [url, setUrl] = React.useState("");

    const editor = useEditor({
      extensions: [
        StarterKit.configure({
          heading: {
            levels: [1, 2, 3, 4],
          },
          bulletList: {
            keepMarks: true,
            keepAttributes: false,
          },
          orderedList: {
            keepMarks: true,
            keepAttributes: false,
          },
        }),
        ListItem,
        Underline,
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
        Link.configure({
          openOnClick: false,
          autolink: true,
        }),
        Image.configure({
          allowBase64: true,
        }),
      ],
      content: value,
      immediatelyRender: false,
      onCreate: () => {
        setIsReady(true);
      },
      onUpdate: ({ editor }) => {
        if (onChange) {
          onChange(editor.getHTML());
        }
      },
    });

    const addLink = () => {
      setOpenDialogLink(true);
    };

    const handleUploadedLink = (url: string) => {
      editor
        ?.chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    };

    const addImage = () => {
      setOpenDialogImage(true);
    };

    const handleUploadedImage = (url: string) => {
      editor?.chain().focus().setImage({ src: url }).run();
    };

    if (!editor || !isReady) {
      return (
        <div className="w-full h-[300px] flex items-center justify-center border rounded-2xl">
          <LoadingComponent />
        </div>
      );
    }

    const toolbarButtonClass =
      "h-9 w-9 p-0 hover:bg-muted data-[state=on]:bg-primary data-[state=on]:text-primary-foreground";

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col border border-input rounded-2xl shadow bg-background",
          className
        )}
      >
        {/* Toolbar */}
        <div className="sticky top-28 z-99">
          <div className="border-b border-input bg-muted p-2 flex flex-wrap gap-1">
            {/* Headings */}
            <div className="flex gap-1 border-r border-input pr-2">
              <Button
                size="sm"
                type="button"
                variant="ghost"
                className={toolbarButtonClass}
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
                data-state={
                  editor.isActive("heading", { level: 1 }) ? "on" : "off"
                }
                title="Heading 1"
              >
                <Heading1 className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                type="button"
                variant="ghost"
                className={toolbarButtonClass}
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                data-state={
                  editor.isActive("heading", { level: 2 }) ? "on" : "off"
                }
                title="Heading 2"
              >
                <Heading2 className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                type="button"
                variant="ghost"
                className={toolbarButtonClass}
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
                data-state={
                  editor.isActive("heading", { level: 3 }) ? "on" : "off"
                }
                title="Heading 3"
              >
                <Heading3 className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                type="button"
                variant="ghost"
                className={toolbarButtonClass}
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 4 }).run()
                }
                data-state={
                  editor.isActive("heading", { level: 4 }) ? "on" : "off"
                }
                title="Heading 4"
              >
                <Heading4 className="h-4 w-4" />
              </Button>
            </div>

            {/* Text Formatting */}
            <div className="flex gap-1 border-r border-input pr-2">
              <Button
                size="sm"
                type="button"
                variant="ghost"
                className={toolbarButtonClass}
                onClick={() => editor.chain().focus().toggleBold().run()}
                data-state={editor.isActive("bold") ? "on" : "off"}
                title="Bold"
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                type="button"
                variant="ghost"
                className={toolbarButtonClass}
                onClick={() => editor.chain().focus().toggleItalic().run()}
                data-state={editor.isActive("italic") ? "on" : "off"}
                title="Italic"
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                type="button"
                variant="ghost"
                className={toolbarButtonClass}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                data-state={editor.isActive("underline") ? "on" : "off"}
                title="Underline"
              >
                <UnderlineIcon className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                type="button"
                variant="ghost"
                className={toolbarButtonClass}
                onClick={() => editor.chain().focus().toggleStrike().run()}
                data-state={editor.isActive("strike") ? "on" : "off"}
                title="Strike Through"
              >
                <Strikethrough className="h-4 w-4" />
              </Button>
            </div>

            {/* Alignment */}
            <div className="flex gap-1 border-r border-input pr-2">
              <Button
                size="sm"
                type="button"
                variant="ghost"
                className={toolbarButtonClass}
                onClick={() =>
                  editor.chain().focus().setTextAlign("left").run()
                }
                data-state={
                  editor.isActive({ textAlign: "left" }) ? "on" : "off"
                }
                title="Align Left"
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                type="button"
                variant="ghost"
                className={toolbarButtonClass}
                onClick={() =>
                  editor.chain().focus().setTextAlign("center").run()
                }
                data-state={
                  editor.isActive({ textAlign: "center" }) ? "on" : "off"
                }
                title="Align Center"
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                type="button"
                variant="ghost"
                className={toolbarButtonClass}
                onClick={() =>
                  editor.chain().focus().setTextAlign("right").run()
                }
                data-state={
                  editor.isActive({ textAlign: "right" }) ? "on" : "off"
                }
                title="Align Right"
              >
                <AlignRight className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                type="button"
                variant="ghost"
                className={toolbarButtonClass}
                onClick={() =>
                  editor.chain().focus().setTextAlign("justify").run()
                }
                data-state={
                  editor.isActive({ textAlign: "justify" }) ? "on" : "off"
                }
                title="Justify"
              >
                <AlignJustify className="h-4 w-4" />
              </Button>
            </div>

            {/* Lists */}
            <div className="flex gap-1 border-r border-input pr-2">
              <Button
                size="sm"
                type="button"
                variant="ghost"
                className={toolbarButtonClass}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                data-state={editor.isActive("bulletList") ? "on" : "off"}
                title="Bullet List"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                type="button"
                variant="ghost"
                className={toolbarButtonClass}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                data-state={editor.isActive("orderedList") ? "on" : "off"}
                title="Ordered List"
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
            </div>

            {/* Block Elements */}
            <div className="flex gap-1 border-r border-input pr-2">
              <Button
                size="sm"
                type="button"
                variant="ghost"
                className={toolbarButtonClass}
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                data-state={editor.isActive("blockquote") ? "on" : "off"}
                title="Quote"
              >
                <Quote className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                type="button"
                variant="ghost"
                className={toolbarButtonClass}
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                data-state={editor.isActive("codeBlock") ? "on" : "off"}
                title="Code Block"
              >
                <Code className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                type="button"
                variant="ghost"
                className={toolbarButtonClass}
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                title="Horizontal Rule"
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>

            {/* Links & Media */}
            <div className="flex gap-1 border-r border-input pr-2">
              <Button
                size="sm"
                type="button"
                variant="ghost"
                className={toolbarButtonClass}
                onClick={addLink}
                data-state={editor.isActive("link") ? "on" : "off"}
                title="Add Link"
              >
                <LinkIcon className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                type="button"
                variant="ghost"
                className={toolbarButtonClass}
                onClick={addImage}
                title="Add Image"
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
            </div>

            {/* History */}
            <div className="flex gap-1">
              <Button
                size="sm"
                type="button"
                variant="ghost"
                className={toolbarButtonClass}
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                title="Undo"
              >
                <Undo2 className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                type="button"
                variant="ghost"
                className={toolbarButtonClass}
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                title="Redo"
              >
                <Redo2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Editor Content */}
        <EditorContent
          editor={editor}
          className="rich-editor-content flex-1 overflow-auto bg-white"
        />

        <DialogRichLink
          open={openDialogLink}
          onClose={() => setOpenDialogLink(false)}
          onSubmit={handleUploadedLink}
          url={url}
          setUrl={setUrl}
        />

        <DialogUploadImage
          open={openDialogImage}
          onClose={() => setOpenDialogImage(false)}
          onUploaded={handleUploadedImage}
        />
      </div>
    );
  }
);

RichEditor.displayName = "RichEditor";
